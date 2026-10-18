# Work-folder standard

A work folder, `+/_WORK/<id>/`, holds one piece of work's knowledge files between its moves: its work file, its decisions log, the reports and briefs of its runs and its design notes. Its work file, `work.md`, is the minimal current state of the work: its front matter says where the work lies, and its body holds the next steps, the Messages sent down to it and the tags of parked queries. Together they let a fresh agent pick the work up without relying on a transcript, private runtime state or a vendor session. Git is the logbook: each move is a commit, so the folder keeps no moves list and no history.

The work model is the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) note's, decided by [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md). The skill was `ki-checkpoint` until Kris answered WORK-FOLDER-NAME on 18 October 2026, "work forward makes a lot of sense, right? So let's go with that", read back as `ki-work-folder`, and the session-level checkpoint remains the conversational word for writing a work file before a pause.

## Contents

- [Activation and ownership](#activation-and-ownership)
- [Location and identity](#location-and-identity)
- [The work folder](#the-work-folder)
  - [Closed list](#closed-list)
  - [Entry points](#entry-points)
  - [Tidying the work folder](#tidying-the-work-folder)
  - [Messages lines](#messages-lines)
  - [Work awaiting review](#work-awaiting-review)
- [Exact record form](#exact-record-form)
  - [Front matter](#front-matter)
  - [Body](#body)
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

The capability is optional. A repository declares `ki-work-folder` in `.ki.toml`; the declaration is an empty capability marker and requires no physical subarea, because a work folder is created when its work opens. The repository owns its work folders; Git supplies any recovery history.

This standard is the one specification of `+/_WORK/<id>/` and `+/_WORK_REVIEW/<id>/`, as Kris answered WORK-FOLDER-OWNER on 18 October 2026, read back as "the work-folder skill is the canonical specification; ki-coordination timing and judgement; ki-delegation run side only; ki-work-design graduation; others check in on the four-point contract". It owns the folder's shape, its closed list, its entry points, the tidy and prune rules, the review area and the Messages line shape, and the work file's form at every level, coordinated or not. The other owners keep only their side and link here for the rest:

| Concern | Owner |
| --- | --- |
| When a folder is tidied, at send, mark, hold and finish; whether an outcome has a durable home; the decisions log's entry form and life cycle; the report forms; acting on Messages | `ki-coordination` |
| The run packet, the state folder, the launcher and the close gate, and the brief and report paths for runs | `ki-delegation` |
| A design note's life cycle: draft, review, graduation and deletion | `ki-work-design` |
| The generic `+/` scaffold and the working-area coverage signal | `ki-repo` |

## Location and identity

A work file is one regular Markdown file at `+/_WORK/<id>/work.md`, one per piece of work above a work item; a work item has no folder, because its record is its home. `<id>` is the work's dotted id under `ki-coordination`'s [Work naming](../../../change-management/ki-coordination/references/standards-coordination.md#work-naming), which defines the id, slug and title: lower-case kebab segments joined by `.`, never a host, an underscore or a runtime session identifier. The folder name, the `id` field and the H1 agree exactly.

`+/_WORK/` holds only work folders, each a physical directory with its work file. Symlinked, nested, timestamped, archived and alternate layouts are invalid. Migrated work awaiting review sits in `+/_WORK_REVIEW/<id>/` under [Work awaiting review](#work-awaiting-review); its work files are checked only when the folder leaves review.

## The work folder

### Closed list

A work folder holds these kinds and nothing else:

| Kind | Path | Kept until |
| --- | --- | --- |
| Work file | `work.md` | The mark that closes finished work |
| Decisions log | `decisions.md` | The mark that closes finished work |
| Run report | `<name>.report.md` | A tidy finds its queries all answered and its outcome homed |
| Brief | `briefs/<run>.md` | Its run's report is received |
| Design note | `design/<slug>.md`, or `design/<subject>/` holding the same kinds | It graduates under `ki-work-design` |
| Design artefact | `design/**/*.architecture.json` and the other diagram sources, with their `.svg` and `.html` renders | Its note graduates |

Anything else does not belong: scripts, screenshots and other images that are not a diagram's render, `scratch/` folders and the output of tools. Temporary output belongs under `tmp/<run>/<name>/` in the repository its agent worked in, under the `ki-delegation` [run packet](../../ki-delegation/references/standards-background-runs.md#run-packet). A coordinator's own Summary is a message, not a run report, and is not saved into the folder.

### Entry points

Every writer is a named entry point with its permitted kinds, and every other party only reads. This is the contract other skills, tools and runs check in on, set out in the design note behind WORK-FOLDER-OWNER:

1. **One owner sets the shape and the tidy rules:** this standard sets the closed list, what each entry point may write, when each kind goes and how a deletion is made.
2. **Every other writer is a named entry point** with its single permitted kind, in the table below.
3. **Only the folder's own work deletes.** The launcher, runs, other work and tools never delete there.
4. **A check backs each entry point mechanically,** through the [rubric](rubric.md); the judgement whether an outcome has a durable home stays with the work's own steward under `ki-coordination`.

| Entry point | Writes | Never |
| --- | --- | --- |
| The work's own steward: its coordinator, or for regular and ad hoc work the session working it | `work.md`, `decisions.md` and `briefs/`, and the deletions of a tidy | Another work's folder, except one Messages line |
| The launcher, `ki agent` | `<name>.report.md`, copied in from the run's state folder; a state-folder `decisions.md` adopted where the folder has none; entries `decide` and `reconcile` append to `decisions.md` on the steward's instruction | Deletes anything, or replaces a report Git does not already hold |
| A background run | Its work product in its owning home, and `design/` where its brief names a design note | Its report straight into the folder: it writes the report to its state folder and the launcher homes it |
| `ki-work-design` and design runs | `design/` | Other kinds |
| Other work | One line in `work.md`'s `## Messages`, committed alone | Any other edit |

Readers, such as `ki work status`, the observatory, `ki agent close` and the rubrics, change nothing; a change of shape names them as consumers.

### Tidying the work folder

A tidy keeps the folder to what is still open, with Git history holding the rest, as Kris set under THREAD-TIDY on 2026-10-14, as received: "at each mark the thread deletes every report whose queries are all answered and whose outcome has a durable home, keeping only reports with open queries and decisions.md, with Git history holding the rest", and made regular on 2026-10-16 with THREADS-TRIM. `ki-coordination` says when a coordinator tidies, at every send and each mark; regular and ad hoc work tidies at its own next update.

- **What goes:** every `<name>.report.md` whose queries are all answered and whose outcome has a durable home, a work record, the decisions log, the work file or a commit; and every `briefs/<run>.md` once its run's report has been received. A query is answered when the owner has answered its Needs tag and the answer is read back in the log.
- **What stays:** `work.md` and `decisions.md`, always; every report that still carries an open query; every brief whose handoff is open; and `design/` until its notes graduate.
- **How:** in one commit by explicit path, `git rm` of each file named and nothing else, never a folder-wide delete, so that Git history holds every report and a later recap or full summary reads a deleted one from its last revision. The deletion is operational work and opens no record.
- **Who:** each piece of work tidies only its own folder. Territory work never tidies another work folder; it names each folder the rubric flags in that work file's Messages section, and the owning work tidies at its next send.
- **Close-out:** finished work's folder is deleted at the mark that closes it, in one commit, once its decisions are homed and `design/` is resolved, under [Removal lifecycle](#removal-lifecycle).

A report whose outcome has no durable home yet is kept, not homed in haste. The rubric lists candidates; a listing is never permission to delete.

### Messages lines

The `## Messages` section of a work file carries one list item per message sent down to the work, `FIRST-STEP` lines first, then newest first:

```markdown
- <YYYY-MM-DD> · <TAG> · <sender title>: <the owner's words or the instruction, with links>
```

A line is about 60 words at most with the detail linked, and a message citing an owner decision quotes its words. The sender adds its line and edits nothing else in the receiver's work file, committing that path alone with the subject `docs(work): <receiver id> message from <sender id>`. The receiver removes each line it has acted on in its next work-file update. Who may send, and how a coordinator acts on a line, are `ki-coordination`'s [Messages between work](../../../change-management/ki-coordination/references/standards-coordination.md#messages-between-work).

### Work awaiting review

`+/_WORK_REVIEW/<id>/` is the holding area for migrated work a territory's migration was not confident is live, as Kris set under MIGRATION-REVIEW on 18 October: "put everything which you're confident in into the work folder and then put everything else into a underscore work review folder ... you're not waiting on me to answer those, and then we can pick up on the review ones later". Its folders keep the work-folder shape, and its index note, `+/_WORK_REVIEW/README.md`, gives one line per folder saying why it is there.

- **Not live:** work awaiting review is neither picked up, dispatched nor counted against the cap; `ki work status` keeps it out of the five views and shows it as a count.
- **Leaving review:** the owner, or the work itself at its next mark, moves a folder to `+/_WORK/<id>/` by `git mv` when it is live, or deletes it when it is not, removing its index line in the same commit.
- **Checks:** the rubric accepts the holding area, warns on a folder with no index line, and applies no closed-list or record check to it until the folder leaves review.

## Exact record form

### Front matter

```yaml
---
id: ki.ways-of-working
level: project
title: 'KI > Model > Ways of working'
project: ways-of-working
theme: knowledge-islands-model
worker: agent
supervisor: owner
state: handoff-to-supervisor
blocking: false
since: 2026-10-18T01:49:05Z
received: null
beat: null
mark: 2026-10-17T21:34:00Z
created_at: 2026-10-17T20:00:00Z
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
| `worker`, `supervisor` | required | each a holder |
| `state` | required | `with-worker`, `handoff-to-supervisor`, `with-supervisor`, `handoff-to-worker`, `handoff`, `on-hold` or `finished` |
| `target` | required in `handoff`, else absent | the holder the work is in transit to |
| `hold` | required in `on-hold`, else absent | a mapping of `reason`, `paused` or `more-expected`, and `release`, the condition in words |
| `blocking` | optional | `true` only in `handoff-to-supervisor`, when the worker sent back with a blocking query |
| `since` | required | UTC time of the last move |
| `received` | optional | UTC time of the supervisor's receive, or `null` |
| `beat` | optional | UTC time of the last heartbeat while with a worker, or `null` |
| `mark` | optional | UTC time of the last mark |
| `created_at` | optional | UTC time the work folder was created, no later than `since` |

A holder is `owner`, `agent`, `run/<name>`, `work/<id>`, `person/<handle>` or `repo/<name>`. The holder the work lies with now and its role are derived from `state`, `worker`, `supervisor` and `target`, never stored. Timestamps use UTC RFC 3339 second precision; quote `title` and `label` in YAML because they contain `>`. These are the fields the Work Process note's Observatory fields read through `ki work status`.

Coordinating work, at `territory` or `project` level, is valid only in a repository whose `.ki.toml` declares `[skills.ki-coordination]`. Regular and ad hoc work is valid anywhere the capability is declared. The level is the one authority for the kind of work: not the title, a native session name, the folder name, the repository declaration, an output style, a hook line or a cached copy.

### Body

After the front matter, the work file uses exactly this heading sequence:

```markdown
# ki.ways-of-working

## Next steps

## Messages

## Parked
```

The H1 repeats the id. `Next steps` holds substantive content: what the worker does when the work is next in its hands, with a coordinator's `ki-coordination read at <revision>` line under [its refresh rule](../../../change-management/ki-coordination/references/standards-coordination.md#refreshing-this-guidance). `Messages` holds one list item per direction sent down to the work, in the shape [Messages lines](#messages-lines) sets, `FIRST-STEP` lines first. `Parked` holds one list item per parked query, its tag, one line of context and its recommended option, linked to the report that holds it, under [Parking tangents](../../../change-management/ki-coordination/references/standards-coordination.md#parking-tangents). Either may say `None`.

Nothing else belongs in the file: no moves list, decisions log, report, brief or design paper, each of which has its own place in the folder's [closed list](#closed-list), and no copy of a durable fact that has an owner elsewhere.

## Old checkpoints

For the tolerance window that phase 5 of the migration closes, an old checkpoint, `+/_CHECKPOINTS/<thread>.md`, stays readable and its audit warns on each record, naming its new home. It keeps its old form until its territory's migration moves it:

- **Front matter:** `type: ki-checkpoint`, `thread`, `state: active`, `created_at` and `updated_at`, with an optional quoted `label` and an optional `role` of `conversational`, `coordination` or `state-of-play`, a coordinating role valid only where `[skills.ki-coordination]` is declared.
- **Identity:** the filename stem, `thread` field and H1 agree; `<initiative>.<project>` names a Project's coordination thread, `_state-of-play` the territory's, and any other stem a conversational thread.
- **Body:** the H1 and the six H2 sections `Objective`, `Current state`, `Decisions made`, `Files touched`, `Open questions` and `Next step`, each with substantive content.
- **Scaffold:** while `+/_CHECKPOINTS/` exists it keeps its exact `README.md` scaffold, and CONFORM may restore it.

An old checkpoint's id is read from its stem under `ki-coordination`'s [Work naming](../../../change-management/ki-coordination/references/standards-coordination.md#work-naming). A work file and the old checkpoint it replaces are never both active: the move that writes the work file deletes the checkpoint.

## Work identity and native sessions

A native client session, such as a Claude Code or Codex session or a Zed tab, belongs to at most one piece of work, and the work file says which work it is and whether it coordinates. Kris agreed the design under SESSION-IDENTITY on 16 October 2026, "take the recommended option a) for PLAN-AGREE, THREAD-KEY, BINDING-HOME, SUPPLY-CHANNEL, NAME-AUTHORITY, RECORD-OWNERS, ROLE-FIELD and ROLE-STYLE (mechanism only)", and the work model reads it with work file for checkpoint and level for role.

- **Key:** `<repository name>/<work id>`, such as `ki-principal/ki.ways-of-working`. It is stable across hosts, clients and sessions.
- **Authority:** the work file's `id` says which work it is and its `level` whether it coordinates. The native session name is derived from the label under Work naming and copied into the client by hand or by the launcher; a native name, vendor field or session title never decides the work or its level.
- **Binding:** the native session identifiers for a piece of work live only in a machine-local runtime file, `~/.local/state/ki/threads/<repository>/<slug>.json`, as Work naming names it. The binding is never committed, never copied into the work file, which keeps no runtime identifier under [Prohibited payloads and claims](#prohibited-payloads-and-claims), and never moved between hosts: each host rebuilds its own.
- **Supply:** identity reaches a session through one of three channels, in this order: the launcher's environment and session name, for a session `ki agent` or a host tool starts; the `SessionStart` hook on startup, resume and compact, where the binding exists; and the pasted opener or send line, which names the id and label, where no hook runs.
- **Drift:** a mismatch between the binding, the native name and the work file is reported in one line and never repaired by the session that finds it; the owner renames by hand, or the work's next update corrects the work file.

Until the `ki thread` tooling and its hook registration ship, no binding is written and a session knows its work only from its opener, its send line or an explicit id under [Resume lifecycle](#resume-lifecycle).

## Optional runtime reminder consumers

A runtime-specific reminder consumer is separately opt-in. It may act only when its native event contract is independently evidenced and all of the following are true:

1. The repository declares `ki-work-folder` and resolves to one physical repository root.
2. The runtime adapter is explicitly enabled in that runtime's own configuration; the portable `ki-work-folder` declaration remains an empty capability marker.
3. The adapter receives one exact, human-selected work id from that explicit runtime configuration. It resolves only `+/_WORK/<id>/work.md`, or, for the tolerance window, `+/_CHECKPOINTS/<thread>.md`; directory scans, newest-record selection, runtime-derived names, and archived or nested fallback are forbidden.
4. The resolved record is a regular work file, or old checkpoint, that satisfies this standard's identity and closed-schema requirements.

The only first-delivery action is a compact reminder that the already-selected record may need an explicit update. The consumer does not create, update, remove, select, or reword a work file; infer work state or completion; invoke `ki-recap`; read a transcript or vendor session; or expose a session identifier. Repeated, interrupted, malformed, unknown, absent, or otherwise unsafe input is a quiet no-op. The native runtime adapter owns its event semantics, registration, timeout, exit behaviour, and any actionable failure text; the portable contract supplies no shared hook or fallback.

## Update lifecycle

Every send, receive, mark and hold rewrites the work file's front matter and next steps, under `ki-coordination`'s [Picking work up](../../../change-management/ki-coordination/references/standards-coordination.md#picking-work-up), and otherwise it changes only on explicit user request or a documented repository-local trigger, such as before context compaction or a known pause. A generic Stop event is not authority to create or choose a work file.

An update replaces the current state in place. It never appends a moves list, timestamped copies or transcript history. Only sends and the supervisor's receives commit, each subject carrying the move, as in `docs(work): ki.ways-of-working send to owner`; `git log -- +/_WORK/<id>/` is the logbook.

Other work may add one item to a work file's `Messages` section under [Messages lines](#messages-lines) and commit that path alone; that is a send to the work, not an update of its state. The work's own next update removes each item it has acted on.

Write durable decisions, accepted work state, or reusable knowledge to their proper owners before referring to them from a work file. The work file may name those canonical artifacts; it must not become their only copy.

### Recap-supplied hand-off evidence

An explicit `ki-recap checkpoint <id>` invocation may supply grounded evidence to this update lifecycle. The composition does not grant write authority or weaken validation: the repository must declare a valid `ki-work-folder` capability, the user must select exactly one piece of work and explicitly authorise its update, and the update procedure must refuse any repository mismatch, stale baseline, ambiguous work, interrupted update, or incomplete work state.

The supplied hand-off names the physical repository identity, immutable committed baseline or one complete portable patch against that baseline, scoped authority, result destination, and expected verification. A transcript, runtime session, shared filesystem, or provider snapshot may be available to the caller but is never required evidence and cannot replace those portable inputs. The work file records concise current state and references to durable owners; it does not embed the patch, become the result store, or take ownership of the delegated work.

## Resume lifecycle

The manual portable flow is deliberately small:

1. Require the user-selected work id or, from an opener, the Project slug.
2. Resolve to one exact path: `+/_WORK/<id>/work.md`; for the tolerance window, when no work file exists, the single old checkpoint whose stem maps to that id. If no file or more than one file matches, stop and ask the human which record is meant.
3. Read the whole record and validate its identity and schema.
4. Act on its state as `ki-coordination`'s Picking work up sets it, the `Messages` section first, and continue from its next steps.

The title and label never take part in resolution. Do not search archived or nested paths as a fallback. Resume creates a fresh working context; it does not reopen, locate, or authenticate to the conversation that last held the work.

## Removal lifecycle

Finished work keeps its work file with `state: finished` until the mark that closes it, when the work folder is deleted in one commit with Git keeping it, under [Tidying the work folder](#tidying-the-work-folder) and `ki-coordination`'s [Finishing Project work](../../../change-management/ki-coordination/references/standards-coordination.md#finishing-project-work). Removal otherwise requires explicit user direction; an agent must not infer completion from record content, a quiet session, or a Stop event. First confirm durable facts reached their proper owners, then delete the exact work folder or old checkpoint.

No retired copy is kept. Git is the recovery mechanism, so `_RETIRED`, archive, timestamped-copy, and other nested layouts are invalid.

## Prohibited payloads and claims

A work file contains current state, not a transcript. It has no vendor-session field, conversation URL, runtime identifier, message log, or role-by-role dialogue, and no host. Its prose must not claim that a future agent can access or reopen the session that last held the work.

It is also not a completion signal, roadmap, decision record, knowledge store, or session recap. Project notes and theme pages ([the Project registry standard](../../../change-management/ki-work/references/standards-project-registry.md)) are the durable home of status, and the work file names its Project while the Project note does not link down. `ki-recap` owns the user-facing judgment-led recap; the relevant governance skill owns each durable artifact. An optional runtime reminder consumer may use only an already-selected valid record under [its explicit contract](#optional-runtime-reminder-consumers). It does not grant write authority, choose work, invoke recap, read session material, or turn a portable procedure into a native host operation.

## Audit and conform boundary

AUDIT, CONFORM, and EDUCATE are currently hosted `ki repo` operations. REMOVE, RESUME, and UPDATE remain explicit agent procedures until a host operation is implemented and independently verified. AUDIT reads every work file under `+/_WORK/` and validates its identity, closed front matter, body and boundary; it warns on each old checkpoint and validates it under its old form; it reports absent scope as not applicable when `ki-work-folder` is undeclared and nothing is present, and rejects symlinks, unsupported nesting and any retired-record layout.

CONFORM never authors a work file or old checkpoint, or moves work between states. It may restore an existing `+/_CHECKPOINTS/` directory's README scaffold and publish the generated rubric, but it cannot create, update, or remove a record, because those actions need human-selected work and explicit write authority.
