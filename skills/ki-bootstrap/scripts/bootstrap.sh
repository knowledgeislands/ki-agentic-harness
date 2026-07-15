#!/bin/sh
# LEGACY BACK-COMPAT SHIM — do not edit the engine logic here; it lives at the
# canonical path below. This file exists only because it moved.
#
# Pre-cluster-reorg (commit 72e3a26) entry point: ki-bootstrap lived at
# `skills/ki-bootstrap/scripts/` before moving to `skills/keystone/ki-bootstrap/scripts/`.
# A `ki-init` wrapper vendored before that commit still fetches this exact URL by
# name (raw.githubusercontent.com serves file content directly — it cannot
# server-redirect a moved path), so this file must physically exist here. It is a
# redirect only: it re-fetches the canonical script at the same `--ref` and execs
# it with all args intact, never duplicating the engine.
set -eu

REPO="knowledgeislands/ki-agentic-harness"
CANONICAL_PATH="skills/keystone/ki-bootstrap/scripts/bootstrap.sh"

ref=main
prev=""
for a in "$@"; do
  if [ "$prev" = --ref ]; then
    ref="$a"
    prev=""
    continue
  fi
  case "$a" in
    --ref) prev=--ref ;;
    *) prev="" ;;
  esac
done

# Test hook only: point at a local checkout instead of the network, so the
# self-test suite can exercise this exec chain without a live GitHub fetch.
if [ -n "${KI_BOOTSTRAP_LOCAL_ROOT:-}" ]; then
  exec sh "$KI_BOOTSTRAP_LOCAL_ROOT/$CANONICAL_PATH" "$@"
fi

command -v curl >/dev/null 2>&1 || {
  echo "error: curl is required" >&2
  exit 1
}

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT
curl -fsSL "https://raw.githubusercontent.com/$REPO/$ref/$CANONICAL_PATH" -o "$tmp"
exec sh "$tmp" "$@"
