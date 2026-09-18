---
id: ADR-KI-HARNESS-TOOLCHAIN-004
title: 'Checker remediation metadata and learn-block context check'
date: 2026-07-10
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
decision_depends_on: [ADR-KI-HARNESS-007]
---

# ADR-KI-HARNESS-TOOLCHAIN-004: Checker remediation metadata and learn-block context check

## Context

Mechanical findings need enough ownership and remediation evidence to guide a safe response without making a checker decide judgmental changes. The original implementation embedded remediation footers in separate checker programs. The Harness now publishes native rubric definitions through one generic host, so remediation belongs to each criterion's structured contract rather than duplicated output code.

Separately, Headroom's learned blocks can add always-loaded recovery patterns to repository guidance. A block learned while working in another repository can silently impose irrelevant context on every later session unless its repository scope is checked.

## Decision

Every mechanical rubric criterion declares exactly one remediation class:

- `automatic` exposes a bounded host-owned conform action and needs no separate prose guidance;
- `diagnostic` exposes specific guidance but no conform action; and
- `guarded` exposes specific guidance and an explicit judgment aspect but no conform action.

The generic `ki` host owns finding presentation, remediation planning, transactionality, and reporting. Source-local checker programs do not embed a second remediation footer or independently decide writes. The Harness validates the complete remediation inventory mechanically so a new criterion cannot publish without an eligible class and evidence.

A `headroom:learn` block is also checked for absolute `knowledgeislands/<repository>` paths naming a repository other than the one under review. Such drift is a warning because re-learning, pruning, or promoting the durable lesson remains a judgmental choice. Claude housekeeping owns runtime-memory hygiene; runtime tokenomics owns the cost of always-loaded Claude guidance.

## Consequences

Remediation remains actionable while write authority is explicit and centrally enforced. Automatic repairs stay distinguishable from diagnostic and guarded findings, and adding a criterion requires declaring its safe response shape. The learn-block heuristic remains deliberately narrow: it reports cross-repository absolute-path evidence inside the generated markers without treating legitimate repository prose as drift.

The learned-context check warns rather than fails because the right correction depends on whether the captured lesson is invalid, repository-local, or worthy of promotion to a durable owner.

## References

- [ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-uniform-skill-modes-bare-mode-scripts-and-a-coverage-scoped-aggregate-gate.md) — native rubric execution and generic host ownership.
- [ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling-current-adoptions.md) — adopts Headroom, whose learned block the context check governs.
