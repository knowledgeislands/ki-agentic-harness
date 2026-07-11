#!/usr/bin/env bash
# ki-bootstrap zero-install entry point (ADR-KI-HARNESS-007).
#
# The canonical remote one-liner — no clone, no global install, no runtime
# assumed beyond bash/curl/tar:
#
#   curl -fsSL https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/ki-bootstrap/scripts/bootstrap.sh \
#     | bash -s -- <target> [--ref <ref>] [--dry-run]
#
# It fetches the harness source tarball at the pinned ref (default: main),
# extracts it to a temp dir, and runs the chain engine (bootstrap.ts) from that
# tree, forwarding every argument. Bun is required to *run* the engine and the
# vendored checkers — it is the mechanical layer's runtime, not the entry
# point's — so a missing bun fails fast with the install instruction rather
# than being installed silently.
set -euo pipefail

REPO="knowledgeislands/ki-agentic-harness"

# Determine the ref to fetch (default main) without consuming the args — the
# engine receives them all, and needs --ref itself to stamp the manifest from a
# .git-less tarball extract.
ref="main"
args=("$@")
for ((i = 0; i < ${#args[@]}; i++)); do
  if [[ "${args[$i]}" == "--ref" && $((i + 1)) -lt ${#args[@]} ]]; then
    ref="${args[$((i + 1))]}"
  fi
done
have_ref_flag=false
for a in "$@"; do
  [[ "$a" == "--ref" ]] && have_ref_flag=true
done

for dep in curl tar; do
  command -v "$dep" >/dev/null 2>&1 || {
    echo "error: $dep is required" >&2
    exit 1
  }
done
command -v bun >/dev/null 2>&1 || {
  echo "error: bun is required to run the Knowledge Islands mechanical layer." >&2
  echo "install it first:  curl -fsSL https://bun.sh/install | bash" >&2
  exit 1
}

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "fetching $REPO@$ref"
curl -fsSL "https://codeload.github.com/$REPO/tar.gz/$ref" | tar -xz -C "$tmp" --strip-components=1

if [[ "$have_ref_flag" == true ]]; then
  bun "$tmp/skills/ki-bootstrap/scripts/bootstrap.ts" "$@"
else
  bun "$tmp/skills/ki-bootstrap/scripts/bootstrap.ts" "$@" --ref "$ref"
fi
