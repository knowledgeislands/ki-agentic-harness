---
id: KI-HARNESS-GOV-070
area: GOV
title: Expand Ignore Coverage
theme: governance-consistency
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: cac2e15033424b4b5d0c883f8486791268b6f313
created_at: 2026-09-16T20:28:46Z
updated_at: 2026-09-16T21:42:10Z
---

# Expand Ignore Coverage

## Goal

Ensure repositories ignore generated output, caches, local state, and secrets for every supported toolchain or bundler while keeping each rule attributable to the capability that requires it.

## Context

`ki-repo` already owns and atomically composes the root `.gitignore`. Its implementation emits marker-bounded blocks for `ki-repo`, `ki-engineering`, `ki-repo-website`, and `ki-repo-website-cloudflare`, followed by a preserved unmanaged section. The generated file therefore exposes which skill owns each managed rule.

The present catalogue already covers dependency trees, build output, TypeScript metadata, reports, package-manager logs, environment files, website output, Cloudflare local state, and local development secrets. Evidence review found one unsupported generated path within the declared stack: Turborepo stores its local cache beneath `.turbo/` while `ki-engineering` requires Turborepo for any repository with Bun workspaces.

## Boundary

Retain `ki-repo` as the sole `.gitignore` writer and the existing dependency-stable central registry selected by `ADR-KI-HARNESS-013`. Add only evidence-backed generated paths for supported capabilities. Do not add a blanket catalogue for unsupported frameworks, ignore ambiguous directories that may contain authored source, introduce another writer, or perform an estate rollout in this item.

## Current state

- `ki-repo` contributes `reports/`, runtime projections, editor metadata, and general log files.
- `ki-engineering` contributes `node_modules/`, `dist/` when no website skill owns it, `*.tsbuildinfo`, package-manager logs, and real environment files.
- `ki-repo-website` contributes `dist/`; its Eleventy and Vite contracts both place generated website output there.
- `ki-repo-website-cloudflare` contributes `.wrangler/` and `.dev.vars`.
- Vite's default cache is nested under `node_modules/`; Vitest and browser-test output uses `reports/`; TypeScript metadata and Bun logs are already covered.
- Turborepo's `.turbo/cache` is not covered by an existing rule.

## Steps

- [x] Add `.turbo/` to the `ki-engineering` managed block and normalize common unmanaged root variants into that canonical rule.
- [x] Extend focused composition tests to prove ownership, stable rendering, and legacy-rule retirement.
- [x] Record the official Turborepo cache source and the engineering convention that generated local cache belongs below `.turbo/`.
- [x] Record why Vite, Eleventy, TypeScript, test reports, Bun logs, and Cloudflare need no duplicate rule.
- [x] Run focused tests, TypeScript and repository audits, then publish the exact review packet.

## Files touched

- `.gitignore`
- `skills/keystone/ki-repo/scripts/rubric/contexts/gitignore.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/gitignore.test.ts`
- `skills/governance/ki-engineering/references/sources.md`
- `skills/governance/ki-engineering/references/standards-engineering.md`
- this roadmap record

## Verify

- The `ki-engineering` block renders `.turbo/` exactly once when that skill is declared.
- Existing unmanaged `.turbo` and `/.turbo` root variants are retired during reconciliation without affecting unrelated repository-specific rules.
- The source and standard distinguish the missing Turborepo cache from already-covered tool outputs.
- `bun test skills/keystone/ki-repo/scripts/rubric/contexts/gitignore.test.ts`
- `bunx tsc --noEmit`
- `bun run test`
- `bunx biome check`
- `ki repo audit --skill ki-repo --repo .`
- `ki repo audit --skill ki-engineering --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `git diff --check`

## Dependencies / blocks

No dependency block remains. The user approved selection, planning, and implementation on 2026-09-16. `ADR-KI-HARNESS-013` already decides the single-writer composition architecture, so this item does not reopen that contract.

## Documentation impact

### Decision Records

No new decision is required; the implementation follows `ADR-KI-HARNESS-013`.

### Specifications

No separate specification is required; the executable `ki-repo` rubric owns conformance and the engineering standard owns the contributor rule.

### Guides

No guide change is required; conforming repositories receive the rule through existing `ki repo conform` behaviour.

### Roadmap

Update this record through implementation and Awaiting review; any estate rollout remains separately selectable work.

## Review

### Delivered

From immutable baseline `cac2e15033424b4b5d0c883f8486791268b6f313`, expanded the compositional ignore contract for the supported engineering stack without changing its single-writer architecture or introducing rules for unsupported frameworks.

### Summary of changes

Added `.turbo/` to the `ki-engineering` managed block, reconciled common root variants, updated this repository's generated `.gitignore`, and extended focused tests. Added primary-source evidence for Turborepo and Vite and made their cache treatment explicit in the engineering standard. Existing coverage for Eleventy, TypeScript, test reports, Bun logs, and Cloudflare remains unchanged because their generated paths were already governed.

### Verification

- `bun test skills/keystone/ki-repo/scripts/rubric/contexts/gitignore.test.ts` — PASS, 4 tests and 25 expectations.
- `bunx tsc --noEmit && bun run test && bunx biome check` — PASS.
- `ki repo audit --skill ki-repo --repo .` — PASS using the clean committed `tools-ki` baseline because the active linked checkout contains unrelated in-progress acquisition edits.
- `ki repo audit --skill ki-engineering --repo .` — PASS using the same baseline.
- `ki repo audit --skill ki-authoring --repo .` — PASS using the same baseline.
- `ki repo audit --skill ki-work-roadmap --repo .` — PASS using the same baseline.
- `git diff --check` — PASS.

### Outstanding concerns

No concern remains inside the approved boundary. The separately linked development `ki` command cannot currently start because another session has deleted `tools-ki/src/core/acquire/granola-import.ts` while refactoring acquisition; the audits were therefore run from an isolated archive of that repository's current committed baseline and shared installed dependencies.

### Post-change review

The narrow addition closes the only evidenced coverage gap in the supported stack. Keeping the rule in the existing central composer preserves deterministic ordering and sole-writer behaviour; avoiding `.cache/` and `.vite/` prevents ambiguous or redundant exclusions. Estate rollout remains separate work.

### Mini recap

Turborepo local cache is now governed, attributable, normalized, tested, and documented; all planned verification passes and the item is ready for human acceptance.

## Done

Accepted 2026-09-16 by Kris Brown on the review packet above.

## Discussion

### Evidence

- Official Turborepo documentation places the local task cache in `.turbo/cache`, so ignoring `.turbo/` covers the generated cache without hiding authored paths.
- Official Vite documentation places its default cache at `node_modules/.vite`, already below the managed `node_modules/` rule.
- KI engineering standards route test and coverage output through `reports/`, website builds through `dist/`, and TypeScript metadata through `*.tsbuildinfo`.
- Bun and other package-manager logs are covered by the general `*.log` and existing package-manager-specific patterns.
- Cloudflare local state and local development secrets remain owned by the `ki-repo-website-cloudflare` block.
