---
id: KI-HARNESS-GOV-073
area: GOV
title: Reject hand-written node_modules paths
theme: governance-consistency
horizon: future
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-17T16:53:09Z
updated_at: 2026-09-17T16:53:09Z
---

# Reject hand-written node_modules paths

## Goal

`ki-engineering` should catch a hand-written relative path into `node_modules`, because such a path is a claim about an install layout that only one of a repository's two environments reproduces.

## Context

A workspace package that invokes a dependency's binary by path — `bun ../../node_modules/@11ty/eleventy/cmd.cjs` — works locally because Bun hoists shared dependencies to the repository root. It fails wherever the installer does not hoist. Cloudflare Workers Builds installs into each workspace's own `node_modules`, so the parent-relative path resolves to nothing and the build dies on its first command.

`krisb/kit-midnight.ninja` shipped exactly this and both of its Cloudflare Workers failed on their first build:

```text
$ bun ../../node_modules/@11ty/eleventy/cmd.cjs --config=eleventy.config.ts
error: Module not found "../../node_modules/@11ty/eleventy/cmd.cjs"
```

The instructive part is not the mistake but that nothing caught it. `turbo run build`, `turbo run typecheck` and a full `ki repo audit` were all green on a tree that could not build on its deployment target, because every one of them ran against the hoisted layout. The repository's own work record for its Turborepo migration lists "repointing `../node_modules` to `../../node_modules`" as a completed step — the path was diligently kept correct rather than recognised as something that should never be written by hand.

This is worth a rubric item specifically because `ki-engineering` is what drives repositories into this shape. Its Turborepo rule applies to any repository with a `workspaces` array, and moving a package one directory deeper is exactly when a fixed-depth path silently changes meaning. The standard creates the depth change; it should also flag the construct that the depth change breaks.

## Boundary

This concerns hand-written relative paths into `node_modules` in `package.json` scripts and build configuration. It is not about `node_modules` resolution generally, about lockfiles, or about which package manager hoists.

## Current state

`ki-engineering` governs the Bun toolchain, the `ki:` script naming law and the `tsconfig`/`biome`/`knip` shape. Nothing inspects script bodies or config files for path construction.

## Steps

- [ ] Decide the level. A hoisted path is not merely inelegant; it is a latent build failure, which argues for FAIL rather than WARN, but it is also currently working in every repository that has one, which argues the other way.
- [ ] Add a mechanical check for a relative path segment containing `node_modules/` in any `package.json` script, at root or in a workspace.
- [ ] Decide whether to extend the same check to build configuration files, where the equivalent appears as passthrough copies and asset paths.
- [ ] Record the remediation in the standard: invoke binaries through the resolver (`bunx --bun <package>`), and resolve files through the module graph (`createRequire(import.meta.url).resolve(...)`) rather than by path.

## Files touched

`skills/governance/ki-engineering/references/standards-engineering.md`, its rubric items and tests, and the generated `references/rubric.md`.

## Verify

A fixture workspace whose `build` script contains `../node_modules/…` is flagged; the same workspace using `bunx` is not.

## Dependencies / blocks

None.

## Documentation impact

### Decision Records

None. Resolving a dependency through the resolver rather than a fixed path is the ordinary correct form, not a choice between defensible options.

### Specifications

None.

### Guides

A repository-level guide is the wrong home for this — it belongs in the standard, because the whole point is that the constraint is not local to any one repository.

### Roadmap

Independent of `KI-HARNESS-GOV-071` and `KI-HARNESS-GOV-072`, though all three surfaced from the same multi-site migration.

## Discussion

### Why the local gates cannot catch this by themselves

Every local check runs against the local install. The divergence is between two installers, so no amount of local verification reaches it; only a build on the target does, and that is the one place a failure is expensive and slow to read. A static check on the construct is the only cheap detector, which is what makes it worth a rubric item rather than a note in a guide.

### Scope of the exposure

Any KI repository combining workspaces with a hosted build is exposed. The construct is most likely in repositories that predate their own workspace migration, where the path was written when there was only one package and quietly re-depthed afterwards.
