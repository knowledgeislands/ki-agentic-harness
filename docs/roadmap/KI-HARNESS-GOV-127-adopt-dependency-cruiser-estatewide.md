---
id: KI-HARNESS-GOV-127
area: GOV
title: Adopt Dependency Cruiser estatewide
kind: deliver
purpose: adoption
project: baseline-rollout
component: governance
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: e30948ad1e45835c5d2a6140ff5306778a32b9d2
created_at: 2026-10-02T05:27:09Z
updated_at: 2026-10-08T10:20:00Z
---

# KI-HARNESS-GOV-127: Adopt Dependency Cruiser estatewide

## Goal

Every applicable KI engineering repository has a working, enforced check of its source dependency graph and declared import boundaries. A reviewer can see which repositories are covered and why any repository is exempt.

## Context

The `ki-engineering` standard already names Dependency Cruiser for enforcing stated dependency directions (`skills/governance/ki-engineering/references/standards-engineering.md`, the dependency-direction bullets), but it is not part of the common audited toolchain alongside Biome, TypeScript, Knip, and Syncpack. On 2026-10-02, `mcp-acquire-whatsapp` was the only repository under `knowledgeislands/` with a `.dependency-cruiser.ts` configuration; `tools-ki` had none. The separate `infoschematics` project also has a working configuration and check. The existing examples cover circular and unresolved imports as well as repository-specific architectural rules.

A file or dependency declaration alone does not prove a check is effective. The engineering standard records that Dependency Cruiser can report a clean result after examining zero modules when its TypeScript parser is incompatible, and that unresolved imports can evade path-based rules. Universal adoption therefore needs an applicability rule, execution and coverage evidence, and a test that a deliberate boundary crossing fails.

## Boundary

In scope: the portable `ki-engineering` policy's applicability rule, exemption route and `scripts/` coverage requirement; an estate inventory recorded in this record, with each gap routed to a follow-on. The liveness proofs are `DESIGN-2`'s existing mechanical half, not a new criterion.

Out of scope: this repository's own adoption and the `bun test` proof adapter it needs, now `KI-HARNESS-GOV-163`; each repository's own adoption; repository-specific boundary directions, which remain with each source owner, so the harness must not invent them from folder names; any CONFORM action that writes a ruleset; and imposing the tool on non-TypeScript repositories without a separate applicability decision. A zero-module cruise is never passing evidence.

## Current state

**Trades are on hold (2026-10-07).** Decision 11 of the state-of-play design stops new trades. Where the steps below raise a `ki-trades` hand-off, record the work directly in the receiving repository's roadmap instead.

`DESIGN-2` in `skills/governance/ki-engineering/scripts/rubric/items/design.ts` is hybrid. Its mechanical half (`scripts/rubric/contexts/boundaries.ts`) proves a contained ruleset with `no-circular` and `no-unresolvable`, an isolated install root provisioned by `prepare`, an available transpiler, a complete non-empty graph over root `src/` or each workspace member's `src/` and `scripts/`, and a native failure proof through a bare `vitest run` entrypoint. Fourteen repositories pass it. This repository has no `src/` and runs `bun test`, so `DESIGN-2` reports it not applicable.

## Steps

- [ ] Amend `standards-engineering.md`: the applicability rule (every `ki-engineering` repository whose TypeScript or JavaScript implementation modules import one another, in its compiler roots, workspace members or tracked `scripts/`; tool configuration files alone do not make a repository applicable; any other exemption is a recorded per-repository override), and `scripts/` coverage unless excluded with a stated reason. The baseline rules, the separate install root and the zero-module and deliberate-crossing requirements are already stated there.
- [x] Discharged by `DESIGN-2`, re-planned 2026-10-08: no `DESIGN-3`. `DESIGN-2`'s mechanical half already fails a missing ruleset or baseline rule, an unavailable transpiler, an empty or partial graph and a checker whose native proof does not fail when semantic rules are removed. A second criterion would prove the same thing.
- [x] Discharged with Step 2: no new evidence or `DesignRubricContext` field; `DESIGN-2`'s evidence in `scripts/rubric/contexts/boundaries.ts` and its tests stand.
- [x] Moved to `KI-HARNESS-GOV-163`, re-planned 2026-10-08: this repository's adoption. `DESIGN-2`'s adapter cruises root `src/` and runs boundary tests through `vitest run`; this repository has no `src/` and runs `bun test`, so a committed ruleset would turn its not-applicable result into a `FAIL` it cannot clear until a `bun test` adapter exists.
- [x] Moved to `KI-HARNESS-GOV-163` with Step 4: no criterion changes here, so `references/rubric.md` needs no regeneration.
- [ ] Record each repository's `scripts/` coverage and disposition in the `## Rollout inventory` section, and route each gap to a follow-on record while trades are on hold.
- [x] Make the separate install root part of an ordinary install: the standard prescribes a root `prepare` step running `bun install --frozen-lockfile --cwd tooling/boundaries` wherever that root exists, and each adopting repository carries it. A fresh clone, or a pull that first introduces the root, otherwise fails the boundary check until someone installs it by hand.
- [x] When the install root lacks `dependency-cruiser`, the audit names the remedy (`bun install --frozen-lockfile --cwd tooling/boundaries`) rather than surfacing the raw `ENOENT` from `scripts/rubric/contexts/boundaries.ts`.

