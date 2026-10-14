# Coordinating-thread standard

## Contents

- [Scope](#scope)
  - [The responsive coordinator](#the-responsive-coordinator)
  - [Glossary](#glossary)
- [Coordinator responsiveness](#coordinator-responsiveness)
- [Coordinating-thread practices](#coordinating-thread-practices)
  - [Banner](#banner)
- [Report forms](#report-forms)
  - [Full summary](#full-summary)
- [Project threads](#project-threads)
  - [Territory master thread](#territory-master-thread)
  - [Opening a thread](#opening-a-thread)
  - [Bootstrap](#bootstrap)
  - [Directions from the master thread](#directions-from-the-master-thread)
- [Thread working rules](#thread-working-rules)
  - [Recap since the mark](#recap-since-the-mark)
  - [Parking tangents](#parking-tangents)
  - [Linking records](#linking-records)
  - [Keeping primary checkouts current](#keeping-primary-checkouts-current)
  - [Refreshing this guidance](#refreshing-this-guidance)
- [Mechanical boundary](#mechanical-boundary)

## Scope

A coordinating thread - the territory master thread or a project thread - is the owner's project-management office for Knowledge Islands work: it dispatches work, decides with the owner and reports. This standard owns how such a thread behaves, reports and keeps itself current. It is the thread half of the practice that the `ki-delegation` [background-run standard](../../../governance/ki-delegation/references/standards-background-runs.md) governs on the run side: detachment, the run packet, prompt shape, authority tiers, the decisions log, coordination, the run queue, monitoring, and the [owner report](../../../governance/ki-delegation/references/standards-background-runs.md#owner-report) with its [Needs tags](../../../governance/ki-delegation/references/standards-background-runs.md#needs-tags), which every report in this standard takes and this standard adopts by reference rather than restating. The thread's checkpoint is a `ki-checkpoint` record under [the checkpoint standard](../../../governance/ki-checkpoint/references/standards-checkpoints.md).

A repository that runs coordinating threads declares `[skills.ki-pmo]` in its `.ki.toml`. The declaration is the signal the runtime hook and the output style key on, so a repository that does not delegate never gets them.

### The responsive coordinator

Every rule in this standard serves one principle, which Kris set for threads on 2026-10-13 in these words:

> It's imperative that you do not do the work directly and that you delegate that work to subagents so that you remain responsive. And if I send you a message, it doesn't preempt any work that you are already doing. This is a fundamental requirement of the delegation capability.

Three rules follow from it, and they are hard:

1. **The thread never does substantive work itself.** A coordinating thread dispatches, decides with the owner and reports. Nothing else.
2. **Every unit of work goes to a detached background agent.** Through `ki agent`, in its own session, surviving anything that happens to the thread. An in-session subagent is not a background agent.
3. **An owner message never pre-empts work in flight.** It steers: the thread folds it into running and queued work and answers within one short turn. A background agent stops only when the owner names it and says stop.

Four layers enforce them in a coordinating thread: the opener's role line carries the three rules in Kris's words, and the thread re-bootstraps on request, after a compaction and after a model switch; a runtime hook restates them on every owner message and again after compaction; the counted turn budget and self-check under [Coordinator responsiveness](#coordinator-responsiveness) bound each turn; and the acceptance tests the pilot record sets are run and scored from the session transcript. The harness also ships the `ki-coordinator` output style, whose text is these three rules and the owner-report shape, so that the style a coordinating thread runs under and this contract are one document; a declaring repository selects it with `outputStyle` in its tracked `.claude/settings.json`.

### Glossary

Five words carry this practice, each with one owner:

| Term | Meaning | Owner |
| --- | --- | --- |
| session | One conversation in one runtime, from open to close or compaction; a thread lives across many sessions through its checkpoint | `ki-pmo` |
| thread | A coordinating conversation with a `ki-checkpoint` record: the territory master thread or a project thread | `ki-pmo` |
| run | A named set of agents sharing one state folder for runtime files and one tracked thread folder for knowledge files | `ki-delegation` |
| worker | The role an agent plays in a run: it delivers one unit of work and reports in owner-report form | `ki-delegation` |
| agent | A process `ki agent` launches detached under the background-run contract; an in-session subagent is not one | `ki-delegation` |

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

A runtime hook backs these rules: the harness `hooks/coordinator-reminder.sh` injects one line, this skill's text restating these rules, naming the cadence and the owner-report form, on every owner message, and again after compaction, in a thread whose checkout declares `[skills.ki-pmo]` in the top-level `.ki.toml` of the hook's working directory or its Git top level. A repository that does not declare `ki-pmo` never gets the line, and removing the declaration disables it, as Kris settled on 2026-10-14: "HOOK-OWNER - (a). A repository that doesn't delegate then never gets the hook, and removing ki-pmo disables it." The hook stays silent in agents `ki agent` launches. It is registered per machine by the user-environment manager.

## Coordinating-thread practices

A coordinating thread also follows these practices with the owner. Every report it gives is an [owner report](../../../governance/ki-delegation/references/standards-background-runs.md#owner-report), whose sections, queries and reply block are never shortened by any output style, proxy shaping block or communication level.

- **Questions:** a decision with clear options goes through the runtime's structured-question tool where one is available, recommended option first, a few questions per batch. The query keeps its [Needs tag](../../../governance/ki-delegation/references/standards-background-runs.md#needs-tags) either way.
- **Banner:** every Summary, every [recap](#recap-since-the-mark) and every [full summary](#full-summary) opens with one `#` banner heading, so each reads cold and several threads' updates read side by side, and closes with the [banner](#banner) frame and the resume line. The heading names the thread, its Project and Initiative as links where it has them, the window covered, and the thread's state: `working`, `resting`, or `waiting on <what>`. The state agrees with the closing frame: `working` under BUSY, `resting` or `waiting on <what>` under REST. The window is `since your last message` for a Summary, `since <mark>` for a recap and `since the thread began` for a full summary.
- **Heading levels:** in every form the banner is the `#` heading, the sections (`Decided`, `What has been done`, `What is in progress`, `Outstanding queries`) are `##` headings, and each query and each topic sub-heading is `###`. No other heading levels appear.
- **Self-contained:** no Summary, recap or full summary says "unchanged, see earlier", "as before" or otherwise points back to an earlier report. What is still running and what is still open is restated in full each time, because the owner reads each one cold and the earlier message may be gone.
- **Resting point:** when the thread's work is largely complete, or it is waiting on the owner, another thread, a scheduled test or an external fix, it ends with a Summary, because that is the last message the owner sees until they return. Its heading states `resting` or `waiting on <what>` plainly, its closing frame reads REST, and the owner report between them lets the owner pick the thread up cold.
- **Wording:** plain language, and "background agents", never "helpers". When the owner must paste a message into another thread, the thread gives it in a code block ready to copy.
- **Decisions:** the thread records each owner decision in the run's [decisions log](../../../governance/ki-delegation/references/standards-background-runs.md#decisions-log) before launching the work it authorises, in the turn the decision arrives, and verifies any later quotation from the transcript file, under the two rules that section sets.

### Banner

The banner closes every Summary, recap, full summary and [re-bootstrap](#bootstrap) report, after the reply block, so that the last thing the owner sees says whether the thread is at rest and gives them the one line that brings it back. Kris asked on 2026-10-14 that "every coordination-thread summary or owner report ends with a multi-line status banner modelled on the ki-recap banner. The banner states plainly whether the thread is AT REST (all work concluded, nothing in progress, no open queries) or not, and why. The banner carries one copyable resume line Kris can paste back into the thread later", settled the frame the same day with "(a). Yeah, that's great.", and, seeing threads render it differently after a re-bootstrap, said "when I'm asking threads to rebootstrap from PMO and Checkpoint and delegation, it's not doing the banner in the same way". So every thread renders it the same way, whether it has just bootstrapped, re-bootstrapped from this standard, `ki-checkpoint` and `ki-delegation`, or run for days: the frames below are the only frames, and a banner that differs from them is wrong.

The frame is the `ki-recap` frame: 52 display columns per framed line, measured by code point, a four-letter block word in `ki-recap`'s glyphs and three fixed side lines, never padded, reworded, coloured or improvised, so that transcript archives find a state by searching for its block word. The states come from Kris on 2026-10-14: "a conversational thread can be considered done. That's the end of the conversation. But a coordination thread can either be busy or at rest. Whether or not it then ends up being done is more a situation about the project itself, and in effect, it's when we say that project's closed and pull out and tidy up all of the stuff that's been happening."

- **REST:** nothing is running and nothing is queued. Open queries, held items, parked items, an uncommitted checkpoint and unlogged decisions do not change the word; they show on the lines beneath.
- **BUSY:** anything is running or queued, or the thread is blocked or waiting on another thread. The lines beneath say which.
- **DONE:** shown once only, at Project close, after the close-out tidy: every logged decision promoted to its durable home, the design folder resolved, the checkpoint retired, the run archived. No resume line follows it. It shares its glyphs with `ki-recap`'s single-session frame and carries its own side lines, so the two are told apart by their words; in a coordinating thread `ki-recap`'s frame never renders, because `ki-recap` hands to these forms.

Beneath the frame, each line with three leading spaces: the label line, `<label> · mark <UTC>`; then `running:` with agent names, `queued:` with agent names and `waiting on you:` with the open Needs tags, in that order and only where they apply; then the housekeeping line with the checkpoint state, the banner time, held items and the parked count. Another reason for BUSY takes the running or queued slot in words, such as `waiting on: Master, HOOK-FIX` or `blocked: Headroom proxy down`, and the housekeeping line says `checkpoint uncommitted` or `decisions unlogged: 2` plainly. Nothing in the banner cites a decision number.

REST:

```text
╭──────────────────────────────────────────────────╮
│  █▀▀▄ █▀▀▀ █▀▀▀ ▀▀█▀   · thread at rest          │
│  █▀▀▄ █▀▀  ▀▀▀█   █    · nothing running         │
│  █  █ █▄▄▄ ▄▄▄█   █    · nothing queued          │
╰──────────────────────────────────────────────────╯
   KI Model: ways-of-working · mark 2026-10-13T04:03Z
   waiting on you: KI-RELEASE, RESUME-COMPACT
   checkpoint committed and pushed · banner 2026-10-14T09:04Z · held: PAPERCLIP-REQ until Wave F · parked: 1
```

BUSY:

```text
╭──────────────────────────────────────────────────╮
│  █▀▀▄ █  █ █▀▀▀ █  █   · thread busy             │
│  █▀▀▄ █  █ ▀▀▀█  ▀█▀   · running or queued work  │
│  █▄▄▀ █▄▄█ ▄▄▄█   █    · lines below say which   │
╰──────────────────────────────────────────────────╯
   KI Model: ways-of-working · mark 2026-10-13T04:03Z
   running: harness-push
   queued: mark-tidy, apps-sweep, principal-enact
   waiting on you: KI-RELEASE, RESUME-COMPACT
   checkpoint committed, 1 commit unpushed · banner 2026-10-14T09:04Z · held: PAPERCLIP-REQ until Wave F · parked: 1
```

DONE, at Project close only:

```text
╭──────────────────────────────────────────────────╮
│  █▀▀▄ █▀▀█ █▄ █ █▀▀▀   · project closed          │
│  █  █ █  █ █ ██ █▀▀    · decisions promoted      │
│  █▄▄▀ █▄▄█ █  █ █▄▄▄   · thread tidied away      │
╰──────────────────────────────────────────────────╯
   KI Model: ways-of-working · closed 2026-11-02T16:10Z
   decisions: every entry logged since 13 October promoted, none held
   design folder resolved · checkpoint retired · run archived
   outcome: the Project note links the Decision Record on thread working and the ki-pmo standard
```

**Resume line.** After REST or BUSY, the last thing in the message is the resume line, in its own one-line fenced `text` block so it copies cleanly, with the thread's label and its [mark](#recap-since-the-mark) filled in:

```text
Resume <label> under current ki-pmo and ki-delegation since <mark>: re-bootstrap, mark, fresh summary with carried-forward open points, take stock, restart authorised work, then banner.
```

Pasted back into the thread, it makes the thread do these in order: re-bootstrap under [Bootstrap](#bootstrap), re-reading this standard, `ki-delegation`'s Reporting and its own checkpoint; strike the mark at the resume time, commit the checkpoint and confirm in one line; give a fresh Summary covering only what follows the new mark plus every open point carried forward from before it, built from the checkpoint, the decisions log and the thread folder rather than from transcript memory; take stock since the banner time on the previous banner, from the decisions log, `ki agent status`, its inbox and the owner's messages; restart any work the owner authorised since that banner; and end with a fresh banner. The label on the line is a guard: a thread whose checkpoint label does not match it stops and asks before doing anything. Kris set the order on 2026-10-14: "The resume line is the equivalent of a compaction for the checkpoint and coordination thread, and may also trigger a real compaction", so it strikes the mark first and summarises second.

## Report forms

A coordinating thread reports in three forms. Each is one [owner report](../../../governance/ki-delegation/references/standards-background-runs.md#owner-report) under the `#` banner heading, closing with the [banner](#banner) frame and the resume line, and they differ only in window and in what the window makes each section hold:

| Form | Window | Given | Sections |
| --- | --- | --- | --- |
| Summary | since your last message | proactively when background agents finish or the owner returns after a gap; on request, "summary"; and at a resting point | the owner report for the window; closes with the banner |
| [Recap](#recap-since-the-mark) | since the mark | on request, "recap"; "recap and mark" rolls up and then re-strikes | the owner report, with `What has been done` covering what was delivered, decided, started, stopped or blocked, and newly captured since the mark; closes with the banner |
| [Full summary](#full-summary) | since the thread began | on request, "full summary", "summary in full" or the like | `## Decided` first, then the owner report, each section whole-thread and every open query in full; closes with the banner |

A plain "summary" gets the Summary; "since the mark" gets the recap; "in full" or "full summary" gets the full summary. Only the recap interacts with the mark, and only when the owner says "mark". The skill is also invocable directly as `/ki-pmo summary`, `/ki-pmo recap`, `/ki-pmo full-summary` and `/ki-pmo mark`, which give the same forms and strike the mark; the invocation adds no fourth form.

### Full summary

A **full summary** is the owner report for the whole thread: everything decided, done, running and open since the thread began, in one reply, so that the owner holds all the context without reading earlier messages. Kris asked for it on 2026-10-13 as "a summary of things that have been decided, ongoing work and outstanding queries ... in full so I have all the context in one reply", and adopted the proposed shape the same day in the `ways-of-working` thread. A coordinating thread gives one whenever the owner asks for a "full summary", a "summary in full", or anything else that asks for the whole thread in one reply. It never moves the mark.

Its shape, in this order:

- **Banner heading:** the `#` [banner](#coordinating-thread-practices) heading, window `since the thread began`.
- **`## Decided`:** every owner decision since the thread began, as a numbered list or a two-column table, one line each in the order taken, each linked to its entry in the thread's tracked [decisions log](../../../governance/ki-delegation/references/standards-background-runs.md#decisions-log) or to the record that now holds it. A decision that a later one superseded stays on its line and says so.
- **`## What has been done`:** the whole thread's completed outcomes, grouped by topic under `###` sub-headings wherever more than a few lines would otherwise run together, with failures, corrections and limitations beside the outcomes they qualify.
- **`## What is in progress`:** as the owner report, with `Outstanding - no action requested now` beneath it. A dated upcoming deadline or scheduled event belongs there with its date, so the owner sees what is coming without being asked anything.
- **`## Outstanding queries`:** every open query, however long it has been open, restated in full under its own `### <tag> - <title>` heading with Summary, Need from you and Recommendation, written to be answered cold. Nothing is shortened because it was asked before.
- **Reply block:** the fenced `text` block carries one line per open query, each prefilled with the recommended instruction under its tag so the owner can send the block back as it stands or edit a line, never a menu of the options, with a placeholder only where the owner alone can supply the value, under the `ki-delegation` [reply-block rule](../../../governance/ki-delegation/references/standards-background-runs.md#owner-report). Kris corrected the menu form on 2026-10-14: "the proposed copy block is including all the options, rather than the recommended option."
- **Banner:** the closing [frame](#banner) and the resume line, after the reply block.

Low-stakes choices the thread has already made, where the owner's silence is consent, go in one query headed `DEFAULTS - defaults unless you say otherwise`: one line per choice, Need from you `nothing, unless you object`, Recommendation `keep the defaults`, and one reply-block line `DEFAULTS - keep the defaults`. A choice the owner objects to becomes its own tagged query. A decision that is not low-stakes never goes there, and no other query bundles more than one decision: a query the owner cannot answer with one instruction is two queries.

Sources are the thread's decisions log from the thread's start, every background-agent report in the thread folder, the checkpoint's open Needs-tagged queries and parked tangents, `ki agent status`, and the Git history of the thread's scope since the checkpoint's `created_at`. Where a report is missing from the thread folder, the full summary says what it could not read rather than reconstructing it from memory.

## Project threads

A project thread coordinates exactly one Project, or one named estate area, for the owner. It is always delegation-based: it runs its work as background agents through `ki agent` under the `ki-delegation` [background-run standard](../../../governance/ki-delegation/references/standards-background-runs.md), in a run named after the Project, and keeps its own turns short under [Coordinator responsiveness](#coordinator-responsiveness).

- **Checkpoint:** the thread resumes from the Project's `ki-checkpoint` checkpoint, which holds current state only, and keeps it current. The checkpoint is named `<initiative>.<project>.md` and the master thread's `_state-of-play.md`, under [the checkpoint naming rule](../../../governance/ki-checkpoint/references/standards-checkpoints.md#project-thread-naming); a Project that changes Initiative has its checkpoint renamed in the same change. The checkpoint also holds the thread's [mark](#recap-since-the-mark).
- **Decisions:** it records each owner approval with `ki agent decide <run>` before launching the work that approval authorises.
- **Master thread:** the [territory master thread](#territory-master-thread) owns cross-project priorities, releases, and decisions touching more than one Project. Releases follow the `ki-repo-tools` release-on-demand policy: a delivery run never releases by default, and a release run carries the `release` footer for the named release only. A project thread raises those there.
- **Naming:** where the runtime can name a session, the thread takes the checkpoint's `label`, such as `Techne: agent-host`, so the master thread can find it. The label is presentation only; [the checkpoint label rule](../../../governance/ki-checkpoint/references/standards-checkpoints.md#thread-label) owns its form.
- **Opening:** open a project thread only where there is active work to drive, within the master thread's [cap](#territory-master-thread). A dormant Project needs no thread.
- **Scope:** it works only its own Project's records. Work that belongs to another Project goes to that Project's thread or checkpoint through the master thread.

### Territory master thread

Each territory Capital has one territory master thread. Its checkpoint is `+/_CHECKPOINTS/_state-of-play.md` in that Capital, labelled `Master: state-of-play`, and it does project management only: it runs no delivery itself and routes all real work to Project threads. No repository other than a Capital holds a `_state-of-play.md` checkpoint.

- **Registry:** the Initiatives and Projects it manages are defined in the Capital's `Streams/` registry under the `ki-work` Project registry standard, and their work records live in the roadmaps of the territory's repositories.
- **Owns:** cross-Project priorities, releases, decisions touching more than one Project, [directions](#directions-from-the-master-thread) to Project threads, and the Project-thread queue.
- **Cap:** at most three or four Project threads are active at once, plus the master. The master keeps the active threads and the ordered queue in its checkpoint's `Current state`, each with its label, checkpoint and opener, and opens the next queued thread when an active one closes.
- **Seeding:** before a Project thread opens, the master creates or reconciles its `<initiative>.<project>.md` checkpoint and gives the owner its [opener](#opening-a-thread), so the thread opens with one message.
- **Run:** run names share one machine-wide namespace, so the master's run is `<territory>-state-of-play`, using the territory handle; a master run that predates this rule may keep its existing name. A Project thread's run takes the Project name, prefixed with the territory handle where another territory already uses that name.
- **Other territories:** it coordinates with another territory's master only through the owner. A master never acts with authority in another territory's repositories; each Capital keeps its own ownership, and cross-repository work moves under `ki-trades` or the receiving repository's own process.

### Opening a thread

The owner opens a thread in the Capital's checkout, names it with the checkpoint's `label` where the runtime can name a session, and pastes one opener. The master thread prepares the checkpoint first, so every thread opens with one opener and nothing else. An opener is a steering-ready brief, not a transcript: it names the thread and leaves state to the checkpoint. Its role line carries the three rules of [the responsive coordinator](#the-responsive-coordinator) in Kris's words. The checkpoint's `Current state` names the thread's tracked folder as `Thread folder: +/_THREADS/<run>/`, written when the checkpoint is prepared or at bootstrap, so that `ki-recap` and this skill find the decisions log and the reports.

For a territory master thread:

```text
Bootstrap as the state-of-play territory master thread for <territory> under ki-pmo.
Role: coordinator only. The thread never does substantive work itself; every unit of work goes to a detached background agent; an owner message never pre-empts work in flight. Dispatch, decide with me, report; stay responsive.
Label: Master: state-of-play. Checkpoint: +/_CHECKPOINTS/_state-of-play.md in <capital>.
Project management only: priorities, the Project-thread queue (cap three or four), decisions and releases; route real work to Project threads.
Background agents: run substantive work through `ki agent` in run `<territory>-state-of-play`; stay responsive.
Steering: my messages steer; stop or abort only when I expressly say so, naming the work.
First step: follow the Bootstrap in ki-pmo, then report in three lines.
```

For a Project thread:

```text
Bootstrap as the <project> project thread under ki-pmo.
Role: coordinator only. The thread never does substantive work itself; every unit of work goes to a detached background agent; an owner message never pre-empts work in flight. Dispatch, decide with me, report; stay responsive.
Label: <Initiative title>: <project>. Checkpoint: +/_CHECKPOINTS/<initiative>.<project>.md in <capital>.
Project: <project> (Initiative <initiative>); work only this Project's records.
Background agents: run substantive work through `ki agent` in run `<run>`; stay responsive.
Steering: my messages steer; stop or abort only when I expressly say so, naming the work.
First step: follow the Bootstrap in ki-pmo, then report in three lines.
```

The one-line `Re-bootstrap as the <project> project thread under ki-pmo.` form under [Bootstrap](#bootstrap) remains enough for a thread already on this contract.

### Bootstrap

A one-line opener brings a new or already-running thread onto this contract, for example `Re-bootstrap as the <project> project thread under ki-pmo.` The opener uses the Project name alone, and the master thread's opener uses `state-of-play`. During the pilot the older `under ki-delegation` form of the same line is accepted and means the same thing; it is dropped once every Capital declares `ki-pmo`. A thread also re-bootstraps on request, after a compaction, after a model switch, and as the first step of the [resume line](#banner). The thread then:

1. reads this standard;
2. checks `ki agent status` for its runs and any legacy runs, and reconciles what is actually running rather than assuming;
3. resolves the Project name to the single `+/_CHECKPOINTS/*.<project>.md` checkpoint, or `_state-of-play.md` for the master thread, under `ki-checkpoint` RESUME, stopping to ask the owner if no file or more than one file matches; then creates or reconciles that checkpoint;
4. reports in three lines: its coordinator role and where the Project stands, what is running, and what it needs from the owner; then closes with the [banner](#banner) frame and the resume line, rendered exactly as a Summary renders them, so a thread that has just re-bootstrapped shows the same banner as one that never left.

### Directions from the master thread

The master thread propagates common instructions. Rules go to their durable owner, a skill or a Decision Record. Thread-level directions go into each affected Project's checkpoint under a short `From the master thread` section that holds current directions only.

A project thread re-reads its checkpoint at every recap and before launching work, acts on new directions, and removes each direction once it is absorbed. Where the runtime can message another live session on the same machine, the master thread may also nudge the project thread to re-read it. The checkpoint stays the source of truth, so directions also reach threads on other machines.

## Thread working rules

These rules apply to every coordinating thread: the territory master thread and each project thread.

### Recap since the mark

A recap is a plain-language roll-up for the owner of what has changed in the thread's scope since its mark. Every coordinating thread gives one. A project thread's scope is its Project; the master thread's scope is only what the master thread itself deals with, the records and decisions it raised or owns, not every Project's records. A recap is distinct from `ki-recap`, which summarises one session at a lower level; the two share no format or procedure, and in a coordinating thread `ki-recap` hands to the forms here.

- **Mark:** a baseline the owner strikes at a moment of their choosing. Each thread has one mark, and striking a new one replaces it; Git holds the history of earlier marks. The thread keeps it in its checkpoint's `Current state` as `Mark: <UTC timestamp>`. The timestamp bounds Git history, work-record transitions, background-agent reports and the decisions log, whose entries carry their own timestamps. Per-repository commit identifiers stay out. The banner, the mark and the resume line describe or date a decision and never cite a number, because a number, in Kris's words of 2026-10-14, "has no meaning to me because I don't know what the decision was ... and I don't know where the list is".
- **Striking:** only the owner moves the mark, by saying "mark", or "recap and mark" to roll up and then re-strike. Giving a recap does not move it, so a recap can always reach back to a moment the owner chose. The thread commits the checkpoint update and confirms in one line.
- **Shape:** a recap opens with the `#` [banner](#coordinating-thread-practices) shared with the Summary and the full summary, its window `since <mark>`. Beneath it is one [owner report](../../../governance/ki-delegation/references/standards-background-runs.md#owner-report) at the shared [heading levels](#coordinating-thread-practices): `What has been done` covers what was delivered, decided, started, stopped or blocked, and newly captured since the mark; `What is in progress` what is running now; `Outstanding queries` every open query in full. It cites records by full identifier as links, with no tool output and no commit identifiers, and never points back to an earlier recap or Summary. It closes with the [banner](#banner) frame and the resume line.
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

It links each one to the local file by absolute path, so that it opens in the owner's editor, resolving the repository through the KI registry (`ki registry`) where one is available. It uses the verified canonical remote URL only when there is no local copy. A query heading links to its underlying record when one exists, and the reply block keeps the references an instruction needs. A link is never invented: when a target cannot be resolved, the text says so. This applies to status lines, owner reports, recaps and checkpoints alike, and a background agent's report follows the same rule under the owner report's linking requirement.

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

The native rubric is thin and complementary to `ki-checkpoint`'s. It checks only what the repository shows: a Capital holds the `_state-of-play.md` master checkpoint and no other repository does; each coordinating checkpoint's label ends in the Project name its filename carries, and that Project and its Initiative resolve in the Capital's registry; and the active Project threads are within the cap. It cannot judge whether a coordinator kept its turn budget, whether a report took the owner-report shape under its banner heading and closed with the banner frame and the resume line, whether a recap covered the window since the mark, or whether the thread refreshed this guidance; the PMO judgment items review those from transcripts, reports and checkpoints the owner selects.
