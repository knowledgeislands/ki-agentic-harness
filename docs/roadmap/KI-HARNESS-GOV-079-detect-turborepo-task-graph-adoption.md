---
id: KI-HARNESS-GOV-079
area: GOV
title: Detect Turborepo task-graph adoption
theme: governance-consistency
blocks: []
blocked_by: []
baseline_ref: 3a342c7b6eda3bc399c5bcea47756e7b0f335db9
transferred_from: ki-website
created_at: 2026-09-21T08:12:07Z
updated_at: 2026-09-22T01:15:22Z
horizon: now
status: awaiting-review
---

## Goal

`ki repo audit --skill ki-engineering` says something when a repository declares workspaces and hand-rolls its task graph anyway. A repository that is off the standard learns it from the gate rather than from someone noticing months later.

## Context

`standards-engineering.md` is unambiguous: Turborepo owns the task graph in any repository with a `workspaces` array, the threshold is having workspaces at all rather than a package or step count, and a root script chaining `bun run --cwd <workspace> build` is named explicitly as what the standard exists to replace. The reasoning is that Bun workspaces supply no task graph, no input hashing, and no notion of a target being up to date.

Nothing in `scripts/rubric/` reads `turbo.json`. A search for `turbo` across `items/`, `contexts/`, and `shared/rubric.ts` returns nothing, and the workspace-aware rubric code — `TSC-1` checking each workspace for a `tsconfig.json`, the coverage-directory checks, the Knip workspace lookups — already proves the evidence collector knows the `workspaces` array is there. The standard is stated and unchecked.

The estate shows what an unchecked standard produces. Of the ten repositories declaring a `workspaces` array, six carry a `turbo.json` — `hnr-backend`, `hnr-frontend`, `infoschematics`, `5g-emerge-resources`, `ki-techne-harness`, `kit-midnight.ninja` — and four do not: `ki-website`, `vallearmonia-website`, `5g-emerge-testbed-website`, `5g-emerge-ibc-2026`. The split is not random. Every repository with an obvious multi-package payoff adopted it unprompted; every repository where the benefit looked marginal skipped it. That is the standard being re-derived from first principles at each repository instead of applied, which is the failure mode a rubric item exists to prevent.

KI Website raised the handoff after an audit passed clean while the repository sat on `"workspaces": ["site"]`, no `turbo.json`, and exactly the chained `bun run --cwd site …` scripts the standard names. Its local alignment item is `KI-WEB-SITE-015`; three other repositories have the same gap and no item.

## Boundary

This adds detection to `ki-engineering`. It does not migrate any repository — each of the four owns its own adoption, on its own schedule, once the gate can tell it what is missing.

It does not decide remote caching, which the standard already requires to be set explicitly rather than by omission, and it does not touch `ki-repo-website`'s `site-root` default. Those are adjacent to KI Website's local item but are not this.

## Current state

The engineering standard requires a task graph for every repository declaring workspaces, but the rubric never inspects `turbo.json`. Six of ten observed workspace repositories adopted Turborepo independently; four remain invisible to the current audit.

## Steps

- [x] Add a `TURBO` rubric family to `ki-engineering` and collect workspace, root-script, workspace-script, `turbo.json`, and managed-ignore evidence once.
- [x] Emit WARN when a repository declares workspaces without a task graph, including `5g-emerge-ibc-2026`, while retaining the existing per-item override mechanism for evidenced exceptions.
- [x] Validate that configured tasks correspond to governed root and workspace scripts, deployable builds retain `$TURBO_DEFAULT$`, and `.turbo/` is excluded through the managed ignore contribution.
- [x] Keep semantic input-completeness judgment outside the mechanical audit and document the existing mutation test as the verification method.
- [x] Add fixtures for compliant, absent, partial, deliberately overridden, glob-workspace, and malformed configurations, then regenerate the rubric.

## Files touched

- `skills/governance/ki-engineering/references/standards-engineering.md`
- `skills/governance/ki-engineering/references/rubric.md`
- `skills/governance/ki-engineering/scripts/rubric/items/turbo.ts`
- `skills/governance/ki-engineering/scripts/rubric/items/index.ts`
- `skills/governance/ki-engineering/scripts/rubric/contexts/audit-evidence.ts`
- `skills/governance/ki-engineering/scripts/rubric/contexts/engineering.ts`
- Focused `ki-engineering` fixture tests

## Verify

- Focused engineering tests prove WARN-level absence, configuration-quality failures, override handling, and compliant task graphs.
- `ki dev skill rubric ki-engineering` reproduces the committed rubric.
- `ki repo audit --skill ki-engineering --repo .` passes for the Harness.
- `ki repo audit --skill ki-skills --repo .`, `bun run test`, and `bunx tsc --noEmit` pass.

## Dependencies / blocks

