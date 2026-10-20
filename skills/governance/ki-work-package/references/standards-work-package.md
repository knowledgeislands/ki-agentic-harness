# Work-package standard

A work package is one piece of work above a work item, packaged as a skill is: a definition read first and changed rarely, and detail files read only when a reader needs them. It lives in its work folder, `+/_WORK/<id>/`, which holds its five files - the work file `work.md`, the state file `state.md`, `queries.md`, `messages.md` and the decisions log `decisions.md` - beside the reports and briefs of its runs and its design notes. Together they let a fresh agent, or State of play routing new work, understand the work and pick it up without relying on a transcript, private runtime state or a vendor session. Git is the logbook: each move is a commit, so the package keeps no moves list and no history.

The work model is the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) note's, decided by [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md). The skill was `ki-checkpoint` until Kris answered WORK-FOLDER-NAME on 18 October 2026, read back as `ki-work-folder`, and became `ki-work-package` when Kris answered on 19 October 2026, "I want `ki-work-package` please, where it lives is a folder", read back as PACKAGE-NAME: "the idea and its skill are the work package, `ki-work-package` (renamed from `ki-work-folder`); the place it lives is still called the work folder, `+/_WORK/<id>/`". Under STATE-FILE the same day a package has five files, and under FILES-AT-CREATION all five exist from creation, "so others can queue work into `messages.md` at once". The session-level checkpoint remains the conversational word for writing the package's state before a pause.

## Contents

