---
id: KI-HARNESS-FND-026
area: FND
title: Complete conform activation
theme: foundation-tooling
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T05:34:19Z
updated_at: 2026-09-25T05:34:19Z
---

## Goal

`ki repo conform --skill ki-engineering` leaves a repository with an explicit, verifiable activation state whenever it adds package-backed tooling. A later commit must not be the first place the user learns that newly bound hooks cannot load their declared dependencies.

## Context

A reproducible review finding from `kit-midnight.ninja` on 25 September 2026 starts with a Bun repository whose Commitlint toolchain is absent. Engineering conform repairs `PKG-5` and `SCR-11`: it adds `@commitlint/cli` and `@commitlint/config-conventional` to `devDependencies`, writes `commitlint.config.ts`, and creates a Husky `commit-msg` hook that invokes `bunx commitlint --edit "$1"`.

Conform does not run `bun install` or report an installation requirement. Its re-audit reads the corrected manifest and hook files, so it passes even though the local dependency graph is unchanged. The next commit then fails with `Cannot find module "@commitlint/config-conventional"`, making the conform consequence look like an unrelated commit problem.

This is broader than Commitlint: any conform action that declares an executable package dependency and immediately binds a script or hook can create the same declared-but-inactive state.

## Boundary

Do not weaken the Git hooks, teach users to bypass them, or make an unconfirmed networked package installation the default side effect of file-level conform. Do not broaden this item into general dependency updates or package-manager support beyond the selected repository toolchain.

## Discussion

### Safe default

The safer default is for conform to report an exact required activation step before the repaired capability can be treated as effective. The result should distinguish files conformed from dependencies installed, and re-audit should not be presented as proof that a newly introduced executable can load locally.

An explicitly confirmed install may remain an optional conform action if the host can preserve transaction clarity, package-manager selection, lockfile review, and failure recovery. The item should decide that boundary rather than assume install authority from permission to repair repository files.

### Verification shape

Add a fixture with no installed Commitlint packages, apply the `PKG-5` and `SCR-11` conform proposal, and prove the resulting report exposes the pending activation. After the stated install step, exercise the hook or its exact command so the dependency-loading failure is caught within the conform workflow rather than at the user's next commit.
