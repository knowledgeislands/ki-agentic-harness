# Decision Records — Knowledge Islands Harness

This directory holds the Decision Records for the **ki-agentic-harness** and the Knowledge Islands governance skill set it houses — Architecture Decision Records (`ADR-`), Strategy Decision Records (`SDR-`), and Governance Decision Records (`GDR-`), per the prefix table in the `ki-decision-records` skill.

## Naming convention

```text
<PREFIX>-<SCOPE>-NNN
```

`<PREFIX>` encodes the decision type (`ADR-` architecture, `SDR-` strategy, `GDR-` governance). `<SCOPE>` is one or more alpha-leading uppercase segments separated by hyphens — e.g. `KI-HARNESS`, `KI-HARNESS-SKILLS`. `NNN` is a zero-padded integer (minimum three digits), monotonically increasing per prefix within the scope. Foundational harness records use the bare scope `<PREFIX>-KI-HARNESS-NNN`; domain-specific ADRs append a sub-scope: `ADR-KI-HARNESS-<SUB-SCOPE>-NNN`. A filename is `<ID>-<title-slug>.md`: the canonical uppercase ID followed by the title lowercased with non-alphanumeric runs compressed to one dash.

Sub-scopes used in this harness:

| Sub-scope   | Purpose                                               |
| ----------- | ----------------------------------------------------- |
| _(none)_    | Foundational paradigms and repository-level decisions |
| `TOOLCHAIN` | Standard toolchain choices (Bun, Biome, etc.)         |
| `SKILLS`    | Governance skill structure and canonical modes        |
| `AGENTS`    | Multi-skill invocation and subagent orchestration     |

## Reading order

