---
id: KI-HARNESS-RTP-012
area: RTP
title: Define remote agent substrate
theme: runtime-portability
horizon: next
status: draft
blocks: [KI-HARNESS-RTP-010]
blocked_by: []
baseline_ref: null
created_at: 2026-09-07T23:33:50Z
updated_at: 2026-09-15T12:33:43Z
---

# Define Remote Agent Substrate

## Goal

Define a portable execution contract in which autonomous agents can run independently with small, reproducible footprints and return evidence-backed repository changes.

## Context

Same-filesystem worktrees are useful local isolation but need not be the portable coordination model. A deployed agent should own an independent filesystem and fresh repository clone while the selected change manager, Git remote, and review boundary coordinate work. Local installation, credentials, capability projection, recovery, and result integration therefore need explicit executable contracts.

`ADR-TECHNE-001` and the enacted canonical Techne notes are the normative upstream contract for the isolated-agent-execution principle, working-mode taxonomy, layer model, and cross-repository responsibility boundary. `TECHNE-GOV-005` retains the delivery provenance and technology landscape, while `TECHNE-OPS-002` owns a later, non-blocking hands-on proof of persistent supervised sessions. This item projects the accepted architecture into reusable sandbox capability semantics and conformance tests without waiting for that operational proof. `DOTFILES-UE-020` retains the residual implementation of Cheztoi as one personal bootstrap profile.

## Boundary

Do not redefine the Techne engineering model or remote-agent working style, become the authoritative provider-comparison record, select a provider, provision infrastructure, incur spend, move secrets into repository or dotfiles state, or imply that an agent runtime, orchestration cockpit, and execution sandbox are the same layer.

## Current state

`ki-recap` produces a user-facing session summary and carry-forward digest, while `ki-checkpoint` owns concise repository reconstruction state for a human-named active thread. They are deliberately separate, but no explicit operation currently turns a recap into a portable checkpoint before compaction or a fresh local or cloud agent starts.

This record already identifies the broader remote substrate topology and provider-neutral lifecycle. It does not yet bind an immutable repository baseline, a named `ki-checkpoint`, scoped authority, bootstrap requirements, result transport, and verification evidence into one executable handoff contract. A vendor thread, transcript, provider snapshot, or uncommitted working tree therefore remains an accidental continuity dependency.

The proposed `ki-recap checkpoint <thread>` composition is the sole remaining readiness decision. It would be an optional, explicit user-authorised operation: it is available only when the target repository declares a valid `ki-checkpoint` capability and the user supplies the exact human-selected thread, and it refuses before writing when either condition or the portable work-state boundary is not satisfied.

### Existing contract direction

Specify the minimum topology received from Techne as executable capabilities: authoritative change record, persistent agent controller, isolated task environment, fresh checkout and branch, pinned bootstrap profile, runtime-injected credentials, health check, bounded network policy, commit and push boundary, review evidence, cleanup, and recovery. Treat a worktree as one same-host checkout adapter and an independent clone as the remote equivalent.

Define a small provider-neutral lifecycle covering create, inspect, execute, transfer, checkpoint, suspend, resume, destroy, and evidence collection. Express required capabilities and policy independently from provider configuration so an adapter may use containers, hardened containers, or microVMs without changing the task contract.

Use the open artifact boundaries selected by Techne: Dev Container configuration for the development environment, OCI images for distribution, Git references for source and results, and ordinary manifests and logs for evidence. Provider snapshots may accelerate startup but must never be the only authoritative copy of state.

Require a conformance proof that the same bootstrap profile can create a fresh clone, pass its health check, execute a bounded task, emit review evidence, and clean up on at least two materially independent adapters. The first proof may be local; the second should detect hidden vendor assumptions before provider selection.

## Steps

- [ ] Register `docs/specs/runtime-portability.md` with prefix `RTP`, then add accepted requirements for execution inputs, lifecycle states, evidence, recovery, and result artifacts.
- [ ] After explicit approval of the public composition, define `ki-recap checkpoint <thread>` as an optional bridge that creates or updates one valid active `ki-checkpoint` from the grounded recap and then applies the existing compaction safety boundary.
- [ ] Keep `ki-checkpoint` the sole owner of checkpoint identity, schema, update, resume, and removal; require its repository declaration and valid scaffold, the exact human-selected thread, and explicit user authority before `ki-recap` invokes its update procedure.
- [ ] Require cloud handoffs to carry a repository identity, immutable baseline or complete portable patch containing all required work state and the checkpoint, scoped authority, bootstrap profile, credential and network boundaries, result destination, and cleanup responsibility; refuse an uncommitted-only handoff when no complete portable patch exists.
- [ ] Define adapter results for commits or patches, the updated checkpoint, verification and review evidence, recovery state, and explicit refusal; keep vendor sessions and snapshots optional and non-authoritative.
- [ ] Add focused coverage in the existing recap grounding and checkpoint rubric-context tests for a valid recap-to-checkpoint handoff, undeclared or malformed checkpoint capability, missing or ambiguous thread identity, uncommitted-only state without a complete patch, stale baselines, absent authority, unsafe credentials, interrupted transfer, and fresh-agent resume without transcript access.
- [ ] Update the capability catalogue and outcome guide, then leave provider-specific proof to the dependent adapter records.

