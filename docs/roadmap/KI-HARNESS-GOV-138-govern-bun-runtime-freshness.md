---
id: KI-HARNESS-GOV-138
area: GOV
title: Govern Bun runtime freshness
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-05T23:00:00Z
updated_at: 2026-10-06T10:20:00Z
---

# KI-HARNESS-GOV-138: Govern Bun runtime freshness

## Goal

Repositories run a current Bun release, and an audit notices when the pinned runtime falls behind, just as it already does for package dependencies.

## Context

`DEPS-1` in `skills/governance/ki-engineering/scripts/rubric/items/dependencies.ts` reads only `bun outdated`, which covers declared packages but not the runtime itself. The runtime is pinned separately, in `packageManager` (`bun@1.4.1`) and the `mise` `bun` tool version, and the `ki-engineering` CONFORM scaffold writes `bun@1.4.1` in `scripts/rubric/contexts/engineering.ts`.

The 2026-10-06 `ki-engineering` REFRESH found Bun 1.4.2, published on 2026-09-05, already past the 14-day adoption window, while the harness and every configured repository still pinned 1.4.1. No audit criterion reported it. `references/sources.md` records the gap.

## Boundary

In scope: bumping the harness and its CONFORM scaffold to the current Bun release; extending runtime coverage, either within `DEPS-1` or as a new criterion, with the same 14-day adoption window and `dependency_holds` route; and raising receiver-owned handoffs for each repository's own bump.

Out of scope: other runtimes such as Node, and each repository's own bump, which its owner makes.

## Current state

`DEPS-1` evidence is collected in `collectAuditEvidence` in `skills/governance/ki-engineering/scripts/rubric/contexts/audit-evidence.ts`. It parses `bun outdated`, dates each outdated package from its `registry.npmjs.org` publish times with a 10-second timeout, and grades it through the pure `nextVersionAfter`, `gradeDependencyFreshness` and `inspectDependencyHolds` helpers: FAIL beyond the 14-day window, INFO within it, INFO when held, and INFO "release age unknown" when the registry cannot be reached. When `bun outdated` lists nothing it reports PASS without any network lookup. The Bun runtime is never examined.

Pin agreement already exists: `MISE-2` fails when the `mise.toml` `bun` pin differs from the `packageManager` Bun version, and `PKG-2` fails when `packageManager` is not `bun@...`. The Discussion's agreement question is therefore settled by existing criteria and needs no new check.

The `bun` npm package publishes every runtime release with its publish time (1.4.1 on 2026-09-04, 1.4.2 on 2026-09-05); its canary builds are prereleases, which `nextVersionAfter` already ignores. That registry is the source `DEPS-1` already uses for packages, so the runtime lookup inherits the same network behaviour.

The harness pins `bun@1.4.1` in `package.json` and `bun = "1.4.1"` in `mise.toml`, and the CONFORM scaffold in `scripts/rubric/contexts/engineering.ts` writes the same. The local runtime is already 1.4.2.

## Steps

- [ ] Extend `DEPS-1` rather than add a criterion: treat the pinned runtime as one more dependency named `bun`, read from `packageManager`, so it shares the 14-day window, the next-unadopted-release clock, the `dependency_holds` route and the existing message shapes. Add a pure exported helper that reads the pinned version from `packageManager` and one that classifies the runtime as current, behind or unknown from a publish-time map, and factor the registry lookup into one helper shared with the package lookups.
- [ ] In `collectAuditEvidence`, look up the `bun` publish times alongside the package lookups. A behind runtime joins the graded list, and joins the available names used to validate holds, so `bun — <reason>` is a valid hold while the runtime is behind and stale once it is current. A current runtime reports in the PASS message. An unreachable registry reports INFO that the runtime's freshness is unknown, never PASS.
- [ ] Add focused tests in `scripts/rubric/items/index.test.ts` for pinned-version parsing, runtime classification (current, behind with a dated next release, unknown when the lookup failed, prerelease-only newer versions treated as current), and a runtime hold. No test reaches the network.
- [ ] Update the `DEPS-1` description and guidance in `scripts/rubric/items/dependencies.ts`, regenerate `references/rubric.md` with `ki dev skill rubric ki-engineering --write`, and add the runtime to the dependency-freshness section of `references/standards-engineering.md`.
- [ ] Bump the harness to Bun 1.4.2 in `package.json` and `mise.toml`, and the CONFORM scaffold defaults in `scripts/rubric/contexts/engineering.ts`.
- [ ] Record in `references/sources.md` that the runtime gap is closed and the harness and scaffold now pin 1.4.2.
- [ ] Run the verification below.

