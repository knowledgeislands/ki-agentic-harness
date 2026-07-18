#!/bin/sh
# One-time Knowledge Islands harness installer.
#
# Installs the global process-skill payload for the selected runtime and, when
# Claude Code is selected, the durable hook payload. It never bootstraps a
# repository and never writes user-managed runtime settings.
set -eu

REPO="knowledgeislands/ki-agentic-harness"
ref="main"
previous=""
for argument in "$@"; do
  if [ "$previous" = --ref ]; then
    ref="$argument"
    previous=""
    continue
  fi
  [ "$argument" = --ref ] && previous=--ref || previous=""
done
case " $* " in
  *" --ref "*) ;;
  *) set -- "$@" --ref "$ref" ;;
esac

for dependency in curl tar bun; do
  command -v "$dependency" >/dev/null 2>&1 || { echo "error: $dependency is required" >&2; exit 1; }
done

temporary="$(mktemp -d)"
trap 'rm -rf "$temporary"' EXIT
archive="$temporary/source.tar.gz"
source="$temporary/source"
mkdir "$source"
echo "installing Knowledge Islands harness for this user from $REPO@$ref"
curl -fsSL "https://codeload.github.com/$REPO/tar.gz/$ref" -o "$archive"
tar -xzf "$archive" -C "$source" --strip-components=1
bun "$source/skills/keystone/ki-bootstrap/scripts/lib/user-install.ts" --source "$source/skills" --hooks-source "$source/hooks" "$@"
