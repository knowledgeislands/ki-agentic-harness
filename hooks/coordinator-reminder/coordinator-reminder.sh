#!/usr/bin/env bash
# UserPromptSubmit and SessionStart(compact): short conditional pointers owned by
# ki-coordination. Checkout capability does not prove selected work or session role.
# Full rules, re-anchoring and the coordinator method self-check live in the
# authoritative standard/output style. Full session-sensitive detection is deferred.
# Fail open silently on unusable input.
set -u

line='Only if the owner explicitly opened or resumed coordination, follow ki-coordination (skills/work/ki-coordination/references/standards-coordination.md). Otherwise use its conversational Reply forms. Every reply opens with **Reply HH:MM** (date -u); one asking a decision ends with the reply block.'
pointer='Context was compacted. Only if explicitly coordinating, follow Re-anchoring after compaction in ki-coordination (skills/work/ki-coordination/references/standards-bootstrap.md). Otherwise use its conversational Reply forms. Every reply opens with **Reply HH:MM** (date -u); one asking a decision ends with the reply block.'

command -v jq >/dev/null 2>&1 || exit 0
input=$(cat 2>/dev/null) || exit 0
[ -n "$input" ] || exit 0

event=$(printf '%s' "$input" | jq -r '.hook_event_name // empty' 2>/dev/null) || exit 0
context=$line
case "$event" in
  UserPromptSubmit) ;;
  SessionStart)
    source=$(printf '%s' "$input" | jq -r '.source // empty' 2>/dev/null) || exit 0
    [ "$source" = compact ] || exit 0
    context=$pointer
    ;;
  *) exit 0 ;;
esac

# Capability guard only: a declaration never establishes session role or selection.
# The working directory may be a subdirectory of the declaring checkout.
cwd=$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null) || exit 0
[ -n "$cwd" ] || cwd=$PWD
[ -d "$cwd" ] || exit 0

capable() {
  [ -f "$1/.ki.toml" ] && grep -Eq '^\[skills\.ki-coordination\]' "$1/.ki.toml" 2>/dev/null
}

if ! capable "$cwd"; then
  top=$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null) || exit 0
  [ -n "$top" ] || exit 0
  capable "$top" || exit 0
fi

jq -cn --arg event "$event" --arg line "$context" \
  '{hookSpecificOutput: {hookEventName: $event, additionalContext: $line}}' 2>/dev/null || exit 0

exit 0