## Files touched

- `skills/governance/ki-engineering/scripts/rubric/contexts/audit-evidence.ts`
- `skills/governance/ki-engineering/scripts/rubric/contexts/engineering.ts`
- `skills/governance/ki-engineering/scripts/rubric/items/dependencies.ts`
- `skills/governance/ki-engineering/scripts/rubric/items/index.test.ts`
- `skills/governance/ki-engineering/references/rubric.md`
- `skills/governance/ki-engineering/references/standards-engineering.md`
- `skills/governance/ki-engineering/references/sources.md`
- `package.json`
- `mise.toml`
- this record

## Verify

1. The new tests pass and exercise current, behind, unknown and held runtime cases without network access.
2. `ki repo audit --repo . --skill ki-engineering` against the harness at 1.4.1 (before the bump) reports the runtime beyond the adoption window as FAIL, and after the bump reports it current.
3. With the registry unreachable the runtime reports as unknown, not PASS: shown by the unit test, since the audit path uses the same helper.
4. `ki dev skill rubric ki-engineering` reports the generated rubric matches.
5. Repository gates pass: `bun run test`, `bunx tsc --noEmit`, `bunx biome check .`, and `ki repo audit --repo . --progress never --concise` with FAIL=0.

```bash
bun test skills/governance/ki-engineering
bun run test
bunx tsc --noEmit
bunx biome check .
ki dev skill rubric ki-engineering
ki repo audit --repo . --progress never --concise
```

## Dependencies / blocks

None. The adoption window, holds route and registry lookup already exist in `DEPS-1`, and `MISE-2` already holds the two pins together.

## Documentation impact

### Decision Records

None. The leading-edge dependency policy is unchanged; it now covers the runtime too.

### Specifications

None.

### Guides

None beyond the engineering standard's dependency-freshness section.

### Roadmap

This record only.

## Discussion

### Evidence source

The upstream latest release can come from the GitHub releases of `oven-sh/bun` or the npm `bun` package. Whichever is chosen, an unavailable source reports unknown, never PASS, consistent with `DEPS-1`.

### Pin agreement

`packageManager` and `mise` can disagree. The check should probably require them to agree as well as be current, so a bump cannot land in one place only.

### Planning decisions - 2026-10-06

Kris Brown approved delivery on 2026-10-06 ("low priority, but I think its straight forward so lets get it done"), adopting this record into Now and approving it Ready.

- **Owner of the standard text.** `ki-engineering` owns it. Its standard already governs `packageManager`, the `mise.toml` pin and dependency freshness; `ki-repo` governs repository configuration, not toolchain versions.
- **Within `DEPS-1`, not a new criterion.** The runtime is graded as the dependency `bun`, so the window, clock, hold route, unknown-source handling and message shapes are identical by construction rather than parallel copies, and the criterion inventory is unchanged.
- **Evidence source.** The npm `bun` package, the registry `DEPS-1` already calls, so no new host, credential or failure mode enters the audit. An unreachable registry reports unknown, never PASS, and never fails, so CI gains no new flakiness.
- **Pin agreement.** Already enforced by `MISE-2`; not duplicated.
- **Receiver handoffs dropped from this delivery.** Rather than writing a handoff into each configured repository, the extended `DEPS-1` reports each repository's own lag in its own audit once a released `ki` carries this harness revision. That keeps every bump receiver-owned without cross-repository writes from this record.
