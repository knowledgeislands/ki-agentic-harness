---
id: 'FND-019'
title: Review structural consistency across shipped skills
status: in-progress
roadmap: foundation-tooling/review-structural-consistency-across-shipped-skills
blocks: —
blocked-by: —
---

## Context

The harness has grown multiple exemplar skills and several legitimate concern-specific implementation shapes.

We need a structured review that finds unjustified divergence without treating every skill as a line-by-line template copy.

## Current state

`ki-skills` checks skill shape and cross-skill declarations, but it intentionally does not prescribe all implementation layout choices across checkers, mode wiring, shared modules, tests, generated payloads, and documentation ownership.

## Steps

1. ✓ Select representative exemplars for governance, process, harness, and lightweight skills. Define a review matrix covering frontmatter and mode boundaries, checker decomposition, shared-module direction, script/fixture/test layout, safe-write and subprocess patterns, generated payload treatment, HELP, and documentation-to-code ownership.
2. ✓ Inventory every shipped skill against that matrix in dependency order. Record evidence and classify each difference as intentional concern-specific design, harmless variation, suspected inconsistency, or a material contract/safety defect; do not edit implementation during the inventory.
3. ✓ Review the suspected differences with each owning skill's standard, rubric, tests, and generated surfaces. Settle the minimal common patterns that are genuinely shared, identify where exemplars should change instead of dependants, and record any durable ownership decision in the appropriate standard or decision record.
4. ✓ Apply only small, unambiguous consistency repairs with their focused tests and generated payload refreshes. Split each broader or disputed repair into a separately scoped roadmap item and plan, with dependencies where needed.
5. ✓ Publish the review result and follow-up map, update the relevant rubric or guidance only for adopted common patterns, and run structural, generated-payload, and serial repository gates.

## Files touched

- shipped `skills/**/` sources, references, scripts, tests, and generated payloads only where a finding is unambiguous.
- this plan's assessment record and focused roadmap follow-ups for material discrepancies.
- owning standards, rubrics, or decision records only when the review adopts a durable common pattern.

Actual changes:

- `skills/general-governance/ki-repo-roadmap/scripts/educate.ts`
- `skills/general-governance/ki-repo-roadmap/scripts/govern.ts`
- `skills/general-governance/ki-repo-roadmap/scripts/repo-roadmap.test.ts`

## Verify

1. Every shipped skill has a recorded structural assessment with evidence and classification.
2. The result distinguishes legitimate variation from concrete defects and does not produce a blanket rewrite.
3. Every material discrepancy is either repaired with tests or has a focused, dependency-aware follow-up item.
4. Any changed source/vendored surface is regenerated and passes `bun run test` and `bun run ki:audit`.

## Dependencies / blocks

This review is independent of the lifecycle, linking, layout, and progress plans; it may create focused follow-ups that depend on them.

## Assessment record

### Scope and method

This review compares implementation structure, not the line-by-line content of every skill.

It covers the 31 shipped skills present on 2026-07-22, using the `ki-skills` checker root as the primary governed-checker exemplar and `ki-plan` as the lightweight process exemplar.

The evidence pass inspected frontmatter and mode boundaries, governed entrypoints, shared-module direction, public script and test layout, subprocess use, generated payload treatment, HELP, and documentation-to-code ownership.

The baseline command was `bun skills/keystone/ki-skills/scripts/govern.ts audit skills --reporter=terminal --reporter-levels=WARN --progress=never`.

It reported zero FAILs and two existing `KI-SHAPE-7` WARNs about always-on anchors; neither warning is a structural implementation discrepancy found by this review.

### Governance skills

All 27 governance skills declare dependencies and a public invocation hint, carry `scripts/govern.ts` and `scripts/educate.ts`, expose `plan`, `check`, and `main`, and have retired their separate `audit.ts` and `conform.ts` entrypoints.

