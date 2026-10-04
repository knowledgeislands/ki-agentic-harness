---
id: KI-HARNESS-GOV-136
area: GOV
title: Detect duplicate KB ids
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-04T16:29:19Z
updated_at: 2026-10-04T16:29:19Z
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

## Discussion

Captured from the coordinator handoff. Neither origin item exists in this repository; the originating records are `kit-principal` `KIT-012` and `kit-techmedix` `TMX-KB-005`. This record is non-blocking for both.
