---
id: '001'
title: Prefix plan identifiers with stable theme codes
status: open
roadmap: governance-consistency/prefix-plan-identifiers-with-stable-theme-codes
blocks: —
blocked-by: —
---

## Context

Numeric plan ids are local to a theme, but opaque when they appear in output, discussions, and dependency references.

Each thematic roadmap needs one authored, stable, semantic code so a plan can identify itself clearly as `FND-003` rather than a bare number or a qualified directory path.

## Current state

The roadmap contract currently allocates a quoted numeric `id` within each theme, uses `<theme>/<NNN>` as the canonical reference, and names plan files `<NNN>-<slug>.md`.

There are no active plans when this work begins.

This plan is necessarily authored in the pre-migration form; its execution must migrate it with every other remaining plan reference, then delete it on completion rather than preserving a legacy exception.

## Steps

1. Define the canonical authored theme-code field in each thematic `ROADMAP.md`: uppercase, semantic, stable, and unique across the repository. Adopt `FND`, `GOV`, `OPS`, and `RTP` for the current harness themes, and define validation for missing, malformed, duplicate, or changed codes.
2. Change the roadmap standard and parser so a plan’s canonical id is `<THEME>-<NNN>` and its filename is `<THEME>-<NNN>-<slug>.md`. Replace `<theme>/<NNN>` dependency references with the code-bearing id everywhere the contract names or parses a plan.
3. Update the generated global plan index, dependency graph, root projection links, and diagnostics to render the readable identifier first while retaining the linked title and roadmap locator.
4. Update `ki-plan` lifecycle guidance and all user/developer documentation so new plans allocate the next serial within their theme code and every command, dependency, and handoff uses the new identifier.
5. Migrate all shipped fixtures, test plans, documentation examples, and any live plan files in one change. Do not retain numeric parsing, aliases, fallback lookup, or a compatibility mode; the pre-migration execution plan is renamed as part of the migration and is deleted when completed.
6. Add focused parser, conform, generated-index, dependency, duplicate-code, and migration tests. Re-run the generated projections and the full harness test and audit gates.

## Files touched

- `skills/general-governance/ki-project-roadmap/` standards, parser, audit/conform scripts, and tests
- `skills/process/ki-plan/` lifecycle guidance
- `docs/roadmap/` theme roadmaps, active plan paths, and generated index
- Root `ROADMAP.md` and affected user/developer documentation

## Verify

- Every thematic roadmap declares one valid unique code, and all four harness themes use their assigned codes.
- A new plan is named, stored, indexed, and referenced as `<THEME>-<NNN>`.
- Missing, duplicate, malformed, or legacy numeric-only ids fail the audit without a compatibility fallback.
- Generated projections and dependency graphs use the code-bearing identifiers consistently.
- `bun run test` and `bun run ki:audit` pass sequentially after conforming the repository.

## Dependencies / blocks

This work is independent of the later `ki-project-roadmap` rename, but should land first so that rename work begins against the clearer identifier contract.
