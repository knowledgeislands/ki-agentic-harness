---
id: '001'
title: Codify the self-governing checker-contract root
status: in-progress
roadmap: governance-consistency/codify-the-self-governing-checker-contract-root
blocks: foundation-tooling/003
blocked-by: —
---

## Context

`ki-skills` owns the reusable checker-report contract, but it must remain a self-governing root of that contract rather than depending on a copy of itself.

The proposed report migration also needs a controlled way to place an implementation module inside another skill's local checker payload without permitting an import from a sibling skill directory.

## Current state

Skills currently compose at the policy level by running sibling modes in sequence, and their checkers must be valid when installed alone.

The checker import boundary now enforces that a script can import only within its own `scripts/` directory, but no decision or declaration model yet defines how a provider's copied support module reaches that local directory.

## Steps

1. [ ] Add a governance Decision Record that preserves standalone skills and composition while defining the narrow copied-support exception: a declared provider module is materialised under the dependent checker's own `scripts/vendored/<provider>/` directory before execution; no source or vendored checker imports a sibling path.
2. [ ] Add as-built feature requirements for the checker-contract root and the local copied-support boundary, with verification hooks that prove `ki-skills` runs from its own shipped files and has no support dependency on itself.
3. [ ] Update the `ki-skills` standard and rubric so the mechanical import rule covers all local script modules and the declared-support exception is constrained to the approved local namespace.
4. [ ] Add focused tests for the root's self-contained execution, support declaration resolution, copied-module layout, and rejection of a direct cross-skill or escaping import.
5. [ ] Update bootstrap only as needed to prove the declaration closure is copied into both source-harness and `.ki-meta` payloads; re-vendor affected checkers and run focused tests, then the full test and audit gates.
6. [ ] Reconcile foundation-tooling/003 with the approved decision and remove any draft contract wording that has become stale; leave the report migration in progress only when its dependency is demonstrably satisfied.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-SKILLS-012-*.md` and `docs/decisions/README.md`
- `docs/features/governance.md` and `docs/features/index.md`
- `skills/general-governance/ki-skills/`
- `skills/keystone/ki-bootstrap/`
- `docs/roadmap/foundation-tooling/plans/003-enforce-checker-json-contract.md`
- Generated `.ki-meta/` payloads after source changes

## Verify

- `ki-skills` executes its checker contract from its own shipped files without a support dependency on itself.
- A declared support module is copied under the dependent skill's local vendored namespace in the source harness and `.ki-meta` payload, and it imports no path outside that local scripts directory.
- Direct cross-skill imports and escaping imports fail mechanically.
- `bun run ki:skills:audit`, `bun run test`, and `bun run ki:audit` pass sequentially.

## Dependencies / blocks

This plan unblocks `foundation-tooling/003`.

It does not rename `.ki-meta/skills`; that separate migration remains after the checker-report migration.
