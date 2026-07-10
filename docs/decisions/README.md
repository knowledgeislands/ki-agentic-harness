# Architecture Decision Records — Knowledge Islands Harness

This directory holds the Architecture Decision Records (ADRs) for the **ki-agentic-harness** and the Knowledge Islands governance skill set it houses.

## Naming convention

```text
ADR-<SCOPE>-NNN
```

`<SCOPE>` is one or more alpha-leading uppercase segments separated by hyphens — e.g. `KI-HARNESS`, `KI-HARNESS-SKILLS`. `NNN` is a zero-padded integer (minimum three digits), monotonically increasing within the scope. Foundational harness ADRs use the bare scope `ADR-KI-HARNESS-NNN`; domain-specific ADRs append a sub-scope: `ADR-KI-HARNESS-<SUB-SCOPE>-NNN`.

Sub-scopes used in this harness:

| Sub-scope   | Purpose                                               |
| ----------- | ----------------------------------------------------- |
| _(none)_    | Foundational paradigms and repository-level decisions |
| `TOOLCHAIN` | Standard toolchain choices (Bun, Biome, etc.)         |
| `SKILLS`    | Governance skill structure and canonical modes        |
| `AGENTS`    | Multi-skill invocation and subagent orchestration     |

## Reading order

The records are living, compact, and independent. The order below is a **curated build sequence** — it reads as if the harness were being constructed from scratch, each record building on the ones before it, weaving the sub-scopes (`SKILLS`, `TOOLCHAIN`, `AGENTS`) in where they belong rather than grouping them apart. Numbering stays per-scope for identity; this order is the pedagogical path, and a concept is introduced at its record so later records may name it. A newcomer can read top to bottom; this list is the index (per-record dates live in each record's `**Date:**` field).

1. [ADR-KI-HARNESS-001](ADR-KI-HARNESS-001-adopting-decision-records.md) — adopting Decision Records (the format these records themselves follow).
2. [ADR-KI-HARNESS-002](ADR-KI-HARNESS-002-purpose-scope-structure.md) — the purpose, scope, and structure of the repository (its bundle layout).
3. [ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-naming-model-and-harness-as-source.md) — the `ki-` naming model and harness-as-source vs plugin-as-projection.
4. [ADR-KI-HARNESS-SKILLS-001](ADR-KI-HARNESS-SKILLS-001-canonical-modes.md) — the universal INIT / AUDIT / CONFORM / REFRESH modes.
5. [ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-mechanical-first-llm-optional.md) — mechanical-first, LLM-optional operation.
6. [ADR-KI-HARNESS-SKILLS-002](ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md) — the mechanical/judgment checker split.
7. [ADR-KI-HARNESS-005](ADR-KI-HARNESS-005-composition-over-extension.md) — composition over extension, the principle no skill may break.
8. [ADR-KI-HARNESS-SKILLS-003](ADR-KI-HARNESS-SKILLS-003-dependency-order-composition.md) — the naming grammar and dependency order for composition.
9. [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md) — every skill must be valid standalone.
10. [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-validate-down-ki-config-contract.md) — the validate-down `.ki-config.toml` contract, the repo-to-skill binding every skill reads.
11. [ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-bootstrapping-and-self-sufficiency.md) — the bootstrapping chain and the self-sufficiency contract.
12. [ADR-KI-HARNESS-TOOLCHAIN-001](ADR-KI-HARNESS-TOOLCHAIN-001-standard-toolchain.md) — the Bun / Biome / knip standard toolchain.
13. [ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling.md) — complementary tooling currently adopted.
14. [ADR-KI-HARNESS-TOOLCHAIN-003](ADR-KI-HARNESS-TOOLCHAIN-003-mcporter-mcp-proxy.md) — proxying local MCP servers behind mcporter.
15. [ADR-KI-HARNESS-SKILLS-005](ADR-KI-HARNESS-SKILLS-005-handoff-doctrine-own-skill.md) — the handoff doctrine is its own skill.
16. [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md) — the six-cluster taxonomy and the machine-readable implication graph.
17. [ADR-KI-HARNESS-SKILLS-007](ADR-KI-HARNESS-SKILLS-007-housekeeping-scope-and-server-pairing.md) — ki-housekeeping's scope and the server pairing.
18. [ADR-KI-HARNESS-SKILLS-008](ADR-KI-HARNESS-SKILLS-008-feature-definitions-skill.md) — a Feature Definitions skill for the "what".
19. [ADR-KI-HARNESS-SKILLS-009](ADR-KI-HARNESS-SKILLS-009-tools-and-homebrew-tap-structure-skills.md) — ki-tools and ki-homebrew-tap repo-structure skills.
20. [ADR-KI-HARNESS-AGENTS-001](ADR-KI-HARNESS-AGENTS-001-subagent-isolation.md) — subagent isolation for multi-skill invocation.
21. [ADR-KI-HARNESS-008](ADR-KI-HARNESS-008-public-and-declared-license.md) — public repos and a declared license, decoupled from visibility.

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

A record is **self-contained**: its outbound links are limited to sibling ADRs in this directory (following the reading-order layering — reference the foundations a decision builds on) and external URLs (a tool's homepage, a spec, a source). Do not link to other internal Knowledge Islands artefacts — skills, guides, feature definitions, workflows, KB notes — name them in prose instead, inlining any context the reader needs. External links are supplementary: the record must read completely without following them. A record also states the decision, not the enforcing skill's volatile identifiers — no `SHAPE-N`/`SCRIPT-N` criterion IDs or `§N` section numbers; name the concept or standard.

- [ADR-KI-HARNESS-NNN](ADR-KI-HARNESS-NNN-slug.md) — the foundational decision this record builds on.
```