## Files touched

- `docs/specs/index.md` and `docs/specs/runtime-portability.md`
- `skills/change-management/ki-recap/SKILL.md`, `skills/change-management/ki-recap/references/standards-session-recap.md`, and `skills/change-management/ki-recap/scripts/recap-grounding.test.ts`
- `skills/governance/ki-checkpoint/SKILL.md`, `skills/governance/ki-checkpoint/references/standards-checkpoints.md`, and `skills/governance/ki-checkpoint/scripts/rubric/contexts/checkpoints.test.ts`
- `docs/guides/skills-by-outcome.md` and generated `skills/README.md`
- this roadmap record

## Verify

- `ki repo audit --skill ki-specs --repo .`
- `ki repo audit --skill ki-checkpoint --repo .`
- `ki repo audit --skill ki-skills --repo .`
- `bun test skills/change-management/ki-recap/scripts/recap-grounding.test.ts`
- `bun test skills/governance/ki-checkpoint/scripts/rubric/contexts/checkpoints.test.ts`
- `bun run test`
- `bunx tsc --noEmit`
- `ki repo audit --skill ki-work-roadmap --repo .`

## Dependencies / blocks

The contract consumes the current `ADR-TECHNE-001` responsibility and working-mode model. `TECHNE-GOV-005` remains its delivery provenance, while results from `TECHNE-OPS-002` may refine later supervised-session guidance but are not a build-order dependency. This record blocks `KI-HARNESS-RTP-010`; provider-specific proof remains downstream and is not required to define the provider-neutral handoff. The only remaining readiness gate is explicit approval of the public `ki-recap checkpoint <thread>` composition and its optional fail-closed dependency on `ki-checkpoint`. No vendor account, remote mutation, push, spend, or secret migration is authorised by this plan.

## Documentation impact

### Decision Records

No new Decision Record is planned because this work projects current `ADR-TECHNE-001` into Harness. Return to Techne for a new decision only if implementation would change that accepted responsibility boundary.

### Specifications

Register `docs/specs/runtime-portability.md` with prefix `RTP` and its accepted behavioural requirements.

### Guides

Update the outcome guide so active work routes through recap-backed portable checkpoints before a local or cloud handoff.

### Roadmap

Record provider-specific proof only in dependent adapter items such as `KI-HARNESS-RTP-010`; do not expand this record into provider selection or provisioning.

## Discussion

### Upstream engineering model

`ADR-TECHNE-001` and the enacted canonical Techne notes own the durable provider-neutral model. `TECHNE-GOV-005` retains the comparison of Agent Sandbox, Docker Sandboxes, Cheztoi, Dev Container, OCI, and provider candidates and the recommended proving sequence. This item should reference that analysis rather than duplicate it. Changes in provider evidence should return to Techne when they affect the engineering model and remain local here when they affect only the executable contract or adapter conformance.

### Public composition approval

Approve or reject one public composition before this item becomes Ready: `ki-recap checkpoint <thread>` may optionally invoke the existing `ki-checkpoint` update procedure only for an explicitly selected thread in a repository with a declared, valid checkpoint capability. Approval adds no checkpoint schema ownership to `ki-recap`; rejection keeps recap and checkpoint as two explicitly sequenced user operations and requires the handoff specification to describe that sequence instead.

### Bootstrap profile

Accept the portable agent subset defined by Techne: pinned KI CLI and harness, agent runtimes, Git and shell prerequisites, XDG configuration shape, repository bootstrap, state classes, and readiness diagnostics. Keep personal workstation preferences and secrets outside the profile.

The harness owns the profile capability schema and conformance tests; dotfiles owns the Cheztoi instance and source-to-artifact projection. A provider-neutral implementation may begin in `tools-ki`, while a dedicated tool or repository should wait until more than one adapter proves the abstraction.

### Contract projection

Project the accepted Techne responsibility model into explicit contract inputs and observable conformance evidence. The contract should identify the controller, task environment, repository baseline, scoped authority, credential injection boundary, network policy, result destination, and cleanup responsibility without deciding the operating model locally.

Require adapters to report state classification, checkpoint and recovery behaviour, credential retention, and authoritative result artifacts. Git commits, patches, canonical work records, manifests, and review evidence remain the portable recovery and hand-off boundary; provider snapshots remain disposable optimisations.

### Coordination and conflict

Expose the accepted Techne coordination model through identifiers and evidence needed by implementations: claim or lease reference, immutable input baseline, concurrency token, branch or result reference, heartbeat or last-update evidence, and abandonment outcome. The Harness should test that these values survive adapter boundaries rather than define the human working policy that gives them meaning.

### Evaluation route

Implement the proving sequence and evaluation criteria governed by `TECHNE-GOV-005`, including provider proofs already represented by `KI-HARNESS-RTP-010`. Accept later remote-session and personal-server continuity conclusions from `TECHNE-OPS-002` as non-blocking evidence for refinement; do not recreate its Zed, Herdr, or Mosh evaluation in the Harness.
