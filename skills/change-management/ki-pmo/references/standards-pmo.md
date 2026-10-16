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
- [Reply forms](#reply-forms)
  - [Units of work](#units-of-work)
  - [Conversational bounded work](#conversational-bounded-work)
  - [Coordinator-only machinery](#coordinator-only-machinery)
- [Owner report](#owner-report)
  - [Needs tags](#needs-tags)
  - [Generated surfaces](#generated-surfaces)
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
  - [Tidying the thread folder](#tidying-the-thread-folder)
  - [Draining a thread](#draining-a-thread)
  - [Picking up a thread](#picking-up-a-thread)
  - [Pushing beneath other sessions](#pushing-beneath-other-sessions)
  - [Keeping primary checkouts current](#keeping-primary-checkouts-current)
  - [Refreshing this guidance](#refreshing-this-guidance)
- [Mechanical boundary](#mechanical-boundary)

## Scope

A coordinating thread - a coordination thread or the state-of-play thread - is the owner's project-management office for Knowledge Islands work: it dispatches work, decides with the owner and reports. This standard owns how such a thread behaves, reports and keeps itself current, and it defines the three [thread types](#thread-types) every Knowledge Islands thread is one of. It is the thread half of the practice that the `ki-delegation` [background-run standard](../../../governance/ki-delegation/references/standards-background-runs.md) governs on the run side: detachment, the run packet, prompt shape, authority tiers, the decisions log, coordination, the run queue, monitoring, while this standard owns the [owner report](#owner-report) with its [Needs tags](#needs-tags), which every report a background agent or a coordinating thread gives takes, and the [generated surfaces](#generated-surfaces) that carry it. The thread's checkpoint is a `ki-checkpoint` record under [the checkpoint standard](../../../governance/ki-checkpoint/references/standards-checkpoints.md).

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
| hold | The state of a thread brought to a full stop: a [mark](#recap-since-the-mark) plus stopping all work, so that the thread can be archived and later picked up from the repository alone, for a move between hosts or to close it for a period; issuable across a whole territory, and never naming a host | `ki-pmo` |
| drain | The activity that brings a thread to a hold, under [Draining a thread](#draining-a-thread) | `ki-pmo` |
| resume | The activity that brings a thread out of a hold, or back after an interruption, from its [pick-up block](#picking-up-a-thread) | `ki-pmo` |
| pick-up block | The first thing in a coordinating thread's checkpoint: its status, its resume line and its next steps, rewritten by every banner, under [Picking up a thread](#picking-up-a-thread) | `ki-pmo` |

### Thread types

Every thread is one of three types, which Kris adopted on 2026-10-14 with "adopt the three thread types conversational, coordination and state-of-play, replacing the old names". The names "project thread" and "territory master thread" are retired; an opener or checkpoint that still uses them means the coordination thread and the state-of-play thread respectively, until it is re-bootstrapped. A thread with no stated type is conversational.

| | Conversational | Coordination | State-of-play |
| --- | --- | --- | --- |
| Purpose | Does one bounded piece of work with the owner directly | Coordinates one Project through background agents | The coordination thread of coordination threads: dispatches the territory's work into its coordination threads; project management only |
| Delegates | May, but need not | Always, under the three rules | Always, under the three rules |
| Identity | None required; an optional generic checkpoint | `+/_CHECKPOINTS/<initiative>.<project>.md`, label `<Space> > <Initiative> > <project in words>` | `+/_CHECKPOINTS/_state-of-play.md` in the Capital, label `<Space> > SoP` |
| Run and thread folder | None | Run `<project>`, folder `+/_THREADS/<project>/` | Run `<territory>-state-of-play`, folder `+/_THREADS/<territory>-state-of-play/` |
| Decisions | In the work it drives | The Project's [one list](#one-list) in the thread folder | Its own list in its thread folder |
| Banner | None: conversational replies and completed-work reports under [Reply forms](#reply-forms), with no report heading, footer banner, mark, pick-up block or resume line | The report heading, Initiative › Project, with the form line; the block-letter REST or BUSY footer; HOLD when it [drains](#draining-a-thread); DONE once at [Project close](#project-close) | The report heading, territory or Initiative › State of play, with the form line; the block-letter REST or BUSY footer; HOLD when it drains, last in a territory hold; DONE only at territory close |
| Governed by | `ki-recap` and the skills the work declares | This standard | This standard |

The conversational thread is the default and is named for what it is, a conversation, rather than "ad hoc". The coordination thread and the state-of-play thread are the coordinating threads this standard governs; where this standard says "coordinating thread" it means both.

A thread declares its type in its checkpoint's optional `role` field, under the `ki-checkpoint` [Thread role](../../../governance/ki-checkpoint/references/standards-checkpoints.md#thread-role) rule: `role: coordination` for a coordination thread, `role: state-of-play` for the state-of-play thread, and `conversational` or no field for a conversational thread. Only the `_state-of-play` checkpoint carries `role: state-of-play`. A coordinating thread adds the field at its own next checkpoint update, or when the state-of-play thread's messages block asks; until then its opener names its type, and the rubric warns that the field is missing.

Kris set the state-of-play thread's role on 2026-10-14 as "the coordination thread of coordination threads", in these words: "As the state of play thread, I think you are very much in a position where you can write directly into the projects and the checkpoints of the other coordination threads. And you're responsible for fundamentally dispatching that work around. So rather than building up more and more of your own context, the key thing is to understand mostly where that work goes first and foremost and get it dispatched out of this thread and then if I ask a similar question or an extension to something or even repeat myself you're the one who can understand all of this and then deal with that." So the state-of-play thread may write directly into the Project notes and checkpoints of its territory's coordination threads to dispatch work, through the [messages block](#directions-from-the-state-of-play-thread) at the top of a receiving checkpoint, and its first concern with any new matter is where the work goes, not holding it in its own context. A coordination thread never writes into another coordination thread's checkpoint; work for another Project goes through the state-of-play thread.

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
- **Cadence:** Kris set the update cadence on 2026-10-14, as received: "UPDATE-CADENCE / yes: add to ki-pmo - full Summary only when all dispatched work has finished or on request; otherwise timed one-to-two-line updates; a blocking query raised in a single line; the resume line shown only at rest; a report that does not repeat unchanged queries still carries the full stacked reply block for every open query". So while dispatched work is running or queued the coordinator gives timed updates of one or two lines, timestamped, when it launches work, when an agent finishes and while it waits; it raises a blocking query the moment it arises, in a single line, rather than holding it for the next report; it gives the full Summary in the [owner report](#owner-report) form only when all dispatched work has finished, or when the owner asks for one; and the resume line appears only at rest. A Summary may leave an unchanged query unrepeated, but it still carries the full stacked reply block with an entry for every open query. Between owner messages it has nothing else to say.
- **Heartbeat:** Kris added a heartbeat to the cadence on 2026-10-14, as received: "HEARTBEAT / while work runs, the thread's background check also wakes it every 5 minutes for a one-to-two-line timed update with each agent's current step; add it to the ki-pmo update cadence and the hook line, and apply it in this thread now". So while dispatched work is running the thread keeps one background check armed, a detached loop under the `ki-delegation` [monitoring](../../../governance/ki-delegation/references/standards-background-runs.md#monitoring) rules that exits as soon as any agent finishes or after 5 minutes, whichever comes first. Each time it exits, the thread wakes, reads `ki agent status` and gives a one-to-two-line timed update naming each running agent and its current step, or handles the finished agent, and then re-arms the check. The thread is therefore woken at least every 5 minutes while work runs, and sooner when an agent finishes. At rest, with nothing running or queued, no check is armed and there is no heartbeat.
- **Concurrency:** Kris set the current practice on 2026-10-14, as received: "CONCURRENCY / add the current practice to ki-pmo: chain agents that touch the same files, run different repositories in parallel, about three running per thread, the rest queued". So agents that touch the same files are chained, each launched with its wait on the one before it under [Coordination](../../../governance/ki-delegation/references/standards-background-runs.md#coordination), so that no two edit a file at once; agents working in different repositories run in parallel; and about three agents run per thread at once, the rest waiting in the [run queue](../../../governance/ki-delegation/references/standards-background-runs.md#run-queue) in priority order.

A runtime hook backs these rules: the harness `hooks/coordinator-reminder.sh` injects one line, this skill's text restating these rules, naming the cadence, the owner-report form and the banner, on every owner message, in a thread whose checkout declares `[skills.ki-pmo]` in the top-level `.ki.toml` of the hook's working directory or its Git top level. After a compaction it injects instead a pointer to [Re-anchoring after compaction](#re-anchoring-after-compaction). A repository that does not declare `ki-pmo` never gets the line, and removing the declaration disables it, as Kris settled on 2026-10-14: "HOOK-OWNER - (a). A repository that doesn't delegate then never gets the hook, and removing ki-pmo disables it." The hook stays silent in agents `ki agent` launches. It tells the runtimes apart as Kris approved the same day, "approve the hook runtime split": under Claude Code, where `CLAUDECODE` is set, it skips the terminal check, because Claude Code is interactive whether or not a terminal is attached, as in Zed; under Codex it keeps the terminal check until `KI_AGENT_RUN` reaches the Codex launcher. It is registered per machine by the user-environment manager.

Where `[skills.ki-pmo]` is declared, the hook and the output style are bound, a runtime-specific binding under Claude Code: the repository's tracked `.claude/settings.json` selects `"outputStyle": "ki-coordinator"`, and the user's Claude Code settings register `hooks/coordinator-reminder.sh` at `UserPromptSubmit` and `SessionStart`, with the style deployed as `~/.claude/output-styles/ki-coordinator.md`. The `ki-pmo` rubric checks that the binding is present and the user-environment manager, chezmoi, stays its binder, as Kris decided on 2026-10-14: "HOOK-BINDING - add a mechanical rubric item that the binding is present where ki-pmo is declared, and leave chezmoi as the binder for now".

## Coordinating-thread practices

A coordinating thread also follows these practices with the owner. Every report it gives is an [owner report](#owner-report), whose sections, queries and reply block are never shortened by any output style, proxy shaping block or communication level.

- **Questions:** a decision with clear options goes through the runtime's structured-question tool where one is available, recommended option first, a few questions per batch. The query keeps its [Needs tag](#needs-tags) either way.
- **Heading and banner:** every Summary, every [recap](#recap-since-the-mark), every [full summary](#full-summary) and every [re-bootstrap](#bootstrap) report opens with the report heading the [owner report](#owner-report) sets, so each reads cold and several threads' updates read side by side, and closes with the [footer banner](#banner) and, at rest, the resume line. The report heading is the [rich-text heading](#banner): one `#` heading, the Initiative's display name linked to its local note, then ` › `, then the Project's display name linked to its local note, with one bold line beneath it, `**<Form> at <local time> · last mark <local time>**`. Kris asked for it on 2026-10-14, as received: "maybe you can just come up with something which is just a better heading that is the actual just normal text, so it can be rich text rather than fixed width text. So maybe you do not need to say project or initiative in front of it, you use the ways of working and you render it with a sensible label, and the initiative is before that, so it says knowledge islands model, which is linked. The next line says ways of working and then you have your headings, done, in progress, queries, and then you have your banner at the end. ... after the initiative and project headings at the start you could have one line which says summary at, whatever, and last mark at.", agreed the mock at 19:15 BST with "Actually, that is really good.", and amended it with "Maybe we use a tripple HR element Before the main heading." and "And maybe then even a single HR alignment after the summary and last mark part." It replaces the framed label he had placed at 19:05 BST and the `# <label> · <form> at <local time>` heading line with the plain `Project · Initiative · <window> · <state>` line beneath it that HEADING-FORM had set, so no frame opens a report, and the window and the state are no longer written: the form fixes the window, `since your last message` for a Summary, `since <mark>` for a recap and `since the thread began` for a full summary, and the footer banner and its list carry the state. The form is `Summary`, `Recap`, `Full summary` or `Re-bootstrap`, and both times are local, written like `19:13 BST`. A report written before that day keeps its earlier heading, the framed label or the one-line heading, and anything that reads past reports accepts all three.
- **Heading levels:** in every form the report heading is the one `#` heading, in the message and in a saved file alike; the sections (`Decided`, `Done`, `In Progress`, `Queries`) are `##` headings, and each query and each topic sub-heading is `###`. No other heading levels appear.
- **Self-contained:** no Summary, recap or full summary says "unchanged, see earlier", "as before" or otherwise points back to an earlier report. What is still running and what is still open is restated each time, because the owner reads each one cold and the earlier message may be gone. Under the cadence Kris set on 2026-10-14, "a report that does not repeat unchanged queries still carries the full stacked reply block for every open query": a Summary may leave the body of an unchanged query unrepeated, naming it under `Queries` by its tag and title alone, but its reply block still carries one stacked entry for every open query; a [full summary](#full-summary) restates every open query in full.
- **Resting point:** when the thread's work is largely complete, or it is waiting on the owner, another thread, a scheduled test or an external fix, it ends with a Summary, because that is the last message the owner sees until they return. Its closing frame reads REST, its list names what it waits on, and the owner report between the heading and the footer lets the owner pick the thread up cold. Before it rests it [commits and pushes its thread folder](#committing-the-thread-folder). The resume line is given only here: Kris set on 2026-10-14 that it is "shown only at rest", so a report whose footer reads BUSY ends with its list and carries no resume line.
- **Hold:** when the owner asks the thread to drain, or puts the territory on hold, it drains to a hold under [Draining a thread](#draining-a-thread) and gives a hold report and nothing else: the report heading with the form `Hold report`, `## Done`, `## Parked` and `## Left over`, no reply block and no **Context**, **Query** or **Options**, because the queries live in the checkpoint, then the HOLD frame, its list, the closing line "To bring this thread back and continue the work, paste this:" and the resume line its [pick-up block](#picking-up-a-thread) carries.
- **Pick-up block:** every REST, BUSY, HOLD or DONE banner the thread gives also rewrites the pick-up block at the top of its checkpoint, under [Picking up a thread](#picking-up-a-thread), so that the checkpoint alone says how the thread is picked up.
- **Links:** every roadmap record a report names is linked by its full identifier to its local file, under [Linking records](#linking-records), and a pruned record is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`. The rubric flags any record identifier a thread report leaves unlinked.
- **Wording:** plain language, and "background agents", never "helpers". When the owner must paste a message into another thread, the thread gives it in a code block ready to copy.
- **Decisions:** the thread records each owner decision in the run's [decisions log](../../../governance/ki-delegation/references/standards-background-runs.md#decisions-log) before launching the work it authorises, in the turn the decision arrives, and verifies any later quotation from the transcript file, under the two rules that section sets. It classifies each entry under [Decision classes](#decision-classes) at the mark.
- **Messages:** a message from another thread reaches this one through its run's inbox, and a backend nudge is not visible progress; the [surfaces rule](#surfaces) says where the owner sees it.

### Banner

A report heading opens every Summary, recap, [full summary](#full-summary) and [re-bootstrap](#bootstrap) report, and the footer banner closes it after the reply block, so that the first thing the owner sees names the Initiative, the Project, the form and the time, and the last thing says whether the thread is at rest and gives them the one line that brings it back. Kris asked on 2026-10-14 that "every coordination-thread summary or owner report ends with a multi-line status banner modelled on the ki-recap banner. The banner states plainly whether the thread is AT REST (all work concluded, nothing in progress, no open queries) or not, and why. The banner carries one copyable resume line Kris can paste back into the thread later", settled the block-letter frame the same day with "(a). Yeah, that's great.", and, seeing threads render it differently after a re-bootstrap, said "when I'm asking threads to rebootstrap from PMO and Checkpoint and delegation, it's not doing the banner in the same way". He then drew a framed label at about 18:00 BST, refined it at 18:08 BST, at 19:05 BST placed it as the heading with "This is for the heading, not the footer banner. The footer banner needs to be like it was before, with the large ascii text.", and at 19:13 BST retired the frame from the heading too: "maybe you can just come up with something which is just a better heading that is the actual just normal text, so it can be rich text rather than fixed width text. So maybe you do not need to say project or initiative in front of it, you use the ways of working and you render it with a sensible label, and the initiative is before that, so it says knowledge islands model, which is linked. The next line says ways of working and then you have your headings, done, in progress, queries, and then you have your banner at the end. ... after the initiative and project headings at the start you could have one line which says summary at, whatever, and last mark at." He agreed the mock with "Actually, that is really good." and amended it twice: "Maybe we use a tripple HR element Before the main heading." and "And maybe then even a single HR alignment after the summary and last mark part." Of the footer he then asked "What about with some spaces around it, so that it's got a bit more impact?", and approved the padded frame with the form word on its top border with "Okay, I'm really happy with that. Yeah, let's go with it." So the heading is rich text, the footer banner is the block-letter REST and BUSY frame as it stood before, and every thread renders both the same way, whether it has just bootstrapped, re-bootstrapped from this standard, `ki-checkpoint` and `ki-delegation`, or run for days: the frames below are the only frames, and a frame that differs from them is wrong.

**Report heading.** The report opens with three horizontal rules, one `#` heading, one bold form line and one horizontal rule, then `## Done`, or `## Decided` in a full summary. It is plain Markdown, not a fenced block, so the heading carries the links a code block could not hold.

- **Rules before:** three `---` lines, each on its own line with a blank line between them, before the heading, because Kris amended "Maybe we use a tripple HR element Before the main heading." A saved report file omits them, because a file that begins with `---` is read as front matter; the file begins at the heading.
- **Heading:** `# [<Initiative>](<local Initiative note>) › [<Project>](<local Project note>)`: the Initiative's display name, the `title` its note gives, written as words, `Knowledge Islands model`, linked to the note by absolute path; then ` › `; then the Project's display name, `Ways of working`, not its slug, linked to its note the same way. A Project with no Initiative gives the Project alone. The state-of-play thread writes the territory or Initiative it covers, linked to its local note, then `› State of play`.
- **Form line:** a blank line, then `**<Form> at <local time> · last mark <local time>**`, the form being `Summary`, `Recap`, `Full summary` or `Re-bootstrap`, whichever report it opens, the first time the time the report is issued and the second the [mark](#recap-since-the-mark), both local and written like `19:13 BST`. A [hold report](#draining-a-thread) writes the form line `**Hold report at <local time> · mark <local time>**`, the mark being the one struck for the hold; it was the drain report's `**Drain report at <local time> · mark <local time>**` line Kris drew on 2026-10-15, renamed when the drain report became the hold report.
- **Rule after:** a blank line, one `---`, then a blank line and the first `##` section, because Kris amended "And maybe then even a single HR alignment after the summary and last mark part."
- **Nothing else:** no thread type, no window and no state. The form fixes the window and the [footer banner](#banner) and its list carry the state.

Opening a Summary:

<!-- ki-pmo:block heading-example -->

```markdown
---

---

---

# [Knowledge Islands model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Initiatives/knowledge-islands-model/knowledge-islands-model.md) › [Ways of working](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working/ways-of-working.md)

**Summary at 19:13 BST · last mark 14:54 BST**

---

## Done
```

The state-of-play thread opening a full summary:

```markdown
# [<territory or Initiative>](<its local note>) › State of play

**Full summary at 19:13 BST · last mark 14:54 BST**

---

## Decided
```

**Footer banner.** The footer is the `ki-recap` frame as it stood before the framed label: 52 display columns per framed line, measured by code point, a four-letter block word in `ki-recap`'s glyphs and three fixed side lines, never widened, reworded, coloured or improvised, so that transcript archives find a state by searching for its block word. Its top border reads `╭─ <form> · <YYYY-MM-DDTHH:MM:SSZ> ─` followed by enough `─` to reach the same 52 code points, then `╮`, the form being the report's form word in lower case, `summary`, `recap`, `full summary`, `re-bootstrap` or `hold report`, and `run report` in a background agent's report, so the run of `─` after the time is 17 for `summary`, 19 for `recap` and 13 for `hold report`; the form word replaced `issued` on 2026-10-14 when Kris approved the padded frame below. Directly under the top border and directly above the bottom border stands one blank framed line, `│`, 50 spaces and `│`, in the REST, BUSY, HOLD and DONE frames alike, because Kris asked "What about with some spaces around it, so that it's got a bit more impact?" and, seeing the padded frame, said "Okay, I'm really happy with that. Yeah, let's go with it." The form word and the issued time are the only parts of the frame that vary; the two blank framed lines, the three word lines and the bottom border are fixed. A report issued before that approval keeps its `issued` border and its unpadded frame, and anything that reads past reports accepts both. The states come from Kris on 2026-10-14: "a conversational thread can be considered done. That's the end of the conversation. But a coordination thread can either be busy or at rest. Whether or not it then ends up being done is more a situation about the project itself, and in effect, it's when we say that project's closed and pull out and tidy up all of the stuff that's been happening."

- **REST:** nothing is running and nothing is queued, and only that. Open queries waiting on the owner, held items, parked items, an uncommitted checkpoint and unlogged decisions do not change the word, as Kris confirmed with "open queries do not make a thread BUSY"; they show in the list beneath, where every open query has its own `[waiting]` item. The first item reads `- [at rest] nothing running or queued`.
- **BUSY:** anything is running or queued, or the thread is blocked or waiting on another thread. The list beneath says which, and no `[at rest]` item appears.
- **HOLD:** the thread has [drained](#draining-a-thread) to a hold: nothing is running or queued, its own work is committed and pushed, and every open query, held item, parked item, waiting-on item and the next step is parked in the checkpoint, with its [pick-up block](#picking-up-a-thread) at status `hold`, so the thread can be archived and later picked up from the repository alone. It closes only a hold report, its top border carrying `hold report`, with the block word HOLD and the captions threads drained, queries parked and fully archived, as Kris set on 2026-10-15 and the state-of-play checkpoint records it: "the drain report becomes a **hold report**: block letters HOLD, top border `hold report`, captions threads drained / queries parked / fully archived, closing with "To bring this thread back and continue the work, paste this:" and the resume line." Its list, in this order and only where it applies: `- [hold] nothing running or queued; committed and pushed`, `- [parked] <count> queries in the checkpoint`, and `- [left over] <what>` only if anything is left over. Then the line "To bring this thread back and continue the work, paste this:" and the resume line for the thread's type from its pick-up block. A thread that cannot drain, because work is unpushable or a run must not be stopped, closes with the BUSY frame instead and says in one line what is blocking. The HOLD frame retires the DRAINED frame and its `[drained]` item of the same day; a past report closing with DRAINED is read as a hold report.
- **DONE:** shown once only, at [Project close](#project-close), after the close-out tidy, its top border carrying the form word of the closing report, `full summary` in the example below. No resume line follows it. It shares its glyphs with `ki-recap`'s single-session frame and carries its own side lines, so the two are told apart by their words; in a coordinating thread `ki-recap`'s frame never renders, because every recap there is one of this standard's forms.
- **Gap:** one blank line follows the frame, so that the list beneath renders as a list.

Beneath the frame and its blank line comes one Markdown list, each item `- [<state>] <what>` with the state in square brackets, in this order and only where it applies: `- [at rest] nothing running or queued` when the thread is at rest; then one item per thing, because Kris said on 2026-10-14 "the running should each be a line with the running: prefix" and then drew each as a list item: each running agent as `- [running] <agent> - <what>`, each queued agent as `- [queued] <agent> - <what>` and each open Needs tag as `- [waiting] <TAG>`; then the housekeeping items of the same kind, the checkpoint and thread folder state as `- [committed] checkpoint and thread folder, pushed`, or `- [uncommitted] checkpoint`, `- [unpushed] thread folder` or `- [blocked] <what>` when that is the truth, then `- [held] <what> until <when>` for each held item, `- [parked] <count>` when any tangent is parked, `- [recovered] <UTC>` for the one report after a red x, and `- [unlogged] decisions: <count>` when any decision awaits its log entry. The label-and-mark line that stood beneath the block letters before is not restored: the issued time lives in the footer's top border, the mark in the report heading's form line, and neither appears in the list. Another reason for BUSY takes an item in words, such as `- [waiting] Master - HOOK-FIX` or `- [blocked] Headroom proxy down`. Nothing in the banner cites a decision number.

REST, closing a Summary:

<!-- ki-pmo:block rest-footer -->

```text
╭─ summary · 2026-10-14T17:03:02Z ─────────────────╮
│                                                  │
│  █▀▀▄ █▀▀▀ █▀▀▀ ▀▀█▀   · thread at rest          │
│  █▀▀▄ █▀▀  ▀▀▀█   █    · nothing running         │
│  █  █ █▄▄▄ ▄▄▄█   █    · nothing queued          │
│                                                  │
╰──────────────────────────────────────────────────╯

- [at rest] nothing running or queued
- [waiting] KI-RELEASE
- [waiting] RESUME-COMPACT
- [committed] checkpoint and thread folder, pushed
- [held] PAPERCLIP-REQ until Wave F
- [parked] 1
```

BUSY, closing a Summary:

<!-- ki-pmo:block busy-footer -->

```text
╭─ summary · 2026-10-14T17:03:02Z ─────────────────╮
│                                                  │
│  █▀▀▄ █  █ █▀▀▀ █  █   · thread busy             │
│  █▀▀▄ █  █ ▀▀▀█  ▀█▀   · running or queued work  │
│  █▄▄▀ █▄▄█ ▄▄▄█   █    · lines below say which   │
│                                                  │
╰──────────────────────────────────────────────────╯

- [running] commit-gate - why ki-principal's commit gate fails
- [running] harness-links - accept GOV-187, deliver GOV-188
- [queued] report-headings - section names, starting now
- [queued] banner-frame - after report-headings
- [waiting] HEADING-FORM
- [waiting] RUN-WAIVER
- [waiting] RECORD-THRESHOLD
- [blocked] thread folder commit by the gate, commit-gate fixing
- [held] PAPERCLIP-REQ until Wave F
```

HOLD, closing a hold report, as drawn at 52 code points in rule 5 of the restart-model design note with a real issued time on its top border:

<!-- ki-pmo:block hold-footer -->

```text
╭─ hold report · 2026-10-15T14:00:00Z ─────────────╮
│                                                  │
│  █  █ ▄▀▀▄ █    █▀▀▄   · threads drained         │
│  █▀▀█ █  █ █    █  █   · queries parked          │
│  █  █ ▀▄▄▀ █▄▄▄ █▄▄▀   · fully archived          │
│                                                  │
╰──────────────────────────────────────────────────╯

- [hold] nothing running or queued; committed and pushed
- [parked] <count> queries in the checkpoint
- [left over] <what>, only if any
```

Then the closing line and the resume line, in its own one-line fenced `text` block, here a coordination thread's, with its label and the hold's mark filled in:

To bring this thread back and continue the work, paste this:

<!-- ki-pmo:block hold-resume-line -->

```text
Resume <label> from its checkpoint under current ki-pmo and ki-delegation since <mark>: re-bootstrap, read the pick-up block, take stock, put the parked queries back, restart authorised work, then banner.
```

DONE, at Project close only:

```text
╭─ full summary · 2026-11-02T16:10:00Z ────────────╮
│                                                  │
│  █▀▀▄ █▀▀█ █▄ █ █▀▀▀   · project closed          │
│  █  █ █  █ █ ██ █▀▀    · decisions promoted      │
│  █▄▄▀ █▄▄█ █  █ █▄▄▄   · thread tidied away      │
│                                                  │
╰──────────────────────────────────────────────────╯
   KI Model - ways-of-working · closed 2026-11-02T16:10:00Z
   decisions: every entry logged since 13 October promoted, none held
   design folder resolved · checkpoint retired · thread folder deleted · run archived
   outcome: the Project note links the Decision Record on thread working and the ki-pmo standard
```

**Resume line.** After REST, and only after REST among the Summary forms, the last thing in the message is the resume line below; after HOLD it is the hold resume line above, or the one the [pick-up table](#picking-up-a-thread) gives for the thread's type, and no other resume line follows a hold report. No resume line names a host. The resume line stands in its own one-line fenced `text` block so it copies cleanly, with the thread's label and its [mark](#recap-since-the-mark) filled in. Kris set on 2026-10-14 that the resume line is "shown only at rest", so a BUSY footer ends with its list and no resume line follows it; the owner brings a busy thread back by its next Summary, which comes when all dispatched work has finished.

<!-- ki-pmo:block resume-line -->

```text
Resume <label> under current ki-pmo and ki-delegation since <mark>: re-bootstrap, mark, fresh summary with carried-forward open points, take stock, restart authorised work, then banner.
```

Pasted back into the thread, it makes the thread do these in order: re-bootstrap under [Bootstrap](#bootstrap), re-reading this standard, its [owner report](#owner-report) included, `ki-delegation`'s Reporting and its own checkpoint; strike the mark at the resume time, commit the checkpoint and confirm in one line; give a fresh Summary covering only what follows the new mark plus every open point carried forward from before it, built from the checkpoint, the decisions log and the thread folder rather than from transcript memory; take stock since the issued time on the previous banner, from the decisions log, `ki agent status`, its inbox and the owner's messages; restart any work the owner authorised since that banner; and end with a fresh banner. The label on the line is a guard: a thread whose checkpoint label does not match it stops and asks before doing anything. Kris set the order on 2026-10-14: "The resume line is the equivalent of a compaction for the checkpoint and coordination thread, and may also trigger a real compaction", so it strikes the mark first and summarises second.

**In an agent's report.** A background agent's report takes the same heading and footer, under the [owner report](#owner-report): the report heading of the thread it reports to with `› <run name>` added at its end and the form `Run report`, so its form line reads `**Run report at <local time> · last mark <local time>**`, the mark being that thread's; the thread's footer banner, list and, at rest, the resume line below. Its footer's top border carries the form word `run report`, `╭─ run report · <YYYY-MM-DDTHH:MM:SSZ> ─` filled to 52, and its two blank framed lines. It puts the footer frame and the list beneath it inside one fenced `text` block, as the examples above do, because a frame outside one is not rendered byte-identical. Opening a run report:

```markdown
# [Knowledge Islands model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Initiatives/knowledge-islands-model/knowledge-islands-model.md) › [Ways of working](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working/ways-of-working.md) › heading-rich

**Run report at 20:40 BST · last mark 14:54 BST**

---

## Done
```

### Re-anchoring after compaction

A compaction keeps a coordinating thread's session but replaces its transcript with a summary, so the thread re-anchors from durable state before it replies; a conversational thread re-reads its checkpoint, if it has one, and carries on with a conversational reply. Kris chose on 2026-10-14 to "resume line with an optional compact paste first", so the owner may bring a long thread back with two pastes, the first optional:

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

Until a notification channel exists, the checkpoint and the thread status line are the surfaces that survive a thread being idle, and the transcript is the one the owner reads first. A sender that only nudged without writing the inbox entry has not sent the message. The inbox is machine-local; a message that must reach a thread on another host, or one on hold, goes into the [messages block](#directions-from-the-state-of-play-thread) at the top of its checkpoint, which travels through Git.

### Recovering a thread showing a red x

A red x in the editor's thread list means the backend turn errored, not that the thread is lost: the checkpoint, decisions log and inbox hold everything it needs. Kris approved the recovery on 2026-10-14 with "approve red-x recovery":

1. Do not open a new thread first. Paste that thread's [resume line](#banner) into the same thread. If the thread replies, it re-anchors, strikes the mark, gives a fresh summary since the mark and takes stock, and the inbox gives it every message the outage swallowed.
2. If the editor will not send into the thread, open a new thread in the same project folder and paste the resume line. The label on the line and the checkpoint label match, so the guard passes; the old transcript becomes history.
3. The recovered thread reports, under take stock, what it missed and what it did about it, and its banner carries `- [recovered] <UTC>` in its list for that one report.

Messages sent during an outage need no re-send: the inbox is the channel, the nudge is lost, and the resume line's take stock reads the inbox.

## Reply forms

Every reply to the owner takes one of three forms, which Kris set apart on 2026-10-16, as relayed: "Please make the reporting rules explicitly distinguish ordinary conversational replies, completed-work reports, and coordinator summaries. A conversational thread can do bounded work directly without becoming a coordination thread. Routine answers and acknowledgements should stay plain, without empty reporting sections or a "No reply needed" block. When a completed-work report is required, use the owner-report format. Coordinator checkpoints, marks and banners apply only to coordinating threads."

| Form | When | Shape |
| --- | --- | --- |
| Conversational reply | The default in every thread, for anything that does not end a [unit of work](#units-of-work): answers, acknowledgements, clarifying questions, plans proposed for agreement and timed progress updates | Plain prose. No heading, section, Needs tag, reply block, `No reply needed.` or banner. A question for the owner is one line |
| Completed-work report | When a unit of work ends, in any thread, and as every background agent's final report | The [owner report](#owner-report): `## Done`, `## In Progress`, `## Queries` and the reply block. In a conversational thread it has no report heading, form line or footer banner, and opens at `## Done` |
| Coordinator summary | Only in a coordinating thread | The [report forms](#report-forms): Summary, recap, full summary, re-bootstrap and hold report, each an owner report under the report heading and form line, closing with the footer banner and, at rest, the resume line, with the pick-up block, mark and messages block that go with them |

In a coordinating thread the completed-work report is its Summary. In a conversational thread a request for a "summary", "full summary" or "status" gets a conversational reply, and a request for a "recap" gets the ordinary `ki-recap` session recap in its own form; neither borrows a coordinator form.

### Units of work

A unit of work ends, and a completed-work report is owed, when at least one of these holds for the work since the last such report:

1. **Changed:** a change to a repository, configuration or external system was committed, or was deliberately left uncommitted with the reason stated.
2. **Handed off:** work passed to another thread, repository, record or person, such as a captured record, a trade, an inbox message or a handoff item.
3. **Run finished:** a background run the thread launched has finished; for a background agent, its own run is ending.
4. **Deliverable:** a deliverable the owner asked for, such as a document, report, draft or analysis written to a file, has been produced.
5. **Stopped for the owner:** the work stopped before completion with something the owner must decide, supply or do, such as a failure, a block or a decision.

None of these ends a unit of work, and each gets a conversational reply: answering a question, however many reads it took; acknowledging an instruction or a decision; a clarifying question; an interim step or a timed update; a single read, lookup or check; a plan proposed in conversation for agreement.

A change the owner asked for and that was made in the same turn, in one file or one commit, with nothing failed, open or left to decide, is confirmed in one plain line naming what changed, and needs no report. Work that ends with nothing changed and nothing open is told in one plain line; work that ends with nothing changed but something open meets criterion 5. A background agent always reports, because its report is its run's only output. One report covers every unit that ended in the same turn.

### Conversational bounded work

A conversational thread does bounded work directly, without delegating, opening a run or becoming coordinating. The work is bounded when it serves the matter the owner raised in the thread, stays within the authority the owner gave there and each repository's own rules, and can finish with the owner in the thread. The thread may delegate when it chooses. It becomes coordinating only when the owner opens or re-bootstraps it with a coordinating [opener](#opening-a-thread), never on its own. When the work outgrows the bound, because it needs a Project's [one list](#one-list), more than one run at once, or would keep the owner waiting across sessions, the thread says so in one line and proposes the Project's coordination thread, or a new one through the state-of-play thread.

A conversational thread that delegates may take a run and a thread folder named for its checkpoint, under the thread folder's closed list and the [commit rule](#committing-the-thread-folder), as Kris answered CONVERSATIONAL-RUN on 2026-10-16 by taking CONVRUN-NARROW's option a). It pauses through a checkpoint update, with no hold report or banner, and its agents head their reports `# <thread label> › <run name>` with `**Run report at <local time>**` and no footer banner.

### Coordinator-only machinery

The report heading and form line, the footer banner, the resume line, the mark, the pick-up block, the messages block, re-anchoring after compaction, the turn budget and the heartbeat belong to coordinating threads only. A conversational thread's optional checkpoint is the plain `ki-checkpoint` record: it notes a pause in `Current state` and how to carry on in `Next step`, is resumed by `ki-checkpoint` RESUME when the owner asks, and is removed by REMOVE when the work ends.

## Owner report

Every completed-work report under [Reply forms](#reply-forms) takes one shape, the **owner report**: a background agent's final `<name>.report.md`, which the owner reads directly, a coordinating thread's Summary, including the Summary at a resting point, and the report a conversational thread gives when a unit of work ends. It replaces the Done / Failed / Needs \<owner\> report wherever that shape was set. This standard is its one source, as Kris decided on 2026-10-14: "REPORT-SOURCE - generate the hook line, output style and prompt skeleton from the ki-pmo standard with a ki dev command, make ki-delegation link to it, and have the existing test check the generated files"; `ki-delegation` links here, and the runtime surfaces are rendered from [Generated surfaces](#generated-surfaces). Kris set the format on 2026-10-13 in the `ways-of-working` thread, in these words:

> Use three major sections, in this order:
>
> 1. What has been done
>
>    Report completed outcomes clearly and concisely. Include material failures, corrections and limitations where relevant; do not hide them behind a success summary.
>
> 2. What is in progress
>
>    State what is actually running and what is waiting, with the responsible owner or dependency. Say “Nothing is running” when that is true.
>
>    Place outstanding matters that require no action from the owner here, before the outstanding queries. Label them “Outstanding — no action requested now”. Distinguish agent work, receiver-owned work, verification limitations and retained material from decisions the owner needs to make.
>
> 3. Outstanding queries
>
>    Give each actionable query its own heading:
>
>    `<stable query tag> — <plain-language title>`
>
>    Under each heading, include:
>
>    - Summary: enough context to understand the issue without rereading the thread, including its significance and current state.
>    - Need from you: the specific decision, instruction or missing information required.
>    - Recommendation: the proposed next step and why it is recommended.
>
> Keep each query independently understandable and copyable. Split unrelated decisions into separate queries. Preserve query tags until resolved; never reuse a tag for a different issue.
>
> Do not add a “Your next step” field beneath individual queries.
>
> Finish the report with one fenced text block that offers a copy button. Include every actionable query’s heading and its recommended next step, written as an instruction the owner can adopt or edit and send back. Preserve the same tags and ordering as the query sections.
>
> The suggested reply is not approval. Act on it only when the owner returns an instruction.
>
> Linking requirement
>
> Every ID or named reference to an existing record must be linked to that record, including roadmap items, checkpoints, Projects, Initiatives, decisions, receipts and evidence artifacts. Use the full identifier as the link text where applicable, rather than an abbreviated ID.
>
> For example:
>
> `[HNR-PRINCIPAL-5GE-004](</Users/krisbrown/workspaces/humans-not-robots/hnr-principal/Streams/Roadmap/HNR-PRINCIPAL-5GE-004-complete-phase-2-ms3.md>)`
>
> Prefer verified absolute local file links when the checkout is available; otherwise use the verified canonical remote link. Link a query heading to its underlying record when one exists. Preserve necessary references in the copyable reply block so the returned instruction remains unambiguous.
>
> Never invent a link. If a target cannot be resolved, state that explicitly.
>
> Keep routine outcomes brief, but give outstanding queries enough context for a considered answer. Do not turn every unresolved observation into a request for owner action.

Kris shortened the three section headings on 2026-10-14, in these words:

> What has been done -> Done What is in progress -> In Progress Outstanding queries -> Queries

The sections are therefore `## Done`, `## In Progress` and `## Queries`, spelled exactly so; nothing inside them changed. A report written before that day keeps the longer names, and anything that reads past reports accepts both.

The quotation keeps Kris's em dashes and is laid out as a blockquote; the standard's own text writes the label `Outstanding - no action requested now` and the query heading `<tag> - <title>` with a spaced hyphen. Applied:

- **Heading:** every owner report opens with the `ki-pmo` [report heading](#banner), rich text rather than a frame. Kris asked for it on 2026-10-14, as received: "maybe you can just come up with something which is just a better heading that is the actual just normal text, so it can be rich text rather than fixed width text. So maybe you do not need to say project or initiative in front of it, you use the ways of working and you render it with a sensible label, and the initiative is before that, so it says knowledge islands model, which is linked. The next line says ways of working and then you have your headings, done, in progress, queries, and then you have your banner at the end. ... after the initiative and project headings at the start you could have one line which says summary at, whatever, and last mark at.", agreed the mock with "Actually, that is really good." and amended it with "Maybe we use a tripple HR element Before the main heading." and "And maybe then even a single HR alignment after the summary and last mark part." It replaces the framed label he placed at 19:05 BST that day and the earlier `# <label> · <form> at <local time>` line with its plain `Project · Initiative · <window> · <state>` line. The heading is three `---` rules with blank lines between them, then `# [<Initiative>](<local Initiative note>) › [<Project>](<local Project note>)`, the Initiative's and the Project's display names as their notes' `title` gives them, written as words and not slugs, each linked to its local note by absolute path; a Project with no Initiative gives the Project alone, and the state-of-play thread writes the territory or Initiative it covers, linked, then `› State of play`. A blank line follows, then the form line `**<Form> at <local time> · last mark <local time>**`, then a blank line, one `---`, a blank line and `## Done`. `<Form>` is `Summary`, `Recap`, `Full summary` or `Re-bootstrap`, and both times are local, written like `19:13 BST`. No window and no state are written: the form fixes the window, `since your last message` for a Summary, `since <mark>` for a recap and `since the thread began` for a full summary, and the footer banner and its list carry the state. A background agent's run report uses the heading of the thread it reports to with `› <run name>` added at the end and the form `Run report`, the mark being that thread's; it closes with that thread's footer banner, list and, at rest, the resume line, the footer's top border reading `╭─ run report · <YYYY-MM-DDTHH:MM:SSZ> ─` filled with `─` to 52 code points and one blank framed line standing inside each border, as Kris approved on 2026-10-14 with "What about with some spaces around it, so that it's got a bit more impact?" and "Okay, I'm really happy with that. Yeah, let's go with it."; a report issued before that approval keeps its `issued` border and unpadded frame. A saved report file omits the three rules before the heading, because a file that begins with `---` is read as front matter, and the `#` heading is its H1. A report written before 2026-10-14 keeps its earlier heading, and anything that reads past reports accepts the framed label, the one-line heading and this one. A conversational thread's completed-work report has no report heading, form line or footer banner: it opens at `## Done` and ends with its reply block. A background agent reporting to a conversational thread heads its saved file `# <thread label> › <run name>`, with the form line `**Run report at <local time>**`, and closes with no footer banner. For example, a run report in its saved file:

  ```markdown
  # [Knowledge Islands model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Initiatives/knowledge-islands-model/knowledge-islands-model.md) › [Ways of working](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working/ways-of-working.md) › heading-rich

  **Run report at 20:40 BST · last mark 14:54 BST**

  ---

  ## Done
  ```

- **Sections:** the three headings `## Done`, `## In Progress` and `## Queries`, in that order, every time. An empty section still appears and says so in one line, `Nothing is running` or `No outstanding queries`, so the owner never wonders whether it was dropped. A [hold report](#draining-a-thread), the drain report renamed, is the one exception, in the shape Kris set on 2026-10-15: "A drain report has no reply block and no Context/Query/Options; the queries live in the checkpoint." Its sections are `## Done`, `## Parked` and `## Left over`, and it ends with the HOLD frame, its list, the closing line and the resume line from the pick-up block.
- **Done:** completed outcomes, one line each, with material failures, corrections and limitations beside them rather than behind them. A background agent puts its commit identifiers and check results here, because the owner reads the report and not the log.
- **In Progress:** what is running and what is waiting, each with its owner or dependency. Then, under `Outstanding - no action requested now`, the matters that need nothing from the owner, grouped as agent work, receiver-owned work, verification limitations and retained material, kept apart from the decisions the owner must make. A handoff to another thread stays outstanding until the owner expressly says it is done.
- **Queries:** one heading per actionable query, `<tag> - <plain-language title>`, linked to its record where one exists. The tag is a [Needs tag](#needs-tags). A routine open matter is not a query; it belongs in the section above. The body of a query is three bold labels and nothing else, in the shape Kris set on 2026-10-14: "on the queries... _Context:_ <This should cover enough information for you to be able to make an informed decision.> _Query:_ <The question succinctly?> _Options:_ <Possible: With the first one being recommended in the same way that you see others done, when you have the ask, you the question with (recommended) before or after its text.> - a) (recommended) blah blah - b) yah yah yah", amended the same day with "bold not italics for the "Context", "Query", "Options" please" and "if the options have a), b), then no bullet also". Applied:

  ```markdown
  ### <TAG> - <plain-language title>

  **Context:** <enough for the owner to decide without reading anything else>
  **Query:** <the question, in one sentence>
  **Options:**
  a) (recommended) <the recommended course>
  b) <an alternative>
  ```

  **Context** gives enough for the owner to decide without reading anything else, including the matter's significance and current state. **Query** is the question in one sentence. **Options** is the lettered list, `a)`, `b)` and so on, with no bullet in front of a letter; option a) is always the recommendation and carries `(recommended)` before its text. Further options appear only when they are real alternatives: a query that needs only confirmation still gives a), plus b) for the obvious alternative, such as "leave it as it is". Before 2026-10-14 a query carried **Summary**, **Need from you** and **Recommendation**; a report written before that day keeps that shape, and anything that reads past reports accepts both.
- **Reply block:** the report ends with one fenced `text` block holding one entry per open query, in the same tags and order, each prefilled with option a)'s instruction written out in full, carrying the references it needs to be unambiguous, so the owner sends the block back as it stands or edits an entry. An entry is stacked: the Needs tag alone on its own line, a blank line, then option a)'s instruction without a `<tag> -` prefix and without its letter or `(recommended)`; between entries a blank line, `---`, then a blank line, with no `---` after the last entry. Kris asked for the stacked form on 2026-10-14: "Can we see the way that the default copy block is? So it's easier to use it. There's often quite a lot of detail now on per line." A completed-work report with no queries keeps `No reply needed.` as the block's only line; a conversational reply carries neither the block nor that line. To choose another option, the owner replaces the instruction with that option's letter, `b)` or `b`, or with its text; whoever reads the reply accepts a bare letter as an answer and resolves it against the query's lettered options. An entry never lists the options or restates the choice as a menu: the options live in the query body, and the entry carries the one the recommendation chose. Kris corrected the menu form on 2026-10-14: "the proposed copy block is including all the options, rather than the recommended option." Only where the owner alone can supply a value the thread cannot know, such as a date, an amount or a name, does the entry carry an angle-bracket placeholder naming it, such as `<date>` or `<amount>`, so the owner edits one token. It is a suggested reply, not approval: nothing in it is acted on until the owner returns an instruction. A query and its reply-block entry:

  ```markdown
  ### LINK-GUARD - where the link guard should live

  **Context:** The hook line already names the linking rule, and KI-HARNESS-GOV-188 carries the harness half; the link printer is a `ki` change and the output style is chezmoi-managed, so each half has a different home.
  **Query:** Should the link guard be split across the three homes, or held in the harness until the printer lands?
  **Options:**
  a) (recommended) split it: hook line and KI-HARNESS-GOV-188 in the harness, the printer in KI-TOOL-KI-CLI-127, the output style handed to Rig
  b) hold the whole guard in the harness until the printer lands
  ```

  A reply block with two queries:

  ```text
  LINK-GUARD

  approve: hook line plus KI-HARNESS-GOV-188 in the harness, link printer in KI-TOOL-KI-CLI-127, output style handed to Rig: chezmoi

  ---

  THREAD-FOLDER

  confirmed as delivered
  ```

  The owner who prefers option b) of the first query sends `b` beneath `LINK-GUARD` instead.
- **Headings:** the three sections are `##` headings and each query is a `###` heading, so a report nests the same way wherever it appears, under the one `#` report heading, whether a coordinating thread's or a background agent's. Sub-headings inside `Done`, where a long report groups outcomes by topic, are `###` too.
- **Links:** every record, checkpoint, Project, Initiative, decision, receipt and evidence artefact under [Linking records](#linking-records); a pruned roadmap record, which has no local file any more, is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`, the last revision being the last commit in which the file existed, usually the parent of the prune commit.
- **Levels:** the owner's personal instructions set a communication level, `quiet`, `standard` or `detailed`, and this standard does not restate those instructions. The shape is the same at every level; the level sets only depth. Under `quiet`, the status-line cadence during work is unchanged, this report replaces the end-of-unit report, done items are one line each, in-progress items name only the work and what it waits on, and a query carries just enough context to be answered cold. `standard` adds material context and exceptions to each section. `detailed` adds the plan, validation evidence and rationale. No level hides a failure, a required decision or a material risk.

### Needs tags

Each outstanding query carries a short mnemonic tag, such as `BOT-1`, `CSWAP` or `PUSH`, rather than a bare number, so the owner can reply "BOT-1 do it". The tag heads the query in an owner report, labels the same item in a checkpoint and a recap, and is the one vocabulary for open items wherever they appear. A tag is stable: it keeps its meaning across repeated reports until the item is resolved and is never reused for something else. Queries are never numbered. In the reply block the tag opens its entry on a line of its own, with the recommended instruction beneath it, so a returned reply pairs each tag line with the instruction paragraph that follows it and carries the answer rather than the choice; a bare `BOT-1 do it` still names its query.

### Generated surfaces

This section is the one source of the owner-report text the runtime surfaces carry, so that a change to the shape is made here once. `ki dev skill generate ki-pmo` renders each surface from it and reports any that differs, `--write` rewrites them from a development-linked harness checkout, and the `ki-pmo` banner test fails when a committed surface is out of step:

| Source | Rendered into |
| --- | --- |
| `hook-line` | the `line` variable of the harness `hooks/coordinator-reminder.sh`, injected on every owner message |
| `hook-pointer` | the `pointer` variable of the same hook, injected after a compaction |
| `run-report` | the **Report** paragraph of `ki-delegation`'s [run-prompt skeleton](../../../governance/ki-delegation/assets/run-prompt.md) |
| `footer-report` | the report rule of each of `ki-delegation`'s four authority footers |
| `output-style` | the whole harness `output-styles/ki-coordinator.md`, with `{{heading-example}}`, `{{rest-footer}}`, `{{busy-footer}}`, `{{hold-footer}}`, `{{hold-resume-line}}` and `{{resume-line}}` replaced by the [Banner](#banner) examples marked with the same names, so each frame is written once |

Edit the text here and never in a rendered file. A hook source holds no single quote, because the hook assigns it in single quotes.

<!-- ki-pmo:source hook-line -->

```text
In a coordinating thread only, one opened or resumed as a ki-pmo coordination or state-of-play thread; in a conversational thread ignore this line and reply in the ki-pmo Reply forms. Coordinator: do not do the work directly; delegate every unit of work to a detached background agent and stay responsive. Answer this message within one short turn. It does not pre-empt work in flight: do not stop or disturb a running agent unless it names one. While dispatched work runs, give timed one-to-two-line updates and keep a background check armed that exits when any agent finishes or after 5 minutes; at each wake give a one-to-two-line timed update naming the current step of each running agent from ki agent status, then re-arm it, with no heartbeat at rest; raise a blocking query in a single line, and give the full Summary in owner-report form only when all dispatched work has finished or on request, opening with the ki-pmo report heading: three --- rules, then one # heading of the Initiative linked to its local note, then ›, then the Project linked to its local note, both as display names, then a bold <Form> at <local time> · last mark <local time> line, then one --- rule; no frame, thread type, window or state line. Close every Summary, recap, full summary and re-bootstrap report with the ki-pmo footer banner: the block-letter REST or BUSY frame exactly as the standard prints it, the lower-case form word and issued time in its top border and one blank framed line inside each border, then a blank line, then one Markdown list with a bracketed state per item, - [running], - [queued] or - [waiting], or - [at rest] nothing running or queued when nothing is running or queued, then the housekeeping items such as - [blocked] and - [held], with no label-and-mark line, then, at rest only, the resume line in its own text block; each query gives Context, a one-sentence Query and lettered Options with a) (recommended) first and no bullets, and each reply-block entry stacks its tag on one line, a blank line, then the option a) instruction in full, never a menu of options, with --- between entries, a bare letter in reply being accepted. Every roadmap record a report names is linked by its full identifier to its local file, and a pruned record is linked as its full identifier followed by (pruned) to the GitHub link to the file at its last revision, usually the parent of the prune commit. Commit and push the thread folder under +/_THREADS/ at every report and resting point, and at each resting point and mark delete by explicit path every report there whose queries are all answered and whose outcome has a durable home, keeping only reports with open queries and decisions.md, with Git history holding the rest. Chain agents that touch the same files, run different repositories in parallel, about three running at once and the rest queued. Every REST, BUSY, HOLD or DONE banner first rewrites the pick-up block at the top of the checkpoint, its status, resume line and next steps, and a mark rewrites its heading; no thread state or resume line names a host. Act on each line of the Messages from Master block at the top of the checkpoint, then remove it. Commit your own work; push only when your own commits alone are stacked, and name other sessions commits to the owner, who decides the push. When the owner asks for a hold, follow Draining a thread in ki-pmo: drain by wrapping up, committing and pushing by explicit path, parking every open query in the checkpoint and setting the pick-up block status to hold with Running: nothing, make no baseline commit, then give only a hold report: the report heading with a bold Hold report at <local time> · mark <local time> line, then ## Done, ## Parked and ## Left over, with no reply block and no Context, Query or Options, then the HOLD frame exactly as the standard prints it, its list, the line To bring this thread back and continue the work, paste this: and the resume line from the pick-up block; a thread that cannot drain uses the BUSY frame and says in one line what is blocking.
```

<!-- ki-pmo:source hook-pointer -->

```text
Context was compacted. In a coordinating thread, before replying, follow "Re-anchoring after compaction" in the ki-pmo coordinating-thread standard (skills/change-management/ki-pmo/references/standards-pmo.md): re-read the standard and your checkpoint in full, run ki agent status and read your inbox, then confirm in one line and answer in owner-report form with the report heading and the footer banner. Re-anchoring moves no mark. In a conversational thread, re-read your checkpoint if you have one and carry on with a conversational reply.
```

<!-- ki-pmo:source run-report -->

```markdown
**Report** to `<report path>` as an owner report: the ki-pmo report heading of the thread you report to with `› <run name>` added, `# [<Initiative>](<local Initiative note>) › [<Project>](<local Project note>) › <run name>`, the bold `**Run report at <local time> · last mark <local time>**` line and one `---`, then `## Done`, `## In Progress` and `## Queries`, each query carrying **Context**, **Query** and lettered **Options** with `a) (recommended)` first, the reply block whose entries carry the option a) instruction in full, then, for a coordinating thread, its block-letter footer banner, `run report` and the issued time on its top border and one blank framed line inside each border, with its list and, at rest, the resume line; a conversational thread's run report has no mark in its form line and no footer banner.
```

<!-- ki-pmo:source footer-report -->

```markdown
- Write the report as the owner report the ki-pmo [owner-report standard](../../../change-management/ki-pmo/references/standards-pmo.md#owner-report) sets: the ki-pmo report heading of the thread you report to with `› <run name>` added, `# [<Initiative>](<local Initiative note>) › [<Project>](<local Project note>) › <run name>`, then the bold `**Run report at <local time> · last mark <local time>**` line and one `---`; `## Done`, with commit identifiers and check results; `## In Progress`; `## Queries`, each query carrying **Context**, **Query** and **Options** with `a) (recommended)` first and no bullets, ending with the copyable reply block whose entries carry the option a) instruction in full, then, for a coordinating thread, its block-letter footer banner, `run report` and the issued time on its top border and one blank framed line inside each border, with its bracketed-state list and, at rest, the resume line; a conversational thread's run report has no mark in its form line and no footer banner.
```

<!-- ki-pmo:source output-style -->

````markdown
---
name: ki-coordinator
description: Coordinating thread under ki-pmo, set aside in a conversational thread or a background agent. The thread delegates every unit of work to a detached background agent, stays responsive to the owner, reports in the owner-report shape, which is never shortened, opens every report with the ki-pmo report heading and closes it with the block-letter footer banner and, at rest, the resume line.
---

# Coordinating thread

This style applies only in a coordinating thread, a session the owner opened or resumed as a `ki-pmo` coordination or state-of-play thread. In a conversational thread, set it aside and reply in the `ki-pmo` reply forms: a plain conversational reply by default, and the owner report without heading or banner when a unit of work ends. A background agent follows its brief's report rule.

You are a coordinating thread under the Knowledge Islands `ki-pmo` standard: the state-of-play thread or a coordination thread. Kris set the principle for such threads on 2026-10-13 in these words:

> It's imperative that you do not do the work directly and that you delegate that work to subagents so that you remain responsive. And if I send you a message, it doesn't preempt any work that you are already doing. This is a fundamental requirement of the delegation capability.

Three rules follow from it, and they are hard:

1. **The thread never does substantive work itself.** A coordinating thread dispatches, decides with the owner and reports. Nothing else.
2. **Every unit of work goes to a detached background agent.** Through `ki agent`, in its own session, surviving anything that happens to the thread. An in-session subagent is not a background agent.
3. **An owner message never pre-empts work in flight.** It steers: the thread folds it into running and queued work and answers within one short turn. A background agent stops only when the owner names it and says stop.

A turn makes at most five tool calls. Reads are limited to the checkpoint, `ki agent status`, one report and one short file; writes are limited to the checkpoint, the decisions log and a brief. Anything beyond is a launch. Wait only through a detached waiter or monitor, never in the foreground. If you notice you have drifted into doing work, stop, delegate the rest, tell the owner in one line and note it in the checkpoint. While dispatched work is running or queued, give timed one-to-two-line updates, timestamped, when you launch work, when an agent finishes and while you wait; keep one background check armed, a detached loop that exits when any agent finishes or after 5 minutes, and at each wake give a one-to-two-line timed update naming each running agent's current step from `ki agent status`, then re-arm it, so you wake at least every 5 minutes while work runs and no heartbeat runs at rest, as Kris set the same day: "HEARTBEAT / while work runs, the thread's background check also wakes it every 5 minutes for a one-to-two-line timed update with each agent's current step; add it to the ki-pmo update cadence and the hook line, and apply it in this thread now"; raise a blocking query in a single line the moment it arises; give the full Summary only when all dispatched work has finished or when Kris asks for one; between owner messages you have nothing else to say. Kris set that cadence on 2026-10-14: "UPDATE-CADENCE / yes: add to ki-pmo - full Summary only when all dispatched work has finished or on request; otherwise timed one-to-two-line updates; a blocking query raised in a single line; the resume line shown only at rest; a report that does not repeat unchanged queries still carries the full stacked reply block for every open query". Chain agents that touch the same files, run different repositories in parallel, and keep about three agents running per thread with the rest queued, as Kris set the same day: "CONCURRENCY / add the current practice to ki-pmo: chain agents that touch the same files, run different repositories in parallel, about three running per thread, the rest queued". Replies carry no raw tool output.

Every report to the owner is an **owner report**, in the shape Kris set on 2026-10-13. It opens with the `ki-pmo` report heading, rich text and not a frame, the shape Kris asked for on 2026-10-14 with "maybe you can just come up with something which is just a better heading that is the actual just normal text, so it can be rich text rather than fixed width text. So maybe you do not need to say project or initiative in front of it, you use the ways of working and you render it with a sensible label, and the initiative is before that, so it says knowledge islands model, which is linked. The next line says ways of working and then you have your headings, done, in progress, queries, and then you have your banner at the end. ... after the initiative and project headings at the start you could have one line which says summary at, whatever, and last mark at." and agreed with "Actually, that is really good.": three `---` rules with blank lines between them, then one `#` heading, `# [<Initiative>](<local Initiative note>) › [<Project>](<local Project note>)`, the Initiative's display name as its note's `title` gives it, linked, then ` › `, then the Project's display name, written as words such as `Ways of working`, linked; a Project with no Initiative gives the Project alone, and the state-of-play thread writes the territory or Initiative it covers, linked, then `› State of play`. A blank line follows, then one bold line, `**<Form> at <local time> · last mark <local time>**`, the form being `Summary`, `Recap`, `Full summary` or `Re-bootstrap` and both times local, written like `19:13 BST`; then a blank line, one `---`, a blank line and the first section, as the Banner section below draws it, because Kris amended "Maybe we use a tripple HR element Before the main heading." and "And maybe then even a single HR alignment after the summary and last mark part." No frame, no thread type, no window and no state open a report: the form fixes the window, and the footer banner and its list carry the state. A report written before that day keeps its earlier heading. Beneath the rule come three `##` sections, `Done`, `In Progress` and `Queries`, spelled exactly so since Kris shortened them on 2026-10-14, in this order, every time, and an empty one still appears and says so:

1. **Done.** Completed outcomes, one line each, with material failures, corrections and limitations beside them rather than behind them.
2. **In Progress.** What is running and what is waiting, each with its owner or dependency, or `Nothing is running`. Then, under `Outstanding - no action requested now`, the matters that need nothing from the owner, kept apart from the decisions the owner must make.
3. **Queries.** One `###` heading per actionable query, `<tag> - <plain-language title>`, where the tag is a stable mnemonic Needs tag, never a number, linked to its record where one exists, carrying **Context**, **Query** and **Options** and nothing else, in the shape Kris set on 2026-10-14: `**Context:**` gives enough for the owner to decide without reading anything else, `**Query:**` is the question in one sentence, and `**Options:**` is followed by lettered lines with no bullet, `a) (recommended) <the recommended course>` always first and `b) <an alternative>` beneath it, further letters only for real alternatives. A query written before 2026-10-14 keeps its Summary, Need from you and Recommendation. Or `No outstanding queries`.

The report then gives one fenced `text` block with one stacked entry per query, in the same tags and order: the tag alone on its own line, a blank line, then option a)'s instruction written out in full with the references it needs, and between entries a blank line, `---` and a blank line, with no `---` after the last. A report with no queries keeps `No reply needed.` An entry never lists the options or restates the choice as a menu; the options live in the query body, and the entry carries option a), so the owner sends the block back as it stands, edits an entry, or replaces an entry's instruction with another option's bare letter or text, and a bare letter is accepted as the answer. Only where the owner alone can supply a value, such as a date or an amount, does the entry carry an angle-bracket placeholder naming it. It is a suggested reply, not approval. A full summary adds `## Decided` before the three sections, every owner decision linked. Every record, checkpoint, Project, Initiative and decision is cited by its full identifier and linked to its local file by absolute path; a roadmap record that has been pruned is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`, the last revision being the last commit in which the file existed, usually the parent of the prune commit; a link is never invented, and the `ki-pmo` rubric flags any record identifier a thread report leaves unlinked. No report says "see earlier" or "as before": what is still running and still open is restated in full each time.

## Banner

Every Summary, recap, full summary and re-bootstrap report opens with the `ki-pmo` report heading and closes, after the reply block, with the `ki-pmo` footer banner. The heading is rich Markdown, drawn below; the footer is a frame, 52 code points per framed line, never widened beyond its width, reworded, coloured or improvised, and a thread that has just bootstrapped or re-bootstrapped renders both exactly as one that never left.

The report heading, opening a Summary:

{{heading-example}}

A background agent's run report adds `› <run name>` to the heading, uses the form `Run report` and writes `run report` on its footer's top border.

The footer banner is the block-letter frame as it stood before the framed label of 2026-10-14, which Kris restored with "The footer banner needs to be like it was before, with the large ascii text.": the top border `╭─ <form> · <YYYY-MM-DDTHH:MM:SSZ> ─` filled with `─` to 52, the form being the report's form word in lower case, `summary`, `recap`, `full summary`, `re-bootstrap` or `hold report`, one blank framed line, the three block-letter rows with their three captions, one blank framed line, and the bottom border, exactly as drawn below and in no other way, the padding and the form word being what Kris approved on 2026-10-14 with "What about with some spaces around it, so that it's got a bit more impact?" and "Okay, I'm really happy with that. Yeah, let's go with it." The form word and the issued time are the only parts that vary. A blank line follows the frame; then comes one Markdown list of `- [<state>] <what>` items, with no label-and-mark line, because the footer's top border carries the issued time and the report heading's form line the mark; then, only when the footer reads REST, the resume line in its own one-line fenced `text` block as the last thing in the message; a BUSY footer ends with its list, because Kris set on 2026-10-14 that the resume line is "shown only at rest". A Summary may leave an unchanged query unrepeated, but its reply block still carries an entry for every open query.

REST when nothing is running and nothing is queued, and only that; open queries, held items, parked items and an uncommitted checkpoint do not change the state. The first item reads `- [at rest] nothing running or queued`:

{{rest-footer}}

BUSY when anything is running or queued, or the thread is blocked or waiting on another thread; the list says which and no `[at rest]` item appears:

{{busy-footer}}

The list, in order and only where it applies: `- [at rest] nothing running or queued` when the thread is at rest; then one item per thing, `- [running] <agent> - <what>` for each running agent, `- [queued] <agent> - <what>` for each queued agent and `- [waiting] <TAG>` for each open Needs tag; then the housekeeping items, `- [committed] checkpoint and thread folder, pushed` or the `[uncommitted]`, `[unpushed]` or `[blocked]` truth, `- [held] <what> until <when>` for each held item, `- [parked] <count>`, `- [recovered] <UTC>` for the one report after a red x and `- [unlogged] decisions: <count>`. The issued time lives in the footer's top border and the mark in the report heading's form line, and neither appears in the list. Another reason for BUSY takes an item in words. Nothing in the banner cites a decision number. The resume line, given only after a REST footer, with the thread's label and mark filled in:

{{resume-line}}

HOLD when the owner has asked the thread to drain to a hold and it has: in Kris's words of 2026-10-15, "a Mark is a point in time and a Hold / Drain is a Mark + stopping all work", and "hold is a better word than drain. And what happens when you go on a hold is that you drain any work that is ongoing by not restarting any." Hold is the state; drain and resume are the activities. A hold serves a move between hosts or closes the thread for a period, and no thread state or resume line names a host. Follow the `ki-pmo` standard's Draining a thread: wrap up, letting an agent that will finish within about 15 minutes finish and stopping any other at a safe point with where it stopped and how to restart it recorded; commit your own work by explicit path in every repository you or your agents touched, pull with rebase and push fast-forward only, never with `--no-verify` or a force-push, naming any other session's commit or uncommitted file without touching it; strike a mark and park every open query, with its tag, one line of context and its recommended option, every held, parked and waiting-on item and the next step in the checkpoint, rewrite its pick-up block with status `hold`, the hold resume line for the thread's type and its next steps when back in use, with `Running: nothing` in its `Current state`, copy into the thread folder what resuming needs from the run's state folder, and commit and push the checkpoint and thread folder; make no baseline or empty commit. Then give a hold report and nothing else: the report heading with the form line `**Hold report at <local time> · mark <local time>**`, `## Done` with one line per repository, `## Parked` with the tags parked in the checkpoint, one line each, and `## Left over`, or `Nothing`, with no reply block and no Context, Query or Options, because, in Kris's words, "the queries live in the checkpoint"; then the HOLD frame exactly as drawn, with the UTC time in its top border, then its list, then "To bring this thread back and continue the work, paste this:" and the resume line its pick-up block carries, here a coordination thread's:

{{hold-footer}}

To bring this thread back and continue the work, paste this:

{{hold-resume-line}}

If the thread cannot drain, because work is unpushable or a run must not be stopped, it uses the BUSY frame instead and says in one line what is blocking.

The DONE frame, in the same block letters, appears once only, at Project close after the close-out tidy, under the `ki-pmo` standard, and no resume line follows it.

Every REST, BUSY, HOLD or DONE banner first rewrites the pick-up block at the top of the checkpoint, its status, resume line and next steps, under the `ki-pmo` standard's Picking up a thread, and a mark rewrites its heading. At bootstrap and at each owner message, act on each line of the `Messages from Master` block beneath it, then remove the line. Commit your own work; push it fast-forward only when your own commits alone are stacked, and name any other session's stacked commits to the owner, who decides the push, as Kris set on 2026-10-14: "each agent session commits its own work. And if there's a need or it has little confidence in the other commits that are stacked up with it, that's flagged to me, and I will then push if I'm happy with the push."

After a compaction, before replying, follow the `ki-pmo` standard's re-anchoring: re-read the standard and your checkpoint in full, run `ki agent status` and read your inbox, confirm in one line, then answer in owner-report form with the report heading and the footer banner; the owner may paste an optional `/compact` line before the resume line. At every owner report and resting point, commit and push the thread folder under `+/_THREADS/<run>/` by explicit path. At each mark, delete by explicit path every report in your own thread folder whose queries are all answered and whose outcome has a durable home, a record, the decisions log, the checkpoint or a commit, keeping only reports with open queries and `decisions.md`, so that Git history holds the rest, as Kris set on 2026-10-14: "THREAD-TIDY / add a rule to ki-pmo: at each mark the thread deletes every report whose queries are all answered and whose outcome has a durable home, keeping only reports with open queries and decisions.md, with Git history holding the rest; each thread applies it to its own folder at its next mark, starting with this one once the commit gate passes". Kris made the tidy regular on 2026-10-16, taking option a) of THREADS-TRIM, so tidy the folder at every resting point too, not only at a mark, and, as the state-of-play thread, name each folder the `ki-pmo` rubric flags in its checkpoint's messages block at your own mark.

No section, query, reply block or banner of an owner report is ever shortened by this style, by any proxy shaping block or by a communication level. Those govern the prose around the report, not the report itself. Record each owner decision in the decisions log in the turn it arrives, in the owner's words, before launching the work it authorises, and describe a decision by its words and date, never by its number.
````

## Report forms

A coordinating thread, and only a coordinating thread, reports in three forms, and in a fourth, the hold report, when it drains to a hold; a conversational thread uses the first two [reply forms](#reply-forms). Each of the three is one [owner report](#owner-report) under the [report heading](#banner), closing with the [footer banner](#banner) and, at rest, the resume line, and they differ only in window and in what the window makes each section hold:

| Form | Window | Given | Sections |
| --- | --- | --- | --- |
| Summary | since your last message | when all dispatched work has finished, when the owner returns after a gap, on request, "summary", and at the resting point; while dispatched work is running or queued, timed one-to-two-line updates stand in for it and a blocking query is raised in a single line, under [Coordinator responsiveness](#coordinator-responsiveness) | the owner report for that window; closes with the banner, and at rest with the resume line |
| [Recap](#recap-since-the-mark) | since the mark | on request, "recap"; "recap and mark" rolls up and then re-strikes | the owner report, with `Done` covering what was delivered, decided, started, stopped or blocked, and newly captured since the mark; closes with the banner |
| [Full summary](#full-summary) | since the thread began | on request, "full summary", "summary in full" or the like | `## Decided` first, then the owner report, each section whole-thread and every open query in full; closes with the banner |
| [Hold report](#draining-a-thread) | the drain itself | once, when the owner asks the thread to drain or puts the territory on hold, and nothing else in that message | `## Done`, one line per repository; `## Parked`, the tags parked in the checkpoint; `## Left over`; no reply block; closes with the HOLD frame, its list, the closing line and the resume line |

The re-bootstrap report is the three-line report a thread gives under [Bootstrap](#bootstrap). The hold report is the fourth form, which Kris added on 2026-10-15 as the drain report with "Add Drain as a thread state and a report form ("Drain report") beside Summary, Recap, Full summary and Re-bootstrap, and add the DRAINED footer frame below beside REST, BUSY and DONE.", and renamed the same day when "hold is a better word than drain".

A plain "summary" gets the Summary; "since the mark" gets the recap; "in full" or "full summary" gets the full summary. Only the recap interacts with the mark, and only when the owner says "mark". The skill is also invocable directly as `/ki-pmo summary`, `/ki-pmo recap`, `/ki-pmo full-summary` and `/ki-pmo mark`, which give the same forms and strike the mark; the invocation adds no fourth form. Every report is followed by [committing and pushing the thread folder](#committing-the-thread-folder).

`ki-recap` keeps the ordinary session recap only, and every summary, recap or full summary in a coordinating thread is one of these forms, as Kris decided on 2026-10-14: "RECAP-OWNER - ki-recap keeps the ordinary session recap only, and ki-pmo's standard carries the one sentence saying so".

### Full summary

A **full summary** is the owner report for the whole thread: everything decided, done, running and open since the thread began, in one reply, so that the owner holds all the context without reading earlier messages. Kris asked for it on 2026-10-13 as "a summary of things that have been decided, ongoing work and outstanding queries ... in full so I have all the context in one reply", and adopted the proposed shape the same day in the `ways-of-working` thread. A coordinating thread gives one whenever the owner asks for a "full summary", a "summary in full", or anything else that asks for the whole thread in one reply. It never moves the mark.

Its shape, in this order:

- **Heading:** the [report heading](#banner), its form line reading `**Full summary at <local time> · last mark <local time>**`.
- **`## Decided`:** every owner decision since the thread began, as a numbered list or a two-column table, one line each in the order taken, each linked to its entry in the thread's tracked [decisions log](../../../governance/ki-delegation/references/standards-background-runs.md#decisions-log) or to the record that now holds it. A decision that a later one superseded stays on its line and says so.
- **`## Done`:** the whole thread's completed outcomes, grouped by topic under `###` sub-headings wherever more than a few lines would otherwise run together, with failures, corrections and limitations beside the outcomes they qualify.
- **`## In Progress`:** as the owner report, with `Outstanding - no action requested now` beneath it. A dated upcoming deadline or scheduled event belongs there with its date, so the owner sees what is coming without being asked anything.
- **`## Queries`:** every open query, however long it has been open, restated in full under its own `### <tag> - <title>` heading with **Context**, **Query** and **Options**, the options lettered with a) marked `(recommended)` and no bullets, in the [query shape](#owner-report) Kris set on 2026-10-14 with "_Context:_ <This should cover enough information for you to be able to make an informed decision.> _Query:_ <The question succinctly?> _Options:_", written to be answered cold. A query written before that day keeps its Summary, Need from you and Recommendation. Nothing is shortened because it was asked before.
- **Reply block:** the fenced `text` block carries one stacked entry per open query, the tag alone on its line, a blank line, then option a)'s instruction written out in full, entries separated by a blank line, `---` and a blank line, so the owner can send the block back as it stands, edit an entry or replace an entry's instruction with another option's bare letter, never a menu of the options, with a placeholder only where the owner alone can supply the value, under the `ki-delegation` [reply-block rule](#owner-report). Kris corrected the menu form on 2026-10-14: "the proposed copy block is including all the options, rather than the recommended option." and asked for the stacked layout the same day: "There's often quite a lot of detail now on per line."
- **Banner:** the closing block-letter [footer](#banner), its list and, at rest, the resume line, after the reply block.

Low-stakes choices the thread has already made, where the owner's silence is consent, go in one query headed `DEFAULTS - defaults unless you say otherwise`: the Context one line per choice, the Query `keep these defaults?`, the Options `a) (recommended) keep the defaults` and `b) object to the ones you name`, and one reply-block entry, `DEFAULTS` on its line and `keep the defaults` beneath it. A choice the owner objects to becomes its own tagged query. A decision that is not low-stakes never goes there, and no other query bundles more than one decision: a query the owner cannot answer with one instruction is two queries.

Sources are the thread's decisions log from the thread's start, every background-agent report in the thread folder and, for the reports a [tidy](#tidying-the-thread-folder) has deleted, their last revision in Git history, the checkpoint's open Needs-tagged queries and parked tangents, `ki agent status`, and the Git history of the thread's scope since the checkpoint's `created_at`. Where a report is missing from the thread folder and from Git history, the full summary says what it could not read rather than reconstructing it from memory.

## Coordination threads

A coordination thread coordinates exactly one Project for the owner. It is always delegation-based: it runs its work as background agents through `ki agent` under the `ki-delegation` [background-run standard](../../../governance/ki-delegation/references/standards-background-runs.md), in a run named after the Project, and keeps its own turns short under [Coordinator responsiveness](#coordinator-responsiveness).

- **Checkpoint:** the thread resumes from the Project's `ki-checkpoint` checkpoint, which holds current state only, and keeps it current. The checkpoint is named `<initiative>.<project>.md` and the state-of-play thread's `_state-of-play.md`, under [the checkpoint naming rule](../../../governance/ki-checkpoint/references/standards-checkpoints.md#coordination-thread-naming); a Project that changes Initiative has its checkpoint renamed in the same change. The checkpoint also holds the thread's [mark](#recap-since-the-mark).
- **Decisions:** it records each owner approval with `ki agent decide <run>` before launching the work that approval authorises, in the Project's [one list](#one-list).
- **State-of-play thread:** the [state-of-play thread](#state-of-play-thread) owns cross-project priorities, releases, and decisions touching more than one Project. Releases follow the `ki-repo-tools` release-on-demand policy: a delivery run never releases by default, and a release run carries the `release` footer for the named release only. A coordination thread raises those there.
- **Naming:** where the runtime can name a session, the thread takes the checkpoint's `label`, such as `KI > Model > ways of working`, so the state-of-play thread can find it. The label is presentation only; [the checkpoint label rule](../../../governance/ki-checkpoint/references/standards-checkpoints.md#thread-label) owns its form, `<Space> > <Initiative> > <project in words>`, which Kris adopted on 2026-10-15 from a thread list running `KI > SoP`, `KI > Model > ways of working`, `KI > mics / webcams` and `Acquire > intake (sol)`: "this is a better way I think". A `(<host>)` suffix appears only for a thread limited to that machine, in Kris's words "the machine is only added if its limited to that machine", so a thread that resumes anywhere names no host. A label in the earlier `<Initiative title>: <project>` form stays until the owner approves its change.
- **Opening:** open a coordination thread only where there is active work to drive, within the state-of-play thread's [cap](#state-of-play-thread). A dormant Project needs no thread.
- **Scope:** it works only its own Project's records. Work that belongs to another Project goes to that Project's thread or checkpoint through the state-of-play thread.
- **Close:** it ends with DONE only at [Project close](#project-close), after the tidy; until then it alternates REST and BUSY, and a thread [drained](#draining-a-thread) to a hold ends its session HOLD, to resume from its checkpoint's [pick-up block](#picking-up-a-thread).

### State-of-play thread

Each territory Capital has one state-of-play thread: the coordination thread of the territory's coordination threads. Its checkpoint is `+/_CHECKPOINTS/_state-of-play.md` in that Capital, labelled `<Space> > SoP`, such as `KI > SoP`, or `Master: state-of-play` until the owner approves the change, and it does project management only: it runs no delivery itself and routes all real work to coordination threads. No repository other than a Capital holds a `_state-of-play.md` checkpoint. It shows DONE only when the territory closes.

- **Registry:** the Initiatives and Projects it manages are defined in the Capital's `Streams/` registry under the `ki-work` Project registry standard, and their work records live in the roadmaps of the territory's repositories.
- **Owns:** cross-Project priorities, releases, decisions touching more than one Project, [directions](#directions-from-the-state-of-play-thread) to coordination threads, written directly into their checkpoints and Project notes, the coordination-thread queue, and a territory [hold](#draining-a-thread) with the list of threads to restart from it.
- **Cap:** at most three or four coordination threads are active at once, plus the state-of-play thread. It keeps the active threads and the ordered queue in its checkpoint's `Current state`, each with its label, checkpoint and opener, and opens the next queued thread when an active one closes. Within one thread, about three background agents run at once and the rest wait in the run queue, agents that touch the same files chained and different repositories in parallel, under [Coordinator responsiveness](#coordinator-responsiveness).
- **Seeding:** before a coordination thread opens, the state-of-play thread creates or reconciles its `<initiative>.<project>.md` checkpoint and gives the owner its [opener](#opening-a-thread), so the thread opens with one message.
- **Run:** run names share one machine-wide namespace, so the state-of-play thread's run is `<territory>-state-of-play`, using the territory handle; a run that predates this rule may keep its existing name. A coordination thread's run takes the Project name, prefixed with the territory handle where another territory already uses that name.
- **Tidy flags:** at its own mark it names, in each owning checkpoint's messages block, every thread folder the rubric's PMO-9 flags under [Tidying the thread folder](#tidying-the-thread-folder); it never tidies another thread's folder itself.
- **Other territories:** it coordinates with another territory's state-of-play thread only through the owner. It never acts with authority in another territory's repositories; each Capital keeps its own ownership, and cross-repository work moves under `ki-trades` or the receiving repository's own process.

### Opening a thread

The owner opens a thread in the Capital's checkout, names it with the checkpoint's `label` where the runtime can name a session, and pastes one opener. The state-of-play thread prepares the checkpoint first, so every thread opens with one opener and nothing else. An opener is a steering-ready brief, not a transcript: it names the thread and leaves state to the checkpoint. Its role line carries the three rules of [the responsive coordinator](#the-responsive-coordinator) in Kris's words. The checkpoint's `Current state` names the thread's tracked folder as `Thread folder: +/_THREADS/<run>/`, written when the checkpoint is prepared or at bootstrap, so that `ki-recap` and this skill find the decisions log and the reports.

For the state-of-play thread:

```text
Bootstrap as the state-of-play thread for <territory> under ki-pmo.
Role: coordinator only. The thread never does substantive work itself; every unit of work goes to a detached background agent; an owner message never pre-empts work in flight. Dispatch, decide with me, report; stay responsive.
Label: <Space> > SoP. Checkpoint: +/_CHECKPOINTS/_state-of-play.md in <capital>.
Project management only: priorities, the coordination-thread queue (cap three or four), decisions and releases; route real work to coordination threads.
Background agents: run substantive work through `ki agent` in run `<territory>-state-of-play`; stay responsive.
Steering: my messages steer; stop or abort only when I expressly say so, naming the work.
First step: follow the Bootstrap in ki-pmo, then report in three lines.
```

For a coordination thread:

```text
Bootstrap as the <project> coordination thread under ki-pmo.
Role: coordinator only. The thread never does substantive work itself; every unit of work goes to a detached background agent; an owner message never pre-empts work in flight. Dispatch, decide with me, report; stay responsive.
Label: <Space> > <Initiative> > <project in words>. Checkpoint: +/_CHECKPOINTS/<initiative>.<project>.md in <capital>.
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
4. reports under the [report heading](#banner), its form line reading `**Re-bootstrap at <local time> · last mark <local time>**`, in three lines: its coordinator role and where the Project stands, what is running, and what it needs from the owner; then closes with the block-letter [footer banner](#banner), its list and, at rest, the resume line, rendered exactly as a Summary renders them, so a thread that has just re-bootstrapped shows the same report heading and footer as one that never left.

### Directions from the state-of-play thread

The state-of-play thread propagates common instructions. Rules go to their durable owner, a skill or a Decision Record. Thread-level directions go into each affected thread's checkpoint as a **messages block**, the asynchronous channel between threads, which Kris set on 2026-10-14: "send a message effectively to another thread asynchronously by adding something at the top of its checkpoint so the next time that it reaches its checkpoint it will probably see that there's a change there and it can decide what to do with it." The block travels across hosts through Git, so it reaches a thread wherever and whenever it next runs.

- **Place:** directly beneath the checkpoint's [pick-up block](#picking-up-a-thread), before `## Objective`, as one bold line and a list, never an extra H2, so the checkpoint keeps `ki-checkpoint`'s closed heading sequence.
- **Shape:** the bold line `**Messages from Master: state-of-play** - the receiving thread acts on each line, then removes it.`, then one item per message, `- <YYYY-MM-DD> · <TAG> · <the owner's words or the instruction, with links>`, newest first. A message citing an owner decision quotes its words.
- **Sender:** the state-of-play thread, which may write directly into its territory's coordination threads' checkpoints and Project notes to dispatch work, as [Thread types](#thread-types) records. A coordination thread sends to another only through the state-of-play thread.
- **Receiver:** the thread reads the block at every resume, re-bootstrap and recap and before launching work, acts on each line, folding it into its decisions log, work or checkpoint, then removes that line in its next checkpoint update; it removes the block when it is empty. A line it cannot act on yet stays, with the thread's open query naming it.

A checkpoint still carrying a `From the state-of-play thread` or `From the master thread` section moves its current directions into the messages block at its next update. Where the runtime can message another live session on the same machine, the state-of-play thread may also nudge the receiving thread to re-read its checkpoint, under the [surfaces rule](#surfaces). The checkpoint stays the source of truth.

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

A roadmap record opens only for a product or standard change that needs Kris's acceptance. Operational work runs on the decisions log, the brief, the report and Git, and opens no record. Kris set the threshold on 2026-10-14, as received: "RECORD-THRESHOLD / agree: a record only for a product or standard change needing acceptance; operational work runs on the decisions log, brief and report; add it to the ki-pmo standard". So an operational entry's home is the commit or log entry it drove, never a record opened to hold it, and a rule or standalone entry reaches a record only because the standard or product it changes needs accepting. `ki-work-roadmap`'s graduation test governs the shape of a record once one is due; this threshold says whether one is due at all.

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
4. the thread folder is [tidied](#tidying-the-thread-folder), committed and pushed, then deleted, and the run archived by `ki agent close`, whose gate stays strict, with `--reconciled` as the owner's waiver, as Kris settled: "keep the close gate strict with the reconciled waiver".

The Project note then points at the outcome. Reopening a Project is a new opener from the state-of-play thread, not a resume.

## Thread working rules

These rules apply to every coordinating thread: the state-of-play thread and each coordination thread.

### Recap since the mark

A recap is a plain-language roll-up for the owner of what has changed in the thread's scope since its mark. Every coordinating thread gives one. A coordination thread's scope is its Project; the state-of-play thread's scope is only what it itself deals with, the records and decisions it raised or owns, not every Project's records. A recap is distinct from `ki-recap`, which summarises one session at a lower level; the two share no format or procedure.

- **Mark:** a baseline the owner strikes at a moment of their choosing. Each thread has one mark, and striking a new one replaces it; Git holds the history of earlier marks. The thread keeps it in its checkpoint's `Current state` as `Mark: <UTC timestamp>`. The timestamp bounds Git history, work-record transitions, background-agent reports and the decisions log, whose entries carry their own timestamps. Per-repository commit identifiers stay out. The banner, the mark and the resume line describe or date a decision and never cite a number, because a number, in Kris's words of 2026-10-14, "has no meaning to me because I don't know what the decision was ... and I don't know where the list is".
- **Striking:** only the owner moves the mark, by saying "mark", or "recap and mark" to roll up and then re-strike. Giving a recap does not move it, so a recap can always reach back to a moment the owner chose. The thread commits the checkpoint update and confirms in one line, classifies the log entries since the last mark under [Decision classes](#decision-classes), and then [tidies its thread folder](#tidying-the-thread-folder), deleting by explicit path every report whose queries are all answered and whose outcome has a durable home.
- **Shape:** a recap opens with the [report heading](#banner) shared with the Summary and the full summary, its form line reading `**Recap at <local time> · last mark <local time>**`. Beneath it is one [owner report](#owner-report) at the shared [heading levels](#coordinating-thread-practices): `Done` covers what was delivered, decided, started, stopped or blocked, and newly captured since the mark; `In Progress` what is running now; `Queries` every open query in full. It cites records by full identifier as links, with no tool output and no commit identifiers, and never points back to an earlier recap or Summary. It closes with the block-letter [footer banner](#banner), its list and, at rest, the resume line.
- **Outstanding:** the checkpoint's open [Needs-tagged](#needs-tags) queries, open work records in the thread's scope, running or queued background agents, and parked tangents. Outstanding carries forward across marks: it is everything still open, whenever it arose, and striking a mark resets only the window for what was delivered, decided, started, stopped or blocked, and newly captured. Striking or re-striking never drops, closes or hides an open item, and the thread keeps every open query, with its Needs tag, in its checkpoint when it re-strikes.
- **Sources:** the thread's decisions log entries after the mark; background-agent reports finished since the timestamp, read from the thread folder or, once a tidy has deleted them, from Git history; `ki agent status` for running and queued agents; work-record transitions in the thread's scope since the timestamp, from the Git history of the roadmap paths; and the checkpoint's open Needs-tagged queries and parked tangents.
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

The thread folder `+/_THREADS/<run>/` is tracked, and the knowledge in it - the decisions log, the agent reports, the inbox once it moves there - is safe only once it is in Git on a remote. Kris set the rule on 2026-10-14: "threads need to know that they need to commit their work under +/_THREAD/". So a coordinating thread commits and pushes its thread folder at every owner report and at every resting point, by explicit path and never with another session's uncommitted changes, and the banner's list says `- [committed] checkpoint and thread folder, pushed`, or `- [unpushed] thread folder` or `- [uncommitted] thread folder` plainly when it is not. Where pushing is not authorised the item says so and the owner report names the pending handoff. The folder is a working record, not an archive: it holds `decisions.md` and the reports still open, and at every resting point and each mark the thread deletes the answered and homed reports by explicit path under [Tidying the thread folder](#tidying-the-thread-folder), so that Git history, which the commit and push have already secured, holds the rest.

### Tidying the thread folder

At every resting point and at each mark the thread tidies its own thread folder, so that `+/_THREADS/<run>/` shows the owner only what is still open. Kris set the rule on 2026-10-14, as received: "THREAD-TIDY / add a rule to ki-pmo: at each mark the thread deletes every report whose queries are all answered and whose outcome has a durable home, keeping only reports with open queries and decisions.md, with Git history holding the rest; each thread applies it to its own folder at its next mark, starting with this one once the commit gate passes".

The folder's contents are a closed list, `decisions.md` and `<name>.report.md` only, under the background-run standard's [Run packet](../../../governance/ki-delegation/references/standards-background-runs.md#run-packet). Kris asked on 2026-10-15 for the tidy to keep threads trimmed: "Improve the ways-of-working via whichever skill to ensure that the threads are regularly trimmed back as needed."

- **What goes:** every `<name>.report.md` whose queries are all answered and whose outcome has a durable home. A durable home is a work record, the decisions log, the checkpoint or a commit: the report's Done is in the commits it names or a record's evidence, its decisions are logged and classified under [Decision classes](#decision-classes), and its open points, if any, have moved into the checkpoint. A query is answered when the owner has replied to its Needs tag and the reply is in the log.
- **What stays:** `decisions.md`, always, because it is the Project's [one list](#one-list); and every report that still carries an open query, until its queries are answered and its outcome is homed.
- **What does not belong:** any other file. At each mark the thread moves a brief to the state folder, homes a work product in its owning repository by a commit there or removes it when it is superseded, and deletes temporary output, which belongs under `tmp/<run>/<name>/` in the repository its agent worked in; it also deletes, by explicit path, each `tmp/<run>/` folder of its own whose output is superfluous. Each owning thread clears its own folder this way at its next mark, as Kris set on 2026-10-15: "Each owning thread clears its own folder at its next mark, moving scratch to tmp/, homing or removing tracked work products and moving briefs to the state folder, told through its inbox by this thread."
- **How:** the thread deletes the reports in one commit by explicit path, `git rm` of each report it names and nothing else, never a folder-wide delete, so that Git history holds every report and a later [recap](#recap-since-the-mark) or [full summary](#full-summary) reads a deleted one from its last revision. The deletion is operational work under the [record threshold](#decision-classes) and opens no record.
- **Who:** each thread tidies only its own folder. The state-of-play thread never tidies a coordination thread's folder, a background agent never deletes a report, and a report whose outcome has no durable home yet is kept, not homed in haste.
- **When:** at every resting point, in the same commit that secures the thread folder, so that the folder never waits for a mark the owner may not strike for days; at each mark, after the thread has classified the log entries since the last mark; and once more at [Project close](#project-close) as part of the close-out tidy. Kris chose the resting-point trigger, with a rubric item that flags untidy folders and a state-of-play flag at its own mark, as option a) of the THREADS-TRIM query, on 2026-10-16 in these words: "Take the recommended option a) for OTHER-PUSH, REPIN, GATE-PRINCIPAL, PMO-CI, CI-FINDINGS, MSG-LANDED, MSG-ORPHANS, THREADS-TRIM and TMP-CLOSE, including pushing other sessions' commits that sit beneath this thread's in ki-agentic-harness and ki-principal." A thread applies the rule to its own folder at its next mark after this rule reached it, and the thread that set it applies it first once its commit gate passes. A thread whose folder holds anything outside the closed list at a resting point or a mark trims it in the same commit as the report deletions.
- **Flagging:** the rubric's PMO-9 lists every thread folder holding a file outside the closed list, and every report whose Needs tags the decisions log all names, as candidates for the tidy; whether each candidate's outcome has a durable home stays the owning thread's judgement, and the listing is never permission to delete. At its own mark the state-of-play thread names each flagged folder in the messages block of that folder's checkpoint, and the owning thread tidies it at its next resting point.

### Draining a thread

A drain brings a thread to a full stop, a **hold**, so that it can be archived and picked up later from the repository alone. Kris named the parts on 2026-10-15: "I am guessing a Mark is a point in time and a Hold / Drain is a Mark + stopping all work", and then renamed the state, in these words: "we should be able to issue a drain across a territory, and a drain could be used not only because it is moving somewhere else, but ... when I bring it to a close for a period of time ... hold is a better word than drain. And what happens when you go on a hold is that you drain any work that is ongoing by not restarting any." The state-of-play checkpoint records the verbs he set the same day: "drain and resume are the activities and hold is the state: a thread drains to reach a hold and resumes to leave it." So hold is a thread state beside at rest, busy and done; drain is the activity that reaches it and resume the activity that leaves it. A hold serves a move between hosts or closes a thread for a period, and never says which host the work comes back up on. A thread drains only when the owner asks, or when the owner puts the territory on hold, and every thread that drains takes this form. Only a coordinating thread drains; a conversational thread with a checkpoint pauses through a `ki-checkpoint` UPDATE of `Current state` and `Next step`. Kris set the procedure on 2026-10-15, when it was still called the drain, in these words:

> 1. Check you are wrapped up. Nothing is running or queued: let any agent that will finish within about 15 minutes finish; otherwise stop it at a safe point and record where it stopped and how to restart it. Do what you still can to finish small open items yourself, through a run if needed. Do not start new work.
> 2. Commit and push. In every repository you or your agents touched, commit your own work by explicit path under its gate, pull with rebase, and push fast-forward only. Never use --no-verify or force-push. Name any other session's commit or uncommitted file; don't touch it.
> 3. Park everything in the checkpoint. Strike a mark. Move every open query (tag, one-line context, recommended option), held item, parked item, waiting-on item and the next step into the checkpoint, set running to nothing and state to drained, and copy into the thread folder anything from ~/.local/state/ki/agents/<run>/ needed to resume. Remove re-copied retired reports by explicit path. Commit and push the checkpoint and thread folder.
> 4. Do not make a baseline or empty commit; Kris does that afterwards.
> 5. Give a short drain report, and nothing else:
>    - the usual report heading, with the form line "**Drain report at <local time> · mark <local time>**";
>    - ## Done: one line per repository, "pushed" or what is left and why;
>    - ## Parked: the tags of the queries parked in the checkpoint, one line each, with no options and no reply block;
>    - ## Left over: anything that needs Kris or belongs to another session, or "Nothing";
>    - then the DRAINED frame exactly as drawn, with the UTC time in its top border, then the list, then the resume line.
>
> If you cannot drain (unpushable work or a run that must not be stopped), use the BUSY frame instead and say in one line what is blocking.

Applied, with the drain report now the hold report and `state to drained` now the pick-up block's status `hold`:

- **Wrapping up:** an agent stopped at a safe point has where it stopped and how to restart it recorded in the checkpoint beside the next step, and no new work starts once the drain begins.
- **Committing:** each repository's own gate runs as usual under `ki-git`, and pushing follows [Pushing beneath other sessions](#pushing-beneath-other-sessions). Another session's commit or uncommitted file is named in `## Left over` and left alone.
- **Parking:** the mark is struck under [Recap since the mark](#recap-since-the-mark). The thread rewrites its [pick-up block](#picking-up-a-thread) with status `hold`, the hold resume line for its type and its next steps when back in use, writes `Running: nothing` in `Current state` beside `Mark:`, and moves every open query below the pick-up block with its Needs tag, one line of context and its recommended option, so that the thread answers from the checkpoint alone when it resumes. The frontmatter `state` stays `active`, because `ki-checkpoint` RESUME validates it and the thread resumes from the record. The copy from the run's state folder takes only what resuming needs, and a retired report that comes back with it is removed again by explicit path under [Tidying the thread folder](#tidying-the-thread-folder).
- **No baseline:** the thread makes no baseline or empty commit; the owner makes it after the drain.
- **Report:** the hold report is the thread's last message before the hold. It opens with the [report heading](#banner), its form line reading `**Hold report at <local time> · mark <local time>**`, then `## Done`, `## Parked` and `## Left over`, and nothing else: no `## In Progress`, no `## Queries`, no **Context**, **Query** or **Options** and no reply block, because "the queries live in the checkpoint". It closes with the HOLD frame drawn under [Banner](#banner), the UTC issued time in its top border, then its list, then "To bring this thread back and continue the work, paste this:" and the resume line its pick-up block carries, the only resume line it gives.
- **Cannot drain:** a thread with unpushable work or a run that must not be stopped closes the same report with the BUSY frame and its list, and says in one line what is blocking; it gives no hold resume line until it has drained.
- **Territory hold:** the owner issues it through the state-of-play thread, as Kris did on 2026-10-15: "you're the only thread that's left running in the Knowledge Islands area. So now you're going to do the orderly drain down to the hold position for the state of play, which effectively puts the entire territory into a state of hold." Every coordination thread drains first and the state-of-play thread drains last. Its pick-up block's next steps name the threads that restart when the hold lifts and those that stay held, because, in Kris's words, "in your drain and reinstatement you just say which threads you think, because you are a state-of-play thread ... which are the ones that you think should be restarted."
- **Resuming:** the resume line, pasted into the thread on whichever host, re-bootstraps it under [Bootstrap](#bootstrap) from its checkpoint and does what the [pick-up table](#picking-up-a-thread) sets for its banner and type; the thread rewrites its pick-up block and clears `Running: nothing` at its first checkpoint update. A held coordination thread resumes only when the state-of-play pick-up block names it for restart, or the owner does.

### Picking up a thread

The checkpoint alone says how a thread is picked up. Kris set it on 2026-10-15, in these words: "based on any of the banner types, it should also update the initial or the start point in the checkpoint. So the first thing in a checkpoint should be about how a checkpoint is picked up from. ... if a hold is put into place, its status becomes hold as well, and it says what is necessary to then effectively start up again. And for something like a coordination thread, it is obviously the continuation of the work that it was doing, questions it needs to ask. It does not have to state the questions there ... but it should be clear about what its next steps are when it becomes back into use. If something has got a mark, it can be updated with the mark heading". The state-of-play checkpoint records how the pieces combine: "the pick-up state is the combination of the banner type and the thread type (conversational, coordination, or state-of-play as the coordination of coordinations), each with its own instructions". The restart-model design note in Knowledge Islands Principal's ways-of-working Project worked the combinations out, and this section adopts it.

- **Pick-up block:** the first thing under the checkpoint's H1, with the [messages block](#directions-from-the-state-of-play-thread) directly beneath it and `## Objective` after both. Its heading is one bold line, not an H2, so that the checkpoint keeps `ki-checkpoint`'s closed heading sequence, as Kris set on 2026-10-15: "Keep the bold-line pick-up heading, so every checkpoint passes ki-checkpoint unchanged." Open and parked queries stay below it, not in it.
- **Every banner writes it:** a REST, BUSY, HOLD or DONE banner rewrites the status, resume line and next steps to agree with the banner, and a [mark](#recap-since-the-mark) also rewrites the mark in its heading. DONE writes it as the last change before `ki-checkpoint` REMOVE, so Git history holds the final state.
- **No host:** neither the pick-up block nor any resume line names a host. Where a territory is seated is host data, not thread state.
- **Status lives in the block:** the checkpoint frontmatter keeps `state: active`, because `ki-checkpoint` RESUME validates it, and the block's status line replaces the `State:` line in `Current state`.

```markdown
**Pick-up - mark <YYYY-MM-DDTHH:MM:SSZ> (<local time>)**

- **Status:** rest | busy | hold | done, with one line on why.
- **Resume:** `<resume line from the table>`
- **Next steps, in order:** what the thread does when back in use.
```

| Banner | Thread type | Status | Resume line in the pick-up block | First on resume |
| --- | --- | --- | --- | --- |
| REST | Coordination | `rest` | `Resume <label> under current ki-pmo and ki-delegation since <mark>: re-bootstrap, mark, fresh summary with carried-forward open points, take stock, restart authorised work, then banner.` | Re-bootstrap, act on the messages block, mark, Summary with the open queries carried forward |
| REST | State-of-play | `rest` | As coordination, label `<Space> > SoP` | As coordination, then check each coordination thread's pick-up block |
| BUSY | Coordination or state-of-play | `busy` | `Resume <label> from its checkpoint under current ki-pmo and ki-delegation since <mark>: re-bootstrap, reconcile running agents with ki agent status, take stock, restart only what stopped, then banner.` | Recovery, not a planned restart: reconcile each `[running]` and `[queued]` agent against `ki agent status`; one not found counts as stopped and restarts from its brief |
| HOLD | Coordination | `hold` | `Resume <label> from its checkpoint under current ki-pmo and ki-delegation since <mark>: re-bootstrap, read the pick-up block, take stock, put the parked queries back, restart authorised work, then banner.` | Only when the state-of-play pick-up block names it for restart, or the owner does: continue from its next steps, raise the parked queries as open queries |
| HOLD | State-of-play | `hold` | `Resume <Space> > SoP from its checkpoint under current ki-pmo and ki-delegation since <mark>: re-bootstrap, read the pick-up block, fold or discard held branches, take stock, reinstate the threads it names, put the parked queries back, then banner.` | Resumes first; hands its resume line to each thread its next steps name for restart, and every other thread stays held |
| DONE | Coordination | `done` | None | Nothing resumes. Reopening is a new opener from the state-of-play thread |
| DONE | State-of-play | `done` | None | Territory closed. Nothing resumes |

The BUSY resume line lives only in the pick-up block: a report whose footer reads BUSY still carries no resume line, because the resume line is "shown only at rest". These combinations cannot occur:

- **Any banner or pick-up block on a conversational thread.** Its checkpoint, if it has one, is the plain `ki-checkpoint` record under [Coordinator-only machinery](#coordinator-only-machinery).
- **DONE on the state-of-play thread** except at territory close.
- **DRAINED as its own state.** DRAINED was the interim name for HOLD: a DRAINED frame or a `State: drained` line is picked up as HOLD of the same thread type.

### Pushing beneath other sessions

Several sessions commit into one checkout, so a session's commits can sit on top of another's that are not yet pushed. Kris set the rule on 2026-10-14, in these words: "The most important thing is that each agent session commits its own work. And if there's a need or it has little confidence in the other commits that are stacked up with it, that's flagged to me, and I will then push if I'm happy with the push. If it's only their commits, then them committing and pushing is absolutely fine though."

- **Commit:** every session, a coordinating thread or a background agent, commits its own work by explicit path, under the `ki-delegation` [coordination](../../../governance/ki-delegation/references/standards-background-runs.md#coordination) rules.
- **Push:** before pushing it fetches and reads what lies between the remote branch and its own commits. When only its own commits are stacked there, it pushes fast-forward under its authority. When another session's commits are stacked with its own, it does not push them on its own account: it names each one, by repository, commit and subject, to the owner, who decides the push.
- **Report:** the thread shows the wait as `- [unpushed] <what>` in its footer list and, where the owner must decide, as a query; a background agent names the stacked commits in its report's `## In Progress`.

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

The native rubric is thin and complementary to `ki-checkpoint`'s. It checks only what the repository shows: a Capital holds the `_state-of-play.md` checkpoint and no other repository does; each coordination checkpoint's label ends in the Project name its filename carries, and that Project and its Initiative resolve in the Capital's registry; the active coordination threads are within the cap; and every full record identifier in a thread report under `+/_THREADS/` is a link to an existing file, as [Linking records](#linking-records) describes. It cannot judge whether a coordinator kept its turn budget, whether a report took the owner-report shape under its report heading and closed with the banner frame and, at rest, the resume line, whether a recap covered the window since the mark, whether decisions were classified and promoted, or whether the thread refreshed this guidance; the PMO judgment items review those from transcripts, reports and checkpoints the owner selects.
