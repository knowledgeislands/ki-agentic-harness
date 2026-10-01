---
id: KI-HARNESS-GOV-126
area: GOV
title: Align territory governance
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-01T21:40:54Z
updated_at: 2026-10-01T21:40:54Z
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

- [ ] Align the principal description, body, and standard around a governed territorial declaration without implying that a skill or audit appoints a principal.
- [ ] Add judgment criteria for Charter/Known Lands agreement and internal membership versus external signposting; republish the generated rubric and adjust catalogue tests.
- [ ] Clarify inherited island/territory identity, explicit item provenance and exceptions, and receiver-owned adoption in the KB standard.
- [ ] Clarify the general Markdown link rule's scope and point territorial knowledge placement to its owning governance.
- [ ] Verify the integrated contract and record a complete review packet.

## Files touched

- `skills/repo-structure/ki-repo-kb-principal/SKILL.md`
- `skills/repo-structure/ki-repo-kb-principal/references/standards-principal.md`
- `skills/repo-structure/ki-repo-kb-principal/references/rubric.md` through its generator
- `skills/repo-structure/ki-repo-kb-principal/scripts/rubric/items/` and relevant existing tests
- `skills/repo-structure/ki-repo-kb/references/standards-knowledge-base.md`
- `skills/governance/ki-authoring/references/standards-markdown.md`
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

## Discussion

### Deliberate verification limit

Mechanical presence and link checks remain useful but cannot establish jurisdiction. The added judgment evidence must compare authored authority and relationships. A future machine-readable territorial contract can follow experience with this declared model; adding parser fields during this repair would conflate governance with local discovery.
