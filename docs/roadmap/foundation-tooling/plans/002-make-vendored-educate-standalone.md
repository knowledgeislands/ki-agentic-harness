---
id: '002'
title: Make vendored EDUCATE operations standalone and dispatchable
status: open
roadmap: foundation-tooling/make-vendored-educate-operations-standalone-and-dispatchable
blocks: foundation-tooling/003
blocked-by: foundation-tooling/001
---

## Context

Every governed target should be able to run a selected skill's EDUCATE operation from its own local educator payload, without requiring a harness checkout or treating bootstrap's whole-set re-sync operation as that skill's EDUCATE implementation.

`ki-educate` must therefore distinguish target-wide re-bootstrap from a target-local, selected per-skill EDUCATE dispatch.

EDUCATE is a mechanical writer, but it is not a checker. Its payload belongs in the sibling `.ki-meta/educators/` functional area: `bootstrap` remains the name of the whole-set publication engine, while `updaters` is too broad because CONFORM and other future writers also update state.

## Current state

Skills declare EDUCATE as a vendorable mode, but bootstrap does not consistently copy a standalone EDUCATE payload and the target-local `ki-educate` surface does not dispatch it.

The current no-skill meaning must remain a deliberate whole-set bootstrap action, while a named skill must run only that skill's locally vendored EDUCATE payload.

`ki-skills` validates the authored governance-skill shape and `ki-bootstrap` resolves and publishes declared coverage, but `ki-repo` currently treats `.ki-config.toml` coverage mainly as table presence. The config owner does not yet assert the complete project-local contract that every declared governance skill supplies EDUCATE, AUDIT, and CONFORM.

Plans 003–005 intentionally remain provisional until this layout and dispatch contract have landed and supplied real implementation evidence for a planning refresh.

## Steps

1. Define the target-local layout and vocabulary: `.ki-meta/educators/<skill>/` holds standalone per-skill EDUCATE payloads and their declared local dependencies; `.ki-meta/checkers/` remains checker-only; `bootstrap` names the whole-set publication engine rather than a per-skill payload directory; and the generic `updaters` name is not introduced.
2. Define the `ki-educate` dispatch contract: no skill name invokes the whole-set bootstrap engine; one safe skill name dispatches `.ki-meta/educators/<skill>/educate.ts`; unknown, absent, or unsafe payloads fail clearly without writing.
3. Extend bootstrap manifests and publication so every selected governance skill with an EDUCATE payload vendors its standalone implementation and any declared local educator dependencies.
4. Establish the three-layer completeness invariant. `ki-skills` checks that every authored governance skill exposes the universal source shape; `ki-bootstrap` refuses publication unless every resolved governance skill supplies its declared EDUCATE/AUDIT/CONFORM payloads; and `ki-repo` checks each project-local governance root declared in `.ki-config.toml` against canonical or manifest metadata for that complete contract without interpreting another skill's configuration keys.
5. Make an incomplete or unresolvable declared governance skill a config-level failure with a concrete repair route, rather than silently publishing a partial local skill. Keep process skills such as `ki-next`, `ki-plan`, and `ki-recap` outside `.ki-config.toml` under the current global-install contract; if project-local process skills are introduced later, give them a separate declaration rule rather than weakening the governance invariant.
6. Remove harness-relative seed delegation from copied EDUCATE payloads. Keep source `educate.ts` thin where appropriate, but ensure the copied target-local version has everything required to run from the target without model intervention.
7. Update aggregate wrappers, HELP, derived scripts, standards, guides, config-contract documentation, and tests to document the two dispatch paths, the sibling functional-area boundary, the three-layer completeness assertion, and explicit write/dry-run semantics.
8. Test a fresh target after removing the harness source path and runtime skill installations: per-skill EDUCATE remains runnable from `.ki-meta/educators/`, while no-skill EDUCATE invokes only the documented whole-set bootstrap path. Cover missing EDUCATE, AUDIT, and CONFORM metadata or payloads independently, plus an unsupported process-skill config declaration.
9. Re-vendor the harness, run focused bootstrap, `ki-repo`, `ki-skills`, and entrypoint tests, then run `bun run test` and `bun run ki:audit` sequentially.
10. Re-bootstrap representative consumer repositories and verify both target-local per-skill dispatch and whole-set bootstrap according to their selected skills.
11. Before closing this plan, re-read the delivered checker/educator layout and refresh plans 003–005 with the conventions, file paths, dependencies, and lessons now established; run the roadmap audit and commit that planning refresh before 003 starts.

## Files touched

- `skills/keystone/ki-bootstrap/scripts/`
- `skills/keystone/ki-repo/` config contract, rubric, checker, and tests
- `skills/general-governance/ki-skills/` governance-skill source-shape contract and tests
- Governance skills' `scripts/educate.ts` payloads and local educator dependencies
- `.ki-meta/bin/ki-educate`, aggregate wrappers, and generated manifests
- `skills/**/SKILL.md`, references, guides, and tests describing EDUCATE
- Representative consumer repositories' generated checker and educator payloads

## Verify

- `./.ki-meta/bin/ki-educate <selected-skill>` runs a local standalone payload from `.ki-meta/educators/<selected-skill>/` with no model, runtime skill installation, or harness checkout available.
- `./.ki-meta/bin/ki-educate` retains the documented whole-set bootstrap behaviour.
- Unselected, unknown, malformed, and unsafe skill selections fail closed and write nothing.
- Every selected governance skill declaring EDUCATE has a vendored local payload under `.ki-meta/educators/`, and `.ki-meta/checkers/` contains none.
- Every governance root declared through `.ki-config.toml` resolves to project-local EDUCATE, AUDIT, and CONFORM capabilities; `ki-repo` reports a missing capability as a config-contract failure, `ki-skills` guards the canonical source, and `ki-bootstrap` refuses a partial publication.
- Current process skills remain globally installed and are not accepted as `.ki-config.toml` governance roots.
- Plans 003–005 have been reviewed and updated against the delivered 001–002 implementation before this plan closes.
- Harness and representative consumer test/audit gates pass sequentially.

## Dependencies / blocks

Blocked by `foundation-tooling/001`, which establishes the checker-only functional area and sibling-area extension model.

It blocks `foundation-tooling/003`; the final step is a mandatory planning refresh for 003–005 rather than permission to execute their current provisional text unchanged.
