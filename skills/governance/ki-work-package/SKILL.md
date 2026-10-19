---
name: ki-work-package
ki-kind: governance
ki-applicability: detected
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
contributes: ['.ki.toml']
owns: ['+/_CHECKPOINTS/README.md']
description: >
  Own the work package of one piece of work, its five files in its work folder `+/_WORK/<id>/`: the definition
  `work.md` with its routing description, goals and scope, `state.md`, `queries.md`, the `messages.md` queue and
  `decisions.md`, plus the folder's closed list, entry points, tidy and close-out rules and the `+/_WORK_REVIEW/`
  holding area. Use to create, update, resume, audit, tidy or remove a package, or to pick work up without a
  transcript or vendor session; Git is the logbook, durable knowledge stays with its owners, and single-file work
  folders and old `+/_CHECKPOINTS/` records stay readable for the tolerance window.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh | remove <id> | resume <id> | update <id>'
---

# Knowledge Islands work package

This governance skill is the canonical specification of the work package and of the work folder it lives in, `+/_WORK/<id>/`: its five files, its closed list, its entry points, its tidy rules, its review area, its message queue and the four-point contract other skills check in on. The package lets a fresh agent, or State of play routing new work, understand a piece of work and pick it up without claiming access to the session that last held it, under the work model that the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) note describes. Read [the work-package standard](references/standards-work-package.md) before reading, creating, updating, or removing a package; [the generated rubric](references/rubric.md) publishes its mechanical and judgment criteria, and [the sources](references/sources.md) record the contract's provenance.

## Shared model

