---
id: KI-HARNESS-FND-025
area: FND
title: Restore knip source coverage
theme: foundation-tooling
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 9a5a664b2ce5bd9753ffa8ee598762a5bbd63257
created_at: 2026-09-18T03:14:14Z
updated_at: 2026-09-18T04:09:06Z
---

# Restore knip source coverage

## Goal

Make knip inspect the Harness's current domain-grouped TypeScript source layout without weakening justified generated or runtime-projection exclusions.

## Context

The 2026-09-18 engineering alignment review ran `bunx knip`. It exited successfully but reported 14 configuration hints. The configured `skills/*/scripts/**/*.ts` entry and project patterns no longer match the current `skills/<domain>/<skill>/scripts/` layout, while several ignores and legacy entry patterns match no files. A clean exit therefore does not currently demonstrate the Decision Record's intended dependency and dead-code coverage.

## Boundary

Update only intentional knip entry, project, ignore, binary, and dependency exceptions needed for current source ownership. Do not make exported APIs private merely to silence the tool, remove runtime projections without their owner, or broaden ignores around genuine unused code. Any resulting unused dependency or export finding needs its own evidence-backed disposition.

## Current state

Awaiting review from immutable baseline `9a5a664b2ce5bd9753ffa8ee598762a5bbd63257`. Knip now covers the domain-grouped skill sources, dynamic rubric catalogue entry points, shared public modules, independently executed tests, evaluations, and hooks. The scan exposed one genuinely dead export, which was removed. Two advisory configuration hints remain deliberately: the engineering contract requires defensive ignores for the managed `.claude/skills/` and `.agents/skills/` projections.

## Steps

- [x] Replace the obsolete skill entry and project patterns with domain-grouped patterns covering public top-level scripts, rubric catalogue indexes, tests, and their imported implementation files.
- [x] Add `hooks/` to project and test-entry coverage while preserving the current evaluation harness and scenario graph.
- [x] Remove only configuration entries that match no current physical source or execution dependency; retain justified dependency exceptions.
- [x] Run knip without suppressed configuration hints and resolve every genuine unused-code, dependency, unmatched-pattern, or redundant-exception result.
- [x] Run the engineering audit, complete repository test suite, TypeScript, Biome, roadmap, and authoring checks and record exact evidence.

## Files touched

- `knip.json`
- `docs/roadmap/KI-HARNESS-FND-025-restore-knip-coverage.md`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts`

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

## Review

### Delivered

- Replaced obsolete one-level skill patterns with domain-grouped source coverage.
- Added explicit roots for dynamically loaded rubric catalogues, public rubric types and shared modules, skill tests, evaluation tests, and hook tests.
- Removed unmatched legacy entries and exceptions, while identifying `codex` and `op` as intentional external binaries.
- Removed the unused `HORIZON_BLURBS` export exposed by the restored scan.

### Summary of changes

`knip.json` now treats the Harness's authored TypeScript topology as the project surface and its independently executed or dynamically loaded modules as entry points. Generated runtime projections remain excluded under the existing engineering contract. No dependency was added or removed.

### Verification

- `bunx knip --no-config-hints` — pass; no dependency, file, export, or binary findings.
- `bunx knip` — pass with only the two justified managed-projection configuration hints described below.
- `ki repo audit --skill ki-engineering --repo .` — pass.
- `bun run test` — pass.
- `bunx tsc --noEmit` — pass.
- `bunx biome check .` — pass.
- `ki repo audit --skill ki-work-roadmap --repo .` — pass.
- `ki repo audit --skill ki-authoring --repo .` — pass.
- `git diff --check` — pass.

### Outstanding concerns

Plain `bunx knip` advises removing `.claude/skills/**` and `.agents/skills/**` from `ignore`. They are intentionally retained because the engineering audit's managed-surface criterion requires both defensive exclusions. Removing them makes that audit fail, so they are a documented contract exception rather than stale configuration.

### Post-change review

No reusable audit criterion was added. The existing engineering audit already runs Knip and verifies the managed projection exclusions; the exact entry-pattern topology is repository-local configuration rather than a portable invariant.

### Mini recap

Knip once again provides meaningful dependency and dead-code coverage for every current Harness TypeScript source area. The resulting configuration is clean apart from two required and evidenced projection-ignore hints, and the item is ready for human review.

## Done

Accepted 2026-09-18 by Kris Brown on review packet above.

## Discussion

The finding is mechanically reproducible and distinct from the existing engineering rubric: `ki-engineering` runs Knip but suppresses advisory configuration hints. This repair remains repository configuration because the exact domain, rubric-entry, test, evaluation, and hook patterns are Harness-local execution topology. A reusable criterion would need a portable declaration of intended dynamic entry roots rather than inferring them from this repository's directories.
