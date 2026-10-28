<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — portable work packages

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-work-package --write`.

Line-by-line criteria for auditing ki-work-package. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [CONFIG — Capability declaration](#config--capability-declaration)
- [STRUCTURE — Work-package locations](#structure--work-package-locations)
- [RECORD — Work-package record](#record--work-package-record)
- [LIFECYCLE — Work-package lifecycle](#lifecycle--work-package-lifecycle)
- [FOLDER — Work-folder closed list and tidy](#folder--work-folder-closed-list-and-tidy)
- [BOUNDARY — Runtime-neutral reconstruction](#boundary--runtime-neutral-reconstruction)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic

## CONFIG — Capability declaration

→ [standard](standards-work-package.md)

The repository opts into one portable contract without embedding runtime or retention policy.

- **CONFIG-1 [M] — the declaration has no private options** — The optional `ki-work-package` declaration is an empty capability marker. It carries no runtime, session, retention, or lifecycle options; repository policy and optional adapters remain separate owners. (standards-work-package.md)
  - _Remediation:_ diagnostic — Remove unsupported declaration options, then rerun the audit.

## STRUCTURE — Work-package locations

→ [standard](standards-work-package.md)

One flat folder per piece of work holds its package files, and older shapes stay readable; Git supplies history.

- **STRUCTURE-1 [M] — the work area holds only work folders** — `+/_WORK/` is a physical directory holding only physical work folders, each with its regular `work.md` work file and, once `state.md` exists, all five package files as regular files. While the legacy `+/_CHECKPOINTS/` directory exists it retains its exact `README.md` scaffold and only flat Markdown records beside it; once `+/_WORK/` exists, neither retired `+/_THREADS/` nor `+/_CHECKPOINTS/` exists beside it, tracked or not. Symlinks, unsupported files, retired-record directories, and nested or timestamped layouts are invalid. (standards-work-package.md)
  - _Remediation:_ automatic
- **STRUCTURE-2 [M + J] — single-file work folders and old checkpoints are read for the tolerance window** — Each single-file work folder, whose `work.md` carries its state and which has no `state.md`, and each old checkpoint under `+/_CHECKPOINTS/` is still read and checked under its old form, with a warning naming its new home, the five-file work package in `+/_WORK/<id>/`, until its territory's migration moves it; the window closes when an inventory shows none left. (standards-work-package.md#old-checkpoints)
  - _Remediation:_ guarded — Move the work to its five-file package at the territory's migration, deleting the old form in the same commit.
  - _Evidence scope:_ Every single-file work folder, every old checkpoint under `+/_CHECKPOINTS/`, and the package named as its new home.
  - _Review prompt:_ Is the older shape still awaiting its territory's migration, rather than kept beside a package that replaces it?
  - _Outcomes:_ awaiting migration; move at migration
  - _Conforming guidance:_ Leave the older shape until its territory's migration; then write the five package files and delete the old form in one commit.

## RECORD — Work-package record

→ [standard](standards-work-package.md)

Closed metadata and document shape make one work package portable and deterministically readable.

- **RECORD-1 [M-heuristic + J] — record identity is chosen and consistent** — Each work folder is named by the work's dotted id, lower-case kebab segments joined by `.` with no mechanically recognisable opaque runtime-session identifier, and the folder, the `id` fields of `work.md` and `state.md`, and each file's H1 agree. An old checkpoint's filename stem is a non-empty single path component, dotted `<initiative>.<project>` and `_state-of-play` included, repeated in its `thread` field and H1. (standards-work-package.md)
  - _Remediation:_ guarded — Correct record identity only through an explicit user-selected thread update.
  - _Evidence scope:_ Every work folder, id field and H1, and every old checkpoint filename, thread field and H1.
  - _Review prompt:_ Is each id or thread name a stable chosen lookup key rather than a vendor or runtime identifier?
  - _Outcomes:_ conforming; explicit rename required; escalate to user
  - _Conforming guidance:_ Keep the work id as the lookup key; do not derive or replace it from runtime metadata.
- **RECORD-2 [M + J] — front matter and headings use the closed schema** — A package's `work.md` declares id, level, title, description, worker and supervisor, project at project level and only there, parent on every package below the main and covers on States of play, checked against the main register and unique secondary coverage, and at most the optional label, theme and created_at, with no state field, and its body is the id H1 then Goals and Scope. Its `state.md` declares id, state and since; target in handoff and only there, hold with its reason and release on hold and only there; and at most the optional blocking, received, beat, mark and method_read, each of its stated type (method_read is a short harness revision string or null), and its body is the `<id> state` H1 then Now, Queue for territory work only, Next steps and Held. `queries.md` holds its H1, Open and Parked, each query a `<TAG> - <title>` block with Context, Query and Options; `messages.md` holds its H1 and message lines, important lines first, or None. Every section says something. A single-file work file keeps its old closed fields and its Next steps, Messages and Parked sections, and an old checkpoint keeps its closed type, thread, state, created_at, updated_at, optional label and role, and its six H2 sections. (standards-work-package.md)
  - _Remediation:_ guarded — Correct authored package schema only through an explicit update.
  - _Evidence scope:_ The authored front matter, headings, and sections of every package file, single-file work file and old checkpoint.
  - _Review prompt:_ Can the schema correction be made without inventing or discarding user-owned work state?
  - _Outcomes:_ conforming; explicit update required; escalate to user
  - _Conforming guidance:_ Ask the user to update uncertain authored content; the checker must not infer missing work state.
- **RECORD-3 [M + J] — an old checkpoint carries a presentation label** — Each old checkpoint carries a `label`: the exact thread name the human uses in their client, of the form `<Space> > <Initiative> > <project in words>`, `<Space> > SoP` for the state-of-play thread or `<Space> > <topic>`, with a `(<host>)` suffix only for a thread limited to that machine; a label in the earlier `<Initiative title>: <project>` or `Master: state-of-play` form stays valid until the owner approves its change. The label is presentation only and never used for resolution; a work file carries its required `title` instead. (standards-work-package.md)
  - _Remediation:_ guarded — Add the label through an explicit checkpoint update; resolution still goes by thread and Project name.
  - _Evidence scope:_ Every old checkpoint label.
  - _Review prompt:_ Does each label match the name the human uses for the thread in their client?
  - _Outcomes:_ conforming; explicit update required; escalate to user
  - _Conforming guidance:_ Take the label from the human; never derive identity or resolution from it.
- **RECORD-4 [M + J] — coordinating work lives only where ki-coordination is declared** — A territory or Project package, or old coordination/state-of-play checkpoint, needs [skills.ki-coordination] capability. This never assigns an active session role. A regular package needs no coordination capability merely by existing. Explicitly owner-opened regular coordination checks capability at bootstrap, unless a specific owner-approved exception covers that opening. No stored coordinator field is added. (standards-work-package.md#state-file)
  - _Remediation:_ guarded — Declare `[skills.ki-coordination]` where the repository coordinates, or correct the level through an explicit work-file update.
  - _Evidence scope:_ Work levels, legacy roles and explicitly owner-opened coordinating sessions.
  - _Review prompt:_ Does the explicit opener check authority and coordination capability or its specific owner-approved exception, while regular packages remain usable conversationally?
  - _Outcomes:_ conforming; explicit update required; escalate to user
  - _Conforming guidance:_ Preserve the actual level; package, id, binding and capability never select coordination. Check the opener under ki-coordination Session kinds, preserving the specific Acquire intake exception.

## LIFECYCLE — Work-package lifecycle

→ [standard](standards-work-package.md)

Update, resume, and removal preserve one package per piece of work without inventing lifecycle state.

- **LIFECYCLE-1 [M + J] — state, uniqueness, and timestamps agree** — A work package's created_at is no later than its since; every old checkpoint carries state active, each thread has at most one, and its timestamps are chronologically coherent; and no old checkpoint stays active beside the work package that replaces it. Removal deletes the record rather than creating a retired state. (standards-work-package.md)
  - _Remediation:_ guarded — Correct lifecycle metadata only through an explicit UPDATE request; use REMOVE to delete a record.
  - _Evidence scope:_ Every work package, single-file work folder and old checkpoint location, state, and timestamp.
  - _Review prompt:_ Does the proposed lifecycle correction preserve explicit user authority and the one-record-per-work rule?
  - _Outcomes:_ conforming; explicit update required; explicit removal required
  - _Conforming guidance:_ Do not change state or timestamps until the user supplies UPDATE direction; REMOVE deletes the record.
- **LIFECYCLE-2 [J] — package content is current and durable facts are promoted** — The work file is a stable definition whose description routes clearly against its neighbours, and `state.md` is a concise current state that agrees with the work's last move, with no moves list. Decisions, accepted work state, and reusable knowledge already live with their canonical owners; removal follows the closing mark or explicit direction and does not manufacture completion. (standards-work-package.md)
  - _Evidence scope:_ Every work package, its named durable owners, and removal authority.
  - _Review prompt:_ Is each package current and concise, its description routing clearly and its state agreeing with its last move, with durable facts promoted to their canonical owners and any removal grounded in the closing mark or explicit user direction rather than inferred completion?
  - _Outcomes:_ conforming; explicit update required; promote durable fact
  - _Conforming guidance:_ Promote facts through their owning lifecycle and update or remove a package only with explicit authority.
- **LIFECYCLE-3 [M-heuristic + J] — package files keep within their soft size limits** — A description runs to at most 500 characters, a `work.md` body to at most 300 words and a `state.md` body to at most 400 words with Now at most five lines and no bulk history: no dated log lines, runs of commit identifiers or test counts, a single link being fine. Each message line runs to about 60 words at most, and none waits more than 7 days on work that is not on hold; `decisions.md` runs to at most 400 lines. The limits are soft and warned, never failed. (standards-work-package.md#size-limits)
  - _Remediation:_ guarded — Trim at the next update: link the detail, move history to the commit or run report, act on old messages, and strike homed decisions.
  - _Evidence scope:_ Every package file the size warning names.
  - _Review prompt:_ Is the flagged content needed in the package, or does it belong in a link, the commit, a run report or a durable home?
  - _Outcomes:_ conforming; trim at next update; escalate to user
  - _Conforming guidance:_ Trim only at the work's own next update; another session names the warning in a message line.

## FOLDER — Work-folder closed list and tidy

→ [standard](standards-work-package.md)

Each work folder holds only its closed list, and what is due for the tidy is listed for its steward, so folders stay pruned without relying on memory.

- **FOLDER-1 [M] — every work folder holds only its closed list** — Each work folder `+/_WORK/<id>/` holds only the five package files, per-tag Markdown findings `findings/<tag>.md`, `<name>.report.md`, Markdown briefs under `briefs/`, Markdown feedback packages under `feedback/`, and under `design/` only design notes, subject folders of the same kinds, diagram sources and their `.svg` and `.html` renders. Scripts, screenshots, scratch folders and tool output fail. For the tolerance window a thread folder `+/_THREADS/<run>/` is checked against its old closed list, `decisions.md` and `<name>.report.md`, with a warning naming its new home. (standards-work-package.md#closed-list)
  - _Remediation:_ diagnostic — Move each stray file to its owning home, or delete it where it is temporary output, which belongs in the run's temporary directory. Fix only your own work's folder; tell other work by one line in its `messages.md`.
- **FOLDER-2 [M-heuristic + J] — no work folder keeps a report whose queries are all answered** — A run report whose every Needs tag the folder's decisions log names, or which has no queries, is a candidate for the tidy once its outcome has a durable home. Whether it has one stays the steward's judgement; the listing is never permission to delete. (standards-work-package.md#tidying-the-work-folder)
  - _Remediation:_ diagnostic — At the steward's next send or mark, delete by explicit path each listed report whose outcome has a durable home, keeping any whose home is unclear.
  - _Evidence scope:_ The flagged work folders, their decisions logs and the work files and records the reports name.
  - _Review prompt:_ Does each flagged report's outcome have a durable home, a work record, the decisions log, the work package or a commit, and is every query it raised answered in the log, so that the owning steward may delete it, and did territory work name the flagged folders at its mark?
  - _Outcomes:_ conforming; prune the work folder; home the outcome first; escalate to owner
  - _Conforming guidance:_ Delete by explicit path only the reports whose outcome is homed; home an unhomed outcome before deleting its report, and leave another work folder to its own steward, told by a line in its `messages.md`.
- **FOLDER-3 [M-heuristic] — no work folder keeps a brief whose run's report it has received** — A brief `briefs/<run>.md` goes once its run's report has been received, which the folder shows by holding `<run>.report.md`. (standards-work-package.md#tidying-the-work-folder)
  - _Remediation:_ diagnostic — Delete each listed brief by explicit path at the steward's next send or mark, unless its handoff is open.
- **FOLDER-4 [M] — no finished work's folder outlives its closing mark** — Finished work keeps its package with `state: finished` only until the mark that closes it; a folder whose state is `finished` and whose `mark` falls at or after its `since` is due for the close-out. (standards-work-package.md#removal-lifecycle)
  - _Remediation:_ diagnostic — Once its decisions are homed, every finding settled with its disposition recorded, and `design/` resolved, delete the finished work folder in one commit, with Git keeping it.
- **FOLDER-5 [M] — every folder awaiting review has its index line** — Each folder under `+/_WORK_REVIEW/` has one line in the holding area's `README.md` saying why it is there, and each index line names a folder still held. (standards-work-package.md#work-awaiting-review)
  - _Remediation:_ diagnostic — Add the missing index line, or remove the line in the same commit that moves or deletes its folder.
- **FOLDER-6 [M] — no work package holds more than eight open queries** — More than eight queries under `queries.md`'s `## Open` is a coordination smell and warns. (standards-work-package.md#queries-file)
  - _Remediation:_ diagnostic — Answer, park or merge open queries until eight or fewer remain.
