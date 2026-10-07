---
id: KI-HARNESS-GOV-156
area: GOV
title: Territory selection contract
kind: deliver
purpose: capability
initiative: knowledge-islands-model
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 3f1b5cf66efc9710251221573f47e0fbbeffd7d5
created_at: 2026-10-07T20:07:41Z
updated_at: 2026-10-07T20:50:07Z
---

# Territory selection contract

## Goal

The shared selection contract uses territory membership and preserves governance enforcement while callers cut over.

## Context

Kris approved the territory-selection design and its clarified choices with "all agreed" on 7 October 2026. The accepted source is [ADR-KI-ARCADIA-002](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Admin/Governance/Decisions/ADR-KI-ARCADIA-002-territory-derived-repository-selection.md); the [owner's decisions](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Admin/Governance/Decisions/references/territory-selection-decisions.md) grant rollout implementation, push, prune and release. No Project is required.

## Boundary

No CLI implementation, other territory edits, live Paperclip changes, new group taxonomy, trade-policy changes or remote environment operations.

## Current state

The shared contract and audit migration are delivered: `ki-repo` specifies `territory_prefix`, the territory handle, directory-name filters and the buffered roots endpoint; configuration layout and roadmap Project-reference enforcement read canonical Arcadia Capital membership; Paperclip admission and report ownership no longer depend on Agora membership. Existing trade-policy changes are separate and must be preserved. This record serves one repository's part of the same rollout; acceptance is not inferred from implementation or publication.

Checkpoint, 2026-10-07: Steps 1-4 are verified with `bun run test` (999 pass), `bunx tsc --noEmit`, in-sync generated rubrics and passing focused `ki-work`, `ki-work-roadmap`, `ki-repo-harness`, `ki-agent-coordination-paperclip` and `ki-skills` audits. Focused `ki-repo` findings in the isolated worktree are environment-only: the unregistered worktree path (`REPO-REG-1`) and runtime activation links (`RUNTIMES-2`), which are identical under the unchanged baseline code.

Step 5 is held until both the `ki` and mgit callers pass. Its staged retirement inventory is the `ki-agora` skill itself and these consumers: `ki-repo` configuration ordering and review wording, `ki-authoring` TOML guidance, the `ki-accept` prune-search scope and `ki-repo-kb-principal` authority descriptions. `ki-next`, `ki-repo-kb` and `ki-trades` carry non-operational mentions only. Retirement preserves all trade semantics and runs as a later isolated unit after the combined pilot.

## Steps

- [x] Specify territory_prefix, directory-name filters and the buffered roots interface.
- [x] Migrate configuration and roadmap enforcement predicates to canonical territorial membership.
- [x] Decouple Paperclip company admission and report ownership from Agora membership.
- [x] Verify audit fixtures and publish affected rubric/catalogue evidence.
- [ ] After both tools pass, retire the Agora capability and current cross-skill consumers.

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

## Discussion

### Authority

The owner explicitly permits push, prune and release for the verified rollout. Only intended paths may be committed. No unrelated record, live company state or remote Techné runtime is within scope.
