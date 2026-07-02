# ADR-KI-HARNESS-002: Four-part harness bundle layout

**Status:** Accepted

**Mutability:** open

**Date:** 2024-01-01

## Context

A harness bundles the four components an agent is equipped with: skills, agents, MCP servers, and evals. Without a standard layout these four parts would be placed differently in each harness repo, making them hard to find, install, or audit consistently. The install keystone (`ki-bootstrap`) and all tooling need to know where each part lives without repo-specific configuration.

## Decision

Every Knowledge Islands agentic harness uses a four-part top-level directory layout:

- `skills/` — Agent Skills (`SKILL.md` directories)
- `agents/` — subagent definitions
- `mcp/` — MCP server source code
- `evals/` — evaluation suites

Each directory must carry a `README.md` describing what it holds. An unpopulated directory is an empty shelf with its `README.md` marking intent — a shelf is not a gap. The `ki-harness` skill governs this container layout; the contents of each directory are governed by the relevant sibling skill (`ki-skills`, `ki-agents`, `ki-mcp`).

## Consequences

- Tooling (`skills:link:*`, linters) can locate each part without repo-specific configuration.
- A harness can start with empty shelves and populate them over time without restructuring.
- The `ki-harness` AUDIT mode verifies directory presence and README presence as FAIL criteria.
- New harness repos scaffold to this layout via `ki-harness` INIT mode.

## References

- [skills/ki-harness/SKILL.md](../../skills/ki-harness/SKILL.md) — Mode AUDIT step 1 and Mode INIT step 2.
- [skills/ki-harness/references/harness-standard.md](../../skills/ki-harness/references/harness-standard.md) — the normative layout specification.

## Changelog

- 2026-07-02 — added the `**Mutability:**` marker (open).
