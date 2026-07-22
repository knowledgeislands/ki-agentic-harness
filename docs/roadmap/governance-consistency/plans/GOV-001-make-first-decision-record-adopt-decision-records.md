---
id: 'GOV-001'
title: Make the first decision record adopt Decision Records
status: done
roadmap: governance-consistency/make-the-first-decision-record-adopt-decision-records
blocks: —
blocked-by: —
---

## Context

A Decision Record collection needs an explicit root decision explaining why the repository uses Decision Records before it records any concern-specific decision.

The harness already demonstrates this with `GDR-KI-HARNESS-001: Adopting Decision Records`, but `ki-decision-records` does not yet protect that convention for a newly created collection.

## Current state

The decision-record checker validates file shape, type metadata, serial continuity, and index integrity, while NEW derives type, scope, and serial from the requested record.

It cannot infer historical provenance from a nonempty directory: an unrelated one-record collection could be either an established migration case or a newly authored error. The new contract therefore records its boundary explicitly with a non-rendered index marker. NEW writes that marker only while establishing an empty collection; AUDIT then enforces the adoption root without rewriting unmarked established collections.

The harness collection intentionally has no marker, so `ROOT-1` reports it as a migration case. Its existing `GDR-KI-ARCADIA-002` serial-gap warning is unrelated to this plan and remains unchanged.

## Steps

1. [x] Define the new-collection boundary and adopted root contract: a collection with no existing Decision Records must begin with `GDR-<SCOPE>-001: Adopting Decision Records`, and its index entry is first in reveal order. The non-rendered index marker records that the collection was established under this rule; an unmarked existing collection is a migration case and is never automatically renamed, renumbered, or backfilled.
2. [x] Scan the decision-record rubric publication and structured item modules together to allocate a non-colliding criterion code. Add focused context evidence and a mechanical rule that distinguishes a marked new collection from an established collection and reports an actionable diagnostic when the root contract is violated.
3. [x] Update NEW guidance, the format standard, and the worked exemplar so creating a first record follows the required adoption path rather than asking the user to choose an unrelated first type or title.
4. [x] Add focused fixtures for a valid first adoption record, an unrelated first record, wrong type, wrong title, wrong serial, wrong index position, and an existing collection that remains valid without migration. Regenerate the published rubric from the structured catalogue.
5. [x] Audit the harness collection as an existing migration example, run the focused decision-record suite and generated-publication parity test, then run serial repository verification.

## Files touched

- `skills/general-governance/ki-decision-records/references/mode-new.md`
- `skills/general-governance/ki-decision-records/references/dr-format.md`
- `skills/general-governance/ki-decision-records/references/exemplars.md`
- `skills/general-governance/ki-decision-records/references/rubric.md`
- `skills/general-governance/ki-decision-records/scripts/rubric/contexts/decision-records.ts`
- `skills/general-governance/ki-decision-records/scripts/rubric/items/`
- focused decision-record checker fixtures and tests

## Verify

1. A marked new collection with an unrelated first record fails with a concrete adoption-record repair route.
2. A new `GDR-<SCOPE>-001: Adopting Decision Records` record at the first index position passes.
3. Existing collections remain valid without forced backfill, rewrite, or renumbering.
4. The generated rubric exactly matches its structured catalogue.
5. Run the focused decision-record suite, `bun run ki:decision-records:audit`, `bun run test`, and `bun run ki:audit` serially.

## Dependencies / blocks

This plan is independent of active roadmap work.

It preserves migration cases so it does not block existing repositories from adopting later improvements to the Decision Records standard.

## Acceptance

### Delivered

New Decision Record collections now establish `GDR-<SCOPE>-001: Adopting Decision Records` as their first indexed record, with a durable marker that lets the checker enforce the rule without rewriting established collections.

### Summary of changes

- Added the `ROOT-1` mechanical rubric rule and generated rubric publication.
- Recorded the new-collection marker and adoption-root procedure in NEW guidance, the format standard, and the exemplar.
- Added focused cases for a valid root, unrelated type, wrong title, wrong serial, wrong index position, and an unmarked migration collection.

### Verification

- Passed the focused decision-record context and publication tests, `bun run ki:decision-records:audit`, `bun run test`, and `bun run ki:audit` serially.
- Confirmed the harness collection is reported `NOT_APPLICABLE` for `ROOT-1`, preserving it as an established migration collection.
- Implementation evidence: `e74e4853` (`feat(decision-records): require adoption root for new collections`).

### Outstanding concerns

The marker is deliberately required for mechanical provenance: an unmarked collection is treated as an established migration case, because a checker cannot otherwise distinguish a historical single-record collection from a newly authored one. The unchanged `GDR-KI-ARCADIA-002` serial-gap warning is separate work.

### Mini recap

When a new convention must coexist with historical content, an explicit, non-rendered provenance marker is a small and auditable boundary. The alternative would be an unreliable date/history heuristic or a destructive migration.

## Done

Accepted on 2026-07-22. New Decision Record collections are protected by the adoption-root contract, while established collections remain migration cases; the retained record is ready for the user-confirmed batch prune.
