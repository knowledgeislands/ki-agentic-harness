---
id: '002'
title: Make vendored EDUCATE operations standalone and dispatchable
status: open
roadmap: foundation-tooling/make-vendored-educate-operations-standalone-and-dispatchable
blocks: foundation-tooling/003
blocked-by: foundation-tooling/001
---

## Context

Every governed target should be able to run a selected skill's EDUCATE operation from its local checker payload, without requiring a harness checkout or treating bootstrap's re-sync operation as that skill's EDUCATE implementation.

`ki-educate` must therefore distinguish target-wide re-bootstrap from a target-local, selected per-skill EDUCATE dispatch.

## Current state

Skills declare EDUCATE as a vendorable mode, but bootstrap does not consistently copy a standalone EDUCATE payload and the target-local `ki-educate` surface does not dispatch it.

The current no-skill meaning must remain a deliberate re-bootstrap action, while a named skill must run only that skill's locally vendored EDUCATE payload.

## Steps

1. Define the target-local `ki-educate` contract against `.ki-meta/checkers/`: no skill name re-bootstrap the governed set; one safe skill name dispatches that checker's local `educate.ts`; unknown, absent, or unsafe payloads fail clearly without writing.
2. Extend bootstrap manifests and publication so every selected governance skill with an EDUCATE payload vendors its standalone implementation and any declared local checker dependencies.
3. Remove harness-relative seed delegation from copied EDUCATE payloads. Keep source `educate.ts` thin where appropriate, but ensure the copied target-local version has everything required to run from the target.
4. Update aggregate wrappers, HELP, derived scripts, standards, guides, and tests to document the two dispatch paths and their explicit write/dry-run semantics.
5. Test a fresh target after removing the harness source path: per-skill EDUCATE remains runnable from `.ki-meta/checkers/`, while no-skill EDUCATE performs only the documented re-bootstrap path.
6. Re-vendor the harness, run focused bootstrap and entrypoint tests, then run `bun run test` and `bun run ki:audit` sequentially.
7. Re-bootstrap representative consumer repositories and verify both target-local per-skill dispatch and whole-set re-bootstrap according to their selected skills.

## Files touched

- `skills/keystone/ki-bootstrap/scripts/`
- Governance skills' `scripts/educate.ts` payloads and local dependencies
- `.ki-meta/bin/ki-educate`, aggregate wrappers, and generated manifests
- `skills/**/SKILL.md`, references, guides, and tests describing EDUCATE
- Representative consumer repositories' generated checker payloads

## Verify

- `./.ki-meta/bin/ki-educate <selected-skill>` runs a local standalone payload with no harness checkout available.
- `./.ki-meta/bin/ki-educate` retains the documented whole-set re-bootstrap behaviour.
- Unselected, unknown, malformed, and unsafe skill selections fail closed and write nothing.
- Every selected governance skill declaring EDUCATE has a vendored local payload under `.ki-meta/checkers/`.
- Harness and representative consumer test/audit gates pass sequentially.

## Dependencies / blocks

Blocked by `foundation-tooling/001`, which establishes the final target-local checker path.

It blocks `foundation-tooling/003` to preserve the requested execution order.
