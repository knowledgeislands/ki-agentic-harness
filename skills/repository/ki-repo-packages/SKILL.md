---
name: ki-repo-packages
ki-kind: governance
ki-applicability: declaration-only
ki-guild: repository
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Audit or conform a KI `packages-*` repository whose source tree consumers vendor whole: the vendored package,
  workbench, lock and vendoring tools, sync paragraph, consumers found by lock, and release and re-vendor rule. Use
  `ki-repo-tools` for installed CLIs, `ki-engineering` for the toolchain, and `ki-repo` for universal files.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# Knowledge Islands package repository

You are helping audit, conform or explain a **`packages-*` repository**: the canonical source of one source tree that other repositories vendor, copying it whole and pinning it with a lock file, so that no consumer's build ever fetches it. [`packages-stoa`](https://github.com/knowledgeislands/packages-stoa) is the reference. Read [the package repository standard](references/standards-package-repositories.md) before acting, [the generated rubric](references/rubric.md) for the checkable criteria and [the sources](references/sources.md) for the evidence. While [the migration overlay](references/standards-package-repositories-migration.md) exists, read it last; it lists temporary adjustments, and the standard wins wherever the two differ.

## The shape at a glance

- **One vendored tree.** `packages/<package>/` is exactly what a consumer copies: units, styles, tests, the vendoring tools and a unit manifest. Nothing in it depends on a path outside it, and its `tsconfig.json` stands alone.
- **A workbench.** `apps/workbench/` shows every unit alone with editable inputs; every unit has a story, and it exports as static files with no build.
- **The vendoring contract.** Each consumer pins a release in `<package>-lock.json` and runs `self:<package>:verify`, `drift`, `sync` and `defer`; the package's `AGENTS.md` publishes the sync paragraph every consumer carries word for word.
- **Consumers found, not listed.** The repository keeps no consumer register; consumers are the repositories on the local estate that hold its lock.
- **Release and re-vendor.** A change a consumer would notice is a release: bump the version locations, add a `CHANGELOG.md` section, tag `v<version>`, then ask each consumer to re-vendor; a deferral older than two releases becomes a query to the owner.

## Why an overlay, and why this name

The repository stays a general Project: it declares `primary_shape = "ki-repo-project"` and adds `[skills.ki-repo-packages]` with the vendored folder's name. `ki-repo` owns the primary-shape list, and this skill does not need a place on it to do its work, so it composes as an overlay rather than adding a new core shape; whether it should become one is left to the owner. The name follows the sibling convention that pairs a repository prefix with its shape skill, as `tools-*` repositories pair with `ki-repo-tools` and `mcp-*` with `ki-repo-mcp`: package repositories are named `packages-*`, so their skill is `ki-repo-packages`.

## Operating modes

Every governance skill carries the universal four **AUDIT · CONFORM · EDUCATE · REFRESH**.

### Mode HELP

Invoked as `help`, `-h` or `?`, explain the package shape, the overlay declaration, the modes and the off-ramps, then stop. With no recognisable mode, do the same, and offer a mode choice only in an interactive session.

### Mode AUDIT

Run `ki repo audit --skill ki-repo --repo <repo>` and `ki repo audit --skill ki-engineering --repo <repo>` first, then `ki repo audit --skill ki-repo-packages --repo <repo>` for the package delta. Apply the judgment criteria in [the rubric](references/rubric.md): generic units, the release rule as practised, change coverage in tests and the workbench, and the plain-JavaScript composition with `ki-engineering`. Report by location, criterion and fix, failures first.

### Mode CONFORM

Run AUDIT, then `ki repo conform --skill ki-repo-packages --repo <repo> --dry-run`. The host may regenerate the rubric publication; every other criterion is report-only, because moving units, rewriting the sync paragraph, changing a version or cutting a release needs the owner's intent. CONFORM never tags, releases, messages a consumer or edits a consumer's vendored copy.

### Mode EDUCATE

Explain the vendoring contract, the declaration and the release rule using `packages-stoa` as the worked case, then help a new package repository lay out `packages/<package>/`, the workbench and its `AGENTS.md` rules. Repository activation remains the `ki` command line's.

### Mode REFRESH

**Precondition:** REFRESH writes only this skill's canonical files in `ki-agentic-harness`. From an installed copy, stop and name the harness as where to run it.

Re-read the reference repository and [the sources](references/sources.md), propose a diff to the standard and rubric, and confirm before writing. When a second package repository appears, test each rule against it and narrow any that proves Stoa-specific.

## Coverage and off-ramps

- `ki-repo` owns the repository kind, the primary shape, universal files, GitHub settings and the commit gate; this overlay changes none of them.
- `ki-engineering` owns the toolchain, script names and tests; the standard records only where a plain-JavaScript package meets its intent rather than its TypeScript letter.
- `ki-repo-tools` owns installed command-line tools and the release-on-demand policy that also decides when a package releases.
- `ki-decision-records` owns decision-record identity, including records kept from a repository's earlier names.
- No `exemplars.md` is bundled: `packages-stoa` is the only package repository, and the layout and declaration in the standard already show the reusable shape.
