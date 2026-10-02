---
id: KI-HARNESS-GOV-128
area: GOV
title: Verify Knip entrypoint provenance
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-02T05:46:14Z
updated_at: 2026-10-02T05:46:14Z
---

# KI-HARNESS-GOV-128: Verify Knip entrypoint provenance

## Goal

Knip reports unused authored code in repository commands and canonical skill scripts as well as product source. A reviewer can tell why each declared entry point is genuinely invoked, so an unused file cannot be hidden by naming it as an entry point.

## Context

The `ki-engineering` standard expects Knip entries for test, script and evaluation roots that plugins do not discover, but the entry list is trusted input to Knip. A blanket `scripts/*.ts` entry makes every future top-level script appear live. On 2026-10-02, `tools-ki` still excluded `scripts/**` from Knip after its unused D3 vendoring script was removed. Removing that exclusion and including its canonical local `ki-self` scripts exposed an unused type re-export. Several MCP repositories already run `scripts/smoke.ts` from `package.json`, but named that entry only through a broad glob or left Knip to infer it.

Canonical skills also have executable TypeScript under their own `scripts/` trees. The harness Knip config includes those trees through broad entry patterns; repository-local authored skills can sit under `.agents/skills/`, alongside linked managed projections that must stay excluded. A code file's location or entry declaration alone cannot establish use by a package command, a test runner, a skill workflow or the native rubric catalogue.

## Boundary

This item owns the portable `ki-engineering` rule and judgment audit for the provenance of Knip entry points, with an estate review of applicable authored code. Each repository owns its actual command and skill invocations. Preserve the exclusion of generated or linked skill projections. Do not make operational scripts subject to the product source's 100% Vitest coverage threshold; coverage and reachability answer different questions.

## Discussion

### Entry-point evidence

Review every explicit Knip entry and broad entry pattern against a real caller: a package command, published executable, configured test runner, documented skill operation, native catalogue loader or another supported invocation. Prefer named entries where a glob would automatically bless unrelated future files. Include top-level `scripts/` and canonical skill scripts in Knip's project scope so unreferenced files and exports remain visible. Where a workflow invokes a file outside static imports, record that evidence close to its entry declaration or in the audit result.

### Review outcome

Add a judgment criterion to the `ki-engineering` audit that distinguishes verified, uncertain and obsolete entry declarations. A mechanically passing Knip run does not clear uncertain provenance. Remove obsolete entries and code only after checking whether a supported external or skill workflow calls them; do not invent a caller solely to silence Knip. Keep this concern distinct from the dependency-direction rollout in [KI-HARNESS-GOV-127](KI-HARNESS-GOV-127-adopt-dependency-cruiser-estatewide.md).
