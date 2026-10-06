---
id: KI-HARNESS-GOV-138
area: GOV
title: Govern Bun runtime freshness
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: efb866bb1fbe7432d99045840d1c15822cb8637f
created_at: 2026-10-05T23:00:00Z
updated_at: 2026-10-06T11:05:00Z
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

- [x] Extend `DEPS-1` rather than add a criterion: treat the pinned runtime as one more dependency named `bun`, read from `packageManager`, so it shares the 14-day window, the next-unadopted-release clock, the `dependency_holds` route and the existing message shapes. Add a pure exported helper that reads the pinned version from `packageManager` and one that classifies the runtime as current, behind or unknown from a publish-time map, and factor the registry lookup into one helper shared with the package lookups.
- [x] In `collectAuditEvidence`, look up the `bun` publish times alongside the package lookups. A behind runtime joins the graded list, and joins the available names used to validate holds, so `bun — <reason>` is a valid hold while the runtime is behind and stale once it is current. A current runtime reports in the PASS message. An unreachable registry reports INFO that the runtime's freshness is unknown, never PASS.
- [x] Add focused tests in `scripts/rubric/items/index.test.ts` for pinned-version parsing, runtime classification (current, behind with a dated next release, unknown when the lookup failed, prerelease-only newer versions treated as current), and a runtime hold. No test reaches the network.
- [x] Update the `DEPS-1` description and guidance in `scripts/rubric/items/dependencies.ts`, regenerate `references/rubric.md` with `ki dev skill rubric ki-engineering --write`, and add the runtime to the dependency-freshness section of `references/standards-engineering.md`.
- [x] Bump the harness to Bun 1.4.2 in `package.json` and `mise.toml`, and the CONFORM scaffold defaults in `scripts/rubric/contexts/engineering.ts`.
- [x] Record in `references/sources.md` that the runtime gap is closed and the harness and scaffold now pin 1.4.2.
- [x] Run the verification below.

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

## Review

### Delivered

Within the approved boundary, `DEPS-1` now grades the Bun runtime pinned in `packageManager` as the dependency `bun`, under the same 14-day window, next-unadopted-release clock, `dependency_holds` route and message shapes as packages, dated from the npm `bun` package. The harness and the CONFORM scaffold pin Bun 1.4.2. Other runtimes and each configured repository's own bump stay out of scope. Baseline `efb866bb1fbe7432d99045840d1c15822cb8637f`; the result is the implementation commit that carries this packet.

### Change Summary

- `scripts/rubric/contexts/audit-evidence.ts`: exported `BUN_RUNTIME`, `pinnedBunRuntime` and `classifyBunRuntime`; factored the registry lookup into `fetchPublishTimes`, shared by packages and the runtime; a behind runtime joins the graded list and the hold-validation names; an unknown runtime keeps its hold valid and reports INFO, never PASS; a `bun@` pin that is not an exact release reports INFO.
- Holds are now inspected on every path, including when nothing is outdated, so a hold that outlives its update is flagged as stale as `standards-engineering.md` already states. Previously that check ran only when `bun outdated` listed something.
- `scripts/rubric/items/dependencies.ts` and the regenerated `references/rubric.md`: `DEPS-1` description, remediation, scope and guidance name the runtime.
- `references/standards-engineering.md`: the dependency-freshness section covers the runtime; `references/sources.md` records the gap as closed.
- `scripts/rubric/contexts/engineering.ts`, `package.json`, `mise.toml`: Bun 1.4.2.
- `scripts/rubric/items/index.test.ts`: pinned-version parsing, current/behind/unknown classification including canary prereleases, the shared window, an active runtime hold and a stale runtime hold. No test reaches the network.

### Verification

- `bun test skills/governance/ki-engineering`: 59 pass, 0 fail.
- `ki repo audit --repo . --skill ki-engineering` with the harness temporarily at 1.4.1: `DEPS-1` FAIL "beyond the 14-day adoption window: bun 1.4.1 → 1.4.2 (available 31 days)"; at 1.4.2 the skill passes with no `DEPS-1` finding.
- Unreachable registry: `classifyBunRuntime('1.4.2', undefined)` is `unknown`, and the audit path uses that helper.
- `ki dev skill rubric ki-engineering`: rubric in sync.
- `bun run test`: 895 pass, 0 fail. `bunx tsc --noEmit`: clean. `bunx biome check .`: no errors; existing warnings are in unrelated files.
- `ki repo audit --repo . --progress never --concise`: FAIL=0.

### Outstanding concerns

None. Each configured repository's own bump is receiver-owned and will surface in its own `DEPS-1` once a released `ki` carries this revision, as the planning decisions record.

### Post-change review

The goal is met: an audit now notices a lagging runtime. Scope matches the plan, with one small, standard-aligned widening (hold inspection on the all-current path). Regression risk is low: the only new network call reuses the existing registry host and timeout, and an unreachable registry yields INFO rather than FAIL, so CI gains no new failure mode. Ready for acceptance subject to independent review.

### Mini recap

Delivered runtime freshness inside `DEPS-1`, bumped the harness and scaffold to Bun 1.4.2, and verified the before/after audit and the full gates. No open concerns. Learning route: none beyond the engineering standard text already updated.

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
