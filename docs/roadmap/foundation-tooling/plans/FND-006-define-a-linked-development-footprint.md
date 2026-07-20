---
id: 'FND-006'
title: Define a linked development footprint for the harness
status: open
roadmap: foundation-tooling/define-a-linked-development-footprint-for-the-harness
blocks: —
blocked-by: —
---

## Context

Normal EDUCATE must publish regular, self-contained files so a governed repository works independently of the harness source checkout.

The harness repository itself also contains many generated runtime copies, which makes local harness development slower to inspect and easy to let drift from the canonical skill source.

## Current state

EDUCATE publishes copied runtime skill payloads and generated `.ki-meta/` machinery.

The copied form is correct for ordinary repositories and for zero-install governance, but is not necessarily the most useful working footprint for a developer changing the harness in its own source checkout.

The boundaries between runtime skill publication, `.ki-meta/` vendoring, and repository-local development links are not yet explicit enough to automate safely.

## Steps

1. Inventory the harness's copied and generated surfaces, classifying each as canonical source, self-contained generated machinery, ordinary runtime payload, or a candidate development link; prove which surfaces must remain regular copies.
2. Decide and document the owner and name of the development-link operation, including whether it belongs to `ki-bootstrap` or `ki-repo`, and define its supported runtime roots without extending normal EDUCATE semantics.
3. Define the safety contract: explicit harness-root eligibility, marker/provenance verification, physical containment, no unsafe-parent traversal, conflict handling, dry-run, and idempotence.
4. Implement the smallest operation that replaces only eligible copied runtime skill directories with canonical-source symlinks; preserve `.ki-meta/`, authored paths, explicit user links, and every unproven payload.
5. Prove the reversible lifecycle: normal EDUCATE replaces development links with regular copies, and a subsequent development-link operation safely restores the links without touching unrelated content.
6. Add focused runtime, marker, containment, conflict, dry-run, repeat, and EDUCATE-then-link tests; document the developer-only workflow separately from user installation and repository bootstrap.

## Files touched

- `skills/keystone/ki-bootstrap/` or `skills/keystone/ki-repo/`, once ownership is decided
- runtime skill publication and bootstrap tests
- developer linking guidance
- generated harness footprint only during focused verification

## Verify

- An ordinary repository remains copy-based after EDUCATE.
- The harness development operation links only known, marker-proven runtime skill payloads beneath supported runtime roots.
- `.ki-meta/`, authored paths, explicit links, changed payloads, and unrelated paths are preserved.
- EDUCATE restores regular copies; a subsequent development-link run restores the intended links.
- Dry-run and repeat runs are safe and informative.
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan is deliberately independent of FND-004 and FND-005.

It must settle its ownership and safety model before changing any repository footprint.
