#!/usr/bin/env bash
# Stop: hold a coordinating reply back only when its footer has lost its structure,
# and warn on anything else unusual. A Summary or a Status, a Bootstrap or a Stop,
# a reply that already opens a banner, and a reply to an owner's mark, state word
# or Position phrase must close with a banner: a ### state heading and the thread
# line, last: <role glyph> 🔑 <work-id>, <role glyph> <work-id>+<role> for a seat
# without the package's keys (SEAT-LINE), or 🧵 <work-id> for a session with no role
# yet. An unrecognised state heading, a missing or odd counts line, a missing
# listening line before Finished, ⭐, 🔧 or 🧵 in the role glyph's place, and in a
# Summary or Status missing art, roadmap or package line pass with a warning, so the owner can confirm the form was intended. The
# hook holds no copy of the role catalogue, which ki-work-package owns.
# In every session, coordinating or not, a reply that asks the owner to decide, a
# fenced text block holding <TAG> <letter> lines, is held back unless the block opens
# with a `1 · ` group heading and every such line reads <TAG> <letter> (high|medium|low),
# with an optional `: <gloss>` (REPLY-CHECK). Otherwise quiet for conversational
# replies; never blocks twice in a row, only warning then; fails open on unusable input.
set -u

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

# The reply block, in every session: read only where the reply has a fenced text block.
# A top-level ```text or ~~~text block holding a <TAG> <letter> line, the tag two or more
# capitals, digits and hyphens, the letter followed by the line's end, a space or a
# colon, is a decision request; anything else in a fence is passed over.
blockfix=
case $reply in
  *'```text'* | *'~~~text'*)
    blockfix=$(printf '%s\n' "$reply" | LC_ALL=C awk '
      function trim(s) { sub(/^[ \t]+/, "", s); sub(/[ \t\r]+$/, "", s); return s }
      function tagline(s,   t) {
        if (s !~ /^[A-Z0-9]+(-[A-Z0-9]+)* [a-z]($|[ :])/) return 0
        t = substr(s, 1, index(s, " ") - 1)
        return length(t) > 1 && t ~ /[A-Z]/
      }
      function closed() { if (text && tags && first !~ /^1 · ./) unheaded = 1 }
      {
        line = $0
        sub(/\r$/, "", line)
        if (!open) {
          if (match(line, /^ ? ? ?(````*|~~~~*)/)) {
            fence = substr(line, RSTART, RLENGTH)
            sub(/^ */, "", fence)
            mark = substr(fence, 1, 1); width = length(fence)
            open = 1; text = trim(substr(line, RSTART + RLENGTH)) == "text"; first = ""; tags = 0
          }
          next
        }
        if (line ~ /^ ? ? ?(````*|~~~~*)[ \t]*$/) {
          fence = line
          gsub(/[ \t]/, "", fence)
          if (substr(fence, 1, 1) == mark && length(fence) >= width) { closed(); open = 0; next }
        }
        if (!text) next
        s = trim(line)
        if (s == "") next
        if (first == "") first = s
        if (!tagline(s)) next
        tags = 1
        if (s !~ /^[^ ]+ [a-z] \((high|medium|low)\)(: .+)?$/ && bad < 5) list[++bad] = substr(s, 1, index(s, " ") + 1)
      }
      END {
        if (open) closed()
        n = 0
        if (unheaded) part[++n] = "does not open with its first group heading, 1 · <what the group is>"
        if (bad) {
          out = list[1]
          for (i = 2; i <= bad; i++) out = out ", " list[i]
          part[++n] = "has " (bad > 1 ? "lines" : "a line") " without (high), (medium) or (low) after the letter: " out
        }
        if (n) print part[1] (n > 1 ? " and " part[2] : "")
      }') || blockfix=
    ;;
esac

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

# The footer, for coordinating replies only: sets form, then missing, the structural parts whose
# loss holds the reply back, and unusual, the parts that only warn.
form=
missing=
unusual=
footer() {
  form=$(printf '%s\n' "$reply" | LC_ALL=C awk '
    /^(```|~~~)/ { fence = !fence; next }
    fence { next }
    /^## Summary$/ || /^## Summary since / || /^\*\*(.* · )?(Summary|Status) at / { print "summary"; exit }
    /^\*\*(.* · )?(Bootstrap|Stop|Re-bootstrap|Hold report|Finish report) at / || /^### .*(With worker|Handoff to|With supervisor|On hold|Snoozing|Finished)/ || /^(🧵|[^ -~]+ 🔑) [^ ]+ *$/ || /^[^ -~]+ [a-z0-9-]+([.][a-z0-9-]+)+[+][a-z]+(-[a-z]+)* *$/ { other = 1 }
    END { if (other) print "banner" }')

  if [ -z "$form" ]; then
    # No footer form of its own: only an owner's mark, state word or Position phrase, in a session
    # that has already closed a reply with a thread line in either form, asks for
    # the banner.
    [ -n "$transcript" ] && [ -d "$cwd" ] || return 0
    capable() { [ -f "$1/.ki.toml" ] && grep -Eq '^\[skills\.ki-coordination\]' "$1/.ki.toml" 2>/dev/null; }
    if ! capable "$cwd"; then
      top=$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null) || return 0
      capable "$top" || return 0
    fi
    prompt=$(owner_prompt) || return 0
    prompt=${prompt% no art}
    case "$prompt" in
      mark | 'mark only' | 'mark, status only' | 'mark status only' | summary | 'summary since '* | recap | 'recap and mark' | 'full summary' | 'summary in full' | status | \
      'where are we' | 'where does it stand' | "what's the state" | \
        pause | 'done for now' | snooze | drain | hold | resume | finish | send | receive | 'with me' | ack | 'got it' | seen) ;;
      *) return 0 ;;
    esac
    recent | LC_ALL=C grep -F '"type":"assistant"' | LC_ALL=C grep -Eq '(\\n|")((🧵|[^ -~"\\]+ 🔑) [A-Za-z0-9][A-Za-z0-9._+-]*|[^ -~"\\]+ [a-z0-9-]+([.][a-z0-9-]+)+[+][a-z]+(-[a-z]+)*)(\\n|")' || return 0
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
    # The roadmap line shows always, `🗺️ roadmap · none` where there is no roadmap.
    roadmap=1
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
      key = $0 ~ /^[^ -~]+ 🔑 [^ ]+ *$/
      keyless = $0 ~ /^[^ -~]+ [a-z0-9-]+([.][a-z0-9-]+)+[+][a-z]+(-[a-z]+)* *$/
      is_thread = key || keyless || $0 ~ /^🧵 [^ ]+ *$/
      # A state heading opens with its glyph or names a state; a query or finding heading opens with its tag.
      state = $0 ~ /^### .*(With worker|Handoff to|With supervisor|On hold|Snoozing|Finished)/
      if (state || $0 ~ /^### [^ -~]/) { heading = NR; known = state; finished = index($0, "Finished") > 0; counts_seen = 0; counts = 0; odd = 0; road = 0; pack = 0; listen = 0; next }
      if (heading && !counts_seen) {
        counts_seen = 1
        if (!is_thread && $0 !~ /^(- \[|🧵|🗺|📦|👂|🔇|↪)/) { counts = 1; odd = $0 !~ /^(🤖|👤|⛔|🅿|⏸|💤|📥|🎯|⏳)/ }
      }
      if (heading && $0 ~ /^🗺/ && index($0, "roadmap")) road = 1
      if (heading && $0 ~ /^📦/ && index($0, "package")) pack = 1
      if (heading && $0 ~ /^(👂 listening|🔇 not listening)/) listen = 1
      if (is_thread) {
        thread = NR
        glyphs = key ? substr($0, 1, index($0, " 🔑") - 1) : keyless ? substr($0, 1, index($0, " ") - 1) : ""
        marks = index(glyphs, "⭐") || index(glyphs, "🔧")
        spun = index(glyphs, "🧵") > 0
      }
    }
    END {
      b = 0; w = 0
      if (!heading) block[++b] = "the banner\047s ### state heading"
      if (!thread) block[++b] = "the thread line, <role glyph> 🔑 <work-id> or 🧵 <work-id>, last"
      else if (thread != last) block[++b] = "the thread line as the very last line"
      if (thread && marks) warn[++w] = "⭐ or 🔧 beside the role glyph, which the role standard retires"
      if (thread && spun) warn[++w] = "🧵 in the role glyph\047s place; a seat with a role closes <role glyph> 🔑 <work-id>"
      if (heading && !known) warn[++w] = "a state heading the table of states does not name"
      if (heading && !finished && !counts) warn[++w] = "no counts line beneath the state heading"
      if (heading && counts && odd) warn[++w] = "a counts line opening with none of the counts glyphs"
      if (heading && known && !finished && !listen) warn[++w] = "no listening line, 👂 listening or 🔇 not listening"
      if (long && art && (!art_at || (heading && art_at > heading))) warn[++w] = "no Knowledge Islands art above the banner"
      if (long && roadmap && !road) warn[++w] = "no 🗺️ roadmap line"
      if (long && !pack) warn[++w] = "no 📦 package line"
      printf "%s\037%s\n", join(block, b), join(warn, w)
    }')
  IFS=$'\x1f' read -r missing unusual <<<"$found"
}
footer

shape="under ki-coordination's owner report, a reply block opens with a 1 · <what the group is> heading and each line reads <TAG> <letter> (high), (medium) or (low), an optional : <gloss> after it"
blockwarn=
# Already continuing because of a Stop hook: warn, never block again.
if [ "$active" = true ]; then
  if [ -n "$missing" ]; then
    unusual="a footer without $missing${unusual:+, and }$unusual"
    missing=
  fi
  [ -z "$blockfix" ] || blockwarn="Reply block check: this reply's reply block $blockfix; $shape. It was let through, since the hook never holds a reply back twice in a row."
  blockfix=
fi
[ -n "$missing$unusual$blockfix$blockwarn" ] || exit 0

if [ "$form" = summary ]; then what="Summary's footer"; else what="reply's banner"; fi
if [ -n "$missing$blockfix" ]; then
  reason=
  fix='with the reply block put right'
  if [ -n "$missing" ]; then
    reason="This $what lacks $missing, under ki-coordination's Banner section."
    fix='with them'
  fi
  [ -z "$blockfix" ] || reason="${reason:+$reason }This reply's reply block $blockfix; $shape."
  note=
  if [ -n "$unusual" ]; then
    if [ -n "$missing" ]; then note=" It also has $unusual"; else note=" The $what also has $unusual"; fi
    note="$note; keep that only where the owner asked for it."
  fi
  jq -cn --arg reason "$reason Give the reply again in full $fix, since the last text is what the owner reads.$note" \
    '{decision: "block", reason: $reason}' 2>/dev/null || exit 0
else
  message=
  [ -z "$unusual" ] || message="Footer check: this $what has $unusual. It was let through; confirm it was intended, since ki-coordination's Banner section sets the usual form."
  [ -z "$blockwarn" ] || message="${message:+$message }$blockwarn"
  jq -cn --arg message "$message" '{systemMessage: $message}' 2>/dev/null || exit 0
fi

exit 0
