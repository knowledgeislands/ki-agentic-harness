#!/usr/bin/env bash
# UserPromptSubmit and SessionStart(compact) hook: remind a coordinating thread
# of the responsive-coordinator rules the ki-coordination coordinating-thread standard
# sets on every owner message, and point it at the standard's re-anchoring
# steps after a compaction; ki-coordination owns this hook and both lines. Works under
# Claude Code and Codex CLI, which share the hook input and
# `hookSpecificOutput.additionalContext` output shape.

# This hook is deliberately fail-open: every failure path exits 0 with no
# output, so it can never block a prompt. It is silent unless the thread is a
# coordinating thread, which it decides from the ki-coordination declaration in the
# working directory's checkout, and it is silent in any agent `ki agent`
# launched, which it decides from the run marker the launcher sets under both
# runtimes.
set -u

line='In coordinating work only, a session opened or resumed as ki-coordination territory work or Project work, whose work file declares level territory or project; in any other session ignore this line and reply in the ki-coordination Reply forms. Coordinator: follow the ki-coordination coordinating-work standard (skills/change-management/ki-coordination/references/standards-coordination.md) and the Work Process note it cites, whose five hard rules are: 1) delegate every unit of work to a detached background agent and stay responsive, answering this message within one short turn; 2) an owner message never pre-empts work in flight, so stop a running agent only when the owner names it and says stop; 3) while work lies with a worker, give timed one-to-two-line updates and keep a background check armed that wakes you at least every 5 minutes, with no heartbeat otherwise; 4) give every Summary, recap, full summary, re-bootstrap and hold report in the owner-report shape, opening with the report heading and its state form line and closing with the glyph banner exactly as the standard prints them, with no reply block, reading each spoken answer back in the decisions log; 5) commit your own work by explicit path at every send, and act on each line of the messages.md queue of the work package, IMPORTANT lines first and then in queue order, then remove it.'
pointer='Context was compacted. While coordinating work, before replying, follow "Re-anchoring after compaction" in the ki-coordination coordinating-work standard (skills/change-management/ki-coordination/references/standards-coordination.md): re-read the standard and all five files of your work package in full, run ki agent status and read its messages.md queue, IMPORTANT lines first, then confirm in one line and answer in owner-report form with the report heading and the glyph banner. Re-anchoring moves no mark. In a conversational session, re-read your work package if you have one and carry on with a conversational reply.'

# `ki agent` marks each child with its run name; its Claude adapter has set the
# print-mode ceiling since before the marker existed, so it serves as a second
# signal for agents an older launcher started.
[ -z "${KI_AGENT_RUN:-}" ] || exit 0
[ -z "${CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS:-}" ] || exit 0

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
# [skills.ki-coordination]. A repository that does not delegate never declares it and so
# never gets the hook; removing ki-coordination disables it. The working directory may be
# a subdirectory of that checkout.
cwd=$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null) || exit 0
[ -n "$cwd" ] || cwd=$PWD
[ -d "$cwd" ] || exit 0

coordinating() {
  [ -f "$1/.ki.toml" ] && grep -Eq '^\[skills\.ki-coordination\]' "$1/.ki.toml" 2>/dev/null
}

if ! coordinating "$cwd"; then
  top=$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null) || exit 0
  [ -n "$top" ] || exit 0
  coordinating "$top" || exit 0
fi

jq -cn --arg event "$event" --arg line "$context" \
  '{hookSpecificOutput: {hookEventName: $event, additionalContext: $line}}' 2>/dev/null || exit 0

exit 0
