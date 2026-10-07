#!/usr/bin/env bash
# Deploys one commit of this repository to a Scalingo app and waits for the result.
#
# Usage: scalingo-deploy.sh <app> <region> <commit-sha>
# Requires SCALINGO_API_TOKEN in the environment.
#
# The commit is deployed from its GitHub archive, so every app deployed with the
# same sha gets exactly the same code, whatever happens to the branch meanwhile.
set -euo pipefail

if [[ $# -ne 3 ]]; then
  echo "Usage: $0 <app> <region> <commit-sha>" >&2
  exit 2
fi
: "${SCALINGO_API_TOKEN:?SCALINGO_API_TOKEN is required}"

app=$1
region=$2
sha=$3

repo=${GITHUB_REPOSITORY:-MTES-MCT/Dossier-Facile-Frontend}
api="https://api.${region}.scalingo.com/v1"
source_url="https://github.com/${repo}/archive/${sha}.tar.gz"
dashboard_url="https://dashboard.scalingo.com/apps/${region}/${app}/deploy/list"
poll_interval=${POLL_INTERVAL:-15}
deploy_timeout=${DEPLOY_TIMEOUT:-1800}
max_poll_failures=5

error() {
  # Rendered as an annotation by GitHub Actions, plain text elsewhere
  echo "::error::$*" >&2
}

summary() {
  if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
    echo "$*" >> "$GITHUB_STEP_SUMMARY"
  fi
}

# The API token is exchanged for a bearer token valid for one hour.
exchange=$(mktemp)
trap 'rm -f "$exchange"' EXIT
if ! curl --silent --show-error --fail-with-body --max-time 30 --retry 3 \
  -H 'Accept: application/json' -H 'Content-Type: application/json' \
  -u ":${SCALINGO_API_TOKEN}" \
  -X POST https://auth.scalingo.com/v1/tokens/exchange --output "$exchange"; then
  error "Scalingo authentication failed: $(cat "$exchange")"
  exit 1
fi
bearer=$(jq -r '.token' "$exchange")
if [[ -n "${GITHUB_ACTIONS:-}" ]]; then
  echo "::add-mask::${bearer}"
fi

api_get() {
  curl --silent --show-error --fail-with-body --max-time 30 \
    -H 'Accept: application/json' -H "Authorization: Bearer ${bearer}" "$1"
}

echo "Deploying ${sha} to ${app} (${region})"
echo "Source: ${source_url}"

payload=$(jq -n --arg ref "$sha" --arg url "$source_url" \
  '{deployment: {git_ref: $ref, source_url: $url}}')

# No retry here: a retried POST could start the same deployment twice
if ! response=$(curl --silent --show-error --fail-with-body --max-time 60 \
  -H 'Accept: application/json' -H 'Content-Type: application/json' \
  -H "Authorization: Bearer ${bearer}" \
  -X POST "${api}/apps/${app}/deployments" -d "$payload"); then
  error "Could not start the deployment of ${app}: ${response}"
  summary "- ❌ \`${app}\` — deployment not started — [Scalingo](${dashboard_url})"
  exit 1
fi

id=$(jq -r '.deployment.id' <<< "$response")
status=$(jq -r '.deployment.status' <<< "$response")
echo "Deployment ${id} started: ${dashboard_url}"
echo "Status: ${status}"

poll_failures=0
while true; do
  case "$status" in
    success | crashed-error | timeout-error | build-error | aborted) break ;;
  esac

  if (( SECONDS > deploy_timeout )); then
    error "Deployment of ${app} still '${status}' after ${deploy_timeout}s, giving up (it keeps running on Scalingo)"
    summary "- ❌ \`${app}\` — timeout while \`${status}\` — [Scalingo](${dashboard_url})"
    exit 1
  fi

  sleep "$poll_interval"

  if response=$(api_get "${api}/apps/${app}/deployments/${id}"); then
    poll_failures=0
    new_status=$(jq -r '.deployment.status' <<< "$response")
    if [[ "$new_status" != "$status" ]]; then
      status=$new_status
      echo "Status: ${status} (${SECONDS}s)"
    fi
  else
    poll_failures=$((poll_failures + 1))
    echo "Could not read the deployment status (${poll_failures}/${max_poll_failures}): ${response}" >&2
    if (( poll_failures >= max_poll_failures )); then
      error "Lost track of the deployment of ${app}, check ${dashboard_url}"
      summary "- ❌ \`${app}\` — status unknown — [Scalingo](${dashboard_url})"
      exit 1
    fi
  fi
done

# The build output is plain text; failing to fetch it must not change the result
echo "::group::Build output of ${app}"
api_get "${api}/apps/${app}/deployments/${id}/output" || echo "(build output unavailable)"
echo
echo "::endgroup::"

if [[ "$status" == "success" ]]; then
  echo "Deployment of ${app} succeeded in ${SECONDS}s"
  summary "- ✅ \`${app}\` — \`${status}\` — [Scalingo](${dashboard_url})"
else
  error "Deployment of ${app} ended with status '${status}': ${dashboard_url}"
  summary "- ❌ \`${app}\` — \`${status}\` — [Scalingo](${dashboard_url})"
  exit 1
fi
