---
id: GDR-KI-HARNESS-004
title: 'Four-doc repository documentation ownership'
date: 2026-08-02
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
decision_type: governance
---

# GDR-KI-HARNESS-004: Four-doc repository documentation ownership

## Context

Knowledge Islands repositories had clear owners for Decision Records, Specifications, and roadmap items, but practical contributor and operator material remained scattered between `docs/developer/`, `docs/guides/`, `docs/spec/`, and generic log directories. That made the documentation tree difficult to navigate and left its practical how without a native governed rubric.

## Decision

Knowledge Islands adopts four durable documentation concerns for non-Knowledge-Base repositories: Decision Records answer why, Specifications answer what, Guides answer how, and roadmap items answer when.

- `ki-decision-records`, `ki-specs`, and `ki-change-management-roadmap` retain their existing owned roots.
- `ki-guides` owns `docs/guides/` and its `README.md` collection entry point, with a native structured rubric. Content under the root mechanically requires the skill declaration unless the repository records an explicit coverage opt-out.
- `docs/spec/`, `docs/developer/`, and generic durable `docs/logs/` are retired as parallel roots. Their durable material is reclassified to its actual owner; ephemeral logs do not become a repository documentation system.

## Consequences

- Every durable documentation concern has one skill and published rubric controlling its structure.
- Repositories can choose guide categories that fit their readers without inventing alternate top-level documentation types.
- Existing repositories must migrate retired roots before declaring `ki-guides`; that is deliberate conformance work, not a compatibility path.
- Diagrams and other assets remain colocated with the concern they explain or in a repository-specific asset location until a separate asset policy is warranted.

## References

- [ADR-KI-HARNESS-SKILLS-008](ADR-KI-HARNESS-SKILLS-008-a-specifications-skill-for-what.md) — Specifications as the owner of behaviour-level specification.
- [ADR-KI-HARNESS-SKILLS-011](ADR-KI-HARNESS-SKILLS-011-repository-roadmaps-for-non-kb-repositories.md) — repository roadmaps as the owner of non-KB forward work.
