---
id: KI-HARNESS-GOV-127
area: GOV
title: Adopt Dependency Cruiser estatewide
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-02T05:27:09Z
updated_at: 2026-10-05T22:10:50Z
---

# KI-HARNESS-GOV-127: Adopt Dependency Cruiser estatewide

## Goal

Every applicable KI engineering repository has a working, enforced check of its source dependency graph and declared import boundaries. A reviewer can see which repositories are covered and why any repository is exempt.

## Context

The `ki-engineering` standard already names Dependency Cruiser for enforcing stated dependency directions (`skills/governance/ki-engineering/references/standards-engineering.md`, the dependency-direction bullets), but it is not part of the common audited toolchain alongside Biome, TypeScript, Knip, and Syncpack. On 2026-10-02, `mcp-acquire-whatsapp` was the only repository under `knowledgeislands/` with a `.dependency-cruiser.ts` configuration; `tools-ki` had none. The separate `infoschematics` project also has a working configuration and check. The existing examples cover circular and unresolved imports as well as repository-specific architectural rules.

A file or dependency declaration alone does not prove a check is effective. The engineering standard records that Dependency Cruiser can report a clean result after examining zero modules when its TypeScript parser is incompatible, and that unresolved imports can evade path-based rules. Universal adoption therefore needs an applicability rule, execution and coverage evidence, and a test that a deliberate boundary crossing fails.

## Boundary

In scope: the portable `ki-engineering` policy and one mechanical audit criterion that proves a configured cruise reads a non-zero graph and can still fail on a deliberate crossing; this repository's own adoption as the reference adopter; an estate inventory recorded in this record; and the trades that hand adoption to each applicable repository.

Out of scope: each repository's own adoption, which follows as a separate receiver-owned trade per repository; repository-specific boundary directions, which remain with each source owner, so the harness must not invent them from folder names; any CONFORM action that writes a ruleset; and imposing the tool on non-TypeScript repositories without a separate applicability decision. A zero-module cruise is never passing evidence.

## Current state

`DESIGN-2 [J]` in `skills/governance/ki-engineering/scripts/rubric/items/design.ts` asks the judgment question about stated and enforced boundaries; no mechanical criterion inspects a `.dependency-cruiser.ts`, and `DesignRubricContext` in `scripts/rubric/contexts/engineering.ts` is empty. This repository is on TypeScript 7 (`package.json`), which dependency-cruiser does not support, so its own adoption needs the separate install root the standard already prescribes. `mcp-acquire-whatsapp` provides the working pattern: `.dependency-cruiser.ts`, `tooling/boundaries/package.json` pinning `dependency-cruiser` with TypeScript 6, `scripts/boundaries.ts` with a module floor, and `scripts/boundaries.test.ts` in the suite.

## Steps

- [ ] Amend `standards-engineering.md`: the applicability rule (every `ki-engineering` repository whose `tsconfig.json` roots or tracked `scripts/` contain TypeScript modules; any other exemption is a recorded per-repository override), the baseline `no-circular` and `no-unresolvable` rules, the separate install root where the compiler is unsupported, `scripts/` coverage unless excluded with a stated reason, and the zero-module and deliberate-crossing requirements.
- [ ] Add `DESIGN-3 [M]` "Boundary checker reads a graph and can fail" to `scripts/rubric/items/design.ts`, level `WARN` at introduction with remediation class `diagnostic` and a `cost` weight. Evidence: `.dependency-cruiser.ts` exists and names both baseline rules; `dependency-cruiser` is declared in root `devDependencies` or `tooling/boundaries/package.json`; a cruise of the declared roots through that install root reports a non-zero module count (zero-module check); and the same ruleset reports `no-circular` on a two-module cycle written to a temporary directory outside the repository (deliberate-crossing check). Any step that cannot run reports unknown, never `PASS`.
- [ ] Gather that evidence in `scripts/rubric/contexts/audit-evidence.ts` and populate `DesignRubricContext` in `scripts/rubric/contexts/engineering.ts`; add `DESIGN-3` cases to `scripts/rubric/items/index.test.ts` for missing config, zero-module cruise, a checker that cannot fail, and a passing fixture.
- [ ] Adopt in this repository following the `mcp-acquire-whatsapp` pattern: `.dependency-cruiser.ts` with the two baseline rules over `skills/`, `hooks/`, `evals/` and `scripts/`; `tooling/boundaries/package.json`; `scripts/boundaries.ts` and `scripts/boundaries.test.ts` with a module floor near the real count and a deliberate-violation case; add `./scripts` to the `test` script and the new files to `knip.json`.
- [ ] Regenerate `references/rubric.md` with `ki dev skill rubric ki-engineering`.
- [ ] Inventory the repositories that declare `ki-engineering` under `knowledgeislands/`, recording for each applicability, existing enforcement, and whether `scripts/` is covered, in a `## Rollout inventory` section of this record; raise one `ki-trades` handoff per applicable gap.
- [ ] Make the separate install root part of an ordinary install: the standard prescribes a root `postinstall` script running `bun install --frozen-lockfile --cwd tooling/boundaries` wherever that root exists, and each adopting repository carries it. A fresh clone, or a pull that first introduces the root, otherwise fails the boundary check until someone installs it by hand.
- [ ] When the install root lacks `dependency-cruiser`, the audit names the remedy (`bun install --frozen-lockfile --cwd tooling/boundaries`) rather than surfacing the raw `ENOENT` from `scripts/rubric/contexts/boundaries.ts`.

