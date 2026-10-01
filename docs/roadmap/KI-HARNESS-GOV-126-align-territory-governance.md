---
id: KI-HARNESS-GOV-126
area: GOV
title: Align territory governance
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: b2ed537c36ea1db9bbe7c48e4039e4e8206eb58a
created_at: 2026-10-01T21:40:54Z
updated_at: 2026-10-01T21:54:20Z
---

# KI-HARNESS-GOV-126: Align territory governance

## Goal

Make the reusable principal and KB governance contracts express the agreed territory authority, Known Lands, and receiver-controlled knowledge adoption without introducing a premature machine schema.

## Context

The human approved territory-first reconciliation, Techné knowledge absorption into Arcadia with separate implementation products retained, and a supervised rollout using lower-cost models. Arcadia's existing [Island concepts record](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Streams/Roadmap/KI-ARCADIA-MOD-002-island-concepts.md) owns the conceptual model. Its [reconciliation review](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/+/territory-governance-reconciliation-review.md) identifies conflicts in the shared guidance and local declarations.

## Boundary

Change the principal overlay's authored contract and judgment review, clarify KB identity/provenance and adoption, and make the general authoring reference respect the KB link convention. Preserve the existing mechanical floor, canonical metadata vocabulary, registry schema, Agora schema and trade transport. No private territory inventory, source-store path, runtime change, company transfer, service action, publication or automatic migration belongs here.

The separate [inter-territory exchange intake](KI-HARNESS-GOV-122-design-inter-territory-exchange.md) retains detailed exchange-policy and transport work. This record supplies its agreed conceptual baseline rather than claiming delivery of that larger design.

## Current state

The principal skill is structural-only, checks five readable surfaces and an Enactment anchor, and expressly excludes judging territory identity. The KB contract and general Markdown reference do not state their link-rule precedence consistently. These gaps allow an apparently conformant base to carry a stale or contradictory territory inventory.

## Steps

- [x] Align the principal description, body, and standard around a governed territorial declaration without implying that a skill or audit appoints a principal.
- [x] Add judgment criteria for Charter/Known Lands agreement and internal membership versus external signposting; republish the generated rubric and adjust catalogue tests.
- [x] Clarify inherited island/territory identity, explicit item provenance and exceptions, and receiver-owned adoption in the KB standard.
- [x] Clarify the general Markdown link rule's scope and point territorial knowledge placement to its owning governance.
- [x] Verify the integrated contract and record a complete review packet.

## Files touched

