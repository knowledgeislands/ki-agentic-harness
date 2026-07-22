---
id: 'FND-004'
title: Codify repository working areas
status: done
roadmap: foundation-tooling/codify-repository-working-areas
blocks: FND-003
blocked-by: —
---

## Context

Knowledge Bases use top-level `+` and `-` spaces to make incoming and outgoing working material visible before it reaches its durable destination.

Knowledge Islands repositories need the same legible staging model: incoming material is triaged locally, and outgoing material can carry an implementation-ready handoff without pretending to control the receiving repository's roadmap or plan.

`ki-repo` is the natural owner because this is a repository-shape and repository-working-practice convention rather than a feature of one implementation or one Knowledge Base.

## Current state

This harness has top-level `+/` and `-/` working areas, with explicit `+/_HANDOFFS/` and `-/_HANDOFFS/` subareas. Its existing CLI contract and receiving-repository briefs live in `-/_HANDOFFS/ki/`.

`ki-repo` now defines the shared, optional working-area contract and has a judgment-led `WORK-J1` review criterion. `ki-repo-roadmap` supplies the complementary handoff-review guidance, while `ki-kb` references the shared handoff directionality without replacing its Knowledge Base-specific note-routing model. No automatic receiver discovery, movement, adoption, or deletion occurs.

## Steps

1. [x] Define the shared `+` / `-` repository contract: exact names and location, including `+/_HANDOFFS/` and `-/_HANDOFFS/`; incoming and outgoing purpose; acceptable material; durable destinations; triage, adoption, retention, and removal rules; and the boundary between a handoff and a receiving repository's roadmap or plan.
2. [x] Decide adoption and tracking policy: areas are optional and need no configuration or empty markers; when they exist, their shape and direction are exact.
3. [x] Define a judgment-led handoff review within `ki-repo-roadmap` hygiene: inspect `+/_HANDOFFS/` for material needing local adoption and `-/_HANDOFFS/` for receiving-repository progress, then report a proposed local roadmap action or closure. It does not infer acceptance, move files, edit either repository's roadmap, or treat a missing receiving checkout as failure.
4. [x] Update `ki-repo`'s standard, rubric, and AUDIT guidance proportionately. CONFORM deliberately has no working-area write: it does not invent, move, delete, or accept handoff content.
5. [x] Regenerate the public rubrics, add a worked repository example, and run the existing focused test suites that cover the unchanged safe writer and roadmap machinery.
6. [x] Add a bounded `ki-kb` cross-reference: preserve its fixed staging-area and note-routing model, while naming `ki-repo` as the owner of the repository-wide `+/_HANDOFFS/` and `-/_HANDOFFS/` handoff convention. Do not duplicate the lifecycle or make the KB skill depend on `ki-repo` operationally.
7. [x] Reconcile the harness's `+/` and `-/` footprint and update affected CLI handoff references and user/developer guidance. Ensure FND-003 uses the settled outgoing-handoff lifecycle.
8. [x] Run focused and repository-wide verification, then prepare the plan for manual acceptance.

## Files touched

- `skills/keystone/ki-repo/` standard, rubric, checker, educator, tests, and generated material as required
- `skills/general-governance/ki-repo-roadmap/` judgment-led handoff-review guidance and tests as required
- `skills/repo-structure/ki-kb/` references and generated material required for the ownership cross-reference
- top-level `+/` and `-/` working areas, including their guidance and current contents
- affected repository guides, handoffs, roadmap references, and this plan

## Verify

1. A fresh KI repository can understand whether and how to create `+/` and `-/` without treating them as a second roadmap or a hidden transfer mechanism.
2. AUDIT reports only meaningful structural or lifecycle violations; CONFORM is safe, idempotent, and never silently moves, deletes, or adopts working material.
3. Handoff review reports inbound adoption candidates and known outbound progress without assuming remote state, creating local work, or changing either side's files.
4. A formal outbound handoff identifies the receiving repository and boundaries, while the receiving repository independently owns its own roadmap and plan.
5. `ki-kb` preserves its staging-area model and routes repository-wide handoffs to the `ki-repo` convention without a duplicate lifecycle.
6. Focused `ki-repo` and `ki-repo-roadmap` tests, `bun run ki:repo:audit`, `bun run ki:bootstrap:audit` when generated material changes, `bun run test`, and `bun run ki:audit` pass serially.

## Dependencies / blocks

This work blocks FND-003 only where the CLI plan updates or creates outbound implementation briefs. It does not prevent design research that does not publish a revised handoff.

## Acceptance

### Delivered

An optional repository-wide working-area contract now defines `+/` as inbound and `-/` as outbound, with exact `_HANDOFFS` subareas and a clear boundary between a brief and the receiving repository's independently owned roadmap and plan.

`ki-repo` owns the shared contract and judgment review, `ki-repo-roadmap` owns the human-led review of locally held handoffs, and `ki-kb` references the same directionality while retaining its Knowledge Base-specific note-routing model.

### Summary of changes

- `skills/keystone/ki-repo/` now defines the working-area standard, `WORK-J1` rubric item, and a worked repository example.
- `skills/general-governance/ki-repo-roadmap/` now defines `HANDOFF-1` review guidance that reports proposed local action without reading or changing remote repositories.
- `skills/repo-structure/ki-kb/` now references the shared `+/_HANDOFFS/` and `-/_HANDOFFS/` convention without duplicating its lifecycle.
- `evals/guide-suite.ts` now reflects the current `govern.ts` vendor entrypoint, required runtime declaration, and aggregate presentation contract.

### Verification

- `bun skills/keystone/ki-repo/scripts/educate.test.ts`, `bun skills/general-governance/ki-repo-roadmap/scripts/repo-roadmap.test.ts`, `bun run ki:skills:audit`, `bun run ki:bootstrap:audit`, `bun run ki:repo:audit`, and `bun skills/repo-structure/ki-kb/scripts/govern.ts audit .` passed during implementation.
- `bun evals/guide-suite.ts` passed after its focused regression repair.
- `bun run test`, `bun run ki:audit`, `bun run ki:repo:audit`, `bun run ki:repo-roadmap:audit`, `bun run ki:authoring:audit`, and `git diff --check` passed serially at `a95952e2`.

### Outstanding concerns

The areas are deliberately optional and there is no automatic receiver discovery, file movement, adoption, or deletion. `ki:audit` retains three unrelated warning-level findings: one Decision Record serial gap and two existing KI-SHAPE-7 anchor warnings.

### Mini recap

The contract is most useful when it stays narrow: shared direction and ownership are governed, but the receiving repository remains the authority for priority and execution. FND-003 can now publish its CLI briefs through the settled outgoing-handoff lifecycle.

## Done

Completed the optional repository working-area and handoff-review contract.

Residual concern: None.

Follow-up: FND-003 may now use the settled outbound-handoff lifecycle as it defines the KI CLI manual and implementation route.
