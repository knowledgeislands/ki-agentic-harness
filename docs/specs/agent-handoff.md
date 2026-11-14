# Agent hand-off — `AHO`

Accepted user-observable behaviour for a portable hand-off from one governed agent work cycle to a fresh agent. Part of the [Specifications corpus](index.md). Provider selection, sandboxing, controllers, lifecycle infrastructure, and remote working style remain owned by Techne.

> **Status:** accepted contract; conformance is declared per requirement.

## User-observable behaviours

### AHO-001 — ~~Complete hand-off inputs~~ (deprecated)

Retired with the `ki-recap checkpoint` composition and its hand-off preflight, which Kris removed under RECAP-NARROW a) on 7 November 2026. `ki-work-package` owns every package write, and its update and resume procedures carry the hand-off.

### AHO-002 — ~~Checkpoint-owned composition~~ (deprecated)

Retired with the `ki-recap checkpoint` composition and its hand-off preflight, which Kris removed under RECAP-NARROW a) on 7 November 2026. `ki-work-package` owns every package write, and its update and resume procedures carry the hand-off.

### AHO-003 — ~~Portable work state~~ (deprecated)

Retired with the `ki-recap checkpoint` composition and its hand-off preflight, which Kris removed under RECAP-NARROW a) on 7 November 2026. `ki-work-package` owns every package write, and its update and resume procedures carry the hand-off.

### AHO-004 — ~~Fail-closed interruption and mismatch~~ (deprecated)

Retired with the `ki-recap checkpoint` composition and its hand-off preflight, which Kris removed under RECAP-NARROW a) on 7 November 2026. `ki-work-package` owns every package write, and its update and resume procedures carry the hand-off.

### AHO-005 — Transcript-independent reconstruction

A valid work package MUST let a fresh agent identify the repository, work state, authority, destination, verification, and next step without access to the originating transcript, runtime session, shared filesystem, or provider snapshot.

_Conformance:_ conforming

_Verify:_ construct and audit a valid package containing only portable repository evidence and durable-owner references, with no runtime-session fields.

_Evidence:_ `skills/work/ki-work-package/scripts/rubric/contexts/checkpoint-handoff.test.ts` proves the portable record passes schema and boundary checks without transcript or runtime state.

### AHO-006 — ~~Result evidence return~~ (deprecated)

Retired with the `ki-recap checkpoint` composition and its hand-off preflight, which Kris removed under RECAP-NARROW a) on 7 November 2026. `ki-work-package` owns every package write, and its update and resume procedures carry the hand-off.
