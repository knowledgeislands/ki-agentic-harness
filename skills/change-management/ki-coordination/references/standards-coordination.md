# Coordinating-work standard

## Contents

- [Scope](#scope)
  - [The work model](#the-work-model)
  - [The responsive coordinator](#the-responsive-coordinator)
  - [Glossary](#glossary)
  - [Levels and forms](#levels-and-forms)
  - [Work naming](#work-naming)
- [Coordinator responsiveness](#coordinator-responsiveness)
  - [Thread capabilities](#thread-capabilities)
- [Coordinating practices](#coordinating-practices)
  - [Interactive pass](#interactive-pass)
  - [Goal-setting pass](#goal-setting-pass)
- [States and moves](#states-and-moves)
  - [Banner](#banner)
  - [Re-anchoring after compaction](#re-anchoring-after-compaction)
  - [Surfaces](#surfaces)
  - [Recovering a session showing a red x](#recovering-a-session-showing-a-red-x)
- [Reply forms](#reply-forms)
  - [Session kinds](#session-kinds)
  - [Units of work](#units-of-work)
  - [Conversational bounded work](#conversational-bounded-work)
  - [Coordinator-only machinery](#coordinator-only-machinery)
- [Owner report](#owner-report)
  - [Answers](#answers)
  - [Quiet tools](#quiet-tools)
  - [Needs tags](#needs-tags)
  - [Query review](#query-review)
  - [Generated surfaces](#generated-surfaces)
- [Report forms](#report-forms)
  - [Templates](#templates)
  - [The Summary](#the-summary)
- [Coordinating work](#coordinating-work)
  - [Territory work](#territory-work)
  - [Coordinating assigned packages](#coordinating-assigned-packages)
  - [Opening work](#opening-work)
  - [Bootstrap](#bootstrap)
  - [Messages between work](#messages-between-work)
- [Decisions and design](#decisions-and-design)
  - [Decisions log](#decisions-log)
  - [Decision classes](#decision-classes)
  - [Decisions life cycle](#decisions-life-cycle)
  - [Design notes](#design-notes)
  - [Finishing Project work](#finishing-project-work)
- [Working rules](#working-rules)
  - [The mark](#the-mark)
  - [Parking tangents](#parking-tangents)
  - [Linking records](#linking-records)
  - [Committing the work folder](#committing-the-work-folder)
  - [Pruning the work folder](#pruning-the-work-folder)
  - [Closing out Orca workers](#closing-out-orca-workers)
  - [Putting work on hold](#putting-work-on-hold)
  - [Unattended windows](#unattended-windows)
  - [Headless passes](#headless-passes)
  - [Picking work up](#picking-work-up)
  - [Work awaiting review](#work-awaiting-review)
  - [Acceptance bundles](#acceptance-bundles)
  - [Worktree sweep](#worktree-sweep)
  - [Pushing beneath other sessions](#pushing-beneath-other-sessions)
  - [Repository level check](#repository-level-check)
  - [Keeping primary checkouts current](#keeping-primary-checkouts-current)
  - [Refreshing this guidance](#refreshing-this-guidance)
- [Mechanical boundary](#mechanical-boundary)

## Scope

Coordinating work - territory work and Project work - is how the worker to the owner holds Knowledge Islands work that has runs of its own: the session working it dispatches work, decides with the owner and reports. This standard owns how a session behaves while it coordinates work, how it reports and how it keeps itself current. It is the coordinator half of the practice that the `ki-delegation` [background-run standard](../../../governance/ki-delegation/references/standards-background-runs.md) governs on the run side: detachment, the run packet, prompt shape, authority tiers, the launcher's part in the decisions log, coordination, the run queue, monitoring, while this standard owns the [owner report](#owner-report) with its [Needs tags](#needs-tags), which every report a background agent or a coordinator gives takes, and the [generated surfaces](#generated-surfaces) that carry it. The work's definition is its work file, `+/_WORK/<id>/work.md`, and its state is its state file, `state.md`, beside `discussions.md`, `queries.md` for the DISCUSSIONS tolerance window, `messages.md` and `decisions.md` in the work package; the work folder that holds them - its closed list, entry points, tidy rules, review area and message line shape - is the `ki-work-package` [work-package standard](../../../governance/ki-work-package/references/standards-work-package.md)'s; this standard says when the folder is tidied, whether an outcome has a durable home, and how a decision is logged and what becomes of it.

A repository that runs coordinating work declares `[skills.ki-coordination]` in `.ki.toml`. This declaration enables the hook and output-style binding as checkout capabilities; it does not establish that an interactive session is coordinating.

### The work model

The model of work is decided by [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) and described once, canonically, by the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) note in Knowledge Islands Principal: the unit is work; its levels and forms; worker, supervisor and the derived holder; send and receive; the seven states with On hold's two reasons; the receive words; the heartbeat and stuck; the work folder and work file; Git as the logbook; the decisions life cycle; the banner and its answers; and the observatory fields. This standard cites the note and restates none of it. It sets what the note leaves to the harness: how a coordinating session keeps to the model, the shape of every report, the generated surfaces, and the checks.

The model replaced the thread model of 13 to 17 October. Kris agreed it on 18 October and launched its migration the same day; the harness half is [KI-HARNESS-GOV-210 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/08468196/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md). The old words map to the new:

| Thread model | Work model |
| --- | --- |
| state-of-play thread, `_state-of-play.md`, id `<territory>.sop` | territory work, `+/_WORK/<territory>/work.md`, id `<territory>` |
| coordination thread, `<initiative>.<project>.md`, id `<territory>.<initiative>.<project>` | Project work, `+/_WORK/<territory>.<project>/work.md`, id `<territory>.<project>` |
| conversational thread with a checkpoint | ad hoc work, `+/_WORK/<territory>.regular.<slug>/`, under regular work |
| recurring work homed in an Initiative | regular work, `<territory>.regular`, self-coordinating |
| Initiative, `Streams/Initiatives/`, `initiative:` | theme, `Streams/Themes/<theme>.md`, an optional `theme:` |
| thread folder `+/_THREADS/<run>/` | the work folder `+/_WORK/<id>/` |
| checkpoint, pick-up block, moves | the work package: `work.md` for the definition, `state.md` for the state; Git as the logbook |
| REST, BUSY, HOLD and DONE frames; resume line | the glyph banner and its closing thread line |
| the copyable stacked reply block | none; the owner answers in speech |
| hold | On hold, paused or snoozing |
| `+/_DESIGN/<subject>/`, `Streams/**/design/` | `+/_WORK/<id>/design/` |

**The tolerance window.** Until every territory has moved, which phase 5 of the migration closes, the checkers and every reader accept both shapes: a `+/_CHECKPOINTS/` checkpoint, a `+/_THREADS/<run>/` folder, `Streams/Initiatives/` and an `initiative:` key are read as before, each with a warning that names its new home, and the new shape passes without one. The `Streams/Initiatives/` and `initiative:` warnings become failures on 7 November 2026, or earlier once a scan finds no residue, as Kris chose THEME-CLOSE's dated cutover on 25 October 2026; the checker messages name the date. A session working old-shape work keeps to this standard through the mapping above; it moves its own files only when its territory's migration moves them. A report written before 18 October keeps its block-letter frame and reply block, and anything that reads past reports accepts both.

### The responsive coordinator

Every rule in this standard serves one principle, which Kris set for coordinators on 2026-10-13 in these words:

> It's imperative that you do not do the work directly and that you delegate that work to subagents so that you remain responsive. And if I send you a message, it doesn't preempt any work that you are already doing. This is a fundamental requirement of the delegation capability.

Three rules follow from it, and they are hard:

1. **The coordinator never does substantive work itself.** A coordinating session dispatches, decides with the owner and reports. Nothing else.
2. **Every unit of work goes to a detached background agent.** Through `ki agent`, in its own session, surviving anything that happens to the coordinator. An in-session subagent is not a background agent.
3. **An owner message never pre-empts work in flight.** It steers: the coordinator folds it into running and queued work and answers within one short turn. A background agent stops only when the owner names it and says stop.

A one-line mechanical fix in the coordinator's own work package is bookkeeping, not substantive work, and the first rule allows it under [Coordinator responsiveness](#coordinator-responsiveness): a stale status line, or a link repointed to a pinned revision, committed by explicit path. Kris asked for SMALL-FIXES to be weighed against the first rule on 2026-10-20, "Please weigh this against the standard's rule that the coordinator never does substantive work itself. If it holds up, change the ki-coordination standard through REFRESH", and it held up. Anything that needs judgement, and any file of another piece of work, still goes to a run.

Three layers support these rules: the opener carries the explicit coordinator role; the runtime hook conditionally points to this standard without detecting that role; and the counted turn budget and self-check bound each coordinator turn. The harness `ki-coordinator` output style retains the full rules and owner-report contract; a declaring repository selects it with `outputStyle` in tracked `.claude/settings.json`. The coordinator re-bootstraps on request, after compaction and after a model switch.

### Glossary

The Work Process note's Words table owns the words of the model: work, work item, theme, work file, logbook, decisions, worker, supervisor, holder, handoff, send, receive, On hold, paused, more expected, which this standard calls snoozing, release, drain, Finished, the five views, the receive words, the working area and the mark. These words carry the practice around it, each with one owner:

| Term | Meaning | Owner |
| --- | --- | --- |
| coordinating session | A session working territory work or Project work as its worker, under this standard; the hook, the output style and past records call it a coordinating thread | `ki-coordination` |
| session | A runtime instance acting on work, seated in one package and able to act in others it stewards | runtime, `ki-recap` |
| thread | A session acting on work; its opener and label identify it, with no committed thread metadata | `ki-coordination` |
| chat | Not a Knowledge Islands term. The vendor's word for a session's transcript in Claude Desktop, ChatGPT and the like, used only when naming a vendor artefact that is imported or cleaned up | `ki-housekeeping-claude` and its siblings |
| run | A named set of agents sharing one state folder for runtime files; its reports and briefs live in the work folder of the work it serves | `ki-delegation` |
| agent | A process `ki agent` launches detached under the background-run contract; an in-session subagent is not one | `ki-delegation` |
| thread line | The closing line of every glyph banner, `<role glyph> 🔑 <work-id>`, or `🧵 <work-id>` for a session with no role yet, under [Banner](#banner); its grammar and the role glyphs are the [role standard](../../../governance/ki-work-package/references/standards-roles.md#thread-line)'s | `ki-work-package` |
| binding | The machine-local runtime file that ties native client sessions to one piece of work, keyed `<repository name>/<work id>`, never committed and never moved between hosts, under the work-package standard's [Work identity and native sessions](../../../governance/ki-work-package/references/standards-work-package.md#work-identity-and-native-sessions) | `ki-work-package` |

### Levels and forms

The note's Levels and forms of work table sets the three levels, the two forms and the cascade rule. Under this standard:

| | Territory work | Project work | Regular work and ad hoc work |
| --- | --- | --- | --- |
| Id | `<territory>.sop.main`, such as `ki.sop.main`; a secondary `<territory>.sop.<name>`, such as `hnr.sop.5ge` | `<territory>.prj.<project>`, such as `ki.prj.ways-of-working` | `<territory>.reg.main`; ad hoc `<territory>.reg.<slug>` |
| Work file | `+/_WORK/<territory>.sop.main/work.md` in the Capital, and `+/_WORK/<territory>.sop.<name>/work.md` for each secondary | `+/_WORK/<territory>.prj.<project>/work.md` in the Capital | `+/_WORK/<territory>.reg.main/work.md`, and one folder per ad hoc piece |
| Coordinates | Assigned packages: priorities, the queue and cross-cutting decisions; a secondary, only its `covers` subset; executes nothing | One Project's work items and runs when explicitly opened | Its own work, conversationally or through explicitly opened coordination |
| Governed by | This standard | This standard while coordinating | Activity notes, `ki-work-recurring` and declared skills; this standard while coordinating |
| Report forms | The coordinator forms, the report heading reading `› State of play` | The coordinator forms while coordinating, under the Project's heading | The coordinator forms while coordinating, under the real work label/page; otherwise the conversational reply forms |

Coordination is an explicitly selected session role on any valid work package, independent of its level, id, home or continuing lifetime. State of play specialises that role across assigned packages. Regular and ad hoc work retain their identity and may remain conversational; neither a package nor a capability declaration opens a coordinator or requires a permanent one. An owner-approved opener names the exact package, its actual repository, scope and opening authority; a bounded episode also names its end condition. Ending that episode does not finish or hold the package, move its mark or abandon runs. A session working one bounded matter directly follows [Conversational bounded work](#conversational-bounded-work).

The work file declares its level in its `level` field under the work-package standard: `territory`, `regular` or `project`, ad hoc work taking `regular`. The level follows from the id: one segment is territory work, the main State of play; a second segment `sop` is territory work, with `main` or a named [secondary State of play](#secondary-states-of-play); a second segment `reg` (or legacy `regular`) is regular or ad hoc work; and any other second segment is Project work. A checkpoint in the old shape declares its type in `role` until it moves: `state-of-play` for territory work, `coordination` for Project work, and `conversational` or no field otherwise.

Kris set territory work's role on 2026-10-14 as "the coordination thread of coordination threads", in these words: "As the state of play thread, I think you are very much in a position where you can write directly into the projects and the checkpoints of the other coordination threads. And you're responsible for fundamentally dispatching that work around. So rather than building up more and more of your own context, the key thing is to understand mostly where that work goes first and foremost and get it dispatched out of this thread and then if I ask a similar question or an extension to something or even repeat myself you're the one who can understand all of this and then deal with that." So territory work sends direction down into Project work through the [message queue](#messages-between-work), the `messages.md` of each receiving work package, and its first concern with any new matter is where the work goes, not holding it in its own context.

### Work naming

Kris set the naming model on 2026-10-17, "I'd like to think of threads as having an id, slug, and title ... Variations of that are then used for the title or label etc", and the work model gave it two-part ids with no theme segment. Every piece of work above a work item has an **id**, a **slug** and a **title**; the id is authoritative and the other two derive from it. This section is the one place they are defined; `ki-work-package` and `ki-delegation` point here.

| Work | Id | Slug | Title |
| --- | --- | --- | --- |
| Territory work | `<territory>.sop.main` | `<territory>-sop-main` | `<Territory> > SoP` |
| Secondary State of play | `<territory>.sop.<name>` | `<territory>-sop-<name>` | `<Territory> > SoP (<name>)` |
| Project work | `<territory>.prj.<project>` | `<territory>-prj-<project>` | `<Territory> > <Theme title> > <Project title>`, or `<Territory> > <Project title>` with no theme |
| Regular work | `<territory>.reg.main` | `<territory>-reg-main` | `<Territory> > Regular work` |
| Ad hoc work | `<territory>.reg.<slug>` | `<territory>-reg-<slug>` | `<Territory> > <topic>` |
| Sub-package | `<parent id>.<parent focus id>` | `<parent slug>-<parent focus id>` | `<parent title> > <focus in words>` |

Canonical stored names are `<territory>.sop.main`, `<territory>.prj.<project>`, `<territory>.reg.main` and `<territory>.reg.<topic>`; secondary States of play retain `<territory>.sop.<name>`. Legacy `<territory>`, `<territory>.<project>`, `<territory>.regular`, `<territory>.regular.main` and `<territory>.regular.<topic>` remain readable indefinitely, including existing HNR inputs. The Project slug remains `<project>`. This naming transition changes no work level, state, mark, immutable native/run identity or history. Derive old/new resolution from actual valid definitions; two physical definitions for one work are ambiguous, never two independently opened packages.

A member-repository Project thread is a session seat for its Capital package, not authority to relocate that package. Deliberate member-homed regular exceptions remain valid. A package's existence never selects coordination.

**Id.**

- **Segments:** joined by `.`, each a lower-case kebab name, `[a-z0-9]+(-[a-z0-9]+)*`, so a segment never holds a dot, an underscore, a host or a runtime session identifier.
- **Territory:** the alias of the territory whose Capital holds the work file, as the estate's territory list in the principal Knowledge Base gives it: `ki`, `hnr`, `er`, `tmx`, `va`, `lgl`, `personal` or `si`. `personal` is the reserved handle for the owner's own territory under the `ki-repo` [territory selection](../../../keystone/ki-repo/references/standards-configuration.md#territory-selection) standard.
- **Project:** the `slug` of the Project note under the `ki-work` [Project registry standard](../../ki-work/references/standards-project-registry.md), such as `tools-burndown`. No id carries a theme, so relabelling a Project's theme never renames anything.
- **Secondary name:** the third segment of a [secondary State of play](#secondary-states-of-play), a short kebab name for what it covers, such as `5ge` or `sites`, chosen by the owner. `sop` is reserved as a second segment for States of play, so no Project or ad hoc slug is `sop`.
- **Ad hoc slug:** chosen when the work first takes a folder, by the owner or proposed by the agent and confirmed: a short kebab name for the subject, led by the system it works on where the subject alone would be ambiguous, as in `acquire-intake` rather than `intake`. It is never `regular`, never a Project slug of the territory, and never carries a date or host.
- **Sub-package:** a grounded doer's own short-lived package for one of a regular, ad hoc or Project package's focus areas, its id the parent's canonical id with the focus id as a fourth segment, as in `personal.reg.inbox-terra.kiv`. It is the only four-part id; a sub-package has no sub-package of its own, and the folder, slug and title rules above apply unchanged. Kris set it about 00:00 GMT on 2 November 2026, relayed as SUB-PACKAGE and piloted by the four Personal pillars, so that each package has one worker and one inbox; the package side, its parent, writers and fold-back, is the work-package standard's [Sub-packages](../../../governance/ki-work-package/references/standards-work-package.md#sub-packages).
- **Unique and stable:** no two pieces of work in a territory share an id or a slug. The id is set once, when the work folder is created, and changes only through a rename the owner approves, when a Project's slug is renamed; then every derived name changes in the same commit.

**Slug.** The id with each `.` written as `-`: one path component in the run-name alphabet `ki agent` accepts, `[A-Za-z0-9_-]`, which has no dot. It names the work's state folder, `~/.local/state/ki/agents/<slug>/`, its native-session binding, `~/.local/state/ki/threads/<repository>/<slug>.json`, and its coordinator run. The work folder itself is named by the dotted id, as the note sets. Existing runtime folder names and immutable run tokens stay unchanged through a package rename; only mutable current home pointers follow the actual package. Runs keep their own hyphenated slugs. The slug is never parsed back into an id; the id is read from the work file.

**Title and label.** The title is the human name, built from display names and joined by ` > `, and it keeps the theme as display text while the id carries none, as Kris took under TITLE-THEME on 18 October, "the title theme, I go with your recommendation":

- **Territory:** the territory's name where it is one word, `Personal`, `Legal` or `Techmedix`, and otherwise its alias in capitals, `KI`, `HNR`, `ER`, `VA` or `SI`.
- **Theme and Project:** the `title` fields of the theme page and the Project note as they stand, such as `Model` and `Ways of working`; a title follows a registry change at the work file's next update, while the id does not.
- **Territory work:** `SoP` in the title, and `State of play` in full in the report heading. A secondary adds its name in brackets, `HNR > SoP (5ge)` in the title and `State of play (5ge)` in the heading.
- **Topic:** ad hoc work's slug in words, in sentence case, unless the owner names it otherwise.
- **Label:** the title, plus a `(<host>)` suffix, after a space, only when the work is limited to that machine, in Kris's words "the machine is only added if its limited to that machine". The id, slug and title never carry a host.
- **Work name:** the label followed by the id in brackets, `<label> (<id>)`, as in `KI > Model > Ways of working (ki.prj.ways-of-working)` and `KI > SoP (ki.sop.main)`. Kris adopted it under WORK-LABEL on 25 October 2026, seeing `Personal > Tower (personal.regular.tower)`: "I like this label, the way that you put the work package in brackets after it at the end. Can we adopt that as a standard?"

The work name is how a session names a piece of work wherever it names one: in replies and reports, as the sender of a [message line](#messages-between-work), in a handoff and in the opener's `Label:` line. A native session takes its seat's [thread line](../../../governance/ki-work-package/references/standards-roles.md#thread-line) instead, `<role glyph> 🔑 <work-id>`, the glyph of its one role from the [role catalogue](../../../governance/ki-work-package/references/standards-roles.md#role-catalogue) standing ahead of the work id and 🔑 marking the keyholder, the session holding the package's keys, or `🧵 <work-id>` while the session has no role yet, as Kris set under STAGE-C-ROLES on 7 November 2026: "the same form in session names, the `Rename thread:` line, the re-bootstrap report and message-line senders". So the launch name, the `Rename thread:` line, every report's [thread line](#banner) and the sender of every [message line](#messages-between-work) the seat writes agree, as Kris first set for `🧵 <work-id>` under RENAME-NAME a) on 1 November 2026; a message line's sender is the label with the thread line in brackets, as in `KI > Guilds (⚖️ 🔑 ki.reg.guilds):`. The work id stays last, so the name still names the work; the label stays in the opener and the [report heading](#banner). The label alone, without the id, stays readable as the same work on message lines and openers written before 25 October 2026, through the tolerance window. The [report heading](#banner) uses the same display names, linked to their notes and joined by ` › `, without the territory.

| Work | Id | Title | Old shape |
| --- | --- | --- | --- |
| Knowledge Islands territory work | `ki.sop.main` | `KI > SoP` | `_state-of-play.md`, `ki.sop`, `ki` |
| A Humans not Robots secondary State of play | `hnr.sop.5ge` | `HNR > SoP (5ge)` | none |
| Ways of working | `ki.prj.ways-of-working` | `KI > Model > Ways of working` | `knowledge-islands-model.ways-of-working.md`, `ki.ways-of-working` |
| Tools burndown | `ki.prj.tools-burndown` | `KI > Foundations > Tools burndown` | `platform-foundations.tools-burndown.md`, `ki.tools-burndown` |
| Knowledge Islands regular work | `ki.reg.main` | `KI > Regular work` | recurring work in Initiative notes, `ki.regular` |
| Registry removal | `ki.reg.registry-removal` | `KI > Registry removal` | a conversational thread, `ki.regular.registry-removal` |

An old-shape checkpoint's id is read from its stem until it moves: `_state-of-play` gives `<territory>`, `<initiative>.<project>` gives `<territory>.prj.<project>`, and any other stem gives `<territory>.regular.<stem>`.

## Coordinator responsiveness

A coordinating session is a coordinator. It dispatches work, decides with the owner and reports; it hands substantive reasoning, analysis and drafting to background agents rather than doing them in-session. Because the reasoning happens in those agents, a coordinator runs on the lighter model purpose `ki-tokenomics` recommends for coordination, and heavier models are reserved for the background agents.

The coordinator stays responsive to the owner, so the owner never has to remind it to delegate. These rules are hard and checkable from its transcript:

- **Turn budget:** a coordinator turn makes at most five tool calls and returns to the owner. Its reads are limited to the work package, `ki agent status`, one report and one short file; its writes are limited to the work package, the decisions log and a brief. The four [pick-up files](#picking-work-up) count as one read. A State of play acts in one assigned package per turn, using that package as its one package read; it rolls up other packages from `ki work status`, without multiplying the turn budget. Anything beyond is a launch. A step goes to a background agent if it reads more than one or two short files, writes or edits more than a line of the work package or a decision, runs tests, audits or builds, or would take more than about a minute.
- **Small fixes:** Kris adopted SMALL-FIXES on 2026-10-20, raised by the Acquire intake work, after weighing it against the first [hard rule](#the-responsive-coordinator). So the coordinator may make a one-line mechanical fix in its own work package itself, such as a stale status line or a link repointed to a pinned revision, and commits it by explicit path. A fix that needs judgement, touches more than a line, or touches another piece of work's files goes to a run, even when it is one line.
- **Never in-session:** analysis, design, drafting prose or prompts longer than a short brief, code or document edits, multi-repository investigation, and waiting in the foreground for an agent.
- **Waiting:** always through a detached waiter or monitor under the `ki-delegation` [run queue](../../../governance/ki-delegation/references/standards-background-runs.md#run-queue) and [monitoring](../../../governance/ki-delegation/references/standards-background-runs.md#monitoring) rules, never a foreground wait or sleep.
- **Brief-writing:** the coordinator writes only a short brief citing the owner's decisions, into the folder of the focus area the run serves, `<focus-id>/<run>.brief.md`, or `briefs/<run>.md` in a package that declares no focus areas, under the `ki-work-package` [focus areas](../../../governance/ki-work-package/references/standards-work-package.md#focus-areas). If the brief itself needs research, a background agent researches and writes it.
- **Self-check:** before each tool call, the coordinator asks whether it is a quick check or bookkeeping; if not, it delegates. When it notices it has drifted into doing work, it stops, delegates the rest, tells the owner in one line and notes the drift in its state file.
- **Tool calls:** every coordinator tool call is short. It never pastes a prompt, brief or other long text inline in a command: prompt files are written out of sight, with `ki agent new` or a one-line copy of a prepared file. A lookup that needs more than one or two short reads is delegated. Replies carry no raw tool output; the coordinator says in plain language what the result means, under [Quiet tools](#quiet-tools). Never issue a coordinator command that may wait for a permission prompt; put deletion and housekeeping in a bounded run or the existing close operation, and report a denied action instead of waiting unattended. The shapes that trip a runtime-specific check, Claude Code's built-in `rm` safety check under bypass mode, with no Codex counterpart observed yet, are an `rm` with a glob, a shell-variable or `$(...)` target, or a target under a workspace directory, alone or inside a compound command or `sh -c`; `git worktree remove`; and a foreground `sleep` of 60 seconds or more. A coordinator removes with `ki agent close` or a bounded run, and a run uses literal absolute paths or leaves removal to the tool that made the thing, under the `ki-delegation` [permission prompts](../../../governance/ki-delegation/references/standards-background-runs.md#permission-prompts) rule. Kris adopted PERM-PROMPTS-SHAPES, "Both standards", on 25 October 2026; the interactive cause is probable, not proven, until Kris reports a prompt's wording. This grants no bypass of a permission gate.
- **Owner messages:** a new owner message is a steering request, not a stop, and moves nothing: a message mid-run is a steer. The coordinator folds it into running and queued work - redirecting, re-queuing or recording a decision as needed - and keeps going. It stops or aborts a background agent or piece of work only when the owner expressly says to stop or abort it, naming the work. Because it is never mid-way through long work, it answers an owner message promptly.
- **Cadence:** Kris set the update cadence on 2026-10-14, as received: "UPDATE-CADENCE / yes: add to ki-coordination - full Summary only when all dispatched work has finished or on request; otherwise timed one-to-two-line updates; a blocking query raised in a single line; the resume line shown only at rest; a report that does not repeat unchanged queries still carries the full stacked reply block for every open query". The closing thread line now replaces send and resume lines, and the reply block is gone, so: while work lies with a worker the coordinator gives timed updates of one or two lines, timestamped, when it launches work and when an agent finishes, and none while it waits, under QUIET-LISTEN below; it raises a blocking query the moment it arises, in a single line, rather than holding it for the next report; it gives the full Summary in the [owner report](#owner-report) form only when all dispatched work has finished, when the owner asks for one, or as the gap Summary below; and every banner closes with its thread line. Between owner messages it has nothing else to say. Take each timed update's local time from the clock in that turn, never from recalled labels.
- **Gap Summary:** Kris set GAP-SUMMARY on 25 October 2026, taking option a), "30-minute trigger". So the first reply after 30 minutes or more without an owner message, while queries are with the owner, answers the owner's message first and then gives the Summary, with every open query in full, so the owner returning after a break sees everything waiting on them in one place.
- **Heartbeat:** the heartbeat runs only while work lies with a worker, and a run finishing is itself the wake. Kris added it on 2026-10-14, as received: "HEARTBEAT / while work runs, the thread's background check also wakes it every 5 minutes for a one-to-two-line timed update with each agent's current step; add it to the ki-coordination update cadence and the hook line, and apply it in this thread now", and replaced its timed updates under QUIET-LISTEN on 31 October 2026: "we don't need it to give an update unless it actually gets new information that's landed". So while any of its items lies with a run, the coordinator keeps one background check armed, a detached loop under the `ki-delegation` [monitoring](../../../governance/ki-delegation/references/standards-background-runs.md#monitoring) rules that spends no model time and exits only when a run in this thread's group finishes, with no timed bound. When it exits, the coordinator wakes, reads `ki agent status`, handles the finished agent in one timed line and, while runs remain, re-arms the check; it gives no timed update while it waits. Where the thread listens, this check and the inbox watcher below are one loop. With the supervisor or in handoff there is no heartbeat and only the inbox watch below is armed, where the thread listens; On hold nothing is armed, except the inbox watch of work [Snoozing](#putting-work-on-hold). When the coordinator session has ended, or has gone quiet, while its runs go on, the work waits on no session to wake it. Kris agreed OOS-WAKE as recommended on 2026-10-20, "OOS-WAKE - agreed as recommended": the owner may start a detached `ki agent` watcher with an autonomy window, and when a run finishes inside that window the watcher resumes the coordinator by the work's id and exact label under [Picking work up](#picking-work-up). The watcher is a `ki agent` capability, owned by its tooling; until it ships, out-of-session runs wait for the owner to send the work back. Session wakes are best effort and cannot promise an unattended service. Pursue the agreed completion-watcher direction first; a durable wake outside the session is a headless pass under [Headless passes](#headless-passes), which Kris chose under WAKE-SUBSTRATE on 26 October 2026, lifting the launchd deferral in that order, contract first; doorbells and extra liveness fields stay deferred. This does not establish that the watcher or the pass job has shipped.
- **Inbox watch:** a coordinating thread listens for its messages only when the owner asks it to. Kris asked under INBOX-WATCH on 31 October 2026 for an open thread to keep "periodically checking to see if you've got any new messages and acting on those", made it the rule the same day under LISTEN-STATUS, and narrowed it to an opt-in under LISTEN-OPT-IN: "I think fundamentally any of the coordination [threads] can be set up in this mode, but we've got to expressly ask them to be. And then secondarily ... the personal.reg.rig-<hostname> ones, which run on a regular basis doing this". So a coordinating thread listens once the owner expressly asks it to, in words such as "listen for messages" or "keep listening", and the coordinator records that request in the work's decisions log; a Rig host sync thread, `personal.reg.rig-<host>`, listens by its role without being asked, because [host sync](#thread-capabilities) implies listening. While a listening thread is open and its work is not draining, On hold or Finished, the coordinator keeps one inbox watcher armed, whoever holds the work; work [Snoozing](#putting-work-on-hold) keeps it armed On hold too. "stop the wake" or "stop listening" ends listening until the owner asks again, and a thread never asked does not listen. The heartbeat while runs go is separate and stays, listening or not, and joins the watcher in one loop. Kris set the watcher's shape under QUIET-LISTEN on 31 October 2026: "for a thread which is listening ... we don't need it to give an update unless it actually gets new information that's landed". The watcher is one long-running background loop, a detached shell loop that spends no model time: every couple of minutes it fetches and fast-forwards local `main` silently and compares the Git object of the work's `messages.md` with the one it started from, reading no content, and it exits only on news, a new line in `messages.md` or a run in this thread's group finishing; a pull that cannot fast-forward also ends it, as news needing a resolve. It has no timed bound while idle, so a quiet period produces no wake, no tool calls and no chat line. On a wake the thread speaks only about what landed: on a new line the coordinator acts on it under [Messages between work](#messages-between-work), commits, re-arms and tells the owner in one timed line what it did, and on a finished run it receives the run in one timed line and re-arms. A thread never holds more than one loop; after a compaction or a recovery it checks whether one is armed before arming another. The watcher lives and dies with the session: it is a session wake under WAKE-SESSION, not a scheduled agent, and promises nothing once the thread closes. A thread whose runtime has no proven way for the watcher's exit to wake it checks its inbox only at owner messages and run events, and shows itself as not listening. A shared shell command for the watcher and each runtime's wake are still open questions for the owner.
- **Listening:** a banner whose thread has the listening capability, `listening_enabled: true` in its `state.md`, shows `👂 listening` under [Banner](#banner)'s mode lines while the watcher is armed, `listening_status: on`, and `🔇 not listening` otherwise, `listening_status: off`: while draining, from `pause`, `done for now` or `drain` until the drain ends, because a drain stops listening, On hold and paused, while work [Snoozing](#putting-work-on-hold), the worker's idle hold included, keeps showing `👂 listening`, after "stop the wake" or "stop listening", or where the runtime cannot be woken. A thread without the capability shows no listening line at all.
- **Away grants:** record an explicitly granted unattended window in the existing decisions log: its end time or return condition, recorded as local time with its zone and as UTC, work, permitted actions, exclusions, wake and stop words, within `ki-delegation` [authority limits](../../../governance/ki-delegation/references/standards-background-runs.md#authority-tiers) and its [default deny list](../../../governance/ki-delegation/references/standards-background-runs.md#unattended-deny-list), naming any item of the list the grant lifts. Park decisions outside that scope. The window's plan, entry, progress, conflicts and return follow [Unattended windows](#unattended-windows). Stop starting unattended work at expiry, explicit return or "stop the wake", then report; an ordinary steering message does not cancel the window. An existing "while I am away" grant remains authority until its return condition. A question put to the owner during the window is asked in plain text in the thread, never through a blocking question prompt, waits a couple of minutes at most and, unanswered, is parked as a query for the return report with nothing done on it, under [Unattended windows](#unattended-windows); silence is never consent. An unattended window promises only the authorised attempt: report usage-limit stops, missed processing and failed runs on return, and never mark a trigger as processed work.
- **Scheduled wakes:** a separately requested schedule needs an explicit request or away grant, and a `[scheduled]` banner item naming its mechanism, observed next firing, session-only or durable lifetime, expiry and "stop the wake". Stop it at the window boundary or drain. This is a banner item, not another work state.
- **Concurrency:** Kris set the current practice on 2026-10-14, as received: "CONCURRENCY / add the current practice to ki-coordination: chain agents that touch the same files, run different repositories in parallel, about three running per thread, the rest queued". So agents that touch the same files are chained, each launched with its wait on the one before it under [Coordination](../../../governance/ki-delegation/references/standards-background-runs.md#coordination), so that no two edit a file at once; agents working in different repositories run in parallel; and about three agents run per piece of coordinating work at once, the rest waiting in the [run queue](../../../governance/ki-delegation/references/standards-background-runs.md#run-queue) in priority order.

The five hard rules remain authoritative here: Follow the coordinating-work standard (skills/change-management/ki-coordination/references/standards-coordination.md) and the Work Process note it cites. Hard rules: 1) delegate every unit of work to a detached background agent and stay responsive, answering within one short turn; 2) an owner message never pre-empts work in flight: stop an agent only when the owner names it and says stop; 3) while work lies with a worker, give a timed one-to-two-line update when you launch work and when a run finishes, keeping one background check armed that wakes you only when a run finishes, with no timed bound, and no heartbeat otherwise, while the inbox watcher, the same loop, stays armed only where the owner asked the thread to listen, or it is a Rig host sync thread, and the work is not draining, On hold or Finished, unless the owner asked the hold to listen, and wakes you only on a new message line or a finished run; 4) give every Summary in its summary shape and every re-bootstrap and hold report in the owner-report shape, heading and form line to glyph banner, with no reply block, a Summary and a re-bootstrap report restating every open query in full, end any other reply that moves the mark, changes the state or answers where the work stands with the banner, and read each spoken answer back in the decisions log; every medium- or low-confidence query, and any high-confidence destructive, deletion or publication one, goes to one blind review before it reaches the owner; 5) commit your own work and the work package by explicit path after every finished change; sync after each finished change and at least every 15 minutes under the standing push rule, fast-forward only, never forced or --no-verify, stopping on divergence; act on each messages.md line, IMPORTANT first, then in queue order, then remove it.

The harness `hooks/coordinator-reminder/coordinator-reminder.sh` checks checkout capability, not the interactive session's selected work or coordinator role. On supported owner-message events it emits only a short conditional pointer; after compaction it points explicitly coordinating sessions to [Re-anchoring after compaction](#re-anchoring-after-compaction). A declaration, cwd, package, run-home binding or session id alone never selects coordination. Unknown selection causes no package enumeration, package reads or method-history scan. Full session-sensitive detection remains deferred; the generic pointer is neither complete silence nor verified role detection. Launched agents, unsupported events, absent capability and malformed or unusable input remain silent and successful. The user-environment manager registers the hook; this change adds no runtime marker or store.

Where `[skills.ki-coordination]` is declared, the hook and the output style are bound, a runtime-specific binding under Claude Code: the repository's tracked `.claude/settings.json` selects `"outputStyle": "ki-coordinator"`, and the user's Claude Code settings register `hooks/coordinator-reminder/coordinator-reminder.sh` at `UserPromptSubmit` and `SessionStart`, with the style deployed as `~/.claude/output-styles/ki-coordinator.md`. The style and the hook line are harness-owned and generated from this standard; the user-environment manager, chezmoi, only links the style to the primary checkout and registers the hook. The `ki-coordination` rubric checks that the binding is present, as Kris decided on 2026-10-14: "HOOK-BINDING - add a mechanical rubric item that the binding is present where ki-coordination is declared, and leave chezmoi as the binder for now".

### Thread capabilities

A coordination thread may have two capabilities, as Kris set under THREAD-CAPABILITIES on 31 October 2026: "we've got coordination threads, and then I think we've got syncing threads. A coordination thread can be a syncing thread which syncs between hosts or a host sync capability. And then I think we've got one which is like a listening capability". Each is switched on only by the owner's express word, recorded in the work's decisions log, or by an agreed role, such as a Rig host sync thread's.

Each thread records its capabilities in four `state.md` fields under the `ki-work-package` [state file](../../../governance/ki-work-package/references/standards-work-package.md#state-file), as Kris set under FOOTER-CAPABILITY-STATUS-2, relayed on 1 November 2026: `listening_enabled` and `syncing_enabled`, `true` or `false`, say whether the thread has the capability, and `listening_status` and `syncing_status`, `on` or `off`, say whether it is running now. If `syncing_enabled` is true, `listening_enabled` must be true, because a syncing thread is always a listening thread. The coordinator sets `_enabled` when the owner's word or the agreed role grants the capability and clears it only when the owner withdraws it; it sets `_status` at every arm, stop, drain, hold and resume. "stop the wake" or "stop listening" turns the status off and leaves the capability enabled. At [Finished](#finishing-project-work) the close-out clears both `_enabled` fields.

- **Listening:** the thread keeps the [inbox watcher](#coordinator-responsiveness) armed, under LISTEN-OPT-IN. A listening thread also tends its own work package, as Kris set under LISTEN-TENDS-PACKAGE the same day: "if a thread is listening, it's important that it is also helping to manage and refine the work packages and make sure they're in good state". At a wake it makes at most one small tidy, within its turn budget: it keeps `state.md`'s front matter and next steps true; prunes received reports and spent briefs under the `ki-work-package` [tidy rules](../../../governance/ki-work-package/references/standards-work-package.md#tidying-the-work-folder); strikes a decision, or reduces it to a one-line pointer, once a durable home carries it, under the [decisions life cycle](#decisions-life-cycle); keeps `discussions.md` free of answered entries; and raises what it cannot settle as a query. It says nothing about a tidy unless something needs the owner. It never edits another work's package, though it may point out a problem in one with a line in that work's `messages.md`.
- **Host sync:** the thread is its Mac's sync thread. It repeats each pass until the Mac and GitHub are clean and level, or until something needs judgement, and only then waits for its next slot, as Kris set under SYNC-UNTIL-CLEAN the same day: "a resync doesn't finish until it's got to a point of being clean". It stays quiet on quiet passes, under SYNC-QUIET: nothing when nothing changed, at most one short line when something did, and a full report only for something that needs judgement or the owner. Host sync implies listening.

The banner's [mode lines](#banner) show the listening capability's status, `👂 listening` or `🔇 not listening`. Host sync has no banner line, as Kris decided under SYNC-LINE-OFF at about 18:00 GMT on 4 November 2026: remove the sync mode line from the banner entirely, now, because Agora keeps the machines in sync through each machine's household work package, so the line no longer says anything true and useful. The `syncing_enabled` and `syncing_status` fields stay in `state.md`.

## Coordinating practices

A coordinator also follows these practices with the owner. Every report it gives is an [owner report](#owner-report), whose sections, queries and banner are never shortened by any output style, proxy shaping block or communication level.

- **Questions:** queries reach the owner in the Summary by default; on request use the [interactive pass](#interactive-pass), one decision per turn, its context in chat Markdown and then a short question card, with plain chat Markdown alone where the runtime has no card.
- **Heading and banner:** every [Summary](#the-summary) and every [re-bootstrap](#bootstrap) report opens with the [report heading](#banner) and its state form line, so each reads cold and several pieces of work read side by side, and closes with the [glyph banner](#banner) and its thread line. Any other reply that moves the mark, changes the work's state or answers where the work stands ends with the banner too, under [Banner](#banner).
- **Heading levels:** in every form the report heading is the one `#` heading, in the message and in a saved file alike; the sections (`Summary since <time>`, `Status`, `Done`, `In Progress`, `Findings`, `Queries`) are `##` headings, and each finding, each query, each topic sub-heading and the banner heading is `###`. No other heading levels appear.
- **Self-contained:** no Summary or other report says "unchanged, see earlier", "as before" or otherwise points back to an earlier report. What is still running and what is still open is restated each time, because the owner reads each one cold and the earlier message may be gone. Every [Summary](#the-summary), including the [gap Summary](#coordinator-responsiveness), and every [re-bootstrap](#bootstrap) report restates every open query in full.
- **Sending:** when the work's items are done for now, or it waits on the owner, another piece of work, a scheduled test or an external fix, the coordinator sends: it commits the work folder and syncs under [Committing the work folder](#committing-the-work-folder), gives a Summary whose banner names the handoff, ends with its thread line. That Summary is the last message the owner sees until they return.
- **Hold:** when the owner says `pause` or `done for now`, the coordinator drains under [Putting work on hold](#putting-work-on-hold) and gives a hold report and nothing else.
- **State file:** every send, receive, mark and hold rewrites the state file's front matter, `state.md`, under [Picking work up](#picking-work-up), so that the work package alone says how the work is picked up. The work file, `work.md`, changes only when the work's definition does.
- **Links:** every roadmap record a report names is linked by its full identifier to its local file, under [Linking records](#linking-records), and a pruned record is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`. The rubric flags any record identifier a report leaves unlinked.
- **Wording:** plain language, and "background agents", never "helpers". When the owner must paste a message into another session, the coordinator gives it in a code block ready to copy.
- **Decisions:** the coordinator records each owner decision in the work's [decisions log](#decisions-log), `+/_WORK/<id>/decisions.md`, before launching the work it authorises, in the turn the decision arrives, and verifies any later quotation from the transcript file, under the two rules that section sets. It strikes, points or keeps each entry at the mark under the [decisions life cycle](#decisions-life-cycle).
- **Messages:** a message from other work reaches this work through its [message queue](#messages-between-work), `messages.md`, or a run's inbox; a backend nudge is not visible progress, and the [surfaces rule](#surfaces) says where the owner sees it.
- **Claims:** before a brief or a Summary rests on a path, an ownership claim or the premise of an instruction, the coordinator, or the run it sends, checks it directly, and reads back in one line any direction it finds ambiguous before acting on it. Kris agreed CLAIM-CHECK as recommended on 2026-10-20, "CLAIM-CHECK - agreed as recommended", with briefs carrying each target repository's standing rules by default under the `ki-delegation` [prompt shape](../../../governance/ki-delegation/references/standards-background-runs.md#prompt-shape).
- **Owner queue:** Kris agreed OWNER-QUEUE on 2026-10-20 with checks, "yes, less piling up on me makes sense", read back as "the `ki-coordination` audit counts each work's records awaiting acceptance and open queries and warns over about eight, and the banner shows the count; acceptance fixes and backlog-clearing work stay allowed over the cap". So each piece of Project work is capped at eight roadmap records awaiting acceptance and at eight open queries. Over either cap the coordinator launches no new build or planning run until the owner catches up; acceptance fixes and work that clears the backlog stay allowed. It brings the owner's acceptance as one bundle per work under [Acceptance bundles](#acceptance-bundles), and the banner's counts line shows the records waiting, under [Banner](#banner). The rubric warns over either cap, under [Pruning the work folder](#pruning-the-work-folder).

### Interactive pass

Queries reach the owner in full in the Summary, and after a Summary that lists open queries the coordinator also takes them in an **interactive pass**, as it does on the owner's request, because, as Kris added to SUMMARY-MODEL on 4 November 2026, "I'm probably not going to be able to go back and read everything"; the pass after the Summary that closes a pass asks only queries that pass did not. The pass never batches: it asks exactly one decision at a time, and each query takes two replies, so that the owner sends nothing between questions.

1. **First reply.** The coordinator starts a short background timer, about 5 seconds, such as a background `sleep 5` whose completion wakes it. Then it ends the reply with its last text: the one-line read-back of the previous answer, if there is one, followed by the next query's context as ordinary Markdown:

   ```markdown
   <one-line read-back of the previous answer>

   Query <n> of <total>

   ## <TAG>: <plain title>

   **Where things stand**

   - <a short bullet>
   - <a few more, enough to decide without scrolling back>
   ```

2. **Second reply.** Woken by the timer, the coordinator's reply holds only the card, through the runtime's question tool, such as `AskUserQuestion`:
   - **Title:** one line, the counter and the plain question, as in `Query 2 of 5: Release the held work now?`.
   - **Options:** each a short label, the recommended one first, its label carrying `(recommended, <confidence> confidence)`.
   - **Descriptions:** one or two sentences under each option saying what it means, the recommended option's opening with its `Why:`.
   - **Own words:** the card's free-text box serves for the owner's own words, so no option offers them.
   - **Pairs:** two related questions may share one card, each with a short header; otherwise one question per card.
3. **After the answer.** The coordinator logs it in the decisions log, then goes back to step 1, whose read-back opens the next query's first reply.
4. **Why.** Orca folds everything in a reply under "Worked for" except its last text, and it does not show text written after a card's answer within the same reply. So the context must be the first reply's last text, the card must stand alone in its own reply, and the read-back travels with the next context rather than after the answer. Orca's card also drops line breaks in its title, which was reported to Orca, while chat text renders in full and shows above the card.
5. **At the end of the set.** When the last query of the set is answered and logged, the coordinator's next reply reads it back, takes a mark and then gives the Summary, so that the owner has a clean baseline and a fresh view of where things stand.

**Where things stand** is a few short bullets, enough for the owner to decide without scrolling back. Where the runtime has no question card, or no way for a timer to wake the coordinator, the coordinator asks in plain chat Markdown alone: one reply carries the read-back, the context and **The options**, numbered, each with a bold name and what it means, the recommended one first carrying _(recommended, <confidence> confidence)_ and a one-line _Why:_, closing with "Reply with 1, 2 or 3, or your own words.", and then stops and waits. An unattended window keeps its own rule and asks in plain text, never through a card, because a card blocks the session.

The coordinator never asks the next query's card in the same reply as an answer's read-back. The total is the number of open queries when the pass starts; when an answer raises a new query, the coordinator adds it to the total and says so. Nothing is shortened because it is asked interactively, and the query keeps its [Needs tag](#needs-tags) either way. Kris chose QUERY-RULES a), "Adopt both", on 25 October 2026, which also set the split rule under [Query review](#query-review); Kris set the one-decision rule as INTERACTIVE-QUERIES on 31 October 2026, after a question tool showed a bare question with no context during Acquire intake that day, and refined it the same day as QUERY-TURNS: "Put each query in the chat as normal Markdown, starting with a counter line ... The total is the number of open queries when we start; if an answer raises a new one, add it to the total and say so." Kris added the closing mark the same day as QUERY-SET-MARK. The same day, after a run of test cards under CARD-LOOP, Kris set the card shape as CARD-PATTERN: "maybe you could give the context just before you ask the question, and then after you've received the response of it, you don't ask the same question immediately after it in the same contextual block. So I can then see the new context. So you kind of reflect back what the answer was." A further test loop settled the two-reply timer pattern that afternoon, Kris saying: "Yes, use this pattern".

### Goal-setting pass

The owner asks for a goal-setting pass with "goals" or `/ki-coordination goals`, as Kris chose GOAL-SETTING a) on 7 November 2026: "An owner-invoked pass, "goals" or `/ki-coordination goals`, walking each focus area one at a time to confirm or reword its goal and order, then writing `work.md`, logging Kris's words and closing with a Status." The coordinator walks `work.md`'s Focus list in order, one area at a time, in the [interactive pass](#interactive-pass)'s two-reply shape: it reads back the area's line, which says its goal, and its place in the order, and asks the owner to confirm, reword, reorder, add or retire it. When the pass ends it writes the steward's own `work.md` in one commit, logs the owner's words in `decisions.md` and closes with a Status. It strikes no mark and launches nothing.

### States and moves

The note's The seven states and Roles sections own the states, the two moves and who may make each. A coordinator keeps to them this way:

- **Its state:** territory work and Project work are With worker while any of their items lies with a run; Handoff to supervisor once the coordinator has sent to the owner; With supervisor once the owner has received; Handoff to worker once the owner has replied and no session has yet received it; Handoff to `<target>` while it waits on other work, a run or a person; On hold once agreed and drained; Finished once closed. Only the owner's receive and the hold are set, besides the worker's own idle hold under [Putting work on hold](#putting-work-on-hold); the coordinator derives every other state from where its items lie. Authorised work waiting for worker capacity stays with the worker; send to the supervisor only for an actual decision or review.
- **Receiving:** the owner receives with `with me`, `ack`, `got it` or `seen`, and agrees a hold with `pause` or `done for now`; `resume` and `finish` move work off hold and to Finished. `hold` is not a receive word. A coordinator's own receive is committed with whatever it next sends.
- **Sending:** a send is a commit of the work folder whose subject carries the move, such as `docs(work): ki.ways-of-working send to owner`, `docs(work): ki.ways-of-working receive by owner` or `docs(work): ki.ways-of-working hold, paused`, under the note's Git is the logbook. Only sends and the owner's receives commit.
- **A stuck worker** comes back to its supervisor with a blocking query: its send reads `🤖 → 👤 Handoff to supervisor · blocked`. A worker item that has neither moved nor beaten for 10 minutes is stuck; nobody sets stuck.
- **Old shape:** an old-shape checkpoint's REST reads as Handoff to supervisor or With supervisor, BUSY as With worker, HOLD as On hold, paused, and DONE as Finished.

### Banner

A report shows its state in rich text, under the note's Banner section, which Kris set with BANNER-GLYPH and REPLY-BLOCK on 18 October and TARGET-GLYPH the same day: the glyphs come first and the last glyph is whose move it is, a settled state shows its holder's glyph alone, an arrow appears only in a handoff state or in the line saying which hold or handoff With worker is heading for, and `→ 🎯 Handoff to <target>` serves every target, the target's name saying whether it is other work, a run or a person. Kris set GLYPH-OWNER the same evening: Kris appears as 👤 everywhere, and every other handoff target, other work, a run or a person, as 🎯. The block-letter frames retired with the model; a report written before 18 October keeps its frame, a report written before GLYPH-OWNER keeps 🧑 for Kris and 👤 for a target, and anything that reads past reports accepts every one of these. Every coordinator renders the heading and the banner the same way, whether it has just bootstrapped, re-bootstrapped or run for days: the examples below are the shapes, and a banner that differs from them is wrong.

**When it appears.** Every Summary, re-bootstrap and hold report closes with the banner, and so does any other coordinator reply that moves the mark, changes the work's state or answers where the work stands, even when it is not a full report, as Kris set on 2026-10-19 under BANNER-ON-STATE, after a reply to "whats waiting on me? / mark" on held work gave none. A plain answer that does none of these needs none.

**Heading for a hold or a handoff.** While the work is With worker but deliberately moving towards a hold or a handoff, the banner says so in one line of its own, below the list, as Kris set on 31 October 2026 under DRAIN-TARGET and moved out of the heading under FOOTER-LAYOUT the same afternoon: "if it's draining, that's also on the list underneath ... the point at the top in the header is who it's with, from a state perspective". The line is `↪️`, what the worker is doing, an arrow and the glyph heading of the state it is targeting:

- `↪️ draining → ⏸️ On hold` from the owner's `pause` or `done for now` until the drain under [Putting work on hold](#putting-work-on-hold) lands the hold, or `↪️ draining → 💤 Snoozing (on hold)` from `snooze` until the snooze lands;
- `↪️ draining → 👤 Handoff to supervisor` for `drain` alone, which stops launching and sends `DRAINED` or `NOT DRAINED` to the owner once everything has finished;
- `↪️ finishing → 👤 Handoff to supervisor` once the coordinator has decided to send the work to the owner and is only letting the runs in flight finish;
- `↪️ finishing → 🎯 Handoff to <target>` likewise before a handoff to other work, a run or a person.

The line stands in the banner only, never in the heading or the form line, which show the state alone, `🤖 With worker`. It is not a state or a move: the work is With worker until the target lands, the heading's `at` stays the time of the last move, and when the target lands the line goes and the heading shows the target state. In the counts and the list nothing changes shape: the runs still finishing count and list as `[running]`, nothing is launched from the queue while the line stands, and the target is never a count or an item, so a drain towards a hold reads `🤖 2 running` with its `[running]` items until it reads `⏸️ drained`. A report written before FOOTER-LAYOUT keeps its bracketed heading, such as `🤖 With worker (draining → ⏸️ On hold)`, and anything that reads past reports accepts it.

**One table of states.** Every coordinator renders each state the same way, from this table, as Kris asked under SNOOZE-STATE on 6 November 2026: "This needs to have some kind of consolidation and consistency of what's expected here." On hold has two forms, paused and Snoozing, each with its own glyph, so a hold that keeps listening never reads as drained. The counts line gives only the views that apply, each a glyph, a number and a view; the listening line appears only where the thread has the capability, under **Mode lines** below.

| State | Glyph | Banner heading | Counts line | Allowed items | Listening line | Report form |
| --- | --- | --- | --- | --- | --- | --- |
| With worker | 🤖 | `### 🤖 With worker · at <time>`, with a `↪️ <draining or finishing> → <target>` line below the list while heading for a hold or a handoff | `🤖 <n> running · 👤 <n> with you · ⛔ <n> blocked`, as they apply | `[running]`, `[queued]`, `[with you]`, `[stuck]`, `[blocked]`, `[parked]`, `[awaiting ACK]` | `👂 listening`, or `🔇 not listening` while draining | Summary, Status, re-bootstrap report or plain state reply |
| Handoff to supervisor | 🤖 → 👤 | `### 🤖 → 👤 Handoff to supervisor · at <time>`, or `### 🤖 → 👤 Handoff to supervisor · blocked · at <time>` | `👤 <n> with you · 🅿️ <n> parked`, as they apply | `[with you]`, `[blocked]`, `[parked]`, `[awaiting ACK]` | `👂 listening` or `🔇 not listening` | Summary at the send |
| With supervisor | 👤 | `### 👤 With supervisor · at <time>` | `👤 <n> with you · 🅿️ <n> parked`, as they apply | `[with you]`, `[parked]`, `[awaiting ACK]` | `👂 listening` or `🔇 not listening` | Summary, Status, re-bootstrap report or plain state reply |
| Handoff to worker | 👤 → 🤖 | `### 👤 → 🤖 Handoff to worker · at <time>` | `🤖 <n> queued · 👤 <n> with you`, as they apply | `[queued]`, `[with you]`, `[parked]`, `[awaiting ACK]` | `👂 listening` or `🔇 not listening` | plain state reply |
| Handoff to `<target>` | → 🎯 | `### → 🎯 Handoff to <target> · at <time>` | `👤 <n> with you · 🅿️ <n> parked`, as they apply | `[with you]`, `[parked]`, `[awaiting ACK]` | `👂 listening` or `🔇 not listening` | Summary at the send |
| On hold, paused | ⏸️ | `### ⏸️ On hold · paused until <release> · at <time>` | `⏸️ drained · 🅿️ <n> queries parked` | `[parked]`, ``[release] <release>, or `resume` `` | `🔇 not listening` | hold report |
| Snoozing (on hold) | 💤 | `### 💤 Snoozing (on hold) · at <time>`, or `### 💤 Snoozing (on hold) · idle · at <time>` for the worker's own idle hold | `💤 waiting for a message · 🅿️ <n> queries parked` | `[parked]`, ``[release] a message arrives, or `resume` `` | `👂 listening` | hold report |
| Finished | 🏁 | `### 🏁 Finished · <work label> closed at <time>` | none | `[finished]` | none | finish report |

A report written before SNOOZE, on 6 November 2026, may read `⏸️ On hold · more expected` or a banner heading ending `· since <time>`, and anything that reads past reports accepts them.

**Rendered glyphs.** The emoji stay the written notation in reports, terminals and commits. A rendered surface, such as the Observatory's Work tab, may draw the five glyphs, 🤖, 👤, 🎯, ⏸️ and 🏁, and Snoozing's 💤 once the package carries one, with the matching line glyphs from `@knowledgeislands/icons` instead, always with the state's words beside them; the words, the arrows and the banner's shape do not change, and the mapping from state to glyph is the package's. Kris took BANNER-GLYPHS a) on 2026-10-20 under the Observatory work's overnight authority, "You can do anything on a high confidence level that you recommend", its option reading: keep the emoji as the written notation and let a rendered surface draw the five line glyphs with the state's words beside them.

**Report heading.** The report opens with one `#` heading, one bold form line and one horizontal rule, then its first section: `## Summary since <time>` in a [Summary](#the-summary), `## Done` in any other report. It is plain Markdown, not a fenced block, so the heading carries the links a code block could not hold. Kris asked for the rich-text heading on 2026-10-14, "maybe you can just come up with something which is just a better heading that is the actual just normal text, so it can be rich text rather than fixed width text", agreed the mock with "Actually, that is really good.", and dropped the rules before it on 2026-10-17, "If we got rid that, we can just go single horizontal rule so don't cause problem and fix other part."

- **Heading:** `# [<Theme>](<local theme page>) › [<Project>](<local Project note>)`: the theme's display name, the `title` its page gives, linked to the page by absolute path; then ` › `; then the Project's display name, written as words, not its slug, linked to its note the same way. Project work with no theme gives the Project alone. Territory work writes the territory or theme it covers, linked to its local note, then `› State of play`, and a secondary `› State of play (<name>)`. No rule stands before the heading, so it is the first line and H1 of every saved report. Explicitly coordinating regular or ad hoc work uses `# [<actual work label>](<actual local work page>)`, optionally preceded by its real theme; use its work file when no separate page exists, never fabricate a Project.
- **Form line:** a blank line, then `**<glyph state> · <Form> at <local time> · <window or mark>**`: the glyph heading of the work's state as the report is sent, then the form, `Summary`, `Status`, `Re-bootstrap`, `Run report`, `Hold report` or `Finish report`, and the times, both local and written like `19:13 BST`. A Summary writes `· since <window start>`, the same time its `## Summary since <time>` gives; a Status, a re-bootstrap report, a run report and a finish report write `· last mark <local time>`; and a hold report writes `· mark <local time>`, the mark struck for the hold. A report written before SUMMARY-MODEL, on 4 November 2026, may read `Recap` or `Full summary`, and one written before REPORT-FORMS-TIDY, on 6 November 2026, a Summary's `· last mark <local time>`; anything that reads past reports accepts them.
- **Three times:** a report shows three different times, each with its own words. `<Form> at <local time>` is when the report was given. In a Summary, `since <time>`, in the form line and in `## Summary since <time>` alike, is the start of the window it covers: the last mark, or the thread's start where there is none, or the time the owner named; after `mark` it is the previous mark, because the new one has just been struck. In the banner, the heading's `at <time>` is when the work entered the state it shows, a moment rather than the start of a window, and each item's `since <time>` how long that item has stood in its place. Kris asked for this under REPORT-FORMS-TIDY on 6 November 2026, having read the form line's last mark, the Summary's window and the banner's last move as one time, and under SNOOZE-HEADING the same evening moved the heading to `at`: "it's not since, I'd say at. The word since isn't useful." So `since` now opens only a span, the Summary's window or an item's standing, and never a moment.
- **Rule after:** a blank line, one `---`, then a blank line and the first `##` section.
- **Nothing else:** no window and no level. The form fixes the window and the banner carries the state.

Opening a Summary:

<!-- ki-coordination:block heading-example -->

```markdown
# [Model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Themes/model.md) › [Ways of working](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working.md)

**🤖 → 👤 Handoff to supervisor · Summary at 23:52 BST · since 22:34 BST**

---

## Summary since 22:34 BST
```

Territory work opening a Summary from a time the owner named:

```markdown
# [<territory or theme>](<its local note>) › State of play

**👤 With supervisor · Summary at 19:13 BST · since 09:00 BST**

---

## Summary since 09:00 BST
```

**State in the banner, housekeeping in the body.** The banner shows only the work's state and who holds each live item. Housekeeping belongs in the report body, as Kris set on 31 October 2026 under BANNER-TRIM: "If it's handed off, it's handed off ... why are we also putting things like committed there as well? ... I think the part of the summary itself". So commits and a recovered session are lines in `## Done`; uncommitted work, unlogged decisions and repositories behind their remote under the [repository level check](#repository-level-check) are lines in `## In Progress`; and an item with other work, a run or a person is a waiting line in `## In Progress` with its holder, and in a [Summary](#the-summary) each of these is a line of its status table instead, a commit or recovery under `## Summary since <time>`, while the heading already shows a handoff of the work itself. A report written before BANNER-TRIM keeps its `[handoff]`, `[committed]`, `[uncommitted]`, `[recovered]`, `[unlogged]` and `[behind]` items, and anything that reads past reports accepts them.

**Glyph banner.** The report closes, after `## Queries`, with the banner, which in a [Summary](#the-summary) is the footer's lines beneath its art, laid out top to bottom as Kris confirmed under FOOTER-LAYOUT on 31 October 2026: "what you've just said in terms of the footer top to bottom is spot on ... extra bit of white space really handy between bullet points ... Then followed by additional flags turned on, like listening, syncing, or listening and host syncing ... and then the thread icon and the name of it". Kris reads it from the bottom up, so the thread line is last and the state heading first:

1. one `###` heading, the glyph state alone and `· at <local time>`, the time of the last move;
2. a blank line, then the counts line;
3. in a Summary's footer, a blank line, then the [roadmap line](#banner) where the work's repository has a roadmap, and a blank line, then the [package line](#banner);
4. a blank line, then the list of items;
5. a blank line, then the [heading-for line](#banner), `↪️ draining → <target>` or `↪️ finishing → <target>`, only while heading for a hold or a handoff;
6. a blank line, then the [mode lines](#banner), one for each capability the thread has, a blank line between them;
7. a blank line, then the [thread line](#banner), `<role glyph> 🔑 <work-id>` or `🧵 <work-id>`, last.

The heading carries the glyph state alone, never a target in brackets, and `· at <local time>`; the counts are one line, each a glyph, a number and a view, joined by ` · `, such as `🤖 2 running · 👤 1 with you · ⛔ 1 blocked`, and, in Project work with roadmap records awaiting the owner's acceptance, `📥 <n> to accept` last, under the [owner queue](#coordinating-practices) cap; and the list is one Markdown list, each item `- [<state>] <what> · <holder> · since <time>`. The counts and the list say "with you", because they are views by holder; the heading gives the state in role words. List items come in this order and only where they apply: `[running]` and `[queued]` for each agent, the holder `run/<name>`; `[with you]` for each open Needs tag, the holder `owner`, oldest first; `[stuck]` and `[blocked]` with their holder; `[parked]` for parked queries or tangents; `[awaiting ACK]` for each line this work has sent and still holds in its `messages.md` Outbound, as `- [awaiting ACK] <id> · to <package id> · since <time>`, the receiver standing in the holder's place, as Kris set under NO-LINK-MARK on 4 November 2026 and the [Messages lines](../../../governance/ki-work-package/references/standards-work-package.md#messages-lines) ACK rule prunes; `[release]` on hold; then, in territory work, the `[stranded]`, `[branch]` and `[stash]` findings of its [worktree sweep](#worktree-sweep), which name no holder. Nothing in the banner cites a decision number.

**Roadmap and package lines.** Directly beneath the counts line, each after a blank line, the Summary's footer carries one line of counts for the roadmap and one for the work package, as Kris set under FOOTER-COUNTS at about 20:40 GMT on 6 November 2026, of the footer `personal.reg.household-terra` trialled: "I absolutely love that footer. Can you make that the case, please, and get that to be rolled out?" In a Summary of work On hold the counts line is the hold line, `⏸️ drained · 🅿️ <n> queries parked`, or `💤 waiting for a message · 🅿️ <n> queries parked` while Snoozing, and the two lines sit beneath it, so the counts stay together under the heading and the thread line stays last.

- **Roadmap line:** `🗺️ roadmap · <n> records · <n> open · <n> done awaiting prune · <n> ideas`, read from `ki repo roadmap summary` in the repository that homes the work package: records is the total, ideas the `triage` horizon, done awaiting prune the done and cancelled records, and open every other record. A count of one takes the singular, as in `1 record` or `1 idea`. A repository with no roadmap has no roadmap line.
- **Package line:** `📦 package · inbox <n> · outbox <n> · held <n> · awaiting ACK <n>`, read from the work package: inbox counts the lines in `messages.md`'s `## Inbound`, outbox the lines in its `## Outbound`, held the items under `state.md`'s `## Held`, and awaiting ACK the Outbound lines no ACK has answered yet, one for each `[awaiting ACK]` item.

Both are counted afresh for each Summary and write their zeros, so they keep one shape; they are counts, never items. The footer therefore has two forms, named plainly: the **long form** is the Summary's footer, the art and then the glyph banner with these two lines; the **short form** is the glyph banner alone, without them, which closes a re-bootstrap report, a hold report, a run report, the finish report and any other reply that ends with the banner; a Status takes the long form, as a Summary does. [Templates](#templates) shows which footer each form takes.

**Mode lines.** A banner shows the thread's modes that are switched on, one line each, below the list and any heading-for line and above the thread line, a blank line before each, as Kris set under LISTEN-STATUS on 31 October 2026, "that should be something that comes out in the summary mode, which is whether or not the thread is listening to messages or not, whether it's draining, because if it's draining it stops listening to messages ... And also if it's a sync-based thread", and laid out under FOOTER-LAYOUT the same afternoon: "the modes switched on should happen like that [as their own lines] ... syncing should be a different line alongside listening". A mode line appears only for a capability the thread has, and then it always appears, saying whether that capability is on or off, as Kris set under FOOTER-CAPABILITY-STATUS-2, relayed on 1 November 2026, refining FOOTER-NOT-LISTENING of 31 October: the footer shows a capability's line only when its `_enabled` field is true, and the line shows its status; with `_enabled` false there is no line. So a thread with `listening_enabled: true` shows `👂 listening` while the [inbox watch](#coordinator-responsiveness) is armed, `listening_status: on`, and `🔇 not listening` otherwise, `listening_status: off`: while draining, On hold and paused, after "stop the wake" or "stop listening", or where the runtime cannot be woken. A thread the owner has not asked to listen, and that is no host sync thread, shows no listening line, never `🔇 not listening`. Work [Snoozing](#putting-work-on-hold) shows plain `👂 listening` while its watcher is armed, because its 💤 heading and counts line already say it waits for a message. A report written between REPORT-FORMS-TIDY and SNOOZE, both on 6 November 2026, may carry `👂 listening · a message releases the hold`, and anything that reads past reports accepts it.

There is no sync line, under SYNC-LINE-OFF of 4 November 2026: a host sync thread shows only its listening line. A report written before SYNC-LINE-OFF may carry a `🔄 syncing for <host>` or `🔄 not syncing for <host>` line, and anything that reads past reports accepts it. So a listening host sync thread on sol closes:

```text
👂 listening

🏠 🔑 personal.reg.rig-sol
```

A run report's banner carries no mode lines and no heading-for line, because a run does not listen for a thread's messages or drain the work. A report written before FOOTER-LAYOUT keeps its one listening line, such as `👂 listening · not the sync thread for terra`, and one written before FOOTER-NOT-LISTENING may carry a `🔇` line on a thread that never listened; anything that reads past reports accepts both.

**Push state stays out of reports.** Owner reports, run reports and banners omit routine push state and other sessions' stacked commits, as Kris set on 2026-10-21: "I don't think you need to keep reminding me in each of them of the common push things that I'm doing, because that's going to be based on state that's outside of the thread." PUSH-NOT-WITH-YOU still applies: a push of stacked commits is never a `[with you]` item, a "with you" count or a query. If a run's own unit could not be published because its push failed, its `## Done` names the affected unit and reason, under [Pushing beneath other sessions](#pushing-beneath-other-sessions).

**A hold lists nothing waiting.** An On hold banner carries no `[with you]`, `[running]`, `[queued]` or per-repository status item, such as `[on hold] committed and pushed in ...`, as Kris set the same evening under HOLD-CLEAN: "this is on hold, but it says on hold pushed to agentic harness. You're not on hold on if you're waiting on something." Its counts line reads `⏸️ drained · 🅿️ <n> queries parked` on a paused hold and `💤 waiting for a message · 🅿️ <n> queries parked` while [Snoozing](#putting-work-on-hold), which still listens and so never says drained; its items are only `[parked]` and `[release]`, Snoozing's `[release]` item reading ``a message arrives, or `resume` ``; per-repository outcomes stay in the hold report's `## Done`.

With worker, closing a Summary while runs are out:

<!-- ki-coordination:block with-worker-banner -->

```markdown
### 🤖 With worker · at 23:41 BST

🤖 2 running · 👤 1 with you · ⛔ 1 blocked

🗺️ roadmap · 6 records · 4 open · 1 done awaiting prune · 1 idea

📦 package · inbox 1 · outbox 0 · held 0 · awaiting ACK 0

- [running] work-model · run/work-model · since 23:20
- [running] tools-burndown fix · work/ki.tools-burndown · since 23:05
- [with you] WORK-HOME · owner · since 22:58
- [blocked] work folder commit · repo/ki-principal · since 22:40

👂 listening

⚒️ 🔑 ki.prj.ways-of-working
```

Handoff to supervisor, closing a Summary that sends the work to the owner:

<!-- ki-coordination:block handoff-banner -->

```markdown
### 🤖 → 👤 Handoff to supervisor · at 23:52 BST

👤 2 with you · 🅿️ 1 parked

🗺️ roadmap · 6 records · 3 open · 2 done awaiting prune · 1 idea

📦 package · inbox 0 · outbox 0 · held 0 · awaiting ACK 0

- [with you] WORK-MODEL · owner · since 23:52
- [with you] WORK-HOME · owner · since 22:58
- [parked] 1

👂 listening

⚒️ 🔑 ki.prj.ways-of-working
```

With worker, draining towards a hold after `pause`, with one run still finishing:

<!-- ki-coordination:block draining-banner -->

```markdown
### 🤖 With worker · at 23:41 BST

🤖 1 running · 👤 1 with you

- [running] work-model · run/work-model · since 23:20
- [with you] WORK-HOME · owner · since 22:58

↪️ draining → ⏸️ On hold

🔇 not listening

⚒️ 🔑 ki.prj.ways-of-working
```

**Thread line.** Every banner closes with one plain Markdown line, after a blank line following its mode lines, or its list in a run report: the session's [thread line](../../../governance/ki-work-package/references/standards-roles.md#thread-line), `<role glyph> 🔑 <work-id>` for every explicitly coordinating package whose seat has a role, main or secondary State of play, Project, regular or ad hoc work, and `🧵 <work-id>` for a session with no role yet. Use the authoritative work id from `work.md` and the glyph of the seat's one catalogue role. A run report closes with `🧵 <work-id>` of the work it reports to, without adding its run name, because a run takes no seat. Rich report headings, work labels, banner counts and states remain unchanged. Reports saved before this change retain their original closing line and remain readable; never rewrite them solely for the new footer. This line closes every state, including handoff, On hold and Finished. It replaces all copyable send and resume lines: no banner, handoff or hold report emits either prompt or a paste instruction, beyond the [restart suggestion](#banner) below when one of its triggers holds. The owner gets each thread's opener from `ki agent prompts <territory>`, under [Opening work](#opening-work), never from a report. Kris replaced the earlier type-and-label footer with this bare-ID rule on 28 October 2026.

**Restart suggestion.** A coordinator suggests restarting its thread only when a restart is genuinely warranted, as Kris set on 29 October 2026: "There becomes a point when the agents should suggest that this thread would be better off being restarted. That could be a banner at the bottom of it which should say something along those lines and give the prompt to do so, but only when it's necessary." It is a single closing item placed with the banner, directly before its `###` heading and after `## Queries` or `## Status`, so the banner and its thread line stay last. It is warranted by one of three triggers and by nothing else:

- **Identity changed:** the work's id, level, label or run name changed in this thread, as when a package moves from `hnr.prj.email-routing` to `hnr.reg.email-routing`: the session's name, run and opener no longer match `work.md`, and only a fresh opener sets all three again.
- **Repeated compaction:** the session has been compacted twice or more: each [re-anchoring](#re-anchoring-after-compaction) rebuilds from a summary of a summary, and a fresh bootstrap from the work package is more faithful than another.
- **Method moved on:** since the thread opened, the method changed its opener, the hook line or the output style, which the coordinator checks under [Refreshing this guidance](#refreshing-this-guidance): a session keeps the style and opener it loaded at start, and only a fresh session loads the current ones natively.

The item is one bold line naming the trigger and saying plainly that this thread would be better restarted, then the work's opener exactly as `ki agent prompts <territory>` prints it for this work, in one fenced block:

````text
**Restart suggested:** the work moved from hnr.prj.email-routing to hnr.reg.email-routing in this thread, so its label, run name and opener changed; this thread would be better restarted in a fresh session with this opener.

```text
Bootstrap as hnr.reg.email-routing regular work under ki-coordination.
...
```
````

It is the second named exception to the rule that a report carries no send, resume or paste line, beside the bootstrap `Rename thread:` line under [Opening work](#opening-work). It is absent otherwise: never for length, age, a change of state, a hold or a model switch alone. A coordinator gives it in each report that closes with the banner while its trigger holds, and once the owner declines it, not again until a new trigger arises. A hold report, a run report and a conversational reply never carry it; picking work up still follows the work package, and the owner closes the old session.

Sending and receiving work remain the moves in the work model. To pick work up, the coordinator follows [Picking work up](#picking-work-up) from the work package; the thread line identifies work and is not a restart prompt.

On hold, closing a hold report:

<!-- ki-coordination:block hold-banner -->

```markdown
### ⏸️ On hold · paused until the harness migration lands · at 00:10 BST

⏸️ drained · 🅿️ 9 queries parked

- [parked] 9 queries in `discussions.md`
- [release] after the harness migration lands, or `resume`

🔇 not listening

⚒️ 🔑 ki.prj.ways-of-working
```

Snoozing, closing a hold report for a hold that waits for more to come:

<!-- ki-coordination:block snoozing-banner -->

```markdown
### 💤 Snoozing (on hold) · at 23:58 GMT

💤 waiting for a message · 🅿️ 2 queries parked

- [parked] 2 queries in `discussions.md`
- [release] a message arrives, or `resume`

👂 listening

⚒️ 🔑 ki.prj.ways-of-working
```

Finished, closing the last report at [Finishing Project work](#finishing-project-work):

```markdown
### 🏁 Finished · Ways of working closed at 18:00 BST

- [finished] 14 work items accepted, decisions homed, work folder pruned

⚒️ 🔑 ki.prj.ways-of-working
```

**In an agent's report.** A background agent's run report takes the same heading and banner, under the [owner report](#owner-report): the report heading of the work it reports to with `› <run name>` added at its end and the form `Run report`, so its form line reads `**🤖 → 👤 Handoff to supervisor · Run report at <local time> · last mark <local time>**`, the mark being that work's, and `· blocked` added where it sends back with a blocking query; then its own banner, the run's state and its items, closing with the thread line of the work it reports to. Opening a run report:

```markdown
# [Model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Themes/model.md) › [Ways of working](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working.md) › migrate-phase1

**🤖 → 👤 Handoff to supervisor · Run report at 20:40 BST · last mark 14:54 BST**

---

## Done
```

### Re-anchoring after compaction

A compaction keeps a coordinator's session but replaces its transcript with a summary, so the coordinator re-anchors from durable state before it replies; a conversational session re-reads its work package, if it has one, and carries on with a conversational reply. The owner may choose to compact a long session using the runtime's compaction facility, keeping the work id, Working rules block, mark, open Needs tags, running and queued agents and messages acted on. No send or resume prompt is emitted before or after compaction; a second compaction instead warrants the [restart suggestion](#banner).

Whether the compaction came from the owner or from the runtime, the coordinator then, before answering anything else:

1. re-reads this standard, the harness output style `output-styles/ki-coordinator.md` from disk and all five files of its own work package in full, and follows the style file wherever it differs from the loaded style;
2. runs `ki agent status` and reads its `messages.md` queue, important lines first, and any run inbox, so it knows what is running, queued and unread rather than assuming;
3. as territory work, lists every item in its territory's `+/_WORK_REVIEW/` areas and carries the `REVIEW-HOLD` query under [Work awaiting review](#work-awaiting-review) while any holds anything;
4. confirms in one line that it has re-anchored, then answers in owner-report form with the banner.

The style file wins because a session keeps the output style it loaded at start through a compaction, so the loaded copy can lag the file on disk; Kris answered STYLE-STALE a) on 18 October 2026, "do all the recommended items, we just need to move forwards", and the [compact pointer](#generated-surfaces) and the style's own re-anchoring paragraph say the same.

Re-anchoring moves no mark. The harness hook injects a one-line pointer to this subsection on a compact session start in Claude Code; a Codex session re-anchors on the owner's next message, where the hook's ordinary line reaches it.

### Surfaces

A coordinator may receive a message from other work through its work package's `messages.md`, which travels through Git, or from a run through the run's inbox, `~/.local/state/ki/agents/<run>/inbox.md`, written with `ki agent send <run> <line>`, which dates the line and names the sending run, and which the run's next `ki agent status` shows; where the runtime can message another live session on the same machine, as Claude Code can and Codex cannot, the sender may also nudge a live session with one runtime message naming the entry. The rule, which Kris approved on 2026-10-14 with "approve the surfaces rule and the ki agent status follow-on", is that **a backend reply is not visible progress**: a reply to a nudge, or an inbox acknowledgement, counts as progress only once it is on a surface the owner looks at. The receiving coordinator writes what it did into its next owner-facing turn and its state file; the sender keeps the item under its Needs tag, saying "acked by backend, not yet visible", until that happens.

| Surface | Carries | Who writes it | When |
| --- | --- | --- | --- |
| Transcript | Owner turns and the coordinator's own replies; nothing injected | The coordinator, in its owner report | Every owner-facing turn names messages received and acted on since the last one |
| Work package | `work.md` and `state.md` front matter, which the observatory reads; the `messages.md` queue; parked tags in `discussions.md` | The coordinator, under the work-package standard; other work writes only its own `messages.md` line | `state.md` at every send, receive, mark and hold; `work.md` when the definition changes |
| Work status | `ki work status --format json`, schema `ki/work-status/v1`, and the five views | `ki`, reading every work package, and every single-file work file for the tolerance window | On demand; the Observatory reads only this |
| Notification | Message received, acknowledgement sent, session recovered, session errored | Not this standard | The notification record in Knowledge Islands Principal owns the channel |

A sender that only nudged without writing the `messages.md` line or inbox entry has not sent the message. The inbox is machine-local; a message that must reach work on another host, or on hold, goes into its `messages.md`.

### Recovering a session showing a red x

A red x in the editor's session list means the backend turn errored, not that the work is lost: the work package holds everything it needs. Kris approved the recovery on 2026-10-14 with "approve red-x recovery":

1. Do not open a new session first. Ask the same session to pick up the work identified by its closing [thread line](#banner). If it replies, it re-anchors, strikes the mark, gives a fresh summary since the mark and takes stock.
2. If the editor will not send into the session, open a new one in the same project folder and identify the work by its id and exact label from the thread line. The coordinator verifies both against `work.md` before acting; the old transcript becomes history.
3. The recovered coordinator reports, under take stock, what it missed and what it did about it, and that one report's `## Done` carries a line saying the session was recovered and when, in UTC.

## Reply forms

Every reply to the owner takes one of three forms, which Kris set apart on 2026-10-16, as relayed: "Please make the reporting rules explicitly distinguish ordinary conversational replies, completed-work reports, and coordinator summaries. A conversational thread can do bounded work directly without becoming a coordination thread. Routine answers and acknowledgements should stay plain, without empty reporting sections or a "No reply needed" block. When a completed-work report is required, use the owner-report format. Coordinator checkpoints, marks and banners apply only to coordinating threads."

| Form | When | Shape |
| --- | --- | --- |
| Conversational reply | The default in every session, for anything that does not end a [unit of work](#units-of-work): answers, acknowledgements, clarifying questions, plans proposed for agreement and timed progress updates | Plain prose. No heading, section, Needs tag or banner, except that a coordinator's reply that moves the mark, changes the work's state or answers where the work stands ends with the [banner](#banner). A question for the owner is one line |
| Completed-work report | When a unit of work ends, in any session, and as every background agent's final report | The [owner report](#owner-report): `## Done`, `## In Progress` and `## Queries`. In a conversational session, including regular or ad hoc work without a coordinating opener, it has no report heading, form line or banner, and opens at `## Done` |
| Coordinator summary | Only while explicitly coordinating a valid work package | The [report forms](#report-forms): the [Summary](#the-summary), the re-bootstrap report and the hold report, each under the report heading and form line, closing with the banner and its thread line, with the work package and mark that go with them |

While coordinating, the completed-work report is the Summary. In a conversational session a request for a "summary", "full summary", "mark" or "status" gets a conversational reply, and a request for a "recap" gets the ordinary `ki-recap` session recap in its own form; neither borrows a coordinator form.

**Suggestions are recommendations with a confidence.** In every reply form, and in every session, coordinating or not, a suggestion is put as a recommendation carrying a confidence value, `high`, `medium` or `low`, as Kris set on 30 October 2026 under RECOMMEND-CONFIDENCE: "when you're making suggestions, regardless of where the suggestions are made, and even outside of the coordination capabilities, I definitely want to flag them as the recommendations, and I definitely want to have a confidence value on them". A query's options already carry this under the [owner report](#owner-report); the rule extends it to a suggestion in a conversational reply, a plan proposed for agreement and a run report alike.

### Session kinds

A session with no coordinating opener is conversational. It may do bounded work directly, including regular or ad hoc work, and uses the conversational reply forms. Kris separated this from coordinating work on 16 October 2026 under [Reply forms](#reply-forms); the repository declaring this skill or injecting its hook does not make the session a coordinator.

At [bootstrap](#bootstrap), resolve the owner-approved opener to the exact package and actual home, check its level without changing it, and cite the opening authority in its decisions log or the bounded owner instruction. `territory`, `project` and `regular` are all eligible. Coordination requires `ki-coordination` capability in the package-home repository, with its declared dependencies, unless a specific owner-approved exception expressly covers that opening. Acquire's already-approved intake exception remains usable; it grants no other package or capture/provider authority. A missing capability without that exception, an ambiguous home, missing opening authority or a mismatched opener stops coordination with a one-line explanation and the conversational reply forms. A package, id, level, binding or capability declaration alone never selects the role.

A background run is the detached actor a coordinator briefs under `ki-delegation`, rather than a fourth owner-facing session kind. It delivers its bounded unit and returns the owner report to its reporting package.

### Units of work

A unit of work ends, and a completed-work report is owed, when at least one of these holds for the work since the last such report:

1. **Changed:** a change to a repository, configuration or external system was committed, or was deliberately left uncommitted with the reason stated.
2. **Sent:** work passed to other work, a repository, a record or a person, such as a captured record, a trade, a `messages.md` line or a handoff.
3. **Run finished:** a background run the session launched has finished; for a background agent, its own run is ending.
4. **Deliverable:** a deliverable the owner asked for, such as a document, report, draft or analysis written to a file, has been produced.
5. **Stopped for the owner:** the work stopped before completion with something the owner must decide, supply or do, such as a failure, a block or a decision.

None of these ends a unit of work, and each gets a conversational reply: answering a question, however many reads it took; acknowledging an instruction or a decision; a clarifying question; an interim step or a timed update; a single read, lookup or check; a plan proposed in conversation for agreement.

A change the owner asked for and that was made in the same turn, in one file or one commit, with nothing failed, open or left to decide, is confirmed in one plain line naming what changed, and needs no report. Work that ends with nothing changed and nothing open is told in one plain line; work that ends with nothing changed but something open meets criterion 5. A background agent always reports, because its report is its run's only output. One report covers every unit that ended in the same turn.

### Conversational bounded work

A conversational session does bounded work directly, without delegating, opening a run or becoming a coordinator. The work is bounded when it serves the matter the owner raised in the session, stays within the authority the owner gave there and each repository's own rules, and can finish with the owner in the session. The session may delegate when it chooses. It becomes a coordinator only when the owner opens or re-bootstraps it with a coordinating [opener](#opening-work), never on its own. When the work outgrows the bound, because it needs a Project's decisions, more than one run at once, or would keep the owner waiting across sessions, the session says so in one line and proposes the Project's work, or new Project work through territory work.

Work that must outlive the session takes an ad hoc work folder, `+/_WORK/<territory>.reg.<slug>/`, under the work-package standard, as Kris answered CONVERSATIONAL-RUN on 2026-10-16 by taking CONVRUN-NARROW's option a) for the run and folder it may take. It pauses by putting the work On hold through a state-file update, with no hold report or banner, and its agents head their reports `# <work title> › <run name>` with `**Run report at <local time>**` and no banner.

### Coordinator-only machinery

The report heading and form line, the banner and its thread line, the mark, the message queue's acting rule, re-anchoring after compaction, the turn budget and the heartbeat belong to coordinators only. A conversational session's optional work package is the plain record: it notes a pause in its state file's front matter and how to carry on in its next steps, and is finished and pruned when the work ends.

## Owner report

Every completed-work report under [Reply forms](#reply-forms) takes one shape, the **owner report**: a background agent's final `<name>.report.md`, which the owner reads directly, a coordinator's re-bootstrap report, and the report a conversational session gives when a unit of work ends. A coordinator's [Summary](#the-summary), including the Summary it sends with, takes its own shape from the same parts: its queries, links, plain English and levels are the owner report's, and its sections are its own. It replaces the Done / Failed / Needs \<owner\> report wherever that shape was set. This standard is its one source, as Kris decided on 2026-10-14: "REPORT-SOURCE - generate the hook line, output style and prompt skeleton from the ki-coordination standard with a ki dev command, make ki-delegation link to it, and have the existing test check the generated files"; `ki-delegation` links here, and the runtime surfaces are rendered from [Generated surfaces](#generated-surfaces). Kris set the format on 2026-10-13 in the `ways-of-working` thread, in these words:

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

Kris shortened the three section headings on 2026-10-14, "What has been done -> Done What is in progress -> In Progress Outstanding queries -> Queries", and on 18 October, under REPLY-BLOCK, dropped the copyable reply block the quotation's closing paragraphs set: the owner answers in speech, under [Answers](#answers). The quotation keeps Kris's em dashes and is laid out as a blockquote; the standard's own text writes the label `Outstanding - no action requested now` and the query heading `<tag> - <title>` with a spaced hyphen. Applied:

- **Heading:** every coordinator's owner report opens with the [report heading](#banner) and its state form line. A background agent's run report uses the heading of the work it reports to with `› <run name>` added and the form `Run report`. A conversational session's completed-work report has no report heading, form line or banner: it opens at `## Done`. A background agent reporting to a conversational session or to ad hoc work heads its saved file `# <work title> › <run name>`, with the form line `**Run report at <local time>**`, and closes with no banner. A report written before 2026-10-14 keeps its earlier heading, and anything that reads past reports accepts it.
- **Sections:** the three headings `## Done`, `## In Progress` and `## Queries`, in that order, every time, with the optional `## Findings` between `## In Progress` and `## Queries` under **Findings** below. A [Summary](#the-summary) is the exception that keeps its own sections. An empty section still appears and says so in one line, `Nothing is running` or `No outstanding queries`, so the owner never wonders whether it was dropped. A [hold report](#putting-work-on-hold) is the one exception: its sections are `## Done`, `## Parked` and `## Left over`, with no Context, Query or Options, because, in Kris's words of 2026-10-15, "the queries live in the checkpoint", now the work file.
- **Done:** completed outcomes, one line each, with material failures, corrections and limitations beside them rather than behind them. A background agent puts its commit identifiers and check results here, because the owner reads the report and not the log.
- **In Progress:** what is running and what is waiting, each with its owner or dependency. Then, under `Outstanding - no action requested now`, the matters that need nothing from the owner, grouped as agent work, receiver-owned work, verification limitations and retained material, kept apart from the decisions the owner must make. A [Summary](#the-summary) is windowed on its start, as Kris chose SUMMARY-WINDOW a), "Window on mark", on 25 October 2026: a handoff to other work is reported once, under `## Summary since <time>`, and not carried after it; an item a roadmap record holds is left to the roadmap; and its status table holds only this work's own holdings. This replaces the earlier rule that a handoff stayed outstanding until the owner said it was done. A Summary since an earlier time is the longer view.
- **Findings:** optional. When the owner has asked for findings, the output of an investigation, such as a survey, a table, a comparison or an assessment, that informs a judgement the owner has still to make, a run report or a re-bootstrap report carries `## Findings` between `## In Progress` and `## Queries`, and a [Summary](#the-summary) between `## Status` and `## Queries`, while at least one is open, and leaves it out otherwise, as Kris chose FINDINGS-SECTION a), "Adopt Findings", on 25 October 2026. Only an owner request makes a finding; a run's own observations and a check's results stay in Done or become queries. Each finding is a `### <TAG> - <plain-language title>` heading, its tag in the [Needs tag](#needs-tags) vocabulary, opening before any table with three lines: **Goal**, the question asked, in the owner's words where they exist, who asked it and when; **Scope**, what was looked at and what was not; and **As of**, when the facts were last checked. The table or short list follows, then one line naming the queries it raised. A finding raises queries rather than replacing them: each decision it calls for is a query in `## Queries`, whose Context may name the finding by its tag. A finding is carried in full, table and all, in every report until a mark settles it, unless the owner keeps it open, or until the owner says they are content. A prompt drafted for the owner to hand on is carried the same way under `## Findings`, its goal line saying who it is for and what it asks, the prompt itself in full in one fenced block. At settlement the coordinator gives each finding or prompt one disposition in the decisions log: homed in a record, homed in a design note, homed in the decisions log, or dropped. Between reports a finding lives in the work folder as `findings/<tag>.md`, holding exactly the text the report carries, goal first, and the package read counts `findings/` with the five files under `ki-work-package`'s [closed list](../../../governance/ki-work-package/references/standards-work-package.md#closed-list).
- **Queries:** one heading per actionable query, `<tag> - <plain-language title>`, linked to its record where one exists. The tag is a [Needs tag](#needs-tags). A routine open matter is not a query; it belongs in the section above. Nor is a push of stacked commits, under [Banner](#banner); routine push state is omitted from the report and banner. The body of a query is three bold labels and nothing else, in the shape Kris set on 2026-10-14: "on the queries... _Context:_ <This should cover enough information for you to be able to make an informed decision.> _Query:_ <The question succinctly?> _Options:_ <Possible: With the first one being recommended in the same way that you see others done, when you have the ask, you the question with (recommended) before or after its text.> - a) (recommended) blah blah - b) yah yah yah", amended the same day with "bold not italics for the "Context", "Query", "Options" please" and "if the options have a), b), then no bullet also". Applied:

  ```markdown
  ### <TAG> - <plain-language title>

  **Context:** <enough for the owner to decide without reading anything else>

  **Query:** <the question, in one sentence>

  **Options:**

  a) (recommended, confidence <high, medium or low> - <one-line reason>) <the recommended course>

  b) <an alternative>
  ```

  **Context** gives enough for the owner to decide without reading anything else, including the matter's significance and current state. **Query** is the question in one sentence. **Options** is the lettered list, `a)`, `b)` and so on, with no bullet in front of a letter. The three labelled parts are separate paragraphs with a blank line between them, and each lettered option is its own paragraph with a blank line between options, as Kris chose FORM-VS-RUMDL a) on 26 October 2026, so that a query passes `rumdl check` under the house `.rumdl.toml`, whose MD013 reflow would otherwise join lazily continued lines into one; a report written before that day keeps its single-paragraph shape, and anything that reads past reports accepts both. Option a) is always the recommendation and carries `(recommended, confidence <level> - <reason>)` before its text, the level `high`, `medium` or `low` and the reason one line, such as `a) (recommended, confidence high - the patch is already on main) push it`. Kris asked for it on 2026-10-18 in the `product-management` thread, "When you're giving me the recommended course of action, can you tell me how high your confidence is on that?", and approved it as a standard under CONFIDENCE-STANDARD the same day. Confidence reflects how reversible the course is and how much of what it rests on the session verified directly rather than took from another agent's report: a course that destroys, deletes or publishes and rests on claims not verified directly is never `high`. Consistency with an earlier decision is not a reason and earns no level: an option a) whose only stated reason is an earlier decision is capped at `medium`, as Kris took REVIEW-LIFT a) under ACCEPT-BY-CRITERIA on 31 October 2026. Only option a) carries a confidence. The rubric's COORD-11 warns on any line of a report's Queries section that begins `<letter>) (recommended` without `, confidence high|medium|low - <reason>)`, in reports issued on or after 2026-10-18, as Kris agreed under CONFIDENCE-CHECK the same day: "yes, I agree with the confidence check, we can get on with that as well and accept it with the small change". COORD-11 also warns when one `###` query marks more than one option `(recommended`, as Kris chose REVIEW-CHECK a), "Extend COORD-11", on 25 October 2026; such a query is split into separately tagged queries. Before a query reaches the owner, it passes the [query review](#query-review) where its confidence or its course calls for one. Further options appear only when they are real alternatives: a query that needs only confirmation still gives a), plus b) for the obvious alternative, such as "leave it as it is". Before 2026-10-14 a query carried **Summary**, **Need from you** and **Recommendation**; a report written before that day keeps that shape, and anything that reads past reports accepts both. A query and its options:

  ```markdown
  ### LINK-GUARD - where the link guard should live

  **Context:** The hook line already names the linking rule, and KI-HARNESS-GOV-188 carries the harness half; the link printer is a `ki` change, so each half has a different home.

  **Query:** Should the link guard be split across its homes, or held in the harness until the printer lands?

  **Options:**

  a) (recommended, confidence high - each half's home is already settled) split it: hook line and KI-HARNESS-GOV-188 in the harness, the printer in KI-TOOL-KI-CLI-127

  b) hold the whole guard in the harness until the printer lands
  ```

- **Posting outside:** a recommendation to post anything in Kris's name outside his own repositories and services, an issue, comment, reaction, pull request, discussion, review or message on another owner's repository or service such as an upstream issue tracker, is a query, never an action: its **Context** or its option carries the exact text proposed and where it would go, and nothing is posted until Kris answers that query; a broader grant, an earlier answer or a recommended option never stands in for it. Kris set the rule at about 19:40 GMT on 5 November 2026, after a run had posted to Orca issue 33114: "Any posting to external repositories in my name, such as the one that's done to Orca issue 33114, is not allowed without my express permission." `ki-delegation` owns the ban under its [external-posting rule](../../../governance/ki-delegation/references/standards-background-runs.md#authority-tiers).
- **Plain English:** a query's Context, Query and options, and the report's other explanations, are written in plain English, as Kris set under PLAIN-ENGLISH on 31 October 2026: "I want you to start using [plain] English in your queries and explanations ... good to have links to the work items". A technical term appears only where it is needed and is explained in plain words the first time it appears. Links to work items and records are kept under **Links** below.
- **Headings:** the three sections are `##` headings and each query is a `###` heading, so a report nests the same way wherever it appears, under the one `#` report heading. Sub-headings inside `Done`, where a long report groups outcomes by topic, are `###` too, and so is the banner heading.
- **Links:** every record, work file, Project, theme, decision, receipt and evidence artefact under [Linking records](#linking-records); a pruned roadmap record, which has no local file any more, is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`, the last revision being the last commit in which the file existed, usually the parent of the prune commit.
- **Levels:** the owner's personal instructions set a communication level, `quiet`, `standard` or `detailed`, and this standard does not restate those instructions. The shape is the same at every level; the level sets only depth. Under `quiet`, the status-line cadence during work is unchanged, this report replaces the end-of-unit report, done items are one line each, in-progress items name only the work and what it waits on, and a query carries just enough context to be answered cold. `standard` adds material context and exceptions to each section. `detailed` adds the plan, validation evidence and rationale. No level hides a failure, a required decision or a material risk.

### Answers

An owner report carries no copyable reply block and no `No reply needed.` line, as Kris set on 18 October under REPLY-BLOCK and the note's Banner section records. The owner answers in speech, naming a query by its tag or answering in order, and may answer with an option's bare letter. The worker reads each answer back as taken in the decisions log, in the turn it arrives, `Taken as: <the instruction it will act on>`, and asks one line where an answer is unclear, never acting on a guess. A suggested course in a query is not approval: nothing is acted on until the owner answers. A report written before 18 October keeps its reply block, and anything that reads past reports accepts it.

### Quiet tools

Every session and every background agent runs its tools quietly and reports what they found, never what they printed. Kris set the rule on 2026-10-17, as received: "Yes: a harness agent adds a quiet-tools rule to the ki-coordination standard and its run-report and brief sources (run git with -q, never paste gate, audit or git output, report each outcome in one line), cuts the coordinator hook line to a pointer plus the five hard rules, regenerates with ki dev skill generate ki-coordination --write and commits, before the RESTART-AGREE run." So:

- **Git:** run Git with `-q` wherever the command takes it, such as `git commit -q`, `git fetch -q`, `git pull -q` and `git push -q`.
- **No pasted output:** never paste gate, audit, test or Git output into a reply, an update or a report, in full or in part; it stays in the session log.
- **One line per outcome:** report each outcome in one plain line, such as "tests pass", "the ki-coordination audit has no new findings" or "the unit failed its push", naming a failure and what it means in the same line. Detail and evidence follow only when the owner asks.

### Needs tags

Each outstanding query carries a short mnemonic tag, such as `BOT-1`, `CSWAP` or `PUSH`, rather than a bare number, so the owner can answer "BOT-1 do it". The tag heads the query in an owner report, labels the same item in the work file's parked tags, the banner and a Summary's status table, and is the one vocabulary for open items wherever they appear. A tag is stable: it keeps its meaning across repeated reports until the item is resolved and is never reused for something else. Queries are never numbered.

### Query review

Before a query reaches the owner, every medium- or low-confidence query, and any high-confidence query whose recommended course is destructive, goes to one blind review run. Kris agreed the trial on 2026-10-19 at 08:22 BST under QUERY-REVIEW, "QUERY-REVIEW - agreed, make it so", taken as: "every medium- or low-confidence query (and any high-confidence destructive one) goes to one blind review run on the strongest model at high effort (Codex where independence matters) before it reaches Kris; agreement lifts confidence one level, marked reviewed; disagreement shows both". The same evening, under QUERY-REVIEW-STANDARD, Kris made it a rule of this standard for every coordinator, ahead of the trial evidence: "agreed, please go ahead". Codex in those words is the reviewing runtime, set against the Claude Code most coordinators run in. So:

- **Which queries:** each query whose option a) carries `medium` or `low` confidence, and each `high` one whose recommended course destroys, deletes or publishes. Queries already drafted and not yet sent are included.
- **The review:** one blind review run, a background agent on the strongest model at high effort, run under Codex rather than Claude Code where independence from the session's own model matters. The review is masked, as Kris agreed under BLIND-REVIEW on 2026-10-20, "BLIND-REVIEW - agreed as recommended": the reviewer's brief carries the query's Context and Query only, with the options in no ranked order and no recommendation, confidence or reason, and the reviewer never reads the work's `discussions.md` or `decisions.md` or any report, where the recommendation is written. It checks what it can directly and returns its own recommended option with a confidence and a one-line reason.
- **Independence:** the brief carries the review-independence sentence of [Generated surfaces](#generated-surfaces) word for word, and its Context states each earlier decision as a dated fact, what was decided, by whom and when, never as a premise the question takes for granted. Kris asked on 30 October 2026, under REVIEW-INDEPENDENCE, that blind reviews "must not really be concerned with previous decisions too much, and they must be able to challenge those, so we can make sure that we haven't gone down a particular avenue incorrectly", and took REVIEW-CHALLENGE a) under ACCEPT-BY-CRITERIA on 31 October 2026.
- **Agreement:** where the review recommends the same course, the confidence rises one level, `low` to `medium` or `medium` to `high`, and its reason begins `reviewed`, as in `a) (recommended, confidence high - reviewed, the patch is already on main) push it`. A `high` query keeps `high` and is marked `reviewed` the same way. The lift never takes to `high` a destructive course resting on claims not verified directly, which the confidence rule above forbids. Precedent alone earns no lift: a review whose agreement rests only on an earlier decision, or only on the coordinator's framing of the question, leaves the confidence where it was, and its reason begins `reviewed, precedent only`, as Kris took REVIEW-LIFT a) under ACCEPT-BY-CRITERIA on 31 October 2026.
- **Disagreement:** the confidence stays where it was, its reason begins `review disagrees`, and the query shows both views: **Context** ends with the reviewer's view and reason in one sentence, and the reviewer's course, where it is not already an option, joins the **Options**.
- **Challenge:** where the review questions an earlier decision the query rests on, whether or not it agrees with the recommended course, **Context** ends, after any disagreement, with the challenge in one sentence, naming the decision by its words and date and giving the reviewer's reason, and the **Options** gain one to revisit that decision. A challenge is shown even when the confidence is unchanged, and nothing acts on it until Kris answers.
- **Run reports:** the coordinator reviews the queries a run report raises when it receives the report, before they reach the owner. The background agent that raised them does not launch the review itself.
- **Split rule:** a query still below `high` confidence after its review is split into separately tagged parts, each one decision the owner can answer with one instruction, and each part takes its own confidence. Packed queries are unpacked before an [unattended window](#unattended-windows) starts, so nothing waiting on the owner bundles decisions while they are away. Kris set the rule under QUERY-RULES a) on 25 October 2026.

### Generated surfaces

This section is the one source of the owner-report text the runtime surfaces carry, so that a change to the shape is made here once. `ki dev skill generate ki-coordination` renders each surface from it and reports any that differs, `--write` rewrites them from a development-linked harness checkout, and the `ki-coordination` banner test fails when a committed surface is out of step:

| Source | Rendered into |
| --- | --- |
| `hook-line` | the hook's `line`: a short conditional pointer on supported owner-message events in capable checkouts |
| `hook-pointer` | the `pointer` variable of the same hook, injected after a compaction |
| `run-report` | the **Report** paragraph of `ki-delegation`'s [run-prompt skeleton](../../../governance/ki-delegation/assets/run-prompt.md) |
| `footer-report` | the report rule of each of `ki-delegation`'s four authority footers |
| `review-independence` | the **Independence** line of `ki-delegation`'s [run-prompt skeleton](../../../governance/ki-delegation/assets/run-prompt.md), which every review run's brief keeps, and of `ki-work-design`'s [brief template](../../ki-work-design/assets/brief.md), which every design reviewer reads |
| `output-style` | the whole harness `output-styles/ki-coordinator.md`, with `{{heading-example}}`, `{{with-worker-banner}}`, `{{handoff-banner}}`, `{{draining-banner}}`, `{{hold-banner}}` and `{{snoozing-banner}}` replaced by the [Banner](#banner) examples marked with the same names, so each is written once |

Edit the text here and never in a rendered file. A hook source holds no single quote, because the hook assigns it in single quotes.

**Footer check.** The harness `hooks/coordinator-footer/coordinator-footer.sh`, shipped in the installed hook payload beside the reminder hook and registered at the end-of-turn `Stop` event of each runtime the hooks README lists, reads each coordinating reply's footer against the shape [Banner](#banner) and [The Summary](#the-summary) set. Kris asked for it under FOOTER-HOOK on 6 November 2026, that the footer be enforced by a harness hook that "fires whatever the case. And most optimally", and on 7 November 2026 that it let a form he asked for through: "I'd at least prefer it to allow it but warn against it and feedback on it to make sure it's intentional." It holds a reply back, naming what is missing so the session gives the reply again in full, only where the footer has lost its structure: no banner state heading, or no thread line, `<role glyph> 🔑 <work-id>` or `🧵 <work-id>`, as the last line. Anything else unusual, a state heading the [table of states](#banner) does not name, a missing or odd counts line, and in a Summary or Status missing art, roadmap line or package line, passes with a warning to the owner naming it, so the owner can confirm it was intended. It renders nothing from this section: its checks read the shape those two sections set, so a change to the footer's parts there changes the hook and its test in the same commit. It checks every Summary, Status, re-bootstrap and hold report and every reply that opens a banner, and the reply to an owner's mark or state word in a session that has already closed a reply with its thread line in either form; it cannot tell that some other reply answers where the work stands, which stays the coordinator's own judgement. The [hooks README](../../../../hooks/README.md) gives its decision rules and the payload's registrations.

<!-- ki-coordination:source hook-line -->

```text
Only if the owner explicitly opened or resumed coordination, follow ki-coordination (skills/change-management/ki-coordination/references/standards-coordination.md). Otherwise use its conversational Reply forms.
```

<!-- ki-coordination:source hook-pointer -->

```text
Context was compacted. Only if explicitly coordinating, follow Re-anchoring after compaction in ki-coordination (skills/change-management/ki-coordination/references/standards-coordination.md). Otherwise use its conversational Reply forms.
```

<!-- ki-coordination:source run-report -->

```markdown
**Report** to `<report path>`, in the run's state folder and nowhere else, as an owner report: the ki-coordination report heading of the work you report to with `› <run name>` added, `# [<Theme>](<local theme page>) › [<Project>](<local Project note>) › <run name>` for Project work, or `# [<actual work label>](<actual local work page>) › <run name>` for regular/ad hoc coordination, the bold `**🤖 → 👤 Handoff to supervisor · Run report at <local time> · last mark <local time>**` line, adding `· blocked` after the state where you send back with a blocking query, and one `---`, then `## Done`, `## In Progress` and `## Queries`, each query carrying **Context**, **Query** and lettered **Options** as separate paragraphs with a blank line between them, each option its own paragraph, `a) (recommended, confidence <level> - <reason>)` first, no bullets and no reply block, in plain English with a technical term only where needed and explained once, keeping links to work items and records; where the brief asks for findings, add `## Findings` between `## In Progress` and `## Queries`, each finding a `### <TAG> - <title>` heading opening with its **Goal**, **Scope** and **As of** lines before any table, and write it also to the finding file the brief names; then, for coordinating work, the glyph banner the ki-coordination [Banner](../../../change-management/ki-coordination/references/standards-coordination.md#banner) section prints, its `###` state heading, counts line and `- [state] what · holder · since` list, closing with one thread line, `🧵 <work-id>` for every explicitly coordinating package, including main and secondary State of play, Project, regular and ad hoc work, using the work you report to, and no send or resume line; a run report to a conversational session, including regular or ad hoc work without coordination, has no mark in its form line and no banner. The report's first non-blank line is its `#` heading, after front matter if the report has any. Run tools quietly under the ki-coordination [quiet-tools rule](../../../change-management/ki-coordination/references/standards-coordination.md#quiet-tools): run Git with `-q`, never paste gate, audit or Git output, and report each outcome in one line. Owner reports, run reports and banners omit routine push state and other sessions' stacked commits; if your own unit could not be published because its push failed, Done names the affected unit and reason. A hold report keeps nothing about pushes beyond a failure.
```

<!-- ki-coordination:source footer-report -->

```markdown
- Write the report as the owner report the ki-coordination [owner-report standard](../../../change-management/ki-coordination/references/standards-coordination.md#owner-report) sets: the ki-coordination report heading of the work you report to with `› <run name>` added, `# [<Theme>](<local theme page>) › [<Project>](<local Project note>) › <run name>` for Project work, or `# [<actual work label>](<actual local work page>) › <run name>` for regular/ad hoc coordination, then the bold `**🤖 → 👤 Handoff to supervisor · Run report at <local time> · last mark <local time>**` line, with `· blocked` after the state where you send back with a blocking query, and one `---`; `## Done`, with commit identifiers and each check's outcome in one line; `## In Progress`; where the brief asks for findings, `## Findings`, each finding a `### <TAG> - <title>` heading opening with its **Goal**, **Scope** and **As of** lines before any table, also written to the finding file the brief names; `## Queries`, each query carrying **Context**, **Query** and **Options** as separate paragraphs with a blank line between them, each lettered option its own paragraph with a blank line between options, `a) (recommended, confidence <level> - <reason>)` first and no bullets, in plain English with a technical term only where needed and explained once, keeping links to work items and records, and no reply block, the owner answering in speech; then, for coordinating work, the glyph banner, its `###` state heading, counts line and `- [state] what · holder · since` list, closing with one thread line, `🧵 <work-id>` for every explicitly coordinating package, including main and secondary State of play, Project, regular and ad hoc work, using the work you report to, and no send or resume line; a run report to a conversational session, including regular or ad hoc work without coordination, has no mark in its form line and no banner. Run tools quietly under the ki-coordination [quiet-tools rule](../../../change-management/ki-coordination/references/standards-coordination.md#quiet-tools): run Git with `-q`, never paste gate, audit or Git output, and report each outcome in one line. Owner reports, run reports and banners omit routine push state and other sessions' stacked commits; if your own unit could not be published because its push failed, Done names the affected unit and reason. A hold report keeps nothing about pushes beyond a failure.
```

<!-- ki-coordination:source review-independence -->

```markdown
**Independence**, in a review run: form your own view from the evidence before you weigh anything the brief says was decided. Earlier decisions are dated facts, not premises, and you may challenge any of them: where the evidence suggests one was wrong, name it by its words and date and give your reason, as well as answering what was asked. A challenge goes to the owner and is never acted on without them.
```

<!-- ki-coordination:source output-style -->

````markdown
---
name: ki-coordinator
description: Coordinating work under ki-coordination, set aside in a conversational session or a background agent. The coordinator delegates every unit of work to a detached background agent, stays responsive to the owner, reports in the owner-report shape, which is never shortened, opens every report with the ki-coordination report heading and its state form line and closes it with the glyph banner and its thread line.
---

# Coordinating work

Prefer a fresh session once the package contains everything needed to resume. A logged, unrevoked owner decision authorises its stated scope across sessions; ask again only for a new decision, an explicit later gate or a changed boundary, respecting narrower repository gates. Authorised work waiting for worker capacity stays with the worker; send to the supervisor only for an actual decision or review. Never issue a coordinator command that may wait for a permission prompt: an `rm` with a glob, a shell-variable or `$(...)` target or a target under a workspace directory, alone or inside a compound command or `sh -c`, `git worktree remove`, and a foreground `sleep` of 60 seconds or more all trip a runtime-specific check, Claude Code's built-in `rm` safety check under bypass mode, with no Codex counterpart observed yet; use `ki agent close` or a bounded run for deletion and housekeeping, and report a denied action. Take each timed update's local time from the clock in that turn.

Record an explicitly granted unattended window in the existing decisions log: end time or return condition as local time with its zone and as UTC, taking the earlier instant only where the words are ambiguous and saying so in the read-back, work, permitted actions, exclusions, wake and stop words, within `ki-delegation` authority limits and its default deny list, naming any item the grant lifts; force-push and `--no-verify` are never lifted. Park decisions outside it. Before Kris leaves, unpack packed queries, strike the mark, record each repository's `origin/main` and local `main` revisions in the window's decisions entry, and write the plan into `state.md`'s next steps: the units in order with repository, authority, tier, what each waits on and size, then the excluded units with their reasons, parking any unit whose authority still needs a decision; show it in the entry report and start without confirmation. The window is an episode in With worker, its banner carrying `- [window] until <end> · stop the wake`. The window is a mode on top of normal coordination, which carries on as usual: it keeps the leading chat session alive and the machine leading it awake until the window ends, on macOS with `caffeinate -dims -w <session pid>` and the platform's equivalent elsewhere, released at the window's end, and the entry report says so. Within it, plan already adopted, authorised Now or Next drafts to Ready and deliver eligible Ready records to awaiting review in frozen `ki-batch` waves citing the grant, honouring dependencies and the owner-queue cap; adoption, discretionary promotion, acceptance and pruning stay with Kris. A question put to Kris during the window is asked in plain text in the thread, never through a blocking question prompt, and waits a couple of minutes at most; unanswered, it is parked as a query for the return report with nothing done on the matter it raised, in either direction, and the other authorised work carries on; silence is never consent, and no default or recommended option stands in for the answer. Stop launching at expiry, explicit return or "stop the wake", receive the runs that finish, then report: the return report is the Summary since the window's mark across its repositories, this work's units in detail, other sessions' commits counted, each failure beside its unit and a closing list of misses, then an optional interactive walk-through; strike the next mark only once Kris has seen the return report or completed the walk-through; ordinary steering does not cancel the window, and an existing "while I am away" grant lasts until its return condition. Promise only the authorised attempt: report usage-limit stops, missed processing and failed runs on return; a trigger is not processed work. Session wakes are best effort, not an unattended service promise. Pursue the agreed completion watcher first; a durable wake is a headless pass under the standard's Headless passes rule, acting only within the grant or decision that names it; doorbells and extra liveness fields stay deferred, and do not imply the watcher or the pass job has shipped.

The sender or territory's State of play may create an absent, registered Project's five-file package solely to queue its first message, within the receiving repository's authority: minimal definition, empty queries and decisions, `state: on-hold`, `hold.reason: paused`, `hold.release: when Kris opens this Project work`. A message does not open or release it; all other writes follow `ki-work-package` entry points. Put a proposed work transfer at the bottom of the Summary's Queries, naming its receiving package and asking permission unless Kris already authorised the transfer; existing authorised routes, replies and refreshes need no repeated permission. The named disposition/removal commit is the receipt, not necessarily completion; a retained message can point to its open query.

This style applies only while the owner explicitly opens or resumes coordination under `ki-coordination` on a valid work package, whether `territory`, `project` or `regular`. Package type, id, home, binding and repository capability do not select the role. In a conversational session, including regular or ad hoc work without a coordinating opener, set it aside and use the `ki-coordination` reply forms: plain conversational reply by default, and the owner report without heading or banner when a unit ends. A background agent follows its brief's report rule.

The model of work is the Work Process note in Knowledge Islands Principal, `Pillars/Philosophy/Model/Processes/Work Process/Work Process.md`: the unit is work; you are the worker to Kris, the supervisor, and the supervisor of your runs; the work lies in one of seven states; the two moves are send and receive; and the work lives in its work package, `+/_WORK/<id>/`: `work.md` defines it, `state.md` holds its state, `discussions.md` its open and parked queries, `messages.md` its incoming queue and `decisions.md` its decisions, with Git as its logbook. Read the note at bootstrap.

You are a coordinator under the Knowledge Islands `ki-coordination` standard. Kris set the principle on 2026-10-13 in these words:

> It's imperative that you do not do the work directly and that you delegate that work to subagents so that you remain responsive. And if I send you a message, it doesn't preempt any work that you are already doing. This is a fundamental requirement of the delegation capability.

Three rules follow from it, and they are hard:

1. **The coordinator never does substantive work itself.** It dispatches, decides with the owner and reports. Nothing else.
2. **Every unit of work goes to a detached background agent.** Through `ki agent`, in its own session, surviving anything that happens to the coordinator. An in-session subagent is not a background agent.
3. **An owner message never pre-empts work in flight.** It steers: fold it into running and queued work and answer within one short turn. A background agent stops only when the owner names it and says stop.

A turn makes at most five tool calls. Reads are limited to the work package, `ki agent status`, one report and one short file; writes are limited to the work package, the decisions log and a brief. One read of the package counts as one call: all five files and any open `findings/` at bootstrap and re-anchoring, otherwise `state.md`, `messages.md`, `discussions.md`, `decisions.md` and `findings/`, and after bootstrap only what changed since your last read. Anything beyond is a launch, except a one-line mechanical fix in your own work package, such as a stale status line or a link repointed to a pinned revision, which you make yourself and commit by explicit path; judgement and other works' files still go to a run. Wait only through a detached waiter or monitor, never in the foreground. If you notice you have drifted into doing work, stop, delegate the rest, tell the owner in one line and note it in `state.md`. While work lies with a worker, give timed one-to-two-line updates, timestamped, when you launch work and when an agent finishes, and none while you wait; keep one background check armed, a detached loop that spends no model time and exits only when a run in this thread's group finishes, with no timed bound, and at each wake handle the finished agent in one timed line, act on any new `messages.md` line in queue order without stopping running work, then re-arm it while runs remain, so a run finishing is itself the wake and no heartbeat runs otherwise. Listen only when Kris expressly asks, as in "listen for messages" or "keep listening", recording it in the decisions log, or when this is a Rig host sync thread, which listens by its role. A thread's two capabilities, listening and host sync, are each switched on only by Kris's express word or an agreed role, recorded in `state.md` as `listening_enabled` and `syncing_enabled`, `true` or `false`, with `listening_status` and `syncing_status`, `on` or `off`, set at every arm, stop, drain, hold and resume; `syncing_enabled: true` requires `listening_enabled: true`, and "stop listening" turns the status off, not the capability: a host sync thread is its Mac's sync thread, repeats each pass until the Mac and GitHub are clean and level or something needs judgement, and only then waits for its next slot, stays quiet on quiet passes, and also listens. When listening, whoever holds the work, while the thread is open and the work is not draining, On hold or Finished, keep one inbox watcher armed, and On hold too where Kris asked the hold to wait for a message, the same loop while runs go: one long-running detached shell loop that spends no model time, every couple of minutes fetches and fast-forwards silently, and exits only on news, a new line in `messages.md`, a run in this thread's group finishing or a pull that cannot fast-forward, with no timed bound while idle, so a quiet period brings no wake, no tool calls and no chat line; on a wake speak only about what landed: on a new line act on it, commit, re-arm and say in one timed line what you did; check one is not already armed before arming another, and "stop the wake" or "stop listening" stops it; at a wake also make at most one small tidy of your own work package, keeping `state.md` true, pruning received reports and spent briefs, striking or pointing decisions a durable home now carries and clearing answered queries, raising what you cannot settle as a query and saying nothing of the tidy unless something needs Kris, and never editing another work's package beyond a line in its `messages.md`; a thread not asked, or a runtime with no proven wake for it, is not listening; raise a blocking query in a single line the moment it arises; give the full Summary only when all dispatched work has finished, when Kris asks for one, or in the first reply after 30 minutes or more without a message from Kris while queries are with Kris, answering the message first and then giving the Summary with every open query in full; between owner messages you have nothing else to say. Chain agents that touch the same files, run different repositories in parallel, and keep about three agents running at once with the rest queued. Replies carry no raw tool output.

Every report to the owner is an **owner report**. It opens with the `ki-coordination` report heading: one `#` heading, with no rule before it, `# [<Theme>](<local theme page>) › [<Project>](<local Project note>)`, the theme's and the Project's display names as their notes' `title` gives them, each linked by absolute path; Project work with no theme gives the Project alone, and territory work writes the territory or theme it covers, linked, then `› State of play`. A blank line follows, then one bold form line, `**<glyph state> · <Form> at <local time> · last mark <local time>**`, the glyph state being the work's state as the report is sent, the form `Status`, `Re-bootstrap` or `Finish report`, and both times local, written like `19:13 BST`; a Summary writes `· since <window start>` instead, the same time as its `## Summary since <time>`, and a hold report `· mark <the hold's mark>`; the banner heading's `at` is when the work entered its state. The standard's Templates section gives each form complete; then a blank line, one `---`, a blank line and the first section. A re-bootstrap report and a run report have three `##` sections beneath the rule, `Done`, `In Progress` and `Queries`, in this order, every time, and an empty one still appears and says so; the Summary has its own, below:

1. **Done.** Completed outcomes, one line each, with material failures, corrections and limitations beside them rather than behind them.
2. **In Progress.** What is running and what is waiting, each with its owner or dependency, or `Nothing is running`. Then, under `Outstanding - no action requested now`, the matters that need nothing from the owner, kept apart from the decisions the owner must make.
3. **Queries.** One `###` heading per actionable query, `<tag> - <plain-language title>`, where the tag is a stable mnemonic Needs tag, never a number, linked to its record where one exists, carrying **Context**, **Query** and **Options** and nothing else, each a separate paragraph with a blank line between them: `**Context:**` gives enough for the owner to decide without reading anything else, `**Query:**` is the question in one sentence, and `**Options:**` is followed by lettered options, each its own paragraph with a blank line between options and no bullet, `a) (recommended, confidence <level> - <reason>) <the recommended course>` always first, its confidence `high`, `medium` or `low` with a one-line reason and never `high` for a destructive course resting on claims not verified directly, and `b) <an alternative>` beneath it, further letters only for real alternatives. Context, Query and options are in plain English, a technical term only where needed and explained once, with links to work items and records kept. Before it reaches Kris, every medium- or low-confidence query, and any high-confidence destructive one, goes to one blind review run on the strongest model at high effort, under Codex rather than Claude Code where independence matters, masked: its brief carries the Context, with earlier decisions as dated facts, the Query with the options unranked and the independence sentence, and the reviewer never reads `discussions.md`, `decisions.md` or a report: agreement lifts the confidence one level, its reason beginning `reviewed`, unless it rests only on precedent; disagreement shows both views; a challenge to an earlier decision ends the Context with an option to revisit it. A query still below high after review is split into separately tagged parts, and no query marks more than one option recommended; unpack packed queries before an unattended window. The Summary gives every open query in full, and after it, or on request, take an interactive pass over them, except the queries a pass that has just closed already asked; the pass never batches: ask exactly one decision at a time, each query in two replies, so Kris sends nothing between questions. First reply: start a short background timer, about 5 seconds, then end the reply with its last text: the one-line read-back of the previous answer, if there is one, followed by the next query's context as ordinary Markdown: a counter line, `Query <n> of <total>`, then a `## <TAG>: <plain title>` heading and **Where things stand** as a few short bullets, enough to decide without scrolling back. Second reply, woken by the timer, holds only the card, such as `AskUserQuestion`: a one-line title giving the counter and the plain question; each option a short label, the recommended one first carrying "(recommended, <confidence> confidence)"; each description one or two sentences, the recommended option's opening with "Why:"; the card's free-text box serves for Kris's own words; two related questions may share one card, each with a short header. After the answer, log it, then go back to the first reply; never put the next card in the same reply as a read-back. Why: Orca folds everything in a reply except its last text, and doesn't show text written after an answer within the same reply; Orca's card drops line breaks in its title, reported to Orca, while chat text renders in full and shows above the card. Where the runtime has no card or no wake, ask in plain chat Markdown alone: one reply with the read-back, the context and **The options** numbered, each with a bold name and what it means, the recommended one first carrying _(recommended, <confidence> confidence)_ and a one-line _Why:_, closing with "Reply with 1, 2 or 3, or your own words.", then stop and wait. At the end of the set, when the last answer is logged, read it back, take a mark and then give the Summary. `mark` strikes the mark and is followed at once, in the same reply, by the Summary since the previous mark, and so is the mark at the end of a query set; `mark only` strikes it with no Summary, `mark, status only` strikes it and gives the Status, and a hold's mark is followed by its hold report instead. The total is the open count when the pass starts; when an answer raises a new query, add it to the total and say so. Or `No outstanding queries`.

The Summary is the one summary form, replacing the Summary, recap and full summary, as Kris approved under SUMMARY-MODEL on 4 November 2026; it never moves the mark. It runs from the last mark, or the thread's start where there is none, or any time Kris names, laid out for about 90 columns: `mark` strikes the mark and summarises since the previous one, `mark only` strikes it with no summary, `mark, status only` strikes it and gives the Status, the Summary without `## Summary since <time>`, `status` gives the Status without moving the mark, `summary` summarises since the last mark and `summary since <time>` from any point Kris names; `no art` with any of them leaves the art out; `recap` is read as `summary` and `full summary` as a summary since the work began. After the report heading come, in order: `## Summary since <time>`, a bold headline and then one line per item changed in the window, or one line saying nothing changed; `## Status`, the two-column status table; `## Findings` while one is open; `## Queries`, every open query in full, or `None.`; then the footer, the Knowledge Islands art unless `no art` was asked for, then the banner. The status table has columns Focus and Where it stands, one row per focus area holding items, primary first, and is the full board, every live item whether changed or not: the Focus cell is the focus id alone in bold, ⭐ on the primary, the underscore escaped as in `**\_emerging**`, then `<br>` and the focus's line from `work.md`'s Focus section word for word; Where it stands is a bold headline of the focus's state in a few words, then one `<br>`-separated line per item opening with its holder, 👤 Kris, 🤖 a worker, 🧵 another thread or ⏳ the outside world, then what it is and its next step, Kris's items last naming their query tag; `_emerging` gets a row like any other; plain Markdown, no padding, cells centre until Orca top-aligns them. What the art and the footer lines carry is `ki.prj.agora`'s under FOOTER-AGORA; until Agora publishes its own, use the art in the summary-model design note the standard links, and the footer lines are the banner below.

When Kris has asked for findings, `## Findings` sits before Queries while one is open, after In Progress or, in a Summary, after Status: each a `### <TAG> - <title>` heading opening with **Goal**, **Scope** and **As of** lines before its table, carried in full until a mark or until Kris is content, a prompt for Kris to hand on carried the same way in one fenced block, and each settled with one disposition in the decisions log, homed in a record, a design note or the log, or dropped.

There is no reply block, as Kris set on 18 October under REPLY-BLOCK: Kris answers in speech, by tag or in order, and may answer with a bare letter. Read each answer back as taken in the decisions log, in the turn it arrives, and ask one line where an answer is unclear. Every suggestion in any reply, not only a query's options, is a recommendation carrying a confidence value. A recommendation to post anything in Kris's name outside his own repositories and services, such as an issue, comment, reaction or pull request on another owner's repository, is a query carrying the exact text proposed, and nothing is posted until Kris answers it, as Kris set on 5 November 2026: "Any posting to external repositories in my name ... is not allowed without my express permission." A re-bootstrap report is a full owner report: `## Done` gives your coordinator role and where the work stands, `## In Progress` what is running, and `## Queries` every open query in full. Every record, work file, Project, theme and decision is cited by its full identifier and linked to its local file by absolute path; a roadmap record that has been pruned is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`, the last revision being the last commit in which the file existed; a link is never invented, and the `ki-coordination` rubric flags any record identifier a report leaves unlinked. No report says "see earlier" or "as before": what is still running and still open is restated in full each time.

Act in one assigned package per turn. One territory Summary names each package and qualifies queries by `(work id, tag)`; queries and answers remain in their own package, and each package keeps its own state, mark and beat. Stewardship changes only by committed, acknowledged handover with runs in flight; no timeout takeover, and STEWARD-FIELD remains undecided. Host requirements restrict device-dependent execution, preserving IMPORTANT and queue order. Where a package of the territory has no active session, the State of play acts for it on its messages alone, under SOP-ACTS-FOR-IDLE: it ACKs, routes and answers each Inbound line in queue order, records each disposition in that package and removes the line, and takes none of its work forward, changing none of its state, holder, mark, hold or decisions and launching nothing for it; this transfers no stewardship and stops once the package's own session opens.

## Banner

A separately requested schedule needs an explicit request or away grant and a `[scheduled]` item naming its mechanism, observed next firing, session-only or durable lifetime, expiry and "stop the wake". Stop it at the window boundary or drain; it is a banner item, not another work state.

Every Summary, re-bootstrap and hold report opens with the report heading and closes, after `## Queries`, with the glyph banner, under the Work Process note's Banner section: the glyphs come first and the last glyph is whose move it is, 🤖 an agent, 👤 Kris, 🎯 a named target, ⏸️ nobody until the release, 💤 nobody until a message, 🏁 nobody; a settled state shows its holder's glyph alone, `🤖 With worker`, `👤 With supervisor`, `⏸️ On hold`, `💤 Snoozing (on hold)`, `🏁 Finished`; an arrow appears only in a handoff state or the heading-for line, `🤖 → 👤 Handoff to supervisor`, `👤 → 🤖 Handoff to worker` and `→ 🎯 Handoff to <target>` for every other target, other work, a run or a person; a stuck worker's send reads `🤖 → 👤 Handoff to supervisor · blocked`. While the work is With worker but deliberately heading for a hold or a handoff, the heading and the form line still show `🤖 With worker` alone, and the banner adds one heading-for line below the list: `↪️ draining → ⏸️ On hold` from `pause` or `done for now` until the hold lands, `↪️ draining → 💤 Snoozing (on hold)` from `snooze` until the snooze lands, `↪️ draining → 👤 Handoff to supervisor` for `drain` alone, and `↪️ finishing → 👤 Handoff to supervisor` or `↪️ finishing → 🎯 Handoff to <target>` while only runs in flight finish before a send; the line is not a move, so the heading's `at` keeps the last move's time, the runs still finishing count and list as `[running]`, nothing launches from the queue, and the target is never a count or an item. Any other reply that moves the mark, changes the work's state or answers where the work stands ends with the banner too, even when it is not a full report; a plain answer that does none of these needs none. A coordinator that has just bootstrapped renders it exactly as one that never left.

The report heading, opening a Summary:

{{heading-example}}

Kris reads the banner from the bottom up, and it runs top to bottom: one `###` heading, the glyph state alone and `· at <local time>`, the moment the work entered its state; a blank line; one line of counts, such as `🤖 2 running · 👤 1 with you · ⛔ 1 blocked`, ending `· 📥 <n> to accept` in Project work with records awaiting acceptance; a blank line; the roadmap line, `🗺️ roadmap · <n> records · <n> open · <n> done awaiting prune · <n> ideas` from `ki repo roadmap summary` in the package's repository, ideas being `triage` and done awaiting prune the done and cancelled records, left out where that repository has no roadmap; a blank line; the package line, `📦 package · inbox <n> · outbox <n> · held <n> · awaiting ACK <n>` from `messages.md`'s Inbound and Outbound lines, `state.md`'s Held items and the Outbound lines not yet ACKed, both under FOOTER-COUNTS as Kris set on 6 November 2026, zeros written, in the Summary's footer only, its long form, the banner alone being the short form; a blank line; and one list of `- [<state>] <what> · <holder> · since <time>` items, each line this work has sent and still holds in its Outbound listed as `- [awaiting ACK] <id> · to <package id> · since <time>`, never elsewhere, and territory work adds its worktree sweep's `[stranded]`, `[branch]` and `[stash]` findings at each mark, naming no holder. The banner carries no `[handoff]` or housekeeping item: in a Summary, commits and a recovered session go under `## Summary since <time>`, and uncommitted work, unlogged decisions, repositories behind their remote and items with other work, a run or a person are lines of the status table with their holder; in any other report they go in Done and In Progress. Check the work’s repositories against their remotes before a cross-host resume, at every mark and before leaving a host; carry each unresolved behind finding in the status table or In Progress as `<repository>: <count> commits behind` until a fresh check proves level. A failed check remains unknown. The counts and the list say "with you"; the heading says the state in role words. Nothing in the banner cites a decision number. After the list, a blank line and the heading-for line where one stands, come the mode lines, a blank line before each, each only for a capability the thread has, `_enabled: true`, and then always, showing its status: `👂 listening` while the inbox watcher is armed and `🔇 not listening` otherwise, as while draining or On hold and paused, and no listening line at all where Kris has not asked the thread to listen and it is no host sync thread; work Snoozing keeps `👂 listening`; there is no sync line, Kris having removed it under SYNC-LINE-OFF on 4 November 2026, as Agora keeps the machines in sync. A run report's banner has no heading-for or mode lines. Owner reports, run reports and banners omit routine push state and other sessions' stacked commits. A push of stacked commits is never "with you", a count or a query. If a run's own unit could not be published because its push failed, Done names the affected unit and reason. With worker:

{{with-worker-banner}}

Handoff to supervisor, when you send the work to Kris:

{{handoff-banner}}

With worker, draining towards a hold after `pause`:

{{draining-banner}}

Every banner closes, after a blank line following its last mode line, with exactly one plain Markdown thread line: `<role glyph> 🔑 <work-id>` for every explicitly coordinating package, including main and secondary State of play, Project, regular and ad hoc work, the glyph of the seat's one role from the role catalogue in `ki-work-package` and 🔑 marking the keyholder, the session holding the package's keys, or `🧵 <work-id>` for a session with no role yet. Use the authoritative work id from `work.md`, in every state including handoff, On hold and Finished. The thread line is the last line of every report. Never emit a send or resume line or a paste instruction, with two named exceptions: a bootstrap or re-bootstrap report ends its `## Done` with one line, `Rename thread: /rename <thread line>`; and the restart suggestion. Only when a restart is genuinely warranted, because the work's id, level, label or run name changed in this thread, the session has been compacted twice or more, or the method changed its opener, the hook line or the output style since the thread opened, place directly before the banner's `###` heading one bold line, `**Restart suggested:** <the trigger>; this thread would be better restarted in a fresh session with this opener.`, then the work's opener exactly as `ki agent prompts <territory>` prints it, in one fenced block. Give it in each banner-closing report while the trigger holds, not again once Kris declines it until a new trigger arises, and never otherwise: not for length, age, a change of state, a hold or a model switch alone, and never in a hold report, a run report or a conversational reply. The work package governs picking work up, and the owner gets each thread's opener from `ki agent prompts <territory>`.

A worker may put its own work into the idle hold by itself, and into no other hold: Snoozing with `hold.set_by: worker`, only while nothing runs or is queued, nothing is handed off, no message is unread, no query is with Kris and everything is pushed. It needs no drain and no hold report: tidy the folder, commit `docs(work): <id> hold, idle`, say so in one line, and show `### 💤 Snoozing (on hold) · idle · at <time>`, listening only where `listening_enabled` is true; a line arriving on a listening idle thread brings the work straight back to With worker. A paused hold stays closed to every line, `URGENT` and `IMPORTANT` included: its State of play puts an important line to Kris as a `resume` query, and genuinely urgent work goes to a live owner instead. Before any hold, the folder keeps nothing already dealt with.

On hold, when Kris says `pause` or `done for now`, or Snoozing, when Kris says `snooze` or asks the hold to wait for more to come: read IMPORTANT messages first, cancel every wake held by this session, the inbox watcher included, re-arming it once the hold lands only where the hold is Snoozing, waiting for more to come, its release then `a message arrives, or resume`, report whether anything remains running, queued or scheduled, then drain, letting an agent that will finish within about 15 minutes finish and stopping any other at a safe point with where it stopped recorded, launching nothing new; commit your own work by explicit path in every repository you or your agents touched, pull fast-forward only and push everything stacked fast-forward only, never with `--no-verify` or a force-push, stopping on divergence, and name any other session's uncommitted file in Left over, without touching it; strike a mark, park every open query under `## Parked` in `discussions.md` with its tag, one line of context and its recommended option, set `state.md`'s front matter to `state: on-hold` with the reason, release and since, strike decisions and prune the work folder; commit with the subject `docs(work): <id> hold, paused` or `hold, snoozing` and push. Then give a hold report and nothing else: the report heading with the form line `**⏸️ On hold · Hold report at <local time> · mark <local time>**`, or `**💤 Snoozing (on hold) · Hold report at <local time> · mark <local time>**` while Snoozing, `## Done` with one line per repository, `## Parked` with the tags parked in `discussions.md`, one line each, and `## Left over`, or `Nothing`, with no Context, Query or Options; then the On hold banner, which lists nothing waiting, no "with you", running or per-repository status item: its counts read `⏸️ drained · 🅿️ <n> queries parked`, or `💤 waiting for a message · 🅿️ <n> queries parked` while Snoozing, which keeps listening and so never says drained, and its items are only `[parked]` and `[release]`; its thread line is the last line of the report. Each state's glyph, heading, counts line, items, listening line and report form come from the standard's one table of states:

{{hold-banner}}

Snoozing:

{{snoozing-banner}}

If the work cannot drain, because work is unpushable or a run must not be stopped, it stays With worker, blocked, and the report says in one line what is blocking. `drain` alone stops launching while the work stays With worker, and when everything has finished reports with `DRAINED` or `NOT DRAINED` in Done; an explicit drain check puts its result there too, and the thread line stays last.

At Project close, after every decision is homed and the work folder pruned, the last report closes with the `### 🏁 Finished` banner and its thread line.

At every send, receive, mark and hold, rewrite `state.md`'s front matter and next steps, and commit the work folder with a subject that carries the move, such as `docs(work): <id> send to owner`. At bootstrap, at each owner message and at each wake, act on each line of `messages.md` in queue order, `URGENT` then `IMPORTANT` lines first and one at a time, ordinary lines from the top, grouping similar ones where that makes sense; record each line's disposition, then remove it in the commit that names it. A routed line cannot be rejected: do what your authority covers, put what needs Kris into `discussions.md`, and return only the part that is not yours to State of play's `messages.md`, once, with the reason. At receive, copy a report's queries into `discussions.md`. Send a handoff or a rollout as a line in the receiving work's `messages.md`, never as a roadmap record; only deferred work the receiver owns becomes a record, captured by the receiver, as Kris set under HANDOFF-AS-MESSAGE on 2026-10-20: "Handoffs are not roadmap items". Records awaiting acceptance reach Kris as one `ACCEPT` query per work, oldest first, and territory work brings them first at bootstrap and resume, as Kris adopted ACCEPT-BUNDLE the same day: "definitely something that should happen as the first point of call in the state of play". Commit the work package by explicit path after every finished change, each commit and message line first passing the repository's own checks under the `ki-git` checks-before-committing rule, and sync, fetch, fast-forward pull into a clean checkout and push, after every finished change and at least every 15 minutes, as Kris set under COMMIT-CADENCE on 25 October 2026: "changes in the local working copy are blocking the pushing and pulling of the repositories". Push everything stacked on `main`, other sessions' commits included, fast-forward only, never forced and never with `--no-verify`, stopping on divergence, as Kris set under PACKAGE-PUSH the same night; hand a pull that cannot fast-forward to a bounded resolve run in its own worktree, and never stash, rebase or reset in your own checkout. Commit hooks run lint-staged with `--no-stash`, under the never-stash rule as Kris chose HOOK-STASH a) on 1 November 2026, and a leftover `lint-staged automatic backup` stash is reported, never dropped. Never put a push against Kris, as Kris set on 2026-10-19: "Why'd you need to put that against me? I can just push it." Omit routine push state from reports and banners; if your own unit could not be published because its push failed, Done names the affected unit and reason.

At bootstrap, before each state-file update, on a method change and on an important REFRESH line, follow Refreshing this guidance in the ki-coordination standard: compare the latest method revision with your own `method_read`, reread the changed guidance and update `method_read`. When such a line lands, or `method_read` is behind at bootstrap, say in your next reply, in a line or two, how your own behaviour has changed, naming the Ways of working change. This is the coordinator's self-check, not a checkout-wide hook scan.

After a compaction, before replying, follow the `ki-coordination` standard's re-anchoring: re-read the standard, the harness output style `output-styles/ki-coordinator.md` from disk and all five files of your work package in full, and follow the style file wherever it differs from the loaded style; run `ki agent status` and read `messages.md`, important lines first, confirm in one line, then answer in owner-report form with the report heading and the banner; the owner may choose to compact a long session, and no send or resume prompt is emitted beyond a warranted restart suggestion after a second compaction. At every send and every mark, prune the work folder `+/_WORK/<id>/` by explicit path: delete every report in its focus folder, or in `reports/` or still at the top level during the tolerance window, whose outcome has a durable home in a record, the decisions log, the work package or a commit and whose queries have been copied in full into `discussions.md` at receive; those copied queries need not already be answered in a five-file package. In the single-file tolerance shape, also wait until the report's queries are answered and read back in the log, under `ki-work-package` Tidying the work folder. Also delete by explicit path every brief whose report has been received, keeping only the five package files and, in the focus folders, reports whose outcome is not yet homed, open briefs and live design notes, so that Git history holds the rest; at each mark review the design notes and delete each note that has graduated or been recorded as superseded, under the `ki-coordination` standard's design-note guards, keeping drafts, notes under review and any in doubt, and strike each decision a durable home now wholly carries, reduce to a one-line pointer each that still governs live work whose home is elsewhere, and keep the rest, with no numbering. Territory work names each work folder the `ki-work-package` rubric flags by a line in that work's `messages.md` at its own mark, except a finished work's folder, which it closes itself under the `ki-work-package` close-out.

No section, query or banner of an owner report is ever shortened by this style, by any proxy shaping block or by a communication level. Those govern the prose around the report, not the report itself. Record each owner decision in the decisions log in the turn it arrives, in the owner's words, before launching the work it authorises, and describe a decision by its words and date, never by its number.
````

## Report forms

A coordinator, and only a coordinator, reports in one summary form, the [Summary](#the-summary), with the Status as its view without the window, and in three other forms: the re-bootstrap report under [Bootstrap](#bootstrap), the hold report when its work goes On hold, and the finish report when it is Finished; any other reply that moves the mark, changes the state or answers where the work stands is a plain state reply; a conversational session uses the first two [reply forms](#reply-forms). Each form opens with the [report heading](#banner) and closes with the [banner](#banner) and its thread line, and [Templates](#templates) gives each one complete. Kris approved SUMMARY-MODEL with immediate effect at about 01:05 GMT on 4 November 2026, relayed to every active package as SUMMARY-NOW, from the [summary-model design note](https://github.com/krisb/dotfiles/blob/29dc51c/+/_WORK/personal.reg.household-terra/_emerging/summary-model.design.md) that `personal.reg.household-terra` refined with Kris over the marks of 3 and 4 November: the mark is only a timestamp, and one summary form, running from a point in time, replaces the Summary, the recap since the mark and the full summary. It settles STATUS-FORM, STATUS-FORM-2, STATUS-FORM-3, MARK-STATUS, MARK-DURABLE and STATUS-DESIGN, and supersedes the status table MARK-STATUS placed after `## Queries` on 3 November.

| Form | Window | Given | Sections |
| --- | --- | --- | --- |
| [Summary](#the-summary) | since the last mark, since the thread's start where there is none, or since any time the owner names | after every `mark`; on request, `summary` or `summary since <time>`; when all dispatched work has finished; at every send; and as the [gap Summary](#coordinator-responsiveness) after 30 minutes or more without an owner message while queries are with the owner; while work lies with a worker, timed one-to-two-line updates stand in for it and a blocking query is raised in a single line, under [Coordinator responsiveness](#coordinator-responsiveness) | `## Summary since <time>`, `## Status`, `## Findings` while one is open, `## Queries` in full, then the footer: the art unless `no art` was asked for, and the banner with its thread line |
| Re-bootstrap report | the work as picked up | at bootstrap and re-bootstrap | the owner report: `## Done` with the coordinator's role and where the work stands, `## In Progress` with what is running, and `## Queries` with every open query in full; closes with the banner |
| Status | none: the board as it stands | after `mark, status only`; on request, `status` | `## Status`, `## Findings` while one is open, `## Queries` in full, then the footer as a Summary's |
| [Hold report](#putting-work-on-hold) | the drain itself | once, when the owner agrees a hold, and nothing else in that message | `## Done`, one line per repository; `## Parked`, the tags parked in `discussions.md`; `## Left over`; closes with the On hold banner and its thread line |
| Finish report | the close-out | once, when the work moves to [Finished](#finishing-project-work) | `## Done`, the close-out steps; `## In Progress`; `## Queries`; closes with the Finished banner and its thread line |

The hold report keeps its name and its sections under the work model; Kris added it on 2026-10-15 as the drain report and renamed it the same day when "hold is a better word than drain".

The verbs are the ones Kris agreed on 4 November 2026 under SUMMARY-MODEL, and the same plain words in the thread do the same as the slash form:

```text
/ki-coordination mark                  strike the mark, then summarise since the previous one
/ki-coordination mark only             strike the mark, no summary
/ki-coordination summary               summarise since the last mark (or the thread's start)
/ki-coordination summary since 14:00   summarise from any point you name
/ki-coordination mark, status only     strike the mark, then the status table without the history
/ki-coordination status                the status table without the history; the mark stays
```

Adding `no art` to any of them leaves the art out of the footer. Only `mark`, `mark only` and `mark, status only` move the mark, and a hold strikes one; a Summary and a Status never move it. The Status is the Summary without its `## Summary since <time>` section, as Kris asked under REPORT-FORMS-TIDY on 6 November 2026, how to mark and get the status table without the history part. For the tolerance window the older words stay readable: `recap` is read as `summary`, `recap and mark` as `mark`, and `full summary` or `summary in full` as a `summary since` the work's `created_at`. Kris added five more commands on 25 October 2026, choosing COORD-COMMANDS a), "All five":

- `/ki-coordination hold`: drain plus On hold, as `pause` does, under [Putting work on hold](#putting-work-on-hold), ending in the hold report.
- `/ki-coordination drain`: stop launching while the work stays With worker, let what is running finish, and when everything has finished give a Summary whose `## Summary since <time>` carries the drain check's result, `DRAINED` or `NOT DRAINED` with what remains.
- `/ki-coordination resume`: release held work under [Putting work on hold](#putting-work-on-hold)'s **Release**, as the word `resume` does.
- `/ki-coordination send`: make the send under [States and moves](#states-and-moves): commit and sync the work folder and give the Summary whose banner names the handoff.
- `/ki-coordination goals`: walk the Focus list in a [goal-setting pass](#goal-setting-pass), as the word `goals` does, closing with a Status; Kris added it under GOAL-SETTING on 7 November 2026.
- `/ki-coordination receive`: take the owner's receive under [States and moves](#states-and-moves), as `with me` does, and commit it with the next send. Every report that sends is followed by [committing and pushing the work folder](#committing-the-work-folder).

`ki-recap` keeps the ordinary session recap only, and every summary while coordinating is the Summary, as Kris decided on 2026-10-14: "RECAP-OWNER - ki-recap keeps the ordinary session recap only, and ki-coordination's standard carries the one sentence saying so".

### Templates

Each form has one complete template here, as Kris asked under REPORT-FORMS-TIDY on 6 November 2026: its form line, its sections in order and its footer, long or short. A line in angle brackets says what goes there; a part marked _where it applies_ is left out otherwise. The sections that follow set each part's detail; the [Banner](#banner) examples show finished banners. The long footer is the art, then the banner with its roadmap and package lines; the short footer is the banner alone. A hold is visibly not a Summary: it opens `⏸️ On hold · Hold report` or `💤 Snoozing (on hold) · Hold report`, carries `· mark`, not `· since`, has `## Done`, `## Parked` and `## Left over` and no Status or Queries, and closes with the short footer.

**Summary**, after `mark` and under [Report forms](#report-forms), long footer:

```text
# [<Theme>](<theme page>) › [<Project>](<Project note>)

**<glyph state> · Summary at <now> · since <window start>**

---

## Summary since <window start>

**<what the window came to>**

- <one line per item that changed, or one line saying nothing changed>

## Status

| Focus | Where it stands |
| --- | --- |
| **<focus id>** ⭐<br><focus line from work.md> | **<state in a few words>**<br><holder glyph> <item>; next: <step> |

## Findings

<each open finding in full; where it applies>

## Queries

<every open query in full, or None.>

<the Knowledge Islands art, unless no art>

### <glyph state> · at <time the work entered this state>

<counts line>

🗺️ roadmap · <n> records · <n> open · <n> done awaiting prune · <n> ideas

📦 package · inbox <n> · outbox <n> · held <n> · awaiting ACK <n>

- [<state>] <what> · <holder> · since <time>

<↪️ heading-for line; where it applies>

<👂 or 🔇 listening line; where the thread has the capability>

<role glyph> 🔑 <work-id>
```

**Status**, after `mark, status only` or on `status`: the Summary's template with its form line reading `**<glyph state> · Status at <now> · last mark <mark>**`, without `## Summary since <window start>`, so `## Status` follows the rule, and with the same long footer.

**Re-bootstrap report**, under [Bootstrap](#bootstrap), short footer:

```text
# [<Theme>](<theme page>) › [<Project>](<Project note>)

**<glyph state> · Re-bootstrap at <now> · last mark <mark>**

---

## Done

- <the coordinator's role and where the work stands>

Rename thread: /rename <role glyph> 🔑 <work-id>

## In Progress

<what is running and waiting, or Nothing is running>

## Findings

<each open finding in full; where it applies>

## Queries

<every open query in full, or No outstanding queries>

### <glyph state> · at <time the work entered this state>

<counts line>

- [<state>] <what> · <holder> · since <time>

<👂 or 🔇 listening line; where the thread has the capability>

<role glyph> 🔑 <work-id>
```

**Hold report**, under [Putting work on hold](#putting-work-on-hold), and nothing else in its message, short footer:

```text
# [<Theme>](<theme page>) › [<Project>](<Project note>)

**⏸️ On hold · Hold report at <now> · mark <the hold's mark>**

---

## Done

- <one line per repository>

## Parked

- <TAG> - <one line each>

## Left over

<another session's uncommitted file, or Nothing>

### ⏸️ On hold · paused until <release> · at <time the hold landed>

⏸️ drained · 🅿️ <n> queries parked

- [parked] <n> queries in `discussions.md`
- [release] <release>, or `resume`

<🔇 not listening; where the thread has the capability>

<role glyph> 🔑 <work-id>
```

**Hold report while Snoozing**: the hold report's template with its form line reading `**💤 Snoozing (on hold) · Hold report at <now> · mark <the hold's mark>**` and the Snoozing banner, short footer:

```text
### 💤 Snoozing (on hold) · at <time the snooze landed>

💤 waiting for a message · 🅿️ <n> queries parked

- [parked] <n> queries in `discussions.md`
- [release] a message arrives, or `resume`

👂 listening

<role glyph> 🔑 <work-id>
```

**Finish report**, at [Finishing Project work](#finishing-project-work), short footer:

```text
# [<Theme>](<theme page>) › [<Project>](<Project note>)

**🏁 Finished · Finish report at <now> · last mark <mark>**

---

## Done

- <one line per close-out step>

## In Progress

Nothing is running

## Queries

No outstanding queries

### 🏁 Finished · <work label> closed at <time>

- [finished] <what closed>

<role glyph> 🔑 <work-id>
```

**Plain state reply**, for any other reply that moves the mark, as `mark only` does, changes the work's state, as a receive does, or answers where the work stands: no heading, form line or sections, one or two plain lines, then the short footer:

```text
<one or two plain lines saying what moved or where the work stands>

### <glyph state> · at <time the work entered this state>

<counts line>

- [<state>] <what> · <holder> · since <time>

<👂 or 🔇 listening line; where the thread has the capability>

<role glyph> 🔑 <work-id>
```

### The Summary

The **Summary** is the coordinator's one summary form. It runs from the last mark, or from the thread's start where there is none, or from any time the owner names, and it is laid out for a window about 90 columns wide; the owner may ask for another width. A report written before SUMMARY-MODEL keeps its Summary, recap or full summary shape, its `## Decided` section and its `Out of scope`, `Waiting on you` and `What I heard` parts, and anything that reads past reports accepts them. After the [report heading](#banner), whose form line reads `**<glyph state> · Summary at <local time> · since <local time>**`, the second time being the window's start under [Three times](#banner), it holds, in this order:

1. **`## Summary since <time>`**, the window's start as local time, such as `## Summary since 22:34 BST`: one bold headline saying what the window came to, then one line per item that changed in it, what was delivered, decided, started, stopped or blocked, and newly captured, with material failures, corrections and limitations beside the items they qualify, and commits and a recovered session among them. With nothing changed, one line says so.
2. **`## Status`**, the status table below.
3. **`## Findings`**, only while a finding the owner asked for is open, under the owner report's **Findings**.
4. **`## Queries`**, every open query in full, each under its `### <TAG> - <plain-language title>` heading with **Context**, **Query** and **Options**, the recommended option first with its confidence and reason, under the [owner report](#owner-report), and a proposed work transfer last; with none, `None.` After the Summary the coordinator takes them in the [interactive pass](#interactive-pass), keeping each one's tag, Context, Query and Options.
5. **The footer**, in its long form: the art, then the footer lines, which are the [glyph banner](#banner) with its [roadmap and package lines](#banner), and its thread line.

**The status table** has two columns, **Focus** and **Where it stands**, and one row per focus area that holds items, in `work.md`'s Focus order with the primary first. It is the full board, not a delta: every live item appears whether or not it changed in the window, so nothing quiet drops out of sight.

- **Focus cell:** line one is the focus id alone in bold, matching the bold headline beside it, the underscore escaped, as in `**\_emerging**`, with ⭐ on the primary; under it, at normal size, the focus's own line from `work.md`'s Focus section, copied word for word and never reworded. The Focus column takes no more than a third of the table's width, as Kris added to SUMMARY-MODEL on 4 November 2026, so each `work.md` focus line stays one short phrase of goal and order; a longer line is shortened in `work.md`, never reworded in the Summary.
- **Where it stands:** a bold headline giving the focus's state in a few words, then one line per item, each opening with who holds it, 👤 Kris, 🤖 a worker, 🧵 another thread or ⏳ the outside world, then what it is and its next step. Kris's items come last and name their query's tag, so no separate waiting column is needed. Uncommitted work, unlogged decisions and repositories behind their remote, under the [repository level check](#repository-level-check), are 🤖 lines in the row they belong to, or the primary's.
- **`_emerging`** is a usable catch-all focus and gets a row like any other.
- **Rendering:** a plain Markdown table with `<br>` between the lines of a cell. Kris wants cells aligned to the top, which Markdown cannot ask for, and an HTML table with `valign="top"` rendered broken in Orca's chat; padding the shorter cell with blank lines was tried and dropped under TABLE-ALIGN, because it counts lines as written rather than as wrapped and overshoots by an amount that depends on the width. Top alignment is asked of Orca's chat view instead under [PERSONAL-DOTFILES-UE-107 (pruned)](https://github.com/krisb/dotfiles/blob/7f5a625/docs/roadmap/PERSONAL-DOTFILES-UE-107-decide-orca-adoption.md), ORCA-TABLE-ALIGN; until then cells centre.

```markdown
## Status

| Focus | Where it stands |
| --- | --- |
| **reporting** ⭐<br>Status-led reports every thread can read cold | **Landing in the standard**<br>🤖 summary-model writes the Summary into ki-coordination; next: checks<br>👤 STATUS-WIDTH: whether 90 columns suits every surface |
| **\_emerging**<br>Side asks that may grow into focus areas | **Waiting outside**<br>⏳ Orca top-aligned table cells; next: Orca's answer |
```

**The footer** is the Knowledge Islands art, then the footer lines. The art shows on every Summary unless the owner added `no art`, and on no other report. What the art and the footer lines carry is Knowledge Islands Agora's to decide, `ki.prj.agora`, under FOOTER-AGORA, which Kris set at about 23:40 GMT on 3 November 2026, liaising with `ki.sop.main` as the keeper of this standard. Until Agora publishes its own, the art is the 88-column Knowledge Islands drawing in the [summary-model design note](https://github.com/krisb/dotfiles/blob/29dc51c/+/_WORK/personal.reg.household-terra/_emerging/summary-model.design.md), whose scroll carries the host and the state, the counts in words, and the day, date and local time, and the footer lines are the glyph banner as [Banner](#banner) sets it. Kris set its roadmap and package lines directly, under FOOTER-COUNTS on 6 November 2026.

Low-stakes choices the coordinator has already made, where the owner's silence is consent, go in one query headed `DEFAULTS - defaults unless you say otherwise`: the Context one line per choice, the Query `keep these defaults?`, and the Options `a) (recommended, confidence high - each choice is low-stakes and reversible) keep the defaults` and `b) object to the ones you name`. A choice the owner objects to becomes its own tagged query. A decision that is not low-stakes never goes there, and no other query bundles more than one decision: a query the owner cannot answer with one instruction is two queries.

Sources are the work's decisions log, every report in the work folder and, for the reports a [prune](#pruning-the-work-folder) has deleted, their last revision in Git history, the parked tags in `discussions.md`, `ki agent status`, work-record transitions in the work's scope from the Git history of the roadmap paths, and `git log -- +/_WORK/<id>/`, the logbook. Where a report is missing from the work folder and from Git history, the Summary says what it could not read rather than reconstructing it from memory.

## Coordinating work

Project work coordinates exactly one Project for the owner. It is always delegation-based: it runs its work as background agents through `ki agent` under the `ki-delegation` [background-run standard](../../../governance/ki-delegation/references/standards-background-runs.md), and keeps its own turns short under [Coordinator responsiveness](#coordinator-responsiveness).

- **Work package:** the coordinator picks the work up from `+/_WORK/<territory>.prj.<project>/`, whose `work.md` defines the work and whose `state.md` holds its current state only, and keeps both current under the work-package standard. The work file names its Project in front matter, and the Project note does not link down.
- **Decisions:** it records each owner approval in `+/_WORK/<id>/decisions.md` before launching the work that approval authorises.
- **Territory work:** [territory work](#territory-work) owns cross-Project priorities, releases, and decisions touching more than one Project. Releases follow the `ki-repo-tools` release-on-demand policy: a delivery run never releases by default, and a release run carries the `release` footer for the named release only. Project work raises those there.
- **Naming:** where the runtime can name a session, the session takes its seat's thread line, such as `⚒️ 🔑 ki.prj.ways-of-working`, under [Work naming](#work-naming), so territory work and the owner can find it.
- **Opening:** open Project work only where there is active work to drive, within territory work's [cap](#territory-work). A dormant, registered Project may have an On hold package solely to receive its first message, under [Seeding](#territory-work).
- **Scope:** it works only its own Project's records. Work that belongs to another Project goes to that Project's `messages.md` through territory work, the secondary State of play covering both where one does.
- **Close:** it shows Finished only at [Finishing Project work](#finishing-project-work); until then it moves between the other six states.

### Territory work

Each territory Capital holds one main State of play, `+/_WORK/<territory>.sop.main/work.md`, titled `<Territory> > SoP`: the coordination of the territory's coordinations. It may also hold [secondary States of play](#secondary-states-of-play), each coordinating a named part of the territory under the main. Each does project management and may coordinate explicitly assigned Project packages: delivery remains in those packages and their product repositories, never in the State of play package itself. No repository other than a Capital holds territory work. The main is never Finished while the territory is open. Where this standard says territory work without qualification, it means the main State of play; a secondary takes those duties only for the work it covers, as its section sets.

- **Registry:** the themes and Projects it manages are defined in the Capital's `Streams/` registry under the `ki-work` Project registry standard, and their work records live in the roadmaps of the territory's repositories.
- **Owns:** cross-Project priorities, releases, decisions touching more than one Project, [messages](#messages-between-work) to Project work, written into their `messages.md` and Project notes, the Project-work queue, and a territory hold with the list of work to restart from it.
- **Views:** it rolls up the five views the note sets, with you, stuck, blocked, moving and on hold, across the territory's work, through `ki work status`; work awaiting review stays out of the five views and shows as a count.
- **Regular work:** it may discuss regular work and send it messages without opening coordination on that package; dispatch follows its explicit assignment and the owner-approved scope.
- **Acting for idle work:** where a package in its territory has no active session, the State of play acts for it on its messages, as Kris set under SOP-ACTS-FOR-IDLE, raised at 15:50 GMT on 5 November 2026 and asked for at about 01:50 GMT on 6 November, relayed by `personal.reg.inbox-sol`: it acts for the package, "receiving, ACKing, routing and answering its messages, without necessarily taking its work forward". A package has an active session while its `listening_status` is `on`; otherwise nothing takes its messages until it is next opened, so the State of play takes them. It takes the package's Inbound under [Messages between work](#messages-between-work), IMPORTANT lines first and then in queue order, within one package per turn: it ACKs each line at the top of the sender's Inbound; routes a part that belongs to other work by a line in that work's `messages.md`, under Dispatch below; answers what the territory's coordination can answer by a reply line to the sender; and puts what needs the package's own judgement or the owner into the package's `state.md` next steps or `discussions.md`; then it removes the line in a commit naming the line and the package, `docs(work): <id> messages taken by <State of play id>`. It takes the package's work forward only where its own assignment already covers it: acting for the package, it launches no run and changes none of its state, holder, `since`, mark, hold or decisions, and an On hold package stays on hold. Acting for is not stewardship and transfers nothing under [Coordinating assigned packages](#coordinating-assigned-packages); a package whose home is absent, stale or ambiguous is surfaced, not acted for. A secondary acts for the packages it covers, the main for the rest. When the package's own session opens, it takes only the lines still in its queue and finds the dispositions in its files and Git, and the State of play stops acting for it.
- **Cap:** at most three or four Project packages are active at once, irrespective of how many threads act on them, with neither On hold nor Finished. Exceeding this existing active Project cap requires the owner's explicit agreement beforehand; the coordinator cannot raise it unilaterally. Until then the default is to queue the next piece. It keeps the active work and the ordered queue in its state file's `## Queue`, each with its title and opener, and opens the next queued piece when an active one goes on hold or finishes. Within one piece, about three background agents run at once and the rest wait in the run queue, under [Coordinator responsiveness](#coordinator-responsiveness).
- **Acceptance first:** at bootstrap and at resume, its first call on the owner is the territory's records awaiting acceptance, brought as one bundle per work under [Acceptance bundles](#acceptance-bundles), before any other query.
- **Seeding:** before Project work opens, territory work creates or reconciles its work folder and gives the owner its [opener](#opening-work), so the session opens with one message. The sender or the territory's State of play may create an absent, registered Project's package solely to queue its first message, within the receiving repository's authority. Create all five package files with a minimal definition, empty queries and decisions, and `state: on-hold`, `hold.reason: paused` and `hold.release: when Kris opens this Project work`; a queued message does not open or automatically release the work.
- **Flags:** at its own mark it names, by a line in each owning work's `messages.md`, every work folder the `ki-work-package` rubric's [FOLDER](../../../governance/ki-work-package/references/rubric.md) items flag under [Pruning the work folder](#pruning-the-work-folder), except a finished work's folder, which it never names in a message line; it never prunes another work folder itself, except that it closes a finished work's folder directly under the `ki-work-package` [close-out](../../../governance/ki-work-package/references/standards-work-package.md#tidying-the-work-folder) and, if a close-out check fails, puts the query in its own `discussions.md`. At the same mark it runs the [worktree sweep](#worktree-sweep) and reports only what it finds.
- **Other territories:** it coordinates with another territory's territory work only through the owner. It never acts with authority in another territory's repositories; each Capital keeps its own ownership, and cross-repository work moves under `ki-trades` or the receiving repository's own process.

**Dispatch.** Territory work is the single dispatch coordinator, as Kris agreed under WORK-ROUTING on 19 October: "usually state of play is a dispatch agent overall. So actually improvements should really go back to state of play." Every new unit of work with no clear owner - an owner dump, a handoff with no owning work, a cross-work item whose owner is unclear, and every method improvement - comes to it, by the owner pasting a prompt there or by a line in its own `messages.md`. A work's own follow-ups, an item in a record that already names its work and a reply to a message go direct and do not pass through it.

- **Matching:** it matches the unit against the register, the `work.md` and `state.md` front matter `ki work status` derives from the work folders, reading a `work.md` body only where two descriptions match, and keeps no copy of the register.
- **Routing:** it writes one dated line into the chosen work's `messages.md`, `- <date> · ROUTE · <Territory> > SoP (<territory>): <the unit in the owner's words, with links>`, at the position its priority warrants, and flags it important where it must be taken first, under [Messages between work](#messages-between-work). Where nothing matches, it proposes to the owner a new piece of work, within the cap, or a record captured through `ki-next`.
- **Returns:** a part a work returns is routed once more at most; if it cannot be placed elsewhere, or would come back again, it goes to the owner as a query, so nothing bounces between works.
- **Unread lines:** it shows in its register the count and age of lines nobody has picked up. A line routed to work On hold, paused, waits without waking it; for work Snoozing whose session is closed, or not waking, it identifies the work by its thread line, and asks the owner to lift a hold where a line is urgent.

**Stewardship of continual improvement.** Every work tries to improve continually, and territory work coordinates it, as Kris amended STEWARD-HOME on 19 October: "everything should be trying to continually improve and I think that should be coordinated by state of play". Every work sends a method improvement to territory work by a `METHOD` line in its `messages.md`, and territory work watches the works for improvements itself. While Ways of working is open, territory work routes each to it like any other unit, its description saying it takes method changes, and Ways of working sends targeted `REFRESH` lines under [Refreshing this guidance](#refreshing-this-guidance). When Ways of working finishes, territory work's `work.md` description gains method stewardship and its Scope says where method changes go: it keeps a method backlog, dispatches each accepted small improvement as small regular work or into the Project it most affects, with a design review for a change of shape, and sends the `REFRESH` lines itself; a significant change revives Ways of working, or a more targeted Project under the Model theme. Lasting method authority stays in the skills and decision records, and territory work still executes nothing.

### Coordinating assigned packages

The acknowledged package steward tends its disposition, queues and tidy independently of any active coordinating session. The parent State of play reconciles assigned regular umbrellas, children and declared member homes through `parent`/`covers` and the home reference at opening, bootstrap, approved moves and ordinary tending. Surface absent, stale, inaccessible or ambiguous homes and unacknowledged ownership; do not take over or clear their messages. The Capital's prose home reference is discovery, never a second package, state or inbox. Reader compatibility is a prerequisite to automated member-home discovery; the local advisory hook does not scan the estate or guarantee runtime injection.

A State of play may steward an assigned package of any level only by the explicit committed assignment and acknowledged handover in the `ki-work-package` [stewardship rule](../../../governance/ki-work-package/references/standards-work-package.md#assigned-package-stewardship). Its field remains the marked STEWARD-FIELD placeholder; do not add a field or reinterpret `worker`. The old steward stops launches and reconciles runs in flight, queued launches and pending writes; the new steward acknowledges and takes their supervision before acting. No absent session, missing binding, quiet thread or timeout transfers stewardship. Assignment never changes the holder or releases On hold work.

An assigned State of play may use the package's own entry points, including tidying. It may create or adopt a package only for a registered Project within the cap, with a state justified by the actual move. First-message seeding of dormant work stays On hold. A package assigned elsewhere receives only messages. A territory hold drains assigned Project packages first and asks any independent steward to drain its own; it does not write another steward's package.

One territory Summary reports across the packages it stewards, naming the package on every item. A query's identity is `(work id, tag)`, and its full text lives in that package's `discussions.md`; the owner's answer is recorded in that package's `decisions.md`. Each package keeps its own state, `since`, mark and beat. A territory mark never moves Project marks, and acknowledgement moves only the work it clearly names. Keep a decision spanning Projects once at the territory home and link it, rather than copying it as several grants.

A record's `project` resolves through the registry to its package and grants no authority. Selection into `now` neither opens Project work nor grants execution. Its steward adds the next-step link from the routed line at its next wake; records retain the owning repository's holds, readiness and acceptance. Project-less work goes first to its existing regular or ad hoc owner, then to the State of play's routing queue only if unresolved. Reclassification reconciles running work and report destinations first.

Every run brief distinguishes its reporting package from the product repository; the launcher homes its report in that package whoever launched it. Bootstrap and re-anchoring establish the local machine through the territory's machine inventory. Host requirements restrict device-dependent execution only: any coordinator may acknowledge, plan, ask about or dispatch a targeted line in IMPORTANT and queue order. Keep unfulfilled requirements queued and counted, flagging their age when no eligible host has taken them; never infer a takeover. Resolve concrete hosts, categories and unknown or renamed names under the `ki-work-package` [message rule](../../../governance/ki-work-package/references/standards-work-package.md#messages-lines). The session's host seat stays out of packages, holds and reports.

### Secondary States of play

A territory always has its main State of play and may add secondary ones where it has more work than one coordinator can hold, as Kris set on 24 October 2026: a territory has a main State of play plus optional secondaries, such as `HNR > SoP (main)`, `HNR > SoP (5ge)` and `HNR > SoP (sites)`. A territory with no secondary needs no change.

- **Declaration:** a secondary is territory work in the Capital, `+/_WORK/<territory>.sop.<name>/`, a five-file package at `level: territory`, titled `<Territory> > SoP (<name>)`, with `parent: <territory>` and `covers` naming its assigned same-territory Project and ad hoc work. Every package below the main names its coordinating State of play as `parent`. The main's `covers` is the register of record, including coverage through secondaries and registered work whose package is absent or pruned; secondary lists remain assigned subsets. Check parents against the register, same-territory membership, unique secondary coverage and cycles under the `ki-work-package` [definition fields](../../../governance/ki-work-package/references/standards-work-package.md#work-file). Work with no secondary stays with the main.
- **Creating:** the owner decides each secondary and its coverage at the main, which records the decision and prepares the package On hold until the owner opens it; changing a coverage is a main decision, made in both `work.md` files in one commit.
- **Front door:** the main stays the owner's only front door and the single dispatch coordinator. Owner dumps, units with no clear owner, method improvements and anything touching more than one secondary, or a secondary and uncovered work, come to the main.
- **Main owns:** the registry, membership and Known Lands, releases and priorities across secondaries, the territory-wide ceiling on active Project work, method stewardship, the worktree sweep and `REVIEW-HOLD`, and every decision touching more than one secondary.
- **Secondary owns:** for the work it covers alone, cross-Project priorities, its queue in its own `state.md` `## Queue` within its share of the main's ceiling, acceptance bundles, decisions touching more than one covered Project, and routing between them. It rolls up the five views across its covered work; the main rolls up all.
- **Routing down:** the main routes a unit within one secondary's coverage as one `ROUTE` line into that secondary's `messages.md`, and the secondary routes it on to the covered work. A unit for one named covered work may go straight there.
- **Routing up and across:** covered work sends a matter across its covered Projects to its secondary, and a `METHOD` line or any matter beyond the coverage to the main. A secondary sends cross-cutting matters to the main and may message another secondary directly where the owner of the matter is clear. A secondary returns a part it cannot place to the main, once; the main then places it or asks the owner, so nothing bounces.
- **Acceptance and review:** each secondary brings the acceptance bundles for its covered work first at its own bootstrap and resume; the main brings the rest and shows each secondary's count. `+/_WORK_REVIEW/` stays with the main.
- **Opening:** the owner opens a secondary with the [secondary opener](#opening-work) and gets every opener for the territory from `ki agent prompts <territory>`.

### Opening work

The owner opens a session in the actual package-home checkout, the Capital by default or the deliberately approved regular/ad hoc member home, names it by its [thread line](#work-naming) where the runtime can name a session, and pastes one opener. In the runtime-specific Claude Code binding, the opener launches the session as `claude --name "<thread line>"`, `<role glyph> 🔑 <work-id>` from `work.md`'s `role`, or `🧵 <work-id>` with no role yet, the same name as the rename line and every report's thread line, as Kris decided RENAME-NAME a) on 1 November 2026 and STAGE-C-ROLES on 7 November 2026, and every bootstrap and re-bootstrap report carries one `Rename thread: /rename <thread line>` line, so a session opened another way can take the name; Kris chose THREAD-RENAME a), "Name + rename line", on 25 October 2026, and set its form under RENAME-THREAD-FORM on 31 October 2026: "we name them like: `🧵 personal.reg.rig-terra`". The rename line is one of two named exceptions to the rule that reports carry no paste line, the other being the [restart suggestion](#banner). The opener half, `ki agent prompts` printing the launch command, belongs to `tools-ki`. Territory work prepares the work folder first, so every session opens with one opener and nothing else. An opener is a steering-ready brief, not a transcript: it names the work and leaves state to the work package. Its role line carries the three rules of [the responsive coordinator](#the-responsive-coordinator) in Kris's words.

For territory work:

```text
Bootstrap as <territory>.sop.main territory work under ki-coordination.
Role: coordinator only. The coordinator never does substantive work itself; every unit of work goes to a detached background agent; an owner message never pre-empts work in flight. Dispatch, decide with me, report; stay responsive.
Label: <Territory> > SoP (<territory>). Work package: +/_WORK/<territory>.sop.main/ in <capital>.
Project management only: priorities, the Project-work queue (cap three or four), decisions and releases; route real work to Project work.
Background agents: run substantive work through `ki agent` in run `<territory>-sop-main`; stay responsive.
Steering: my messages steer; stop or abort only when I expressly say so, naming the work.
First step: follow the Bootstrap in ki-coordination, then give the full re-bootstrap report.
```

For Project work:

```text
Bootstrap as <territory>.prj.<project> Project work under ki-coordination.
Role: coordinator only. The coordinator never does substantive work itself; every unit of work goes to a detached background agent; an owner message never pre-empts work in flight. Dispatch, decide with me, report; stay responsive.
Label: <Territory> > <Theme> > <Project> (<territory>.prj.<project>). Work package: +/_WORK/<territory>.prj.<project>/ in <capital>.
Project: <project>; work only this Project's records.
Background agents: run substantive work through `ki agent` in run `<run>`; stay responsive.
Steering: my messages steer; stop or abort only when I expressly say so, naming the work.
First step: follow the Bootstrap in ki-coordination, then give the full re-bootstrap report.
```

For a secondary State of play:

```text
Bootstrap as <territory>.sop.<name> territory work under ki-coordination.
Role: coordinator only. The coordinator never does substantive work itself; every unit of work goes to a detached background agent; an owner message never pre-empts work in flight. Dispatch, decide with me, report; stay responsive.
Label: <Territory> > SoP (<name>) (<territory>.sop.<name>). Work package: +/_WORK/<territory>.sop.<name>/ in <capital>.
Secondary State of play under <Territory> > SoP (<territory>): project management only for the work its work.md covers, within its own cap; the main State of play stays the owner's front door and owns cross-cutting decisions, so route those to it.
Background agents: run substantive work through `ki agent` in run `<territory>-sop-<name>`; stay responsive.
Steering: my messages steer; stop or abort only when I expressly say so, naming the work.
First step: follow the Bootstrap in ki-coordination, then give the full re-bootstrap report.
```

For explicitly selected regular or ad hoc coordination, retaining its actual level and home:

```text
Bootstrap as <id> regular work under ki-coordination.
Role: coordinator only, explicitly selected for this package. Delegate substantive units to detached background agents; stay responsive; owner messages steer and never pre-empt work in flight.
Label: <actual work label> (<id>). Work package: +/_WORK/<id>/ in <actual package-home repository>.
Authority: <owner opening instruction or logged decision>. Scope: <approved episode>; end condition: <bounded end condition, or explicitly approved continuity>.
Background agents: run substantive work through `ki agent` in run <run>; stay responsive.
First step: follow Bootstrap in ki-coordination, checking capability or the specific owner-approved exception, then give the full re-bootstrap report.
```

The one-line `Re-bootstrap as <id> under ki-coordination.` form under [Bootstrap](#bootstrap) remains enough for a session already on this contract.

`ki agent prompts [<territory>]` prints these openers, filled from each work's `work.md`, for the main State of play, each secondary and each unfinished eligible package, including regular and ad hoc work, and `--short` prints the one-line form. It is the owner's way to get an opener; reports and banners still carry none, under the [thread line](#banner).

### Bootstrap

**Before the opener.** On a fresh or changed machine the owner runs the `ki-bootstrap` [machine-readiness checklist](../../../keystone/ki-bootstrap/references/standards-bootstrap.md#machine-readiness-for-coordinating-work) to its "Ready to coordinate" result: tools and level checkouts, the chezmoi binding of the coordinator hook and the `ki-coordinator` output style, `ki bootstrap` and `ki skill add ki-work-design`, the Capital's declarations, the observable checks that the hook and the style work, and `ki agent prompts <territory>` for the opener with its `claude --name` command. That checklist owns the machine half and this standard begins at the opener and owns the session half, as Kris set under BOOT-HOME on 26 October 2026. A session that reaches the opener without the hook's line or the style's shape says so in one line and names the checklist rather than coordinating blind.

A one-line opener brings a new or already-running session onto this contract, for example `Re-bootstrap as ki.ways-of-working under ki-coordination.` The thread-model openers, `Re-bootstrap as the <project> coordination thread under ki-coordination.` and `... as the state-of-play thread ...`, are accepted for the tolerance window and mean the same work. A coordinator also re-bootstraps on request, after a compaction under [Re-anchoring](#re-anchoring-after-compaction), after a model switch, and when picking work up under [Picking work up](#picking-work-up). It then:

1. reads this standard and the Work Process note;
2. checks `ki agent status` for its runs, and reconciles what is actually running rather than assuming;
3. resolves the exact id and actual repository to one authoritative work package, `+/_WORK/<id>/`, reads its five files, `messages.md` first, or its tolerated legacy record, and stops on an absent or ambiguous home; reconciles it under the work-package standard and checks `method_read`; checks the opener against its actual level (`territory`, `project` or `regular`) and scope, opening authority and package-home coordination capability under [Session kinds](#session-kinds), preserving a specifically approved exception such as Acquire intake; a mismatch or missing authority/capability without that exception gets a one-line explanation and the conversational reply forms, never automatic coordination;
4. acts on each line of its [message queue](#messages-between-work), `messages.md`, important lines first, `FIRST-STEP` among them, then in queue order, before launching any work;
5. as territory work, gathers every record awaiting acceptance across its territory's repositories, or as a secondary across the work it covers, and brings them first, ahead of every other query, as one bundle per work under [Acceptance bundles](#acceptance-bundles);
6. as the main State of play, lists every item in its territory's `+/_WORK_REVIEW/` areas and, while any holds anything, raises them as one `REVIEW-HOLD` query under [Work awaiting review](#work-awaiting-review);
7. gives the re-bootstrap report, a full [owner report](#owner-report) under the [report heading](#banner), its form line reading `**<glyph state> · Re-bootstrap at <local time> · last mark <local time>**`: `## Done` gives its coordinator role and where the work stands and ends with the line `Rename thread: /rename <thread line>`, `<role glyph> 🔑 <work-id>` or `🧵 <work-id>` with no role yet, under [Opening work](#opening-work), `## In Progress` what is running, and `## Queries` every open query in full; then it closes with the [glyph banner](#banner) and its thread line, rendered exactly as a Summary renders them, the thread line last. Kris set the full report under REBOOT-SHAPE on 25 October 2026, taking option a), "Full report".

Work opened, bootstrapped or restarted in a new session with no mark strikes one at its start, writing `mark` in `state.md`, so every work always carries a mark. [Re-anchoring](#re-anchoring-after-compaction) in the same session still moves none.

### Messages between work

Territory work propagates common instructions and routes new units, and any piece of coordinating work may message another. Rules go to their durable owner, a skill or a Decision Record. Messages go into the receiving work package's `messages.md`, its incoming queue and the asynchronous channel between work, which Kris set on 2026-10-14, "send a message effectively to another thread asynchronously by adding something at the top of its checkpoint so the next time that it reaches its checkpoint it will probably see that there's a change there and it can decide what to do with it", and made a queue taken in priority order under WORK-QUEUE-PRIORITY on 19 October. The file travels across hosts through Git, so a line reaches work wherever and whenever it is next picked up. Writing a line is a send to that work.

- **Place and shape:** one line in the receiver's `messages.md`, in the shape, length and commit subject the `ki-work-package` [Messages lines](../../../governance/ki-work-package/references/standards-work-package.md#messages-lines) section sets. Work still in the single-file shape keeps its `## Messages` section, and an old-shape checkpoint its bold-line messages block, until it moves.
- **Priority order:** lines stand in the order of their priority, top first. An ordinary line is added at the end; territory work, dispatching, may place a line at the position its priority warrants. A line flagged important, `- IMPORTANT · <date> · <TAG> · <sender label> (<sender id>): ...`, is added above every ordinary line and is taken first; important lines are taken in their order, one at a time, never grouped or reordered. That is how territory work changes how a work works: a method change, a `REFRESH` or a stop-and-redirect goes in as an important line, and `FIRST-STEP` lines are important lines.
- **Sender:** any coordinating work in the same Capital. Its only write into the receiver's folder is adding its own line, or replacing its own line not yet acted on; it checks that path under the `ki-git` [checks before committing](../../../governance/ki-git/references/standards-git.md#checks-before-committing) rule, commits it alone and pushes at once. Territory work routes the owner's dumps and anything with no owning work, may also write into its territory's Project notes to dispatch work, and alone writes to another Capital, through that Capital's territory work. The owner, through the Observatory, is also a sender: it writes one consolidated feedback package, `feedback/<date>-<slug>.md`, into the folder of the work that produced the document, and one line linking it, committed together, under the `ki-work-package` [entry points](../../../governance/ki-work-package/references/standards-work-package.md#entry-points), for the tolerance window. Other owner feedback on a document is an ordinary line, added by the owner or written word for word from the owner's words by the work's own steward, with the owner named as speaker, under FEEDBACK-AS-MESSAGE. The sole first-message package-creation exception is [Seeding](#territory-work); otherwise the one-line write boundary remains.
- **Receiver:** the coordinator pulls fast-forward, then reads `messages.md` at bootstrap, every pick-up, every owner message, every wake of its background check, every Summary, and before launching work. It takes the queue in order: important lines first, then ordinary lines from the top, grouping similar ordinary lines into one unit of work where that makes sense. It records each line's disposition where it lands, its decisions log, `state.md` next steps or `discussions.md`, then removes the line in a commit that names it, naming every line it grouped. A line it cannot act on yet stays, with an open query naming it. A line linking a feedback package is taken with its package: the receiver reads the package as part of the line and records each point's disposition where it lands, and the package stays until a tidy finds every point homed. The named disposition/removal commit is the receipt; it is not necessarily completion of the requested work. A retained line can point to its open query. Where the work has no active session, its State of play takes the queue for it under [acting for idle work](#territory-work).
- **Route receipt:** a routed work cannot reject what it is given, and the line confers no execution authority, as Kris amended ROUTE-RECEIPT on 19 October: "once it's given it, it has to do something with it, it can't reject it", but "we have to be careful about things just [bouncing] in between things". The receiver does what it can with each line: the part its existing authority covers goes into `state.md` next steps; the part that needs the owner's authority, capacity or a scope change becomes a query in `discussions.md`; and only the part it judges is not its own goes back to the `messages.md` of the State of play that routed it, the main or a secondary, once, with the reason. It returns a part only after doing what it can with the rest, and never the whole.
- **Handoffs and rollouts:** a handoff or a rollout to other work or another repository goes as a line in the receiving work's `messages.md`, or in territory work's where no work owns it, never as a roadmap record in the receiver's roadmap or triage. Kris set it under HANDOFF-AS-MESSAGE on 2026-10-20: "Handoffs are not roadmap items ... A rollout that needs people to make those changes sooner rather than later must go as a message ... we push the need to roll things out into other projects triage folders, and that's not what this is for." Only work genuinely deferred, which the receiver owns, may become a record, and the receiver's own coordinator captures it under the `ki-next` [capture rule](../../ki-next/references/standards-next-work.md#capture-substantive-prospective-work); the sender never writes it. A route `ki-trades` declares keeps its trade records. Put a proposed transfer of work at the bottom of the Summary's Queries, naming the receiving work package and asking permission before sending, unless Kris has already authorised that transfer. Existing authorised routes, replies and refreshes need no repeated permission.
- **Urgent work:** a unit is urgent only when it carries a stated deadline or rolls out a process change other work must follow, as Kris chose URGENT-CRITERIA a) on 7 November 2026: "Only a unit with a stated deadline, or a process rollout other work must follow; anything else goes as an ordinary or `IMPORTANT` line." Kris set its route under ROUTE-UP and HOW-WE-WORK on 3 November 2026: urgent work goes straight to the live leader on the escalation path, "Jimmy is not in, so Bobby", without waiting on an ACK, and "not everything" is an escalation. So the sender, first, hands it to the owning work's live worker where one is live, as an `URGENT` line in that work's `messages.md`; otherwise, second, it writes the same line for the record and at once sends it to the nearest live leader up the owner's `parent` chain, its State of play and then the territory's main State of play, which judges the urgency and delegates within its own authority; third, whoever takes it writes the ACK line back to the sender; and fourth, only where no leader on the path is live and the unit lies within the sender's own authority, the sender does it through a detached run and then replaces its original line with a `SUPERSEDED` line naming the run and its commits, so the owner can adjust or tidy when it next comes online. Outside the sender's authority it goes to the owner as a blocking query. A worker is **live** when its `workers` entry in `state.md` says `status: active` and `listening: on` and its package or Agora shows activity within the last 30 minutes, as Kris chose LIVENESS a) the same day; Agora reads the register and is not a second source. The line shapes are the `ki-work-package` [Messages lines](../../../governance/ki-work-package/references/standards-work-package.md#messages-lines), and a line still confers no execution authority on whoever takes it.
- **Broadcasts:** a message to many packages is one line in each receiver's queue and one Outbound line per receiver, and a broadcast such as `REFRESH` is a pointer to the standard at its pinned revision, under the `ki-work-package` [Messages lines](../../../governance/ki-work-package/references/standards-work-package.md#messages-lines), as Kris chose BROADCAST-FORM a) and BROADCAST-POINTER a) on 7 November 2026.
- **Release notices:** After an authorised release, the releasing territory owner or coordinator sends affected owning work a release notice in its `messages.md`, or the receiving State of play's queue where no clear work owner exists. Name the released version, relevant change, compatibility, adoption steps and any reply needed. Follow the existing sender and cross-territory authority boundaries; the receiver owns adoption and any genuinely deferred record. This is a notice obligation, not release authority, consumer selection, rollout execution or foreign-record creation.
- **Inbox check at each wake:** each wake of the [inbox watch](#coordinator-responsiveness), which is the heartbeat's loop while runs go, compares `messages.md`'s last commit and the harness revision with what it last read, and acts on a new line at once, in queue order, without stopping running work. Nothing adds a wake where none is armed: territory work acts for work that is not listening under [acting for idle work](#territory-work), and shows the age of any line it leaves.

## Decisions and design

 A logged, unrevoked owner decision authorises its stated scope across sessions; ask again only for a new decision, an explicit later gate or a changed boundary. A relay is not approval, and narrower repository gates still apply.

A coordinator turns the owner's words into durable knowledge. Every owner decision is logged in the turn it arrives, in the owner's words, in the work's `decisions.md`, under the [decisions log](#decisions-log) rules; this section says how an entry is written, what becomes of it, where design notes live and what finishes Project work. A record, report or banner describes a decision by its words and date and never by its number, under Kris's rule of 2026-10-14: "I actually think we should not necessarily need to put the decision number anywhere. It should be written about what the decision was or is."

### Decisions log

Each owner decision about the work becomes one timestamped entry in the work folder's decisions log, `+/_WORK/<id>/decisions.md`, quoted in the owner's own words where possible. Where the work declares focus areas, the entry's first line under its heading opens with the area it belongs to, `focus: <id> · `, under the `ki-work-package` [focus areas](../../../governance/ki-work-package/references/standards-work-package.md#focus-areas); an entry written before then carries none. Entries carry no numbers, and a prompt, brief, record, report, work file or banner describes the decision it acts under in the owner's words and with its date: Kris said on 2026-10-13 that "it should be written about what the decision was or is", and on 2026-10-14 that a numbered citation "has no meaning to me because I don't know what the decision was ... and I don't know where the list is". A log written before the work model keeps its numbers as history.

The owner's words are whole only on the turn they arrive: a context-compressing proxy, a compaction or a shell read of a transcript can rewrite every earlier turn without saying so. Two rules keep the log faithful, on any machine and whatever the proxy setting:

- **Log in the turn it arrives:** the coordinator writes an owner decision into the log in the same turn as the message that carries it, while that turn is still uncompressed, before it does anything else with the message.
- **Verify later quotations from the file:** any later quotation of the owner's words, in a log entry, a brief, a record or a report, is checked against the session transcript file read with the runtime's file-read tool, which the proxy protects, never from in-context recall or from shell output such as `cat` or `grep`, which it does not.

The coordinator writes the log by hand or through `ki agent decide`, and commits and pushes it under [Committing the work folder](#committing-the-work-folder), so that the test Kris set on 2026-10-13 holds: "if the state folder is lost, you shouldn't lose any knowledge". The log is the work's working record between consolidations, not a replacement for them, and it is not a Decision Record: each entry is classified under [decision classes](#decision-classes) and homed under the [decisions life cycle](#decisions-life-cycle), so that nothing durable exists only in the work folder. The launcher's part, adopting the log and the close gate's decision check, is the `ki-delegation` [decisions log](../../../governance/ki-delegation/references/standards-background-runs.md#decisions-log)'s.

### Decision classes

Every log entry is one of four things, and its class says where it goes, as Kris adopted on 2026-10-14 with "adopt the four decision classes and the homeless-standalone rule". The split rests on Kris's words that "Not all design decisions need to materialise into decision records, or certainly not their own unique decision records. They may well well supplement existing ones."

| Class | What it is | Home |
| --- | --- | --- |
| Operational | Approves or steers one piece of work: a push, a tidy, an adoption, a release. Most entries | The work record or commit it drove; where there is none, the log entry is its own home until the work finishes |
| Rule | Changes how work is done from now on | The skill standard that owns the practice, through a record in the owning repository, or root `AGENTS.md` for a repository-local convention |
| Standalone | Durable rationale or authority a reader will need without the work folder: a structural or policy choice | A Decision Record, amended in place where one already owns the concern |
| Held | Open, or deferred to a later wave | Its query in `discussions.md`, under its Needs tag, until it resolves into one of the other three |

What is not a decision is not logged, under the note's Decisions life cycle: a relay from other work is a receive, an instruction to other work is a send, and an operational event such as a push, a restart or a drain is a move. Those are commits.

A roadmap record opens only for a product or standard change that needs Kris's acceptance. Operational work runs on the decisions log, the brief, the report and Git, and opens no record. Kris set the threshold on 2026-10-14, as received: "RECORD-THRESHOLD / agree: a record only for a product or standard change needing acceptance; operational work runs on the decisions log, brief and report; add it to the ki-coordination standard". `ki-work-roadmap`'s graduation test governs the shape of a record once one is due; this threshold says whether one is due at all.

### Decisions life cycle

At each mark the coordinator checks each entry against its durable home and then, under the note's Decisions life cycle: strikes it, when a standard, skill, note, record, Decision Record or commit wholly carries it; reduces it to a one-line pointer, the tag, Kris's date and a link, when it still governs live work whose home is elsewhere; or keeps it. A struck entry leaves no stub, and entries carry no running numbers. A standalone entry with no Decision Record yet is kept, and the state file's next steps carry it as `homeless: <TAG>` so the Summary shows it, until a Decision Record takes it. Who homes: an operational entry is homed by the work it drove, through `ki-accept` or the commit; a rule by the delivery that changes the standard; a standalone entry by the Decision Record's author; a held entry by whichever class it resolves into; and at [Finishing Project work](#finishing-project-work) the coordinator homes whatever is left. A conversational session homes at its recap.

The work's `decisions.md` is its one decisions list for its whole life: successive sessions on the same work share it, and it stays in the work folder, not beside the Project note. A design loop's own decisions file is a stage artefact that holds only the answers to its report's tagged decisions, and every one of those answers is also a decisions-log entry, logged in the turn it arrived.

### Design notes

Design notes of every kind - options papers, mocks, loop reports and their stage decisions - live in the work folder of the work whose concern they design, in the folder of the focus area they serve, `+/_WORK/<id>/<focus-id>/`, or in `+/_WORK/<id>/design/` in a package that declares no focus areas, under the `ki-work-design` standard and the `ki-work-package` [closed list](../../../governance/ki-work-package/references/standards-work-package.md#closed-list). No `design/` folder sits anywhere under `Streams/`, which holds only definitions and records. Design work with no coordinating work of its own takes an ad hoc work folder. The earlier `+/_DESIGN/<subject-slug>/` home, set with "DESIGN-RETENTION - (a) +/_DESIGN/<subject-slug>/ in every repository", is read for the tolerance window and moves with its territory's migration.

A design note's life cycle - draft, under review, graduated or deleted - and the rule that nothing cites a deleted note are the `ki-work-design` [artefact home](../../ki-work-design/references/standards-work-design.md#artefact-home)'s, which owns graduation; the `ki-work-package` [closed list](../../../governance/ki-work-package/references/standards-work-package.md#closed-list) sets which file kinds a focus folder or `design/` may hold. This standard reviews the design notes at each mark, under [Pruning the work folder](#pruning-the-work-folder), and resolves it before Project work finishes.

### Finishing Project work

Project work moves to Finished once only, on the owner's `finish`, after the close-out Kris confirmed with "confirm the four close-out steps":

1. every logged decision is homed under the [decisions life cycle](#decisions-life-cycle), with none left homeless or held;
2. its design notes are resolved, in its focus folders or `design/`: every note graduated and deleted;
3. the state file is set to `state: finished`, its durable information routed, and the commit `docs(work): <id> finish` made;
4. the work folder is deleted at the mark that closes it, under the `ki-work-package` [close-out](../../../governance/ki-work-package/references/standards-work-package.md#tidying-the-work-folder), Git keeping it, and the runs archived by `ki agent close`, whose gate stays strict, with `--reconciled` as the owner's waiver, as Kris settled: "keep the close gate strict with the reconciled waiver". Where the folder outlives the finishing thread, territory work closes it at an owner-authorised mark of its own whose report names the folder, under that close-out, rather than naming it in the finished work's `messages.md`, which no coordinator reads, as Kris asked under FINISHED-TIDY-KICK on 30 October 2026: "Sort out the method so that the kick actually gets the folder deleted".

Before the Finished banner, every Orca worker the work started is settled under [Closing out Orca workers](#closing-out-orca-workers). The last report is the finish report under [Templates](#templates), closing with the Finished banner.

The Project note then points at the outcome. Reopening a Project is a new opener from territory work, not a send.

## Working rules

These rules apply to every coordinator: territory work and each piece of Project work.

### The mark

The mark is only a timestamp: the default start of the next [Summary](#the-summary), as Kris approved under SUMMARY-MODEL on 4 November 2026. A Summary is distinct from `ki-recap`, which summarises one session at a lower level; the two share no format or procedure.

At each mark, perform the [repository level check](#repository-level-check) before reporting the mark.

- **Mark:** the point at which the next Summary starts by default, and at which decisions are struck and the working area tidied, struck by the owner at a moment of their choosing or by a hold. Each piece of work has one mark, and striking a new one replaces it; Git holds the history of earlier marks. The state file's front matter keeps it as `mark: <UTC timestamp>`. The timestamp bounds the logbook, work-record transitions, background-agent reports and the decisions log, whose entries carry their own timestamps. The banner and the mark describe or date a decision and never cite a number, because a number, in Kris's words of 2026-10-14, "has no meaning to me because I don't know what the decision was ... and I don't know where the list is".
- **Striking:** only the owner moves the mark, by saying `mark`, `mark only` or `mark, status only`, and a hold strikes one. Giving a Summary or a Status does not move it. The coordinator then works the [decisions life cycle](#decisions-life-cycle) on the entries, [prunes its work folder](#pruning-the-work-folder), [closes out its Orca workers](#closing-out-orca-workers), commits the work folder and confirms in one line.
- **Summary after the mark:** `mark`, and every mark struck at the end of a query set, is followed at once, in the same reply, by the [Summary](#the-summary) since the previous mark, with every open query in full, so Kris never has to ask for it; `mark only` strikes it with no Summary, and `mark, status only` strikes it and gives the [Status](#report-forms), the Summary without its history. A hold report stays the exception: a hold's mark is followed by its [hold report](#putting-work-on-hold) instead. Kris set the Summary after the mark on 31 October 2026 under MARK-THEN-SUMMARY: "you take mark, can you tell me basically you're expecting always summary in full after mark has been taken? That's I expect", and added `mark only` under SUMMARY-MODEL.
- **Outstanding:** the open and parked Needs tags in `discussions.md`, open work records in the work's scope, running or queued background agents, and parked tangents. Outstanding carries forward across marks: striking a mark resets only the window of `## Summary since <time>`, and never drops, closes or hides an open item, which the Summary's status table and `## Queries` carry in full.
- **History:** the work's history comes from the logbook and the run reports, never from `state.md`, as Kris took STATE-HISTORY on 19 October. `git log -- +/_WORK/<id>/work.md` is the history of what the work is and `git log -- +/_WORK/<id>/state.md` the history of its moves; `state.md` holds no dated log, commit runs or test counts, and may link one report or commit rather than copy it, which the `ki-work-package` rubric's history check warns on.
- **No mark yet:** a Summary runs from the thread's start, and the first `mark` strikes the first mark; where the thread's start is unknown, it runs from `work.md`'s `created_at`.

### Parking tangents

When the owner raises a side topic in passing, the coordinator records it as one dated line, says it is parked, and carries on with the current work. It does not explore the tangent unasked.

Parked tangents live in `discussions.md`'s `## Parked` section beside the parked queries, each as `- Parked <YYYY-MM-DD>: <one line>`, under the work-package standard; held work goes to `state.md`'s `## Held` with its release condition. They count as outstanding in the [Summary](#the-summary).

On request, such as "what's parked?", the coordinator lists them. When the owner picks one up, it gets a home - a Project, a work record through `ki-next`, or a line in other work's `messages.md` - or is dropped, and the coordinator removes it in the same update.

### Linking records

Whenever a session or a report mentions a roadmap or work record, a work file, a theme, a Project, a decision, a receipt or an evidence artefact, it cites the full identifier, such as `KI-HARNESS-GOV-144` rather than `GOV-144`, because area codes repeat across repositories, and uses that full identifier as the link text.

It links each one to the local file by absolute path, so that it opens in the owner's editor, resolving the repository through the KI registry (`ki registry`) where one is available. It uses the verified canonical remote URL only when there is no local copy. A query heading links to its underlying record when one exists. A link is never invented: when a target cannot be resolved, the text says so. A pruned roadmap record has no local file any more, so it is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`: the link text is always the full identifier followed by `(pruned)`, and the last revision is the last commit in which the file existed, usually the parent of the prune commit. Kris set this form on 2026-10-14, as received: "LINK-FORM / clickable GitHub link to the file at its last revision; KI-HARNESS-GOV-188's check accepts it. Perhaps the link text can be `KI-HARNESS-GOV-188 (pruned)`". A live record keeps its local-file link; a pruned record is never pointed at the Project note that carries it and never left as a bare identifier. This applies to status lines, owner reports, recaps and work files alike, and a background agent's report follows the same rule. The rubric's COORD-7 checks the reports under `+/_WORK/<id>/`, in each focus folder its `work.md` declares and in `reports/`, and under `+/_THREADS/<run>/` for the tolerance window: every full record identifier in their prose, a work record or a Decision Record, sits inside a Markdown link, and a link that names a record and targets an absolute local path points at a file that exists. The existence check applies inside the audited checkout and wherever the target's folder is present on the machine, so another checkout beside it is checked too; a target outside the checkout whose folder is absent, as every other repository is on a CI runner, is checked for shape only, a Markdown file whose name opens with the linked identifier, as [KI-HARNESS-GOV-197 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/95a1ab58/docs/roadmap/KI-HARNESS-GOV-197-pmo-7-outside-checkout-links.md) set. Fenced blocks, inline code spans, which quote literal text such as a commit subject and cannot hold a link, and Needs tags such as `ACCEPT-181` are not record identifiers and are not checked.

### Committing the work folder

The work folder `+/_WORK/<id>/` is tracked, and the knowledge in it is safe only once it is in Git on a remote. Kris set the rule on 2026-10-14: "threads need to know that they need to commit their work under +/_THREAD/", and the work model made every send a commit: "The work outlives every session and is committed at every send." So a coordinator commits and pushes its work folder at every send, every owner receive, every mark and hold and before the work finishes, by explicit path and never with another session's uncommitted changes, each commit's subject carrying the move; a line it writes into other work's `messages.md` is committed and pushed at once. Every such commit, and every message write, first passes the repository's own checks under the `ki-git` [checks before committing](../../../governance/ki-git/references/standards-git.md#checks-before-committing) rule.

**Cadence.** Kris tightened this on 25 October 2026, choosing COMMIT-CADENCE a), "Adopt cadence", after work sat uncommitted in the folder: "something that I really want to make sure happens more often is that the stuff that's in the work package gets committed because effectively changes in the local working copy are blocking the pushing and pulling of the repositories". So every session, coordinator or run, commits the work package by explicit path after every finished change, before its turn ends, and a run commits each step as it goes. It then runs a **git sync**, `git fetch`, a fast-forward pull into a clean checkout and a push under [Pushing beneath other sessions](#pushing-beneath-other-sessions), after every finished change and at least every 15 minutes while it works, as Kris asked the same night: "every change that's finished, really, we should be looking to do the sink, or every 15 minutes or something like that". A pull that cannot fast-forward goes to the conflict run that section sets. The report says plainly whether the work folder is committed, in `## Done`, or uncommitted, in `## In Progress`, under BANNER-TRIM. Owner reports and banners omit routine push state; a failed push that prevents publication of the run's own unit is reported with the unit and reason.

### Pruning the work folder

At every send and at each mark the coordinator prunes its own work folder, so that `+/_WORK/<id>/` shows only what is still open and Git history holds the rest, as the note's Shared history is never rewritten sets. Kris set the rule as THREAD-TIDY on 2026-10-14 and made it regular on 2026-10-16 by taking option a) of THREADS-TRIM. What goes, what stays, how and who are the `ki-work-package` [Tidying the work folder](../../../governance/ki-work-package/references/standards-work-package.md#tidying-the-work-folder) rules, over the folder's [closed list](../../../governance/ki-work-package/references/standards-work-package.md#closed-list): the five package files always stay; this standard keeps their timing and the judgement each needs.

- **Judgement:** whether the report's outcome, or every point of a feedback package, has a durable home in a work record, decisions log, work package or commit. In a five-file package, a report is eligible for its owning steward's tidy once its outcome is homed and every query has been copied in full into `discussions.md`; those queries need not already be answered. In the single-file tolerance shape, retain the report until its queries are answered and read back in the log, under `ki-work-package` [Tidying the work folder](../../../governance/ki-work-package/references/standards-work-package.md#tidying-the-work-folder). Keep every report whose outcome has no durable home yet, without homing it in haste; a later [Summary](#the-summary) reads a deleted report from its last revision.
- **Design notes:** at each mark the coordinator reviews the design notes in its focus folders, or `design/`, and deletes each note that has graduated under the `ki-work-design` [artefact home](../../ki-work-design/references/standards-work-design.md#artefact-home), or that the work package records as superseded; drafts, notes under review and any in doubt stay. The mark prompts the review, never an automatic deletion. Beyond graduation, a note goes only when every outcome it carried is homed, the owner's words and any grant included, and every link into it has been rewritten first; a diagram's source and its renders go together.
- **Temporary output:** the coordinator deletes, by explicit path, each `tmp/<run>/` folder of its own whose output is superfluous.
- **Record threshold:** the deletion is operational work under the [record threshold](#decision-classes) and opens no record.
- **Flagging:** the `ki-work-package` rubric's [FOLDER](../../../governance/ki-work-package/references/rubric.md) items fail a work folder holding a file outside the closed list and list as candidates for the prune every report whose Needs tags the decisions log all names, every brief whose run's report is received, every finished work's folder and an unmatched `+/_WORK_REVIEW/` folder or index line; whether each candidate's outcome has a durable home stays the owning coordinator's judgement, and the listing is never permission to delete. At its own mark territory work names each flagged folder by a line in that work's `messages.md`, and the owning coordinator prunes it at its next send, except a finished work's folder, which territory work closes itself under the `ki-work-package` [close-out](../../../governance/ki-work-package/references/standards-work-package.md#tidying-the-work-folder) instead of naming it in a message line. FOLDER-7 warns on a decisions log the `ki agent close` gate cannot read as `##` entries alone. FOLDER-6 also warns when a work's `discussions.md` holds more than eight open queries, and COORD-3 warns, under the [owner queue](#coordinating-practices) cap, when more than eight roadmap records naming a piece of Project work's Project await acceptance, counted across the Capital and the repositories beside it that name it as their Capital. A `+/_THREADS/<run>/` folder is checked against its old closed list, `decisions.md` and `<name>.report.md`, for the tolerance window.

### Closing out Orca workers

A coordinator that starts Orca supervised workers, or whose runs start them, closes out each settled worker as part of its close-out, because Orca's own orchestration guide counts supervised work as done only when "each settled worker was reused, explicitly retained, or released". Kris asked for this through the ORCA-WORKER-CLEANUP message of 30 October 2026, and ORCA-CLOSE-OUT a) was taken under ACCEPT-BY-CRITERIA on 31 October 2026, on its blind review's condition that Orca's steps and the effect of release be checked before the wording became normative. They were checked, read only, against Orca 1.4.244's `worker-release`, `worker-retain` and `worker-list` help and its orchestration guide with the `recovery-and-cleanup` reference.

- **Receive:** when the coordinator receives the report of an Orca worker it or its runs started, and Orca shows the Dispatch settled, succeeded or failed, it does exactly one of three things and names which in the receive commit: reuses the same terminal for an immediate follow-up Dispatch, retains it with `orca orchestration worker-retain --dispatch <id> --json` only at the owner's explicit request, or releases it with `orca orchestration worker-release --dispatch <id> --json`. Release is the default, and it happens as soon as the worker's completion message is received and acknowledged, in the same wake, never deferred to the mark, so that a finished worker is not left open for the owner to raise. A release that fails or is refused is reported in that wake's timed line and named in the receive commit, and the Dispatch is carried as still owing a decision. Kris asked for this through WORKER-LEFTOVERS on 1 November 2026: "can we make sure that we stop having to raise this as an issue and someone can coordinate fixing that"; `hnr.reg.email-routing` already releases each worker from its waiter on the completion message.
- **Authority:** only an accepted settlement authorises release. Absence, a timeout, an idle terminal, a heartbeat, a status, a question, an escalation, a stale or rejected completion, `unverifiable` liveness or a status-file `DONE` without a settled Dispatch authorises nothing. `terminal close` is never a substitute, and the recovery action of a `release_pending` or `release_unknown` receipt is followed exactly and reported.
- **Mark, hold and Finished:** for each Orca Run the work created, `orca orchestration worker-list --run <run id> --terminal-state reclaimable --json` returns none before a mark is struck, before a hold report and before the Finished banner; a settled worker the receive step left open, a leftover, is released then under the same authority and reported. A worker still owing a decision is named in the receive or mark commit and in the hold report's `## Left over`.
- **What release does:** release is cleanup after settlement, not cancellation. It closes only that worker's own coordinator-owned agent terminal, after archiving its output so that `worker-read` still returns it, and never closes setup, configured, reused, pre-existing or user-taken-over terminals. Release is terminal accounting, reported apart from Task status, and the worker is then listed as `released`.
- **`ki agent close`:** once `ki agent` launches runs as Orca workers, a change still to come, its close performs the receive step's release for them, and the coordinator's own step covers only workers started outside `ki agent`, such as trials and pilots.
- **History is not close-out:** close-out never deletes an Orca AI Vault session. Deleting conversation history is the owner's own choice, and no run or coordinator makes it.
- **Open point:** whether a coordinator in an Orca chat, rather than an Orca terminal, may release a worker it created is not yet proven, because release takes only `--dispatch` and Orca resolves the caller itself; the ORCA-SUBAGENT-PILOT checks it. Where release is refused, the coordinator names the Dispatch as still owing a decision and closes nothing by hand.

### Putting work on hold

Read IMPORTANT messages first, cancel every wake held by this session, the inbox watcher included, and report whether anything remains running, queued or scheduled. Work going [Snoozing](#putting-work-on-hold) re-arms the inbox watcher once the snooze lands.

On hold is the state the note's On hold paragraph sets, with its two reasons, paused and more expected, which this standard calls Snoozing, and drain is the activity into it, never a state. Kris named the parts on 2026-10-15: "a Mark is a point in time and a Hold / Drain is a Mark + stopping all work", and "hold is a better word than drain. And what happens when you go on a hold is that you drain any work that is ongoing by not restarting any." A hold is agreed only from With supervisor: the owner says `pause` or `done for now`, and a coordinator may propose one in its send. The one exception is the idle hold below, which the worker sets itself. A hold serves a move between hosts, closes work for a period, or rests work between waves, and never says which host the work comes back up on. A conversational session's ad hoc work goes On hold through a state-file update, with no hold report. Kris set the drain on 2026-10-15, in these words:

> 1. Check you are wrapped up. Nothing is running or queued: let any agent that will finish within about 15 minutes finish; otherwise stop it at a safe point and record where it stopped and how to restart it. Do what you still can to finish small open items yourself, through a run if needed. Do not start new work.
> 2. Commit and push. In every repository you or your agents touched, commit your own work by explicit path under its gate, pull with rebase, and push fast-forward only. Never use --no-verify or force-push. Name any other session's commit or uncommitted file; don't touch it.
> 3. Park everything in the checkpoint. Strike a mark. Move every open query (tag, one-line context, recommended option), held item, parked item, waiting-on item and the next step into the checkpoint, set running to nothing and state to drained, and copy into the thread folder anything from ~/.local/state/ki/agents/<run>/ needed to resume. Remove re-copied retired reports by explicit path. Commit and push the checkpoint and thread folder.
> 4. Do not make a baseline or empty commit; Kris does that afterwards.
> 5. Give a short drain report, and nothing else: [...]
>
> If you cannot drain (unpushable work or a run that must not be stopped), use the BUSY frame instead and say in one line what is blocking.

Applied under the work model, the checkpoint being the work package and the thread folder the work folder:

- **Wrapping up:** an agent stopped at a safe point has where it stopped and how to restart it recorded in `state.md`'s next steps, with its brief kept open in its focus folder or `briefs/<run>.md`, and no new work starts once the drain begins. Every settled Orca worker the work started is reused, retained or released under [Closing out Orca workers](#closing-out-orca-workers).
- **Committing:** each repository's own gate runs as usual under `ki-git`; the pull is fast-forward only into a clean checkout, under [Committing the work folder](#committing-the-work-folder), and pushing follows [Pushing beneath other sessions](#pushing-beneath-other-sessions), so stacked commits are pushed with the coordinator's own and omitted from the report. Another session's uncommitted file is named in `## Left over` and left alone. A hold report keeps nothing about pushes beyond a failure.
- **Tidy first:** before any hold, paused, Snoozing or idle, the folder keeps nothing already dealt with, under the `ki-work-package` [tidy before a hold](../../../governance/ki-work-package/references/standards-work-package.md#tidying-the-work-folder), Kris's HOLD-TIDY of 4 November 2026; the rubric fails a held folder that still does.
- **Parking:** the mark is struck under [The mark](#the-mark), decisions are struck under the [decisions life cycle](#decisions-life-cycle) and the folder pruned. The coordinator moves every open query from `## Open` to `## Parked` in `discussions.md` with its Needs tag, one line of context and its recommended option, writes `state.md`'s next steps for when the work is back in use, and sets `state.md`'s front matter to `state: on-hold` with `hold.reason`, `paused`, or `more-expected` for Snoozing, the value `ki` reads until it accepts `snoozing`, `hold.release` in words and `since`. Then it commits with the subject `docs(work): <id> hold, paused` or `docs(work): <id> hold, snoozing`, and pushes; a hold committed before SNOOZE may read `hold, more expected`. It makes no baseline or empty commit.
- **Report:** the hold report is the send that announces the hold. It opens with the [report heading](#banner), its form line reading `**⏸️ On hold · Hold report at <local time> · mark <local time>**`, or `**💤 Snoozing (on hold) · Hold report at <local time> · mark <local time>**` while Snoozing, then `## Done`, `## Parked` and `## Left over`, and nothing else: no `## In Progress`, no `## Queries` and no **Context**, **Query** or **Options**. `## Done` carries one line per repository. It closes with the On hold or Snoozing banner, which lists nothing waiting under [Banner](#banner): its counts read `⏸️ drained · 🅿️ <n> queries parked`, or `💤 waiting for a message · 🅿️ <n> queries parked` while Snoozing, and its items are only `[parked]` and `[release]`. Its closing thread line is the last line of the report; no send or resume prompt follows it.
- **Cannot drain:** work with unpushable changes or a run that must not be stopped stays With worker, blocked; its report says in one line what is blocking and closes with its thread line.
- **Drain without hold:** `drain` alone stops launching while the work stays With worker; when everything has finished the coordinator reports, its `## Done` carrying `DRAINED`, or `NOT DRAINED` with what remains. Any explicit drain check, such as "are we drained?", puts its result in `## Done` the same way, and the thread line stays the last line of the report in every case, as Kris chose DRAIN-END a), "Thread line last", on 25 October 2026.
- **Territory hold:** the owner issues it through territory work, as Kris did on 2026-10-15: "you're the only thread that's left running in the Knowledge Islands area. So now you're going to do the orderly drain down to the hold position for the state of play, which effectively puts the entire territory into a state of hold." Every piece of Project work goes on hold first and territory work last. Territory work's `state.md` next steps name the work that restarts when the hold lifts and the work that stays on hold.
- **Snoozing:** a hold that waits for more to come is Snoozing, `💤 Snoozing (on hold)`, the reason the Work Process note calls more expected, and it replaces both the more-expected hold and the listening hold. Kris set it under SNOOZE, SNOOZE-STATE and SNOOZE-HEADING on 6 November 2026, relayed by `personal.reg.household-terra`: "I think that's snoozing now. That's a better term than more expected"; "maybe on-hold snoozing should just be the Z thing ... and then it's not drained, is it underneath? So that's the wrong indication, really"; and "I'd have the glyph, which is the z's, snoozing in brackets on hold". The owner asks for it in words such as `snooze`, "hold on snooze waiting for a message" or "done for now, more to come"; regular work rests Snoozing between occurrences, and a Project may rest Snoozing between waves. The coordinator records the request in the decisions log and drains as above; once the snooze lands it re-arms the one inbox watcher, setting `listening_enabled: true` where the owner asked it to wait for a message and it was not already, and `listening_status: on`. `hold.release` reads `a message arrives, or resume`. The banner follows the [one table of states](#banner): heading `### 💤 Snoozing (on hold) · at <time>`, counts `💤 waiting for a message · 🅿️ <n> queries parked`, never `drained`, because the thread still listens, items `[parked]` and ``[release] a message arrives, or `resume` ``, then `👂 listening`. A new line in `messages.md`, or new work arriving, releases it under **Release** below and the coordinator acts on it; "stop the wake" or "stop listening" sets `listening_status: off` and shows `🔇 not listening`, the work staying Snoozing until `resume` or a message its territory's State of play handles under [acting for idle work](#territory-work). Once the session closes, the State of play acts for the snoozing package on its messages alone.
- **Idle:** a worker may put its own work into Snoozing by itself, the idle hold, and into no other hold, as Kris chose HOLD-IDLE a) and HOLD-SELF a) on 7 November 2026: "Idle is more expected set by the worker, recorded `hold.set_by: worker` and shown as `💤 On hold · idle`; there are still two reasons", and "Yes, but only into idle and only when all five conditions hold: nothing running or queued, nothing handed off, no unread message, no query with Kris, everything pushed. Paused and done for now stay Kris's words." It may go idle only while all five hold: no run running or queued; nothing in handoff to a target; no unprocessed line in `messages.md`; no open query with the owner in `discussions.md`, parked queries standing; and every repository the work touched committed and pushed. Any query with the owner keeps the work With supervisor. Its folder is tidied first, as for any hold, but idle needs no drain and no hold report: the coordinator sets `state: on-hold` with `hold.reason: more-expected`, `hold.set_by: worker`, `hold.release: a message arrives, or resume` and `since`, commits `docs(work): <id> hold, idle` and says so in one line. Its banner is Snoozing's, its heading `### 💤 Snoozing (on hold) · idle · at <time>`, the word idle standing where HOLD-IDLE put it under the name SNOOZE gave the hold. It listens only while `listening_enabled` is true, as Kris chose HOLD-LISTEN a): "Yes for more expected and idle; paused never listens." A line arriving on a listening idle thread is received by the worker at once, moving the work straight to With worker rather than Handoff to worker, because the worker is already there. The owner's `pause`, `done for now` or `snooze` turns the idle hold into the owner's form, `hold.set_by: owner`; a hold with no `set_by` was set by the owner.
- **Paused work and important lines:** a paused hold stays closed to every line, `URGENT` and `IMPORTANT` included, as Kris chose HOLD-URGENT a) on 7 November 2026: "The line waits. State of play puts it to Kris as a `resume` query, and genuinely urgent work goes to a live owner instead." The line waits unread; its territory's State of play, acting for the held work under [acting for idle work](#territory-work), shows the count and puts an important or urgent line to the owner as a `resume` query in its own `discussions.md`, the package staying paused until the owner answers; a sender with genuinely urgent work sends it to a live owner under [Urgent work](#messages-between-work) rather than into the paused queue.
- **Release:** `resume`, the release condition being met, or, while Snoozing, a new message or new work arriving, moves the work to Handoff to worker; the coordinator re-reads the work package, moves the parked queries back to `## Open` in `discussions.md` and starts from `state.md`'s next steps. `finish` moves it to Finished. A paused hold older than 31 days is flagged in the views.

### Unattended windows

An unattended window is an episode in With worker, not another state: a period the owner grants for work to go on without them, under the **Away grants** rule of [Coordinator responsiveness](#coordinator-responsiveness). Kris set its rules on 25 October 2026, going to sleep with "you've had my remit to do or progress things unattended without me until 9 a.m. tomorrow morning", taking WINDOW-CLOCK that night and RETURN-FORM, DENY-LIST, WINDOW-PLAN, CONFLICT-RUN and PROGRESS-SCOPE each as its recommended option a), the last four with their blind review's additions. A window is a mode on top of normal coordination, not a replacement for it: the inbox watch, the heartbeat, the reports and every other rule here carry on through it, as Kris set under UNATTENDED-AWAKE on 31 October 2026: "Unattended mode is like an additional step-in mode."

- **Clock:** every window end is recorded as local time with its zone and as UTC. Where the owner's words are ambiguous, such as a clock time spoken across a clock change, the earlier instant is taken and the read-back says so.
- **Grant:** the grant is recorded in the decisions log under **Away grants**, within the `ki-delegation` [default deny list](../../../governance/ki-delegation/references/standards-background-runs.md#unattended-deny-list), naming any item of the list it lifts. Force-push and `--no-verify` are never lifted.
- **Entry:** before the owner leaves, packed queries are unpacked under the [split rule](#query-review) and the mark is struck. The plan goes into `state.md`'s next steps: the units in order, each with its repository, authority, tier, what it waits on and its size, then the excluded units with their reasons. A unit whose authority still needs a decision is parked, not planned. Each repository's `origin/main` and local `main` revisions are recorded in the window's decisions entry. The entry report shows the plan and says how the session and its machine are kept awake, under **Awake**, and the window starts without confirmation.
- **Awake:** the window keeps the leading chat session alive and keeps the machine leading it awake for the window, as Kris set under UNATTENDED-AWAKE on 31 October 2026: "a key part of unattended mode is that you do keep the chat session alive ... and therefore you try to keep the machine awake that is then leading that chat session". On macOS the coordinator holds a power assertion tied to the session's process, `caffeinate -dims -w <session pid>`, started detached at entry; elsewhere it uses the platform's equivalent, such as `systemd-inhibit` on Linux. It releases the assertion at expiry, an explicit return or "stop the wake", and the assertion ends with the session in any case. Where the machine cannot be kept awake, the entry report says so and the window promises less.
- **Banner:** while the window runs, its banner carries `- [window] until <end> · stop the wake`.
- **Progress:** within the grant, the coordinator plans already adopted, authorised Now or Next draft records to Ready and delivers eligible Ready records to awaiting review, in `ki-batch` waves citing the grant. Each wave is frozen before delivery, and dependencies and the [owner queue](#coordinating-practices) cap are honoured. Adoption, discretionary promotion, acceptance and pruning stay with the owner. Each outcome-mode `ki-batch` envelope is per-repository, cites the grant in `authority_evidence`, expires no later than the window and cannot widen the grant. New findings return as queries or, when the owner requested findings, in the reporting package's `findings/`; the receiving coordinator applies `ki-next`'s [capture rule](../../ki-next/references/standards-next-work.md#capture-substantive-prospective-work) at return. PROGRESS-SCOPE does not authorise a background run to create new records.
- **Sync and conflicts:** the git sync runs under [Committing the work folder](#committing-the-work-folder), and a pull that cannot fast-forward goes to the conflict run under [Pushing beneath other sessions](#pushing-beneath-other-sessions), so conflicts are dealt with inside the window.
- **Questions:** a question put to the owner during the window is asked in plain text in the thread, never through a blocking question prompt, since nobody is there to answer it and the coordinator must stay responsive, and waits a couple of minutes at most. Unanswered, it is parked as a query for the return report, keeping its tag, Context, Query and Options, nothing is done on the matter it raised in either direction, and the other authorised work carries on; silence is never consent, and no default or recommended option stands in for the answer. An answer that arrives later in the window is an ordinary owner decision from then on, read back in the decisions log. Kris set the rule on 25 October 2026: "If you ask me for input as well in ... an unattended period, you should only really ask it for a couple of minutes. And if I don't respond, then you should not take any action from it", under the `ki-delegation` [questions rule](../../../governance/ki-delegation/references/standards-background-runs.md#questions-in-a-window).
- **Expiry:** at the end, an explicit return or "stop the wake", the coordinator stops launching, receives the runs that finish and reports.
- **Return:** the return report is the [Summary](#the-summary) since the window's mark, extended across the repositories the window touched: this work's own units in detail, other sessions' commits counted against the revisions recorded at entry, each failure beside its unit, and a closing list of misses, such as usage-limit stops, missed processing and failed runs. An optional interactive walk-through follows, under **Questions** in [Coordinating practices](#coordinating-practices), then strike the next mark only once the owner has seen the return report or completed the walk-through.

### Headless passes

A headless pass is one bounded coordinator turn run without a live session: a machine scheduler starts it, it reads one work package, does only what that package already authorises, commits and exits. It is the durable wake a session-only schedule cannot give, since a session's schedule fires only while the session is idle and dies with it. Kris chose it on 26 October 2026 under WAKE-SUBSTRATE, taking the recommended option: write this contract first, then hand the job to the Rig and chezmoi works as a `messages.md` line. The job's design and install belong to Rig, chezmoi and tools-ki, under the `ki-delegation` [dotfiles and software](../../../governance/ki-delegation/references/standards-background-runs.md#dotfiles-and-software) rule; this standard sets what a pass may do and installs nothing. The deferral of launchd set under OOS-WAKE is lifted in that order; doorbells and extra liveness fields stay deferred, and nothing here says the job has shipped.

- **Trigger:** the scheduled job is shell-only and spends no model time of its own. For each work it watches it asks three questions: has the work's `messages.md` changed since the job's last stamp, has one of the work's runs finished under `ki agent status`, has a deadline the package records passed, such as a window's end, a hold's release date or a dated next step? If none has, it writes its stamp and exits. If one has, it starts one pass for that work. A firing on a Mac that was asleep is coalesced into one, under launchd's `StartCalendarInterval`, so a pass never fires more than once for a missed interval.
- **Which work:** a pass runs only for work that names it: an open [unattended window](#unattended-windows) whose grant names headless passes, or a standing decision in the work's own decisions log that names them and what they may do. Work that names no pass is stamped and left alone, and the change it carries waits for the next attended wake. A pass never runs for work On hold or Finished.
- **What a pass may do:** exactly what the coordinator does at a wake, within the [turn budget](#coordinator-responsiveness): read the package, the five files and every open finding; act on each `messages.md` line in queue order under [Messages between work](#messages-between-work); receive each finished run, copying its queries into `discussions.md`, recording its disposition and tidying under [Pruning the work folder](#pruning-the-work-folder); launch only the units the plan in `state.md`'s next steps and the recorded decisions already authorise, through `ki agent`; record each move in the decisions log and `state.md`; commit the package by explicit path and sync under [Committing the work folder](#committing-the-work-folder). It asks no question and waits on no answer: whatever needs Kris becomes a query in `discussions.md`, and nothing is done on that matter in either direction, under the window rule that silence is never consent. It never opens, releases or finishes work, accepts or prunes, adopts or promotes, answers its own queries, widens a grant, launches a unit the plan does not name, edits another work's folder beyond one `messages.md` line, or runs a command that may wait on a permission prompt.
- **Authority:** a pass carries no authority of its own; it acts within the grant or decision that names it, under the `ki-delegation` [authority tiers](../../../governance/ki-delegation/references/standards-background-runs.md#authority-tiers), its [unattended deny list](../../../governance/ki-delegation/references/standards-background-runs.md#unattended-deny-list) and [criticality test](../../../governance/ki-delegation/references/standards-background-runs.md#criticality-test). Its own tier is `push` at most: it commits the package and syncs under the standing push rule, fast-forward only, never forced and never with `--no-verify`, and hands a pull that cannot fast-forward to a conflict run. A `release` or `prune` tier belongs to a run the pass launches with its cited decision, never to the pass itself. The confidential rule and the connection-critical rule hold unchanged. A pass that finds its grant expired does only the receive bookkeeping, copying queries and recording finished runs, and launches nothing.
- **Model budget:** a pass runs on the coordination-purpose model `ki-tokenomics` recommends, `fast` or `standard` at low reasoning effort, with the heavier models left to the runs it launches. It spends model time only when the trigger found something new, keeps to the five-tool-call turn, and stops when the queue is acted on, at a wall-clock limit the job sets, or at ten turns, whichever comes first; what it has not reached waits for the next firing. It never retries inside one firing.
- **Overlapping passes:** at most one pass per work at a time: the job holds a lock per work, and a firing while that work's pass runs is stamped and skipped. A pass never runs for work whose coordinator session is live; how the job tells liveness is its design, and until that is settled a live coordinator stops the job for its work with "stop the wake". Passes for different works may run together only in different repositories; passes writing the same repository are serialised, under the `ki-git` write window. Before writing, a pass re-reads any package file whose last commit is newer than its read, under the stale-edit rule, and keeps the other writer's change.
- **Unavailable capacity:** when the model cannot be reached, because the plan's usage limit is hit, the provider is down or the runner cannot authenticate, the pass exits without acting, writes the reason to the job's log and leaves its stamp unchanged, so the same trigger fires the next pass. It retries only at the next scheduled firing, never sooner, and never backs off further. When `ki agent` has no worker capacity, the pass queues the unit under the [run queue](../../../governance/ki-delegation/references/standards-background-runs.md#run-queue) and does not wait. Each stop is a miss the next attended report lists; a trigger is not processed work.
- **Report:** a pass sends nothing to Kris and writes no owner report. Its record is the decisions log: one dated entry per pass that moved anything, naming the lines acted on, the runs received and the units launched, in the commit that carries them, so the next session reads what happened from the package alone. A pass that found nothing to do writes nothing in the repository. The next attended Summary or return report carries what passes did since the mark under [the Summary](#the-summary), with each miss beside its unit: usage-limit stops, skipped firings, passes that found a live session and runs that failed. While the job watches a work, the banner carries it as a `[scheduled]` item under the **Scheduled wakes** rule in [Coordinator responsiveness](#coordinator-responsiveness), naming the launchd job, its observed next firing, its durable lifetime, its expiry and "stop the wake".
- **Stopping:** "stop the wake" stops the job starting passes for that work, recorded in the decisions log and dropped from the banner; a hold drains it under [Putting work on hold](#putting-work-on-hold); Finished removes it. A pass stops a run only when Kris has named it and said stop, as any coordinator does.

### Picking work up

Prefer a fresh session once the package contains everything needed to resume.

The work package alone says how work is picked up. Kris set the principle on 2026-10-15, "the first thing in a checkpoint should be about how a checkpoint is picked up from", and the work model replaced the pick-up block with the state file's front matter: its state, since, hold and mark, with the holder derived from `work.md`'s worker and supervisor, say where the work lies, and its next steps say what the worker does when it is back in use. Every send, receive, mark and hold rewrites `state.md`'s front matter to agree with the banner the report closes with; `work.md` changes only when the definition does. Neither file records a session host seat; an inventory-based host requirement may appear in the work label under `ki-work-package`.

| State | First on pick-up |
| --- | --- |
| With worker | Recovery, not a planned restart: reconcile each running and queued agent against `ki agent status`; one not found counts as stopped and restarts from its open brief |
| Handoff to supervisor, With supervisor | Re-read the work package, take the owner's answers, mark, Summary with the open queries carried forward |
| Handoff to worker | Receive: re-read the work package, read back the owner's answers, restart authorised work |
| Handoff to `<target>` | Check the target's state; stay in handoff until it receives or replies |
| On hold | Only on `resume`, the release, or territory work's next steps naming it: put the parked queries back and continue from the next steps; a line routed meanwhile waits in `messages.md` without waking it |
| Finished | Nothing resumes. Reopening is a new opener from territory work |

Before resuming on another Mac, perform the [repository level check](#repository-level-check); do the same before leaving a host.

**Pick-up reads.** Picking work up stays within the [turn budget](#coordinator-responsiveness), as Kris took PICKUP-READS on 19 October. One read of the package's files counts as one call: all five files at bootstrap and re-anchoring, and otherwise the four pick-up files, `state.md`, `messages.md`, `discussions.md` and `decisions.md`, `work.md` being read again only when it has changed. A write to the package's files with a brief counts as one write set, so the five-call budget is not spent before the first launch. After bootstrap the coordinator reads only what changed since its last read, plus the entries that bear on the question, not every decision and query at each owner message. The owner report's `## Queries` is rendered from `discussions.md`'s `## Open`.

The closing thread line identifies the work to pick up; no session is given a copyable send or resume prompt beyond the [restart suggestion](#banner) when one of its triggers holds. Before acting, the coordinator verifies the id and exact label against `work.md` and grounds itself in the primary checkout of the repository holding the package. It re-bootstraps, re-reads the package and takes stock from the decisions log, `ki agent status`, `messages.md` and the owner's messages, then follows the state-specific first steps above and restarts authorised work. Whatever must be done first on pick-up is an important `FIRST-STEP` line in `messages.md`. Work that others wait on writes `READY` into territory work's `messages.md`, and territory work then identifies each waiting piece by its thread line in its own order.

An old-shape checkpoint keeps its pick-up block, read as the table above through the mapping in [The work model](#the-work-model), until its territory's migration moves it.

### Work awaiting review

`+/_WORK_REVIEW/<id>/` is the holding area for migrated work a territory's migration was not confident is live, under MIGRATION-REVIEW of 18 October; its shape, index note, leaving rules and checks are the `ki-work-package` [Work awaiting review](../../../governance/ki-work-package/references/standards-work-package.md#work-awaiting-review) section's. For coordinating work it is not live: it is neither picked up, dispatched nor counted against the cap, and `ki work status` keeps it out of the five views and shows it as a count.

**Raising the holdings.** Territory work brings the holding area to the owner's attention, as Kris decided under REVIEW-SURFACE on 19 October: "well I think state of play threads need to bring that to attention then when they come back". At bootstrap, at resume and at re-anchoring, territory work lists every item in its territory's `+/_WORK_REVIEW/` areas and raises them as one query, tagged `REVIEW-HOLD`, with a live-or-dead recommendation for each item: a live item moves into `+/_WORK/` as a work package under the work-package standard, and a dead item is deleted, Git keeping its history. It raises the query again each time it comes back until every area is empty. The native rubric warns while a Capital's area holds anything.

### Acceptance bundles

Records awaiting acceptance reach the owner as one bundle per work, and territory work brings them first. Kris adopted ACCEPT-BUNDLE on 2026-10-20: "from Knowledge Islands perspective, I think we need to accept them ... happier for us to go through that ... definitely something that should happen as the first point of call in the state of play".

- **When:** at bootstrap and at resume, territory work's first call on the owner, before any other query, is the territory's `awaiting-review` records; Project work brings its own at each handoff to the owner.
- **Shape:** one `ACCEPT` query per work, tagged with the work's name, listing each record oldest first, linked under [Linking records](#linking-records), with its outcome and any concern in one line. The owner answers in one word, `ACCEPT`, or `ACCEPT` with the exceptions named.
- **Grant:** the coordinator quotes the answer in the decisions log with its source and lists the exact records it covers, which is the standing human grant the `ki-accept` [closure authority](../../ki-accept/references/standards-acceptance.md#2-obtain-closure-authority) recognises. A named exception stays `awaiting-review` and keeps its own query.
- **Closure:** one `ki-accept` run per repository closes the accepted records from that quotation and prunes them in the next prune-only commit; the coordinator never accepts a record in its own turn.

### Worktree sweep

At each mark territory work sweeps its territory's repositories for work left between a run and `main`, and reports only what it finds. It reads each repository's linked worktrees, branches not merged into `main`, stashes and mains ahead of their upstream, through `ki agent status --worktrees` once that exists and through read-only Git until then, and shows each finding in its banner as `- [stranded] <worktree or branch> · <owning work>`, `[branch]` or `[stash]`, whatever its age; a clean sweep adds nothing. Routine push state is omitted from the sweep report and banner. The sweep removes nothing: integrating goes to the owning work, and a stash drop, branch deletion or worktree removal goes to the owner by name under the `ki-git` [clean-down](../../../governance/ki-git/references/standards-git.md#clean-down-state) rule. It reports Git state, not age, so it is not the date-based draft sweep Kris declined under STALE-SWEEP. Kris took WORKTREE-START a) on 2026-10-20, "do whatever that needs to be", whose option read: "Start now in code repositories under F1 and F4", F4 being this sweep.

### Pushing beneath other sessions

Several sessions commit into one checkout, so a session's commits can sit on top of another's that are not yet pushed. Kris set the first rule on 2026-10-14, that each session commits its own work and pushes only when its own commits alone are stacked, and replaced its push half on 25 October 2026, choosing "Tonight's rule always" under PACKAGE-PUSH, read back as: "as a standing rule, a session may push everything stacked on `main`, other sessions' commits included, fast-forward only, never forced, never `--no-verify`, stopping on divergence; this supersedes the 14 and 19 October own-commits-only rule".

- **Commit:** every session, a coordinator or a background agent, commits its own work by explicit path, under the `ki-delegation` [coordination](../../../governance/ki-delegation/references/standards-background-runs.md#coordination) rules, and never commits, reverts or stashes another session's files.
- **Push:** before pushing it fetches. When local `main` is ahead of its remote and fast-forwards it, it pushes everything stacked, its own and other sessions' commits alike, under its authority and where the repository's own rules allow. It never force-pushes and never uses `--no-verify`. When the branches have diverged it stops, and the pull goes to the conflict run. Under PUSH-NOT-WITH-YOU of 2026-10-19 a push is never put against the owner: it is not a `[with you]` item, a "with you" count or a query.
- **Conflict run:** a pull that cannot fast-forward goes to a bounded resolve run at push tier in its own worktree, as Kris took CONFLICT-RUN a) on 25 October 2026. It rebases only this work's unpublished commits onto the remote and verifies them, and stops on another session's content, uncertain ownership or a judgement call; file ownership alone does not prove a file holds no other session's content. Park a blocking query and make no further push from that repository in the window when it stops, under the delegation [conflict-run boundary](../../../governance/ki-delegation/references/standards-background-runs.md#conflict-runs). Nobody stashes, rebases or resets in the coordinator's checkout.
- **Report:** owner reports, run reports and banners omit routine push state and other sessions' stacked commits. If a run's own unit could not be published because its push failed, its `## Done` names the affected unit and reason. A hold report keeps nothing about pushes beyond a failure.

### Repository level check

Before work resumes on another Mac, at every mark, and before leaving a host, check the work's repositories are level: run `mgit fetch` across those repositories, then read `mcp-git-audit`'s ahead and behind report. Use the repositories in the work's scope; territory work checks its estate. Fetch and inspection do not authorise a push or a change to another writer's working tree.

Carry each repository that is behind its remote as a line in the next report's `## In Progress`, or a 🤖 line of a Summary's status table, `<repository>: <count> commits behind`, until a fresh check proves it level; under BANNER-TRIM it is no longer a banner item. Read ahead findings under [Pushing beneath other sessions](#pushing-beneath-other-sessions); an unpublished change must not disappear during a host handoff. A failed or unavailable check is unknown, never level: report the affected repository and what prevented the check. Reconcile a behind checkout only under [Keeping primary checkouts current](#keeping-primary-checkouts-current), leaving dirty or diverged checkouts for their owner. An On hold banner still follows its existing parked-and-release form.

Kris approved this check on 18 October 2026, “sync guard. Yeah, got your recommendation”, and narrowed the delivery to the level check and its behind finding on 22 October 2026. Queue transfer, host-bound runs and the old session's closing form remain outside this rule. The [deferred host-move design notes](sources.md#deferred-host-move-evidence) preserve the open questions and historical transfer evidence; they grant no implementation authority.

### Keeping primary checkouts current

Background agents work in worktrees and push their own commits, so the owner's primary checkouts fall behind. The coordinator fast-forward pulls each affected primary checkout periodically: after a background agent that pushed finishes, and before a Summary.

It pulls only with `--ff-only` into a clean checkout. A checkout with uncommitted changes, or one that has diverged from its upstream, is skipped and reported to the owner rather than stashed, rebased or reset. The pull is a quick one-step check under [Coordinator responsiveness](#coordinator-responsiveness); anything needing repair goes to a background agent or the owner.

### Refreshing this guidance

A coordinator re-reads this standard on its own, without the owner asking:

- at bootstrap or re-bootstrap;
- before each state-file update;
- whenever the skill has changed since its last read;
- on an important `REFRESH` line in its `messages.md`.

To detect a change, it compares the latest commit touching `skills/change-management/ki-coordination`, `skills/governance/ki-work-package`, `skills/governance/ki-delegation` or `output-styles/ki-coordinator.md` in the `ki-agentic-harness` checkout, from `git log -1 --format=%h -- skills/change-management/ki-coordination skills/governance/ki-work-package skills/governance/ki-delegation output-styles/ki-coordinator.md`, with the revision it last read, which it keeps in `state.md`'s front matter as `method_read`; one revision vouches for the three skills and the output style. It then follows the current text, sets `method_read`, and, when anything changed, tells the owner in one line what changed. Setting `method_read` is the confirmation, so no acknowledgement message is sent. This is the selected coordinator's own check; the generic hook does not read packages or method history.

METHOD-NUDGE, adopted on 25 October 2026, formerly scanned checkout packages in the hook. The 29 October quiet-hook correction removes that scan because the payload does not prove session selection and role. A changed delegation contract or output style still requires the coordinator's own revision check and targeted refresh below; full session-sensitive detection remains deferred.

**Targeted refresh.** After an approved method change lands, the sender writes one dated `REFRESH` line, flagged important so that it is taken before ordinary lines, only into the `messages.md` of works whose `method_read` predates the change and whom the change affects, linking the standard at its revision and stating the practical effect in a sentence, as Kris took REFRESH-TARGET on 19 October. While Ways of working is defining the method it sends these lines itself, under WOW-REFRESH, and afterwards territory work sends them under [Stewardship of continual improvement](#territory-work). A sender may replace its own earlier `REFRESH` line not yet acted on, so changes coalesce, and the replacement keeps every pending effect of the line it replaces. The receiver rereads at its next safe point, before launching further work. Held work is not woken; the line waits. The bootstrap and update revision checks above stay as the fallback.

**Landed notices.** When Ways of working delivers a change that a thread asked for, or that changes how a thread works, it sends that thread a targeted `REFRESH` line, under the rule above, saying what landed and what it changes for that thread, as Kris set under LANDED-NOTICE on 31 October 2026. A coordinator that takes such a line, or finds its `method_read` behind at bootstrap, says in its next reply, in a line or two, how its own behaviour has changed, naming the Ways of working change; it needs no acknowledgement message, since setting `method_read` remains the confirmation.

## Mechanical boundary

The native rubric is thin and complementary to `ki-work-package`'s. It checks only what the repository shows: a Capital holds its territory work and no other repository does; each piece of Project work names a Project that resolves in the Capital's registry, its title ends in the Project's title, and any theme resolves too; the level each work file declares agrees with its id; the active Project work is within the cap; every full record identifier in a report under `+/_WORK/` is a link to an existing file, as [Linking records](#linking-records) describes; recommended options carry their confidence and no query marks more than one option recommended; each work folder holds only its closed list and reports with open queries; and no work is over the owner-queue cap of eight open queries or eight records awaiting acceptance. For the tolerance window it reads `+/_CHECKPOINTS/` and `+/_THREADS/` as before and warns on each, naming its new home, warns on a theme that resolves only in `Streams/Initiatives/` until 7 November 2026 and fails it from that day, and it accepts `+/_WORK_REVIEW/` as a holding area, warning while the area holds anything so that territory work raises it. It cannot judge whether a coordinator kept its turn budget, whether a report took the owner-report shape under its report heading and closed with the glyph banner, whether a spoken answer was read back, whether a recap covered the window since the mark, whether decisions were struck, pointed or kept, or whether the coordinator refreshed this guidance; the COORD judgment items review those from transcripts, reports and work files the owner selects.
