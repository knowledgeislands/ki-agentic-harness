# Agent hand-off — `AHO`

Accepted user-observable behaviour for a portable hand-off from one governed agent work cycle to a fresh agent. Part of the [Specifications corpus](index.md). Provider selection, sandboxing, controllers, lifecycle infrastructure, and remote working style remain owned by Techne.

> **Status:** accepted contract; conformance is declared per requirement.

## User-observable behaviours

### AHO-001 — Complete hand-off inputs

A portable agent hand-off MUST name the physical repository identity, exact human-selected thread, scoped authority, result destination, expected verification, and recoverable work state.

_Conformance:_ conforming

_Verify:_ run the focused checkpoint hand-off fixtures with every required input present and with each input removed in turn.

_Evidence:_ `skills/change-management/ki-recap/scripts/recap-grounding.test.ts` exercises complete and missing-input decisions through `evaluateCheckpointHandoff`.

### AHO-002 — Checkpoint-owned composition

`ki-recap checkpoint <thread>` MUST invoke the existing `ki-checkpoint` update procedure only after the target repository declares a valid checkpoint capability and the user explicitly authorises the exact thread update.

_Conformance:_ conforming

_Verify:_ inspect both skill contracts and run focused fixtures for undeclared, malformed, unauthorised, missing-thread, and ambiguous-thread inputs.

_Evidence:_ the `ki-recap` and `ki-checkpoint` standards retain separate ownership, while `recap-grounding.test.ts` proves the fail-closed preflight.

### AHO-003 — Portable work state

A hand-off MUST carry either the current immutable committed baseline or one complete portable patch whose base is that current immutable baseline when required work is uncommitted.

_Conformance:_ conforming

_Verify:_ run focused fixtures for clean committed state, complete portable patch state, stale baseline, and incomplete patch state.

_Evidence:_ `evaluateCheckpointHandoff` accepts the two recoverable forms and refuses stale or incomplete forms in `recap-grounding.test.ts`.

### AHO-004 — Fail-closed interruption and mismatch

The composition MUST refuse without writing when repository identity differs, the baseline is stale, checkpoint validation fails, the update was interrupted, or any required hand-off input is missing or ambiguous.

_Conformance:_ conforming

_Verify:_ run every negative-path checkpoint hand-off fixture and confirm each returns `kind: refused` and `writes: false`.

_Evidence:_ `recap-grounding.test.ts` covers repository mismatch, stale baseline, invalid capability, interrupted update, missing authority, incomplete work state, and ambiguous identity.

### AHO-005 — Transcript-independent reconstruction

A valid checkpoint hand-off MUST let a fresh agent identify the repository, work state, authority, destination, verification, and next step without access to the originating transcript, runtime session, shared filesystem, or provider snapshot.

_Conformance:_ conforming

_Verify:_ construct and audit a valid checkpoint containing only portable repository evidence and durable-owner references, then evaluate a valid hand-off input with no runtime-session fields.

_Evidence:_ `skills/governance/ki-checkpoint/scripts/rubric/contexts/checkpoints.test.ts` proves the portable checkpoint passes schema and boundary checks, and the recap hand-off fixture succeeds without transcript state.

### AHO-006 — Result evidence return

The receiving agent MUST return results to the named destination with the resulting work-state reference and outcomes of every expected verification gate.

_Conformance:_ conforming

_Verify:_ inspect the ready hand-off projection for a result destination, recoverable work-state reference, and non-empty verification list.

_Evidence:_ the positive `evaluateCheckpointHandoff` fixtures assert the complete hand-off projection consumed by the receiving work cycle.