- **FOLDER-7 [M] — every decisions log reads to the close gate as entries** — The `ki agent close` gate opens one entry at every `##` heading, timestamped, dated, numbered or free text, and reads nothing else. A list item or deeper heading before the first `##` heading is a decision the gate never sees, a heading with no text is one it cannot name, and a repeated heading is one `ki agent reconcile` cannot address. Thread folders' logs are read too, since the gate reads whichever log a run's home holds. (standards-work-package.md#decisions-log)
  - _Remediation:_ diagnostic — Give each unread decision its own `## <YYYY-MM-DD HH:MM zone> - <title>` heading, the form `ki agent decide` writes, title any empty heading, and make repeated headings distinct. Fix only your own work's log; tell other work by one line in its `messages.md`.

## BOUNDARY — Runtime-neutral reconstruction

→ [standard](standards-work-package.md)

Portable package content never depends on a transcript, vendor session, or private runtime state.

- **BOUNDARY-1 [M-heuristic + J] — a work package contains current state only** — A work package, single-file work file or old checkpoint has no vendor-session field, conversation locator, role-by-role transcript, or mechanically recognisable claim that a fresh agent can reopen the originating session. It is current state, not session continuity. (standards-work-package.md)
  - _Remediation:_ guarded — Remove session-continuity material only through an explicit user-authorised work-file update.
  - _Evidence scope:_ Every work package, single-file work file and old checkpoint and its content.
  - _Review prompt:_ Would this package let an agent with no transcript or vendor-session access pick the work up, without implying that the originating conversation can be reopened?
  - _Outcomes:_ conforming; explicit update required; escalate to user
  - _Conforming guidance:_ Do not edit work-file content without explicit authority; ask the user when its content or ownership is uncertain.
