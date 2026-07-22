---
id: 'FND-004'
title: Codify repository working areas
status: ready
roadmap: foundation-tooling/codify-repository-working-areas
blocks: FND-003
blocked-by: —
---

## Context

Knowledge Bases use top-level `+` and `-` spaces to make incoming and outgoing working material visible before it reaches its durable destination.

Knowledge Islands repositories need the same legible staging model: incoming material is triaged locally, and outgoing material can carry an implementation-ready handoff without pretending to control the receiving repository's roadmap or plan.

`ki-repo` is the natural owner because this is a repository-shape and repository-working-practice convention rather than a feature of one implementation or one Knowledge Base.

## Current state

This harness now has top-level `+/` and `-/` working areas, with explicit `+/_HANDOFFS/` and `-/_HANDOFFS/` subareas. Its existing CLI contract and receiving-repository briefs have moved into `-/_HANDOFFS/ki/`.

There is no cross-repository standard, lifecycle definition, configuration declaration, rubric criterion, audit, or educator support for these areas yet. Other repositories may have different ungoverned arrangements.

## Steps

1. Define the shared `+` / `-` repository contract: exact names and location, including `+/_HANDOFFS/` and `-/_HANDOFFS/`; incoming and outgoing purpose; acceptable material; durable destinations; triage, adoption, retention, and removal rules; and the boundary between a handoff and a receiving repository's roadmap or plan.
2. Decide adoption and tracking policy: whether every KI repository receives both areas, which intentionally empty area markers are committed or ignored, whether configuration is necessary, and how the convention remains useful for repositories without cross-repository work.
3. Define a judgment-led handoff review within `ki-repo-roadmap` hygiene: inspect `+/_HANDOFFS/` for material needing local adoption and `-/_HANDOFFS/` for receiving-repository progress, then report a proposed local roadmap action or closure. It must not infer acceptance, move files, edit either repository's roadmap, or treat a missing receiving checkout as failure.
4. Update `ki-repo`'s standard, rubric, education, audit, and conform behaviour proportionately. Make any mechanical check distinguish safe structural absence from a real convention breach; do not make CONFORM invent, move, delete, or accept handoff content.
5. Add focused tests and worked examples for a repository with no staged material, incoming material awaiting triage, outgoing handoffs awaiting adoption, a handoff that has been accepted into the receiving repository's roadmap, and the non-mutating handoff-review report.
6. Reconcile the harness's `+/` and `-/` footprint and update affected CLI handoff references and user/developer guidance. Ensure FND-003 uses the settled outgoing-handoff lifecycle.
7. Run focused and repository-wide verification, then prepare the plan for manual acceptance.

## Files touched

- `skills/keystone/ki-repo/` standard, rubric, checker, educator, tests, and generated material as required
- `skills/general-governance/ki-repo-roadmap/` judgment-led handoff-review guidance and tests as required
- top-level `+/` and `-/` working areas, including their guidance and current contents
- affected repository guides, handoffs, roadmap references, and this plan

## Verify

1. A fresh KI repository can understand whether and how to create `+/` and `-/` without treating them as a second roadmap or a hidden transfer mechanism.
2. AUDIT reports only meaningful structural or lifecycle violations; CONFORM is safe, idempotent, and never silently moves, deletes, or adopts working material.
3. Handoff review reports inbound adoption candidates and known outbound progress without assuming remote state, creating local work, or changing either side's files.
4. A formal outbound handoff identifies the receiving repository and boundaries, while the receiving repository independently owns its own roadmap and plan.
5. Focused `ki-repo` and `ki-repo-roadmap` tests, `bun run ki:repo:audit`, `bun run ki:bootstrap:audit` when generated material changes, `bun run test`, and `bun run ki:audit` pass serially.

## Dependencies / blocks

This work blocks FND-003 only where the CLI plan updates or creates outbound implementation briefs. It does not prevent design research that does not publish a revised handoff.
