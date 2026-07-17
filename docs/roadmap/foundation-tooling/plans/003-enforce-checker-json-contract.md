---
id: '003'
title: Enforce cited checker JSON contract
status: open
roadmap: foundation-tooling/complete-cited-json-checker-contract-conformance-and-enforce-chk-009-chk-012
blocks: —
blocked-by: —
---

## Context

Every checker is expected to emit the aggregate's structured finding contract: cited, rubric-owned codes and non-restating messages.

The contract is decided but remaining exceptions and undocumented codes prevent it from being a reliable gate.

## Current state

Known `ki-housekeeping`, `ki-binding`, `ki-decision-records`, and `ki-feature-definitions` exceptions need reconciliation, alongside whole-suite collection of emitted finding codes and judgment-only exemptions.

## Steps

1. [ ] Build a reporting-only collection pass over every checker JSON surface, mapping emitted codes to owning rubric criteria and recording declared judgment-only exemptions.
2. [ ] Repair undocumented codes and the known checker exceptions while retaining the single aggregate renderer model.
3. [ ] Enforce CHK-012's non-restating message rule and promote the clean reporting check to a gate.
4. [ ] Add focused fixtures and contract tests, re-vendor affected checkers, run aggregate verification, and close the plan.

## Files touched

- `skills/foundations/ki-engineering/`
- Affected skill checkers and rubrics
- `.ki-meta/` after source changes

## Verify

- Every emitted mechanical finding code maps to a cited owning rubric criterion or an explicit judgment-only exemption.
- Checker messages do not restate the cited rule text when the reference is sufficient.
- Known exception checkers conform to the shared aggregate JSON renderer.
- Focused contract tests, `bun run test`, and `bun run ki:audit` pass.

## Dependencies / blocks

Independent of the other selected items, but broader than them; keep reporting-only collection until the exceptions are resolved.
