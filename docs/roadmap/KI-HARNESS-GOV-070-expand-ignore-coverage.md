---
id: KI-HARNESS-GOV-070
area: GOV
title: Expand Ignore Coverage
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-16T20:28:46Z
updated_at: 2026-09-16T20:32:06Z
---

# Expand Ignore Coverage

## Goal

Ensure repositories ignore the generated output, caches, local state, and secrets of every supported toolchain or bundler while keeping each rule attributable to the capability that requires it.

## Context

`ki-repo` already owns and atomically composes the root `.gitignore`. Its current implementation emits marker-bounded blocks for `ki-repo`, `ki-engineering`, `ki-repo-website`, and `ki-repo-website-cloudflare`, followed by a preserved unmanaged section. The generated file therefore exposes which skill owns each managed rule, but the rule catalogue is a small hard-coded set rather than an inventory demonstrably covering every supported build tool.

The existing engineering block covers `node_modules/`, `dist/`, TypeScript build metadata, common package-manager logs, and real environment files. Website and Cloudflare blocks cover generated site output, `.wrangler/`, and `.dev.vars`. The standard also mandates Turborepo for workspace task graphs and supports Vite and Eleventy website implementations, so their actual cache and local-output behaviour should be checked explicitly rather than assuming the generic rules are complete.

## Boundary

Do not add a blanket catalogue for unsupported frameworks, ignore ambiguous directories that may contain authored source, or let contributing skills write `.gitignore` independently. `ki-repo` remains the sole file writer and existing repository-specific rules remain visible under the unmanaged section. Adoption, prioritisation, detailed planning, implementation, estate rollout, and acceptance remain separate decisions.

## Discussion

### Ownership shape

Keep marker names and explanatory comments skill-specific. A default belongs in `ki-engineering` only when it follows the common TypeScript/Bun toolchain; a website or hosting-specific artifact belongs in that declared capability's block. This preserves the compositional decision while making generated ignores auditable at a glance.

No dedicated operation or configuration surface is needed for unmanaged entries. Repository authors may continue editing the preserved unmanaged tail directly; this work concerns the completeness and clear demarcation of skill-managed defaults.

### Coverage method

Inventory tools the declared skill set actually standardises, identify their default and configured generated paths, and classify each path as already covered, newly required, deliberately tracked, or repository-specific. Include monorepo and nested site-root behaviour so an unanchored rule does not accidentally miss workspace output or hide an authored path.

### Likely evidence

At minimum, verify Turborepo, Vite, Eleventy, TypeScript, Vitest or browser-test reports, Bun and supported package-manager logs, and Cloudflare local state. Some apparent additions may already sit below `node_modules/` or the governed `reports/` and `dist/` seams; record that as evidence rather than duplicating patterns.

### Contract question

The current composer hard-codes contributor blocks inside `ki-repo` even though other skills declare `.gitignore` contribution metadata. Planning should decide whether the stable contract remains a central registry owned by `ki-repo` or gains a validated contributor-data seam, without creating multiple writers or order-dependent output.
