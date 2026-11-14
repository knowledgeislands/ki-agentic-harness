---
name: ki-work-package
ki-kind: governance
ki-applicability: detected
ki-guild: work
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
contributes: ['.ki.toml']
description: >
  Own the work package of one piece of work, `work/<territory>/<id>/` in the Cairn store: its `_index.md`, holding the
  definition with its routing description, goals, scope and repositories and the state for recovery, its
  `NN-<slug>.change.md` change documents, where decisions and open points live, and sub-packages of the same shape,
  plus the closed list, the writers and the tidy. Use to create, update, resume, audit, tidy or remove a package, or to
  pick work up without a transcript or vendor session; Git is the logbook, messages go through the Cairn store, and
  durable knowledge stays with its owners.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh | remove <id> | resume <id> | update <id>'
---

# Knowledge Islands work package

This governance skill is the canonical specification of the work package, `work/<territory>/<id>/` in the Cairn store: its entry file, its change documents and sub-packages, its closed list, its writers and its tidy, the contract other skills check in on. The package lets a fresh agent, or State of play routing new work, understand a piece of work and pick it up without claiming access to the session that last held it, under the work model that the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) note describes. Read [the work-package standard](references/standard-work-package.md) before reading, creating, updating, or removing a package, and [the role standard](references/standard-roles.md) for the role catalogue, each role's tier and glyph, the `role` and `workers` fields and the thread line, with its deletable [role migration file](references/standards-roles-migration.md); [the generated rubric](references/rubric.md) publishes its mechanical and judgment criteria, and [the sources](references/sources.md) record the contract's provenance.

## Shared model

