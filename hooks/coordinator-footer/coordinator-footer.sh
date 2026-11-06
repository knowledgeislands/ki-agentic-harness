#!/usr/bin/env bash
# Stop: hold a coordinating reply back until it carries the footer ki-coordination
# sets. A Summary needs the long form: the art, then the banner with its roadmap
# and package lines; a re-bootstrap or hold report, a reply that already opens a
# banner, and a reply to an owner's mark or state word need the short form: the
# banner's state heading, its counts line (none when Finished) and the thread
# line, last.
# Quiet for conversational replies and launched agents; never blocks twice in a
# row; fails open on unusable input.
set -u

[ -z "${KI_AGENT_RUN:-}" ] || exit 0
[ -z "${CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS:-}" ] || exit 0

command -v jq >/dev/null 2>&1 || exit 0
input=$(cat 2>/dev/null) || exit 0
[ -n "$input" ] || exit 0

fields=$(printf '%s' "$input" | jq -r '
  select(type == "object" and .hook_event_name == "Stop")
  | [(if (.stop_hook_active // false) == false then "false" else "true" end),
     (.cwd | strings // ""),
     (.transcript_path | strings // "")]
  | join("\u001f")' 2>/dev/null) || exit 0
[ -n "$fields" ] || exit 0
# A non-whitespace separator keeps an empty field in its place.
IFS=$'\x1f' read -r active cwd transcript <<<"$fields"
# The session is already continuing because of a Stop hook: never loop.
[ "$active" = false ] || exit 0
[ -n "$cwd" ] || cwd=$PWD
[ -f "$transcript" ] || transcript=

# The transcript's last 8 MiB or so, skipped to in whole blocks: `tail -c` reads
# the whole file first, and a transcript can run to hundreds of megabytes.
recent() {
  size=$(wc -c <"$transcript" 2>/dev/null) || return 1
  blocks=$((size / 1048576))
  dd if="$transcript" bs=1048576 skip=$((blocks > 8 ? blocks - 8 : 0)) 2>/dev/null
}

# Claude Code hands over the reply's text; older versions only the transcript.
reply=$(printf '%s' "$input" | jq -r '.last_assistant_message | strings' 2>/dev/null) || exit 0
if [ -z "$reply" ] && [ -n "$transcript" ]; then
  reply=$(recent | LC_ALL=C grep -F '"type":"assistant"' | tail -n 1 |
    jq -rR 'fromjson? | .message.content | arrays | map(select(.type == "text") | .text) | join("\n")' 2>/dev/null)
fi
[ -n "$reply" ] || exit 0

# The owner's last prompt, read only when needed: typed text or a /ki-coordination
# argument, skipping tool results, meta lines and task notifications.
owner_prompt() {
  [ -n "$transcript" ] || return 1
  recent | LC_ALL=C grep -F '"type":"user"' | LC_ALL=C grep -vF '"tool_result"' | tail -n 20 |
    jq -rRn '[inputs | fromjson? | select(.isMeta != true) | .message.content
      | if type == "string" then . elif type == "array" then (map(select(.type == "text") | .text) | join("\n")) else "" end
      | select(test("\\S")) | select(startswith("<task-notification>") | not)] | last // empty
      | if test("<command-name>/ki-coordination</command-name>") then ((capture("<command-args>(?<a>[^<]*)</command-args>").a) // "") else . end
      | ascii_downcase | gsub("\\s+"; " ") | sub("^ "; "") | sub(" $"; "") | sub("[.!]+$"; "")' 2>/dev/null
}

form=$(printf '%s\n' "$reply" | awk '
  /^(```|~~~)/ { fence = !fence; next }
  fence { next }
  /^## Summary since / || /^\*\*.* · Summary at / { print "summary"; exit }
  /^\*\*.* · (Re-bootstrap|Hold report) at / || /^### .*(With worker|Handoff to|With supervisor|On hold|Finished)/ || /^🧵 [^ ]+ *$/ { other = 1 }
  END { if (other) print "banner" }')

if [ -z "$form" ]; then
  # No footer form of its own: only an owner's mark or state word, in a session
  # that has already closed a reply with a thread line, asks for the banner.
  [ -n "$transcript" ] && [ -d "$cwd" ] || exit 0
  capable() { [ -f "$1/.ki.toml" ] && grep -Eq '^\[skills\.ki-coordination\]' "$1/.ki.toml" 2>/dev/null; }
  if ! capable "$cwd"; then
    top=$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null) || exit 0
    capable "$top" || exit 0
  fi
  prompt=$(owner_prompt) || exit 0
  prompt=${prompt% no art}
  case "$prompt" in
    mark | 'mark only' | summary | 'summary since '* | recap | 'recap and mark' | 'full summary' | 'summary in full' | status | \
      pause | 'done for now' | drain | hold | resume | finish | send | receive | 'with me' | ack | 'got it' | seen) ;;
    *) exit 0 ;;
  esac
  recent | LC_ALL=C grep -F '"type":"assistant"' | LC_ALL=C grep -Eq '(\\n|")🧵 [A-Za-z0-9][A-Za-z0-9._-]*(\\n|")' || exit 0
  form=banner
fi

art=0
roadmap=0
if [ "$form" = summary ]; then
  art=1
  if ! printf '%s\n' "$reply" | grep -Fq 'KNOWLEDGE  ISLANDS'; then
    # `no art` leaves the art out; an unreadable prompt leaves the art unasked.
    prompt=$(owner_prompt) || prompt='no art'
    case "$prompt" in '' | *'no art'*) art=0 ;; esac
  fi
  top=$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null) || top=$cwd
  [ ! -d "$top/docs/roadmap" ] || roadmap=1
fi

missing=$(printf '%s\n' "$reply" | awk -v long="$([ "$form" = summary ] && echo 1 || echo 0)" -v art="$art" -v roadmap="$roadmap" '
  { sub(/\r$/, "") }
  # The art sits in a fence of its own; nothing else in a fence counts.
  index($0, "KNOWLEDGE  ISLANDS") { art_at = NR }
  /^(```|~~~)/ { fence = !fence; last = NR; next }
  /^[[:space:]]*$/ { next }
  fence { last = NR; next }
  {
    last = NR
    if ($0 ~ /^### .*(With worker|Handoff to|With supervisor|On hold|Finished)/) { heading = NR; finished = index($0, "Finished") > 0; counts_seen = 0; counts = 0; road = 0; pack = 0; next }
    if (heading && !counts_seen) { counts_seen = 1; if ($0 !~ /^(- \[|🧵|🗺|📦|👂|🔇|↪)/) counts = 1 }
    if (heading && $0 ~ /^🗺/ && index($0, "roadmap")) road = 1
    if (heading && $0 ~ /^📦/ && index($0, "package")) pack = 1
    if ($0 ~ /^🧵 [^ ]+ *$/) thread = NR
  }
  END {
    n = 0
    if (long && art && (!art_at || (heading && art_at > heading))) parts[++n] = "the Knowledge Islands art above the banner"
    if (!heading) parts[++n] = "the ### state heading of the banner"
    if (!finished && !counts) parts[++n] = "the counts line beneath the state heading"
    if (long && roadmap && !road) parts[++n] = "the 🗺️ roadmap line"
    if (long && !pack) parts[++n] = "the 📦 package line"
    if (!thread) parts[++n] = "the 🧵 <work-id> thread line, last"
    else if (thread != last) parts[++n] = "the 🧵 thread line as the very last line"
    for (i = 1; i <= n; i++) printf "%s%s", (i > 1 ? (i == n ? " and " : ", ") : ""), parts[i]
  }')
[ -n "$missing" ] || exit 0

if [ "$form" = summary ]; then what="This Summary's footer lacks"; else what="This reply's banner lacks"; fi
jq -cn --arg reason "$what $missing, under ki-coordination's Banner section. Give the reply again in full with them, since the last text is what the owner reads." \
  '{decision: "block", reason: $reason}' 2>/dev/null || exit 0

exit 0