- `skills/repo-structure/ki-repo-kb-principal/SKILL.md`
- `skills/repo-structure/ki-repo-kb-principal/references/standards-principal.md`
- `skills/repo-structure/ki-repo-kb-principal/references/rubric.md` through its generator
- `skills/repo-structure/ki-repo-kb-principal/scripts/rubric/items/` and relevant existing tests
- `skills/repo-structure/ki-repo-kb/references/standards-knowledge-base.md`
- `skills/governance/ki-authoring/references/standards-markdown.md`
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`
- `skills/README.md` through the capability publication generator
- This work record

## Verify

Run relevant rubric tests, regenerate and verify the principal rubric, then run `bun run test`, `bunx tsc --noEmit`, and focused `ki repo audit --skill ki-skills` sequentially. Audit the changed principal contract against Arcadia, distinguishing mechanical evidence from judgment review. Lint touched Markdown and review that no private identities or local paths entered the portable skill. Catalogue drift in unrelated skills is recorded separately rather than silently repaired.

## Dependencies / blocks

The human-approved principles and Arcadia's shaped concept record provide the source decision. The source and reusable contract can be reviewed together; no local build dependency is missing. Every territory retains authority to apply the contract to its own knowledge and declarations.

## Documentation impact

### Decision Records

Arcadia owns the existing territorial and ecosystem decisions. This delivery projects the human-approved principles into reusable guidance rather than creating a competing harness decision.

### Specifications

The principal and KB standards change; no runtime schema or executable exchange contract changes.

### Guides

Keep skill descriptions, bodies, the general link convention, and the generated rubric consistent with the authored standards.

### Roadmap

This record carries delivery evidence. The existing exchange intake retains transport work, and territory-local rollout remains receiver-owned.

## Delegation

### Locked decisions

- One territorial Capital; governed internal Known Lands inventory and external signposting are distinct.
- Registry location, Agora inclusion, company binding and a passing audit do not appoint a principal or grant exchange rights.
- Public knowledge consumption may be declared by its receiver without a public consumer list.
- Existing note-kind and lifecycle vocabularies remain; no new TOML fields or automatic synchronisation.

### Escalate

- A mechanical schema or generic host change becomes necessary.
- A contract would require private identity publication, overwrite local authority, or change trade execution.
- A regression or source conflict falls outside the exact file boundary.

### Worker: shared-contract

- **Deliverable:** A consistent, tested reusable territory-governance contract.
- **Inputs:** This record, the Arcadia concept plan and review, relevant skills and their authoring/rubric guidance.
- **Scope:** The exact skill files and relevant catalogue tests listed above; this work record remains coordinator-owned.
- **Authority:** Edit, generate the owned rubric, and run focused verification. No commits, roadmap writes, external calls, publication, or runtime mutations.
- **Isolation:** Exclusive non-overlapping file ownership in the primary checkout. Coordinator serialises Git integration.
- **Verify:** Focused tests and audits, followed by coordinator semantic review and required repository gates.
- **Return:** Touched paths, changes in behaviour or judgment scope, verification evidence and unresolved findings.
- **Checkpoint:** Stop with a reviewable uncommitted patch.

## Review

### Delivered

The approved reusable territory contract is delivered from baseline `b2ed537c36ea1db9bbe7c48e4039e4e8206eb58a`. Principal governance now reviews owner-authored jurisdiction and relationships without appointing a Capital. No runtime, registry, Agora or trade schema changed.

### Change Summary

The principal skill, standard and generated rubric contain two new judgment criteria; the mechanical floor is unchanged. The KB standard covers inherited identity, provenance and receiver-controlled adoption. General Markdown guidance defers internal KB linking to the KB contract.

Integration required two mechanical publication adjustments: the inventory test's totals now include the two added judgment criteria, and the supported harness generator republished the changed description. Its exact catalogue replacement also synchronised one pre-existing Paperclip description mismatch from already-committed source. No Paperclip capability semantics changed.

### Verification

- `bun run test`: 851 tests passed, zero failed. The first run exposed the expected aggregate-count update; the complete rerun passed after that assertion was corrected.
- `bunx tsc --noEmit`: passed.
- Focused principal catalogue tests, generated-rubric parity and touched formatting: passed.
- `ki repo audit --skill ki-skills`: zero failures, two existing refresh-cadence warnings.
- `ki repo conform --skill ki-repo-harness` and subsequent audit: generated catalogue exact; no failures, the same two refresh warnings.
- Arcadia `ki-repo-kb-principal`: all six composed skills passed.
- `git diff --check`: passed. Coordinator semantic review confirmed public/private boundaries, retained mechanical checks, and no new parser or metadata obligations.

### Outstanding concerns

Two unrelated source refreshes are overdue. This delivery does not refresh external sources or claim the entire fleet is conformant. Each Capital's declarations and the detailed exchange design retain their own delivery and acceptance.

### Post-change review

The change corrects the governance/structure ambiguity without inferring authority from a successful audit. Judgment criteria explicitly require owner evidence, and source/location separation is consistent with the reviewed Arcadia model. The description's generated publication and aggregate test counts are integrated. Ready for human review, not self-accepted.

### Mini recap

Reusable governance, publication and tests agree. Territorial rollout can apply this baseline; detailed exchange policy and transport remain with the existing exchange intake. No push or runtime activation occurred.

## Discussion

### Deliberate verification limit

Mechanical presence and link checks remain useful but cannot establish jurisdiction. The added judgment evidence must compare authored authority and relationships. A future machine-readable territorial contract can follow experience with this declared model; adding parser fields during this repair would conflate governance with local discovery.
