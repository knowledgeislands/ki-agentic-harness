---
id: 'FND-014'
title: Unify repository-local KI state under .kisle
status: open
roadmap: foundation-tooling/unify-repository-local-ki-state-under-kisle
blocks: —
blocked-by: —
---

## Context

FND-008 established one authored repository-local `ki-self` source and runtime projections, while bootstrap owns generated `.ki-meta/` state.

The two top-level names express different ownership but scatter one Knowledge Islands footprint across the repository.

Adopt `.kisle/` as the single repository-local KI root, aligned with the end-user command name: `.kisle/self/skill/` holds authored local governance and `.kisle/meta/` holds removable generated bootstrap state.

The runtime skill remains named `ki-self`; this is a filesystem-layout migration, not a renamed skill or a change to consumer payload portability.

## Current state

`.ki-self/SKILL.md` is tracked authored state, and `.agents/skills/ki-self` and `.claude/skills/ki-self` link to it.

`.ki-meta/` is a regular, manifest-proven generated tree containing bootstrap, checker, educator, and command output; CLEAN has explicit rules for it.

Bootstrap, CLEAN, checkers, tests, package scripts, documentation, fixtures, and generated payloads refer to the two current top-level paths.

## Steps

1. Inventory every read, write, manifest entry, runtime projection, guide, fixture, and Git rule that refers to `.ki-self` or `.ki-meta`. Define the exact target tree, ownership, and deletion rule: `.kisle/self/skill/` is committed authored content and `.kisle/meta/` is generated content; no other `.kisle/` child gains implicit ownership.
2. Design the one-way current-state migration. It must relocate a proven canonical `.ki-self/` source and rebase its runtime links, generate or safely reconcile `.kisle/meta/`, preserve unproven, altered, or unsafe old paths for manual resolution, and remove old paths only after the new footprint is validated. Do not retain runtime fallbacks, dual discovery paths, or an alternate legacy configuration after migration.
3. Update bootstrap publication, manifesting, audit, EDUCATE, CONFORM, CLEAN, recovery, and zero-install launchers to use the new root consistently. Keep generated output regular and manifest-owned; keep local `ki-self` projections relative, contained links; preserve normal consumer copies and harness-local dependency-link rules.
4. Update all source and generated references: package scripts, checker/educator layouts, documentation, examples, safety checks, fixtures, and Git ignore behaviour. Re-vendor affected coverage-scoped payloads, remove obsolete `.ki-self` / `.ki-meta` paths and dead migration code, and make the repository itself conform to the final layout.
5. Add focused migration and safety coverage: clean current migration, absent source, altered source, unsafe or symlinked old paths, stale runtime links, repeat and dry-run behaviour, CLEAN then EDUCATE recovery, old-path removal only after proof, and a repository without a harness `skills/` tree. Confirm that no case deletes or overwrites unproven content.
6. Run the serial repository gates and a manual lifecycle walkthrough from an old footprint through migration, audit, CLEAN, and EDUCATE. Record any cross-repository or user-level implications as a separate `kisle` CLI follow-up rather than expanding this repository-layout migration.

## Files touched

- `.ki-self/`, `.ki-meta/`, and the new `.kisle/` footprint — current-state migration in this harness.
- `skills/keystone/ki-bootstrap/` — bootstrap layout, manifests, publication, CLEAN, tests, and generated payload refresh.
- `skills/repo-structure/ki-harness/` and repository-local governance — source/projection contract where needed.
- `.ki-config.toml`, package scripts, `.gitignore`, runtime links, documentation, examples, and fixtures that name the legacy paths.
- `docs/decisions/` — only if the settled ownership or lifecycle boundary needs a durable decision update.

## Verify

1. A migrated repository has one `.kisle/` root with a regular committed `.kisle/self/skill/SKILL.md` and a regular manifest-owned `.kisle/meta/` tree; no proven legacy `.ki-self/` or `.ki-meta/` path remains.
2. Each declared runtime's `ki-self` projection is a contained relative link to `.kisle/self/skill/`; ordinary runtime skill payloads and external consumers remain self-contained copies.
3. Audit, EDUCATE, CONFORM, CLEAN, recovery, and zero-install entrypoints operate through `.kisle/` without a legacy fallback.
4. Migration, dry-run, repeat, altered-content, unsafe-path, stale-link, CLEAN-then-EDUCATE, and non-harness fixtures pass without deleting unproven content.
5. `bun run test` passes.
6. `bun run ki:audit` passes after the test suite completes.
7. Manual inspection confirms no active source, generated artifact, guide, or package script still relies on `.ki-self` or `.ki-meta`.

## Dependencies / blocks

FND-008 is complete and supplies the one-source/runtime-projection model this migration relocates.

Coordinate with the existing CLEAN and `kisle` CLI work, but do not block this plan on their separate lifecycle or distribution decisions.
