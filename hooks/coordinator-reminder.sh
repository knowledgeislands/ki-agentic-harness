#!/usr/bin/env bash
# UserPromptSubmit and SessionStart(compact) hook: remind a coordinating thread
# of the responsive-coordinator rules the ki-pmo coordinating-thread standard
# sets; ki-pmo owns this hook and its line. Works unchanged under Claude Code
# and Codex CLI, which share the hook input and
# `hookSpecificOutput.additionalContext` output shape.

# This hook is deliberately fail-open: every failure path exits 0 with no
# output, so it can never block a prompt. It is silent unless the thread is a
# coordinating thread, which it decides from the ki-pmo declaration in the
# working directory's checkout, and it is
# silent in any agent `ki agent` launched, which it decides from the run marker
# or from the detachment that launch performs.
set -u

line='Coordinator: do not do the work directly; delegate every unit of work to a detached background agent and stay responsive. Answer this message within one short turn. It does not pre-empt work in flight: do not stop or disturb a running agent unless it names one. Give a timestamped one-line update when you launch, when an agent finishes and while you wait, and report in owner-report form. Close every Summary, recap, full summary and re-bootstrap report with the ki-pmo banner: the REST or BUSY frame exactly as the standard prints it, the lines beneath, then the resume line in its own text block; each reply-block line carries the recommended instruction, never a menu of options.'

# `ki agent` marks each child with its run name; its Claude adapter has set the
# print-mode ceiling since before the marker existed, so it serves as a second
# signal for agents an older launcher started.
[ -z "${KI_AGENT_RUN:-}" ] || exit 0
[ -z "${CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS:-}" ] || exit 0

# A detached agent runs in its own session with no controlling terminal, while
# an interactive thread has one. Both runtimes start hook processes without the
# terminal, so the check walks up the ancestry; unknown counts as detached.
has_terminal() {
  pid=$$
  depth=0
  while [ "$pid" -gt 1 ] && [ "$depth" -lt 8 ]; do
    tty=$(ps -o tty= -p "$pid" 2>/dev/null | tr -d '[:space:]') || return 1
    case "$tty" in
      '' | '?' | '??' | '-') ;;
      *) return 0 ;;
    esac
    pid=$(ps -o ppid= -p "$pid" 2>/dev/null | tr -d '[:space:]') || return 1
    case "$pid" in
      '' | *[!0-9]*) return 1 ;;
    esac
    depth=$((depth + 1))
  done
  return 1
}
has_terminal || exit 0

command -v jq >/dev/null 2>&1 || exit 0
input=$(cat 2>/dev/null) || exit 0
[ -n "$input" ] || exit 0

event=$(printf '%s' "$input" | jq -r '.hook_event_name // empty' 2>/dev/null) || exit 0
case "$event" in
  UserPromptSubmit) ;;
  SessionStart)
    source=$(printf '%s' "$input" | jq -r '.source // empty' 2>/dev/null) || exit 0
    [ "$source" = compact ] || exit 0
    ;;
  *) exit 0 ;;
esac

# A coordinating thread sits in a checkout whose top-level .ki.toml declares
# [skills.ki-pmo]. A repository that does not delegate never declares it and so
# never gets the hook; removing ki-pmo disables it. The working directory may be
# a subdirectory of that checkout.
cwd=$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null) || exit 0
[ -n "$cwd" ] || cwd=$PWD
[ -d "$cwd" ] || exit 0

coordinating() {
  [ -f "$1/.ki.toml" ] && grep -Eq '^\[skills\.ki-pmo\]' "$1/.ki.toml" 2>/dev/null
}

if ! coordinating "$cwd"; then
  top=$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null) || exit 0
  [ -n "$top" ] || exit 0
  coordinating "$top" || exit 0
fi

jq -cn --arg event "$event" --arg line "$line" \
  '{hookSpecificOutput: {hookEventName: $event, additionalContext: $line}}' 2>/dev/null || exit 0

exit 0
