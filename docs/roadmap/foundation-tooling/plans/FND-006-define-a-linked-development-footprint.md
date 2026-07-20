---
id: 'FND-006'
title: Define a linked development footprint for the harness
status: in-progress
roadmap: foundation-tooling/define-a-linked-development-footprint-for-the-harness
blocks: —
blocked-by: —
---

## Context

Normal EDUCATE must publish regular, self-contained files so a governed repository works independently of the harness source checkout.

The harness repository itself also contains generated runtime copies and copy-based shared-module payloads below dependent skills' `scripts/vendored/` directories. Both make local harness development slower to inspect and easy to let drift from canonical sources.

## Current state

EDUCATE publishes copied runtime skill payloads and generated `.ki-meta/` machinery. `sync-shared-modules.ts` copies each declared cross-skill module into the dependent skill's `scripts/vendored/<provider>/` namespace, while the educator path writes the declared `ki-bootstrap:educator` payload, so ordinary checker payloads remain standalone.

The copied form is correct for ordinary repositories and for zero-install governance, but is not necessarily the most useful working footprint for a developer changing the harness in its own source checkout. A source harness can link its own declared runtime skill payloads and every frontmatter-declared inter-skill payload below `scripts/vendored/` without making consumer repositories checkout-dependent.

The boundaries between runtime skill publication, `.ki-meta/` vendoring, and repository-local development links are not yet explicit enough to automate safely.

## Steps

1. ✓ Inventory the harness's copied and generated surfaces, classifying canonical sources, self-contained generated machinery, ordinary runtime payloads, copied shared modules, and development-link candidates; prove which surfaces must remain regular copies.
2. ✓ Decide and document the publication boundary: `ki-bootstrap` detects a harness target and links its locally authored runtime payloads, while ordinary repositories retain normal copy publication.
3. Define one safety contract for both link layers: explicit source-harness eligibility; generated-marker provenance; frontmatter-declared `ki-shared-dependencies` and `ki-bootstrap:educator` provenance; physical containment; no unsafe-parent traversal; conflict handling; dry-run; idempotence; and fail-closed treatment of every unproven payload.
4. Implement the runtime-payload link layer, replacing only eligible declared skill copies beneath each supported runtime root with canonical-source symlinks; preserve `.ki-meta/`, runtime agents, authored paths, and explicit links.
5. Implement the intra-skill payload link layer, replacing only frontmatter-declared `scripts/vendored/<provider>/` payloads with canonical provider-module links and adapting source integrity checks so ordinary EDUCATE never vendors a link into a consumer repository.
6. Prove both lifecycles: harness EDUCATE restores its intended source links, while ordinary EDUCATE and inter-skill payload synchronisation restore regular local payloads.
7. Add focused runtime, marker, declaration, containment, conflict, dry-run, repeat, harness-EDUCATE, ordinary-EDUCATE, and synchronisation tests; document the harness-specific behaviour separately from user installation and repository bootstrap.

## Files touched

- `skills/repo-structure/ki-harness/`
- `skills/keystone/ki-bootstrap/`
- `skills/keystone/ki-skills/`
- runtime skill publication and bootstrap tests
- developer linking guidance
- generated harness footprint only during focused verification

## Verify

- An ordinary repository remains copy-based after EDUCATE.
- The harness development operation links only known, marker-proven runtime skill payloads beneath supported runtime roots and frontmatter-declared inter-skill payloads beneath source skills.
- `.ki-meta/`, runtime agents, authored paths, explicit links, changed payloads, and unrelated paths are preserved.
- EDUCATE restores regular runtime copies, inter-skill payload synchronisation restores regular local payloads, and a subsequent development-link run restores the intended links.
- Dry-run and repeat runs are safe and informative.
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan is deliberately independent of FND-004 and FND-005.

It must settle both link layers' ownership and safety model before changing any repository footprint.
