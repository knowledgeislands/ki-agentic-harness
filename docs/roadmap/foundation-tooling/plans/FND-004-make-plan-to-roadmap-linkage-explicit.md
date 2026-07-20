---
id: 'FND-004'
title: Make plan-to-roadmap linkage explicit
status: done
roadmap: foundation-tooling/make-plan-to-roadmap-linkage-explicit
blocks: —
blocked-by: —
---

## Context

An active plan identifies its canonical roadmap item through `roadmap:` frontmatter, while `docs/roadmap/README.md` supplies the global plan index.

The canonical thematic roadmap must also show that a particular item has an active plan.

This relationship makes focused roadmap review direct and keeps the local roadmap view complete.

## Current state

`ki-repo-roadmap` requires each active plan to resolve uniquely to one `Blocking` or `Next` item in its own theme.

AUDIT rejects two plans for the same locator, and CONFORM regenerates the root portfolio and global index.

`ki-plan` creates, promotes, progresses, and closes plans through safe transactions that maintain the local plan reference in the theme roadmap.

## Steps

1. ✓ Define the canonical local plan-reference syntax, placement, and ownership in the repository-roadmap standard and plan format, keeping one active plan per qualified roadmap locator.
2. ✓ Extend the roadmap evidence model and rubric so AUDIT detects missing, stale, duplicate, or mismatched local plan references without treating authored item prose as generated content.
3. ✓ Extend CONFORM to derive and safely repair only the local reference line, preserving the surrounding authored item prose, then cover it with focused thematic fixtures.
4. ✓ Update `ki-plan` lifecycle transactions so `new`, `promote`, `execute`, and `done` atomically create, maintain, or remove the local reference alongside the plan and generated index.
5. ✓ Run focused roadmap and lifecycle checks, then the serial repository gates; use the resulting clean thematic roadmap as the worked proof.

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

It landed before broader plan-lifecycle refinements so thematic roadmaps remain the complete local view of active work.

## Acceptance

### Delivered

Every active plan is now visible from the canonical roadmap item it executes, as well as from its own frontmatter and the global index.

### Summary of changes

- Added the derived `**Plan:**` reference to canonical `Blocking` and `Next` items and made it part of roadmap audit, conform, and safe lifecycle transactions.
- Updated the plan lifecycle so creation, progress, promotion, and closure cannot leave the item-to-plan inverse link stale.
- Added regression coverage for absent, stale, ambiguous, and correctly generated local references.

### Verification

- Focused `ki-repo-roadmap` coverage, `bun run test`, and `bun run ki:audit` passed on 2026-07-20.
- Code-evidence baseline: `339a17b5`; the linkage implementation has not changed since that restored review state.

### Outstanding concerns

None known. The reference is intentionally derived rather than authored prose, so CONFORM and the plan lifecycle own its exact placement and removal. Acceptance analysis can therefore focus on whether the local roadmap view is sufficient for human navigation, rather than on maintaining a second source of truth.

### Mini recap

The inverse reference proved that the canonical roadmap is a better local execution view when it is maintained as derived state. No additional durable learning route is proposed.

## Done

Accepted on 2026-07-20. Everything is in good order: active plans are visible from exactly one canonical roadmap item, while the generated reference remains separate from authored roadmap prose. This committed completion record precedes the separate deletion of the plan and its completed roadmap item.
