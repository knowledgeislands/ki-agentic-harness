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

line='Coordinator: do not do the work directly; delegate every unit of work to a detached background agent and stay responsive. Answer this message within one short turn. It does not pre-empt work in flight: do not stop or disturb a running agent unless it names one. Give a timestamped one-line update when you launch, when an agent finishes and while you wait, and report in owner-report form, opening with the ki-pmo heading frame in its own text block, the thread type, the report form and the issued time in its top border, the label centred in its body and the mark in its bottom border, widened equally when the top border needs more than 52, and the plain Project · Initiative · <window> · <state> line beneath it. Close every Summary, recap, full summary and re-bootstrap report with the ki-pmo footer banner: the block-letter REST or BUSY frame exactly as the standard prints it, issued time in its top border, then a blank line, then one Markdown list with a bracketed state per item, - [running], - [queued] or - [waiting], or - [at rest] nothing running or queued when nothing is running or queued, then the housekeeping items such as - [blocked] and - [held], with no label-and-mark line, then the resume line in its own text block; each query gives Context, a one-sentence Query and lettered Options with a) (recommended) first and no bullets, and each reply-block entry stacks its tag on one line, a blank line, then the option a) instruction in full, never a menu of options, with --- between entries, a bare letter in reply being accepted. Every roadmap record a report names is linked by its full identifier to its local file, and a pruned record is linked as its full identifier followed by (pruned) to the GitHub link to the file at its last revision, usually the parent of the prune commit. Commit and push the thread folder under +/_THREADS/ at every report and resting point.'
pointer='Context was compacted. Before replying, follow "Re-anchoring after compaction" in the ki-pmo coordinating-thread standard (skills/change-management/ki-pmo/references/standards-pmo.md): re-read the standard and your checkpoint in full, run ki agent status and read your inbox, then confirm in one line and answer in owner-report form with the heading frame and the footer banner. Re-anchoring moves no mark.'

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
