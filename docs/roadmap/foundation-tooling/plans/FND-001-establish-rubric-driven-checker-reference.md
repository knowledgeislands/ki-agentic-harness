---
id: 'FND-001'
title: Establish a rubric-driven checker reference
status: in-progress
roadmap: foundation-tooling/establish-a-rubric-driven-checker-reference
blocks: —
blocked-by: —
---

## Context

Checker implementations currently repeat rule wording, finding construction, transport shaping, and vestigial terminal narration in several places. Establish the root governance-skill contract in `ki-skills` first, then prove it in one dependent implementation before attempting a broader checker migration.

## Current state

`ki-skills` already owns the canonical reporter module and schema, but generic enforcement and checker-contract references live under `ki-engineering`; the two locations now overlap and disagree on legacy output flags and report files. `ki-engineering` remains a useful first dependent proof because its conformer still carries no-op `say` and `log` calls from former terminal narration. Rubrics, checker evidence, reporter transport, and aggregate rendering are conceptually distinct but their practical boundary is not yet demonstrated by one concise implementation and test set.

## Steps

1. Move the generic enforcement framework and mechanical-checker contract from `ki-engineering` to `ki-skills`; update every internal reference so `ki-skills` is the unambiguous checker-contract root, without retaining compatibility copies.
2. Consolidate the moved material with `ki-skills`' canonical reporter and schema: remove or correct stale duplicate claims, and define one precise boundary between rubric metadata, checker evidence, JSONL transport, and aggregate rendering.
3. Make the root rubric authoritative for each reference finding's stable identifier, title, kind (`M` or `J`), and level; make a checker attach only criterion code, evidence, location, and available corrective action to that declared criterion.
4. Use `ki-engineering` as the first dependent proof: remove its obsolete no-op narration and any duplicate presentation path, leaving canonical reporter JSONL as direct checker output and the aggregate as the sole human renderer.
5. Add focused adjacent tests proving the root contract and dependent proof: emitted JSONL remains complete, judgment findings retain their advisory treatment, exit status follows mechanical failures only, and default aggregate reporting filters findings without suppressing collection.
6. Document a compact reference checklist beside the root checker contract for a later, separately planned rollout; keep that rollout, criterion-code catalogue changes, and GOV-002's lifecycle work out of this plan.
7. Re-vendor affected checker payloads, run focused tests, then run `bun run test` and `bun run ki:audit` serially; record any follow-on migration work as a new roadmap item rather than expanding this plan.

## Files touched

- `skills/general-governance/ki-skills/`, including the root enforcement framework, checker contract, canonical reporter, schema, rubric, checker, and adjacent tests.
- `skills/foundations/ki-engineering/` as the first dependent proof, including its rubric, audit/conform scripts, reporter payload, and adjacent tests.
- Generated `.ki-meta/` copies for affected coverage-scoped checkers.
- This plan and the Foundation Tooling roadmap/index while it is active.

## Verify

1. Focused `ki-skills` tests demonstrate the root JSONL collection, severity and `M`/`J` classification, exit status, and aggregate filtering independently.
2. `bun run ki:engineering:audit` and `bun run ki:engineering:conform` emit only canonical checker reporter output directly, with no terminal narration path.
3. `bun run test` and `bun run ki:audit` pass serially after re-vendoring.
4. A reviewer can identify `ki-skills` as the unambiguous source for generic criterion metadata, collection, transport, and rendering without following duplicated implementation paths.

## Dependencies / blocks

This plan deliberately has no dependency on GOV-002. GOV-002 is a later cross-model lifecycle alignment and must not broaden or delay the checker reference work.
