---
id: ADR-KI-HARNESS-AGENTS-002
title: 'Portable subagent contract and runtime adapters'
date: 2026-08-12
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-AGENTS-002: Portable subagent contract and runtime adapters

## Context

The Harness supports Claude Code and OpenAI Codex, but its original `ki-subagents` skill and `subagents/` shelf treated Claude Code's Markdown and YAML format as the universal agent-definition contract. Codex has a distinct native TOML format with different fields and discovery paths. Calling either serialization portable would make vendor rules appear universal, while keeping only the Claude shape would leave the Harness's stated runtime support incomplete.

## Decision

`ki-subagents` is the portable parent contract for subagent meaning and effectiveness. It owns identity, purpose and selection description, core instructions, lane, grounding, hand-offs, orchestration intent, and outcome evidence; it owns no runtime serialization.

Runtime adapters compose the parent and own native representation:

- `ki-subagents-claude` owns Claude Code Markdown, YAML frontmatter, discovery paths, fields, and source-shape checks.
- `ki-subagents-chatgpt` owns Codex standalone TOML, discovery paths, fields, and source-shape checks.

Runtime-native definitions live under distinct runtime projections within the `subagents/` source shelf. Definitions with the same portable identity are corresponding projections, not copies that establish one another's correctness. Source conformance never proves installation, activation, effective settings, invocation, or outcome quality.

The `tools-ki` host owns publication and activation. It must select only the projection for the target runtime, reject missing or ambiguous projections, and report unavailable capability when it cannot perform that mapping. Harness skills and source files must not claim host support from descriptor metadata or filesystem presence alone.

## Consequences

- Claude Code and Codex can evolve their native formats without changing the portable semantic contract.
- Runtime-only fields and defaults cannot leak into `ki-subagents` or be mechanically enforced by both adapters.
- The Harness must carry and audit both native projections for every subagent it claims to support on both runtimes.
- Cross-runtime semantic parity can be checked by normalized identity and meaning, while native syntax remains adapter-owned.
- The current host has no implemented subagent publisher for either runtime, so publication and activation remain explicitly unavailable until `tools-ki` implements and verifies the runtime projection boundary.
- Additional runtimes require a new adapter and native projection, not conditionals in the portable parent.

## References

- [ADR-KI-HARNESS-001](ADR-KI-HARNESS-001-repository-structure-the-five-part-bundle.md) — the five-part Harness source layout.
- [SDR-KI-HARNESS-002](SDR-KI-HARNESS-002-runtime-portable-contracts-and-executor-positioning.md) — runtime-portable contracts and conforming execution environments.
- [ADR-KI-HARNESS-SKILLS-003](ADR-KI-HARNESS-SKILLS-003-dependency-order-for-multi-skill-composition.md) — concern-first parent and technology-adapter naming.
- [ADR-KI-HARNESS-AGENTS-001](ADR-KI-HARNESS-AGENTS-001-subagent-isolation-for-multi-skill-invocation.md) — portable orchestration semantics.
