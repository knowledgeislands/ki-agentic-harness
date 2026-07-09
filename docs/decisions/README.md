# Architecture Decision Records — Knowledge Islands Harness

This directory holds the Architecture Decision Records (ADRs) for the **ki-agentic-harness** and the Knowledge Islands governance skill set it houses.

## Naming convention

```text
ADR-<SCOPE>-NNN
```

`<SCOPE>` is one or more alpha-leading uppercase segments separated by hyphens — e.g. `KI-HARNESS`, `KI-HARNESS-SKILLS`. `NNN` is a zero-padded integer (minimum three digits), monotonically increasing within the scope. Foundational harness ADRs use the bare scope `ADR-KI-HARNESS-NNN`; domain-specific ADRs append a sub-scope: `ADR-KI-HARNESS-<SUB-SCOPE>-NNN`.

Sub-scopes used in this harness:

| Sub-scope   | Purpose                                                 |
| ----------- | ------------------------------------------------------- |
| _(none)_    | Foundational paradigms and repository-level decisions   |
| `SKILLS`    | Governance skill structure and canonical modes          |
| `CONFIG`    | `.ki-config.toml` contract and validate-down convention |
| `TOOLCHAIN` | Standard toolchain choices (Bun, Biome, etc.)           |
| `AGENTS`    | Multi-skill invocation and subagent orchestration       |

## Reading order

