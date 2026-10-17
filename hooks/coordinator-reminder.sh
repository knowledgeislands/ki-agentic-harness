#!/usr/bin/env bash
# UserPromptSubmit and SessionStart(compact) hook: remind a coordinating thread
# of the responsive-coordinator rules the ki-pmo coordinating-thread standard
# sets on every owner message, and point it at the standard's re-anchoring
# steps after a compaction; ki-pmo owns this hook and both lines. Works under
# Claude Code and Codex CLI, which share the hook input and
# `hookSpecificOutput.additionalContext` output shape.

# This hook is deliberately fail-open: every failure path exits 0 with no
# output, so it can never block a prompt. It is silent unless the thread is a
# coordinating thread, which it decides from the ki-pmo declaration in the
# working directory's checkout, and it is
# silent in any agent `ki agent` launched, which it decides from the run marker
# or from the detachment that launch performs.
set -u

line='In a coordinating thread only, one opened or resumed as a ki-pmo coordination or state-of-play thread; in a conversational thread ignore this line and reply in the ki-pmo Reply forms. Coordinator: follow the ki-pmo coordinating-thread standard (skills/change-management/ki-pmo/references/standards-pmo.md), whose five hard rules are: 1) delegate every unit of work to a detached background agent and stay responsive, answering this message within one short turn; 2) an owner message never pre-empts work in flight, so stop a running agent only when the owner names it and says stop; 3) while dispatched work runs, give timed one-to-two-line updates and keep a background check armed that wakes you at least every 5 minutes, with no heartbeat at rest; 4) give every Summary, recap, full summary, re-bootstrap and hold report in the owner-report shape, opening with the report heading and closing with the footer banner exactly as the standard prints them; 5) commit your own work by explicit path, and act on each line of the Messages from Master block at the top of the checkpoint, then remove it.'
pointer='Context was compacted. In a coordinating thread, before replying, follow "Re-anchoring after compaction" in the ki-pmo coordinating-thread standard (skills/change-management/ki-pmo/references/standards-pmo.md): re-read the standard and your checkpoint in full, run ki agent status and read your inbox, then confirm in one line and answer in owner-report form with the report heading and the footer banner. Re-anchoring moves no mark. In a conversational thread, re-read your checkpoint if you have one and carry on with a conversational reply.'

# `ki agent` marks each child with its run name; its Claude adapter has set the
# print-mode ceiling since before the marker existed, so it serves as a second
# signal for agents an older launcher started.
[ -z "${KI_AGENT_RUN:-}" ] || exit 0
[ -z "${CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS:-}" ] || exit 0

# A detached agent runs in its own session with no controlling terminal, while
# an interactive thread has one. Both runtimes start hook processes without the
# terminal, so the check walks up the ancestry; unknown counts as detached.
# Claude Code sets CLAUDECODE in every session, interactive or not, and an
# interactive Claude Code session may have no terminal at all, as in an editor,
# so under Claude Code the run marker and the ceiling are the only signals and
# the terminal check is skipped. Codex keeps it until its launcher sets
# KI_AGENT_RUN.
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
if [ -z "${CLAUDECODE:-}" ]; then
  has_terminal || exit 0
fi

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

jq -cn --arg event "$event" --arg line "$context" \
  '{hookSpecificOutput: {hookEventName: $event, additionalContext: $line}}' 2>/dev/null || exit 0

exit 0
