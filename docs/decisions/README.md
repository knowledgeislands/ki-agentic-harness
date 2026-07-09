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

The records are living, compact, and independent, but they were designed to be _read_ as a sequence — each layer assumes the one above it. A newcomer to the harness can follow this path top to bottom; the [Index](#index) below is the by-ID lookup.

**1 · Foundations — what this repo is and the one principle everything rests on.**

1. [ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-purpose-and-scope.md) — the purpose and scope of the repository.
2. [ADR-KI-HARNESS-001](ADR-KI-HARNESS-001-composition-over-extension.md) — composition over extension, the principle no skill may break.
3. [ADR-KI-HARNESS-005](ADR-KI-HARNESS-005-naming-model-and-harness-as-source.md) — the `ki-` naming model and harness-as-source vs plugin-as-projection.
4. [ADR-KI-HARNESS-002](ADR-KI-HARNESS-002-four-part-bundle-layout.md) — the four-part bundle layout (skills / agents / MCP / evals).

**2 · The governance model — how a skill is shaped and how skills relate.**

1. [ADR-KI-HARNESS-SKILLS-001](ADR-KI-HARNESS-SKILLS-001-canonical-modes.md) — the universal INIT / AUDIT / CONFORM / REFRESH modes.
2. [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-mechanical-first-llm-optional.md) — mechanical-first, LLM-optional operation.
3. [ADR-KI-HARNESS-SKILLS-002](ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md) — the mechanical/judgment checker split.
4. [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md) — every skill must be valid standalone.
5. [ADR-KI-HARNESS-SKILLS-003](ADR-KI-HARNESS-SKILLS-003-dependency-order-composition.md) — the naming grammar and dependency order for composition.
6. [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md) — the six-cluster taxonomy and the machine-readable implication graph.

**3 · Bootstrapping — how a repo comes under governance and configures itself.**

1. [ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-bootstrapping-and-self-sufficiency.md) — the bootstrapping chain and the self-sufficiency contract.
2. [ADR-KI-HARNESS-CONFIG-001](ADR-KI-HARNESS-CONFIG-001-validate-down-ki-config-contract.md) — the validate-down `.ki-config.toml` contract.
3. [ADR-KI-HARNESS-008](ADR-KI-HARNESS-008-public-and-declared-license.md) — public repos and a declared license, decoupled from visibility.

**4 · The instruments — decisions about specific skills.**

1. [ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-adopting-decision-records.md) — adopting Decision Records (the format these records themselves follow).
2. [ADR-KI-HARNESS-SKILLS-005](ADR-KI-HARNESS-SKILLS-005-handoff-doctrine-own-skill.md) — the handoff doctrine is its own skill.
3. [ADR-KI-HARNESS-SKILLS-007](ADR-KI-HARNESS-SKILLS-007-housekeeping-scope-and-server-pairing.md) — ki-housekeeping's scope and the server pairing.
4. [ADR-KI-HARNESS-SKILLS-008](ADR-KI-HARNESS-SKILLS-008-feature-definitions-skill.md) — a Feature Definitions skill for the "what".
5. [ADR-KI-HARNESS-SKILLS-009](ADR-KI-HARNESS-SKILLS-009-tools-and-homebrew-tap-structure-skills.md) — ki-tools and ki-homebrew-tap repo-structure skills.

**5 · Toolchain and orchestration — the mechanical substrate.**

1. [ADR-KI-HARNESS-TOOLCHAIN-001](ADR-KI-HARNESS-TOOLCHAIN-001-standard-toolchain.md) — the Bun / Biome / knip standard toolchain.
2. [ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling.md) — complementary tooling currently adopted.
3. [ADR-KI-HARNESS-TOOLCHAIN-003](ADR-KI-HARNESS-TOOLCHAIN-003-mcporter-mcp-proxy.md) — proxying local MCP servers behind mcporter.
4. [ADR-KI-HARNESS-AGENTS-001](ADR-KI-HARNESS-AGENTS-001-subagent-isolation.md) — subagent isolation for multi-skill invocation.

## Index

| ID | Title | Date |
| --- | --- | --- |
| ADR-KI-HARNESS-001 | [Composition over extension](ADR-KI-HARNESS-001-composition-over-extension.md) | 2024-01-01 |
| ADR-KI-HARNESS-002 | [Four-part harness bundle layout](ADR-KI-HARNESS-002-four-part-bundle-layout.md) | 2024-01-01 |
| ADR-KI-HARNESS-003 | [Adopting Architecture Decision Records](ADR-KI-HARNESS-003-adopting-decision-records.md) | 2026-06-23 |
| ADR-KI-HARNESS-004 | [Purpose and scope of this repository](ADR-KI-HARNESS-004-purpose-and-scope.md) | 2026-06-23 |
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

<What is the problem or constraint that forced a decision? Keep to one paragraph of essential background — the reader can follow links for depth.>

## Decision

<The decision itself, stated plainly. One paragraph or a short bulleted list. Not rationale — just what was decided.>

## Consequences

<What changes as a result? Include both the positive effects and the trade-offs or follow-on constraints. Keep it factual.>

## References

- [Source doc title](../path/to/doc.md) — the canonical standard this ADR codifies.
```