The records are living, compact, and independent. The order below is a **curated build sequence** — it reads as if the harness were being constructed from scratch, each record building on the ones before it, weaving the sub-scopes (`SKILLS`, `TOOLCHAIN`, `AGENTS`) in where they belong rather than grouping them apart. Numbering stays per-scope for identity; this order is the pedagogical path, and a concept is introduced at its record so later records may name it. A newcomer can read top to bottom; this list is the index (per-record dates live in each record's frontmatter).

## Harness construction reading order

1. [GDR-KI-HARNESS-001](GDR-KI-HARNESS-001-adopting-decision-records.md) — adopting Decision Records (the format these records themselves follow).
2. [GDR-KI-ARCADIA-002](GDR-KI-ARCADIA-002-knowledge-islands-ecosystem-fundamentals.md) — the four-repository ecosystem authorities, publication flows, and choreography.
3. [SDR-KI-HARNESS-001](SDR-KI-HARNESS-001-purpose-and-scope-of-the-agentic-harness.md) — the purpose and scope of the harness (what it is for, and not for).
4. [ADR-KI-HARNESS-001](ADR-KI-HARNESS-001-repository-structure-the-five-part-bundle.md) — the repository structure (the five-part bundle layout).
5. [ADR-KI-HARNESS-002](ADR-KI-HARNESS-002-the-ki-naming-model-and-harness-as-source-vs-plugin-as-projection.md) — the `ki-` naming model and harness-as-source vs plugin-as-projection.
6. [ADR-KI-HARNESS-SKILLS-001](ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md) — the universal EDUCATE / AUDIT / CONFORM / REFRESH modes.
7. [ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-mechanical-first-agent-judgment-progressively-enhances.md) — mechanical-first; agent judgment progressively enhances.
8. [SDR-KI-HARNESS-002](SDR-KI-HARNESS-002-runtime-portable-contracts-and-executor-positioning.md) — runtime-portable contracts, executor positioning (Claude Code now, Hermes next, Pi as conformance test), and the best-tool-for-the-job tenet.
9. [ADR-KI-HARNESS-SKILLS-002](ADR-KI-HARNESS-SKILLS-002-mechanical-and-judgment-checker-split.md) — the mechanical/judgment checker split.
10. [ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-composition-over-extension.md) — composition over extension, the principle no skill may break.
11. [ADR-KI-HARNESS-SKILLS-003](ADR-KI-HARNESS-SKILLS-003-dependency-order-for-multi-skill-composition.md) — the naming grammar and dependency order for composition.
12. [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-must-be-valid-standalone.md) — every skill must be valid standalone.
13. [ADR-KI-HARNESS-005](ADR-KI-HARNESS-005-validate-down-ki-config-toml-contract.md) — the validate-down `.ki-config.toml` contract, the repo-to-skill binding every skill reads.
14. [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md) — user installation, repository bootstrap, and the self-sufficiency contract.
15. [GDR-KI-HARNESS-002](GDR-KI-HARNESS-002-public-repos-and-a-declared-license-decoupled-from-visibility.md) — public repos and a declared license, decoupled from visibility.
16. [ADR-KI-HARNESS-TOOLCHAIN-001](ADR-KI-HARNESS-TOOLCHAIN-001-bun-biome-and-knip-standard-toolchain.md) — the Bun / Biome / knip standard toolchain.
17. [ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling-current-adoptions.md) — complementary tooling currently adopted.
18. [ADR-KI-HARNESS-TOOLCHAIN-003](ADR-KI-HARNESS-TOOLCHAIN-003-proxy-local-mcp-servers-behind-mcporter.md) — proxying local MCP servers behind mcporter.
19. [ADR-KI-HARNESS-SKILLS-005](ADR-KI-HARNESS-SKILLS-005-the-handoff-doctrine-is-its-own-skill.md) — the handoff doctrine is its own skill.
20. [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-six-cluster-skill-taxonomy-and-the-implication-graph.md) — the six-cluster taxonomy and the machine-readable implication graph.
21. [ADR-KI-HARNESS-SKILLS-007](ADR-KI-HARNESS-SKILLS-007-ki-housekeeping-scope-and-the-server-pairing.md) — ki-housekeeping's scope and the server pairing.
22. [ADR-KI-HARNESS-SKILLS-008](ADR-KI-HARNESS-SKILLS-008-a-feature-definitions-skill-for-the-what.md) — a Feature Definitions skill for the "what".
23. [ADR-KI-HARNESS-SKILLS-009](ADR-KI-HARNESS-SKILLS-009-two-repo-structure-skills-for-standalone-tools-and-their-homebrew-tap.md) — ki-tools and ki-homebrew-tap repo-structure skills.
24. [ADR-KI-HARNESS-AGENTS-001](ADR-KI-HARNESS-AGENTS-001-subagent-isolation-for-multi-skill-invocation.md) — subagent isolation for multi-skill invocation.
25. [ADR-KI-HARNESS-TOOLCHAIN-004](ADR-KI-HARNESS-TOOLCHAIN-004-checker-remediation-footer-and-learn-block-context-check.md) — checker remediation footer and the headroom:learn cross-repo context check.
26. [ADR-KI-HARNESS-TOOLCHAIN-005](ADR-KI-HARNESS-TOOLCHAIN-005-generated-and-vendored-code-is-excluded-from-linting-and-knip.md) — generated and vendored code excluded from linting and knip.
27. [ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-uniform-skill-modes-bare-mode-scripts-and-a-coverage-scoped-aggregate-gate.md) — uniform skill modes (bare audit/conform/educate), the toolchain collapse, and the coverage-scoped aggregate gate.
28. [ADR-KI-HARNESS-008](ADR-KI-HARNESS-008-vendored-cross-skill-tools-for-harness-shaped-targets.md) — vendoring cross-skill graph and HELP tools into `.ki-meta/bin/` for harness-shaped targets.
29. [ADR-KI-HARNESS-SKILLS-010](ADR-KI-HARNESS-SKILLS-010-comparable-cited-checker-findings-across-audit-and-conform.md) — comparable, cited checker findings across audit and conform (the `ref`/`file` finding fields, conform `--json`, and the shared aggregate renderer).
30. [ADR-KI-HARNESS-SKILLS-011](ADR-KI-HARNESS-SKILLS-011-repository-roadmaps-for-non-kb-repositories.md) — the non-KB repo-roadmap profiles, thematic plan layout, and Knowledge Base Streams boundary.
31. [ADR-KI-HARNESS-009](ADR-KI-HARNESS-009-portable-model-types-not-vendor-model-names-in-governance-config.md) — portable model _types_ (`frontier`/`reasoning`/`standard`/`fast`) not vendor model names in governance config; the `preferred_model_type` rename and `model_tier_bindings` sub-table.
32. [ADR-KI-HARNESS-010](ADR-KI-HARNESS-010-managed-hook-payloads-and-user-environment-binding.md) — durable hook payloads, user-environment settings binding, and the repository-bootstrap boundary.
33. [ADR-KI-HARNESS-011](ADR-KI-HARNESS-011-project-skill-copies-and-repository-local-links.md) — complete runtime-skill copies by default and explicit repository-local links.
34. [ADR-KI-HARNESS-SKILLS-012](ADR-KI-HARNESS-SKILLS-012-local-copies-for-shared-modules.md) — local copied shared modules without cross-skill imports.
35. [ADR-KI-HARNESS-SKILLS-013](ADR-KI-HARNESS-SKILLS-013-readable-identifier-presentation.md) — title-first human presentation with stable machine identifiers.
36. [ODR-KI-HARNESS-001](ODR-KI-HARNESS-001-scoped-lifecycle-operations.md) — separate repository and user lifecycle operations.

## Template

Each record is a **living present-state record** — it states the decision as it stands now and is edited in place; there is no bold Status, Mutability, supersession, or Changelog line. Required frontmatter carries the ID, title, date, maintenance status, human-readable type, type URL, and machine decision type. The filename is its uppercase ID followed by the slugified title. The full rules live in the `ki-decision-records` skill ([dr-format.md](../../skills/general-governance/ki-decision-records/references/dr-format.md)).

```markdown
---
id: <PREFIX>-KI-<SCOPE>-NNN
title: '<Title>'
date: YYYY-MM-DD
status: current
type: <Human-readable Decision Record type>
type_url: https://knowledgeislands.info/specifications/decision-records/<prefix-lowercase>
decision_type: <machine-decision-type>
---

# <PREFIX>-KI-<SCOPE>-NNN: <Title>

## Context

<What is the problem or constraint that forced a decision? Keep to one paragraph of essential background — a record is self-contained, so inline the context rather than sending the reader elsewhere for it.>

## Decision

<The decision itself, stated plainly. One paragraph or a short bulleted list. Not rationale — just what was decided.>

## Consequences

<What changes as a result? Include both the positive effects and the trade-offs or follow-on constraints. Keep it factual.>

## References

A record is **self-contained**. Its only followable links are to sibling records in this directory (backward in the reading-order layering — the foundations a decision builds on) and to external URLs (a tool's homepage, a spec, a source), and the `## References` section lists only those. Everything else — other internal Knowledge Islands artefacts (skills, guides, feature definitions, workflows, KB notes) and the standards a decision grounds in — is **named in the body prose**, not linked and not listed under References, so nothing depends on chasing a link that rots. External links are supplementary: the record must read completely without following them. A record also states the decision, not the enforcing skill's volatile identifiers — no `SHAPE-N`/`SCRIPT-N` criterion IDs or `§N` section numbers; name the concept or standard.

- [ADR-KI-HARNESS-NNN](ADR-KI-HARNESS-NNN-title.md) — the foundational decision this record builds on.
```
