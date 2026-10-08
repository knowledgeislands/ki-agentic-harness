---
id: ADR-KI-HARNESS-SKILLS-018
title: 'Decision-record serials may contain gaps'
date: 2026-10-08
status: current
decision_type: architecture
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
---

# ADR-KI-HARNESS-SKILLS-018: Decision-record serials may contain gaps

## Context

The Decision Records standard required the serials in each prefix-and-scope series to start at `001` and run without gaps, whatever the cause. It also required a reclassified record to leave no vacancy: the old series renumbered and every citation of the shifted codes was swept. A mechanical criterion reported any gap as a warning.

The rule did not say what happens when a record is retired. A hole contradicts the contiguity requirement, and renumbering to close it reassigns codes that commit messages, roadmap records, prose and `decision_depends_on` already cite. A record's code is its only durable name, so a reassigned code turns every existing reference into a pointer that still resolves, to the wrong decision. `apps-observatory` derived an estate-wide contiguity check from the sentence, and asked whether it was meant that strictly.

## Decision

A Decision Record serial is an identifier, not a count.

- **Issuance is ascending.** Each prefix-and-scope series starts at `001`, and each new serial is one greater than the highest ever issued in that series. A pending `XXX` record takes the next serial above that high-water mark when it is numbered.
- **An issued serial is never reused or reassigned.** Nothing is renumbered to close a gap or to suit the reveal order of the index.
- **Gaps are permitted and carry no meaning.** Pruning, reclassification and a failed or abandoned reservation each leave one. A reclassified record takes the next serial in its new series, and its old serial stays vacant.
- **Contiguity is not an audit criterion.** The contiguity criterion is retired and its code is not reused.

No tombstone or other retirement artefact is introduced: a gap cannot be told apart from a skipped allocation, and nothing needs to tell them apart.

## Consequences

A collection with a gap now audits clean, and no repository renumbers existing records. Where the index's reveal order and the serial order disagree, the entry moves to its serial position rather than the record taking a new code.

`apps-observatory` can delete its serial-contiguity check under its own authority. Specification requirement serials are a separate instrument and keep their own rule.

## References

- [ADR-KI-HARNESS-SKILLS-015](ADR-KI-HARNESS-SKILLS-015-identifier-scope-segments-accept-any-legal-repository-code.md) settles the scope grammar these serials sit under.
