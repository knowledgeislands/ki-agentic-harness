---
id: ADR-KI-HARNESS-SKILLS-014
title: 'Explicit skill applicability'
date: 2026-09-16
status: current
decision_type: architecture
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
---

# ADR-KI-HARNESS-SKILLS-014: Explicit skill applicability

## Context

Skill kind distinguishes reusable governance from invoked process, but it does not state why a skill applies to a repository. Some capabilities form the universal repository baseline, some are selected by observable repository evidence, some require an explicit declaration, and processes apply only when invoked. Without an exhaustive and independent applicability axis, a new skill can fall outside repository coverage without making that omission visible. Detection also needs one authoritative registry so skill metadata and executable repository evidence cannot drift independently.

## Decision

Every canonical skill declares exactly one `ki-applicability` value: `baseline`, `detected`, `declaration-only`, or `invocation-only`. `ki-repo` and `ki-authoring` are the complete baseline. Every process skill is invocation-only; governance skills use one of the other three values. `ki-repo` is the sole owner of repository applicability detection and declares its complete target set through `ki-detects`. The registry, each target skill's `detected` classification, and the executable coverage detectors must agree bidirectionally. Skill kind, dependency composition, runtime compatibility, host activation, and applicability remain separate contracts.

## Consequences

The harness can prove every published capability has an intentional route into use and can reject incomplete or contradictory collections. The generated capability catalogue exposes applicability without implying automatic activation. Adding or removing a detector now requires coordinated changes to `ki-repo`, the target skill metadata, and executable evidence. Declaration-only capabilities remain explicit opt-ins, while process skills do not become repository governance merely because they ship in the harness.

## References

- [ADR-KI-HARNESS-005](ADR-KI-HARNESS-005-validate-down-ki-toml-contract.md) — repository declarations remain the validate-down configuration boundary.
- [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-concern-first-skill-taxonomy-and-implication-graph.md) — skill kind and dependency composition remain independent axes.
- [ADR-KI-HARNESS-012](ADR-KI-HARNESS-012-compatible-harness-publication-and-governed-rubric-boundary.md) — compatible harness publication owns collection-level completeness.
