#!/usr/bin/env bash
# PostToolUse(TodoWrite): mirror live todo state into the tracked plan file's progress block
# See ../README.md

set -u

input=$(cat)
command -v jq >/dev/null 2>&1 || exit 0

session_id=$(printf '%s' "$input" | jq -r '.session_id // empty') || exit 0
case "$session_id" in
  '' | */* | . | ..) exit 0 ;;
esac

state_file="$HOME/.claude/plans/.state/$session_id"
[ -f "$state_file" ] || exit 0
plan_file=$(cat "$state_file") || exit 0
[ -z "$plan_file" ] && exit 0
[ -f "$plan_file" ] || exit 0

# Containment must be checked against the *resolved* path, not a string prefix — see
# plan-stamp.sh for the rationale (a `../`-smuggled value can textually start with the
# plans-dir prefix while resolving outside it).
plans_dir="$HOME/.claude/plans"
resolved_dir=$(cd "$(dirname "$plan_file")" 2>/dev/null && pwd -P) || exit 0
resolved_plans=$(cd "$plans_dir" 2>/dev/null && pwd -P) || exit 0
case "$resolved_dir" in
  "$resolved_plans" | "$resolved_plans"/*) ;;
  *) exit 0 ;;
esac
plan_file="$resolved_dir/$(basename "$plan_file")"
[ -f "$plan_file" ] || exit 0
[ -L "$plan_file" ] && exit 0

jq -e '(.tool_input.todos // []) | length > 0' <<<"$input" >/dev/null || exit 0

todos_md=$(printf '%s' "$input" | jq -r '.tool_input.todos[] | (if .status=="completed" then "- [x] " elif .status=="in_progress" then "- [~] " else "- [ ] " end) + (.content | gsub("\n"; " "))') || exit 0

block=$(printf '<!-- ki:progress:start -->\n## Progress (auto-synced)\n\n%s\n<!-- ki:progress:end -->' "$todos_md")

tmp=$(mktemp "$(dirname "$plan_file")/.plan-sync.XXXXXX") || exit 0

export PLAN_SYNC_BLOCK="$block"
awk '
  BEGIN { seen = 0; skipping = 0; block = ENVIRON["PLAN_SYNC_BLOCK"] }
  $0 == "<!-- ki:progress:start -->" {
    print block
    seen = 1
    skipping = 1
    next
  }
  skipping == 1 {
    if ($0 == "<!-- ki:progress:end -->") { skipping = 0 }
    next
  }
  { print }
  END {
    # An unterminated start marker (no matching end marker) would otherwise silently
    # discard everything from the start marker to EOF — fail loudly instead so the
    # caller (awk_status check below) discards $tmp and leaves the plan file untouched.
    if (skipping == 1) {
      exit 1
    }
    if (seen == 0) {
      print ""
      print block
    }
  }
' "$plan_file" > "$tmp"
awk_status=$?

if [ "$awk_status" -ne 0 ]; then
  rm -f "$tmp"
  exit 0
fi

mv "$tmp" "$plan_file" || exit 0

if jq -e '[.tool_input.todos[].status] | all(. == "completed")' <<<"$input" >/dev/null; then
  tmp2=$(mktemp "$(dirname "$plan_file")/.plan-sync.XXXXXX") || exit 0

  awk '
    BEGIN { fences = 0; done = 0 }
    fences == 1 && done == 0 && $0 == "status: open" {
      print "status: done"
      done = 1
      next
    }
    $0 == "---" { fences++ }
    { print }
  ' "$plan_file" > "$tmp2"
  awk_status2=$?

  if [ "$awk_status2" -ne 0 ]; then
    rm -f "$tmp2"
    exit 0
  fi

  mv "$tmp2" "$plan_file" || exit 0
fi

exit 0
