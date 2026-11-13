#!/usr/bin/env bash
# Prints the version declared in the source tree: the "version" field of the
# root package.json. Run from the repository root.
set -euo pipefail

jq -er '.version' package.json
