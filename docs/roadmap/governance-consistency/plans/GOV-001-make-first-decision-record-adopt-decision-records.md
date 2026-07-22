---
id: 'GOV-001'
title: Make the first decision record adopt Decision Records
status: ready
roadmap: governance-consistency/make-the-first-decision-record-adopt-decision-records
blocks: —
blocked-by: —
---

## Context

A Decision Record collection needs an explicit root decision explaining why the repository uses Decision Records before it records any concern-specific decision.

The harness already demonstrates this with `GDR-KI-HARNESS-001: Adopting Decision Records`, but `ki-decision-records` does not yet protect that convention for a newly created collection.

## Current state

The decision-record checker validates file shape, type metadata, serial continuity, and index integrity, while NEW derives type, scope, and serial from the requested record.

It does not distinguish an empty collection from an established one, require a governance adoption record as the first entry, or preserve established collections explicitly as migration cases.

## Steps

1. Define the new-collection boundary and adopted root contract: a collection with no existing Decision Records must begin with `GDR-<SCOPE>-001: Adopting Decision Records`, and its index entry is first in reveal order. Confirm that an existing collection is a migration case and is never automatically renamed, renumbered, or backfilled.
2. Scan the decision-record rubric publication and structured item modules together to allocate a non-colliding criterion code. Add focused context evidence and a mechanical rule that distinguishes an empty/new collection from an established collection and reports an actionable diagnostic when the root contract is violated.
3. Update NEW guidance, the format standard, and the worked exemplar so creating a first record follows the required adoption path rather than asking the user to choose an unrelated first type or title.
4. Add focused fixtures for a valid first adoption record, an unrelated first record, wrong type, wrong title, wrong serial, wrong index position, and an existing collection that remains valid without migration. Regenerate the published rubric from the structured catalogue.
5. Audit the harness collection as an existing conforming example, run the focused decision-record suite and generated-publication parity test, then run serial repository verification.

## Files touched

- `skills/general-governance/ki-decision-records/references/mode-new.md`
- `skills/general-governance/ki-decision-records/references/dr-format.md`
- `skills/general-governance/ki-decision-records/references/exemplars.md`
- `skills/general-governance/ki-decision-records/references/rubric.md`
- `skills/general-governance/ki-decision-records/scripts/rubric/contexts/decision-records.ts`
- `skills/general-governance/ki-decision-records/scripts/rubric/items/`
- focused decision-record checker fixtures and tests

## Verify

1. An empty collection with an unrelated first record fails with a concrete adoption-record repair route.
2. A new `GDR-<SCOPE>-001: Adopting Decision Records` record at the first index position passes.
3. Existing collections remain valid without forced backfill, rewrite, or renumbering.
4. The generated rubric exactly matches its structured catalogue.
5. Run the focused decision-record suite, `bun run ki:decision-records:audit`, `bun run test`, and `bun run ki:audit` serially.

## Dependencies / blocks

This plan is independent of active roadmap work.

It preserves migration cases so it does not block existing repositories from adopting later improvements to the Decision Records standard.
