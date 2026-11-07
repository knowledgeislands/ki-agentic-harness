<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Knowledge Islands package repository shape

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-repo-packages --write`.

Line-by-line criteria for auditing ki-repo-packages. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [CONFIG — Package declaration](#config--package-declaration)
- [PKG — Package repository shape](#pkg--package-repository-shape)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## CONFIG — Package declaration

→ [standard](standards-package-repositories.md)

The overlay declaration that names the vendored package.

- **CONFIG-1 [M] — the declaration names the vendored package** — The `package` key names a physical folder under `packages/`, the tree consumers vendor. (standards-package-repositories.md#declaration)
  - _Remediation:_ diagnostic — Set `package` in `[skills.ki-repo-packages]` to the folder under `packages/` that consumers copy.
- **CONFIG-2 [M] — the declaration has no unknown keys** — Every key in `[skills.ki-repo-packages]` other than `package` is unknown and surfaced. (standards-package-repositories.md#declaration)
  - _Remediation:_ diagnostic — Remove the unknown key; `package` is the only setting.

## PKG — Package repository shape

→ [standard](standards-package-repositories.md)

The vendored package, workbench, sync paragraph, consumers, releases and code form.

- **PKG-1 [M] — the vendored package carries its release version** — The vendored package's own `package.json` carries a semantic version, the version consumers lock. (standards-package-repositories.md#versions-and-releases)
  - _Remediation:_ diagnostic — Give `packages/<package>/package.json` the current release version; the root stays unreleased.
- **PKG-2 [M] — the changelog records the current release** — `CHANGELOG.md` has a section headed with the vendored package’s current version. (standards-package-repositories.md#versions-and-releases)
  - _Remediation:_ diagnostic — Add the release’s `CHANGELOG.md` section, marking breaking changes.
- **PKG-3 [M] — a workbench shows the units** — `apps/workbench/` exists to show every unit alone before a release. (standards-package-repositories.md#layout)
  - _Remediation:_ diagnostic — Add the workbench app with one story per unit.
- **PKG-4 [M] — AGENTS.md publishes the sync paragraph** — A block quotation in `AGENTS.md` names the vendored path and the `verify`, `drift`, `sync` and `defer` tools, for every consumer to carry word for word. (standards-package-repositories.md#the-sync-paragraph)
  - _Remediation:_ diagnostic — Publish the sync paragraph as a block quotation under its own heading in AGENTS.md.
- **PKG-5 [M] — the vendored tsconfig stands alone** — The vendored package’s `tsconfig.json` extends no other configuration, which would resolve against each consumer’s root. (standards-package-repositories.md#code-form-and-the-engineering-standard)
  - _Remediation:_ diagnostic — Inline the compiler options the vendored tsconfig.json inherits and drop its `extends`.
- **PKG-6 [M] — no consumer register** — The repository keeps no list of its consumers; they are found by the lock file they hold. (standards-package-repositories.md#consumers)
  - _Remediation:_ diagnostic — Find consumers by scanning the local estate for the package’s lock file, then retire the register.
- **PKG-J1 [J] — units stay generic** — Consumer or organisation detail reaches a unit only through configuration, a slot, a namespaced custom property or the consumer’s adapter, and no consumer name appears in the vendored tree. (standards-package-repositories.md#generic-units)
  - _Evidence scope:_ Every unit, style and vendoring tool in the vendored tree.
  - _Review prompt:_ Does any unit hold a constant, name or branch that serves one consumer or organisation rather than a configurable, generic behaviour?
  - _Outcomes:_ conforming; generalisation required; owner decision required
  - _Conforming guidance:_ Move the consumer-specific detail behind configuration, a slot, a custom property or the consumer’s adapter, and remove any consumer name from the vendored tree.
- **PKG-J2 [J] — releases follow the release and re-vendor rule** — Each release bumps the agreeing version locations, adds its changelog section, is tagged `v<version>` and asks each consumer to re-vendor; a deferral older than two releases is raised with the owner. (standards-package-repositories.md#versions-and-releases)
  - _Evidence scope:_ The latest releases: version locations, changelog sections, tags, the notices sent and consumers’ deferrals.
  - _Review prompt:_ Do the version locations agree with the tag and changelog, was each consumer asked to re-vendor, and is any deferral older than two releases still unraised?
  - _Outcomes:_ conforming; release correction required; owner query required
  - _Conforming guidance:_ Bring the version locations, changelog and tag into agreement; send the missing re-vendor notices; raise stale deferrals with the owner.
- **PKG-J3 [J] — unit changes carry tests and a workbench story** — Every unit change has its tests in the vendored tree, and every unit has one workbench story. (standards-package-repositories.md#changing-the-package)
  - _Evidence scope:_ Recent unit changes and the workbench stories against the unit manifest.
  - _Review prompt:_ Does each changed unit carry tests, and does every unit in the manifest have exactly one workbench story?
  - _Outcomes:_ conforming; test coverage required; workbench story required
  - _Conforming guidance:_ Add the missing tests beside the unit and the missing story to the workbench.
- **PKG-J4 [J] — plain JavaScript meets the engineering intent** — Where the package is plain JavaScript, it is typed with JSDoc and checked by `tsc --checkJs`, uses `.js` modules, keeps fixed-name tool configurations in TypeScript and uses the house script names. (standards-package-repositories.md#code-form-and-the-engineering-standard)
  - _Evidence scope:_ Workspace tsconfig files, module extensions, tool configurations, the boundary proof and package scripts.
  - _Review prompt:_ Does each workspace type-check its JavaScript with `checkJs` under the house invariants, and do the scripts and boundary proof meet the engineering standard’s intent?
  - _Outcomes:_ conforming; toolchain revision required; engineering exception to record
  - _Conforming guidance:_ Enable `allowJs` and `checkJs`, rename `.mjs` to `.js`, keep fixed-name configurations in TypeScript and use the house script names; record any exception where it is raised.

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic
