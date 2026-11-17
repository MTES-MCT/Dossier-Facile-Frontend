#!/usr/bin/env bash
# Records a release on a branch: adds a "Release <tag>" commit on top of the
# branch, whose content is exactly the tagged commit.
#
# Usage: update-release-branch.sh <branch> <tag>
# Requires GITHUB_REPOSITORY and a GitHub token (GH_TOKEN) with write access to
# the contents of the repository.
# Optional: CREATE_FROM=<other branch>  create <branch> from it when missing
#           DRY_RUN=true                stop before writing anything
#
# The commit has two parents, the previous head of the branch and the tagged
# commit: the branch never needs a force push, and `git log --first-parent`
# shows one commit per release. It is created through the GitHub API, which
# signs it, so the branch can keep requiring signed commits.
set -euo pipefail

branch=${1:?Usage: $0 <branch> <tag>}
tag=${2:?Usage: $0 <branch> <tag>}
repo=${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}
dry_run=${DRY_RUN:-false}

fail() {
  # Rendered as an annotation by GitHub Actions, plain text elsewhere
  echo "::error::$*" >&2
  exit 1
}

summary() {
  echo "$*"
  if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
    echo "$*" >> "$GITHUB_STEP_SUMMARY"
  fi
}

# Prints the head of a branch, or nothing when the branch does not exist
branch_head() {
  local out
  if out=$(gh api "repos/$repo/git/ref/heads/$1" --jq .object.sha 2>&1); then
    echo "$out"
  elif [[ "$out" != *"HTTP 404"* ]]; then
    fail "Could not read the branch '$1': $out"
  fi
}

# Fully qualified, so that a branch with the same name cannot be picked instead
tagged=$(gh api "repos/$repo/commits/refs/tags/$tag" --jq '"\(.sha) \(.commit.tree.sha)"') \
  || fail "Could not resolve the tag '$tag': $tagged"
read -r tag_sha tag_tree <<< "$tagged"

head_sha=$(branch_head "$branch")
if [[ -z "$head_sha" ]]; then
  if [[ -z "${CREATE_FROM:-}" ]]; then
    fail "The branch '$branch' does not exist"
  fi
  head_sha=$(branch_head "$CREATE_FROM")
  if [[ -z "$head_sha" ]]; then
    fail "The branch '$CREATE_FROM' does not exist, cannot create '$branch' from it"
  fi
  if [[ "$dry_run" == "true" ]]; then
    echo "Dry run: would create '$branch' from '$CREATE_FROM' (${head_sha:0:9})"
  else
    gh api "repos/$repo/git/refs" -f ref="refs/heads/$branch" -f sha="$head_sha" --silent
    echo "Created '$branch' from '$CREATE_FROM' (${head_sha:0:9})"
  fi
fi

# Nothing to do when the branch already holds this release (job run twice)
head_tree=$(gh api "repos/$repo/git/commits/$head_sha" --jq .tree.sha)
if [[ "$head_tree" == "$tag_tree" ]]; then
  position=$(gh api "repos/$repo/compare/$tag_sha...$head_sha" --jq .status)
  if [[ "$position" == "ahead" || "$position" == "identical" ]]; then
    summary "\`$branch\` already holds \`$tag\`, nothing to do"
    exit 0
  fi
fi

if [[ "$dry_run" == "true" ]]; then
  echo "Dry run: would add 'Release $tag' to '$branch' (tree ${tag_tree:0:9}, parents ${head_sha:0:9} and ${tag_sha:0:9})"
  exit 0
fi

# No author nor committer: this is what makes GitHub sign the commit
commit=$(gh api "repos/$repo/git/commits" \
  -f message="Release $tag" -f tree="$tag_tree" \
  -f "parents[]=$head_sha" -f "parents[]=$tag_sha" --jq .sha)

verified=$(gh api "repos/$repo/git/commits/$commit" --jq .verification.verified)
if [[ "$verified" != "true" ]]; then
  fail "GitHub did not sign the commit ${commit:0:9}: '$branch' is left untouched"
fi

# The new commit is a child of the head: a plain fast-forward, never forced
if ! out=$(gh api -X PATCH "repos/$repo/git/refs/heads/$branch" -f sha="$commit" -F force=false 2>&1); then
  echo "$out" >&2
  echo "To record the release by hand, as an admin:" >&2
  echo "  git fetch origin && git push origin \"\$(git commit-tree -S '$tag^{tree}' -p origin/$branch -p '$tag' -m 'Release $tag')\":refs/heads/$branch" >&2
  fail "Could not move '$branch' to the release commit ${commit:0:9}"
fi

summary "\`$branch\` now holds \`$tag\` (release commit \`${commit:0:9}\`)"