## Files touched

- `skills/governance/ki-engineering/references/standards-engineering.md`
- `docs/roadmap/KI-HARNESS-GOV-127-adopt-dependency-cruiser-estatewide.md` (rollout inventory)
- `docs/roadmap/KI-HARNESS-GOV-163-bun-boundary-proof-adapter.md` (follow-on)

## Verify

Acceptance criteria, each judgeable by someone who did not write this:

1. The standard states the applicability rule, the exemption route and the `scripts/` coverage requirement, and `DESIGN-2` remains both the mechanical liveness proof and the judgment criterion for repository-specific directions.
2. No `DESIGN-3` criterion exists, and the re-plan names the `DESIGN-2` evidence that discharges it.
3. The rollout inventory lists every repository declaring `ki-engineering` with a disposition and its `scripts/` coverage, and each gap names its follow-on record.
4. In a fresh clone of an adopting repository, a plain `bun install` leaves the boundary check passing; with `tooling/boundaries/node_modules` removed, the audit finding names the install command.

```bash
bun run test
ki repo audit --skill ki-authoring --progress never
ki repo audit --skill ki-work-roadmap --progress never
```

## Dependencies / blocks

None. This repository's adoption and the per-repository `scripts/` coverage hand-offs follow in `KI-HARNESS-GOV-163` and do not block acceptance here.

