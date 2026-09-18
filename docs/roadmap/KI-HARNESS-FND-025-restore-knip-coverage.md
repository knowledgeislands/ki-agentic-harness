---
id: KI-HARNESS-FND-025
area: FND
title: Restore knip source coverage
theme: foundation-tooling
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-18T03:14:14Z
updated_at: 2026-09-18T03:39:36Z
---

# Restore knip source coverage

## Goal

Make knip inspect the Harness's current domain-grouped TypeScript source layout without weakening justified generated or runtime-projection exclusions.

## Context

The 2026-09-18 engineering alignment review ran `bunx knip`. It exited successfully but reported 14 configuration hints. The configured `skills/*/scripts/**/*.ts` entry and project patterns no longer match the current `skills/<domain>/<skill>/scripts/` layout, while several ignores and legacy entry patterns match no files. A clean exit therefore does not currently demonstrate the Decision Record's intended dependency and dead-code coverage.

## Boundary

Update only intentional knip entry, project, ignore, binary, and dependency exceptions needed for current source ownership. Do not make exported APIs private merely to silence the tool, remove runtime projections without their owner, or broaden ignores around genuine unused code. Any resulting unused dependency or export finding needs its own evidence-backed disposition.

## Current state

`knip.json` still assumes a one-level `skills/<skill>/scripts/` layout and names absent root `scripts/`, evaluation, Claude-workflow, generated, and runtime-projection paths. Current authored TypeScript lives beneath `skills/<domain>/<skill>/scripts/`, `evals/`, and `hooks/`. Fifty rubric catalogue entry points are dynamically loaded by the host and therefore need explicit entry coverage; repository test files are also independent execution roots.

## Steps

- [ ] Replace the obsolete skill entry and project patterns with domain-grouped patterns covering public top-level scripts, rubric catalogue indexes, tests, and their imported implementation files.
- [ ] Add `hooks/` to project and test-entry coverage while preserving the current evaluation harness and scenario graph.
- [ ] Remove only configuration entries that match no current physical source or execution dependency; retain justified dependency exceptions.
- [ ] Run knip without suppressed configuration hints and resolve every genuine unused-code, dependency, unmatched-pattern, or redundant-exception result.
- [ ] Run the engineering audit, complete repository test suite, TypeScript, Biome, roadmap, and authoring checks and record exact evidence.

## Files touched

- `knip.json`
- `docs/roadmap/KI-HARNESS-FND-025-restore-knip-coverage.md`

## Verify

- `bunx knip`
- `ki repo audit --skill ki-engineering --repo .`
- `bun run test`
- `bunx tsc --noEmit`
- `bunx biome check .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `git diff --check`

## Dependencies / blocks

No external dependency blocks this repository-local correction. The dynamically loaded rubric catalogue and independently executed tests must remain explicit Knip entries rather than being mistaken for unused implementation.

## Documentation impact

### Decision Records

No Decision Record change is expected. The existing toolchain decisions already require intentional Knip entry points and justified exclusions.

### Specifications

No accepted behaviour changes.

### Guides

No user procedure changes.

### Roadmap

This record owns the bounded configuration repair. Any genuine unused-code result outside that repair is reported separately rather than hidden with a new ignore.

## Delegation

The change is one tightly coupled configuration and verification loop, so direct execution avoids splitting interpretation of the same Knip result.

## Discussion

The finding is mechanically reproducible and distinct from the existing engineering rubric: `ki-engineering` runs Knip but suppresses advisory configuration hints. This repair remains repository configuration because the exact domain, rubric-entry, test, evaluation, and hook patterns are Harness-local execution topology. A reusable criterion would need a portable declaration of intended dynamic entry roots rather than inferring them from this repository's directories.
