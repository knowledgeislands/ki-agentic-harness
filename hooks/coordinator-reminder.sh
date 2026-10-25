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

line='In coordinating work only, a session opened or resumed as ki-coordination territory or Project work, its work file at level territory or project; elsewhere ignore this line and use the ki-coordination Reply forms. Follow the coordinating-work standard (skills/change-management/ki-coordination/references/standards-coordination.md) and the Work Process note it cites. Hard rules: 1) delegate every unit of work to a detached background agent and stay responsive, answering within one short turn; 2) an owner message never pre-empts work in flight: stop an agent only when the owner names it and says stop; 3) while work lies with a worker, give timed one-to-two-line updates and keep a background check armed that wakes you at least every 5 minutes, and no heartbeat otherwise; 4) give every Summary, recap, full summary, re-bootstrap and hold report in the owner-report shape, heading and form line to glyph banner, with no reply block, a re-bootstrap report and a full summary restating every open query in full, end any other reply that moves the mark, changes the state or answers where the work stands with the banner, and read each spoken answer back in the decisions log; every medium- or low-confidence query, and any high-confidence destructive, deletion or publication one, goes to one blind review before it reaches the owner; 5) commit your own work and the work package by explicit path after every finished change; sync after each finished change and at least every 15 minutes under the standing push rule, fast-forward only, never forced or --no-verify, stopping on divergence; act on each messages.md line, IMPORTANT first, then in queue order, then remove it.'
pointer='Context was compacted. While coordinating work, before replying, follow "Re-anchoring after compaction" in the ki-coordination coordinating-work standard (skills/change-management/ki-coordination/references/standards-coordination.md): re-read the standard, the harness output style output-styles/ki-coordinator.md from disk and all five files of your work package in full, and follow the style file wherever it differs from the loaded style; run ki agent status and read its messages.md queue, IMPORTANT lines first, then confirm in one line and answer in owner-report form with the report heading and the glyph banner and its closing thread line, with no send or resume line. Re-anchoring moves no mark. In a conversational session, re-read your work package if you have one and carry on with a conversational reply.'

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

checkout=$cwd
if ! coordinating "$cwd"; then
  top=$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null) || exit 0
  [ -n "$top" ] || exit 0
  coordinating "$top" || exit 0
  checkout=$top
fi

# Compare with the method's latest change, not an unrelated harness commit.
# Only simple top-level YAML scalars are needed here. Unsupported or unreadable
# metadata leaves the reminder unchanged; this hook never writes package state.
field() {
  awk -v key="$2" '
    NR == 1 { if ($0 != "---") exit; next }
    $0 == "---" { exit }
    index($0, key ":") == 1 {
      value = substr($0, length(key) + 2)
      sub(/^[[:space:]]*/, "", value)
      sub(/[[:space:]]+#.*$/, "", value)
      sub(/[[:space:]]*$/, "", value)
      if (value ~ /^".*"$/ || value ~ /^\047.*\047$/) value = substr(value, 2, length(value) - 2)
      print value
      exit
    }
  ' "$1" 2>/dev/null
}
method_warning() {
  local harness revision current state definition level held read_method read_revision
  harness=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." 2>/dev/null && pwd -P) || return 0
  revision=$(git -C "$harness" log -1 --format=%H -- skills/change-management/ki-coordination skills/governance/ki-work-package skills/governance/ki-delegation output-styles/ki-coordinator.md 2>/dev/null) || return 0
  [ -n "$revision" ] || return 0
  current=$(git -C "$harness" rev-parse --short "$revision" 2>/dev/null) || return 0
  for state in "$checkout"/+/_WORK/*/state.md; do
    [ -f "$state" ] && [ ! -L "$state" ] && [ ! -L "$(dirname "$state")" ] || continue
    definition="$(dirname "$state")/work.md"
    [ -f "$definition" ] && [ ! -L "$definition" ] || continue
    level=$(field "$definition" level) || continue
    case "$level" in territory|project) ;; *) continue ;; esac
    held=$(field "$state" state) || continue
    case "$held" in on-hold|finished|'') continue ;; esac
    read_method=$(field "$state" method_read) || continue
    [ -n "$read_method" ] || continue
    read_revision=$(git -C "$harness" rev-parse --verify --end-of-options "$read_method^{commit}" 2>/dev/null) || continue
    [ "$read_revision" != "$revision" ] || continue
    printf '\nMETHOD-NUDGE: %s method_read %s; current method %s. Follow Refreshing this guidance.' "$(basename "$(dirname "$state")")" "$read_method" "$current"
  done
  return 0
}
if [ "$event" = UserPromptSubmit ]; then
  context="$context$(method_warning)"
fi

jq -cn --arg event "$event" --arg line "$context" \
  '{hookSpecificOutput: {hookEventName: $event, additionalContext: $line}}' 2>/dev/null || exit 0

exit 0
