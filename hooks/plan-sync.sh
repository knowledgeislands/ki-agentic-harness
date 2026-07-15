#!/usr/bin/env bash
# PostToolUse(TodoWrite): mirror live todo state into the tracked plan file's progress block
# See ../README.md

set -u

input=$(cat)
command -v jq >/dev/null 2>&1 || exit 0

session_id=$(printf '%s' "$input" | jq -er '
  .session_id
  | select(
      type == "string"
      and length >= 1
      and length <= 128
      and test("^[A-Za-z0-9]")
      and (test("[^A-Za-z0-9_-]") | not)
    )
') || exit 0
LC_ALL=C
case "$session_id" in
  '' | [!A-Za-z0-9]* | *[!A-Za-z0-9_-]*) exit 0 ;;
esac
[ "${#session_id}" -le 128 ] || exit 0

case "$(uname -s 2>/dev/null)" in
  Darwin)
    replace_exact() { mv -h -- "$1" "$2"; }
    stat_owner() { stat -f '%u' "$1"; }
    stat_mode() { stat -f '%Lp' "$1"; }
    ;;
  Linux)
    replace_exact() { mv -T -- "$1" "$2"; }
    stat_owner() { stat -c '%u' "$1"; }
    stat_mode() { stat -c '%a' "$1"; }
    ;;
  *) exit 0 ;;
esac

current_uid=$(id -u) || exit 0

