#!/bin/sh
# Zero-install repository lifecycle launcher. It never installs user material.
set -eu

REPO="knowledgeislands/ki-agentic-harness"

usage() {
  printf '%s\n' \
    'Usage: repo-operation.sh <clean|uninstall> [target] [options]' \
    '' \
    'Run a source-owned Knowledge Islands repository lifecycle operation.' \
    '' \
    'Operations:' \
    '  clean       Remove only proven generated repository state.' \
    '  uninstall   End only repository-level Knowledge Islands adoption.' \
    '' \
    'Options:' \
    '  --ref <ref>   Harness Git ref to use (default: main).' \
    '  --dry-run     Report planned changes without writing.' \
    '  -h, --help    Show this help and exit.'
}

[ "$#" -gt 0 ] || { usage; exit 2; }
case "$1" in
  -h|--help)
    usage
    exit 0
    ;;
  clean|uninstall) operation="$1"; shift ;;
  *)
    echo "error: operation must be clean or uninstall" >&2
    usage >&2
    exit 2
    ;;
esac

for argument in "$@"; do
  case "$argument" in
    -h|--help)
      usage
      exit 0
      ;;
  esac
done

ref="main"
target=""
dry_run=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --ref)
      shift
      [ "$#" -gt 0 ] || { echo 'error: --ref requires a value' >&2; exit 2; }
      ref="$1"
      ;;
    --dry-run) dry_run="--dry-run" ;;
    -*)
      echo "error: unsupported option: $1" >&2
      exit 2
      ;;
    *)
      [ -z "$target" ] || { echo 'error: operation accepts at most one target' >&2; exit 2; }
      target="$1"
      ;;
  esac
  shift
done
[ -n "$target" ] || target="$(pwd)"

for dependency in curl tar bun; do
  command -v "$dependency" >/dev/null 2>&1 || {
    if [ "$dependency" = bun ]; then
      echo "error: bun is required to run the Knowledge Islands mechanical layer." >&2
      echo "install it first:  curl -fsSL https://bun.sh/install | bash" >&2
    else
      echo "error: $dependency is required" >&2
    fi
    exit 1
  }
done

temporary="$(mktemp -d)"
trap 'rm -rf "$temporary"' EXIT

echo "running repository $operation from $REPO@$ref"
curl -fsSL "https://codeload.github.com/$REPO/tar.gz/$ref" | tar -xz -C "$temporary" --strip-components=1
case "$operation" in
  clean) entrypoint="clean.ts" ;;
  uninstall) entrypoint="repo-uninstall.ts" ;;
esac
bun "$temporary/skills/keystone/ki-bootstrap/scripts/$entrypoint" "$target" ${dry_run:+"$dry_run"}
