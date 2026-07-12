#!/usr/bin/env bash
# PostToolUse(ExitPlanMode): stamp frontmatter onto a freshly-finalized plan file.
# See ../README.md

set -u

input=$(cat)

command -v jq >/dev/null 2>&1 || exit 0

plan_file=$(printf '%s' "$input" | jq -r '.tool_input.planFilePath // empty')
[ -z "$plan_file" ] && exit 0
[ -f "$plan_file" ] || exit 0

# Containment must be checked against the *resolved* path, not a string prefix — a
# planFilePath smuggling `../` (e.g. "$HOME/.claude/plans/../../etc/hosts") would pass a
# literal "$HOME/.claude/plans/"* glob while resolving well outside the plans jail.
plans_dir="$HOME/.claude/plans"
resolved_dir=$(cd "$(dirname "$plan_file")" 2>/dev/null && pwd -P) || exit 0
resolved_plans=$(cd "$plans_dir" 2>/dev/null && pwd -P) || exit 0
case "$resolved_dir" in
  "$resolved_plans" | "$resolved_plans"/*) ;;
  *) exit 0 ;;
esac
plan_file="$resolved_dir/$(basename "$plan_file")"
[ -L "$plan_file" ] && exit 0
[ -f "$plan_file" ] || exit 0

session_id=$(printf '%s' "$input" | jq -r '.session_id // empty')
case "$session_id" in
  '' | */* | . | ..) exit 0 ;;
esac

mkdir -p "$HOME/.claude/plans/.state" || exit 0
state_file="$HOME/.claude/plans/.state/$session_id"
# `mv` replaces a symlink at $state_file rather than writing through it (unlike `>`
# redirect, which would follow a planted symlink and clobber its target).
state_tmp=$(mktemp "$HOME/.claude/plans/.state/.plan-stamp.XXXXXX") || exit 0
printf '%s' "$plan_file" > "$state_tmp" || { rm -f "$state_tmp"; exit 0; }
mv "$state_tmp" "$state_file" || exit 0

# Re-check immediately before reading: narrows (does not eliminate) the check-then-use
# window between the earlier -L guard and this read.
[ -L "$plan_file" ] && exit 0
first_line=$(head -n1 "$plan_file") || exit 0
first_line=${first_line%$'\r'}
[ "$first_line" = "---" ] && exit 0

cwd=$(printf '%s' "$input" | jq -r '.cwd // empty' | tr '\n' ' ')
[ -z "$cwd" ] && cwd="$PWD"

tmp=$(mktemp "$(dirname "$plan_file")/.plan-stamp.XXXXXX") || exit 0
{
  printf -- '---\n'
  printf 'status: open\n'
  printf 'created: %s\n' "$(date +%F)"
  printf 'cwd: %s\n' "$cwd"
  printf -- '---\n'
  printf '\n'
  cat "$plan_file"
} > "$tmp" || { rm -f "$tmp"; exit 0; }

mv "$tmp" "$plan_file" || exit 0
