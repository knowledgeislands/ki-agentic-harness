---
id: KI-HARNESS-GOV-059
area: GOV
title: Normalise binding comparisons
theme: governance-consistency
horizon: next
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-13T16:20:31Z
updated_at: 2026-09-13T16:36:35Z
---

## Goal

Make Claude and Codex binding audits distinguish equivalent rendered definitions from genuine missing or stale registrations.

## Context

The `KI-HARNESS-RTP-011` review found no missing registrations. Claude Desktop rendered every targeted bare `node` command through the deliberately stable mise shim, while its audit compared against the currently resolved versioned executable. Codex rendered the same stable shim, expanded `~/` arguments, and resolved secret references, while its audit compared the live TOML directly against the unrendered portable values. These expected transformations produce persistent false drift warnings.

## Boundary

Do not change canonical binding data, runtime configuration, renderer output, client targeting, secret values, activation claims, or runtime-health claims. Do not make executable equivalence depend on running an arbitrary configured command.

## Current state

The Claude comparator resolves a canonical bare executable through the current shell path, which rejects the deliberately stable mise `node` shim. The Codex comparator compares raw portable command, argument, and secret-reference values directly with their rendered native representation. Both behaviours produce persistent false warnings while every targeted registration remains present.

## Steps

- [ ] Define the safe accepted projections for bare commands, the deterministic mise `node` shim, home-relative arguments, and rendered secret references.
- [ ] Apply those semantics to Claude and Codex comparison without changing renderers or executing configured commands.
- [ ] Add positive fixtures for accepted projections and negative fixtures for wrong paths, arguments, literal values, missing or extra environment keys, and empty secret values.
- [ ] Preserve exact URL comparison, unrelated native entries, activation boundaries, and runtime-health boundaries.

## Files touched

- `skills/environment/ki-binding-claude/scripts/rubric/contexts/claude.ts`
- `skills/environment/ki-binding-claude/scripts/rubric/items/index.test.ts`
- `skills/environment/ki-binding-claude/references/standards-claude-binding.md`
- `skills/environment/ki-binding-codex/scripts/rubric/contexts/codex.ts`
- `skills/environment/ki-binding-codex/scripts/rubric/items/index.test.ts`
- `skills/environment/ki-binding-codex/references/standards-codex-binding.md`
- `docs/roadmap/KI-HARNESS-GOV-059-normalise-binding-comparisons.md`

## Verify

- Focused `ki-binding-claude` and `ki-binding-codex` rubric tests pass.
- Current `ki-binding-claude` and `ki-binding-codex` audits clear the two comparator warnings without runtime writes.
- `bun run test` and `bunx tsc --noEmit` pass.
- `ki repo audit --skill ki-skills --repo .`, `ki repo audit --skill ki-authoring --repo .`, and `ki repo audit --skill ki-work-roadmap --repo .` pass.

## Dependencies / blocks

No dependency blocks delivery. `KI-HARNESS-RTP-011` supplies accepted local evidence, and the existing renderer contracts define every allowed projection. A structural audit deliberately cannot prove that a non-empty rendered secret came from the correct secret reference.

## Documentation impact

### Decision Records

No Decision Record is required because the renderer transformations and secret-value boundary are already accepted.

### Specifications

No behaviour-level product contract changes.

### Guides

No human-facing guide changes.

### Roadmap

Completing this item resolves the comparator follow-up created by `KI-HARNESS-RTP-011`.

## Discussion

### Comparison semantics

Define non-secret semantic comparison consistently across Claude and Codex: recognise a safe absolute executable projection of a canonical bare command, expand home-relative arguments, and treat an `op://` source as matching a non-empty rendered target value without exposing it.

### Verification focus

Add focused fixtures for missing registrations, genuinely stale arguments or environment keys, bare-command projections, home expansion, rendered secret references, URL definitions, and unrelated native entries. Preserve each adapter's existing ownership boundary and diagnostic-only audit behaviour.
