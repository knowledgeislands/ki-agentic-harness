---
id: KI-HARNESS-RTP-012
area: RTP
title: Portable agent hand-off
theme: runtime-portability
horizon: next
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 8073d4f52de716eb47de9a05442ec328c2893321
created_at: 2026-09-07T23:33:50Z
updated_at: 2026-09-15T13:35:30Z
---

# Define portable agent hand-off

## Goal

Define the portable, evidence-backed hand-off that lets a fresh agent reconstruct and continue one governed repository task without depending on a vendor session, shared filesystem, or provider snapshot.

## Context

[ADR-TECHNE-001](../../../ki-techne-principal/Admin/Governance/Decisions/ADR-TECHNE-001-provider-neutral-isolated-agent-execution.md) and Techne's enacted engineering notes own the provider-neutral execution architecture. [TECHNE-GOV-005](../../../ki-techne-principal/Streams/Roadmap/TECHNE-GOV-005-define-isolated-agent-execution.md) owns controllers, task environments, sandbox substrates, bootstrap profiles, lifecycle operations, provider evidence, and the proving sequence. [TECHNE-OPS-002](../../../ki-techne-principal/Streams/Roadmap/TECHNE-OPS-002-define-remote-agent-working-style.md) owns persistent supervised working practices and later hands-on evidence.

The Harness owns reusable agent capabilities and their portable contracts. `ki-recap` produces a grounded session summary and carry-forward digest, while `ki-checkpoint` owns concise repository reconstruction state for one human-named active thread. They are deliberately separate, but no explicit composition currently turns the grounded recap into a valid checkpoint before a fresh local or remote agent starts.

The user approved retaining only this Harness projection. The wider substrate, working-style, provider-selection, and proof concerns remain in Techne.

## Boundary

Do not define or select a controller, sandbox substrate, bootstrap implementation, provider, orchestration cockpit, remote working style, lifecycle API, or infrastructure tool. Do not provision infrastructure, incur spend, contact external systems, move secrets into repository state, or make a vendor session or snapshot authoritative. Do not give `ki-recap` ownership of checkpoint identity, schema, update, resume, or removal.

## Current state

The accepted composition adds `ki-recap checkpoint <thread>` as an optional, explicit user-authorised bridge. It is available only when the target repository declares a valid `ki-checkpoint` capability and the user supplies the exact human-selected thread. It invokes the existing checkpoint update procedure using grounded recap evidence and refuses before writing when authority, repository identity, baseline, work-state completeness, or checkpoint validity is missing or ambiguous.

A hand-off must carry an immutable committed baseline or a complete portable patch containing every required uncommitted change. It also carries the repository identity, exact thread, scoped authority, result destination, checkpoint, and expected verification. A vendor transcript, runtime session, shared working tree, or provider snapshot may assist execution but cannot be the only recoverable source.

## Steps

- [x] Register `docs/specs/agent-handoff.md` with prefix `AHO` and accepted requirements for hand-off inputs, validation, refusal, reconstruction, and result evidence.
- [x] Define the optional `ki-recap checkpoint <thread>` composition while keeping `ki-checkpoint` the sole owner of checkpoint identity, schema, update, resume, and removal.
- [x] Require a declared, valid checkpoint capability, exact human-selected thread, current repository identity, explicit user authority, and complete committed or portable-patch work state before any write.
- [x] Define portable outputs: the updated checkpoint, immutable baseline or complete patch reference, scoped authority, verification expectation, result destination, and explicit refusal evidence.
- [x] Add focused fixtures for valid recap-to-checkpoint hand-off, undeclared or malformed checkpoint capability, missing or ambiguous thread identity, stale baseline, incomplete uncommitted state, absent authority, repository mismatch, interrupted update, and fresh-agent reconstruction without transcript access.
- [x] Update the skills-by-outcome guide and generated capability publication only where the new composition changes their current surface.
- [x] Run focused and aggregate verification and record the six-heading review packet.

## Files touched

- `docs/specs/index.md` and `docs/specs/agent-handoff.md`
- `skills/change-management/ki-recap/SKILL.md`
- `skills/change-management/ki-recap/references/standards-session-recap.md`
- `skills/change-management/ki-recap/scripts/internal/checkpoint-handoff.ts`
- `skills/change-management/ki-recap/scripts/checkpoint-handoff.test.ts`
- `skills/governance/ki-checkpoint/SKILL.md`
- `skills/governance/ki-checkpoint/references/standards-checkpoints.md`
- `skills/governance/ki-checkpoint/scripts/rubric/contexts/checkpoint-handoff.test.ts`
- `docs/guides/skills-by-outcome.md` and generated `skills/README.md` only when mechanically affected
- This roadmap record

## Verify

- `bun test skills/change-management/ki-recap/scripts/recap-grounding.test.ts`
- `bun test skills/governance/ki-checkpoint/scripts/rubric/contexts/checkpoints.test.ts`
- `ki repo audit --skill ki-specs --repo .`
- `ki repo audit --skill ki-checkpoint --repo .`
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `bun run test`
- `bunx tsc --noEmit`
- `git diff --check`

