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

`ki-skills` now owns the generic enforcement framework and checker contract as well as the canonical reporter module and schema. The root material still overlaps in places and retains stale claims about output flags and report files. `ki-engineering` remains a useful first dependent proof because its conformer still carries no-op `say` and `log` calls from former terminal narration.

```text
ki-skills
  ├─ what every governance skill contains
  ├─ how rubrics identify M/J criteria
  ├─ how checkers emit evidence
  ├─ how JSONL is transported and rendered
  └─ how checker modules are vendored safely
       ↓
all other governance skills
       ↓
ki-engineering as the first dependent proof
```

## Steps

- `ki-skills` is the sole owner of the governance-skill shape, rubric/checker relationship, severity ladder, canonical reporter, and checker-module vendoring rule.
- The enforcement framework, checker contract, canonical reporter, and schema have distinct, non-overlapping responsibilities with no legacy output or report-file model retained.
- A rubric is the sole source for each finding's stable code, title, type (`M` or `J`), and level; checkers record only evidence, location, and an available corrective action.
- Direct checkers emit complete canonical JSONL; the aggregate alone selects levels and renders human-readable output.
- `ki-skills` self-governs and proves the root contract through focused executable tests.
- `ki-engineering` is the first dependent proof, with its no-op narration and duplicate presentation path removed.
- A compact reference checklist captures the proven model for a later, separately planned skill-by-skill rollout; it does not absorb criterion-catalogue changes or GOV-002's lifecycle work.

## Files touched

- `skills/general-governance/ki-skills/`, including the root enforcement framework, checker contract, canonical reporter, schema, rubric, checker, and adjacent tests.
- `skills/foundations/ki-engineering/` as the first dependent proof, including its rubric, audit/conform scripts, reporter payload, and adjacent tests.
- This plan and the Foundation Tooling roadmap/index while it is active.

## Verify

1. Focused `ki-skills` tests demonstrate the root JSONL collection, severity and `M`/`J` classification, exit status, and aggregate filtering independently.
2. `bun run ki:engineering:audit` and `bun run ki:engineering:conform` emit only canonical checker reporter output directly, with no terminal narration path.
3. `bun run test` and `bun run ki:audit` pass serially after re-vendoring.
4. A reviewer can identify `ki-skills` as the unambiguous source for generic criterion metadata, collection, transport, and rendering without following duplicated implementation paths.

## Dependencies / blocks

This plan deliberately has no dependency on GOV-002. GOV-002 is a later cross-model lifecycle alignment and must not broaden or delay the checker reference work.
