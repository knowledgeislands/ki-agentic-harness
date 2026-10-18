# Work-file standard

A work file is the minimal current state of one piece of work: `+/_WORK/<id>/work.md`. Its front matter says where the work lies, and its body holds the next steps, the Messages sent down to it and the tags of parked queries. It lets a fresh agent pick the work up without relying on a transcript, private runtime state or a vendor session. Git is its logbook: each move is a commit, so the file keeps no moves list and no history.

The work model is the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) note's, decided by [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md); this standard owns the record form and its validation, and `ki-pmo` owns the levels, states, moves and coordination. The skill keeps the name `ki-checkpoint`, as Kris answered SKILL-NAMES on 18 October, and the session-level checkpoint remains the conversational word for writing a work file before a pause.

## Contents

- [Activation and ownership](#activation-and-ownership)
- [Location and identity](#location-and-identity)
- [Exact record form](#exact-record-form)
  - [Front matter](#front-matter)
  - [Body](#body)
- [Old checkpoints](#old-checkpoints)
- [Optional runtime reminder consumers](#optional-runtime-reminder-consumers)
- [Update lifecycle](#update-lifecycle)
  - [Recap-supplied hand-off evidence](#recap-supplied-hand-off-evidence)
- [Resume lifecycle](#resume-lifecycle)
- [Removal lifecycle](#removal-lifecycle)
- [Prohibited payloads and claims](#prohibited-payloads-and-claims)
- [Audit and conform boundary](#audit-and-conform-boundary)

## Activation and ownership

The capability is optional. A repository declares `ki-checkpoint` in `.ki.toml`; the declaration is an empty capability marker and requires no physical subarea, because a work folder is created when its work opens. `ki-repo` owns the generic `+/` scaffold, `ki-pmo` owns the work folder's [closed list](../../../change-management/ki-pmo/references/standards-pmo.md#pruning-the-work-folder), and `ki-checkpoint` alone interprets the work file.

The repository owns its work files. Removal deletes a work file after its durable information has been routed; Git supplies any recovery history.

## Location and identity

A work file is one regular Markdown file at `+/_WORK/<id>/work.md`, one per piece of work above a work item; a work item has no folder, because its record is its home. `<id>` is the work's dotted id under `ki-pmo`'s [Work naming](../../../change-management/ki-pmo/references/standards-pmo.md#work-naming), which defines the id, slug and title: lower-case kebab segments joined by `.`, never a host, an underscore or a runtime session identifier. The folder name, the `id` field and the H1 agree exactly.

`+/_WORK/` holds only work folders, each a physical directory with its work file. Symlinked, nested, timestamped, archived and alternate layouts are invalid. Migrated work awaiting review sits in `+/_WORK_REVIEW/<id>/` under `ki-pmo`'s [Work awaiting review](../../../change-management/ki-pmo/references/standards-pmo.md#work-awaiting-review); its work files are checked only when the folder leaves review.

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

Coordinating work, at `territory` or `project` level, is valid only in a repository whose `.ki.toml` declares `[skills.ki-pmo]`. Regular and ad hoc work is valid anywhere the capability is declared. The level is the one authority for the kind of work: not the title, a native session name, the folder name, the repository declaration, an output style, a hook line or a cached copy.

### Body

After the front matter, the work file uses exactly this heading sequence:

```markdown
# ki.ways-of-working

## Next steps

## Messages

## Parked
```

The H1 repeats the id. `Next steps` holds substantive content: what the worker does when the work is next in its hands, with a coordinator's `ki-pmo read at <revision>` line under [its refresh rule](../../../change-management/ki-pmo/references/standards-pmo.md#refreshing-this-guidance). `Messages` holds one list item per direction sent down to the work, under [Messages between work](../../../change-management/ki-pmo/references/standards-pmo.md#messages-between-work), `FIRST-STEP` lines first. `Parked` holds one list item per parked query, its tag, one line of context and its recommended option, linked to the report that holds it, under [Parking tangents](../../../change-management/ki-pmo/references/standards-pmo.md#parking-tangents). Either may say `None`.

Nothing else belongs in the file: no moves list, decisions log, report, brief or design paper, each of which has its own home in the work folder, and no copy of a durable fact that has an owner elsewhere.

## Old checkpoints

For the tolerance window that phase 5 of the migration closes, an old checkpoint, `+/_CHECKPOINTS/<thread>.md`, stays readable and its audit warns on each record, naming its new home. It keeps its old form until its territory's migration moves it:

- **Front matter:** `type: ki-checkpoint`, `thread`, `state: active`, `created_at` and `updated_at`, with an optional quoted `label` and an optional `role` of `conversational`, `coordination` or `state-of-play`, a coordinating role valid only where `[skills.ki-pmo]` is declared.
- **Identity:** the filename stem, `thread` field and H1 agree; `<initiative>.<project>` names a Project's coordination thread, `_state-of-play` the territory's, and any other stem a conversational thread.
- **Body:** the H1 and the six H2 sections `Objective`, `Current state`, `Decisions made`, `Files touched`, `Open questions` and `Next step`, each with substantive content.
- **Scaffold:** while `+/_CHECKPOINTS/` exists it keeps its exact `README.md` scaffold, and CONFORM may restore it.

An old checkpoint's id is read from its stem under `ki-pmo`'s [Work naming](../../../change-management/ki-pmo/references/standards-pmo.md#work-naming). A work file and the old checkpoint it replaces are never both active: the move that writes the work file deletes the checkpoint.

## Optional runtime reminder consumers

A runtime-specific reminder consumer is separately opt-in. It may act only when its native event contract is independently evidenced and all of the following are true:

1. The repository declares `ki-checkpoint` and resolves to one physical repository root.
2. The runtime adapter is explicitly enabled in that runtime's own configuration; the portable `ki-checkpoint` declaration remains an empty capability marker.
3. The adapter receives one exact, human-selected work id from that explicit runtime configuration. It resolves only `+/_WORK/<id>/work.md`, or, for the tolerance window, `+/_CHECKPOINTS/<thread>.md`; directory scans, newest-record selection, runtime-derived names, and archived or nested fallback are forbidden.
4. The resolved record is a regular work file, or old checkpoint, that satisfies this standard's identity and closed-schema requirements.

The only first-delivery action is a compact reminder that the already-selected record may need an explicit update. The consumer does not create, update, remove, select, or reword a work file; infer work state or completion; invoke `ki-recap`; read a transcript or vendor session; or expose a session identifier. Repeated, interrupted, malformed, unknown, absent, or otherwise unsafe input is a quiet no-op. The native runtime adapter owns its event semantics, registration, timeout, exit behaviour, and any actionable failure text; the portable contract supplies no shared hook or fallback.

## Update lifecycle

Every send, receive, mark and hold rewrites the work file's front matter and next steps, under `ki-pmo`'s [Picking work up](../../../change-management/ki-pmo/references/standards-pmo.md#picking-work-up), and otherwise it changes only on explicit user request or a documented repository-local trigger, such as before context compaction or a known pause. A generic Stop event is not authority to create or choose a work file.

An update replaces the current state in place. It never appends a moves list, timestamped copies or transcript history. Only sends and the supervisor's receives commit, each subject carrying the move, as in `docs(work): ki.ways-of-working send to owner`; `git log -- +/_WORK/<id>/` is the logbook.

Other work may add one item to a work file's `Messages` section under `ki-pmo` and commit that path alone; that is a send to the work, not an update of its state. The work's own next update removes each item it has acted on.

Write durable decisions, accepted work state, or reusable knowledge to their proper owners before referring to them from a work file. The work file may name those canonical artifacts; it must not become their only copy.

### Recap-supplied hand-off evidence

An explicit `ki-recap checkpoint <id>` invocation may supply grounded evidence to this update lifecycle. The composition does not grant write authority or weaken validation: the repository must declare a valid `ki-checkpoint` capability, the user must select exactly one piece of work and explicitly authorise its update, and the update procedure must refuse any repository mismatch, stale baseline, ambiguous work, interrupted update, or incomplete work state.

The supplied hand-off names the physical repository identity, immutable committed baseline or one complete portable patch against that baseline, scoped authority, result destination, and expected verification. A transcript, runtime session, shared filesystem, or provider snapshot may be available to the caller but is never required evidence and cannot replace those portable inputs. The work file records concise current state and references to durable owners; it does not embed the patch, become the result store, or take ownership of the delegated work.

## Resume lifecycle

The manual portable flow is deliberately small:

1. Require the user-selected work id or, from an opener, the Project slug.
2. Resolve to one exact path: `+/_WORK/<id>/work.md`; for the tolerance window, when no work file exists, the single old checkpoint whose stem maps to that id. If no file or more than one file matches, stop and ask the human which record is meant.
3. Read the whole record and validate its identity and schema.
4. Act on its state as `ki-pmo`'s Picking work up sets it, the `Messages` section first, and continue from its next steps.

The title and label never take part in resolution. Do not search archived or nested paths as a fallback. Resume creates a fresh working context; it does not reopen, locate, or authenticate to the conversation that last held the work.

## Removal lifecycle

Finished work keeps its work file with `state: finished` until the mark that closes it, when the work folder is deleted with Git keeping it, under `ki-pmo`'s [Pruning the work folder](../../../change-management/ki-pmo/references/standards-pmo.md#pruning-the-work-folder). Removal otherwise requires explicit user direction; an agent must not infer completion from record content, a quiet session, or a Stop event. First confirm durable facts reached their proper owners, then delete the exact work folder or old checkpoint.

No retired copy is kept. Git is the recovery mechanism, so `_RETIRED`, archive, timestamped-copy, and other nested layouts are invalid.

## Prohibited payloads and claims

A work file contains current state, not a transcript. It has no vendor-session field, conversation URL, runtime identifier, message log, or role-by-role dialogue, and no host. Its prose must not claim that a future agent can access or reopen the session that last held the work.

It is also not a completion signal, roadmap, decision record, knowledge store, or session recap. Project notes and theme pages ([the Project registry standard](../../../change-management/ki-work/references/standards-project-registry.md)) are the durable home of status, and the work file names its Project while the Project note does not link down. `ki-recap` owns the user-facing judgment-led recap; the relevant governance skill owns each durable artifact. An optional runtime reminder consumer may use only an already-selected valid record under [its explicit contract](#optional-runtime-reminder-consumers). It does not grant write authority, choose work, invoke recap, read session material, or turn a portable procedure into a native host operation.

## Audit and conform boundary

AUDIT, CONFORM, and EDUCATE are currently hosted `ki repo` operations. REMOVE, RESUME, and UPDATE remain explicit agent procedures until a host operation is implemented and independently verified. AUDIT reads every work file under `+/_WORK/` and validates its identity, closed front matter, body and boundary; it warns on each old checkpoint and validates it under its old form; it reports absent scope as not applicable when `ki-checkpoint` is undeclared and nothing is present, and rejects symlinks, unsupported nesting and any retired-record layout.

CONFORM never authors a work file or old checkpoint, or moves work between states. It may restore an existing `+/_CHECKPOINTS/` directory's README scaffold and publish the generated rubric, but it cannot create, update, or remove a record, because those actions need human-selected work and explicit write authority.
