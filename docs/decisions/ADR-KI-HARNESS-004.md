# ADR-KI-HARNESS-004: Purpose and scope of this repository

**Status:** Accepted

**Mutability:** open

**Date:** 2026-06-23

## Context

The `ki-agentic-harness` repository accumulates several kinds of artefacts: governance skills, agent definitions, MCP server wrappers, evaluation fixtures, and workflow scripts. Without an explicit statement of what this repository is for — and what it is not for — its scope tends to drift, and contributors must infer purpose from content.

The four-part bundle structure (`skills/`, `agents/`, `mcp/`, `evals/`) suggests scope, but structure alone does not distinguish "this is what the harness is for" from "this is what happens to live here." An ADR captures the intent explicitly and gives future decisions a stated boundary to reason against.

## Decision

The `ki-agentic-harness` is the canonical home for Knowledge Islands **agent skills**, structured as a four-part bundle:

- **`skills/`** — `ki-*` governance skills. Each skill holds a house standard and ships AUDIT / CONFORM / REFRESH modes plus a mechanical checker. This is the primary and active part of the bundle.
- **`agents/`** — KI-governed agent definitions. These are `.md` files with YAML frontmatter following the Agent Skills standard, defining reusable agents for use in Claude Code sessions.
- **`mcp/`** — KI-governed MCP server wrappers. These complement the externally-developed MCP servers used in KI repos; they are not replacements for the servers in sibling repositories.
- **`evals/`** — evaluation fixtures and harness-level test scripts. These are used to verify that skills and agents behave as intended.

The harness is not a general-purpose monorepo. Artefacts that belong to a specific product repo, a personal tool, or a sibling MCP server repository should live there, not here. The harness governs how work is done across Knowledge Islands repos; it does not contain the work itself.

## Consequences

- The `skills/` directory remains the active part of the bundle; the other three are populated as KI needs arise.
- A decision to add a new artefact to the harness should first confirm it fits one of the four parts. If it does not, it belongs elsewhere.
- The harness is governed by its own skills: `ki-harness` validates that the bundle is internally consistent.
- Onboarding a new contributor (or agent session) starts with the README, which points to this ADR and the four-part structure.

## References

- [README.md](../../README.md) — entry point; maps the four-part bundle and the skill layers.
- [ADR-KI-HARNESS-001](ADR-KI-HARNESS-001.md) — composition over extension: the paradigm the skills follow.
- [ADR-KI-HARNESS-002](ADR-KI-HARNESS-002.md) — the four-part bundle layout this repository realises.
- [ADR-KI-HARNESS-CONFIG-001](ADR-KI-HARNESS-CONFIG-001.md) — `.ki-config.toml` as the repo-to-skill binding mechanism.
- [skills/ki-harness/SKILL.md](../../skills/ki-harness/SKILL.md) — the skill that governs the harness bundle itself.

## Changelog

- 2026-07-02 — added the `**Mutability:**` marker (open); corrected the mislabeled cross-reference (the `.ki-config.toml` binding mechanism is CONFIG-001, not 002) and made references relative links.
