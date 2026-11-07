#!/usr/bin/env bash
# Stop: hold a coordinating reply back only when its footer has lost its structure,
# and warn on anything else unusual. A Summary or a Status, a re-bootstrap or hold
# report, a reply that already opens a banner, and a reply to an owner's mark or
# state word must close with a banner: a ### state heading and the 🧵 <work-id>
# thread line, last. An unrecognised state heading, a missing or odd counts line,
# and in a Summary or Status missing art, roadmap or package line pass with a
# warning, so the owner can confirm the form was intended.
# Quiet for conversational replies and launched agents; never blocks twice in a
# row, only warning then; fails open on unusable input.
set -u

[ -z "${KI_AGENT_RUN:-}" ] || exit 0
[ -z "${CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS:-}" ] || exit 0

command -v jq >/dev/null 2>&1 || exit 0
input=$(cat 2>/dev/null) || exit 0
[ -n "$input" ] || exit 0

fields=$(printf '%s' "$input" | jq -r '
  select(type == "object" and .hook_event_name == "Stop")
  | [(.stop_hook_active // false | if . == false then "false" elif . == true then "true" else error end),
     (.cwd | strings // ""),
     (.transcript_path | strings // "")]
  | join("\u001f")' 2>/dev/null) || exit 0
[ -n "$fields" ] || exit 0
# A non-whitespace separator keeps an empty field in its place.
IFS=$'\x1f' read -r active cwd transcript <<<"$fields"
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
  /^## Summary since / || /^\*\*.* · (Summary|Status) at / { print "summary"; exit }
  /^\*\*.* · (Re-bootstrap|Hold report|Finish report) at / || /^### .*(With worker|Handoff to|With supervisor|On hold|Snoozing|Finished)/ || /^🧵 [^ ]+ *$/ { other = 1 }
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
    mark | 'mark only' | 'mark, status only' | 'mark status only' | summary | 'summary since '* | recap | 'recap and mark' | 'full summary' | 'summary in full' | status | \
      pause | 'done for now' | snooze | drain | hold | resume | finish | send | receive | 'with me' | ack | 'got it' | seen) ;;
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

# Two lists, separated by a unit separator: the structural parts whose loss holds the
# reply back, then the unusual parts that only warn.
found=$(printf '%s\n' "$reply" | LC_ALL=C awk -v long="$([ "$form" = summary ] && echo 1 || echo 0)" -v art="$art" -v roadmap="$roadmap" '
  function join(list, n,   i, out) {
    out = ""
    for (i = 1; i <= n; i++) out = out (i > 1 ? (i == n ? " and " : ", ") : "") list[i]
    return out
  }
  { sub(/\r$/, "") }
  # The art sits in a fence of its own; nothing else in a fence counts.
  index($0, "KNOWLEDGE  ISLANDS") { art_at = NR }
  /^(```|~~~)/ { fence = !fence; last = NR; next }
  /^[[:space:]]*$/ { next }
  fence { last = NR; next }
  {
    last = NR
    # A state heading opens with its glyph or names a state; a query or finding heading opens with its tag.
    state = $0 ~ /^### .*(With worker|Handoff to|With supervisor|On hold|Snoozing|Finished)/
    if (state || $0 ~ /^### [^ -~]/) { heading = NR; known = state; finished = index($0, "Finished") > 0; counts_seen = 0; counts = 0; odd = 0; road = 0; pack = 0; next }
    if (heading && !counts_seen) {
      counts_seen = 1
      if ($0 !~ /^(- \[|🧵|🗺|📦|👂|🔇|↪)/) { counts = 1; odd = $0 !~ /^(🤖|👤|⛔|🅿|⏸|💤|📥|🎯|⏳)/ }
    }
    if (heading && $0 ~ /^🗺/ && index($0, "roadmap")) road = 1
    if (heading && $0 ~ /^📦/ && index($0, "package")) pack = 1
    if ($0 ~ /^🧵 [^ ]+ *$/) thread = NR
  }
  END {
    b = 0; w = 0
    if (!heading) block[++b] = "the banner\047s ### state heading"
    if (!thread) block[++b] = "the 🧵 <work-id> thread line, last"
    else if (thread != last) block[++b] = "the 🧵 thread line as the very last line"
    if (heading && !known) warn[++w] = "a state heading the table of states does not name"
    if (heading && !finished && !counts) warn[++w] = "no counts line beneath the state heading"
    if (heading && counts && odd) warn[++w] = "a counts line opening with none of the counts glyphs"
    if (long && art && (!art_at || (heading && art_at > heading))) warn[++w] = "no Knowledge Islands art above the banner"
    if (long && roadmap && !road) warn[++w] = "no 🗺️ roadmap line"
    if (long && !pack) warn[++w] = "no 📦 package line"
    printf "%s\037%s\n", join(block, b), join(warn, w)
  }')
IFS=$'\x1f' read -r missing unusual <<<"$found"
# Already continuing because of a Stop hook: warn, never block again.
if [ "$active" = true ] && [ -n "$missing" ]; then
  unusual="a footer without $missing${unusual:+, and }$unusual"
  missing=
fi
[ -n "$missing$unusual" ] || exit 0

if [ "$form" = summary ]; then what="Summary's footer"; else what="reply's banner"; fi
if [ -n "$missing" ]; then
  note=
  [ -z "$unusual" ] || note=" It also has $unusual; keep that only where the owner asked for it."
  jq -cn --arg reason "This $what lacks $missing, under ki-coordination's Banner section. Give the reply again in full with them, since the last text is what the owner reads.$note" \
    '{decision: "block", reason: $reason}' 2>/dev/null || exit 0
else
  jq -cn --arg message "Footer check: this $what has $unusual. It was let through; confirm it was intended, since ki-coordination's Banner section sets the usual form." \
    '{systemMessage: $message}' 2>/dev/null || exit 0
fi

exit 0
