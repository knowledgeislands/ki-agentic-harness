---
id: KI-HARNESS-GOV-156
area: GOV
title: Territory selection contract
kind: deliver
purpose: capability
initiative: knowledge-islands-model
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 3f1b5cf66efc9710251221573f47e0fbbeffd7d5
created_at: 2026-10-07T20:07:41Z
updated_at: 2026-10-07T21:47:05Z
---

# Territory selection contract

## Goal

The shared selection contract uses territory membership and preserves governance enforcement while callers cut over.

## Context

Kris approved the territory-selection design and its clarified choices with "all agreed" on 7 October 2026. The accepted source is [ADR-KI-ARCADIA-002](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Admin/Governance/Decisions/ADR-KI-ARCADIA-002-territory-derived-repository-selection.md); the [owner's decisions](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Streams/Initiatives/knowledge-islands-model/design/territory-selection-decisions.md) grant rollout implementation, push, prune and release. No Project is required.

## Boundary

No CLI implementation, other territory edits, live Paperclip changes, new group taxonomy, trade-policy changes or remote environment operations.

## Current state

The shared selection contract and current consumers now derive repository scope from the Capital's ordered territory membership. The Agora capability is removed, its live consumers and generated publications are reconciled, and both committed caller pilots retain their verified behaviour. The published Streams design-artifact classification and widened delegation behaviour are integrated without rewriting foreign history. This record awaits human review; integration and publication remain with the coordinator.

## Steps

- [x] Specify territory_prefix, directory-name filters and the buffered roots interface.
- [x] Migrate configuration and roadmap enforcement predicates to canonical territorial membership.
- [x] Decouple Paperclip company admission and report ownership from Agora membership.
- [x] Verify audit fixtures and publish affected rubric/catalogue evidence.
- [x] After both tools pass, retire the Agora capability and current cross-skill consumers.

## Files touched

The bounded harness standards, rubric contexts and fixtures, generated publications, capability catalogue and this record.

## Verify

bun run test; bunx tsc --noEmit; focused ki-repo, ki-work-roadmap, ki-repo-harness, ki-agent-coordination-paperclip and ki-skills audits; generated rubric verification. Record unrelated pre-existing fleet findings separately.

## Dependencies / blocks

The delivery order is shared contract, KI resolver pilot, mgit caller pilot, then Arcadia reconciliation and retirement. Each owning repository delivers its own code. Consumer retirement waits for the verified caller without treating review status as a build dependency.

## Delegation

### Locked decisions

- The accepted Arcadia decision fixes short territory handles, directory-name prefix filtering, default scopes, strict failure boundaries and the hard cut-over.
- Preserve the current fail/warn enforcement population; no Agora-based fallback or new shared package.
- Paperclip retains KIS and gains no live-state edits.

### Escalate

- A consumer cannot be migrated within the named harness files, or a proposed change would alter acceptance, jurisdiction or trade authority.
- The new selector interface conflicts with a verified current implementation or any required gate fails.

### Worker: shared-contract

- **Deliverable:** Shared selection contract and territorial audit predicates, with verified fixtures and a staged retirement inventory.
- **Inputs:** The accepted Arcadia decision, design brief, reviews, report and owner decisions; current harness standards and rubrics.
- **Scope:** Harness ki-repo, ki-work, ki-work-roadmap, ki-repo-harness, ki-agent-coordination-paperclip and ki-agora source and generated publications, tests, references, catalogue; this record. No other repository writes.
- **Authority:** Implement the approved local contract and audit migration. Do not push, release, prune, accept or delete the Agora skill until the coordinator verifies both callers. Commit only after coordinator authorises the shared Git write window.
- **Isolation:** Exclusive non-overlapping harness file boundary in the primary checkout; preserve all foreign changes and use explicit paths.
- **Verify:** bun run test, bunx tsc --noEmit, relevant focused native audits and unchanged fail/warn fixture evidence.
- **Return:** Touched paths, concise outcome, verification evidence and unresolved consumers or gates.
- **Checkpoint:** Return when the contract and predicate migration are verified; hold skill retirement until both tools pass.

## Documentation impact

### Decision Records

Cite the accepted Arcadia decision; preserve its owner-approved meaning.

### Specifications

Update the repository-owned shared or executable selector contract and remove current Agora semantics after consumer verification.

### Guides

Explain the new flags, literal-prefix filtering, failure boundaries and hard cut-over.

### Roadmap

Use this single bounded record for this repository; create no speculative follow-on queue.

## Review

### Delivered

Completed the approved territory-selection boundary from immutable delivery baseline `2a249ac41c473424b001188bdb37c6f70d1d3b3d`. Preserved the record's original `baseline_ref` and created no new Project, work record, trade policy or acceptance. Local commits deliver the verified result for coordinator integration.

### Change Summary

Retired `skills/governance/ki-agora/`; migrated ki-repo ordering, ki-authoring TOML guidance, ki-accept prune search scope, principal authority wording and current cross-skill references. Reconciled publications and the inventory fixture with the published prerequisite. The contract commit is retained through a recorded task-only rebase; original baseline metadata is unchanged.

### Verification

Harness tests, TypeScript, generated rubric checks, focused ki-repo, ki-authoring, ki-work-roadmap, ki-work, ki-skills, ki-repo-harness and Paperclip audits, and native whole audit pass. ki-accept is verified through its supported acceptance/prune fixtures; principal is audited against declared Arcadia scope. Unchanged committed KI/mgit caller evidence is reused because integration preserves selection semantics.

### Outstanding concerns

No required gate remains failing. Existing whole-audit warnings are recorded separately and remain outside this unit. Coordinator integration, final publication and Kris's human acceptance remain outstanding.

### Post-change review

The goal and hard cut-over are satisfied within the approved paths. Repository selection grants no jurisdiction or cross-repository write authority. Frozen provenance, caller defaults, trade semantics and KIS are preserved. This delivery is ready for human review, not accepted.

### Mini recap

Delivered the bounded retirement with passing source, publication and repository evidence. Retained immutable baselines and caller evidence for integration. No new durable guidance or speculative follow-up is proposed.

## Discussion

### Authority

The owner explicitly permits push, prune and release for the verified rollout. Only intended paths may be committed. No unrelated record, live company state or remote Techné runtime is within scope.