- **Work package** - `_index.md` and its change documents ([the shape](references/standard-work-package.md#43-the-shape)). `_index.md` is enough to recover from: the definition, with its routing `description`, `repositories`, `## Goals` and `## Scope`, and the state, its state fields, at most five `## Now` lines, `## Held` and `workers`, with `## Changes` linking every change document and sub-package ([the entry file](references/standard-work-package.md#44-the-entry-file), [the state](references/standard-work-package.md#45-the-state)). Each `NN-<slug>.change.md` carries its decisions until they are homed and its open points in its Open section ([change documents](references/standard-work-package.md#46-change-documents)).
- **Sub-packages** - a package holding more than one strand of work gives each a [sub-package](references/standard-work-package.md#47-sub-packages) of the same shape, id `<parent id>.<slug>`.
- **Roles** - every seat takes exactly one role from [the role catalogue](references/standard-roles.md#43-role-catalogue), the one home of what each role glyph means: leaders, managers and makers, each role with what it owns and never does. `_index.md` names the package's `role` and lists its live seats under `workers` with `role` and `tier`, and a seat closes with its [thread line](references/standard-roles.md#46-thread-line), `<role glyph> 🔑 <work-id>`, or `🧵 <work-id>` with no role yet.
- **Closed list and writers** - a package holds nothing else: no `state.md`, `decisions.md`, `discussions.md` or `messages.md`, and no focus folders, reports, briefs, findings or feedback. [The writers](references/standard-work-package.md#49-writers) are the package's own steward and a background run writing a change document; [messages](references/standard-work-package.md#48-messages) go through the Cairn store. [The tidy](references/standard-work-package.md#410-the-tidy) brings a package to the shape and keeps it there, Git keeping the rest. `ki-coordination` says when to tidy and whether an outcome is homed, `ki-delegation` owns the run side, and `ki-work design` owns a change document's graduation.
- **Removal** - finished work's package is deleted at the mark that closes it, and any other removal follows explicit user direction after durable information has reached its proper owners. There is no retired-record state; Git supplies recovery history.
- **Current state, not continuity** - a package carries only enough for a fresh agent to continue. It is never a transcript, vendor-session identifier, conversation locator, session host seat, completion signal, roadmap, or memory system, and its state keeps no history.
- **Explicit write authority** - write at a move, at the user's request or at a documented repository-local trigger. When the selected work or content is uncertain, do not write.

Project notes and theme pages are not a home for status: a package says where work lies, a registry note carries only its standing outcome or direction, `lifecycle` and notes, and the work records and `ki` views carry status.

`ki-work-package` remains the portable work-state record; `ki-work recap` is the user-facing judgment-led session summary. A runtime-specific Stop reminder cannot invoke recap or its transcript-grounding helper: it may only address an already-selected valid package under `ki-work-package`'s separate opt-in contract. It cannot invent, select, update, or remove a record, fabricate recap prose, or infer a summary from vendor-session material.

`ki-work recap` writes no package: every package write, a hand-off's update included, goes through this skill's update procedure, as Kris took RECAP-NARROW a) on 7 November 2026.

The standard also owns assigned stewardship under [the writers](references/standard-work-package.md#49-writers), including the unresolved STEWARD-FIELD placeholder, `parent` and `covers` relations, and inventory-based host requirements. These rules add no unattended field.

## Operating modes

The skill carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH** modes and the operational **REMOVE · RESUME · UPDATE** modes. Invoked as `help` / `-h` / `?`, it emits generated HELP and stops. With no recognised mode, it emits the same HELP and, only in an interactive session, offers the mode choice and prompts for any target shown in `argument-hint`.

### Mode AUDIT

Run `ki repo audit --skill ki-work-package --repo <repo>`. The structured catalogue checks that `work/` holds only territory folders of packages, each with its `_index.md`; each package's and sub-package's identity, closed front matter with its state-dependent fields, timestamp chronology and exact heading set; that it holds only its closed list; that its Changes section links every change document and sub-package; and that no finished work's package is left standing. It warns on Now past five lines, a description past 500 characters, history in the state, and each earlier copy of packages left in `+/_WORK/`, `+/_WORK_REVIEW/`, `+/_THREADS/` or `+/_CHECKPOINTS/`.

Review the judgment aspects: whether each description routes clearly against its neighbours, whether the state is concise and agrees with the work's last move, whether its id is chosen under Work naming rather than runtime-derived, whether durable facts already live with their proper owners, and whether the package lets a fresh agent pick the work up.

### Mode CONFORM

Run AUDIT first, then `ki repo conform --skill ki-work-package --repo <repo> --dry-run`. CONFORM may publish the generated rubric, but never chooses work, edits an authored package file, moves work between states or shapes, removes a package, infers completion, or writes a runtime-session identifier.

Correct authored packages only through an explicit UPDATE or REMOVE request, then re-run AUDIT.

### Mode EDUCATE

Run `ki repo educate --skill ki-work-package --repo <repo>` to render the concern and rubric. Explain the package form and lifecycle from [the work-package standard](references/standard-work-package.md); do not create a declaration or package merely to demonstrate it.

### Mode HELP

Explain the package's shape, its entry file and change documents, sub-packages, messages through the Cairn store, the manual resume flow, explicit write boundary, removal-and-Git-history lifecycle, and off-ramps to `ki-coordination` for the levels, states and moves, `ki-work recap`, roadmap or knowledge owners, and optional runtime adapters, then stop without reading or changing repository state.

### Mode REFRESH

REFRESH writes only in `ki-agent-backpack`. When invoked from an installed copy, stop and name the Harness as the place to run it. Read [the sources](references/sources.md), re-check the portable work-state boundary and current runtime capabilities, propose any standard change, then update the source review evidence only after the review occurs.

### Mode REMOVE

REMOVE is an agent procedure, not a current `ki repo` host command. Require explicit user direction, or the mark that closes finished work, for one valid `<id>`. Confirm durable decisions, work status, and knowledge have reached their canonical owners; then delete that exact package. Stop on uncertainty. Removal does not infer completion; Git remains the recovery history.

### Mode RESUME

RESUME is an agent procedure, not a current `ki repo` host command. Require the user-selected `<id>` or, from an opener, the Project slug. Resolve `work/<territory>/<id>/`; if no package, or more than one, matches, stop and ask. Never resolve by title or label. Read `_index.md` in full and verify the folder, its `id` and its H1 agree, then read the change documents and sub-packages its Changes section names as the work needs, act on its state as `ki-coordination`'s Picking work up sets it, its messages in the Cairn store first, and continue from Now in a fresh context. Never search archived or nested paths, search by vendor identifier, or claim to reopen the original session. If the named package is absent or invalid, stop and report the exact problem.

### Mode UPDATE

UPDATE is an agent procedure, not a current `ki repo` host command. Require a user-selected `<id>` plus a move, an explicit request or a documented local trigger. Rewrite the state in `_index.md` in the exact form of [the work-package standard](references/standard-work-package.md#45-the-state), setting `since` at each move, and change its definition only when the work's definition changes, preserving `created_at`; replace the current state in place rather than appending a moves list or history. Record only current state and references to durable owners. Never manufacture decisions, copy a transcript, add a runtime-session identifier or host seat, or create a package from an unqualified Stop event. A decision taken goes into the change document it belongs to.

## Verification boundary

The checker is read-only over packages. A runtime adapter may discover a user-selected package, but it remains a consumer: it cannot weaken the state, selection, write-authority, or no-session-continuity contract.
