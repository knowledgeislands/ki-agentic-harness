---
id: ADR-KI-HARNESS-SKILLS-018
title: 'Decision-record serials are gap-free and records are living'
date: 2026-10-09
status: current
decision_type: architecture
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
---

# ADR-KI-HARNESS-SKILLS-018: Decision-record serials are gap-free and records are living

## Context

A Decision Record's code is how commit messages, roadmap records, prose and `decision_depends_on` name it. A collection is read as the complete set of decisions currently in force, and its index presents them as one build narrative. A series with holes in it reads as a collection with decisions missing, and every hole invites the question of what was there and whether it still applies.

Most of what would leave a hole is a decision changing: a refinement, a narrowing, a reversal, or two records turning out to decide one concern. Those changes belong in the record that owns the concern. Removal and reclassification remain, and both are rare once records are kept current.

## Decision

Decision Records are living documents, and their serials are gap-free.

- **Refine in place.** A decision that refines, qualifies or reverses an existing record amends that record, so every key decision stays visible in the record that owns it. Overlapping records merge into one, and a record superseded in full is rewritten in place. A new record is written only for a genuinely independent decision.
- **Serials start at `001` and are contiguous** in each prefix-and-scope series. A pending `XXX` record takes the next serial when it is numbered.
- **Removal and reclassification renumber.** When a record is merged away, retired or moved to another prefix, the remaining records in its old series renumber to close the gap, and every citation of the moved and shifted codes, in this repository and in peer repositories, is swept in the same change. Commit messages and other Git history that name an old code are accepted staleness.
- **Contiguity is audited.** It is a required criterion of the Decision Records rubric.

## Consequences

The serials in a series count its decisions, and a collection with a gap fails its Decision Records audit until its owner renumbers. Renumbering is a deliberate, sweeping change, which keeps the pressure on amending records in place rather than retiring them.

A citation outside Git history that names an old code is a defect to correct, not tolerated staleness.

## References

- [ADR-KI-HARNESS-SKILLS-015](ADR-KI-HARNESS-SKILLS-015-identifier-scope-segments-accept-any-legal-repository-code.md) settles the scope grammar these serials sit under.
