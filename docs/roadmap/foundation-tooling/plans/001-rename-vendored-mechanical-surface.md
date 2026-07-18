---
id: '001'
title: Rename the vendored mechanical surface to .ki-meta/checkers
status: open
roadmap: foundation-tooling/rename-the-vendored-mechanical-surface-to-ki-meta-checkers
blocks: foundation-tooling/002
blocked-by: governance-consistency/000
---

## Context

The target-local payload under `.ki-meta/skills/` is executable checker material, not an installed runtime skill surface.

Its name currently obscures that distinction from `.claude/skills/` and `.agents/skills/`, which are runtime instruction surfaces.

Move the target-local mechanical payload to `.ki-meta/checkers/` as the single current-state layout.

## Current state

Bootstrap, the aggregate runner, derived package scripts, generated manifests, checker references, tests, documentation, and existing consumer footprints still address `.ki-meta/skills/`.

The harness must make the new layout self-contained and re-bootstrap every affected footprint; it must not retain a permanent dual-path reader or compatibility shim.

## Steps

1. Define the exact checker layout and ownership boundary: `.ki-meta/checkers/<skill>/` contains only vendored mechanical payloads and their local dependencies, while `.claude/skills/` and `.agents/skills/` remain runtime instruction surfaces.
2. Update bootstrap publication, manifest generation, aggregate dispatch, derived package-script generation, safe-write checks, and generated-surface detection to use `checkers` as the sole target-local payload directory.
3. Update every source checker, helper, fixture, test, feature definition, standard, guide, and generated exclusion that names the retired `.ki-meta/skills/` layout.
4. Make re-bootstrap replace the retired generated directory with the new generated directory atomically and safely; refuse unsafe paths rather than following them.
5. Re-vendor the harness, run focused bootstrap/layout tests, then run `bun run test` and `bun run ki:audit` sequentially.
6. Inventory affected consumer repositories, re-bootstrap them to the current state, and verify their aggregate and scoped checker entrypoints resolve only through `.ki-meta/checkers/`.

## Files touched

- `skills/keystone/ki-bootstrap/scripts/`
- `skills/foundations/ki-engineering/`
- `skills/**/scripts/` and their tests where generated checker paths are named
- `.ki-meta/` generated harness payload
- `docs/features/`, `docs/guides/`, and relevant decision records
- Affected consumer repositories' generated `.ki-meta/` payloads and derived scripts

## Verify

- A freshly bootstrapped target has `.ki-meta/checkers/` and no `.ki-meta/skills/` payload directory.
- Aggregate and derived `ki:<skill>:audit` / `:conform` commands run from the checker layout without a harness checkout.
- Unsafe, stale, or symlinked retired directories fail closed; a normal re-bootstrap removes only the generated retired layout.
- `bun run test` and `bun run ki:audit` pass sequentially in the harness.
- Re-bootstrapped consumer repositories have clean scoped audits with no retired path references.

## Dependencies / blocks

This is second in the agreed execution chain because all subsequent target-local operations need one unambiguous payload location.

It follows `governance-consistency/000` and blocks `foundation-tooling/002` so standalone EDUCATE is designed directly against the final checker layout.
