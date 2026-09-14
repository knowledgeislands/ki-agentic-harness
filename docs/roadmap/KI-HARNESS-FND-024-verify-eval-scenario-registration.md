---
id: KI-HARNESS-FND-024
area: FND
title: Verify eval scenario registration
theme: foundation-tooling
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 193d82ab30cf9a262698ca83caf7ee124106f023
created_at: 2026-09-14T19:26:00Z
updated_at: 2026-09-14T20:08:00Z
---

# Verify eval scenario registration

## Goal

Detect scenario modules that are missing from the static evaluation Harness registry without invoking live models.

## Context

The registry in `evals/harness.ts` was manually updated in six commits since 2026-08-11. All 26 current scenario modules are registered, but the contribution guide requires two separate edits and an omitted registry entry can silently orphan a scenario.

## Boundary

Prefer a deterministic coverage test over dynamic loading. The check must not invoke Claude, other model providers, credentials, network access, or scenario side effects. It should diagnose orphan modules, duplicate imports, and duplicate scenario identities without writing files.

## Current state

In progress from immutable baseline `193d82ab30cf9a262698ca83caf7ee124106f023`. `evals/harness.ts` statically imports and spreads 26 scenario modules. The repository test script searches only `skills` and `hooks`, so a focused `evals/registry.test.ts` also requires adding `./evals` to the existing test roots. Scenario identities are literal object fields and can be inspected without importing the live Harness.

## Steps

- [ ] Add a deterministic registry test that enumerates physical `evals/scenarios/*.ts` modules.
- [ ] Parse the Harness's static scenario imports and `ALL` spreads, reporting missing, repeated, or non-physical registrations.
- [ ] Parse literal scenario identities and reject duplicates without importing or executing the live evaluation Harness.
- [ ] Add `./evals` to the repository's existing isolated Bun test roots.
- [ ] Update the eval contribution guide to state that deterministic registry coverage owns the two-point edit.
- [ ] Run the focused test, full suite, TypeScript, engineering, authoring, and roadmap gates.

## Files touched

- `evals/registry.test.ts`
- `evals/README.md`
- `package.json`
- This roadmap item and batch evidence.

## Verify

- `bun test --isolate evals/registry.test.ts`
- `bun run test`
- `bunx tsc --noEmit`
- `ki repo audit --skill ki-engineering --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `git diff --check`

## Dependencies / blocks

None. All required inputs are repository-local and deterministic.

## Documentation impact

### Decision Records

No Decision Record change. This adds local regression coverage without changing evaluation semantics.

### Specifications

No Specification change. The static registry remains the enacted Harness design.

### Guides

Update `evals/README.md` so contributors know the second registration edit is checked mechanically.

### Roadmap

Keep this record as implementation and review evidence. Any proposal to replace the static registry with dynamic loading remains separate work.

## Discussion

This is a low-priority Triage proposal. Readiness should establish module naming exceptions, the canonical registry surface, and whether the check belongs to the evaluation Harness or `ki-repo-harness`.
