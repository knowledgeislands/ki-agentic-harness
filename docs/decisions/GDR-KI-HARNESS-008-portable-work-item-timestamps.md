---
id: GDR-KI-HARNESS-008
title: 'Portable work-item timestamps'
date: 2026-09-13
status: current
decision_type: governance
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
decision_depends_on: ['GDR-KI-HARNESS-005']
---

# GDR-KI-HARNESS-008: Portable work-item timestamps

## Context

Local roadmap and Knowledge Base Streams records carry lifecycle state without portable temporal evidence. Git history cannot supply reliable record metadata across renames, shallow clones, untracked drafts, formatting-only commits, or independent agent environments. GitHub Issues and Linear already expose provider-native creation and update times.

Creation age and last semantic activity are useful across adapters, but cycle time and time-in-state require lifecycle event history that two timestamps cannot represent. Concurrent isolated writers also need a rule that prevents a slower writer from publishing an older timestamp over a newer record revision.

## Decision

Knowledge Islands work-item records use `created_at` and `updated_at` as a pair. Local adapters encode canonical RFC 3339 UTC timestamps at second precision. A new record writes one instant to both fields. `created_at` remains immutable; a governed lifecycle or semantic body mutation advances `updated_at` to the later of the current UTC second or one second after its previous value. Read-only inspection and formatting-only normalisation do not advance it.

Local writers compare the record revision they observed with the revision they are about to replace and stop on drift. Mechanical validation requires pair presence, canonical shape, and `created_at <= updated_at`, but does not reject future values relative to the auditor's clock. Remote adapters project provider-native creation and update timestamps instead of duplicating them into provider bodies.

The fields remain optional during compatibility rollout. Making them universally required needs a later decision after process support, tooling support, coverage measurement, and separately reviewed backfills.

## Consequences

Local and remote portfolios can report creation age, inactivity, timestamp coverage, and stale active records through one portable vocabulary. The monotonic rule remains deterministic despite second-level clock resolution and tolerates previously recorded future values without moving time backwards.

When the pair is present, every process that semantically mutates a local work item must preserve creation time, advance update time, and refuse stale publication. Existing records continue to validate while support rolls out, so repository backfills and CLI adoption can remain separately reviewable. These two fields do not justify delivery-throughput or time-in-state statistics.

## References

- [GDR-KI-HARNESS-005](GDR-KI-HARNESS-005-cross-repository-trade-routes.md) — receiver-controlled cross-repository work routing.
