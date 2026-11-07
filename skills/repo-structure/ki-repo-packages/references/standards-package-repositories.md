# Package repository standard

A **package repository** is the canonical source of one source tree that other repositories copy whole into themselves and build from: they **vendor** it. It ships no binary, installer, formula or registry package, and no consumer's build ever fetches it. [`packages-stoa`](https://github.com/knowledgeislands/packages-stoa), the source of the Stoa units the Knowledge Islands sites share, is the reference repository. The [generated rubric](rubric.md) holds the checkable criteria and [the sources](sources.md) the evidence. While [the migration overlay](standards-package-repositories-migration.md) exists, it lists the temporary adjustments to this final-state standard.

## Contents

- [How it differs from a tool repository](#how-it-differs-from-a-tool-repository)
- [Layout](#layout)
- [The vendoring contract](#the-vendoring-contract)
- [The sync paragraph](#the-sync-paragraph)
- [Consumers](#consumers)
- [Versions and releases](#versions-and-releases)
- [Changing the package](#changing-the-package)
- [Generic units](#generic-units)
- [Code form and the engineering standard](#code-form-and-the-engineering-standard)
- [Declaration](#declaration)

## How it differs from a tool repository

A `tools-*` repository under `ki-repo-tools` ships one command that users install. A package repository ships a tree that other repositories own a copy of, so its contract runs both ways: what the package must offer its consumers, and what each consumer must keep. The table sets the two side by side.

| Aspect | Tool repository | Package repository |
| --- | --- | --- |
| What ships | One command under `bin/`, an installer, a Homebrew formula | One source tree, `packages/<package>/`, copied whole into each consumer and pinned by a lock file |
| Layout | One tool at the root | Workspaces: the vendored package, a workbench app, and any repository-only checks |
| Version | The tool's own version | The vendored package's version locations; the root is never released |
| Release | Tag, build artefacts, update the formula | Bump the version locations, add a changelog section, tag; then ask each consumer to re-vendor |
| Consumers | Installed by users | Repositories that keep a locked copy, found by scanning the local estate |

## Layout

```text
packages-<name>/
├── packages/
│   ├── <package>/          # THE vendored tree: the units, their styles, tests, the vendoring tools and the unit manifest
│   └── <check>/            # optional repository-only workspaces, such as a boundary proof; never vendored
├── apps/
│   └── workbench/          # every unit on its own with editable sample inputs: the visual check before a release
├── CHANGELOG.md            # one section per release, breaking changes marked
├── AGENTS.md               # the change and release rules and the sync paragraph consumers carry
├── package.json            # private workspace root, never released
└── .ki.toml                # [skills.ki-repo-packages] package = "<package>"
```

`packages/<package>/` holds exactly what a consumer copies: nothing outside it reaches a consumer, and nothing inside it may depend on a path outside it. Its own `package.json` carries the release version. A unit manifest beside it, such as Stoa's `units.json5`, lists the units and carries the same version where the package keeps one.

The workbench shows each unit alone with sample inputs anyone can edit, and logs its events and state. Every unit has one story there. It refers to its files relatively, so that it can be exported and published as static files from any folder; it has no build of its own.

## The vendoring contract

A consumer copies `packages/<package>/` whole and records the release in a lock file at its root, `<package>-lock.json`, with a SHA-256 hash of the copied tree. The vendoring tools ship inside the vendored tree, so every consumer runs the same version of them, and each consumer exposes them as package scripts named `self:<package>:<verb>`:

- `verify` fails the consumer's build on any local edit to the vendored copy.
- `drift` shows what upstream has changed since the locked release.
- `sync` re-vendors a release and rewrites the lock.
- `defer` declines a release, recording the release, a reason and, where the consumer's main line is the subject, its commit, in the lock.

A change the consumer needs is made upstream first and then re-vendored; the vendored copy is never edited in place.

## The sync paragraph

The package repository's `AGENTS.md` publishes one paragraph, as a block quotation under its own heading, that every consumer's `AGENTS.md` carries word for word. It names the vendored path and the lock, forbids local edits, routes changes upstream, and names `verify`, `drift`, `sync` and `defer`. Changing it is a release: consumers take the new wording when they next re-vendor.

## Consumers

The package repository keeps no list of its consumers. Kris set this on 1 November 2026: "There should be no reference out of Knowledge Islands to other territories", and where the package needs to know its consumers, "it can look for patterns that it knows about that would identify that it's been used. It shouldn't have a finite list of them". A consumer is any repository on a Rig host's local estate that holds the package's lock file; the lock gives its release and any deferral.

## Versions and releases

When to release is decided by the release-on-demand policy `ki-repo-tools` owns: hold by default, release when something needs it, and never as a side effect of delivering work. A change to `packages/<package>/` that a consumer would notice is a release; a change outside it, to the workbench, the checks or the repository's own files, is not, and a behaviour-neutral change to the vendored tree still changes every consumer's lock hash at the next re-vendor, so it waits for a release that needs it.

A release:

1. bumps the version in `packages/<package>/package.json` and in the unit manifest where it carries one, the two always agreeing; the root `package.json` keeps its own unreleased version;
2. adds a `CHANGELOG.md` section for the version, marking breaking changes;
3. tags `v<version>`;
4. asks each consumer, found as above, to re-vendor: "run `drift`, then `sync` or `defer` with a reason, and report back".

A consumer whose deferral is older than two releases becomes a query to the owner. The release is published by the push of its tag; nothing is built or uploaded.

## Changing the package

Every change to a unit comes with its tests in the vendored tree and a look in the workbench; a new unit gets a workbench story. The repository's `AGENTS.md` states this change rule and the release rule above, so an agent working in the repository meets both before it changes anything.

## Generic units

The units stay generic. Anything that one consumer or one organisation needs reaches a unit only through configuration, a slot, a namespaced custom property or the consumer's own adapter, never as a constant inside the unit. No consumer, site or organisation name appears anywhere in the vendored tree.

## Code form and the engineering standard

A package repository has a `package.json` and declares `ki-engineering`, which governs its toolchain, scripts and tests. Where the package is plain JavaScript, `ki-engineering`'s intent applies rather than its TypeScript letter:

- Units, tests and the vendoring tools may stay plain ES modules typed with JSDoc and checked by `tsc --checkJs`. Each workspace `tsconfig.json` sets `allowJs` and `checkJs` and keeps the house compiler invariants. Tool configurations whose names the convention fixes, such as `commitlint.config.ts` and `.dependency-cruiser.ts`, are TypeScript, and the root `tsconfig.json` checks them.
- The package declares `"type": "module"`, so modules use `.js`, never `.mjs`.
- `packages/<package>/tsconfig.json` stands alone and never `extends` another configuration: a consumer vendors that folder, and an `extends` would resolve against the consumer's root.
- The module-boundary proof is a test run by the workspace test runner, its rules drawn from the repository's own boundaries, such as "no runtime dependency".
- Repository scripts follow the house script names: `test`, `self:typecheck`, `self:lint`, `self:workbench` and `self:workbench:export <folder>`. `self:<package>:*` belongs to consumers' vendoring tools.
- The workbench has no `build` script on purpose; it writes output only when someone exports it to a folder they choose.

## Declaration

A package repository declares `repo_type = "project"`, `primary_shape = "ki-repo-project"`, and this skill as an overlay:

```toml
[skills.ki-repo-packages]
package = "stoa"
```

`package` names the folder under `packages/` that consumers vendor; it is required, and every other key is unknown and warned. The overlay adds the package delta to the general Project baseline; it neither selects nor replaces the primary shape, so the general Project commit gate and `ki-repo`'s universal files still apply.
