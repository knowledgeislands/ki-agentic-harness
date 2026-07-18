---
id: '001'
title: Rename the vendored mechanical surface to .ki-meta/checkers
status: open
roadmap: foundation-tooling/rename-the-vendored-mechanical-surface-to-ki-meta-checkers
blocks: foundation-tooling/002
blocked-by: —
---

## Context

The target-local payload under `.ki-meta/skills/` is executable checker material, not an installed runtime skill surface.

Its name currently obscures that distinction from `.claude/skills/` and `.agents/skills/`, which are runtime instruction surfaces.

Move the target-local audit/conform payload to `.ki-meta/checkers/` as one clearly bounded functional area in the single current-state layout.

Its essential contract is mechanical independence: a person or ordinary process can invoke every checker and aggregate entrypoint without an agentic model interpreting a skill or intervening in execution.

## Current state

Bootstrap, the aggregate runner, derived package scripts, generated manifests, checker references, tests, documentation, and existing consumer footprints still address `.ki-meta/skills/`.

The harness must make the new layout self-contained and re-bootstrap every affected footprint; it must not retain a permanent dual-path reader or compatibility shim.

The current catch-all directory also obscures the fact that different mechanical responsibilities need sibling functional areas. EDUCATE is not a checker and must not be placed under `.ki-meta/checkers/` by this migration.

## Steps

1. Define `.ki-meta/` as a collection of responsibility-specific mechanical functional areas: `.ki-meta/bin/` holds stable dispatch entrypoints and `.ki-meta/checkers/<skill>/` holds only AUDIT/CONFORM checker payloads and their local dependencies. Reserve sibling areas for other responsibilities; EDUCATE explicitly does not live under `checkers`.
2. Define and test the model-free execution contract: each checker and `ki-audit` / `ki-conform` aggregate runs non-interactively from ordinary shell/Bun execution with no agentic model, installed runtime skill, source harness checkout, target `package.json`, or undeclared cross-skill import.
3. Update bootstrap publication, manifest generation, aggregate dispatch, derived package-script generation, safe-write checks, and generated-surface detection to use `checkers` as the sole target-local checker directory.
4. Update every source checker, helper, fixture, test, feature definition, standard, guide, and generated exclusion that names the retired `.ki-meta/skills/` layout or conflates checkers with installed skills.
5. Make re-bootstrap replace the retired generated directory with the new generated directory atomically and safely; refuse unsafe paths rather than following them, and do not create a checker-side EDUCATE compatibility path.
6. Exercise direct checker and aggregate invocation in a stripped consumer fixture with the harness source and runtime skill installations unavailable, then run `bun run test` and `bun run ki:audit` sequentially in the harness.
7. Inventory affected consumer repositories, re-bootstrap them to the current state, and verify their aggregate and scoped checker entrypoints resolve only through `.ki-meta/checkers/` without model intervention.

## Files touched

- `skills/keystone/ki-bootstrap/scripts/`
- `skills/foundations/ki-engineering/`
- `skills/**/scripts/` and their tests where generated checker paths are named
- `.ki-meta/` generated harness payload
- `docs/features/`, `docs/guides/`, and relevant decision records
- Affected consumer repositories' generated `.ki-meta/` payloads and derived scripts

## Verify

- A freshly bootstrapped target has `.ki-meta/checkers/` and no `.ki-meta/skills/` payload directory.
- Aggregate and derived `ki:<skill>:audit` / `:conform` commands run deterministically from the checker layout without a model, runtime skill installation, target `package.json`, or harness checkout.
- `.ki-meta/checkers/` contains no EDUCATE payload; new mechanical responsibilities have an explicit sibling-area extension point rather than entering a catch-all checker directory.
- Unsafe, stale, or symlinked retired directories fail closed; a normal re-bootstrap removes only the generated retired layout.
- `bun run test` and `bun run ki:audit` pass sequentially in the harness.
- Re-bootstrapped consumer repositories have clean scoped audits with no retired path references.

## Dependencies / blocks

This is second in the agreed execution chain because all subsequent target-local operations need one unambiguous payload location.

It follows `governance-consistency/000` and blocks `foundation-tooling/002` so standalone EDUCATE is designed as a sibling functional area beside the final checker layout.
