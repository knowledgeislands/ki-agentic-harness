---
id: ADR-KI-HARNESS-SKILLS-015
title: 'Identifier scope segments accept any legal repository code'
date: 2026-09-25
status: current
decision_type: architecture
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
---

# ADR-KI-HARNESS-SKILLS-015: Identifier scope segments accept any legal repository code

## Context

A decision-record scope segment and a specification requirement prefix segment both had to be alpha-leading, matching `[A-Z][A-Z0-9]*`. The identifier a repository actually declares does not carry that restriction: `repo_code` in the `ki-repo` table matches `[A-Z0-9][A-Z0-9-]{1,23}`, and `ki-work-roadmap` builds every item identifier from it. A repository whose code leads with a digit could therefore name its work but not its decisions, and the two governance instruments that are supposed to share one vocabulary disagreed about what a vocabulary may contain. The roadmap half of that gap had already closed: `ki-repo`, `ki-work-roadmap`, `ki-work-housekeeping` and `ki-accept` were relaxed to accept a digit-leading code on 2026-09-24, which left the governance instruments as the only surface still refusing one.

That was not hypothetical. `5g-emerge-phase2` declares `repo_code = "5GE-P2"` and opened its collection under the invented scope `EMERGE-P2` — a second identifier for one repository, matching neither its roadmap items nor the standard's own exemplars, and the reason was visible only to whoever read the grammar.

## Decision

A scope segment, and a specification requirement prefix segment, matches `[A-Z0-9]*[A-Z][A-Z0-9]*`. A segment may lead with a digit, and must carry at least one letter.

The letter is load-bearing rather than decorative: it is what distinguishes a trailing segment from the zero-padded serial, so `ADR-5-001` remains invalid while `ADR-5GE-P2-001` is well-formed. This is the one legal `repo_code` shape a scope still cannot take, and it is excluded because the identifier would be ambiguous, not because of how it reads.

Where a repository declares a `repo_code`, that code is its decision scope unchanged.

## Consequences

One repository now carries one identifier across its roadmap, its decision records and its specifications, and a repository with a digit-leading code needs no bespoke scope. `5g-emerge-phase2` renames its seven records from `EMERGE-P2` to `5GE-P2`, and `GDR-EMERGE-P2-001` becomes `GDR-5GE-P2-001`.

The grammar is enforced in each governance skill's own vendored rubric context rather than centrally in `tools-ki`, so `ki-decision-records` and `ki-specs` were relaxed in one pass. Relaxing either alone would have reproduced the same mismatch one layer down, with a code legal as a decision scope and illegal as a requirement prefix.

Existing alpha-leading scopes are unaffected, and no record is renamed by this decision alone.

## References

- [ADR-KI-HARNESS-SKILLS-011](ADR-KI-HARNESS-SKILLS-011-repository-roadmaps-for-non-kb-repositories.md) introduced the roadmap identifiers built from `repo_code`
- [ADR-KI-HARNESS-SKILLS-013](ADR-KI-HARNESS-SKILLS-013-readable-identifier-presentation.md) keeps stable codes opaque and moves human meaning into titles
