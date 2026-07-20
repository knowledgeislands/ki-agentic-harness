---
id: 'FND-004'
title: Make plan-to-roadmap linkage explicit
status: in-progress
roadmap: foundation-tooling/make-plan-to-roadmap-linkage-explicit
blocks: —
blocked-by: —
---

## Context

An active plan currently identifies its canonical roadmap item through `roadmap:` frontmatter, while `docs/roadmap/README.md` supplies the global plan index.

The canonical thematic roadmap does not show that a particular item has an active plan.

This one-way relationship makes focused roadmap review unnecessarily indirect and allows the local roadmap view to obscure the execution artifact.

## Current state

`ki-repo-roadmap` already requires each active plan to resolve uniquely to one `Blocking` or `Next` item in its own theme.

The current audit rejects two plans for the same locator, and CONFORM regenerates the root portfolio and global index, but neither audits nor publishes an inverse reference in the canonical theme roadmap.

`ki-plan` creates, promotes, progresses, and closes plans through safe transactions that currently update plan files and generated projections but do not own a local plan reference in the theme roadmap.

## Steps

1. ✓ Define the canonical local plan-reference syntax, placement, and ownership in the repository-roadmap standard and plan format, keeping one active plan per qualified roadmap locator.
2. Extend the roadmap evidence model and rubric so AUDIT detects missing, stale, duplicate, or mismatched local plan references without treating authored item prose as generated content.
3. Extend CONFORM to derive and safely repair only the local reference line, preserving the surrounding authored item prose, then cover it with focused thematic fixtures.
4. Update `ki-plan` lifecycle transactions so `new`, `promote`, `execute`, and `done` atomically create, maintain, or remove the local reference alongside the plan and generated index.
5. Run focused roadmap and lifecycle checks, then the serial repository gates; use the resulting clean thematic roadmap as the worked proof.

## Files touched

- `skills/general-governance/ki-repo-roadmap/`
- `skills/process/ki-plan/`
- `docs/roadmap/foundation-tooling/`
- generated roadmap projections where required

## Verify

- A new plan is visible from exactly one canonical `Blocking` or `Next` roadmap item in its own theme.
- AUDIT rejects absent, stale, duplicate, or cross-theme local plan references.
- CONFORM repairs only the derivable reference, preserving the item's authored prose.
- `ki-plan` lifecycle documentation and transactions maintain the local reference through creation and closure.
- `bun skills/general-governance/ki-repo-roadmap/scripts/repo-roadmap.test.ts`
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan has no external dependency.

It should land before broader plan-lifecycle refinements so thematic roadmaps remain the complete local view of active work.
