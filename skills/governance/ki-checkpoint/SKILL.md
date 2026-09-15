---
name: ki-checkpoint
ki-kind: governance
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
contributes: ['.ki.toml']
owns: ['+/_CHECKPOINTS/']
description: >
  Governs concise, repository-owned checkpoints for resuming one human-named active thread in a fresh agent context without a transcript or vendor session. Use when asked to checkpoint current work, update or remove a checkpoint, resume a named thread, audit `+/_CHECKPOINTS/`, or explain portable reconstruction state. It keeps one active snapshot per thread and leaves historical recovery to Git while decisions, roadmap state, knowledge, recap, runtime hooks, and session continuity remain with their proper owners.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh | remove <thread> | resume <thread> | update <thread>'
---

# Knowledge Islands portable checkpoints

This governance skill owns the portable checkpoint contract: one concise repository record lets a fresh agent reconstruct an active human-named thread without claiming access to the original conversation. Read [the checkpoint standard](references/standards-checkpoints.md) before reading, creating, updating, or removing a record; [the generated rubric](references/rubric.md) publishes its mechanical and judgment criteria, and [the sources](references/sources.md) record the contract's provenance.

## Shared model

- **Active record** — one regular Markdown file at `+/_CHECKPOINTS/<thread>.md`, where `<thread>` is the user-selected portable name. Updating replaces this snapshot in place; Git supplies history.
- **Removal** — explicit removal deletes the active record after durable information has reached its proper owners. There is no retired-record state or `_RETIRED` directory; Git supplies recovery history.
- **Reconstruction, not continuity** — a checkpoint carries only enough state for a fresh agent to continue. It is never a transcript, vendor-session identifier, conversation locator, completion signal, roadmap, decision log, or memory system.
- **Explicit write authority** — create or update only at the user's request or a documented repository-local trigger. Remove only on explicit user direction after durable facts have reached their canonical owners. When the selected thread or content is uncertain, do not write.

`ki-checkpoint` remains the portable reconstruction record; `ki-recap` is the user-facing judgment-led session summary. A runtime-specific Stop reminder cannot invoke recap or its transcript-grounding helper: it may only address an already-selected valid checkpoint under `ki-checkpoint`'s separate opt-in contract. It cannot invent, select, update, or remove a record, fabricate recap prose, or infer a summary from vendor-session material.

## Operating modes

The skill carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH** modes and the operational **REMOVE · RESUME · UPDATE** modes. Invoked as `help` / `-h` / `?`, it emits generated HELP and stops. With no recognised mode, it emits the same HELP and, only in an interactive session, offers the mode choice and prompts for any target shown in `argument-hint`.

### Mode AUDIT

Run `ki repo audit --skill ki-checkpoint --repo <repo>`. The structured catalogue treats an absent `_CHECKPOINTS` subarea as not applicable; otherwise it checks the flat active layout, filenames, closed metadata, timestamp chronology, exact heading set, non-empty sections, single-record lifecycle, and mechanically recognisable transcript or session dependencies.

Review the judgment aspects: whether each snapshot is concise and current, the thread name is human-selected rather than runtime-derived, durable facts already live with their proper owners, and the record can reconstruct the work for a fresh agent.

### Mode CONFORM

Run AUDIT first, then `ki repo conform --skill ki-checkpoint --repo <repo> --dry-run`. CONFORM may publish the generated rubric but never creates a checkpoint directory, chooses a thread, edits authored checkpoint content, removes a record, infers completion, or writes a runtime-session identifier.

Correct authored records only through an explicit UPDATE or REMOVE request, then re-run AUDIT.

### Mode EDUCATE

Run `ki repo educate --skill ki-checkpoint --repo <repo>` to render the concern and rubric. Explain the exact record form and lifecycle from [the checkpoint standard](references/standards-checkpoints.md); do not create a declaration, directory, or checkpoint merely to demonstrate it.

### Mode HELP

Explain the active-only layout, manual resume flow, explicit write boundary, removal-and-Git-history lifecycle, and off-ramps to `ki-recap`, roadmap or knowledge owners, and optional runtime adapters, then stop without reading or changing repository state.

### Mode REFRESH

REFRESH writes only in `ki-agentic-harness`. When invoked from an installed copy, stop and name the Harness as the place to run it. Read [the sources](references/sources.md), re-check the portable reconstruction boundary and current runtime capabilities, propose any standard change, then update the source review evidence only after the review occurs.

### Mode REMOVE

REMOVE is an agent procedure, not a current `ki repo` host command. Require explicit user direction for one valid active `<thread>` record. Confirm durable decisions, work status, and knowledge have reached their canonical owners; then delete that exact active record. If it was the final record, the empty `_CHECKPOINTS` directory may also disappear. Stop on uncertainty. Removal does not infer completion; Git remains the recovery history.

### Mode RESUME

RESUME is an agent procedure, not a current `ki repo` host command. Require the user-selected `<thread>`, resolve only `+/_CHECKPOINTS/<thread>.md`, and read it in full. Verify the filename, `thread`, H1, and `state: active` agree before using `Next step` to continue in a fresh context. Never search archived or nested paths, search by vendor identifier, or claim to reopen the original session. If the named active record is absent or invalid, stop and report the exact problem.

### Mode UPDATE

UPDATE is an agent procedure, not a current `ki repo` host command. Require a user-selected `<thread>` plus an explicit request or documented local trigger. Write the exact active record structure from [the checkpoint standard](references/standards-checkpoints.md), preserving `created_at` on an existing record and advancing `updated_at`; replace the snapshot in place rather than appending history. Record only current reconstruction state and references to durable owners. Never manufacture decisions, copy a transcript, add a runtime-session identifier, or create a checkpoint from an unqualified Stop event.

## Verification boundary

The checker is read-only over checkpoint content. A runtime adapter may discover a user-selected active record, but it remains a consumer: it cannot weaken the state, selection, write-authority, or no-session-continuity contract.
