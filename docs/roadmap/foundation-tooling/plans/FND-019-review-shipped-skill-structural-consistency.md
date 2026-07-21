---
id: 'FND-019'
title: Review structural consistency across shipped skills
status: ready
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

1. Select representative exemplars for governance, process, harness, and lightweight skills. Define a review matrix covering frontmatter and mode boundaries, checker decomposition, shared-module direction, script/fixture/test layout, safe-write and subprocess patterns, generated payload treatment, HELP, and documentation-to-code ownership.
2. Inventory every shipped skill against that matrix in dependency order. Record evidence and classify each difference as intentional concern-specific design, harmless variation, suspected inconsistency, or a material contract/safety defect; do not edit implementation during the inventory.
3. Review the suspected differences with each owning skill's standard, rubric, tests, and generated surfaces. Settle the minimal common patterns that are genuinely shared, identify where exemplars should change instead of dependants, and record any durable ownership decision in the appropriate standard or decision record.
4. Apply only small, unambiguous consistency repairs with their focused tests and generated payload refreshes. Split each broader or disputed repair into a separately scoped roadmap item and plan, with dependencies where needed.
5. Publish the review result and follow-up map, update the relevant rubric or guidance only for adopted common patterns, and run structural, generated-payload, and serial repository gates.

## Files touched

- shipped `skills/**/` sources, references, scripts, tests, and generated payloads only where a finding is unambiguous.
- a review matrix/report and focused roadmap follow-ups for material discrepancies.
- owning standards, rubrics, or decision records only when the review adopts a durable common pattern.

## Verify

1. Every shipped skill has a recorded structural assessment with evidence and classification.
2. The result distinguishes legitimate variation from concrete defects and does not produce a blanket rewrite.
3. Every material discrepancy is either repaired with tests or has a focused, dependency-aware follow-up item.
4. Any changed source/vendored surface is regenerated and passes `bun run test` and `bun run ki:audit`.

## Dependencies / blocks

This review is independent of the lifecycle, linking, layout, and progress plans; it may create focused follow-ups that depend on them.
