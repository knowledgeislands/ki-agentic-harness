# Architecture Decision Records — Knowledge Islands Harness

This directory holds the Architecture Decision Records (ADRs) for the **arcadia-agentic-harness** and the Knowledge Islands governance skill
set it houses.

## Naming convention

```text
ADR-<SCOPE>-NNN
```

`<SCOPE>` is one or more alpha-leading uppercase segments separated by hyphens — e.g. `KI-HARNESS`, `KI-HARNESS-SKILLS`. `NNN` is a
zero-padded integer (minimum three digits), monotonically increasing within the scope. Foundational harness ADRs use the bare scope
`ADR-KI-HARNESS-NNN`; domain-specific ADRs append a sub-scope: `ADR-KI-HARNESS-<SUB-SCOPE>-NNN`.

Sub-scopes used in this harness:

| Sub-scope   | Purpose                                                 |
| ----------- | ------------------------------------------------------- |
| _(none)_    | Foundational paradigms and repository-level decisions   |
| `SKILLS`    | Governance skill structure and canonical modes          |
| `CONFIG`    | `.ki-config.toml` contract and validate-down convention |
| `TOOLCHAIN` | Standard toolchain choices (Bun, Biome, etc.)           |
| `AGENTS`    | Multi-skill invocation and subagent orchestration       |

## Index

| ID                           | Title                                                                         | Status   | Date       |
| ---------------------------- | ----------------------------------------------------------------------------- | -------- | ---------- |
| ADR-KI-HARNESS-001           | [Composition over extension](ADR-KI-HARNESS-001.md)                           | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-002           | [Four-part harness bundle layout](ADR-KI-HARNESS-002.md)                      | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-003           | [Adopting Architecture Decision Records](ADR-KI-HARNESS-003.md)               | Accepted | 2026-06-23 |
| ADR-KI-HARNESS-004           | [Purpose and scope of this repository](ADR-KI-HARNESS-004.md)                 | Accepted | 2026-06-23 |
| ADR-KI-HARNESS-CONFIG-001    | [Validate-down .ki-config.toml contract](ADR-KI-HARNESS-CONFIG-001.md)        | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-SKILLS-001    | [AUDIT/CONFORM/REFRESH canonical modes](ADR-KI-HARNESS-SKILLS-001.md)         | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-SKILLS-002    | [Mechanical and judgment checker split](ADR-KI-HARNESS-SKILLS-002.md)         | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-SKILLS-003    | [Dependency order for multi-skill composition](ADR-KI-HARNESS-SKILLS-003.md)  | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-SKILLS-004    | [Skills must be valid standalone](ADR-KI-HARNESS-SKILLS-004.md)               | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-TOOLCHAIN-001 | [Bun and Biome standard toolchain](ADR-KI-HARNESS-TOOLCHAIN-001.md)           | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-TOOLCHAIN-002 | [Complementary tooling evaluation][t002]†                                     | Accepted | 2026-06-23 |
| ADR-KI-HARNESS-AGENTS-001    | [Subagent isolation for multi-skill invocation](ADR-KI-HARNESS-AGENTS-001.md) | Accepted | 2026-06-23 |

[t002]: ADR-KI-HARNESS-TOOLCHAIN-002.md

† Full title: "Complementary tooling evaluation — context management and developer utilities"

## Template

```markdown
# ADR-KI-<SCOPE>-NNN: <Title>

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-KI-…

**Date:** YYYY-MM-DD

## Context

<What is the problem or constraint that forced a decision? Keep to one paragraph of essential background — the reader can follow links for
depth.>

## Decision

<The decision itself, stated plainly. One paragraph or a short bulleted list. Not rationale — just what was decided.>

## Consequences

<What changes as a result? Include both the positive effects and the trade-offs or follow-on constraints. Keep it factual.>

## References

- [Source doc title](../path/to/doc.md) — the canonical standard this ADR codifies.
```