- **Work package** - five files, all created with the work ([the package form](references/standards-work-package.md#exact-package-form)): `work.md`, the definition read first and changed rarely, with its routing `description`, `## Goals` and `## Scope`; `state.md`, where the work lies, rewritten at every move; `queries.md`, open and parked queries in full; `messages.md`, the incoming queue taken in priority order with important lines first; and `decisions.md`. They read in four levels of [progressive reveal](references/standards-work-package.md#progressive-reveal).
- **Work folder** - `+/_WORK/<id>/` holds only its [closed list](references/standards-work-package.md#closed-list): the five package files, run reports, open briefs and `design/`. Each [entry point](references/standards-work-package.md#entry-points) writes only its own kinds, and [a tidy](references/standards-work-package.md#tidying-the-work-folder) deletes what is homed, Git keeping the rest. `ki-coordination` says when to tidy and whether an outcome is homed, `ki-delegation` owns the run side, and `ki-work-design` owns a design note's graduation.
- **Older shapes** - a [single-file work folder](references/standards-work-package.md#the-single-file-shape), whose `work.md` carries state, and `+/_CHECKPOINTS/<thread>.md` records ([old checkpoints](references/standards-work-package.md#old-checkpoints)) stay readable, each with a warning, until the territory's migration moves them.
- **Removal** - finished work's folder is deleted at the mark that closes it, and any other removal follows explicit user direction after durable information has reached its proper owners. There is no retired-record state; Git supplies recovery history.
- **Current state, not continuity** - a package carries only enough for a fresh agent to continue. It is never a transcript, vendor-session identifier, conversation locator, host, completion signal, roadmap, or memory system, and `state.md` keeps no history.
- **Explicit write authority** - write at a move, at the user's request or at a documented repository-local trigger. When the selected work or content is uncertain, do not write.

Project notes and theme pages are not a home for status: a package says where work lies, a registry note carries only its standing outcome or direction, `lifecycle` and notes, and the work records and `ki` views carry status.

`ki-work-package` remains the portable work-state record; `ki-recap` is the user-facing judgment-led session summary. A runtime-specific Stop reminder cannot invoke recap or its transcript-grounding helper: it may only address an already-selected valid package under `ki-work-package`'s separate opt-in contract. It cannot invent, select, update, or remove a record, fabricate recap prose, or infer a summary from vendor-session material.

The optional `ki-recap checkpoint <id>` composition is a caller of the existing UPDATE procedure, never a second implementation. It may supply freshly grounded repository and work-state evidence only after explicit user authority and a valid declaration, exact work, immutable baseline or complete portable patch, scoped authority, result destination, and verification plan have all been established. `ki-work-package` still validates the package and owns every write or refusal.

## Operating modes

The skill carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH** modes and the operational **REMOVE · RESUME · UPDATE** modes. Invoked as `help` / `-h` / `?`, it emits generated HELP and stops. With no recognised mode, it emits the same HELP and, only in an interactive session, offers the mode choice and prompts for any target shown in `argument-hint`.

### Mode AUDIT

Run `ki repo audit --skill ki-work-package --repo <repo>`. The structured catalogue checks that `+/_WORK/` holds only work folders, tells each folder's shape by whether `state.md` exists, and checks each package file's identity, closed front matter with its state-dependent fields, timestamp chronology and exact heading set, the message queue's order, that no state is left in a package's `work.md`, and that coordinating work lives only where `ki-coordination` is declared. It warns on the soft size limits, on bulk history in `state.md`, on each single-file work folder, checked under its old form, and on each old checkpoint, with the retained `+/_CHECKPOINTS/README.md` scaffold while that directory exists.

Review the judgment aspects: whether each description routes clearly against its neighbours, whether `state.md` is concise and agrees with the work's last move, whether its id is chosen under Work naming rather than runtime-derived, whether durable facts already live with their proper owners, and whether the package lets a fresh agent pick the work up.

### Mode CONFORM

Run AUDIT first, then `ki repo conform --skill ki-work-package --repo <repo> --dry-run`. CONFORM may safely restore an existing `+/_CHECKPOINTS/` directory's exact README scaffold, but never chooses work, edits an authored package file or checkpoint, moves work between states or shapes, removes a record, infers completion, or writes a runtime-session identifier.

Correct authored records only through an explicit UPDATE or REMOVE request, then re-run AUDIT.

### Mode EDUCATE

Run `ki repo educate --skill ki-work-package --repo <repo>` to render the concern and rubric. Explain the package form and lifecycle from [the work-package standard](references/standards-work-package.md); do not create a declaration, work folder, or package merely to demonstrate it.

### Mode HELP

Explain the five files and their form, progressive reveal, the message queue, the older shapes read for the tolerance window, the manual resume flow, explicit write boundary, removal-and-Git-history lifecycle, and off-ramps to `ki-coordination` for the levels, states and moves, `ki-recap`, roadmap or knowledge owners, and optional runtime adapters, then stop without reading or changing repository state.

### Mode REFRESH

REFRESH writes only in `ki-agentic-harness`. When invoked from an installed copy, stop and name the Harness as the place to run it. Read [the sources](references/sources.md), re-check the portable work-state boundary and current runtime capabilities, propose any standard change, then update the source review evidence only after the review occurs.

### Mode REMOVE

REMOVE is an agent procedure, not a current `ki repo` host command. Require explicit user direction, or the mark that closes finished work, for one valid `<id>`. Confirm durable decisions, work status, and knowledge have reached their canonical owners; then delete that exact work folder, or the exact old checkpoint, retaining an existing `+/_CHECKPOINTS/README.md` scaffold. Stop on uncertainty. Removal does not infer completion; Git remains the recovery history.

### Mode RESUME

RESUME is an agent procedure, not a current `ki repo` host command. Require the user-selected `<id>` or, from an opener, the Project slug. Resolve `+/_WORK/<id>/`; for the tolerance window, when it is absent, the single old checkpoint whose stem maps to that id under Work naming; if no folder or file, or more than one, matches, stop and ask. Never resolve by title or label. Read the five package files in full, or `work.md` alone in the single-file shape, and verify the folder, each `id` and each H1 agree, then act on its state as `ki-coordination`'s Picking work up sets it, the message queue first and its important lines first, and continue from its next steps in a fresh context. Never search archived or nested paths, search by vendor identifier, or claim to reopen the original session. If the named package is absent or invalid, stop and report the exact problem.

### Mode UPDATE

UPDATE is an agent procedure, not a current `ki repo` host command. Require a user-selected `<id>` plus a move, an explicit request or a documented local trigger. Rewrite `state.md` in the exact form of [the work-package standard](references/standards-work-package.md), setting `since` at each move, and change `work.md` only when the work's definition changes, preserving `created_at`; replace the current state in place rather than appending a moves list or history. Record only current state and references to durable owners. Never manufacture decisions, copy a transcript, add a runtime-session identifier or host, or create a package from an unqualified Stop event. A new piece of work is created with all five files at once. A single-file work folder or old checkpoint is updated in its old form only until its move, which writes the five files and deletes the old form in one commit.

## Verification boundary

The checker is read-only over packages, single-file work folders and old checkpoints. A runtime adapter may discover a user-selected record, but it remains a consumer: it cannot weaken the state, selection, write-authority, or no-session-continuity contract.
