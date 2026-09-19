---
id: KI-HARNESS-GOV-077
area: GOV
title: Standardise common Git hooks
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 74fdc44de018d8a3e07cc82eae2e660034b92c6f
created_at: 2026-09-19T08:51:33Z
updated_at: 2026-09-19T09:06:12Z
---

# Standardise Common Git Hooks

## Goal

Give every KI-governed `package.json` repository the same locally enforced Git baseline: staged-file formatting, canonical package ordering, and Conventional Commit validation, with repository audit and CI as the authoritative fallback.

## Context

The engineering standard already requires Husky, lint-staged, Syncpack, and a `prepare` script, while the Git standard already requires a six-type Conventional Commit vocabulary. The current common hook contract runs lint-staged but does not run Syncpack, and no deterministic `commit-msg` binding enforces the existing message policy. Consequently, repositories can declare all required tools yet wire different local commit behaviour.

## Boundary

Standardise package-backed repository hooks without moving Git policy into engineering or making hooks the sole authority. `ki-git` continues to own commit-message syntax; `ki-engineering` owns Husky, Commitlint and Syncpack dependencies, hook wiring, audit evidence, and bounded conformance. Preserve repository-specific pre-commit checks after the common baseline. Do not introduce branch protection, rewrite existing history, validate subjective imperative mood mechanically, or claim Husky cannot be bypassed.

## Current state

Awaiting review from immutable baseline `74fdc44de018d8a3e07cc82eae2e660034b92c6f`. The Harness now exercises the canonical hook baseline itself: lint-staged and check-only Syncpack run before repository-specific pre-commit checks, while Commitlint validates proposed messages in `commit-msg`. The engineering rubric audits and safely conforms those surfaces, and the Git standard retains ownership of message semantics.

## Steps

- [x] Define the common hook lifecycle and ownership split in the Git and engineering standards.
- [x] Require current Commitlint dependencies alongside the existing Husky, lint-staged, and Syncpack toolchain.
- [x] Audit and conform a common pre-commit prefix that runs lint-staged followed by check-only Syncpack while preserving repository-specific checks.
- [x] Audit and conform a Commitlint-backed `commit-msg` hook and KI Conventional Commit configuration.
- [x] Add focused fixtures for compliant, missing, drifted, and safely conformed hook surfaces.
- [x] Apply the standard to the Harness and run focused tests, full tests, TypeScript, Biome, skill, engineering, Git, roadmap, and authoring audits.

## Files touched

- `package.json`
- `bun.lock`
- `.husky/pre-commit`
- `.husky/commit-msg`
- `commitlint.config.mjs`
- `skills/governance/ki-git/`
- `skills/governance/ki-engineering/`
- `hooks/pre-commit.test.ts`
- `hooks/commit-msg.test.ts`
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`
- `docs/roadmap/KI-HARNESS-GOV-077-standardise-common-git-hooks.md`
- `docs/roadmap/_ISSUES.md`

## Verify

- `bun test skills/governance/ki-engineering/scripts/rubric/items/index.test.ts hooks/pre-commit.test.ts`
- `bun run test`
- `bunx tsc --noEmit`
- `bunx biome check .`
- `bunx syncpack format --check`
- `ki repo audit --skill ki-engineering --repo .`
- `ki repo audit --skill ki-git --repo .`
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `git diff --check`

## Dependencies / blocks

No external delivery dependency blocks the Harness standard. Estate conformance is a later repository-by-repository application of this published contract and is not required to prove the canonical implementation here.

## Documentation impact

### Decision Records

No Decision Record change is expected. This mechanically enforces the existing Conventional Commit and engineering-toolchain decisions without changing their rationale or ownership.

### Specifications

No product behaviour changes. The governance rubric and hook fixtures provide the accepted repository-conformance evidence.

### Guides

No separate guide is needed; the two owning skill standards describe the hook lifecycle, bypass boundary, and repair behaviour.

### Roadmap

This record owns the Harness contract and self-application. Any estate-wide residual drift found after publication should be routed to the owning repositories rather than expanding this item across repository boundaries.

## Delegation

The Git policy, engineering audit, conform transaction, hook fixtures, and self-application form one coupled contract. Direct delivery avoids splitting ownership decisions from the implementation that proves them.

## Review

### Delivered

- Bound lint-staged followed by check-only Syncpack as the common Husky `pre-commit` prefix while preserving repository-specific checks.
- Bound Commitlint in `commit-msg` with the six KI Conventional Commit types, lowercase kebab-case scopes, required subjects, and no terminal full stop.
- Added `SCR-11` audit and automatic conformance, including safe refusal to replace symlinked hook paths.
- Added current Commitlint `21.2.2` dependencies, canonical configuration, generated rubric publication, and Harness self-application.

### Summary of changes

`ki-git` now explicitly owns the message policy consumed by the package-backed binding. `ki-engineering` owns the Commitlint dependencies and configuration, the two common Husky prefixes, deterministic audit evidence, and bounded conformance. Focused hook tests cover accepted and rejected messages, command ordering, drift repair, preservation of repository checks, and unsafe-path refusal.

### Verification

- Focused hook, engineering catalogue, and remediation-inventory tests — 28 pass, 0 fail.
- Complete Harness suite — 733 pass, 0 fail across 134 files.
- `bunx tsc --noEmit` — pass.
- `bunx biome check .` — pass with one informational schema-version notice inherited from the current `biome.json` and installed CLI mismatch.
- `bunx syncpack format --check` — pass.
- `ki repo conform --skill ki-engineering --repo . --dry-run` — clean fixed point.
- Focused `ki-engineering`, `ki-git`, `ki-skills`, `ki-work-roadmap`, and `ki-authoring` audits — pass.
- `git diff --check` — pass.

### Outstanding concerns

Husky remains deliberately bypassable through `--no-verify`; repository audit and CI remain authoritative. This item publishes and self-applies the contract but does not mutate sibling repositories. Their adoption should use the published `ki-engineering` CONFORM path after this change is accepted and available to them.

### Post-change review

The change adds one reusable automatic rubric criterion rather than repository-only hook assertions. Git message semantics remain with `ki-git`, package mechanics remain with `ki-engineering`, and repository-specific checks remain outside the common prefix. No additional Decision Record or Specification is warranted.

### Mini recap

KI package repositories now have a mechanically auditable and safely conformable local hook baseline for staged formatting, package ordering, and Conventional Commit validation, with the Harness proving the contract end to end.

## Discussion

Conventional Commit validation belongs in `commit-msg`, not `pre-commit`, because the message does not yet exist during the earlier hook. The pre-commit baseline should check rather than silently rewrite package manifests: lint-staged may format selected content, then Syncpack reports any remaining manifest drift. Hooks provide immediate local feedback, while the engineering audit and CI remain authoritative because Git permits deliberate `--no-verify` bypass and repositories may not have installed dependencies yet.