## Files touched

- `skills/governance/ki-engineering/references/standards-engineering.md`
- `skills/governance/ki-engineering/scripts/rubric/items/design.ts`
- `skills/governance/ki-engineering/scripts/rubric/contexts/audit-evidence.ts`
- `skills/governance/ki-engineering/scripts/rubric/contexts/engineering.ts`
- `skills/governance/ki-engineering/scripts/rubric/items/index.test.ts`
- `skills/governance/ki-engineering/references/rubric.md` (generated)
- `.dependency-cruiser.ts` (new)
- `tooling/boundaries/package.json` (new)
- `scripts/boundaries.ts` (new)
- `scripts/boundaries.test.ts` (new)
- `package.json`
- `knip.json`
- `docs/roadmap/KI-HARNESS-GOV-127-adopt-dependency-cruiser-estatewide.md` (rollout inventory)

## Verify

Acceptance criteria, each judgeable by someone who did not write this:

1. `DESIGN-3` warns on a fixture with no configuration, on a fixture whose cruise reports zero modules, and on a fixture whose ruleset does not report the deliberate cycle; it passes on a working fixture.
2. No `DESIGN-3` path reports `PASS` when the cruise could not run.
3. In this repository, `bun run test` runs `scripts/boundaries.test.ts`, which asserts a module count at or above its floor and fails on a deliberate violation; `ki repo audit --skill ki-engineering` reports `DESIGN-3` `PASS`.
4. The standard states the applicability rule and the exemption route, and `DESIGN-2` remains the judgment criterion for repository-specific directions.
5. The rollout inventory lists every repository declaring `ki-engineering` with a disposition, and each applicable gap has a trade reference.
6. In a fresh clone of an adopting repository, a plain `bun install` leaves the boundary check passing; with `tooling/boundaries/node_modules` removed, the audit finding names the install command.

```bash
bun run test
bunx tsc --noEmit
ki dev skill rubric ki-engineering
ki repo audit --skill ki-engineering --progress never
```

## Dependencies / blocks

None. Per-repository adoption follows as separate trades and does not block acceptance here. Raising `DESIGN-3` from `WARN` to `FAIL` is a follow-on once the trades land.

The separate install root exists only because `dependency-cruiser` supports `typescript@>=2 <7` and TypeScript 7.0 ships no compiler API. The maintainer intends to add TypeScript 7 support once that API exists ([sverweij/dependency-cruiser#1069](https://github.com/sverweij/dependency-cruiser/issues/1069)), and TypeScript 7.1, planned stable on 2026-11-24, makes stabilising it the release's goal ([microsoft/TypeScript#63703](https://github.com/microsoft/TypeScript/issues/63703)). When a `dependency-cruiser` release accepts TypeScript 7, retire the install root, its `postinstall` and the separate CI install step in favour of root `devDependencies`.

Sequencing: this record and [KI-HARNESS-FND-026](KI-HARNESS-FND-026-complete-conform-activation.md), [KI-HARNESS-GOV-092](KI-HARNESS-GOV-092-align-generated-normal-forms.md) and [KI-HARNESS-GOV-109](KI-HARNESS-GOV-109-fail-when-commit-gates-absent.md) all edit the shared `ki-engineering` files `scripts/rubric/items/index.test.ts`, `references/rubric.md` and `references/standards-engineering.md`. Increment counts, never hardcode them; whichever lands second rebases. A sequencing note, not a dependency.

## Documentation impact

### Decision Records

None. The standard already names Dependency Cruiser; this record makes it audited.

### Specifications

`standards-engineering.md` gains the applicability rule, baseline rules and liveness requirements.

### Guides

None.

### Roadmap

This record gains a rollout inventory; per-repository adoption follows as trades, and raising `DESIGN-3` to FAIL as a follow-on.

## Discussion

### Common contract

The minimum shared check is the two baseline rules plus the two liveness proofs; meaningful import directions stay with each repository and remain `DESIGN-2`'s judgment. Tracked `scripts/` code is a candidate source root and needs an explicit reason when excluded, because a check that only cruises `src/` misses imports from repository tooling. The checker may run from the suite or a claimed `ki:` script; the audit runs its own cruise so the result does not depend on which. The existing standard's separate install root is retained where the repository compiler is incompatible.

### Rollout evidence

The two working configurations are starting examples, not a single rule set to copy into unrelated repositories. Verification in each receiving repository should show that the checker visits the intended source roots, resolves the imports used by its rules, and fails on a deliberate crossing.
