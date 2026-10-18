---
id: ADR-KI-HARNESS-SKILLS-005
title: 'Delegation and trades are distinct capabilities'
date: 2026-08-10
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-SKILLS-005: Delegation and trades are distinct capabilities

## Context

Delegating work to an agent and transferring a proposal between repositories both move context, but they have different authority, lifecycle, and evidence boundaries. An orchestrator remains responsible for an agent's execution, review, and integration. A receiving repository alone decides whether to accept a cross-repository submission.

## Decision

The harness keeps these concerns separate. `ki-delegation` governs the run contract for delegating work to detached background agents and, when durable packet governance is useful, supplies the delegation packet as an optional capability. `ki-coordination` governs the coordinating thread that launches those runs: the project management layer above the run contract, holding coordinator responsiveness, the report forms, the three thread types, coordination threads and the state-of-play thread (refined in place on 2026-10-14 under KI-PRINCIPAL-ECO-013 and KI-HARNESS-GOV-187). `ki-trades` governs typed, receiver-controlled cross-repository submissions. Neither capability grants a sender or delegated worker authority over a repository's roadmap, priorities, implementation, or acceptance.

## Consequences

- Delegation packets remain optional and contextual rather than becoming a required repository-wide declaration.
- A coordinating thread is governed by `ki-coordination`, which depends on `ki-delegation` for the runs it launches and on `ki-work-folder` for the checkpoint it resumes; the run contract itself carries no thread rules.
- Cross-repository submissions remain reviewable and directional, with receiver-owned disposition and no automatic adoption.
- The capability names describe their distinct operations, avoiding an overloaded handoff concept.

## References

- [ADR-KI-HARNESS-SKILLS-003](ADR-KI-HARNESS-SKILLS-003-dependency-order-for-multi-skill-composition.md) — executable dependency ordering and the separate foundations-first review priority.
- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-must-be-valid-standalone.md) — standalone validity.
