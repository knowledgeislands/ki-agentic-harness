---
id: KI-HARNESS-GOV-077
area: GOV
title: Standardise common Git hooks
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-19T08:51:33Z
updated_at: 2026-09-19T08:51:33Z
---

# Standardise Common Git Hooks

## Goal

Give every KI-governed `package.json` repository the same locally enforced Git baseline: staged-file formatting, canonical package ordering, and Conventional Commit validation, with repository audit and CI as the authoritative fallback.

## Context

The engineering standard already requires Husky, lint-staged, Syncpack, and a `prepare` script, while the Git standard already requires a six-type Conventional Commit vocabulary. The current common hook contract runs lint-staged but does not run Syncpack, and no deterministic `commit-msg` binding enforces the existing message policy. Consequently, repositories can declare all required tools yet wire different local commit behaviour.

## Boundary

Standardise package-backed repository hooks without moving Git policy into engineering or making hooks the sole authority. `ki-git` continues to own commit-message syntax; `ki-engineering` owns Husky, Commitlint and Syncpack dependencies, hook wiring, audit evidence, and bounded conformance. Preserve repository-specific pre-commit checks after the common baseline. Do not introduce branch protection, rewrite existing history, validate subjective imperative mood mechanically, or claim Husky cannot be bypassed.

## Current state

Selected and approved for immediate delivery. The Harness pre-commit hook begins with lint-staged and then runs repository-specific staged checks. Syncpack is enforced only by the engineering audit. There is no `.husky/commit-msg` or Commitlint configuration, and `ki-git` explicitly records that mechanical commit-message enforcement does not yet exist.

## Steps

- [ ] Define the common hook lifecycle and ownership split in the Git and engineering standards.
- [ ] Require current Commitlint dependencies alongside the existing Husky, lint-staged, and Syncpack toolchain.
- [ ] Audit and conform a common pre-commit prefix that runs lint-staged followed by check-only Syncpack while preserving repository-specific checks.
- [ ] Audit and conform a Commitlint-backed `commit-msg` hook and KI Conventional Commit configuration.
- [ ] Add focused fixtures for compliant, missing, drifted, and safely conformed hook surfaces.
- [ ] Apply the standard to the Harness and run focused tests, full tests, TypeScript, Biome, skill, engineering, Git, roadmap, and authoring audits.

## Files touched

- `package.json`
- `bun.lock`
- `.husky/pre-commit`
- `.husky/commit-msg`
- `commitlint.config.mjs`
- `skills/governance/ki-git/`
- `skills/governance/ki-engineering/`
- `hooks/pre-commit.test.ts`
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

## Discussion

Conventional Commit validation belongs in `commit-msg`, not `pre-commit`, because the message does not yet exist during the earlier hook. The pre-commit baseline should check rather than silently rewrite package manifests: lint-staged may format selected content, then Syncpack reports any remaining manifest drift. Hooks provide immediate local feedback, while the engineering audit and CI remain authoritative because Git permits deliberate `--no-verify` bypass and repositories may not have installed dependencies yet.