## Dependencies / blocks

No build dependency blocks delivery. The accepted Techne architecture is already current, and later Techne provider or supervised-session proofs may refine implementation guidance without changing this hand-off contract. Provider-specific proofs no longer depend on this item and remain outside the Harness roadmap.

## Delegation

Keep the specification and cross-skill ownership changes in one coordinator-owned lane. Focused test additions may be delegated by disjoint skill root after the specification terms are fixed, but the coordinator retains the shared specification index, generated publications, aggregate verification, and review packet.

## Documentation impact

### Decision Records

No new Decision Record is planned. This item projects current `ADR-TECHNE-001` into the Harness without changing its architecture or the existing recap and checkpoint ownership decisions.

### Specifications

Add `docs/specs/agent-handoff.md` with prefix `AHO` for the accepted portable behaviour and refusal boundary.

### Guides

Update the outcome guide so a user can deliberately convert a grounded recap into one repository checkpoint before a fresh-agent hand-off.

### Roadmap

Keep substrate architecture, remote working practices, technology comparison, and provider proofs in Techne. Any tools-ki adapter implementation requires separately adopted work in that repository after the portable contract is accepted.

## Review

### Delivered

From immutable baseline `8073d4f52de716eb47de9a05442ec328c2893321`, delivered the Harness-owned portable hand-off contract while leaving provider architecture, controller, substrate, lifecycle, provider evaluation, and remote working-style proof in Techne. The implementation adds the explicit `ki-recap checkpoint <thread>` composition, a fail-closed no-write preflight model, accepted `AHO` requirements, focused fixtures, and the updated user-facing capability routes.

### Summary of changes

Added `docs/specs/agent-handoff.md` and registered prefix `AHO`; extended `ki-recap` and `ki-checkpoint` without merging their ownership; added the pure `checkpoint-handoff.ts` decision model and focused recap and checkpoint fixtures; updated the skills-by-outcome guide; and regenerated the marker-bounded capability catalogue because `ki-recap`'s argument hint changed. The focused fixtures live in dedicated test files rather than expanding the two existing broad suites named in the draft plan, preserving the same evidence boundary with clearer test ownership.

### Verification

- `bun test skills/change-management/ki-recap/scripts/checkpoint-handoff.test.ts` — PASS, 4 tests and 13 assertions.
- `bun test skills/governance/ki-checkpoint/scripts/rubric/contexts/checkpoint-handoff.test.ts` — PASS, 1 test and 2 assertions.
- `ki repo audit --skill ki-specs --repo .` — PASS.
- `ki repo audit --skill ki-checkpoint --repo .` — PASS.
- `ki repo audit --skill ki-skills --repo .` — PASS.
- `ki repo audit --skill ki-repo-harness --repo .` — PASS, including exact generated capability publication.
- `ki repo audit --skill ki-work-roadmap --repo .` — PASS.
- `ki repo audit --skill ki-authoring --repo .` — PASS.
- `bunx tsc --noEmit && bun run test && bunx biome check` — PASS across the complete Harness suite and source tree.
- `git diff --check` — PASS.

### Outstanding concerns

None in the approved Harness boundary. A future native host or remote execution adapter may automate this procedure only through separately adopted work in its owning repository; this record does not authorise such an implementation.

### Post-change review

The delivered contract meets the narrowed goal: a fresh agent can receive one recoverable repository work state, exact authority and destination, and expected verification without relying on a transcript or shared filesystem. Negative paths refuse without writes, `ki-checkpoint` retains all record authority, and the Techne records already cover the excluded substrate and working-style concerns. Regression risk is limited to instruction routing and the pure decision projection, covered by focused fixtures, full tests, TypeScript, Biome, and the relevant governance audits. The item is ready for human acceptance.

### Mini recap

Delivered the portable Harness projection of remote-agent hand-off and verified it at specification, skill, fixture, catalogue, and repository levels. The material learning is the ownership split itself: Techne owns execution environments and operating proofs; Harness owns only reusable portable evidence contracts. That split is now explicit in the work record and accepted specification, so no new follow-on roadmap item is needed here.

## Discussion

### Ownership split

Techne answers which execution model, working mode, substrate, profile, controller, and provider proof are appropriate. The Harness answers what portable repository evidence a reusable agent capability must produce and consume. tools-ki may later implement adapters against that contract without becoming its normative owner.

### Composition boundary

`ki-recap checkpoint <thread>` is convenience composition, not a merged capability. `ki-recap` supplies grounded source evidence and explicit invocation; `ki-checkpoint` validates and writes the canonical checkpoint. Either skill remains independently usable, and the bridge fails closed rather than manufacturing missing state.

### Portable work state

A commit is the preferred immutable hand-off. When required changes are uncommitted, one complete portable patch may carry them with the checkpoint. Partial diffs, implicit filesystem state, transcripts, and provider snapshots are insufficient because a fresh agent cannot prove it has reconstructed the full task state.
