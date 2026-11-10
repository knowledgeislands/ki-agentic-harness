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
- [FOLDER — Work-package closed list and tidy](#folder--work-package-closed-list-and-tidy)
- [BOUNDARY — Runtime-neutral reconstruction](#boundary--runtime-neutral-reconstruction)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standard-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication)
  - _Remediation:_ automatic

## CONFIG — Capability declaration

→ [standard](standard-work-package.md)

The repository opts into one portable contract without embedding runtime or retention policy.

- **CONFIG-1 [M] — the declaration has no private options** — The optional `ki-work-package` declaration is an empty capability marker. It carries no runtime, session, retention, or lifecycle options; repository policy and optional adapters remain separate owners. (standard-work-package.md#41-activation-and-ownership)
  - _Remediation:_ diagnostic — Remove unsupported declaration options, then rerun the audit.

## STRUCTURE — Work-package locations

→ [standard](standard-work-package.md)

One folder per piece of work, under its territory in `work/`, holds its package; earlier copies are listed; Git supplies history.

- **STRUCTURE-1 [M] — `work/` holds only territory folders of packages** — `work/` is a physical directory holding only territory folders, each named by the first segment of its packages' ids and holding only package folders, each a physical directory with its regular `_index.md`. Symlinks, loose files, empty folders, and timestamped, archived or alternate layouts are invalid; the one nesting is a sub-package. (standard-work-package.md#42-location-and-identity, standard-work-package.md#43-the-shape)
  - _Remediation:_ diagnostic — Move each stray entry to its owning package or delete it where it is temporary output, and remove empty folders. Fix only your own work's package; tell other work by a message.
- **STRUCTURE-2 [M + J] — earlier copies of packages are listed** — A retired working area, `+/_WORK/`, `+/_WORK_REVIEW/`, `+/_THREADS/` or `+/_CHECKPOINTS/`, left in a declaring repository holds earlier copies of packages. Each is listed for its owner, who moves any live package to `work/<territory>/<id>/` in the Agora store; the listing is never permission to delete. (standard-work-package.md#410-the-tidy)
  - _Remediation:_ guarded — Move any live package to the store under the tidy, then remove the earlier copy on its owner's word, Git keeping its history.
  - _Evidence scope:_ Every retired working area the listing names, and the package in `work/` that replaces each copy.
  - _Review prompt:_ Is each listed copy already replaced by a package in the store, or still the only copy of live work?
  - _Outcomes:_ replaced, remove on the owner's word; move to the store first; escalate to owner
  - _Conforming guidance:_ Remove an earlier copy only on its owner's word, and never before its live work is in the store.

## RECORD — Work-package record

→ [standard](standard-work-package.md)

Closed metadata and document shape make one work package portable and deterministically readable.

- **RECORD-1 [M-heuristic + J] — package identity is chosen and consistent** — Each package folder is named by the work's dotted id, lower-case kebab segments joined by `.` with no mechanically recognisable opaque runtime-session identifier, and stands in the territory folder of the id's first segment; a sub-package's id is `<parent id>.<slug>`, its folder named by the slug. The folder, the `id` field of `_index.md` and its H1 agree. (standard-work-package.md#42-location-and-identity, standard-work-package.md#47-sub-packages)
  - _Remediation:_ guarded — Correct package identity only through an explicit rename the work's owner selects.
  - _Evidence scope:_ Every package and sub-package folder, its id field and its H1.
  - _Review prompt:_ Is each id a stable chosen lookup key rather than a vendor or runtime identifier?
  - _Outcomes:_ conforming; explicit rename required; escalate to user
  - _Conforming guidance:_ Keep the work id as the lookup key; do not derive or replace it from runtime metadata.
- **RECORD-2 [M + J] — the entry file uses the closed schema** — A package's `_index.md` declares id, level, title, description, worker, supervisor and `repositories`, a list of repository names that may be empty; project at project level and only there; parent on every package below the main and covers on States of play, checked against the main register and unique secondary coverage; on a sub-package, parent naming its parent package, its parent's level and no covers; its role, one role from the role standard's catalogue, its absence and the old words assistant and keeper warned on under the role migration file; and at most the optional label, theme and created_at. Beside them stand the state fields: state and since; target in handoff and only there; hold with its reason, release and optional set_by, owner or worker, the worker setting only more-expected, on hold and only there; at most the optional blocking, received, beat, mark and method_read, each of its stated type, method_read a short harness revision string or null; the thread capability fields, listening_enabled and syncing_enabled booleans, listening_status and syncing_status on or off, each status present exactly while its capability is enabled, and syncing_enabled true only where listening_enabled is true; and the optional `workers`, a list of live seats, each a mapping of `role`, one catalogue role, and `tier`, that role's catalogue tier, and at most `since`, a UTC timestamp, `status`, active or idle, and `listening`, on or off, checked against the catalogue table read at audit time, an entry's focus, name, uri or designation, `listening: agora-call` and the old tiers enablers and doers warned on under the role migration file. Nothing else stands in the front matter. Its body is the id H1, then Goals, Scope, an optional one-line Values, Now, Held and Changes, each saying something, if only None. (standard-work-package.md#44-the-entry-file, standard-work-package.md#45-the-state, standard-work-package.md#47-sub-packages)
  - _Remediation:_ guarded — Correct the entry file only through an explicit update by the work's own steward.
  - _Evidence scope:_ Every package's and sub-package's entry file: its front matter, headings and sections.
  - _Review prompt:_ Can the schema correction be made without inventing or discarding user-owned work state?
  - _Outcomes:_ conforming; explicit update required; escalate to user
  - _Conforming guidance:_ Ask the user to update uncertain authored content; the checker must not infer missing work state.

## LIFECYCLE — Work-package lifecycle

→ [standard](standard-work-package.md)

Update, resume, and removal preserve one package per piece of work without inventing lifecycle state.

- **LIFECYCLE-1 [M + J] — timestamps agree** — A package's created_at is no later than its since. Removal deletes the package rather than creating a retired state. (standard-work-package.md#45-the-state, standard-work-package.md#415-removal-lifecycle)
  - _Remediation:_ guarded — Correct lifecycle metadata only through an explicit UPDATE request; use REMOVE to delete a package.
  - _Evidence scope:_ Every package's state and timestamps.
  - _Review prompt:_ Does the proposed lifecycle correction preserve explicit user authority and the one-package-per-work rule?
  - _Outcomes:_ conforming; explicit update required; explicit removal required
  - _Conforming guidance:_ Do not change state or timestamps until the user supplies UPDATE direction; REMOVE deletes the package.
- **LIFECYCLE-2 [J] — package content is current and durable facts are promoted** — The entry file's definition is stable, its description routing clearly against its neighbours, and its state is current and agrees with the work's last move, with no moves list. Decisions sit in their change document until homed, and decisions of closed changes, accepted work state and reusable knowledge already live with their canonical owners; removal follows the closing mark or explicit direction and does not manufacture completion. (standard-work-package.md#44-the-entry-file, standard-work-package.md#46-change-documents, standard-work-package.md#415-removal-lifecycle)
  - _Evidence scope:_ Every package, its change documents, its named durable owners, and removal authority.
  - _Review prompt:_ Is each package current and concise, its description routing clearly and its state agreeing with its last move, with the decisions of closed changes promoted to their canonical owners and any removal grounded in the closing mark or explicit user direction rather than inferred completion?
  - _Outcomes:_ conforming; explicit update required; promote durable fact
  - _Conforming guidance:_ Promote facts through their owning lifecycle and update or remove a package only with explicit authority.
- **LIFECYCLE-3 [M-heuristic + J] — the state stays short and carries no history** — A description runs to at most 500 characters, and Now to at most five lines, and Now and Held carry no bulk history: no dated log lines, runs of commit identifiers or test counts, a single link being fine. These are warned, never failed. (standard-work-package.md#45-the-state)
  - _Remediation:_ guarded — Trim at the next update: link the detail and leave history to the Git log and the commit.
  - _Evidence scope:_ Every entry file the warning names.
  - _Review prompt:_ Is the flagged content needed in the state, or does it belong in a link, the commit or a durable home?
  - _Outcomes:_ conforming; trim at next update; escalate to user
  - _Conforming guidance:_ Trim only at the work's own next update; another session names the warning in a message.

## FOLDER — Work-package closed list and tidy

→ [standard](standard-work-package.md)

Each package holds only its closed list and links all of its work, and what is due for close-out is listed, so packages stay pruned without relying on memory.

- **FOLDER-1 [M] — every package holds only its closed list** — A package holds only its `_index.md`, its change documents `NN-<slug>.change.md`, and sub-packages of the same shape, each a folder named by a lower-case kebab slug holding its own `_index.md` and one or more change documents. Any other file or folder fails: `state.md`, `decisions.md`, `discussions.md`, `messages.md`, focus folders, run reports, briefs, findings, feedback, scripts, screenshots, scratch folders and tool output. (standard-work-package.md#43-the-shape, standard-work-package.md#47-sub-packages)
  - _Remediation:_ diagnostic — Under the tidy, fold the state into `_index.md`, move live decisions and open points into the change document they belong to, and delete what has a durable home or is temporary output, which belongs in the run's temporary directory. Fix only your own work's package; tell other work by a message.
- **FOLDER-4 [M] — no finished work's package is left standing** — Finished work keeps its package with `state: finished` only until its close-out; no coordinator reads a Finished work's package, so every package whose state is `finished` is due for close-out, whatever its mark. (standard-work-package.md#410-the-tidy, standard-work-package.md#415-removal-lifecycle)
  - _Remediation:_ diagnostic — The finishing coordinator deletes the package at the mark that closes it; where the package outlives the finishing thread, territory work closes it at an owner-authorised mark whose report names it: once every close-out check holds, it deletes the package in one commit, Git keeping it, and otherwise deletes nothing and puts one open point to the owner in a change document of its own.
- **FOLDER-8 [M] — every change document and sub-package is linked from Changes** — A package's `_index.md` Changes section links every change document and every sub-package the package holds, so that an agent pointed at the entry file reaches all of its work. (standard-work-package.md#44-the-entry-file, standard-work-package.md#47-sub-packages)
  - _Remediation:_ diagnostic — Add one list item under `## Changes` for each unlinked change document or sub-package, saying in a line what it is and where it stands. Fix only your own work's package; tell other work by a message.

## BOUNDARY — Runtime-neutral reconstruction

→ [standard](standard-work-package.md)

Portable package content never depends on a transcript, vendor session, or private runtime state.

- **BOUNDARY-1 [M-heuristic + J] — a work package contains current state only** — A package's `_index.md` has no vendor-session field, conversation locator, role-by-role transcript, or mechanically recognisable claim that a fresh agent can reopen the originating session. It is the work's definition and current state, not session continuity. (standard-work-package.md#416-prohibited-payloads-and-claims)
  - _Remediation:_ guarded — Remove session-continuity material only through an explicit user-authorised update of the entry file.
  - _Evidence scope:_ Every package and sub-package, its entry file and its change documents.
  - _Review prompt:_ Would this package let an agent with no transcript or vendor-session access pick the work up, without implying that the originating conversation can be reopened?
  - _Outcomes:_ conforming; explicit update required; escalate to user
  - _Conforming guidance:_ Do not edit package content without explicit authority; ask the user when its content or ownership is uncertain.
