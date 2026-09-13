---
id: ADR-KI-HARNESS-005
title: 'Validate-down .ki.toml contract'
date: 2026-06-23
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-005: Validate-down .ki.toml contract

## Context

Each governance skill needed to know whether it applied to a given repo, and what repo-specific configuration it should use. Without a shared signal, skills would either apply to all repos (false positives) or require repo-specific skill customisation (coupling). A single config file per repo, with a table per skill, provides an explicit opt-in that each skill can read independently.

## Decision

`.ki.toml` is the compliance marker and the per-skill configuration carrier. Its presence signals that the repo is a Knowledge Islands repo and all applicable governance standards apply. Each governance skill reads its own `[ki-<skill>]` table; the repo standard verifies that detected standards (Eleventy config → `["knowledgeislands/ki-agentic-harness:ki-repo-website"]`, Streams zone → `["knowledgeislands/ki-agentic-harness:ki-repo-kb-streams"]`, etc.) have a declared table. This direction — each skill reads its own table and verifies downward from the standard, rather than the repo pushing configuration up into the skills — is the **validate-down contract**. A detected-but-undeclared standard and a missing `.ki.toml` are both failures. A repository may decline one mechanically detected standard only through an explicit `coverage-<skill> = false` check override, which remains visible as an audit note. Per-repo overrides live in the skill's own sub-table, not in a forked skill.

The **repository baseline** is exactly `ki-repo` + `ki-authoring`, and both are declared explicitly. Separately, every repository declares portable `ki-tokenomics` plus the environment adapters for each value in `["knowledgeislands/ki-agentic-harness:ki-repo"].supported_runtimes`: `ki-housekeeping-claude` and `ki-tokenomics-claude` for `claude-code`, and `ki-tokenomics-codex` for `codex`. This runtime-coverage floor makes the surrounding agent environment explicit without pretending it is part of the repository-shape baseline. Other environment capabilities, including MCP binding and renderer choices, remain selected only where their standard applies.

## Consequences

- Skills discover their own applicability from a single file without asking the repo for anything else.
- Adding a new governance standard to a repo is one table addition — no code change in any skill.
- Forking a skill for a single repo's variation is prevented: the variation is data in `.ki.toml`, not code in a derived skill.
- The repo coverage gate enforces that detected standards are declared.
- The baseline (`ki-repo` + `ki-authoring`) is declared, not assumed: the config is the complete picture of what governs a repo, with no implicit universal hidden in the tooling.
- Runtime coverage is explicit and validate-down: portable tokenomics plus each supported runtime's real environment adapters are declared, while unrelated environment capabilities remain opt-in.
