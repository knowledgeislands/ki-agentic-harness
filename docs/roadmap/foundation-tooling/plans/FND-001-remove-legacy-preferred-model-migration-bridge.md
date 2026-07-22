---
id: 'FND-001'
title: Remove the legacy preferred_model migration bridge in ki-tokenomics
status: ready
roadmap: foundation-tooling/remove-the-legacy-preferredmodel-migration-bridge-in-ki-tokenomics
blocks: —
blocked-by: —
---

## Context

`ADR-KI-HARNESS-009` made portable `preferred_model_type` the tokenomics configuration contract and retained `preferred_model` only as a loud temporary migration bridge.

Once the known fleet has migrated, preserving the old parser, alias map, and migration-specific diagnostics adds avoidable legacy behaviour to the portable contract.

## Current state

`ki-tokenomics` still parses `preferred_model` in its audit and conform engines, maps its Claude aliases to portable types, and emits migration guidance.

The harness configuration uses `preferred_model_type`, but removal must not assume that sibling Knowledge Islands repositories have already migrated.

## Steps

1. Define and record the available fleet scope by discovering sibling Knowledge Islands git worktrees with a real `.ki-config.toml`, then search their configuration files for the exact legacy key. Stop the removal and report the remaining migration targets if any declaration or required repository cannot be verified.
2. Remove the legacy-key parsing branch, alias-to-type mapping, migration-only result state, diagnostics, fixtures, and focused tests from the tokenomics audit and conform engines. Preserve all validation, defaults, and diagnostics for `preferred_model_type` and `model_tier_bindings`.
3. Update `ADR-KI-HARNESS-009` as the living record and revise tokenomics standards, examples, and source notes so they describe the current portable contract without presenting the retired bridge as available.
4. Search the source, tests, documentation, and governed configuration for remaining operational `preferred_model` references. Retain only explicitly historical material that still communicates the decision accurately, or remove it where the living-record rule requires current wording.
5. Run focused tokenomics tests and audits, then serial repository verification. Record the verified sibling-repository scope and zero-legacy-key evidence in the acceptance packet.

## Files touched

- `skills/environment/ki-tokenomics/scripts/rubric/contexts/audit-engine.ts`
- `skills/environment/ki-tokenomics/scripts/rubric/contexts/conform-engine.ts`
- focused tokenomics fixtures and tests covering tokenomics configuration parsing and reporting
- `skills/environment/ki-tokenomics/references/standards.md`
- `skills/environment/ki-tokenomics/references/exemplars.md`
- `skills/environment/ki-tokenomics/references/sources.md`
- `docs/decisions/ADR-KI-HARNESS-009-portable-model-types-not-vendor-model-names-in-governance-config.md`

## Verify

1. The recorded available fleet scope contains no real `.ki-config.toml` with a `preferred_model` key.
2. Tokenomics accepts and validates `preferred_model_type` and `model_tier_bindings` without importing or reporting the legacy key.
3. No live standard, example, checker diagnostic, or test fixture presents the bridge as supported.
4. Run focused tokenomics tests, `bun run ki:tokenomics:audit`, `bun run test`, and `bun run ki:audit` serially.

## Dependencies / blocks

The plan is blocked only by evidence that a known sibling repository still uses the legacy key.

If that evidence appears, retain the migration bridge and create or link the appropriate cross-repository migration handoff before resuming this plan.
