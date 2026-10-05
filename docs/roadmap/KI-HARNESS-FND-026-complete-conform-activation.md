---
id: KI-HARNESS-FND-026
area: FND
title: Complete conform activation
theme: foundation-tooling
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T05:34:19Z
updated_at: 2026-10-05T08:06:52Z
---

## Goal

`ki repo conform --skill ki-engineering` leaves a repository with an explicit, verifiable activation state whenever it adds package-backed tooling. A later commit must not be the first place the user learns that newly bound hooks cannot load their declared dependencies.

## Context

A reproducible review finding from `kit-midnight.ninja` on 25 September 2026 starts with a Bun repository whose Commitlint toolchain is absent. Engineering conform repairs `PKG-5` and `SCR-11`: it adds `@commitlint/cli` and `@commitlint/config-conventional` to `devDependencies`, writes `commitlint.config.ts`, and creates a Husky `commit-msg` hook that invokes `bunx commitlint --edit "$1"`.

Conform does not run `bun install` or report an installation requirement. Its re-audit reads the corrected manifest and hook files, so it passes even though the local dependency graph is unchanged. The next commit then fails with `Cannot find module "@commitlint/config-conventional"`, making the conform consequence look like an unrelated commit problem.

This is broader than Commitlint: any conform action that declares an executable package dependency and immediately binds a script or hook can create the same declared-but-inactive state.

## Boundary

In scope: a harness-side diagnostic criterion in `ki-engineering` that reports declared-but-uninstalled toolchain packages with the exact activation step, so the existing conform re-audit distinguishes files conformed (`PKG-5`, `SCR-11` pass) from dependencies installed (the new criterion), and the matching standard text.

Out of scope: any automatic or optional `bun install` from conform, now or as a confirmed action; weakening the Git hooks or teaching users to bypass them; general dependency updates or package-manager support beyond the selected toolchain; and any host-side change in `tools-ki`, such as a new proposal field or report section, which would be a separate trade. Commit-time refusal when tooling is absent is [KI-HARNESS-GOV-109](KI-HARNESS-GOV-109-fail-when-commit-gates-absent.md).

## Current state

`PKG-5` in `skills/governance/ki-engineering/scripts/rubric/items/package.ts` checks only that the toolchain is declared in `package.json`. No `ki-engineering` criterion reads whether a declared toolchain package is present under `node_modules`. `standards-engineering.md` already tells the reader to finish a first hook binding with `bunx syncpack format`, then `bun install`, then re-audit, but nothing in the conform result says so. The `tools-ki` conform operation (`src/core/repository/operations/conform.ts`) already re-audits after applying writes and reports the remaining findings, so a new audit outcome reaches the conform report without a host change.

## Steps

- [ ] Add `PKG-7 [M]` "Declared toolchain is installed" to `scripts/rubric/items/package.ts`, level `WARN`, remediation class `diagnostic` with guidance naming `bun install` at the repository root and a re-run of `ki repo audit --skill ki-engineering`. It has no conform action.
- [ ] Compute its evidence in `scripts/rubric/contexts/audit-evidence.ts`: for each `PKG-5` toolchain package declared in `devDependencies`, require `node_modules/<name>/package.json` at the repository root; report `PASS` when all are present, `WARN` listing the missing names plus the exact step when any are absent, and `NOT_APPLICABLE` when nothing is declared. Read only; never spawn a package manager.
- [ ] Add `PKG-7` to the expected code list and add a fixture in `scripts/rubric/items/index.test.ts`: a Bun repository without Commitlint and without `node_modules`; apply the engineering conform proposal; re-audit and assert `PKG-5` and `SCR-11` pass while `PKG-7` warns naming both Commitlint packages and `bun install`; then create the package directories and assert `PKG-7` passes.
- [ ] Amend the hook-binding paragraph in `references/standards-engineering.md` to state that conform repairs declarations only, that `PKG-7` carries the pending activation step, and that conform never installs.
- [ ] Regenerate `references/rubric.md` with `ki dev skill rubric ki-engineering`.

## Files touched

- `skills/governance/ki-engineering/scripts/rubric/items/package.ts`
- `skills/governance/ki-engineering/scripts/rubric/contexts/audit-evidence.ts`
- `skills/governance/ki-engineering/scripts/rubric/items/index.test.ts`
- `skills/governance/ki-engineering/references/standards-engineering.md`
- `skills/governance/ki-engineering/references/rubric.md` (generated)

## Verify

Acceptance criteria, each judgeable by someone who did not write this:

1. On the fixture after conform, the audit shows `PKG-5` and `SCR-11` passing and `PKG-7` warning with the missing package names and the literal step `bun install`.
2. After the packages are present, `PKG-7` passes and no other outcome changes.
3. No code path added by this item runs a package manager or writes outside the existing conform proposal.
4. `ki repo audit --skill ki-engineering` on this repository, with dependencies installed, reports `PKG-7` `PASS`.
5. The standard states that conform repairs files and reports activation, and does not install.

```bash
bun run test
bunx tsc --noEmit
ki dev skill rubric ki-engineering
ki repo audit --skill ki-engineering --progress never
```

## Dependencies / blocks

None. Cross-reference with [KI-HARNESS-GOV-109](KI-HARNESS-GOV-109-fail-when-commit-gates-absent.md): the same absent dependency graph seen at commit time rather than conform time. Each stands alone and neither supersedes the other. If the conform report later needs a distinct activation section rather than a re-audit finding, that is a `tools-ki` trade raised from this record, not part of it.

## Documentation impact

### Decision Records

None. The no-install boundary is recorded in this record's Discussion and the standard.

### Specifications

`standards-engineering.md` states that conform repairs declarations and reports activation through `PKG-7`.

### Guides

None.

### Roadmap

None.

## Discussion

### Safe default

The safe default is for conform to report an exact required activation step before the repaired capability can be treated as effective. The result distinguishes files conformed from dependencies installed, and re-audit is not presented as proof that a newly introduced executable can load locally.

Decided 2026-10-05: no install, confirmed or otherwise. Install authority does not follow from permission to repair repository files, and transaction clarity, package-manager selection, lockfile review and failure recovery are host concerns this item does not take on.

### Verification shape

The fixture has no installed Commitlint packages, applies the `PKG-5` and `SCR-11` conform proposal, and proves the resulting report exposes the pending activation. Presence of the package directories stands in for the stated install step, so the test stays offline; the hook's own loading behaviour is covered by [KI-HARNESS-GOV-109](KI-HARNESS-GOV-109-fail-when-commit-gates-absent.md)'s stub test.
