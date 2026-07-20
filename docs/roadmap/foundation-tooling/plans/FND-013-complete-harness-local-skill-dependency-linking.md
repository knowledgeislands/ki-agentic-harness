---
id: 'FND-013'
title: Complete harness-local skill dependency linking
status: open
roadmap: foundation-tooling/complete-harness-local-skill-dependency-linking
blocks: —
blocked-by: —
---

## Context

Harness-local links avoid duplicate source modules and let a skill use the canonical implementation authored beside it.

That convenience must not turn into an implicit dependency on another checkout: an ordinary repository, an installed harness payload, and a different harness repository need portable copied content.

The existing implementation already has related mechanisms in the runtime project publisher and the shared-module synchroniser, while `.ki-meta/` deliberately remains a manifest-owned portable copy surface.

This plan makes the provenance boundary explicit, verifies the complete current-harness behaviour, and repairs only the gaps found.

## Current state

`project-skill-publisher.ts` selects development links for a target declaring `[ki-harness]` and resolves their sources from that target's own `skills/` tree.

`sync-shared-modules.ts` similarly links declared `ki-shared-dependencies` only when its target is a source harness; other targets receive copies.

The contract is distributed between `ki-harness`, `ki-bootstrap`, and tests, and it has not yet been audited as one provenance model covering same-checkout, external-harness, consumer, runtime, source-vendored, and generated snapshot cases.

## Steps

1. Trace every link and copy path used for runtime skill publication and source-tree shared modules, then define the minimal provenance rule: a link is permitted only when the provider resolves inside the physical `skills/` tree of the current target harness; never discover or link to a separate repository merely because it declares `[ki-harness]` or is locally reachable.
2. Reconcile the `ki-harness` workflow contract with `ki-bootstrap`'s publication, synchronisation, CLEAN, and manifest contracts. State which owner decides eligibility, which owner performs the guarded filesystem transaction, and why `.ki-meta/` checker and educator snapshots and ordinary consumer payloads remain copied. Update an ADR only if the settled boundary differs materially from ADR-KI-HARNESS-008.
3. Make the smallest implementation changes required to enforce that rule consistently for runtime projections and declared `scripts/vendored/` modules. Preserve relative, contained links; fail closed for stale regular files, dangling or escaping links, changed payloads, and unsafe parents; do not add cross-checkout discovery or a compatibility path.
4. Add focused fixtures for a source harness whose provider and consumer are in the same checkout, an ordinary consumer repository, and a separate harness checkout. Prove that only the first receives links; prove runtime copies are dereferenced and remain usable after their temporary source disappears; prove source edits reach every intended same-harness reference; and prove generated `.ki-meta/` files remain regular manifest-verified copies.
5. Re-vendor any affected coverage-scoped checker payloads, regenerate derived references, and run focused bootstrap/harness tests followed by serial repository tests and aggregate audit. Record any non-implementable cross-repository development workflow as a distinct follow-up rather than weakening the portable default.

## Files touched

- `skills/repo-structure/ki-harness/` — harness-local developer workflow, rubric, and focused tests if its eligibility contract changes.
- `skills/keystone/ki-bootstrap/references/` — publication, copy, CLEAN, and generated-snapshot boundary.
- `skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/` — project publisher, shared-module synchroniser, resolver, and focused fixtures.
- `docs/decisions/ADR-KI-HARNESS-008-vendored-cross-skill-scripts.md` — only if the settled ownership boundary changes.
- `.ki-meta/` generated bootstrap/checker/educator payloads — refreshed only when their coverage-scoped sources change.

## Verify

1. Focused `project-skill-publisher`, `sync-shared-modules`, `resolve`, and bootstrap parity/safety tests pass, including same-checkout, external-checkout, ordinary-copy, source-edit, and generated-copy fixtures.
2. `bun skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts .` succeeds after any coverage-scoped source change and leaves required generated output current.
3. `bun run test` passes.
4. `bun run ki:audit` passes after the test suite completes.
5. Manual inspection confirms source-harness runtime and `scripts/vendored/` links are relative and contained, while `.ki-meta/` snapshots are regular files.

## Dependencies / blocks

This is independent of the separate `ki-self` footprint and CLEAN lifecycle plans.

It may identify a future explicit cross-harness development-link workflow, but that is intentionally out of scope unless the current portable-copy boundary cannot meet a concrete supported use case.
