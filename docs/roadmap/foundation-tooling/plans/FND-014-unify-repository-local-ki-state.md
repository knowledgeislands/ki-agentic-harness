---
id: 'FND-014'
title: Unify repository-local KI state under .ki
status: in-progress
roadmap: foundation-tooling/unify-repository-local-ki-state-under-ki
blocks: FND-016
blocked-by: —
---

## Context

FND-008 established one authored repository-local `ki-self` source and runtime projections, while bootstrap owns generated `.ki-meta/` state.

The two top-level names express different ownership but scatter one Knowledge Islands footprint across the repository.

Adopt `.ki/` as the single repository-local KI root, aligned with the established repository namespace. `.ki/self/skill/` holds authored local governance; all bootstrap-owned generated state sits directly in the named `.ki/` children below. A nested `meta/` directory adds no ownership distinction and is not part of the target. `kisle` remains the end-user command name, not the repository directory name.

The runtime skill remains named `ki-self`; this is a filesystem-layout migration, not a renamed skill or a change to consumer payload portability.

## Current state

`.ki-self/SKILL.md` is tracked authored state, and `.agents/skills/ki-self` and `.claude/skills/ki-self` link to it.

`.ki-meta/` is a regular, manifest-proven generated tree containing bootstrap, checker, educator, and command output; CLEAN has explicit rules for it.

Bootstrap, CLEAN, checkers, tests, package scripts, documentation, fixtures, and generated payloads refer to the two current top-level paths.

### Target tree

```text
.ki/                                      # all repository-local Knowledge Islands state
├── manifest.json                         # generated ownership/integrity record †
├── self/
│   └── skill/
│       └── SKILL.md                      # committed authored ki-self source
├── bin/                                  # generated package.json-free commands
│   ├── aggregate.ts
│   ├── ki-audit
│   ├── ki-conform
│   ├── ki-educate
│   └── ki-help
└── bootstrap/                            # generated bootstrap-owned material
    ├── agents/                           # retained source catalogue for the current set
    ├── skills/                           # retained source catalogue for the current set ‡
    ├── checkers/                         # standalone AUDIT / CONFORM payloads + HELP
    └── educators/                        # self-contained per-skill EDUCATE payloads
```

† Follow up during the design: confirm whether one manifest must hash every generated file, or whether a smaller ownership record can still make CLEAN fail closed.

‡ Follow up during the design: prove the minimum retained source needed for whole-set EDUCATE; do not preserve a complete copied skill tree merely because the current layout does.

`bootstrap/checkers/<skill>/` retains its `scripts/`, `references/`, and `help.md` children; `bootstrap/educators/<skill>/` retains its launcher, educator module, and any self-contained `skill/` snapshot. No other persistent generated directory is currently required. Private transaction directories may exist briefly during a guarded write, but must be cleaned and must never become part of the owned target tree.

### Settled design points

- `manifest.json` continues to hash every generated regular file. CLEAN needs that complete inventory to refuse altered or unfamiliar content safely; a smaller ownership record cannot provide the same proof.
- `bootstrap/skills/` retains complete source trees only for `ki-bootstrap` and the currently resolved governed set. Whole-set EDUCATE uses those trees to rebuild that exact set; unselected skills do not belong in the retained catalogue.
- Generated runtime payload copies retain an embedded ownership marker because CLEAN must prove each copy independently. Its naming and exact location must no longer imply a second repository-level `.ki-meta/` root; source-skill-local `.ki-meta/` implementation state is out of scope.

## Steps

1. ✓ Inventory every read, write, manifest entry, runtime projection, guide, fixture, and Git rule that refers to `.ki-self` or `.ki-meta`. Confirm the target tree above: `.ki/self/skill/` is committed authored content; `.ki/manifest.json`, `.ki/bin/`, and `.ki/bootstrap/` are generated content; no `.ki/meta/` layer or other `.ki/` child gains implicit ownership. Decide the two marked follow-ups before implementation.

2. Design the one-way current-state migration. It must relocate a proven canonical `.ki-self/` source and rebase its runtime links, generate or safely reconcile the direct `.ki/` generated children, preserve unproven, altered, or unsafe old paths for manual resolution, and remove old paths only after the new footprint is validated. Do not retain runtime fallbacks, dual discovery paths, or an alternate legacy configuration after migration.

3. Update bootstrap publication, manifesting, audit, EDUCATE, CONFORM, CLEAN, recovery, and zero-install launchers to use the new tree consistently. Keep generated output regular and manifest-owned; keep local `ki-self` projections relative, contained links; preserve normal consumer copies and harness-local dependency-link rules.

4. Update all source and generated references: package scripts, checker/educator layouts, documentation, examples, safety checks, fixtures, and Git ignore behaviour. Re-vendor affected coverage-scoped payloads, remove obsolete `.ki-self` / `.ki-meta` paths and dead migration code, and make the repository itself conform to the final layout.

5. Add focused migration and safety coverage: clean current migration, absent source, altered source, unsafe or symlinked old paths, stale runtime links, repeat and dry-run behaviour, CLEAN then EDUCATE recovery, old-path removal only after proof, and a repository without a harness `skills/` tree. Confirm that no case deletes or overwrites unproven content.

6. Run the serial repository gates and a manual lifecycle walkthrough from an old footprint through migration, audit, CLEAN, and EDUCATE. Record any cross-repository or user-level implications as a separate `kisle` CLI follow-up rather than expanding this repository-layout migration.

## Files touched

- `.ki-self/`, `.ki-meta/`, and the new direct `.ki/` footprint — current-state migration in this harness.
- `skills/keystone/ki-bootstrap/` — bootstrap layout, manifests, publication, CLEAN, tests, and generated payload refresh.
- `skills/repo-structure/ki-harness/` and repository-local governance — source/projection contract where needed.
- `.ki-config.toml`, package scripts, `.gitignore`, runtime links, documentation, examples, and fixtures that name the legacy paths.
- `docs/decisions/` — only if the settled ownership or lifecycle boundary needs a durable decision update.

## Verify

1. A migrated repository has one `.ki/` root with a regular committed `.ki/self/skill/SKILL.md`, a regular `.ki/manifest.json`, `.ki/bin/`, and `.ki/bootstrap/{agents,skills,checkers,educators}/` generated tree; no proven legacy `.ki-self/` or `.ki-meta/` path remains.
2. Each declared runtime's `ki-self` projection is a contained relative link to `.ki/self/skill/`; ordinary runtime skill payloads and external consumers remain self-contained copies.
3. Audit, EDUCATE, CONFORM, CLEAN, recovery, and zero-install entrypoints operate through `.ki/` without a legacy fallback.
4. Migration, dry-run, repeat, altered-content, unsafe-path, stale-link, CLEAN-then-EDUCATE, and non-harness fixtures pass without deleting unproven content.
5. `bun run test` passes.
6. `bun run ki:audit` passes after the test suite completes.
7. Manual inspection confirms no active source, generated artifact, guide, or package script still relies on `.ki-self` or `.ki-meta`.

## Dependencies / blocks

FND-008 is complete and supplies the one-source/runtime-projection model this migration relocates.

Coordinate with the existing CLEAN and `kisle` CLI work, but do not block this plan on their separate lifecycle or distribution decisions.
