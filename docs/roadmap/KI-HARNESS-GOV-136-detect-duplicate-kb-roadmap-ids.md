---
id: KI-HARNESS-GOV-136
area: GOV
title: Detect duplicate KB ids
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-04T16:29:19Z
updated_at: 2026-10-04T16:30:08Z
---

# KI-HARNESS-GOV-136: Detect Duplicate KB Ids

## Goal

A knowledge base whose `Streams/Roadmap/` holds two records with the same `id` fails its Streams audit, as a non-KB repository with duplicate `docs/roadmap/` identifiers already does.

## Context

Handed over on 2026-10-04 by the estate coordinator from `kit-principal` (`KIT-012`) and `kit-techmedix` (`TMX-KB-005`): both repositories carried colliding roadmap identifiers (`KIT-007` in `kit-principal`; `TMX-CO-003` in `kit-techmedix`, reusing a pruned record's serial) that passed `ki repo audit`.

The non-KB path already rejects duplicates: `inspectRoadmap` in `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts` reports `ITEM-1` `duplicate work-item id`. For a KB it returns early with `SCOPE-1` not applicable, and `ki-repo-kb-streams` (`skills/repo-structure/ki-repo-kb-streams/scripts/rubric/contexts/streams.ts`) inspects only operational areas, legacy folders, the Enactment anchor and configuration. No harness audit reads KB roadmap record identity, so duplicates pass.

[KI-HARNESS-GOV-095](KI-HARNESS-GOV-095-align-roadmap-diagnostics.md) records the broader parity problem across `ki repo roadmap list` and the audits, including the original `KIT-007` evidence, and splits ownership with `tools-ki`. This record is the narrow harness-owned slice: a mechanical identity-uniqueness check in the KB Streams audit.

## Boundary

In scope: a mechanical `ki-repo-kb-streams` check that reads the `id` frontmatter of each direct-child record under `Streams/Roadmap/` (excluding `_ISSUES.md`) and fails each record whose identifier repeats another's, with focused tests and the standard's statement of the rule.

Out of scope: full KB record-format validation, `ki repo roadmap list` behaviour (`tools-ki`, via GOV-095), repairing any receiving repository's records, and detecting reuse of a pruned record's serial. The latter cannot be seen from the current tree: a reused serial at or below the `_ISSUES.md` high-water mark is indistinguishable from a legitimate allocation without Git history, so it needs a separate decision on whether an audit may consult history.

## Current state

No harness audit reads KB roadmap record identity (see Context). A read-only sweep on 2026-10-04 of the local KB checkouts with `Streams/Roadmap/` (`kit-principal`, `kit-techmedix`, `ki-arcadia-principal`, `kit-legal`, `kit-hnr`, `vallearmonia-principal`, `er-research`) found no duplicate `id:` values, so the new check is not expected to raise immediate estate failures.

## Steps

- [ ] Add identity evidence to the `ki-repo-kb-streams` context: read the `id` frontmatter of each regular direct-child `.md` record in `Streams/Roadmap/` except `_ISSUES.md`, and emit one `FAIL` per record whose identifier is shared with another, naming the identifier and the colliding paths; otherwise one `PASS` (or `NOT_APPLICABLE` with no records).
- [ ] Add mechanical item `STREAM-6` "unique roadmap identity" at `FAIL` in the `STREAM` family, citing the Roadmap section of the standard.
- [ ] State the uniqueness rule in `references/standards-streams-structure.md` under Roadmap.
- [ ] Add focused `streams.test.ts` fixtures: duplicate identifiers fail on each colliding record; distinct identifiers pass; a record without `id` frontmatter and `_ISSUES.md` are ignored.

## Files touched

- `skills/repo-structure/ki-repo-kb-streams/scripts/rubric/contexts/streams.ts`
- `skills/repo-structure/ki-repo-kb-streams/scripts/rubric/items/stream.ts`
- `skills/repo-structure/ki-repo-kb-streams/scripts/rubric/contexts/streams.test.ts`
- `skills/repo-structure/ki-repo-kb-streams/references/standards-streams-structure.md`
- `docs/roadmap/KI-HARNESS-GOV-136-detect-duplicate-kb-roadmap-ids.md`

## Verify

- `bun test skills/repo-structure/ki-repo-kb-streams`, `bun run test` and `bunx tsc --noEmit` pass.
- `ki repo audit --skill ki-repo-kb-streams` against the local KB checkouts listed above reports `STREAM-6` PASS.
- `ki repo audit --skill ki-skills --repo .` and `ki repo audit --skill ki-work-roadmap --repo .` pass.

## Dependencies / blocks

None. Non-blocking for `kit-principal` `KIT-012` and `kit-techmedix` `TMX-KB-005`. Related to, not blocked by, [KI-HARNESS-GOV-095](KI-HARNESS-GOV-095-align-roadmap-diagnostics.md).

## Documentation impact

### Decision Records

None; the uniqueness rule already exists in the roadmap standard.

### Specifications

None.

### Guides

None.

### Roadmap

This record; GOV-095 retains the cross-tool parity work.

## Discussion

Captured from the coordinator handoff. Neither origin item exists in this repository; the originating records are `kit-principal` `KIT-012` and `kit-techmedix` `TMX-KB-005`. This record is non-blocking for both.