The separate install root exists only because `dependency-cruiser` supports `typescript@>=2 <7` and TypeScript 7.0 ships no compiler API. The maintainer intends to add TypeScript 7 support once that API exists ([sverweij/dependency-cruiser#1069](https://github.com/sverweij/dependency-cruiser/issues/1069)), and TypeScript 7.1, planned stable on 2026-11-24, makes stabilising it the release's goal ([microsoft/TypeScript#63703](https://github.com/microsoft/TypeScript/issues/63703)). When a `dependency-cruiser` release accepts TypeScript 7, retire the install root, its `prepare` step and the separate CI install step in favour of root `devDependencies`.

Sequencing: this record and `KI-HARNESS-FND-026` (done), `KI-HARNESS-GOV-092` (done) and `KI-HARNESS-GOV-109` (done) all edit the shared `ki-engineering` files `scripts/rubric/items/index.test.ts`, `references/rubric.md` and `references/standards-engineering.md`. Increment counts, never hardcode them; whichever lands second rebases. A sequencing note, not a dependency.

## Documentation impact

### Decision Records

None. The standard already names Dependency Cruiser; this record makes it audited.

### Specifications

`standards-engineering.md` gains the applicability rule, exemption route and `scripts/` coverage requirement.

### Guides

None.

### Roadmap

This record gains a rollout inventory; this repository's adoption and the `scripts/` coverage hand-offs follow in `KI-HARNESS-GOV-163`.

## Rollout inventory

Recorded 2026-10-06 from the primary checkouts under `knowledgeislands/`, read-only. "Enforcement" means a tracked `.dependency-cruiser.ts` with a `tooling/boundaries/` install root, judged by `DESIGN-2`'s mechanical half; it is not yet `DESIGN-3` evidence. Whether each cruise covers `scripts/` was not re-verified here.

| Repository | Applicability | Enforcement and first commit |
| --- | --- | --- |
| `mcp-acquire-whatsapp` | applicable | adopted, `fba83c6` (2026-09-19); the reference pattern |
| `apps-observatory` | applicable | adopted, `eb8e77f` (2026-10-02) |
| `ki-website` | applicable | adopted, `864bfbb` (2026-10-05) |
| `mcp-git-audit` | applicable | adopted, `7f55b2f` (2026-10-05) |
| `mcp-gsuite` | applicable | adopted, `7e4d42a` (2026-10-05) |
| `mcp-housekeeping-chatgpt` | applicable | adopted, `e221f79` (2026-10-05) |
| `mcp-housekeeping-claude` | applicable | adopted, `1448e67` (2026-10-05) |
| `mcp-housekeeping-codex` | applicable | adopted, `118f624` (2026-10-05) |
| `mcp-ki-kb-fs` | applicable | adopted, `c8090fd` (2026-10-05) |
| `mcp-ki-kb-notion-mirror` | applicable | adopted, `2831b84` (2026-10-05) |
| `mcp-m365` | applicable | adopted, `9ee4c71` (2026-10-05) |
| `tools-git-almanac` | applicable | adopted, `7d26923` (2026-10-05) |
| `tools-ki` | applicable | adopted, `c34ccc9` (2026-10-05) |
| `tools-techne` | applicable | adopted, `19c1346` (2026-10-05) |
| `ki-agentic-harness` | applicable | **gap**: no `.dependency-cruiser.ts` or `tooling/boundaries/`; Step 4, needing the separate install root because the repository is on TypeScript 7 |
| `ki-arcadia-principal` | proposed exempt | none; its only TypeScript files are `commitlint.config.ts` and `knip.ts`, so there is no source graph to cruise |
| `ki-techne-harness` | proposed exempt | none; `tsconfig.json` includes `src/**/*.ts`, which is empty, and the controller is Python with one `types.d.ts` |

`homebrew-tap`, `ki-specifications`, `tools-mgit` and `tools-rig` do not declare `ki-engineering` and are out of scope. The two proposed exemptions become final only once Step 1's applicability rule lands; no other applicable gap needs a trade.

## Discussion

### Common contract

The minimum shared check is the two baseline rules plus the two liveness proofs; meaningful import directions stay with each repository and remain `DESIGN-2`'s judgment. Tracked `scripts/` code is a candidate source root and needs an explicit reason when excluded, because a check that only cruises `src/` misses imports from repository tooling. The checker may run from the suite or a claimed `ki:` script; the audit runs its own cruise so the result does not depend on which. The existing standard's separate install root is retained where the repository compiler is incompatible.

### Rollout evidence

The two working configurations are starting examples, not a single rule set to copy into unrelated repositories. Verification in each receiving repository should show that the checker visits the intended source roots, resolves the imports used by its rules, and fails on a deliberate crossing.

### Start - 2026-10-06

Started at baseline `e30948ad` to make the lifecycle honest: two Steps were already complete while the record still read `ready`. Work that predates the baseline and is therefore not in its diff: the native boundary verification and per-member workspace adapter (`7f50f664`, `537a9f62`, `8d35cbb1`), the `prepare` install step (`b7e276de`, Step 7) and the named-remedy audit evidence (`a074fc4a`, Step 8). The estate's adoption under `DESIGN-2` is recorded in the Rollout inventory above.

Still open: `DESIGN-3` is absent from `design.ts`, the generated rubric is not regenerated for it, and the harness's own adoption (Step 4) has not started. Step 6 stays open until `scripts/` coverage is recorded per repository. `DESIGN-2`'s mechanical half now checks a complete product-source graph and native failure proof, which overlaps Steps 2 and 3; re-check those Steps against it through `ki-plan` before implementing them, rather than adding a second criterion that proves the same thing.

### Re-plan - 2026-10-08

Re-checked Steps 2 to 5 against `DESIGN-2` as the Start note asked. `DESIGN-2`'s mechanical half already proves a contained ruleset with both baseline rules, an available transpiler, a complete non-empty graph and a native failure proof, so `DESIGN-3` would duplicate it and is dropped. That adapter supports only `src/` roots under `vitest run`, so this repository's adoption needs a `bun test` adapter first; Steps 4 and 5 move with it to `KI-HARNESS-GOV-163`. This record keeps the policy amendment and the inventory.
