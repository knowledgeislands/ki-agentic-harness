---
id: 'FND-008'
title: Define a canonical cross-runtime ki-self footprint
status: acceptance
roadmap: foundation-tooling/define-a-canonical-cross-runtime-ki-self-footprint
blocks: —
blocked-by: —
---

## Context

`ki-self` is repository-specific governance, not a harness-distributed skill.

Every supported runtime in a repository needs to discover the same repository-local instructions, but separate authored copies under `.agents/skills/` and `.claude/skills/` can drift.

## Current state

Runtime skill publication has a narrow preserved `ki-self` exception, but it does not define one runtime-neutral source or a uniform projection into every supported runtime.

The source location, generated-versus-authored boundary, migration rules, and recovery behaviour need a single explicit contract before automatic linking can be safe.

## Steps

1. ✓ Inventory existing `ki-self` locations, runtime discovery roots, bootstrap preservation logic, and CLEAN expectations; classify canonical authored state, generated projections, and legacy footprints.
2. Decide and document the canonical repository-owned source location and the projection owner, ensuring the source is runtime-neutral and works in repositories that do not contain a harness `skills/` tree.
3. Define the safety contract: supported-runtime selection, source validation, physical containment, relative-link construction, conflict handling, dry-run, idempotence, migration boundaries, and preservation of unproven local content.
4. Implement source creation or validation plus projections into `.agents/skills/ki-self` and `.claude/skills/ki-self` for each declared supported runtime, without changing ordinary harness-distributed runtime payload semantics.
5. Align bootstrap AUDIT, CONFORM, EDUCATE, and the planned CLEAN operation so they recognise the canonical source and projections without treating them as generated skill copies.
6. Add focused fixtures for each runtime, one-source/two-projection behaviour, absent and altered sources, unsafe parents, conflicts, dry-run, repeat, migration, and recovery; document the repository-author workflow.

## Files touched

- repository-local `ki-self` source and runtime projections
- `skills/keystone/ki-bootstrap/`
- `skills/keystone/ki-repo/` or the selected source owner
- local-governance and developer documentation
- bootstrap and runtime publication tests

## Verify

- A repository has exactly one canonical, committed `ki-self` source.
- Every declared supported runtime resolves its `ki-self` projection to that source.
- A repository without a harness `skills/` tree still supports `ki-self`.
- Generated payload publication, `.ki-meta/`, runtime agents, and unproven user content remain untouched.
- Normal bootstrap, EDUCATE, CONFORM, and CLEAN preserve the canonical source and handle projections according to the agreed contract.
- Dry-run and repeat runs are safe and informative.
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan is independent of FND-006: harness source links must preserve `ki-self`, while this plan establishes how any repository authors and projects it.

## Acceptance

- **Delivered:** One committed `.ki-self/SKILL.md` source, generated relative `.agents/skills/ki-self` and `.claude/skills/ki-self` projections, guarded migration and CLEAN behaviour, focused coverage, and the associated user and developer documentation.
- **Verification:** `bun run test` and `bun run ki:audit` both passed on 2026-07-20 after the acceptance lifecycle change landed.
- **Outstanding concerns:** None.
- **Mini recap:** Replacing a tracked runtime copy with a generated symlink can complicate Git staging while the link is present. Proposed learning route: document the safe migration sequence only if we see the pattern recur; no durable learning write is approved yet.