- [Activation and ownership](#activation-and-ownership)
- [Location and identity](#location-and-identity)
- [The work folder](#the-work-folder)
  - [Closed list](#closed-list)
  - [Entry points](#entry-points)
  - [Tidying the work folder](#tidying-the-work-folder)
  - [Messages lines](#messages-lines)
  - [Work awaiting review](#work-awaiting-review)
- [Exact package form](#exact-package-form)
  - [Work file](#work-file)
  - [State file](#state-file)
  - [Queries file](#queries-file)
  - [Messages file](#messages-file)
  - [Decisions log](#decisions-log)
  - [Size limits](#size-limits)
- [Progressive reveal](#progressive-reveal)
- [The single-file shape](#the-single-file-shape)
- [Old checkpoints](#old-checkpoints)
- [Work identity and native sessions](#work-identity-and-native-sessions)
- [Optional runtime reminder consumers](#optional-runtime-reminder-consumers)
- [Update lifecycle](#update-lifecycle)
  - [Recap-supplied hand-off evidence](#recap-supplied-hand-off-evidence)
- [Resume lifecycle](#resume-lifecycle)
- [Removal lifecycle](#removal-lifecycle)
- [Prohibited payloads and claims](#prohibited-payloads-and-claims)
- [Audit and conform boundary](#audit-and-conform-boundary)

## Activation and ownership

The capability is optional. A repository declares `ki-work-package` in `.ki.toml`; the declaration is an empty capability marker and requires no physical subarea, because a work folder is created when its work opens. The repository owns its work packages; Git supplies any recovery history.

This standard is the one specification of `+/_WORK/<id>/` and `+/_WORK_REVIEW/<id>/`, as Kris answered WORK-FOLDER-OWNER on 18 October 2026, read back as "the work-folder skill is the canonical specification; ki-coordination timing and judgement; ki-delegation run side only; ki-work-design graduation; others check in on the four-point contract". It owns the package's shape, its closed list, its entry points, the tidy and prune rules, the review area and the Messages line shape, and each file's form at every level, coordinated or not. The other owners keep only their side and link here for the rest:

| Concern | Owner |
| --- | --- |
| When a folder is tidied, at send, mark, hold and finish; whether an outcome has a durable home; the decisions log's entry form and life cycle; the report forms; acting on the message queue, route receipt and the inbox check | `ki-coordination` |
| The run packet, the state folder, the launcher and the close gate, and the brief and report paths for runs | `ki-delegation` |
| A design note's life cycle: draft, review, graduation and deletion | `ki-work-design` |
| The generic `+/` scaffold and the working-area coverage signal | `ki-repo` |

## Location and identity

A work package lives in one work folder, `+/_WORK/<id>/`, one per piece of work above a work item; a work item has no package, because its record is its home. `<id>` is the work's dotted id under `ki-coordination`'s [Work naming](../../../change-management/ki-coordination/references/standards-coordination.md#work-naming), which defines the id, slug and title: lower-case kebab segments joined by `.`, never a host, an underscore or a runtime session identifier. The folder name, the `id` field of `work.md` and of `state.md`, and each file's H1 agree exactly.

`+/_WORK/` holds only work folders, each a physical directory with its work file. Symlinked, nested, timestamped, archived and alternate layouts are invalid. Migrated work awaiting review sits in `+/_WORK_REVIEW/<id>/` under [Work awaiting review](#work-awaiting-review); its files are checked only when the folder leaves review.

## The work folder

### Closed list

A work folder holds these kinds and nothing else:

| Kind | Path | Kept until |
| --- | --- | --- |
| Work file | `work.md` | The mark that closes finished work |
| State file | `state.md` | The mark that closes finished work |
| Queries file | `queries.md` | The mark that closes finished work |
| Messages file | `messages.md` | The mark that closes finished work |
| Decisions log | `decisions.md` | The mark that closes finished work |
| Run report | `<name>.report.md` | A tidy finds its outcome homed, its queries having been copied into `queries.md` at receive |
| Brief | `briefs/<run>.md` | Its run's report is received |
| Feedback package | `feedback/<date>-<slug>.md`, the owner's consolidated feedback on a document the work produced | A tidy finds every point in it homed |
| Design note | `design/<slug>.md`, or `design/<subject>/` holding the same kinds | It graduates under `ki-work-design` or is recorded as superseded |
| Design artefact | `design/**/*.architecture.json` and the other diagram sources, with their `.svg` and `.html` renders | Its note goes |

The five package files exist from the work's creation, `queries.md`, `messages.md` and `decisions.md` starting as `None`, so a reader never meets a missing file and a sender never creates one. Anything else does not belong: scripts, screenshots and other images that are not a diagram's render, `scratch/` folders and the output of tools. Temporary output belongs in the run's temporary directory, `$TMPDIR/ki-agents/<run>/<name>/`, outside every repository, under the `ki-delegation` [run packet](../../ki-delegation/references/standards-background-runs.md#run-packet). The rubric's FOLDER family fails a file outside this list and warns on each tidy that is due. A coordinator's own Summary is a message, not a run report, and is not saved into the folder.

### Entry points

Every writer is a named entry point with its permitted kinds, and every other party only reads. This standing contract implements the ownership set out in [Activation and ownership](#activation-and-ownership) and is the contract other skills, tools and runs check in on:

1. **One owner sets the shape and the tidy rules:** this standard sets the closed list, what each entry point may write, when each kind goes and how a deletion is made.
2. **Every other writer is a named entry point** with its single permitted kind, in the table below.
3. **Only the folder's own work deletes.** The launcher, runs, other work and tools never delete there.
4. **A check backs each entry point mechanically,** through the [rubric](rubric.md); the judgement whether an outcome has a durable home stays with the work's own steward under `ki-coordination`.

| Entry point | Writes | Never |
| --- | --- | --- |
| The work's own steward: its coordinator, or for regular and ad hoc work the session working it | `work.md`, `state.md`, `queries.md`, `decisions.md`, the removal of lines from `messages.md`, `briefs/`, and the deletions of a tidy | Another work's folder, except one line in its `messages.md` |
| The launcher, `ki agent` | `<name>.report.md`, copied in from the run's state folder; a state-folder `decisions.md` adopted where the folder has none; entries `decide` and `reconcile` append to `decisions.md` on the steward's instruction | Deletes anything, or replaces a report Git does not already hold |
| A background run | Its work product in its owning home, and `design/` where its brief names a design note | Its report straight into the folder: it writes the report to its state folder and the launcher homes it |
| `ki-work-design` and design runs | `design/` | Other kinds |
| Other work and State of play | One line in `messages.md`, added or replacing its own line not yet acted on, committed alone | Any other edit |
| The owner, through the Observatory | One `feedback/<date>-<slug>.md` package and one `messages.md` line linking it, committed together | Any other edit |

The `description` in `work.md` is written by the work's steward, at seeding with State of play; State of play proposes a change to it by a line in `messages.md`. Readers, such as `ki work status`, the Observatory, `ki agent close` and the rubrics, change nothing; a change of shape names them as consumers.

### Tidying the work folder

A tidy keeps the folder to what is still open, with Git history holding the rest, as Kris set under THREAD-TIDY on 2026-10-14, as received: "at each mark the thread deletes every report whose queries are all answered and whose outcome has a durable home, keeping only reports with open queries and decisions.md, with Git history holding the rest", and made regular on 2026-10-16 with THREADS-TRIM. `ki-coordination` says when a coordinator tidies, at every send and each mark; regular and ad hoc work tidies at its own next update.

- **Queries leave reports at receive:** when the steward receives a run report it copies each of its queries, whole, into `queries.md` under QUERIES-FILE, so a report is kept only until its outcome is homed, not until its queries are answered.
- **What goes:** every `<name>.report.md` whose outcome has a durable home, a work record, the decisions log, the package or a commit, its queries already in `queries.md`; every `briefs/<run>.md` once its run's report has been received; every `feedback/<date>-<slug>.md` once every point in it has a durable home; and, at a mark, each design note the steward's review finds graduated or superseded, under the `ki-coordination` [design-note guards](../../../change-management/ki-coordination/references/standards-coordination.md#pruning-the-work-folder). In a folder still in [the single-file shape](#the-single-file-shape), a report also waits until its queries are all answered and read back in the log.
- **What stays:** the five package files, always; every report whose outcome is not yet homed; every brief whose handoff is open; every feedback package with a point not yet homed; and each design note until it graduates or is recorded as superseded.
- **How:** in one commit by explicit path, `git rm` of each file named and nothing else, never a folder-wide delete, so that Git history holds every report and a later recap or full summary reads a deleted one from its last revision. The deletion is operational work and opens no record.
- **Who:** each piece of work tidies only its own folder. Territory work never tidies another work folder; it names each folder the rubric flags in a line in that work's `messages.md`, and the owning work tidies at its next send.
- **Close-out:** finished work's folder is deleted at the mark that closes it, in one commit, once its decisions are homed and `design/` is resolved, under [Removal lifecycle](#removal-lifecycle).

A report whose outcome has no durable home yet is kept, not homed in haste. The rubric lists candidates; a listing is never permission to delete.

### Messages lines

`messages.md` is the work's incoming queue: one list item per message sent to the work, in this shape:

```markdown
- <YYYY-MM-DD> · <TAG> · <sender title>: <the owner's words or the instruction, with links>
- IMPORTANT · <YYYY-MM-DD> · <TAG> · <sender title>: <the instruction, with links>
```

A line is about 60 words at most with the detail linked, and a message citing an owner decision quotes its words. The queue is taken in priority order, as Kris set under WORK-QUEUE-PRIORITY on 19 October 2026, read back as "a work package's incoming work is a queue taken in priority order; the worker may group similar items; a line added at the top with an important flag must be taken first, in that order, which lets State of play change how a work works":

- **Order:** lines stand in the order of their priority, top first. An ordinary line is added at the end; State of play, dispatching, may place a line at the position its priority warrants.
- **Important lines:** a line flagged `IMPORTANT` is added at the top, below any important lines already there, and every important line stands above every ordinary line. The worker takes the important lines first, in their order, one at a time, never grouping or reordering them. `FIRST-STEP` and `REFRESH` lines are important lines; the flag is how State of play changes how a work works.
- **Grouping:** below the important lines, the worker takes the queue from the top and may group similar lines into one unit of work where that makes sense, naming every grouped line in the commit that removes them.

The sender adds or replaces only its own line and edits nothing else in the receiver's folder, committing that path alone with the subject `docs(work): <receiver id> message from <sender id>`. The receiver records each line's disposition where it lands, under `ki-coordination`'s route receipt, names it in the commit that removes the line, and only then removes it. Who may send, how a coordinator acts on a line, route receipt and the inbox check at each wake are `ki-coordination`'s [Messages between work](../../../change-management/ki-coordination/references/standards-coordination.md#messages-between-work). A folder still in [the single-file shape](#the-single-file-shape) carries the same lines in its work file's `## Messages` section.

### Work awaiting review

`+/_WORK_REVIEW/<id>/` is the holding area for migrated work a territory's migration was not confident is live, as Kris set under MIGRATION-REVIEW on 18 October: "put everything which you're confident in into the work folder and then put everything else into a underscore work review folder ... you're not waiting on me to answer those, and then we can pick up on the review ones later". Its folders keep the work-folder shape they were moved in, and its index note, `+/_WORK_REVIEW/README.md`, gives one line per folder saying why it is there.

- **Not live:** work awaiting review is neither picked up, dispatched nor counted against the cap; `ki work status` keeps it out of the five views and shows it as a count.
- **Leaving review:** the owner, or the work itself at its next mark, moves a folder to `+/_WORK/<id>/` by `git mv` when it is live, moving it to the package shape in the same change, or deletes it when it is not, removing its index line in the same commit.
- **Checks:** the rubric accepts the holding area, warns on a folder with no index line, and applies no closed-list or record check to it until the folder leaves review.

## Exact package form

### Work file

`work.md` is the definition: what the work is, its goals and what it takes. It is read first and changes rarely, so `git log -- work.md` is the history of what the work is.

```yaml
---
id: ki.observatory
level: project
title: 'KI > Model > Observatory'
project: observatory
theme: model
description: >-
  Builds and runs the local Observatory in apps-observatory.local, the territory's read-only view of work, runs
  and diagrams. Takes Observatory features, its design system and `ki work status` consumers. Not for timelines
  and calendars (ki.timelines) or the work model itself (ki.ways-of-working).
worker: agent
supervisor: owner
created_at: 2026-10-13T23:50:00Z
---
```

The field set is closed:

| Field | Presence | Value |
| --- | --- | --- |
| `id` | required | the work's dotted id, agreeing with its folder |
| `level` | required | `territory`, `regular` or `project` |
| `title` | required | the work's title under Work naming, a non-empty single-line string |
| `label` | optional | the title with a `(<host>)` suffix, only for work limited to that machine |
| `project` | required at `project` level, else absent | the Project note's slug, the id's second segment |
| `theme` | optional | a theme page's slug, or `null` |
| `description` | required | the routing description, at most 500 characters |
| `worker`, `supervisor` | required | each a holder |
| `created_at` | optional | UTC time the work folder was created, no later than `state.md`'s `since` |

The `description` is written for routing, in a skill description's voice, as Kris answered DESCRIPTION-SHAPE: third person, what the work does, then "Takes ..." naming the kinds of unit it accepts, then "Not for ..." naming the neighbouring works by id, one to three sentences, tested against a handful of ambiguous routing examples. There is no `active` or `accepts` field: every state except `finished` can receive, and a work winding down says "Not taking new units" in its description.

The body has exactly this heading sequence:

```markdown
# ki.observatory

## Goals

## Scope
```

- **Goals** - the standing goals of the work, stable across its waves, as few as it needs. For Project work the first line links the Project note's `outcome` and never restates it; for regular work it links the Activity note; for territory work, the Charter. Links point upward: the package names its Project, and the Project note never links down.
- **Scope** - `In:` and `Out:` lines naming what the work takes and what belongs to which other work, by id. This is what State of play reads when two descriptions both match.

Nothing else belongs in the work file: no state, next steps, evidence or history.

### State file

`state.md` says where the work lies. It is rewritten in place at every move, so `git log -- state.md` is the history of the work's moves.

```yaml
---
id: ki.observatory
state: handoff-to-supervisor
blocking: false
since: 2026-10-19T11:25:41Z
received: 2026-10-19T07:14:00Z
beat: null
mark: 2026-10-19T07:47:18Z
method_read: 1a2b3c4
---
```

The field set is closed:

| Field | Presence | Value |
| --- | --- | --- |
| `id` | required | the work's id, agreeing with `work.md` and the folder, so the file read alone identifies itself |
| `state` | required | `with-worker`, `handoff-to-supervisor`, `with-supervisor`, `handoff-to-worker`, `handoff`, `on-hold` or `finished` |
| `target` | required in `handoff`, else absent | the holder the work is in transit to |
| `hold` | required in `on-hold`, else absent | a mapping of `reason`, `paused` or `more-expected`, and `release`, the condition in words |
| `blocking` | optional | `true` only in `handoff-to-supervisor`, when the worker sent back with a blocking query |
| `since` | required | UTC time of the last move |
| `received` | optional | UTC time of the supervisor's receive, or `null` |
| `beat` | optional | UTC time of the last heartbeat while with a worker, or `null` |
| `mark` | optional | UTC time of the last mark |
| `method_read` | optional | the short ki-agentic-harness revision whose `ki-coordination` and `ki-work-package` guidance the worker last read, or `null` |

A holder is `owner`, `agent`, `run/<name>`, `work/<id>`, `person/<handle>` or `repo/<name>`. The holder the work lies with now and its role are derived from `state` and `target` in `state.md` and `worker` and `supervisor` in `work.md`, never stored. Timestamps use UTC RFC 3339 second precision; quote `title` and `label` in YAML because they contain `>`. These are the fields the Work Process note's Observatory fields read through `ki work status`. `method_read` replaces the body line a coordinator once wrote under its refresh rule; setting it is the confirmation that a `REFRESH` line has been acted on, under `ki-coordination`'s [Refreshing this guidance](../../../change-management/ki-coordination/references/standards-coordination.md#refreshing-this-guidance).

Coordinating work, at `territory` or `project` level, is valid only in a repository whose `.ki.toml` declares `[skills.ki-coordination]`. Regular and ad hoc work is valid anywhere the capability is declared. The level is the one authority for the kind of work: not the title, a native session name, the folder name, the repository declaration, an output style, a hook line or a cached copy.

The body has exactly this heading sequence, territory work adding `## Queue` after `## Now` where it keeps a queue:

```markdown
# ki.observatory state

## Now

## Next steps

## Held
```

- **Now** - at most five lines: what is running, what lies with whom, since when. It holds the present only.
- **Queue** - territory work only: its ordered Project-work queue and cap list.
- **Next steps** - what the worker does when the work is next in its hands, numbered. Done items leave at the move that completes them; the commit message carries them.
- **Held** - work waiting on a named release condition, one line each with its condition. Ideas go to the Project note's Notes or to a record through `ki-next`, not here.

Each section says something, if only `None`. History stays out, as Kris answered STATE-HISTORY: the recap since the mark reads `git log -- +/_WORK/<id>/` and the run reports, so nothing needs a dated log in `## Now` or `## Next steps`. Evidence, such as commit identifiers, test counts and artefact hashes, lives in the run report and the commit; `state.md` may link one, not copy it.

### Queries file

`queries.md` holds every open and parked query in full, as Kris answered QUERIES-FILE and PARKED-HOME:

```markdown
# ki.observatory queries

## Open

### WORK-INSTRUMENT - Whether the Work Instrument shows a split folder unchanged

since 2026-10-19 · from [reader-check](reader-check.report.md)

**Context:** ...

**Query:** ...

**Options:**

a) (recommended, confidence medium - ...) ...

## Parked
```

Each query is a `### <TAG> - <title>` block carrying **Context**, **Query** and **Options** exactly as the owner report renders them, with one line beneath the heading giving `since <date>` and its source report, if any. The owner report's `## Queries` section is rendered from `## Open`, so the two cannot diverge. Parking moves the whole block from `## Open` to `## Parked` with its reason and release; putting back moves it again. A parked tangent, an owner side topic not yet shaped as a query, is a one-line entry under `## Parked`. When the owner answers, the read-back goes into `decisions.md` and the block is deleted in the same commit, Git keeping it. Each section says something, if only `None`.

### Messages file

`messages.md` holds the H1 `# <id> messages` and then the queue's lines in [the Messages line shape](#messages-lines), important lines first, or `None`. Nothing else belongs in it.

### Decisions log

`decisions.md` keeps its entry form and life cycle under `ki-coordination`'s decisions log, one entry format per work. It exists from creation, starting as `None`.

### Size limits

The limits are soft, warned and never failed, like a skill's budgets:

| File | Limit |
| --- | --- |
| `description` | at most 500 characters |
| `work.md` body | at most 300 words |
| `state.md` body | at most 400 words; `## Now` at most five lines; no bulk history |
| `messages.md` | each line at most 60 words; no line older than 7 days on work that is not on hold |
| `decisions.md` | at most 400 lines |

The history check on the `state.md` body warns on dated log lines and runs of commit identifiers or test counts; a single link to a report or a commit does not trip it. More than eight open queries is a coordination smell, not a shape fault, so `ki-coordination` owns that check.

## Progressive reveal

The package reads in four levels, by analogy with a skill's metadata, body and references:

| Level | Files | Who reads it, when |
| --- | --- | --- |
| 1. Register | `work.md` and `state.md` front matter | State of play at each routing; `ki work status`, the Observatory and `ki work` views; an opener |
| 2. Definition | `work.md` body | State of play when two descriptions match; the owner checking a routing; a new session before it reads state |
| 3. Pick-up | `state.md`, `messages.md`, `queries.md`, `decisions.md` | the work's own worker at bootstrap, re-anchoring, each owner message, each wake and each move |
| 4. On demand | reports, briefs, `design/` | only when `state.md` or `queries.md` names one |

Routing reads level 1 only, and a sender reads nothing in the receiver's folder: it adds a line to `messages.md`. A run reads its brief and what the brief names. How a coordinator's turn budget counts the pick-up reads is `ki-coordination`'s.

## The single-file shape

Until the migration pass moves each live folder, a work folder may still be in the single-file shape, in which `work.md` carries both the definition and the state: the closed front matter `id`, `level`, `title`, `label`, `project`, `theme`, `worker`, `supervisor`, `state`, `target`, `hold`, `blocking`, `since`, `received`, `beat`, `mark` and `created_at`, under the same rules as above, and the body headings `# <id>`, `## Next steps`, `## Messages` and `## Parked`, each saying something. `Next steps` may carry a coordinator's `ki-coordination read at <revision>` line; `Messages` carries the queue's lines; `Parked` carries one item per parked query, its tag, one line of context and its recommended option.

A folder is in one shape at a time, told apart by whether `state.md` exists:

- **Single-file:** no `state.md`. Its state lives in `work.md`, and senders write to its `## Messages` section. The rubric reads it under its old form and warns, naming the package as its new shape.
- **Package:** `state.md` exists, and so do `queries.md`, `messages.md` and `decisions.md`. The rubric fails a package whose `work.md` still carries a state field, or a `## Next steps`, `## Messages` or `## Parked` section, so a session that rewrites `work.md` from memory is caught at its next gate rather than silently forking the state.

Every reader, `ki work status` and the Observatory included, accepts both shapes before any folder moves; the pass waits for that. The window closes for live folders at the pass, and for the rest when an inventory of live, review-held and old-shape folders shows none left.

## Old checkpoints

For the tolerance window that phase 5 of the migration closes, an old checkpoint, `+/_CHECKPOINTS/<thread>.md`, stays readable and its audit warns on each record, naming its new home. It keeps its old form until its territory's migration moves it, straight to the package shape:

- **Front matter:** `type: ki-checkpoint`, `thread`, `state: active`, `created_at` and `updated_at`, with an optional quoted `label` and an optional `role` of `conversational`, `coordination` or `state-of-play`, a coordinating role valid only where `[skills.ki-coordination]` is declared.
- **Identity:** the filename stem, `thread` field and H1 agree; `<initiative>.<project>` names a Project's coordination thread, `_state-of-play` the territory's, and any other stem a conversational thread.
- **Body:** the H1 and the six H2 sections `Objective`, `Current state`, `Decisions made`, `Files touched`, `Open questions` and `Next step`, each with substantive content.
- **Scaffold:** while `+/_CHECKPOINTS/` exists it keeps its exact `README.md` scaffold, and CONFORM may restore it.

An old checkpoint's id is read from its stem under `ki-coordination`'s [Work naming](../../../change-management/ki-coordination/references/standards-coordination.md#work-naming). A work package and the old checkpoint it replaces are never both active: the move that writes the package deletes the checkpoint.

Once a repository holds `+/_WORK/`, its territory has migrated and the retired subareas, `+/_THREADS/` and `+/_CHECKPOINTS/`, never reappear beside it, tracked or not: the audit fails on either, and its contents move into the work folder of the work they belong to. Kris named a run report written into `+/_THREADS/` after the move THREADS-REGRESSION on 18 October 2026, and `ki agent` refuses a run home outside `+/_WORK/` under [KI-TOOL-KI-CLI-150](https://github.com/knowledgeislands/tools-ki/blob/main/docs/roadmap/KI-TOOL-KI-CLI-150-work-folder-entry-points.md).

## Work identity and native sessions

A native client session, such as a Claude Code or Codex session or a Zed tab, belongs to at most one piece of work, and the work package says which work it is and whether it coordinates. Kris agreed the design under SESSION-IDENTITY on 16 October 2026, "take the recommended option a) for PLAN-AGREE, THREAD-KEY, BINDING-HOME, SUPPLY-CHANNEL, NAME-AUTHORITY, RECORD-OWNERS, ROLE-FIELD and ROLE-STYLE (mechanism only)", and the work model reads it with work file for checkpoint and level for role.

- **Key:** `<repository name>/<work id>`, such as `ki-principal/ki.ways-of-working`. It is stable across hosts, clients and sessions.
- **Authority:** the work file's `id` says which work it is and its `level` whether it coordinates. The native session name is derived from the label under Work naming and copied into the client by hand or by the launcher; a native name, vendor field or session title never decides the work or its level.
- **Binding:** the native session identifiers for a piece of work live only in a machine-local runtime file, `~/.local/state/ki/threads/<repository>/<slug>.json`, as Work naming names it. The binding is never committed, never copied into the package, which keeps no runtime identifier under [Prohibited payloads and claims](#prohibited-payloads-and-claims), and never moved between hosts: each host rebuilds its own.
- **Supply:** identity reaches a session through one of three channels, in this order: the launcher's environment and session name, for a session `ki agent` or a host tool starts; the `SessionStart` hook on startup, resume and compact, where the binding exists; and the pasted opener or send line, which names the id and label, where no hook runs.
- **Drift:** a mismatch between the binding, the native name and the work file is reported in one line and never repaired by the session that finds it; the owner renames by hand, or the work's next update corrects the package.

Until the `ki thread` tooling and its hook registration ship, no binding is written and a session knows its work only from its opener, its send line or an explicit id under [Resume lifecycle](#resume-lifecycle).

## Optional runtime reminder consumers

A runtime-specific reminder consumer is separately opt-in. It may act only when its native event contract is independently evidenced and all of the following are true:

1. The repository declares `ki-work-package` and resolves to one physical repository root.
2. The runtime adapter is explicitly enabled in that runtime's own configuration; the portable `ki-work-package` declaration remains an empty capability marker.
3. The adapter receives one exact, human-selected work id from that explicit runtime configuration. It resolves only `+/_WORK/<id>/state.md`, or `+/_WORK/<id>/work.md` in the single-file shape, or, for the tolerance window, `+/_CHECKPOINTS/<thread>.md`; directory scans, newest-record selection, runtime-derived names, and archived or nested fallback are forbidden.
4. The resolved record is a regular file that satisfies this standard's identity and closed-schema requirements.

The only first-delivery action is a compact reminder that the already-selected package may need an explicit update. The consumer does not create, update, remove, select, or reword a package file; infer work state or completion; invoke `ki-recap`; read a transcript or vendor session; or expose a session identifier. Repeated, interrupted, malformed, unknown, absent, or otherwise unsafe input is a quiet no-op. The native runtime adapter owns its event semantics, registration, timeout, exit behaviour, and any actionable failure text; the portable contract supplies no shared hook or fallback.

## Update lifecycle

Every send, receive, mark and hold rewrites `state.md`'s front matter, `## Now` and next steps, under `ki-coordination`'s [Picking work up](../../../change-management/ki-coordination/references/standards-coordination.md#picking-work-up), and otherwise the package changes only on explicit user request or a documented repository-local trigger, such as before context compaction or a known pause. `work.md` changes only when the work's definition does. A generic Stop event is not authority to create or choose a package.

An update replaces the current state in place. It never appends a moves list, timestamped copies or transcript history. Only sends and the supervisor's receives commit, each subject carrying the move, as in `docs(work): ki.ways-of-working send to owner`; `git log -- +/_WORK/<id>/` is the logbook. In the single-file shape the same update rewrites `work.md`'s front matter and next steps.

Other work may add one line to a work's `messages.md` under [Messages lines](#messages-lines) and commit that path alone; that is a send to the work, not an update of its state. The work's own next update removes each line it has acted on.

Write durable decisions, accepted work state, or reusable knowledge to their proper owners before referring to them from the package. The package may name those canonical artifacts; it must not become their only copy.

### Recap-supplied hand-off evidence

An explicit `ki-recap checkpoint <id>` invocation may supply grounded evidence to this update lifecycle. The composition does not grant write authority or weaken validation: the repository must declare a valid `ki-work-package` capability, or its deprecated alias, the user must select exactly one piece of work and explicitly authorise its update, and the update procedure must refuse any repository mismatch, stale baseline, ambiguous work, interrupted update, or incomplete work state.

The supplied hand-off names the physical repository identity, immutable committed baseline or one complete portable patch against that baseline, scoped authority, result destination, and expected verification. A transcript, runtime session, shared filesystem, or provider snapshot may be available to the caller but is never required evidence and cannot replace those portable inputs. The package records concise current state and references to durable owners; it does not embed the patch, become the result store, or take ownership of the delegated work.

## Resume lifecycle

The manual portable flow is deliberately small:

1. Require the user-selected work id or, from an opener, the Project slug.
2. Resolve to one exact folder: `+/_WORK/<id>/`; for the tolerance window, when no work folder exists, the single old checkpoint whose stem maps to that id. If no folder or file, or more than one, matches, stop and ask the human which record is meant.
3. Read the five package files in full, or `work.md` alone in the single-file shape, and validate their identity and schema.
4. Act on its state as `ki-coordination`'s Picking work up sets it, the message queue first, important lines first, and continue from its next steps.

The title and label never take part in resolution. Do not search archived or nested paths as a fallback. Resume creates a fresh working context; it does not reopen, locate, or authenticate to the conversation that last held the work.

## Removal lifecycle

Finished work keeps its package with `state: finished` until the mark that closes it, when the work folder is deleted in one commit with Git keeping it, under [Tidying the work folder](#tidying-the-work-folder) and `ki-coordination`'s [Finishing Project work](../../../change-management/ki-coordination/references/standards-coordination.md#finishing-project-work). Removal otherwise requires explicit user direction; an agent must not infer completion from record content, a quiet session, or a Stop event. First confirm durable facts reached their proper owners, then delete the exact work folder or old checkpoint.

No retired copy is kept. Git is the recovery mechanism, so `_RETIRED`, archive, timestamped-copy, and other nested layouts are invalid.

## Prohibited payloads and claims

A package contains its definition and current state, not a transcript. It has no vendor-session field, conversation URL, runtime identifier, chat log, or role-by-role dialogue, and no host. Its prose must not claim that a future agent can access or reopen the session that last held the work.

It is also not a completion signal, roadmap, decision record, knowledge store, or session recap. Project notes and theme pages ([the Project registry standard](../../../change-management/ki-work/references/standards-project-registry.md)) are the durable home of standing outcome and status, and the work file names its Project while the Project note does not link down. `ki-recap` owns the user-facing judgment-led recap; the relevant governance skill owns each durable artifact. An optional runtime reminder consumer may use only an already-selected valid record under [its explicit contract](#optional-runtime-reminder-consumers). It does not grant write authority, choose work, invoke recap, read session material, or turn a portable procedure into a native host operation.

## Audit and conform boundary

AUDIT, CONFORM, and EDUCATE are currently hosted `ki repo` operations. REMOVE, RESUME, and UPDATE remain explicit agent procedures until a host operation is implemented and independently verified. AUDIT reads every work folder under `+/_WORK/`, tells its shape by whether `state.md` exists, and validates each package file's identity, closed front matter, body and boundary, or a single-file work file under its old form with a warning; it warns on the soft size limits and on each old checkpoint, validating it under its old form; it reports absent scope as not applicable when the capability is undeclared and nothing is present, and rejects symlinks, unsupported nesting and any retired-record layout.

CONFORM never authors a package file or old checkpoint, or moves work between states or shapes. It may restore an existing `+/_CHECKPOINTS/` directory's README scaffold and publish the generated rubric, but it cannot create, update, or remove a record, because those actions need human-selected work and explicit write authority.