The records are living, compact, and independent. They are grouped here by scope — the foundational bare `ADR-KI-HARNESS-NNN` series first, then each sub-scope — and run in numeric order within each group, since the numbering itself follows the order in which each layer builds on the ones before it. A newcomer can read top to bottom; the [Index](#index) below is the by-ID lookup.

**1 · Foundations (`ADR-KI-HARNESS-NNN`) — what the repo is and the paradigms everything rests on.**

1. [ADR-KI-HARNESS-001](ADR-KI-HARNESS-001-adopting-decision-records.md) — adopting Decision Records (the format these records themselves follow).
2. [ADR-KI-HARNESS-002](ADR-KI-HARNESS-002-purpose-and-scope.md) — the purpose and scope of the repository.
3. [ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-composition-over-extension.md) — composition over extension, the principle no skill may break.
4. [ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-five-part-bundle-layout.md) — the five-part bundle layout (skills / agents / MCP / evals / hooks).
5. [ADR-KI-HARNESS-005](ADR-KI-HARNESS-005-naming-model-and-harness-as-source.md) — the `ki-` naming model and harness-as-source vs plugin-as-projection.
6. [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-mechanical-first-llm-optional.md) — mechanical-first, LLM-optional operation.
7. [ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-bootstrapping-and-self-sufficiency.md) — the bootstrapping chain and the self-sufficiency contract.
8. [ADR-KI-HARNESS-008](ADR-KI-HARNESS-008-public-and-declared-license.md) — public repos and a declared license, decoupled from visibility.

**2 · Skills (`SKILLS`) — how a skill is shaped, how skills relate, and decisions about specific skills.**

1. [ADR-KI-HARNESS-SKILLS-001](ADR-KI-HARNESS-SKILLS-001-canonical-modes.md) — the universal INIT / AUDIT / CONFORM / REFRESH modes.
2. [ADR-KI-HARNESS-SKILLS-002](ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md) — the mechanical/judgment checker split.
3. [ADR-KI-HARNESS-SKILLS-003](ADR-KI-HARNESS-SKILLS-003-dependency-order-composition.md) — the naming grammar and dependency order for composition.
4. [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md) — every skill must be valid standalone.
5. [ADR-KI-HARNESS-SKILLS-005](ADR-KI-HARNESS-SKILLS-005-handoff-doctrine-own-skill.md) — the handoff doctrine is its own skill.
6. [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md) — the six-cluster taxonomy and the machine-readable implication graph.
7. [ADR-KI-HARNESS-SKILLS-007](ADR-KI-HARNESS-SKILLS-007-housekeeping-scope-and-server-pairing.md) — ki-housekeeping's scope and the server pairing.
8. [ADR-KI-HARNESS-SKILLS-008](ADR-KI-HARNESS-SKILLS-008-feature-definitions-skill.md) — a Feature Definitions skill for the "what".
9. [ADR-KI-HARNESS-SKILLS-009](ADR-KI-HARNESS-SKILLS-009-tools-and-homebrew-tap-structure-skills.md) — ki-tools and ki-homebrew-tap repo-structure skills.

**3 · Config (`CONFIG`) — the repo-to-skill binding.**

1. [ADR-KI-HARNESS-CONFIG-001](ADR-KI-HARNESS-CONFIG-001-validate-down-ki-config-contract.md) — the validate-down `.ki-config.toml` contract.

**4 · Toolchain (`TOOLCHAIN`) — the mechanical substrate.**

1. [ADR-KI-HARNESS-TOOLCHAIN-001](ADR-KI-HARNESS-TOOLCHAIN-001-standard-toolchain.md) — the Bun / Biome / knip standard toolchain.
2. [ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling.md) — complementary tooling currently adopted.
3. [ADR-KI-HARNESS-TOOLCHAIN-003](ADR-KI-HARNESS-TOOLCHAIN-003-mcporter-mcp-proxy.md) — proxying local MCP servers behind mcporter.

**5 · Agents (`AGENTS`) — multi-skill invocation and orchestration.**

1. [ADR-KI-HARNESS-AGENTS-001](ADR-KI-HARNESS-AGENTS-001-subagent-isolation.md) — subagent isolation for multi-skill invocation.

## Index

| ID | Title | Date |
| --- | --- | --- |
| ADR-KI-HARNESS-001 | [Adopting Architecture Decision Records](ADR-KI-HARNESS-001-adopting-decision-records.md) | 2026-06-23 |
| ADR-KI-HARNESS-002 | [Purpose and scope of this repository](ADR-KI-HARNESS-002-purpose-and-scope.md) | 2026-06-23 |
| ADR-KI-HARNESS-003 | [Composition over extension](ADR-KI-HARNESS-003-composition-over-extension.md) | 2024-01-01 |
| ADR-KI-HARNESS-004 | [Five-part harness bundle layout](ADR-KI-HARNESS-004-five-part-bundle-layout.md) | 2024-01-01 |
| ADR-KI-HARNESS-005 | [The ki- naming model and harness-as-source vs plugin-as-projection](ADR-KI-HARNESS-005-naming-model-and-harness-as-source.md) | 2026-07-07 |
| ADR-KI-HARNESS-006 | [Mechanical-first, LLM-optional operation](ADR-KI-HARNESS-006-mechanical-first-llm-optional.md) | 2026-07-09 |
| ADR-KI-HARNESS-007 | [The bootstrapping chain and the self-sufficiency contract](ADR-KI-HARNESS-007-bootstrapping-and-self-sufficiency.md) | 2026-07-09 |
| ADR-KI-HARNESS-008 | [Public repos and a declared license, decoupled from visibility](ADR-KI-HARNESS-008-public-and-declared-license.md) | 2026-07-09 |
| ADR-KI-HARNESS-CONFIG-001 | [Validate-down .ki-config.toml contract](ADR-KI-HARNESS-CONFIG-001-validate-down-ki-config-contract.md) | 2024-01-01 |
| ADR-KI-HARNESS-SKILLS-001 | [AUDIT/CONFORM/INIT/REFRESH canonical modes](ADR-KI-HARNESS-SKILLS-001-canonical-modes.md) | 2024-01-01 |
| ADR-KI-HARNESS-SKILLS-002 | [Mechanical and judgment checker split](ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md) | 2024-01-01 |
| ADR-KI-HARNESS-SKILLS-003 | [Dependency order for multi-skill composition](ADR-KI-HARNESS-SKILLS-003-dependency-order-composition.md) | 2024-01-01 |
| ADR-KI-HARNESS-SKILLS-004 | [Skills must be valid standalone](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md) | 2024-01-01 |
| ADR-KI-HARNESS-SKILLS-005 | [The handoff doctrine is its own skill](ADR-KI-HARNESS-SKILLS-005-handoff-doctrine-own-skill.md) | 2026-07-02 |
| ADR-KI-HARNESS-SKILLS-006 | [Six-cluster skill taxonomy and the implication graph](ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md) | 2026-07-09 |
| ADR-KI-HARNESS-SKILLS-007 | [ki-housekeeping scope and the server pairing](ADR-KI-HARNESS-SKILLS-007-housekeeping-scope-and-server-pairing.md) | 2026-07-09 |
| ADR-KI-HARNESS-SKILLS-008 | [A Feature Definitions skill for the "what"](ADR-KI-HARNESS-SKILLS-008-feature-definitions-skill.md) | 2026-07-09 |
| ADR-KI-HARNESS-SKILLS-009 | [Two repo-structure skills for standalone tools and their Homebrew tap](ADR-KI-HARNESS-SKILLS-009-tools-and-homebrew-tap-structure-skills.md) | 2026-07-09 |
| ADR-KI-HARNESS-TOOLCHAIN-001 | [Bun, Biome, and knip standard toolchain](ADR-KI-HARNESS-TOOLCHAIN-001-standard-toolchain.md) | 2026-06-28 |
| ADR-KI-HARNESS-TOOLCHAIN-002 | [Complementary tooling — current adoptions](ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling.md) | 2026-06-29 |
| ADR-KI-HARNESS-TOOLCHAIN-003 | [Proxy local MCP servers behind mcporter](ADR-KI-HARNESS-TOOLCHAIN-003-mcporter-mcp-proxy.md) | 2026-06-24 |
| ADR-KI-HARNESS-AGENTS-001 | [Subagent isolation for multi-skill invocation](ADR-KI-HARNESS-AGENTS-001-subagent-isolation.md) | 2026-06-23 |

## Template

Each record is a **living present-state record** — it states the decision as it stands now and is edited in place; there is no Status, Mutability, supersession, or Changelog. A `**Date:**` line is optional. The full rules live in the `ki-decision-records` skill ([dr-format.md](../../skills/ki-decision-records/references/dr-format.md)).

```markdown
# ADR-KI-<SCOPE>-NNN: <Title>

**Date:** YYYY-MM-DD

## Context

<What is the problem or constraint that forced a decision? Keep to one paragraph of essential background — a record is self-contained, so inline the context rather than sending the reader elsewhere for it.>

## Decision

<The decision itself, stated plainly. One paragraph or a short bulleted list. Not rationale — just what was decided.>

## Consequences

<What changes as a result? Include both the positive effects and the trade-offs or follow-on constraints. Keep it factual.>

## References

A record is **self-contained**: its only outbound links are to sibling ADRs in this directory, following the reading-order layering (reference the foundations a decision builds on). Do not link out to skills, guides, feature definitions, workflows, or external URLs — name them in prose instead, inlining any context the reader needs. The sole carve-out is a record whose subject _is_ an external artefact (e.g. a toolchain survey), which may name that artefact's URL as content.

- [ADR-KI-HARNESS-NNN](ADR-KI-HARNESS-NNN-slug.md) — the foundational decision this record builds on.
```
