<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — portable work files

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-work-folder --write`.

Line-by-line criteria for auditing ki-work-folder. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [CONFIG — Capability declaration](#config--capability-declaration)
- [STRUCTURE — Work-file locations](#structure--work-file-locations)
- [RECORD — Work-file record](#record--work-file-record)
- [LIFECYCLE — Work-file lifecycle](#lifecycle--work-file-lifecycle)
- [BOUNDARY — Runtime-neutral reconstruction](#boundary--runtime-neutral-reconstruction)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic

## CONFIG — Capability declaration

→ [standard](standards-work-folder.md)

The repository opts into one portable contract without embedding runtime or retention policy.

- **CONFIG-1 [M] — checkpoint declaration has no private options** — The optional `ki-work-folder` declaration is an empty capability marker. It carries no runtime, session, retention, or lifecycle options; repository policy and optional adapters remain separate owners. (standards-work-folder.md)
  - _Remediation:_ diagnostic — Remove unsupported declaration options, then rerun the audit.

## STRUCTURE — Work-file locations

→ [standard](standards-work-folder.md)

One flat folder per piece of work holds its work file, and old checkpoints stay readable; Git supplies history.

- **STRUCTURE-1 [M] — the work area holds only work folders** — `+/_WORK/` is a physical directory holding only physical work folders, each with its regular `work.md` work file. While the legacy `+/_CHECKPOINTS/` directory exists it retains its exact `README.md` scaffold and only flat Markdown records beside it; once `+/_WORK/` exists, neither retired `+/_THREADS/` nor `+/_CHECKPOINTS/` exists beside it, tracked or not. Symlinks, unsupported files, retired-record directories, and nested or timestamped layouts are invalid. (standards-work-folder.md)
  - _Remediation:_ automatic
- **STRUCTURE-2 [M + J] — old checkpoints are read for the tolerance window** — Each old checkpoint under `+/_CHECKPOINTS/` is still read and checked under its old form, with a warning naming its new home, `+/_WORK/<id>/work.md`, until its territory's migration moves it; phase 5 of the migration closes the window. (standards-work-folder.md#old-checkpoints)
  - _Remediation:_ guarded — Move the work to its work file at the territory's migration, deleting the checkpoint in the same commit.
  - _Evidence scope:_ Every old checkpoint under `+/_CHECKPOINTS/` and the work file named as its new home.
  - _Review prompt:_ Is the old checkpoint still awaiting its territory's migration, rather than kept beside a work file that replaces it?
  - _Outcomes:_ awaiting migration; move at migration
  - _Conforming guidance:_ Leave the checkpoint until its territory's migration; then move its state to the work file and delete it in one commit.

## RECORD — Work-file record

→ [standard](standards-work-folder.md)

Closed metadata and document shape make one work file portable and deterministically readable.

- **RECORD-1 [M-heuristic + J] — record identity is chosen and consistent** — Each work folder is named by the work's dotted id, lower-case kebab segments joined by `.` with no mechanically recognisable opaque runtime-session identifier, and the folder, `id` field and H1 agree. An old checkpoint's filename stem is a non-empty single path component, dotted `<initiative>.<project>` and `_state-of-play` included, repeated in its `thread` field and H1. (standards-work-folder.md)
  - _Remediation:_ guarded — Correct record identity only through an explicit user-selected thread update.
  - _Evidence scope:_ Every work folder, id field and H1, and every old checkpoint filename, thread field and H1.
  - _Review prompt:_ Is each id or thread name a stable chosen lookup key rather than a vendor or runtime identifier?
  - _Outcomes:_ conforming; explicit rename required; escalate to user
  - _Conforming guidance:_ Keep the work id as the lookup key; do not derive or replace it from runtime metadata.
- **RECORD-2 [M + J] — front matter and headings use the closed schema** — A work file declares id, level, title, worker, supervisor, state and since; project at project level and only there, target in handoff and only there, hold with its reason and release on hold and only there; and at most the optional label, theme, blocking, received, beat, mark and created_at, each of its stated type. Its body is the id H1 and the ordered Next steps, Messages and Parked H2 sections, each saying something. An old checkpoint keeps its closed type, thread, state, created_at, updated_at, optional label and role, and its six H2 sections. (standards-work-folder.md)
  - _Remediation:_ guarded — Correct authored record schema only through an explicit checkpoint update.
  - _Evidence scope:_ The authored front matter, headings, and sections of every work file and old checkpoint.
  - _Review prompt:_ Can the schema correction be made without inventing or discarding user-owned work state?
  - _Outcomes:_ conforming; explicit update required; escalate to user
  - _Conforming guidance:_ Ask the user to update uncertain authored content; the checker must not infer missing work state.
- **RECORD-3 [M + J] — an old checkpoint carries a presentation label** — Each old checkpoint carries a `label`: the exact thread name the human uses in their client, of the form `<Space> > <Initiative> > <project in words>`, `<Space> > SoP` for the state-of-play thread or `<Space> > <topic>`, with a `(<host>)` suffix only for a thread limited to that machine; a label in the earlier `<Initiative title>: <project>` or `Master: state-of-play` form stays valid until the owner approves its change. The label is presentation only and never used for resolution; a work file carries its required `title` instead. (standards-work-folder.md)
  - _Remediation:_ guarded — Add the label through an explicit checkpoint update; resolution still goes by thread and Project name.
  - _Evidence scope:_ Every old checkpoint label.
  - _Review prompt:_ Does each label match the name the human uses for the thread in their client?
  - _Outcomes:_ conforming; explicit update required; escalate to user
  - _Conforming guidance:_ Take the label from the human; never derive identity or resolution from it.
- **RECORD-4 [M + J] — coordinating work lives only where ki-coordination is declared** — A work file at `territory` or `project` level, or an old checkpoint whose `role` is `coordination` or `state-of-play`, lives in a repository whose `.ki.toml` declares `[skills.ki-coordination]`. The level, or for an old checkpoint the role, is the one authority for the kind of work; the repository declaration is only the capability gate. (standards-work-folder.md#front-matter)
  - _Remediation:_ guarded — Declare `[skills.ki-coordination]` where the repository coordinates, or correct the level through an explicit work-file update.
  - _Evidence scope:_ Every work file level and old checkpoint role.
  - _Review prompt:_ Does each declared level or role match how the owner runs the work?
  - _Outcomes:_ conforming; explicit update required; escalate to user
  - _Conforming guidance:_ Take the level from the owner; never infer it from the title, folder name or repository declaration.

## LIFECYCLE — Work-file lifecycle

→ [standard](standards-work-folder.md)

Update, resume, and removal preserve one work file per piece of work without inventing lifecycle state.

- **LIFECYCLE-1 [M + J] — state, uniqueness, and timestamps agree** — A work file's created_at is no later than its since; every old checkpoint carries state active, each thread has at most one, and its timestamps are chronologically coherent; and no old checkpoint stays active beside the work file that replaces it. Removal deletes the record rather than creating a retired state. (standards-work-folder.md)
  - _Remediation:_ guarded — Correct lifecycle metadata only through an explicit UPDATE request; use REMOVE to delete a record.
  - _Evidence scope:_ Every work file and old checkpoint location, state, and timestamp.
  - _Review prompt:_ Does the proposed lifecycle correction preserve explicit user authority and the one-record-per-work rule?
  - _Outcomes:_ conforming; explicit update required; explicit removal required
  - _Conforming guidance:_ Do not change state or timestamps until the user supplies UPDATE direction; REMOVE deletes the record.
- **LIFECYCLE-2 [J] — work-file content is current and durable facts are promoted** — The work file is a concise current state that agrees with the work's last move, with no moves list. Decisions, accepted work state, and reusable knowledge already live with their canonical owners; removal follows the closing mark or explicit direction and does not manufacture completion. (standards-work-folder.md)
  - _Evidence scope:_ Every work file, its named durable owners, and removal authority.
  - _Review prompt:_ Is each work file current and concise, agreeing with its last move, with durable facts promoted to their canonical owners and any removal grounded in the closing mark or explicit user direction rather than inferred completion?
  - _Outcomes:_ conforming; explicit update required; promote durable fact
  - _Conforming guidance:_ Promote facts through their owning lifecycle and update or remove a work file only with explicit authority.

## BOUNDARY — Runtime-neutral reconstruction

→ [standard](standards-work-folder.md)

Portable work-file content never depends on a transcript, vendor session, or private runtime state.

- **BOUNDARY-1 [M-heuristic + J] — a work file contains current state only** — A work file or old checkpoint has no vendor-session field, conversation locator, role-by-role transcript, or mechanically recognisable claim that a fresh agent can reopen the originating session. It is current state, not session continuity. (standards-work-folder.md)
  - _Remediation:_ guarded — Remove session-continuity material only through an explicit user-authorised work-file update.
  - _Evidence scope:_ Every work file and old checkpoint and its content.
  - _Review prompt:_ Would this work file let an agent with no transcript or vendor-session access pick the work up, without implying that the originating conversation can be reopened?
  - _Outcomes:_ conforming; explicit update required; escalate to user
  - _Conforming guidance:_ Do not edit work-file content without explicit authority; ask the user when its content or ownership is uncertain.
