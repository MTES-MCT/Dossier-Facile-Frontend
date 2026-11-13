#!/usr/bin/env bash
# Checks that a pushed tag is a valid release tag, before anything is published.
#
# Usage: validate-release-tag.sh <tag>
# Requires GITHUB_REPOSITORY and a GitHub token (GH_TOKEN) in the environment,
# and a full clone (every branch and tag) checked out on the tagged commit.
#
# Checks, in order:
#   1. the tag is vX.Y.Z or vX.Y.Z-rcN
#   2. the tagged commit belongs to develop or to a hotfix/* branch
#   3. the version declared in the source tree is X.Y.Z
#   4. no GitHub release exists for the tag yet
#   5. the CI of the tagged commit is green (runs still in progress are waited for)
#
# Outputs, written to $GITHUB_OUTPUT: prerelease, previous_tag.
set -euo pipefail

tag=${1:?Usage: $0 <tag>}
repo=${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ci_timeout=${CI_TIMEOUT:-1800}
poll_interval=${POLL_INTERVAL:-30}

fail() {
  # Rendered as an annotation by GitHub Actions, plain text elsewhere
  echo "::error::$*" >&2
  exit 1
}

# 1. Format. A rejected tag stays on the remote: it has to be deleted by hand.
if [[ ! "$tag" =~ ^v([0-9]+\.[0-9]+\.[0-9]+)(-rc[0-9]+)?$ ]]; then
  fail "'$tag' is not a release tag: expected vX.Y.Z or vX.Y.Z-rcN, with a lowercase v. Delete it (git push origin :refs/tags/$tag) and push a well-formed one."
fi
version=${BASH_REMATCH[1]}
prerelease=false
if [[ -n "${BASH_REMATCH[2]:-}" ]]; then
  prerelease=true
fi

sha=$(git rev-parse --verify --quiet "refs/tags/${tag}^{commit}") \
  || fail "Tag '$tag' was not found in the clone"
if [[ "$(git rev-parse HEAD)" != "$sha" ]]; then
  fail "The clone is not checked out on '$tag'"
fi

# 2. Branch
branches=$(git branch -r --contains "$sha" --format='%(refname:short)' \
  --list 'origin/develop' 'origin/hotfix/*')
if [[ -z "$branches" ]]; then
  fail "The commit tagged '$tag' (${sha:0:9}) belongs neither to develop nor to a hotfix/* branch"
fi

# 3. Version
declared=$(bash "$script_dir/read-version.sh")
if [[ "$declared" != "$version" ]]; then
  fail "'$tag' does not match the version declared in the source tree ($declared): commit the version bump first, then tag that commit"
fi

# 4. Release
if url=$(gh api "repos/$repo/releases/tags/$tag" --jq .html_url 2>&1); then
  fail "A GitHub release already exists for '$tag': $url"
elif [[ "$url" != *"HTTP 404"* ]]; then
  fail "Could not check whether a release exists for '$tag': $url"
fi

# 5. CI. Only the runs triggered by a push or a pull request say something about
# the commit itself: scheduled and manual runs (e2e, deployments) only borrow its
# sha. The runs of this workflow are left out, the current one included.
own_workflow_id=""
if [[ -n "${GITHUB_RUN_ID:-}" ]]; then
  own_workflow_id=$(gh api "repos/$repo/actions/runs/$GITHUB_RUN_ID" --jq .workflow_id)
fi

# One line per workflow, for its latest run: name, status, conclusion, url
ci_runs() {
  gh api "repos/$repo/actions/runs?head_sha=$sha&per_page=100" \
    | jq -r --arg own "$own_workflow_id" '
        [.workflow_runs[]
          | select(.event == "push" or .event == "pull_request")
          | select((.workflow_id | tostring) != $own)]
        | group_by(.workflow_id)
        | map(max_by(.created_at))
        | .[]
        | [.name, .status, (.conclusion // "-"), .html_url]
        | @tsv'
}

while true; do
  runs=$(ci_runs)
  failed=$(awk -F'\t' 'NF && $2 == "completed" && $3 != "success" && $3 != "skipped" && $3 != "neutral" { print "  " $1 " (" $3 "): " $4 }' <<< "$runs")
  pending=$(awk -F'\t' 'NF && $2 != "completed" { print "  " $1 " (" $2 ")" }' <<< "$runs")

  if [[ -n "$failed" ]]; then
    fail "The CI of ${sha:0:9} is not green:"$'\n'"$failed"
  fi
  if [[ -z "$pending" ]]; then
    break
  fi
  if (( SECONDS >= ci_timeout )); then
    fail "The CI of ${sha:0:9} is still running after ${ci_timeout}s:"$'\n'"$pending"
  fi
  echo "Waiting for the CI of ${sha:0:9} (${SECONDS}s):"
  echo "$pending"
  sleep "$poll_interval"
done

if [[ -z "$runs" ]]; then
  echo "::warning::No CI run found for ${sha:0:9}: nothing to check"
fi

# Start of the release notes: the highest stable version below this one. Older
# tags are not all well-formed (V3.5.15, vv3.6.0), hence the tolerant prefix.
previous_tag=$(git tag --list | awk -v current="$version" '
  function rank(v,   parts) { split(v, parts, "."); return parts[1] * 1000000 + parts[2] * 1000 + parts[3] }
  /^[vV.]+[0-9]+\.[0-9]+\.[0-9]+$/ {
    v = $0
    sub(/^[vV.]+/, "", v)
    if (rank(v) < rank(current) && rank(v) >= best) { best = rank(v); found = $0 }
  }
  END { print found }')

{
  echo "prerelease=$prerelease"
  echo "previous_tag=$previous_tag"
} >> "${GITHUB_OUTPUT:-/dev/stdout}"

echo "'$tag' is valid: commit ${sha:0:9} on ${branches//$'\n'/, }, version $declared, notes since ${previous_tag:-the first commit}"
