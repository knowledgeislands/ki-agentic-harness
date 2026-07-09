# ADR-KI-HARNESS-002: Purpose and scope of this repository

**Date:** 2026-06-23

## Context

The `ki-agentic-harness` repository accumulates several kinds of artefacts: governance skills, agent definitions, MCP server wrappers, evaluation fixtures, and workflow scripts. Without an explicit statement of what this repository is for — and what it is not for — its scope tends to drift, and contributors must infer purpose from content.

The five-part bundle structure (`skills/`, `agents/`, `mcp/`, `evals/`, `hooks/`) suggests scope, but structure alone does not distinguish "this is what the harness is for" from "this is what happens to live here." An ADR captures the intent explicitly and gives future decisions a stated boundary to reason against.

## Decision

The `ki-agentic-harness` is the canonical home for Knowledge Islands **agent skills**, structured as the five-part bundle that ADR-KI-HARNESS-004 defines — `skills/` (the primary, active part) alongside the `agents/`, `mcp/`, `evals/`, and `hooks/` shelves. This record fixes what that bundle is _for_; ADR-KI-HARNESS-004 fixes its layout.

The harness is not a general-purpose monorepo. Artefacts that belong to a specific product repo, a personal tool, or a sibling MCP server repository should live there, not here. The harness governs how work is done across Knowledge Islands repos; it does not contain the work itself.

## Consequences

- The `skills/` directory remains the active part of the bundle; the other four are populated as KI needs arise.
- A decision to add a new artefact to the harness should first confirm it fits one of the five parts. If it does not, it belongs elsewhere.
- The harness is governed by its own skills: `ki-harness` validates that the bundle is internally consistent.
- Onboarding a new contributor (or agent session) starts with the README, which points to this ADR and the five-part structure.

## References

- [ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-composition-over-extension.md) — composition over extension: the paradigm the skills follow.
- [ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-five-part-bundle-layout.md) — the five-part bundle layout this repository realises.
- [ADR-KI-HARNESS-CONFIG-001](ADR-KI-HARNESS-CONFIG-001-validate-down-ki-config-contract.md) — `.ki-config.toml` as the repo-to-skill binding mechanism.