| Skill or set | Assessment | Evidence and classification |
| --- | --- | --- |
| `ki-skills` | Intentional exemplar | Owns the canonical shared rubric, checker, reporter, checker-reporter, and governed-entrypoint modules. Its richer contexts and focused tests are the correct provider-side shape. |
| `ki-bootstrap` | Intentional exemplar | Owns the bootstrap and publishing engine, so its governed EDUCATE branch legitimately calls its own import-safe repository engine rather than the generic per-skill educator. Its larger safety and parity suite matches that boundary. |
| `ki-repo` | Conforms | Uses the shared governed checker and educator contract; its project-publishing tests are concern-specific. |
| `ki-authoring`, `ki-engineering` | Conform | Foundation checkers use the shared contract; their domain-specific evidence and tool invocations are legitimate. |
| `ki-binding`, `ki-housekeeping`, `ki-tokenomics` | Conform | Environment checkers use the shared contract. Their optional external commands are domain boundaries, not local entrypoint hand-offs. |
| `ki-agents`, `ki-decision-records`, `ki-feature-definitions`, `ki-handoffs` | Conform | The governance-checker comparison slice found the standard dependent shape: vendored `ki-skills` checker modules plus in-process `runSkillEducator`. Context and test granularity match each concern. |
| `ki-repo-roadmap` | Repair applied | Its former `Bun.spawnSync` hand-off to adjacent `educate.ts` is replaced by an import-safe `main(argv)` call. Its profile and safe-write suite continues to cover the behaviour. |
| `ki-binding-chezmoi`, `ki-kb-activities`, `ki-kb-live-artifacts`, `ki-kb-streams`, `ki-website-cloudflare` | Conform | Implied-family skills retain the standard governed-entrypoint and shared-educator shape. |
| `ki-dotfiles-chezmoi`, `ki-harness`, `ki-homebrew-tap`, `ki-kb`, `ki-mcp`, `ki-plugins`, `ki-specifications`, `ki-tools`, `ki-website` | Conform | Repo-structure skills retain the same portable governed-entrypoint shape. Their test counts vary with real filesystem and external-tool risk. |

### Process skills

| Skill | Assessment | Evidence and classification |
| --- | --- | --- |
| `ki-delegate` | Intentional process shape | A lightweight procedure skill; it does not claim governance modes or a vendored checker. |
| `ki-next` | Intentional process shape | A lightweight roadmap-selection procedure; it composes with the lifecycle without duplicating its checker. |
| `ki-plan` | Intentional process exemplar | Owns lifecycle procedure and validates through the roadmap governance skill instead of carrying a second checker. |
| `ki-recap` | Intentional process shape | A focused recap procedure with a grounding test; it is correctly exempt from governance entrypoints. |

### Findings and adopted pattern

The shared pattern is deliberately narrow: a regular governance skill's `govern.ts` owns only command parsing and its checker's `plan`/`check` contract, while EDUCATE delegates in-process either to `runSkillEducator` or, for an engine-owning root, to an import-safe owner function.

`ki-repo-roadmap` was the one material discrepancy: it started a second Bun process to hand off to adjacent source code.

That extra process obscured direct control flow and created a needless execution boundary without adding user-space isolation or crossing an external command boundary.

The repair exports an import-safe `main(argv)` from `scripts/educate.ts`, preserves its standalone CLI wrapper, and calls that function from `scripts/govern.ts`.

Test-file counts, the number of rubric contexts, and whether a skill has a dedicated publication test are harmless concern-specific variation.

`ki-repo-roadmap`'s single large end-to-end suite explicitly exercises simple-profile education, thematic projection, safe writes, lifecycle validation, and drift; it is not under-tested merely because that evidence is not split into several files.

### Follow-up map

FND-019 includes the local `ki-repo-roadmap` EDUCATE hand-off repair because it is bounded, has an existing focused suite, and preserves an already-settled contract.

No broader normalisation work is justified by this inventory.

The existing roadmap item **Review `ki-bootstrap` for further simplification** remains the right separate home for bootstrap engine boundaries, including its own local process launches.