No external dependency blocks the checker. Estate migrations are follow-on receiver work; this item deliberately begins at WARN so existing repositories are visible without becoming immediate failures.

## Documentation impact

### Decision Records

No Decision Record is expected because this implements the already accepted engineering standard.

### Specifications

The engineering standard and generated rubric remain the accepted contract; no separate specification is needed.

### Guides

No guide is required beyond a concise remediation that points to the standard's task-graph shape and mutation test.

### Roadmap

Receiver repositories that fail the new warning own their adoption or exemption work; this item does not create those records.

## Review

### Delivered

Implemented the approved `TURBO` rubric family from immutable baseline `3a342c7b6eda3bc399c5bcea47756e7b0f335db9`. The delivery is diagnostic only: it does not migrate estate repositories, enable remote caching, or claim to prove semantic input completeness.

### Summary of changes

Added `TURBO-1` adoption, `TURBO-2` task-correspondence, and `TURBO-3` cache-boundary checks to `ki-engineering`; collected package names and scripts safely across expanded workspaces; parsed commented `turbo.json` files; documented the mutation-test boundary; and regenerated the published rubric. All new violations begin at WARN.

### Verification

`bun test skills/governance/ki-engineering/scripts/rubric/items/index.test.ts` passed 27 tests. `ki dev skill rubric ki-engineering --write`, `bunx tsc --noEmit`, and `ki repo audit --skill ki-engineering --repo .` passed. The final repository-wide gates are recorded in the delivery commit evidence.

### Outstanding concerns

The audit deliberately cannot prove that task inputs cover every file a command reads; the documented random-content mutation test remains the verification method. Estate repositories newly surfaced by WARN still own their migrations or evidenced exceptions.

### Post-change review

The implementation meets the goal and stays inside the planned boundary. The main regression risk is false confidence from treating static input inspection as semantic proof; the new standard text explicitly prevents that interpretation. The item is ready for acceptance review.

### Mini recap

Workspace repositories now receive actionable task-graph findings instead of silently passing without Turborepo. Focused fixtures cover absent, malformed, partial, commented, and compliant configurations; follow-on adoption belongs in each receiver repository rather than this item.

## Discussion

### Planning decisions

The first slice ships presence and minimum configuration-quality checks together under a dedicated `TURBO` family. Every repository with a workspace declaration is in scope, including `5g-emerge-ibc-2026`; a justified exemption uses the existing override mechanism. `ki-engineering` is the sole mechanical owner, so website skills do not duplicate the generic adoption check.

### What a rubric item can actually prove

The cheap half is real: `workspaces` is non-empty and no `turbo.json` exists is a two-line check against evidence the collector already gathers, and it catches all four repositories today.

The expensive half is the one that matters longer term, because a `turbo.json` that exists and says nothing passes a presence check while delivering none of the standard's benefit. The standard names several conditions that are mechanically visible: every workspace declaring its own `build`, `typecheck`, and `test` rather than a single root entry; workspace packages absent from the root manifest's dependencies, since one such entry flattens the graph; a deployable's build using `inputs: ["$TURBO_DEFAULT$"]` rather than a glob list; `.turbo/` present in the managed `.gitignore` contribution, which `ki-engineering` already owns.

One condition is not mechanically provable and should not be faked: whether a task's `inputs` actually cover the files it reads. The standard's own remedy is a random-content edit per declared input, which is a test rather than an inspection. A rubric item that claimed to verify it would be reporting a green it never earned, which is the exact failure the standard warns about.

### Level and sequencing

FAIL on absence would put four repositories into a failing gate the moment this ships, including two that are mid-flight. WARN states the gap without manufacturing an emergency, and can be raised once the repositories have landed their migrations. The `overrideLevels` mechanism already in `RubricItem` is the documented way to let a repository record a deliberate exemption, if one turns out to be warranted.

The shape question is whether this is a new `TURBO` family or items inside the existing `BUILD` or `SCRIPTS` families. A family of its own reads better against `standards-engineering.md`, which treats the task graph as its own concern, and gives the later configuration-quality checks somewhere to land.

### Alternatives considered

Leaving it to each repository is the status quo, and the four-versus-six split is the measurement of how well that works.

Checking only for `turbo.json` presence and stopping there is a legitimate first step and catches everything currently wrong. The risk is that presence becomes the whole standard, and a repository satisfies the gate with a `turbo.json` containing a single root `build` — which the standard explicitly calls one cache entry for the whole repository.

### Questions resolved by the plan

- Is a bare `turbo.json` presence check worth shipping ahead of the configuration-quality items, or does shipping it alone teach the wrong lesson?
- Should `5g-emerge-ibc-2026` be in scope? It declares `["apps/*","infoschematics/*"]` and is the one non-website repository in the gap, so it may have a reason the three website repositories do not.
- Does `ki-repo-website` need anything here, or does the generic `ki-engineering` check cover website repositories completely once it exists?
