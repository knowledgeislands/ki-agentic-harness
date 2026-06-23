# Architecture Decision Records — Knowledge Islands Harness

This directory holds the Architecture Decision Records (ADRs) for the **arcadia-agentic-harness** and the Knowledge Islands governance skill
set it houses.

## Naming convention

```text
ADR-KI-<SCOPE>-NNN
```

`ADR-KI` is the universal prefix for all Knowledge Islands ADRs. `<SCOPE>` is the domain: `HARNESS`, `ENGINEERING`, `KB`, `MCP`, etc. `NNN`
is a zero-padded monotonically increasing integer. Every ADR lives at `docs/decisions/ADR-KI-<SCOPE>-NNN.md`.

## Index

| ID                 | Title                                                                  | Status   | Date       |
| ------------------ | ---------------------------------------------------------------------- | -------- | ---------- |
| ADR-KI-HARNESS-001 | [Composition over extension](ADR-KI-HARNESS-001.md)                    | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-002 | [Four-part harness bundle layout](ADR-KI-HARNESS-002.md)               | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-003 | [AUDIT/CONFORM/REFRESH canonical modes](ADR-KI-HARNESS-003.md)         | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-004 | [Mechanical and judgment checker split](ADR-KI-HARNESS-004.md)         | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-005 | [Validate-down .ki-config.toml contract](ADR-KI-HARNESS-005.md)        | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-006 | [Bun and Biome standard toolchain](ADR-KI-HARNESS-006.md)              | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-007 | [Dependency order for multi-skill composition](ADR-KI-HARNESS-007.md)  | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-008 | [Skills must be valid standalone](ADR-KI-HARNESS-008.md)               | Accepted | 2024-01-01 |
| ADR-KI-HARNESS-009 | [Subagent isolation for multi-skill invocation](ADR-KI-HARNESS-009.md) | Accepted | 2026-06-23 |

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
