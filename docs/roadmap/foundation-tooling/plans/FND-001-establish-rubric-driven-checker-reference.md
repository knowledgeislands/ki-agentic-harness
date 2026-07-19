---
id: 'FND-001'
title: Establish a rubric-driven checker reference
status: open
roadmap: foundation-tooling/establish-a-rubric-driven-checker-reference
blocks: —
blocked-by: —
---

## Context

Checker implementations currently repeat rule wording, finding construction, transport shaping, and vestigial terminal narration in several places. Establish one small, working reference before attempting a broader checker migration, so later work can copy a proven boundary rather than rediscover it per skill.

## Current state

`ki-skills` defines the canonical checker reporter and its JSONL contract, while `ki-engineering` has a real checker/conformer implementation and still carries no-op `say` and `log` calls from its former terminal narration. Rubrics, checker evidence, reporter transport, and aggregate rendering are conceptually distinct but their practical boundary is not yet demonstrated by one concise implementation and test set.

## Steps

1. Trace the existing `ki-engineering` rubric, checker contract, audit/conform scripts, local reporter payload, and aggregate consumer; record the smallest precise contract needed for this reference without changing unrelated skill behaviour.
2. Make the rubric authoritative for each reference finding's stable identifier, title, kind (`M` or `J`), and level; make the engineering checker attach only criterion code, evidence, location, and available corrective action to that declared criterion.
3. Remove the engineering conformer's obsolete no-op narration and any duplicate presentation path, leaving canonical reporter JSONL as direct checker output and the aggregate as the sole human renderer.
4. Add focused adjacent tests proving the reference contract: emitted JSONL remains complete, judgment findings retain their advisory treatment, exit status follows mechanical failures only, and default aggregate reporting filters findings without suppressing collection.
5. Document a compact reference checklist beside the checker contract for a later, separately planned rollout; keep that rollout, criterion-code catalogue changes, and GOV-002's lifecycle work out of this plan.
6. Re-vendor affected checker payloads, run focused tests, then run `bun run test` and `bun run ki:audit` serially; record any follow-on migration work as a new roadmap item rather than expanding this plan.

## Files touched

- `skills/foundations/ki-engineering/`, including its rubric, checker contract, audit/conform scripts, reporter payload, and adjacent tests.
- `skills/general-governance/ki-skills/` only where the canonical reporter contract needs a narrowly evidenced clarification.
- Generated `.ki-meta/` copies for affected coverage-scoped checkers.
- This plan and the Foundation Tooling roadmap/index while it is active.

## Verify

1. Focused `ki-engineering` tests demonstrate JSONL collection, severity and `M`/`J` classification, exit status, and aggregate filtering independently.
2. `bun run ki:engineering:audit` and `bun run ki:engineering:conform` emit only canonical checker reporter output directly, with no terminal narration path.
3. `bun run test` and `bun run ki:audit` pass serially after re-vendoring.
4. A reviewer can identify one unambiguous source for criterion metadata, collection, transport, and rendering without following duplicated implementation paths.

## Dependencies / blocks

This plan deliberately has no dependency on GOV-002. GOV-002 is a later cross-model lifecycle alignment and must not broaden or delay the checker reference work.