secure_state_dir() {
  [ -d "$state_dir" ] || return 1
  [ -L "$state_dir" ] && return 1
  [ "$(cd "$state_dir" 2>/dev/null && pwd -P)" = "$state_dir" ] || return 1
  [ "$(dirname "$state_dir")" = "$resolved_plans" ] || return 1

  state_owner=$(stat_owner "$state_dir") || return 1
  state_mode=$(stat_mode "$state_dir") || return 1
  [ "$state_owner" = "$current_uid" ] || return 1
  case "$state_mode" in
    '' | *[!0-7]*) return 1 ;;
  esac
  [ $(( (8#$state_mode) & (8#22) )) -eq 0 ] || return 1
}

secure_state_file() {
  [ -f "$state_file" ] || return 1
  [ -L "$state_file" ] && return 1

  file_owner=$(stat_owner "$state_file") || return 1
  file_mode=$(stat_mode "$state_file") || return 1
  [ "$file_owner" = "$current_uid" ] || return 1
  case "$file_mode" in
    '' | *[!0-7]*) return 1 ;;
  esac
  [ $(( (8#$file_mode) & (8#22) )) -eq 0 ] || return 1
}

read_state_record() {
  state_record_current=$({ cat "$state_file" || exit 1; printf '\034'; }) || return 1
}

state_unchanged() {
  secure_state_dir || return 1
  secure_state_file || return 1
  read_state_record || return 1
  secure_state_dir || return 1
  secure_state_file || return 1
  [ "$state_record_current" = "$state_record" ] || return 1
}

plans_dir="$HOME/.claude/plans"
resolved_plans=$(cd "$plans_dir" 2>/dev/null && pwd -P) || exit 0
state_dir="$resolved_plans/.state"
secure_state_dir || exit 0
resolved_state="$state_dir"

state_file="$resolved_state/$session_id"
secure_state_file || exit 0
read_state_record || exit 0
state_record="$state_record_current"
state=${state_record%$'\034'}
[ -n "$state" ] || exit 0
state_unchanged || exit 0

first_non_ws=$(printf '%s' "$state" | jq -Rrs 'try match("\\S").string catch ""') || exit 0
if [ "$first_non_ws" = "{" ]; then
  printf '%s' "$state" | jq -e -s \
    --arg session_id "$session_id" \
    'length == 1
      and (.[0] | type == "object")
      and (.[0] | keys == ["cwd", "plan_file", "session_id", "version"])
      and .[0].version == 1
      and (.[0].session_id | type == "string")
      and .[0].session_id == $session_id
      and (.[0].plan_file | type == "string" and length > 0)
      and (.[0].cwd | type == "string" and length > 0)' >/dev/null || exit 0
  plan_file=$(printf '%s' "$state" | jq -sr '.[0].plan_file') || exit 0
  state_cwd=$(printf '%s' "$state" | jq -sr '.[0].cwd') || exit 0
  case "$state_cwd" in
    /*) ;;
    *) exit 0 ;;
  esac
  [ -d "$state_cwd" ] || exit 0
  [ "$(cd "$state_cwd" 2>/dev/null && pwd -P)" = "$state_cwd" ] || exit 0
else
  # Temporary sync-only compatibility: one absolute plaintext path. A record that
  # looks like JSON is never allowed to fall through here after a parse failure.
  [ "$(awk 'END { print NR }' "$state_file")" -eq 1 ] || exit 0
  legacy_state=${state%$'\n'}
  case "$legacy_state" in
    /*) ;;
    *) exit 0 ;;
  esac
  case "$legacy_state" in
    *$'\r'* | *$'\n'*) exit 0 ;;
  esac
  plan_file="$legacy_state"
fi

case "$plan_file" in
  /*) ;;
  *) exit 0 ;;
esac
[ -L "$plan_file" ] && exit 0
[ -f "$plan_file" ] || exit 0

resolved_dir=$(cd "$(dirname "$plan_file")" 2>/dev/null && pwd -P) || exit 0
case "$resolved_dir" in
  "$resolved_plans" | "$resolved_plans"/*) ;;
  *) exit 0 ;;
esac
plan_file="$resolved_dir/$(basename "$plan_file")"
[ -L "$plan_file" ] && exit 0
[ -f "$plan_file" ] || exit 0

# V1 records are canonical by contract; a rewritten or stale non-physical path is
# rejected even if it happens to resolve back into the plans jail.
if [ "$first_non_ws" = "{" ]; then
  recorded_plan=$(printf '%s' "$state" | jq -sr '.[0].plan_file') || exit 0
  [ "$recorded_plan" = "$plan_file" ] || exit 0
fi

jq -e '(.tool_input.todos // []) | length > 0' <<<"$input" >/dev/null || exit 0

todos_md=$(printf '%s' "$input" | jq -r '.tool_input.todos[] | (if .status=="completed" then "- [x] " elif .status=="in_progress" then "- [~] " else "- [ ] " end) + (.content | gsub("\n"; " "))') || exit 0

block=$(printf '<!-- ki:progress:start -->\n## Progress (auto-synced)\n\n%s\n<!-- ki:progress:end -->' "$todos_md")

[ "$(cd "$resolved_dir" 2>/dev/null && pwd -P)" = "$resolved_dir" ] || exit 0
tmp=$(mktemp "$resolved_dir/.plan-sync.XXXXXX") || exit 0

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
    # A start marker without its matching end would otherwise discard the rest
    # of the plan. Fail so the caller removes the temporary file instead.
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
  rm -f -- "$tmp"
  exit 0
fi

[ "$(cd "$resolved_dir" 2>/dev/null && pwd -P)" = "$resolved_dir" ] || { rm -f -- "$tmp"; exit 0; }
[ -L "$plan_file" ] && { rm -f -- "$tmp"; exit 0; }
state_unchanged || { rm -f -- "$tmp"; exit 0; }
replace_exact "$tmp" "$plan_file" || { rm -f -- "$tmp"; exit 0; }

if jq -e '[.tool_input.todos[].status] | all(. == "completed")' <<<"$input" >/dev/null; then
  [ "$(cd "$resolved_dir" 2>/dev/null && pwd -P)" = "$resolved_dir" ] || exit 0
  tmp2=$(mktemp "$resolved_dir/.plan-sync.XXXXXX") || exit 0

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
    rm -f -- "$tmp2"
    exit 0
  fi

  [ "$(cd "$resolved_dir" 2>/dev/null && pwd -P)" = "$resolved_dir" ] || { rm -f -- "$tmp2"; exit 0; }
  [ -L "$plan_file" ] && { rm -f -- "$tmp2"; exit 0; }
  state_unchanged || { rm -f -- "$tmp2"; exit 0; }
  replace_exact "$tmp2" "$plan_file" || { rm -f -- "$tmp2"; exit 0; }
fi

exit 0
