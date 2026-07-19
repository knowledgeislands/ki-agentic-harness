---
id: 'FND-001'
title: Normalise skill packaging after the checker rollout
status: in-progress
roadmap: foundation-tooling/normalise-skill-packaging-after-the-checker-rollout
blocks: —
blocked-by: —
---

## Context

The structured checker rollout establishes a uniform skill implementation, but review has exposed several mechanical packaging names and locations that should become correct before the fleet baseline is considered stable. Completing them together avoids repeatedly re-vendoring and conforming repositories while preserving one current-state contract with no compatibility layer.

## Current state

Knowledge Islands-specific frontmatter keys are not namespaced; `scripts/lib/` mixes explicitly published modules with skill-private support; and `ki-skills` remains classified as optional general governance despite becoming the self-governing checker-contract root. The target layout removes that ambiguity: published cross-skill modules live in `scripts/shared/`, while implementation-private support lives in `scripts/internal/`. The active checker rollout must finish before this plan changes those shared paths and declarations.

## Steps

1. ✓ Confirm every shipped governance checker passes its focused tests and the live `ki-skills` audit, then inventory every affected frontmatter key, parser, validator, source path, generated path, internal module, documentation reference, fixture, and installed footprint.
2. ✓ Rename `depends-on`, `vendors`, and `checker-dependencies` to their agreed `ki-`-prefixed forms everywhere in one current-state change; update resolution, validation, publication, tests, documentation, and generated projections without accepting an old spelling.
3. ✓ Move `ki-skills` to `skills/keystone/ki-skills`, update all source and documentation references plus generated skill maps, and retain `ki-bootstrap` as the only globally installed governance skill.
4. Retire the ambiguous `scripts/lib/` location: move explicitly published cross-skill modules to `scripts/shared/`, move unpublished `ki-bootstrap` and `ki-repo` support to `scripts/internal/`, update imports and focused tests, and add mechanical guards for both boundaries. Report every remaining `scripts/lib/` module as a packaging error requiring explicit disposition; do not close the plan while any remain.
5. Re-vendor `.ki-meta/`, run the serial repository gates, and conform every governed repository to the new source contract; verify that no legacy key, old `ki-skills` path, or misplaced private library remains.

## Files touched

- `skills/**/SKILL.md`
- `skills/keystone/ki-skills/**`
- `skills/**/scripts/{lib,shared,internal}/**`
- `.ki-meta/**`
- `.ki-config.toml`
- `docs/**`
- `package.json`
- checker, bootstrap, graph, publication, and fixture tests that encode the renamed paths or keys

## Verify

- `rg -n '(^|[^-])(depends-on|vendors|checker-dependencies):|skills/keystone/ki-skills|scripts/lib/' skills docs package.json .ki-meta`
- `bun run test`
- `bun run ki:audit`
- Every governed repository re-bootstraps and passes its aggregate audit without a compatibility alias.

## Dependencies / blocks

Execution begins only after the current structured checker rollout is complete and reviewed. This plan blocks declaring the post-rollout harness baseline stable and beginning broad repository deployment.
