---
id: 'FND-012'
title: Complete source-vendored dependency linking
status: acceptance
roadmap: foundation-tooling/complete-source-vendored-dependency-linking
blocks: —
blocked-by: —
---

## Context

FND-006 established the harness-only development model: source skills link their declared `scripts/vendored/` dependencies to canonical providers, while the generated `.ki-meta/` checker and educator payloads remain portable regular-file copies.

The source footprint is nearly conformant, but `ki-repo-roadmap` and `ki-tokenomics` each retain an identical regular-file `scripts/vendored/ki-skills/checker-reporter.ts`. The module has no declared canonical provider, so the bootstrap linker cannot maintain or verify it. This leaves source duplication that changes independently of the shared-module contract.

## Current state

`skills/keystone/ki-skills/scripts/shared/` publishes the declared `rubric`, `checker`, and `reporter` modules. The two identical `checker-reporter.ts` copies are imported by their local rubric contexts, but neither consuming skill declares `ki-skills:checker-reporter`.

The source-harness linking engine verifies the links it derives from `ki-shared-dependencies`, but it does not prove that every entry already present beneath a source skill's `scripts/vendored/` directory is declared and linked. The generated `.ki-meta/` trees correctly contain regular copies and are outside this source-link invariant.

## Steps

1. [x] Establish `checker-reporter` as the canonical `ki-skills` shared module under `scripts/shared/`, preserving its public exports and the standalone checker behaviour of its consumers. Extend `ki-skills`' shared-module declaration, checker-contract rubric, and focused tests so the published module list remains exact and self-governing.
2. [x] Declare `ki-skills:checker-reporter` in `ki-repo-roadmap` and `ki-tokenomics`, then replace each local source-vendored copy with the relative symlink maintained by the existing harness linker. Preserve the consumers' import paths and prove both links resolve to the new canonical module.
3. [x] Tighten the source-harness validation: enumerate every `scripts/vendored/` payload in canonical `skills/` sources, reject undeclared entries, regular files, dangling links, and links to a provider other than the declared shared-module payload. Keep directory-valued payloads valid where the declaration resolves to a directory, and do not apply this rule to `.ki-meta/` materialisation.
4. [x] Add focused bootstrap/linking tests covering `checker-reporter` resolution and publication, source regular-file and undeclared-payload failures, incorrect/dangling targets, valid file and directory module links, and proof that generated `.ki-meta/` copies remain regular and self-contained.
5. [x] Re-bootstrap this harness to refresh every generated checker, educator, manifest, and source-link footprint. Update only documentation whose contract wording changes, then run the serial repository gates.

## Files touched

- `skills/keystone/ki-skills/SKILL.md`, shared-module contract/rubric, and focused tests
- `skills/keystone/ki-skills/scripts/shared/checker-reporter.ts`
- `skills/general-governance/ki-repo-roadmap/SKILL.md` and source-vendored payload
- `skills/environment/ki-tokenomics/SKILL.md` and source-vendored payload
- `skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/` linker/audit code and tests
- regenerated `.ki-meta/` payloads and manifest

## Verify

- `checker-reporter` has one canonical `ki-skills` source and is declared in the provider's published shared-module list.
- The only two consumers declare `ki-skills:checker-reporter`; their source-vendored entries are symlinks resolving to that canonical file.
- Every source `skills/**/scripts/vendored/` entry is a declared, resolving link to the exact provider payload; a copied, undeclared, dangling, or misdirected entry fails the harness audit.
- The validation accepts a declared directory payload where supported and does not inspect generated `.ki-meta/` payloads as though they were development links.
- Generated checker and educator payloads contain dereferenced regular files and remain runnable in a bare consumer repository.
- `bun run ki:bootstrap:audit`
- focused `ki-skills` and bootstrap/linking tests
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This is a harness-internal completion of FND-006's linking contract. It does not alter ordinary repository vendoring, user installation, or the CLEAN, DOCTOR, UNINSTALL, and `kisle` lifecycle work.

## Acceptance

### Delivered

`checker-reporter` now has one canonical `ki-skills` source. Both former source copies are declared, resolving symlinks, and a source-harness bootstrap audit fails if a source-vendored payload is copied, undeclared, dangling, or misdirected.

### Summary of changes

- Added `skills/keystone/ki-skills/scripts/shared/checker-reporter.ts` and declared it in `ki-skills`' published shared-module list.
- Declared `ki-skills:checker-reporter` for `ki-repo-roadmap` and `ki-tokenomics`; their existing local import paths now resolve through generated relative symlinks.
- Extended the source shared-module synchroniser and `BOOT-13` to enforce the declared-link inventory on source harnesses only.
- Added regression coverage for a regular declared payload and an undeclared source-vendored payload, then refreshed the generated checker, educator, manifest, and rubric surfaces.

### Verification

- `bun skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/sync-shared-modules.test.ts` passed.
- `bun run test` passed.
- `bun run ki:audit` passed with zero FAIL and WARN findings.
- Verified source `scripts/vendored/` contains 105 symlinks and no regular payload files; generated `.ki-meta/` payloads remain regular copies.
- Implementation commit: `dfe3d779` (`feat(bootstrap): complete source payload linking`).

### Outstanding concerns

The source-link invariant is `BOOT-13` in `ki-bootstrap`, rather than a `ki-harness` container criterion: bootstrap owns declared shared-module publication and is the aggregate layer that audits generated governance. It deliberately excludes ordinary repository and `.ki-meta/` payloads.

### Mini recap

The existing shared-module declaration already provides the complete source-link inventory; the missing safeguard was validating that no extra source-vendored payload survived outside that declaration. Maintaining the check beside the synchroniser avoids a duplicate allowlist and preserves portable generated copies.
