# Coordinating-thread standard

## Contents

- [Scope](#scope)
  - [The responsive coordinator](#the-responsive-coordinator)
  - [Glossary](#glossary)
  - [Thread types](#thread-types)
- [Coordinator responsiveness](#coordinator-responsiveness)
- [Coordinating-thread practices](#coordinating-thread-practices)
  - [Banner](#banner)
  - [Re-anchoring after compaction](#re-anchoring-after-compaction)
  - [Surfaces](#surfaces)
  - [Recovering a thread showing a red x](#recovering-a-thread-showing-a-red-x)
- [Report forms](#report-forms)
  - [Full summary](#full-summary)
- [Coordination threads](#coordination-threads)
  - [State-of-play thread](#state-of-play-thread)
  - [Opening a thread](#opening-a-thread)
  - [Bootstrap](#bootstrap)
  - [Directions from the state-of-play thread](#directions-from-the-state-of-play-thread)
- [Decisions and design](#decisions-and-design)
  - [Decision classes](#decision-classes)
  - [One list](#one-list)
  - [Design notes](#design-notes)
  - [Project close](#project-close)
- [Thread working rules](#thread-working-rules)
  - [Recap since the mark](#recap-since-the-mark)
  - [Parking tangents](#parking-tangents)
  - [Linking records](#linking-records)
  - [Committing the thread folder](#committing-the-thread-folder)
  - [Keeping primary checkouts current](#keeping-primary-checkouts-current)
  - [Refreshing this guidance](#refreshing-this-guidance)
- [Mechanical boundary](#mechanical-boundary)

## Scope

A coordinating thread - a coordination thread or the state-of-play thread - is the owner's project-management office for Knowledge Islands work: it dispatches work, decides with the owner and reports. This standard owns how such a thread behaves, reports and keeps itself current, and it defines the three [thread types](#thread-types) every Knowledge Islands thread is one of. It is the thread half of the practice that the `ki-delegation` [background-run standard](../../../governance/ki-delegation/references/standards-background-runs.md) governs on the run side: detachment, the run packet, prompt shape, authority tiers, the decisions log, coordination, the run queue, monitoring, and the [owner report](../../../governance/ki-delegation/references/standards-background-runs.md#owner-report) with its [Needs tags](../../../governance/ki-delegation/references/standards-background-runs.md#needs-tags), which every report in this standard takes and this standard adopts by reference rather than restating. The thread's checkpoint is a `ki-checkpoint` record under [the checkpoint standard](../../../governance/ki-checkpoint/references/standards-checkpoints.md).

A repository that runs coordinating threads declares `[skills.ki-pmo]` in its `.ki.toml`. The declaration is the signal the runtime hook and the output style key on, so a repository that does not delegate never gets them.

### The responsive coordinator

Every rule in this standard serves one principle, which Kris set for threads on 2026-10-13 in these words:

> It's imperative that you do not do the work directly and that you delegate that work to subagents so that you remain responsive. And if I send you a message, it doesn't preempt any work that you are already doing. This is a fundamental requirement of the delegation capability.

Three rules follow from it, and they are hard:

1. **The thread never does substantive work itself.** A coordinating thread dispatches, decides with the owner and reports. Nothing else.
2. **Every unit of work goes to a detached background agent.** Through `ki agent`, in its own session, surviving anything that happens to the thread. An in-session subagent is not a background agent.
3. **An owner message never pre-empts work in flight.** It steers: the thread folds it into running and queued work and answers within one short turn. A background agent stops only when the owner names it and says stop.

Four layers enforce them in a coordinating thread: the opener's role line carries the three rules in Kris's words, and the thread re-bootstraps on request, after a compaction and after a model switch; a runtime hook restates them on every owner message and points the thread at [re-anchoring](#re-anchoring-after-compaction) after compaction; the counted turn budget and self-check under [Coordinator responsiveness](#coordinator-responsiveness) bound each turn; and the acceptance tests the pilot record sets are run and scored from the session transcript. The harness also ships the `ki-coordinator` output style, whose text is these three rules and the owner-report shape, so that the style a coordinating thread runs under and this contract are one document; a declaring repository selects it with `outputStyle` in its tracked `.claude/settings.json`.

### Glossary

These words carry this practice, each with one owner. Kris adopted the first three on 2026-10-14 with "adopt thread, session and chat terms":

| Term | Meaning | Owner |
| --- | --- | --- |
| thread | One named line of work between the owner and an agent that outlives any runtime instance; its identity is its `ki-checkpoint` record where it has one, and its type is one of the three [thread types](#thread-types) | identity `ki-checkpoint`, behaviour `ki-pmo` |
| session | One runtime instance carrying a thread's turns: a Claude Code or Codex process, a Zed tab, a `claude -p` run. A thread spans sessions across compaction, red-x recovery or a new day; a session carries at most one thread | the runtime, `ki-recap` |
| chat | Not a Knowledge Islands term. The vendor's word for a session's transcript in Claude Desktop, ChatGPT and the like, used only when naming a vendor artefact that is imported or cleaned up | `ki-housekeeping-claude` and its siblings |
| run | A named set of agents sharing one state folder for runtime files and one tracked thread folder for knowledge files | `ki-delegation` |
| worker | The role an agent plays in a run: it delivers one unit of work and reports in owner-report form | `ki-delegation` |
| agent | A process `ki agent` launches detached under the background-run contract; an in-session subagent is not one | `ki-delegation` |

### Thread types

Every thread is one of three types, which Kris adopted on 2026-10-14 with "adopt the three thread types conversational, coordination and state-of-play, replacing the old names". The names "project thread" and "territory master thread" are retired; an opener or checkpoint that still uses them means the coordination thread and the state-of-play thread respectively, until it is re-bootstrapped. A thread with no stated type is conversational.

| | Conversational | Coordination | State-of-play |
| --- | --- | --- | --- |
| Purpose | Does one bounded piece of work with the owner directly | Coordinates one Project through background agents | Coordinates the territory's coordination threads; project management only |
| Delegates | May, but need not | Always, under the three rules | Always, under the three rules |
| Identity | None required; an optional generic checkpoint | `+/_CHECKPOINTS/<initiative>.<project>.md`, label `<Initiative title>: <project>` | `+/_CHECKPOINTS/_state-of-play.md` in the Capital, label `Master: state-of-play` |
| Run and thread folder | None | Run `<project>`, folder `+/_THREADS/<project>/` | Run `<territory>-state-of-play`, folder `+/_THREADS/<territory>-state-of-play/` |
| Decisions | In the work it drives | The Project's [one list](#one-list) in the thread folder | Its own list in its thread folder |
| Banner | None; ends DONE through `ki-recap` | REST or BUSY; DONE once at [Project close](#project-close) | REST or BUSY; DONE only at territory close |
| Governed by | `ki-recap` and the skills the work declares | This standard | This standard |

The conversational thread is the default and is named for what it is, a conversation, rather than "ad hoc". The coordination thread and the state-of-play thread are the coordinating threads this standard governs; where this standard says "coordinating thread" it means both.

## Coordinator responsiveness

A coordinating thread is a coordinator. It dispatches work, decides with the owner and reports; it hands substantive reasoning, analysis and drafting to background agents rather than doing them in-thread. Because the reasoning happens in those agents, a coordinating thread runs on the lighter model purpose `ki-tokenomics` recommends for coordination, and heavier models are reserved for the background agents.

The coordinating thread stays responsive to the owner, so the owner never has to remind it to delegate. These rules are hard and checkable from its transcript:

- **Turn budget:** a coordinator turn makes at most five tool calls and returns to the owner. Its reads are limited to the checkpoint, `ki agent status`, one report and one short file; its writes are limited to the checkpoint, the decisions log and a brief. Anything beyond is a launch. A step goes to a background agent if it reads more than one or two short files, writes or edits more than a checkpoint line or a decision, runs tests, audits or builds, or would take more than about a minute.
- **Never in-thread:** analysis, design, drafting prose or prompts longer than a short brief, code or document edits, multi-repository investigation, and waiting in the foreground for an agent.
- **Waiting:** always through a detached waiter or monitor under the `ki-delegation` [run queue](../../../governance/ki-delegation/references/standards-background-runs.md#run-queue) and [monitoring](../../../governance/ki-delegation/references/standards-background-runs.md#monitoring) rules, never a foreground wait or sleep.
- **Brief-writing:** the coordinator writes only a short brief citing the owner's decisions. If the brief itself needs research, a background agent researches and writes it.
- **Self-check:** before each tool call, the coordinator asks whether it is a quick check or bookkeeping; if not, it delegates. When it notices it has drifted into doing work, it stops, delegates the rest, tells the owner in one line and notes the drift in its checkpoint.
- **Tool calls:** every coordinator tool call is short. It never pastes a prompt, brief or other long text inline in a command: prompt files are written out of sight, with `ki agent new` or a one-line copy of a prepared file. A lookup that needs more than one or two short reads is delegated. Replies carry no raw tool output; the coordinator says in plain language what the result means.
- **Owner messages:** a new owner message is a steering request, not a stop. The thread folds it into running and queued work - redirecting, re-queuing or recording a decision as needed - and keeps going. It stops or aborts a background agent or piece of work only when the owner expressly says to stop or abort it, naming the work. Because it is never mid-way through long work, it answers an owner message promptly.
- **Cadence:** the coordinator gives a timestamped one-line update when it launches work, when an agent finishes and while it waits, and reports in the [owner report](../../../governance/ki-delegation/references/standards-background-runs.md#owner-report) form. Between owner messages it has nothing else to say.

A runtime hook backs these rules: the harness `hooks/coordinator-reminder.sh` injects one line, this skill's text restating these rules, naming the cadence, the owner-report form and the banner, on every owner message, in a thread whose checkout declares `[skills.ki-pmo]` in the top-level `.ki.toml` of the hook's working directory or its Git top level. After a compaction it injects instead a pointer to [Re-anchoring after compaction](#re-anchoring-after-compaction). A repository that does not declare `ki-pmo` never gets the line, and removing the declaration disables it, as Kris settled on 2026-10-14: "HOOK-OWNER - (a). A repository that doesn't delegate then never gets the hook, and removing ki-pmo disables it." The hook stays silent in agents `ki agent` launches. It tells the runtimes apart as Kris approved the same day, "approve the hook runtime split": under Claude Code, where `CLAUDECODE` is set, it skips the terminal check, because Claude Code is interactive whether or not a terminal is attached, as in Zed; under Codex it keeps the terminal check until `KI_AGENT_RUN` reaches the Codex launcher. It is registered per machine by the user-environment manager.

## Coordinating-thread practices

A coordinating thread also follows these practices with the owner. Every report it gives is an [owner report](../../../governance/ki-delegation/references/standards-background-runs.md#owner-report), whose sections, queries and reply block are never shortened by any output style, proxy shaping block or communication level.

- **Questions:** a decision with clear options goes through the runtime's structured-question tool where one is available, recommended option first, a few questions per batch. The query keeps its [Needs tag](../../../governance/ki-delegation/references/standards-background-runs.md#needs-tags) either way.
- **Banner:** every Summary, every [recap](#recap-since-the-mark) and every [full summary](#full-summary) opens with one `#` banner heading, so each reads cold and several threads' updates read side by side, and closes with the [banner](#banner) frame and the resume line. The heading names the thread, its Project and Initiative as links where it has them, the window covered, and the thread's state: `working`, `resting`, or `waiting on <what>`. The state agrees with the closing frame: `working` under BUSY, `resting` or `waiting on <what>` under REST. The window is `since your last message` for a Summary, `since <mark>` for a recap and `since the thread began` for a full summary.
- **Heading levels:** in every form the banner is the `#` heading, the sections (`Decided`, `Done`, `In Progress`, `Queries`) are `##` headings, and each query and each topic sub-heading is `###`. No other heading levels appear.
- **Self-contained:** no Summary, recap or full summary says "unchanged, see earlier", "as before" or otherwise points back to an earlier report. What is still running and what is still open is restated in full each time, because the owner reads each one cold and the earlier message may be gone.
- **Resting point:** when the thread's work is largely complete, or it is waiting on the owner, another thread, a scheduled test or an external fix, it ends with a Summary, because that is the last message the owner sees until they return. Its heading states `resting` or `waiting on <what>` plainly, its closing frame reads REST, and the owner report between them lets the owner pick the thread up cold. Before it rests it [commits and pushes its thread folder](#committing-the-thread-folder).
- **Links:** every roadmap record a report names is linked by its full identifier to its local file, under [Linking records](#linking-records), and a pruned record is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`. The rubric flags any record identifier a thread report leaves unlinked.
- **Wording:** plain language, and "background agents", never "helpers". When the owner must paste a message into another thread, the thread gives it in a code block ready to copy.
- **Decisions:** the thread records each owner decision in the run's [decisions log](../../../governance/ki-delegation/references/standards-background-runs.md#decisions-log) before launching the work it authorises, in the turn the decision arrives, and verifies any later quotation from the transcript file, under the two rules that section sets. It classifies each entry under [Decision classes](#decision-classes) at the mark.
- **Messages:** a message from another thread reaches this one through its run's inbox, and a backend nudge is not visible progress; the [surfaces rule](#surfaces) says where the owner sees it.

### Banner

The banner closes every Summary, recap, full summary and [re-bootstrap](#bootstrap) report, after the reply block, so that the last thing the owner sees says whether the thread is at rest and gives them the one line that brings it back. Kris asked on 2026-10-14 that "every coordination-thread summary or owner report ends with a multi-line status banner modelled on the ki-recap banner. The banner states plainly whether the thread is AT REST (all work concluded, nothing in progress, no open queries) or not, and why. The banner carries one copyable resume line Kris can paste back into the thread later", settled the frame the same day with "(a). Yeah, that's great.", and, seeing threads render it differently after a re-bootstrap, said "when I'm asking threads to rebootstrap from PMO and Checkpoint and delegation, it's not doing the banner in the same way". So every thread renders it the same way, whether it has just bootstrapped, re-bootstrapped from this standard, `ki-checkpoint` and `ki-delegation`, or run for days: the frames below are the only frames, and a banner that differs from them is wrong.

The frame is the `ki-recap` frame: 52 display columns per framed line, measured by code point, a four-letter block word in `ki-recap`'s glyphs and three fixed side lines, never padded, reworded, coloured or improvised, so that transcript archives find a state by searching for its block word. Its top border carries the time the banner was issued, because Kris said on 2026-10-14 "Banner is great, but it needs the date it was issued to be more prominent than the mark" and then "Use ISO-8601 UTC for the issued too and fix the border": the top border reads `╭─ issued <YYYY-MM-DDTHH:MM:SSZ> ─` followed by enough `─` to reach the same 52 code points, then `╮`. The issued time is the only part of a frame that varies; the three word lines and the bottom border are fixed. The states come from Kris on 2026-10-14: "a conversational thread can be considered done. That's the end of the conversation. But a coordination thread can either be busy or at rest. Whether or not it then ends up being done is more a situation about the project itself, and in effect, it's when we say that project's closed and pull out and tidy up all of the stuff that's been happening."

- **REST:** nothing is running and nothing is queued, and only that. Open queries waiting on the owner, held items, parked items, an uncommitted checkpoint and unlogged decisions do not change the word, as Kris confirmed with "open queries do not make a thread BUSY"; they show on the lines beneath, where every open query has its own `waiting on you:` line.
- **BUSY:** anything is running or queued, or the thread is blocked or waiting on another thread. The lines beneath say which.
- **DONE:** shown once only, at [Project close](#project-close), after the close-out tidy. No resume line follows it. It shares its glyphs with `ki-recap`'s single-session frame and carries its own side lines, so the two are told apart by their words; in a coordinating thread `ki-recap`'s frame never renders, because `ki-recap` hands to these forms.

Beneath the frame, each line with three leading spaces: the label line, `<label> · mark <UTC>`; then one line per item, because Kris said on 2026-10-14 "the running should each be a line with the running: prefix": each running agent on its own `running: <agent> - <what>` line, each queued agent on its own `queued: <agent> - <what>` line and each open Needs tag on its own `waiting on you: <TAG> - <what>` line, in that order and only where they apply; then the housekeeping line with the checkpoint state, the thread folder state, held items and the parked count. The issued time lives in the top border and nowhere else. Another reason for BUSY takes a running or queued line in words, such as `waiting on: Master - HOOK-FIX` or `blocked: Headroom proxy down`, and the housekeeping line says `checkpoint uncommitted`, `thread folder unpushed` or `decisions unlogged: 2` plainly; a thread that has just recovered from a red x adds `recovered <UTC>` there for that one report. Nothing in the banner cites a decision number.

REST:

```text
╭─ issued 2026-10-14T09:04:00Z ────────────────────╮
│  █▀▀▄ █▀▀▀ █▀▀▀ ▀▀█▀   · thread at rest          │
│  █▀▀▄ █▀▀  ▀▀▀█   █    · nothing running         │
│  █  █ █▄▄▄ ▄▄▄█   █    · nothing queued          │
╰──────────────────────────────────────────────────╯
   KI Model: ways-of-working · mark 2026-10-13T04:03:00Z
   waiting on you: KI-RELEASE - approve the tools-ki release
   waiting on you: RESUME-COMPACT - run the Zed compact test
   checkpoint committed and pushed · thread folder committed and pushed · held: PAPERCLIP-REQ until Wave F · parked: 1
```

BUSY:

```text
╭─ issued 2026-10-14T09:04:00Z ────────────────────╮
│  █▀▀▄ █  █ █▀▀▀ █  █   · thread busy             │
│  █▀▀▄ █  █ ▀▀▀█  ▀█▀   · running or queued work  │
│  █▄▄▀ █▄▄█ ▄▄▄█   █    · lines below say which   │
╰──────────────────────────────────────────────────╯
   KI Model: ways-of-working · mark 2026-10-13T04:03:00Z
   running: harness-push - push the harness delivery
   queued: mark-tidy - tidy the mark rule
   queued: apps-sweep - sweep the apps repositories
   waiting on you: KI-RELEASE - approve the tools-ki release
   checkpoint committed, 1 commit unpushed · thread folder committed and pushed · held: PAPERCLIP-REQ until Wave F · parked: 1
```

DONE, at Project close only:

```text
╭─ issued 2026-11-02T16:10:00Z ────────────────────╮
│  █▀▀▄ █▀▀█ █▄ █ █▀▀▀   · project closed          │
│  █  █ █  █ █ ██ █▀▀    · decisions promoted      │
│  █▄▄▀ █▄▄█ █  █ █▄▄▄   · thread tidied away      │
╰──────────────────────────────────────────────────╯
   KI Model: ways-of-working · closed 2026-11-02T16:10:00Z
   decisions: every entry logged since 13 October promoted, none held
   design folder resolved · checkpoint retired · thread folder deleted · run archived
   outcome: the Project note links the Decision Record on thread working and the ki-pmo standard
```

**Resume line.** After REST or BUSY, the last thing in the message is the resume line, in its own one-line fenced `text` block so it copies cleanly, with the thread's label and its [mark](#recap-since-the-mark) filled in:

```text
Resume <label> under current ki-pmo and ki-delegation since <mark>: re-bootstrap, mark, fresh summary with carried-forward open points, take stock, restart authorised work, then banner.
```

Pasted back into the thread, it makes the thread do these in order: re-bootstrap under [Bootstrap](#bootstrap), re-reading this standard, `ki-delegation`'s Reporting and its own checkpoint; strike the mark at the resume time, commit the checkpoint and confirm in one line; give a fresh Summary covering only what follows the new mark plus every open point carried forward from before it, built from the checkpoint, the decisions log and the thread folder rather than from transcript memory; take stock since the issued time on the previous banner, from the decisions log, `ki agent status`, its inbox and the owner's messages; restart any work the owner authorised since that banner; and end with a fresh banner. The label on the line is a guard: a thread whose checkpoint label does not match it stops and asks before doing anything. Kris set the order on 2026-10-14: "The resume line is the equivalent of a compaction for the checkpoint and coordination thread, and may also trigger a real compaction", so it strikes the mark first and summarises second.

**In an agent's report.** A background agent that renders a frame in its report puts the frame inside a fenced `text` block, as the examples above do, because a frame outside one is not rendered byte-identical.

### Re-anchoring after compaction

A compaction keeps a thread's session but replaces its transcript with a summary, so the thread re-anchors from durable state before it replies. Kris chose on 2026-10-14 to "resume line with an optional compact paste first", so the owner may bring a long thread back with two pastes, the first optional:

```text
/compact Keep verbatim: thread id, Thread working rules block, mark, open Needs tags, running and queued agents, messages read to entry.
```

```text
Resume <label> under current ki-pmo and ki-delegation since <mark>: re-bootstrap, mark, fresh summary with carried-forward open points, take stock, restart authorised work, then banner.
```

The first line, where the runtime accepts `/compact <instructions>`, compacts the transcript keeping the named facts verbatim and ends the turn; the second is the [resume line](#banner) as it stands. The two cannot be one line because `/compact` ends the turn, and a compaction that is not needed throws away transcript detail for nothing, so the resume line alone is the default and the compact paste is the owner's call when the thread is long or has just recovered from an error.

Whether the compaction came from the owner or from the runtime, the thread then, before answering anything else:

1. re-reads this standard and its own checkpoint in full, including the `Thread working rules` block and the mark;
2. runs `ki agent status` and reads its inbox, so it knows what is running, queued and unread rather than assuming;
3. confirms in one line that it has re-anchored, then answers in owner-report form with the banner.

Re-anchoring moves no mark. The harness hook injects a one-line pointer to this subsection on a compact session start in Claude Code; a Codex thread re-anchors on the owner's next message, where the hook's ordinary line reaches it.

### Surfaces

A coordinating thread may receive a message from another thread through its run's inbox, `~/.local/state/ki/agents/<run>/inbox.md`, written with `ki agent decide <run> --log <inbox>` so that it is numbered and dated, and where the runtime can message another live session on the same machine, as Claude Code can and Codex cannot, the sender may also nudge a live session with one runtime message naming the entry. The rule, which Kris approved on 2026-10-14 with "approve the surfaces rule and the ki agent status follow-on", is that **a backend reply is not visible progress**: a reply to a nudge, or an inbox acknowledgement, counts as progress only once it is on a surface the owner looks at. The receiving thread writes what it did into its next owner-facing turn and its checkpoint; the sending thread keeps the item under its Needs tag, saying "acked by backend, not yet visible", until that happens. Neither thread tells the owner an item is done on the strength of a backend reply.

| Surface | Carries | Who writes it | When |
| --- | --- | --- | --- |
| Transcript | Owner turns and the thread's own replies; nothing injected | The thread, in its owner report | Every owner-facing turn names messages received and acknowledged since the last one, under a `Messages` line in the Summary |
| Checkpoint | `Current state` line `Messages: read to entry <n> at <UTC>`; open Needs tags from messages | The thread, under `ki-checkpoint` | At each checkpoint update and at the mark |
| Thread status line | `~/.local/state/ki/agents/<run>/thread.status`: one line, `HH:MM <zone> - <state word> - <what it is doing or waiting on>` | The thread, at each owner report and each banner | Listing threads beside runs in `ki agent status` is a `tools-ki` follow-on |
| Notification | Message received, acknowledgement sent, thread recovered, thread errored | Not this standard | The notification record in Knowledge Islands Principal owns the channel |

Until a notification channel exists, the checkpoint and the thread status line are the surfaces that survive a thread being idle, and the transcript is the one the owner reads first. A sender that only nudged without writing the inbox entry has not sent the message.

### Recovering a thread showing a red x

A red x in the editor's thread list means the backend turn errored, not that the thread is lost: the checkpoint, decisions log and inbox hold everything it needs. Kris approved the recovery on 2026-10-14 with "approve red-x recovery":

1. Do not open a new thread first. Paste that thread's [resume line](#banner) into the same thread. If the thread replies, it re-anchors, strikes the mark, gives a fresh summary since the mark and takes stock, and the inbox gives it every message the outage swallowed.
2. If the editor will not send into the thread, open a new thread in the same project folder and paste the resume line. The label on the line and the checkpoint label match, so the guard passes; the old transcript becomes history.
3. The recovered thread reports, under take stock, what it missed and what it did about it, and its banner says `recovered <UTC>` on the housekeeping line for that one report.

Messages sent during an outage need no re-send: the inbox is the channel, the nudge is lost, and the resume line's take stock reads the inbox.

## Report forms

A coordinating thread reports in three forms. Each is one [owner report](../../../governance/ki-delegation/references/standards-background-runs.md#owner-report) under the `#` banner heading, closing with the [banner](#banner) frame and the resume line, and they differ only in window and in what the window makes each section hold:

| Form | Window | Given | Sections |
| --- | --- | --- | --- |
| Summary | since your last message | proactively when background agents finish or the owner returns after a gap; on request, "summary"; and at a resting point | the owner report for the window; closes with the banner |
| [Recap](#recap-since-the-mark) | since the mark | on request, "recap"; "recap and mark" rolls up and then re-strikes | the owner report, with `Done` covering what was delivered, decided, started, stopped or blocked, and newly captured since the mark; closes with the banner |
| [Full summary](#full-summary) | since the thread began | on request, "full summary", "summary in full" or the like | `## Decided` first, then the owner report, each section whole-thread and every open query in full; closes with the banner |

A plain "summary" gets the Summary; "since the mark" gets the recap; "in full" or "full summary" gets the full summary. Only the recap interacts with the mark, and only when the owner says "mark". The skill is also invocable directly as `/ki-pmo summary`, `/ki-pmo recap`, `/ki-pmo full-summary` and `/ki-pmo mark`, which give the same forms and strike the mark; the invocation adds no fourth form. Every report is followed by [committing and pushing the thread folder](#committing-the-thread-folder).

### Full summary

A **full summary** is the owner report for the whole thread: everything decided, done, running and open since the thread began, in one reply, so that the owner holds all the context without reading earlier messages. Kris asked for it on 2026-10-13 as "a summary of things that have been decided, ongoing work and outstanding queries ... in full so I have all the context in one reply", and adopted the proposed shape the same day in the `ways-of-working` thread. A coordinating thread gives one whenever the owner asks for a "full summary", a "summary in full", or anything else that asks for the whole thread in one reply. It never moves the mark.

Its shape, in this order:

- **Banner heading:** the `#` [banner](#coordinating-thread-practices) heading, window `since the thread began`.
- **`## Decided`:** every owner decision since the thread began, as a numbered list or a two-column table, one line each in the order taken, each linked to its entry in the thread's tracked [decisions log](../../../governance/ki-delegation/references/standards-background-runs.md#decisions-log) or to the record that now holds it. A decision that a later one superseded stays on its line and says so.
- **`## Done`:** the whole thread's completed outcomes, grouped by topic under `###` sub-headings wherever more than a few lines would otherwise run together, with failures, corrections and limitations beside the outcomes they qualify.
- **`## In Progress`:** as the owner report, with `Outstanding - no action requested now` beneath it. A dated upcoming deadline or scheduled event belongs there with its date, so the owner sees what is coming without being asked anything.
- **`## Queries`:** every open query, however long it has been open, restated in full under its own `### <tag> - <title>` heading with Summary, Need from you and Recommendation, written to be answered cold. Nothing is shortened because it was asked before.
- **Reply block:** the fenced `text` block carries one stacked entry per open query, the tag alone on its line, a blank line, then the recommended instruction, entries separated by a blank line, `---` and a blank line, so the owner can send the block back as it stands or edit an entry, never a menu of the options, with a placeholder only where the owner alone can supply the value, under the `ki-delegation` [reply-block rule](../../../governance/ki-delegation/references/standards-background-runs.md#owner-report). Kris corrected the menu form on 2026-10-14: "the proposed copy block is including all the options, rather than the recommended option." and asked for the stacked layout the same day: "There's often quite a lot of detail now on per line."
- **Banner:** the closing [frame](#banner) and the resume line, after the reply block.

Low-stakes choices the thread has already made, where the owner's silence is consent, go in one query headed `DEFAULTS - defaults unless you say otherwise`: one line per choice, Need from you `nothing, unless you object`, Recommendation `keep the defaults`, and one reply-block entry, `DEFAULTS` on its line and `keep the defaults` beneath it. A choice the owner objects to becomes its own tagged query. A decision that is not low-stakes never goes there, and no other query bundles more than one decision: a query the owner cannot answer with one instruction is two queries.

Sources are the thread's decisions log from the thread's start, every background-agent report in the thread folder, the checkpoint's open Needs-tagged queries and parked tangents, `ki agent status`, and the Git history of the thread's scope since the checkpoint's `created_at`. Where a report is missing from the thread folder, the full summary says what it could not read rather than reconstructing it from memory.

## Coordination threads

A coordination thread coordinates exactly one Project for the owner. It is always delegation-based: it runs its work as background agents through `ki agent` under the `ki-delegation` [background-run standard](../../../governance/ki-delegation/references/standards-background-runs.md), in a run named after the Project, and keeps its own turns short under [Coordinator responsiveness](#coordinator-responsiveness).

- **Checkpoint:** the thread resumes from the Project's `ki-checkpoint` checkpoint, which holds current state only, and keeps it current. The checkpoint is named `<initiative>.<project>.md` and the state-of-play thread's `_state-of-play.md`, under [the checkpoint naming rule](../../../governance/ki-checkpoint/references/standards-checkpoints.md#coordination-thread-naming); a Project that changes Initiative has its checkpoint renamed in the same change. The checkpoint also holds the thread's [mark](#recap-since-the-mark).
- **Decisions:** it records each owner approval with `ki agent decide <run>` before launching the work that approval authorises, in the Project's [one list](#one-list).
- **State-of-play thread:** the [state-of-play thread](#state-of-play-thread) owns cross-project priorities, releases, and decisions touching more than one Project. Releases follow the `ki-repo-tools` release-on-demand policy: a delivery run never releases by default, and a release run carries the `release` footer for the named release only. A coordination thread raises those there.
- **Naming:** where the runtime can name a session, the thread takes the checkpoint's `label`, such as `Techne: agent-host`, so the state-of-play thread can find it. The label is presentation only; [the checkpoint label rule](../../../governance/ki-checkpoint/references/standards-checkpoints.md#thread-label) owns its form.
- **Opening:** open a coordination thread only where there is active work to drive, within the state-of-play thread's [cap](#state-of-play-thread). A dormant Project needs no thread.
- **Scope:** it works only its own Project's records. Work that belongs to another Project goes to that Project's thread or checkpoint through the state-of-play thread.
- **Close:** it ends with DONE only at [Project close](#project-close), after the tidy; until then it alternates REST and BUSY.

### State-of-play thread

Each territory Capital has one state-of-play thread: the coordination thread of the territory's coordination threads. Its checkpoint is `+/_CHECKPOINTS/_state-of-play.md` in that Capital, labelled `Master: state-of-play`, and it does project management only: it runs no delivery itself and routes all real work to coordination threads. No repository other than a Capital holds a `_state-of-play.md` checkpoint. It shows DONE only when the territory closes.

- **Registry:** the Initiatives and Projects it manages are defined in the Capital's `Streams/` registry under the `ki-work` Project registry standard, and their work records live in the roadmaps of the territory's repositories.
- **Owns:** cross-Project priorities, releases, decisions touching more than one Project, [directions](#directions-from-the-state-of-play-thread) to coordination threads, and the coordination-thread queue.
- **Cap:** at most three or four coordination threads are active at once, plus the state-of-play thread. It keeps the active threads and the ordered queue in its checkpoint's `Current state`, each with its label, checkpoint and opener, and opens the next queued thread when an active one closes.
- **Seeding:** before a coordination thread opens, the state-of-play thread creates or reconciles its `<initiative>.<project>.md` checkpoint and gives the owner its [opener](#opening-a-thread), so the thread opens with one message.
- **Run:** run names share one machine-wide namespace, so the state-of-play thread's run is `<territory>-state-of-play`, using the territory handle; a run that predates this rule may keep its existing name. A coordination thread's run takes the Project name, prefixed with the territory handle where another territory already uses that name.
- **Other territories:** it coordinates with another territory's state-of-play thread only through the owner. It never acts with authority in another territory's repositories; each Capital keeps its own ownership, and cross-repository work moves under `ki-trades` or the receiving repository's own process.

### Opening a thread

The owner opens a thread in the Capital's checkout, names it with the checkpoint's `label` where the runtime can name a session, and pastes one opener. The state-of-play thread prepares the checkpoint first, so every thread opens with one opener and nothing else. An opener is a steering-ready brief, not a transcript: it names the thread and leaves state to the checkpoint. Its role line carries the three rules of [the responsive coordinator](#the-responsive-coordinator) in Kris's words. The checkpoint's `Current state` names the thread's tracked folder as `Thread folder: +/_THREADS/<run>/`, written when the checkpoint is prepared or at bootstrap, so that `ki-recap` and this skill find the decisions log and the reports.

For the state-of-play thread:

```text
Bootstrap as the state-of-play thread for <territory> under ki-pmo.
Role: coordinator only. The thread never does substantive work itself; every unit of work goes to a detached background agent; an owner message never pre-empts work in flight. Dispatch, decide with me, report; stay responsive.
Label: Master: state-of-play. Checkpoint: +/_CHECKPOINTS/_state-of-play.md in <capital>.
Project management only: priorities, the coordination-thread queue (cap three or four), decisions and releases; route real work to coordination threads.
Background agents: run substantive work through `ki agent` in run `<territory>-state-of-play`; stay responsive.
Steering: my messages steer; stop or abort only when I expressly say so, naming the work.
First step: follow the Bootstrap in ki-pmo, then report in three lines.
```

For a coordination thread:

```text
Bootstrap as the <project> coordination thread under ki-pmo.
Role: coordinator only. The thread never does substantive work itself; every unit of work goes to a detached background agent; an owner message never pre-empts work in flight. Dispatch, decide with me, report; stay responsive.
Label: <Initiative title>: <project>. Checkpoint: +/_CHECKPOINTS/<initiative>.<project>.md in <capital>.
Project: <project> (Initiative <initiative>); work only this Project's records.
Background agents: run substantive work through `ki agent` in run `<run>`; stay responsive.
Steering: my messages steer; stop or abort only when I expressly say so, naming the work.
First step: follow the Bootstrap in ki-pmo, then report in three lines.
```

The one-line `Re-bootstrap as the <project> coordination thread under ki-pmo.` form under [Bootstrap](#bootstrap) remains enough for a thread already on this contract.

### Bootstrap

A one-line opener brings a new or already-running thread onto this contract, for example `Re-bootstrap as the <project> coordination thread under ki-pmo.` The opener uses the Project name alone, and the state-of-play thread's opener uses `state-of-play`. The older `project thread` and `territory master thread` wordings, and the `under ki-delegation` form from the pilot, are accepted and mean the same thing; they are dropped once every checkpoint has re-bootstrapped under the new names. A thread also re-bootstraps on request, after a compaction under [Re-anchoring](#re-anchoring-after-compaction), after a model switch, and as the first step of the [resume line](#banner). The thread then:

1. reads this standard;
2. checks `ki agent status` for its runs and any legacy runs, and reconciles what is actually running rather than assuming;
3. resolves the Project name to the single `+/_CHECKPOINTS/*.<project>.md` checkpoint, or `_state-of-play.md` for the state-of-play thread, under `ki-checkpoint` RESUME, stopping to ask the owner if no file or more than one file matches; then creates or reconciles that checkpoint;
4. reports in three lines: its coordinator role and where the Project stands, what is running, and what it needs from the owner; then closes with the [banner](#banner) frame and the resume line, rendered exactly as a Summary renders them, so a thread that has just re-bootstrapped shows the same banner as one that never left.

### Directions from the state-of-play thread

The state-of-play thread propagates common instructions. Rules go to their durable owner, a skill or a Decision Record. Thread-level directions go into each affected Project's checkpoint under a short `From the state-of-play thread` section that holds current directions only; a checkpoint still headed `From the master thread` renames it at its next update.

A coordination thread re-reads its checkpoint at every recap and before launching work, acts on new directions, and removes each direction once it is absorbed. Where the runtime can message another live session on the same machine, the state-of-play thread may also nudge the coordination thread to re-read it, under the [surfaces rule](#surfaces). The checkpoint stays the source of truth, so directions also reach threads on other machines.

## Decisions and design

A coordinating thread turns the owner's words into durable knowledge. Every owner decision is logged in the turn it arrives, in the owner's words, under the `ki-delegation` [decisions log](../../../governance/ki-delegation/references/standards-background-runs.md#decisions-log) rules; this section says what becomes of each entry, which list is the Project's, where design notes live and what closes a Project. A record, report or banner describes a decision by its words and date and never by its number, under Kris's rule of 2026-10-14: "I actually think we should not necessarily need to put the decision number anywhere. It should be written about what the decision was or is."

### Decision classes

Every log entry is one of four things, and its class says where it goes, as Kris adopted on 2026-10-14 with "adopt the four decision classes and the homeless-standalone rule". The split rests on Kris's words that "Not all design decisions need to materialise into decision records, or certainly not their own unique decision records. They may well well supplement existing ones."

| Class | What it is | Home |
| --- | --- | --- |
| Operational | Approves or steers one piece of work: a push, a tidy, an adoption, a release. Most entries | The work record or commit it drove; where there is none, the log entry is its own home and goes with the thread |
| Rule | Changes how work is done from now on | The skill standard that owns the practice, through a record in the owning repository, or root `AGENTS.md` for a repository-local convention |
| Standalone | Durable rationale or authority a reader will need without the thread: a structural or policy choice | A Decision Record, amended in place where one already owns the concern |
| Held | Open, or deferred to a later wave | The checkpoint, under its Needs tag, until it resolves into one of the other three |

The coordination thread classifies each entry at the [mark](#recap-since-the-mark) and names its home in the log. A standalone entry with no Decision Record yet stands alone: the thread carries it in the checkpoint's `Current state` as `homeless: <TAG>` so the Summary shows it, until a Decision Record takes it or the thread's close tidies it. Who promotes: an operational entry is promoted by the work it drove, through `ki-accept` or the commit; a rule by the delivery that changes the standard; a standalone entry by the Decision Record's author; a held entry by whichever class it resolves into; and at [Project close](#project-close) the thread promotes whatever is still unpromoted. A conversational thread promotes at its recap.

### One list

`+/_THREADS/<project>/decisions.md` is the Project's one decisions list for its whole life, as Kris adopted with "the thread log is the Project's one decisions list": successive coordination threads of one Project share it, it is tracked, words-first and findable from the checkpoint's `Thread folder:` line. A design loop's own decisions file is a stage artefact that holds only the answers to its report's tagged decisions, and every one of those answers is also a thread log entry, logged in the turn it arrived. When the design folder is deleted nothing is lost, because the log already holds the words and the Decision Record holds the standing decision.

### Design notes

Design notes of every kind - options papers, mocks, loop reports and their stage decisions - live in `+/_DESIGN/<subject-slug>/` in the repository whose concern they design, as Kris set with "DESIGN-RETENTION - (a) +/_DESIGN/<subject-slug>/ in every repository" and confirmed with "design notes move to +/_DESIGN/<subject>/ and are deleted on graduation". A design folder under a Project note is retired: its notes move to `+/_DESIGN/` or graduate.

A design note is a draft, under review, graduated or deleted. It graduates when every decision it carried has a durable home: the standards, records and Decision Records that now hold the words. A graduated note is deleted in the same change, so nothing cites a deleted note: a work record cites a design note only while the note exists, and by `ready` the record's `Context` quotes what it needs in words; a Decision Record never cites a design note.

### Project close

A coordination thread shows DONE once only, after the close-out tidy Kris confirmed with "confirm the four close-out steps", and a Project is closed only after them:

1. every logged decision is promoted to its home under [Decision classes](#decision-classes), with none left homeless or held;
2. the design folder is resolved: every note graduated and deleted, or moved under `+/_DESIGN/`;
3. the checkpoint is retired through `ki-checkpoint` REMOVE, after its durable information is routed;
4. the thread folder is committed and pushed, then deleted, and the run archived by `ki agent close`, whose gate stays strict, with `--reconciled` as the owner's waiver, as Kris settled: "keep the close gate strict with the reconciled waiver".

The Project note then points at the outcome. Reopening a Project is a new opener from the state-of-play thread, not a resume.

## Thread working rules

These rules apply to every coordinating thread: the state-of-play thread and each coordination thread.

### Recap since the mark

A recap is a plain-language roll-up for the owner of what has changed in the thread's scope since its mark. Every coordinating thread gives one. A coordination thread's scope is its Project; the state-of-play thread's scope is only what it itself deals with, the records and decisions it raised or owns, not every Project's records. A recap is distinct from `ki-recap`, which summarises one session at a lower level; the two share no format or procedure, and in a coordinating thread `ki-recap` hands to the forms here.

- **Mark:** a baseline the owner strikes at a moment of their choosing. Each thread has one mark, and striking a new one replaces it; Git holds the history of earlier marks. The thread keeps it in its checkpoint's `Current state` as `Mark: <UTC timestamp>`. The timestamp bounds Git history, work-record transitions, background-agent reports and the decisions log, whose entries carry their own timestamps. Per-repository commit identifiers stay out. The banner, the mark and the resume line describe or date a decision and never cite a number, because a number, in Kris's words of 2026-10-14, "has no meaning to me because I don't know what the decision was ... and I don't know where the list is".
- **Striking:** only the owner moves the mark, by saying "mark", or "recap and mark" to roll up and then re-strike. Giving a recap does not move it, so a recap can always reach back to a moment the owner chose. The thread commits the checkpoint update and confirms in one line, and classifies the log entries since the last mark under [Decision classes](#decision-classes).
- **Shape:** a recap opens with the `#` [banner](#coordinating-thread-practices) shared with the Summary and the full summary, its window `since <mark>`. Beneath it is one [owner report](../../../governance/ki-delegation/references/standards-background-runs.md#owner-report) at the shared [heading levels](#coordinating-thread-practices): `Done` covers what was delivered, decided, started, stopped or blocked, and newly captured since the mark; `What is in progress` what is running now; `Outstanding queries` every open query in full. It cites records by full identifier as links, with no tool output and no commit identifiers, and never points back to an earlier recap or Summary. It closes with the [banner](#banner) frame and the resume line.
- **Outstanding:** the checkpoint's open [Needs-tagged](../../../governance/ki-delegation/references/standards-background-runs.md#needs-tags) queries, open work records in the thread's scope, running or queued background agents, and parked tangents. Outstanding carries forward across marks: it is everything still open, whenever it arose, and striking a mark resets only the window for what was delivered, decided, started, stopped or blocked, and newly captured. Striking or re-striking never drops, closes or hides an open item, and the thread keeps every open query, with its Needs tag, in its checkpoint when it re-strikes.
- **Sources:** the thread's decisions log entries after the mark; background-agent reports finished since the timestamp; `ki agent status` for running and queued agents; work-record transitions in the thread's scope since the timestamp, from the Git history of the roadmap paths; and the checkpoint's open Needs-tagged queries and parked tangents.
- **When:** the thread gives a recap on request, such as "recap". Proactive updates take the shorter [Summary](#report-forms) form, so they do not repeat everything since a distant mark; a request for the whole thread in one reply gets the [full summary](#full-summary).
- **No mark yet:** the first recap covers the window since the checkpoint's last-recap time, if it notes one, or else its `created_at`, states that window in its banner, and strikes the first mark. A thread whose checkpoint still notes a last-recap time converts it into a mark when the [refresh rule](#refreshing-this-guidance) tells it this guidance changed.

### Parking tangents

When the owner raises a side topic in passing, the thread records it as one dated line, says it is parked, and carries on with the current work. It does not explore the tangent unasked.

Parked items live in the thread's checkpoint under `Open questions`, each as `- Parked <YYYY-MM-DD>: <one line>`. They need no section of their own: [the checkpoint record form](../../../governance/ki-checkpoint/references/standards-checkpoints.md#exact-record-form) fixes the six sections. They count as outstanding in the thread's [recap](#recap-since-the-mark).

On request, such as "what's parked?", the thread lists its parked items. When the owner picks one up, it gets a home - a Project, a work record through `ki-next`, or another thread's checkpoint - or is dropped, and the thread removes it from `Open questions` in the same update.

### Linking records

Whenever a thread or a report mentions a roadmap or work record, a checkpoint, an Initiative, a Project, a decision, a receipt or an evidence artefact, it cites the full identifier, such as `KI-HARNESS-GOV-144` rather than `GOV-144`, because area codes repeat across repositories, and uses that full identifier as the link text.

It links each one to the local file by absolute path, so that it opens in the owner's editor, resolving the repository through the KI registry (`ki registry`) where one is available. It uses the verified canonical remote URL only when there is no local copy. A query heading links to its underlying record when one exists, and the reply block keeps the references an instruction needs. A link is never invented: when a target cannot be resolved, the text says so. A pruned roadmap record has no local file any more, so it is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`: the link text is always the full identifier followed by `(pruned)`, and the last revision is the last commit in which the file existed, usually the parent of the prune commit. Kris set this form on 2026-10-14, as received: "LINK-FORM / clickable GitHub link to the file at its last revision; KI-HARNESS-GOV-188's check accepts it. Perhaps the link text can be `KI-HARNESS-GOV-188 (pruned)`". A live record keeps its local-file link; a pruned record is never pointed at the Project note that carries it and never left as a bare identifier. This applies to status lines, owner reports, recaps and checkpoints alike, and a background agent's report follows the same rule under the owner report's linking requirement. The rubric's PMO-7 checks the thread reports under `+/_THREADS/<run>/`: every full record identifier in their prose, a work record or a Decision Record, sits inside a Markdown link, and a link that names a record and targets an absolute local path points at a file that exists; the reply block, as a fenced block, and Needs tags such as `ACCEPT-181` are not record identifiers and are not checked.

### Committing the thread folder

The thread folder `+/_THREADS/<run>/` is tracked, and the knowledge in it - the decisions log, the agent reports, the inbox once it moves there - is safe only once it is in Git on a remote. Kris set the rule on 2026-10-14: "threads need to know that they need to commit their work under +/_THREAD/". So a coordinating thread commits and pushes its thread folder at every owner report and at every resting point, by explicit path and never with another session's uncommitted changes, and the banner's housekeeping line says `thread folder committed and pushed`, or `thread folder unpushed` or `thread folder uncommitted` plainly when it is not. Where pushing is not authorised the line says so and the owner report names the pending handoff.

### Keeping primary checkouts current

Background agents work in worktrees and push their own commits, so the owner's primary checkouts fall behind. The coordinating thread fast-forward pulls each affected primary checkout periodically: after a background agent that pushed finishes, and before a recap.

It pulls only with `--ff-only` into a clean checkout. A checkout with uncommitted changes, or one that has diverged from its upstream, is skipped and reported to the owner rather than stashed, rebased or reset. The pull is a quick one-step check under [Coordinator responsiveness](#coordinator-responsiveness); anything needing repair goes to a background agent or the owner.

### Refreshing this guidance

A coordinating thread re-reads this standard on its own, without the owner asking:

- at bootstrap or re-bootstrap;
- before each checkpoint update;
- whenever the skill has changed since its last read.

To detect a change, it compares the latest commit touching `skills/change-management/ki-pmo` in the `ki-agentic-harness` checkout, from `git log -1 --format=%h -- skills/change-management/ki-pmo`, with the revision it last read. It notes that revision in its checkpoint's `Current state` as `ki-pmo read at <revision>`. A checkpoint that still carries the older `ki-delegation read at <revision>` line replaces it with the `ki-pmo` line at its next update. It then follows the current text and, when anything changed, tells the owner in one line what changed.

## Mechanical boundary

The native rubric is thin and complementary to `ki-checkpoint`'s. It checks only what the repository shows: a Capital holds the `_state-of-play.md` checkpoint and no other repository does; each coordination checkpoint's label ends in the Project name its filename carries, and that Project and its Initiative resolve in the Capital's registry; the active coordination threads are within the cap; and every full record identifier in a thread report under `+/_THREADS/` is a link to an existing file, as [Linking records](#linking-records) describes. It cannot judge whether a coordinator kept its turn budget, whether a report took the owner-report shape under its banner heading and closed with the banner frame and the resume line, whether a recap covered the window since the mark, whether decisions were classified and promoted, or whether the thread refreshed this guidance; the PMO judgment items review those from transcripts, reports and checkpoints the owner selects.
