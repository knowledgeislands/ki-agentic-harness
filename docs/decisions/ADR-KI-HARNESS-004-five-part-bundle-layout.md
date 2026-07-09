# ADR-KI-HARNESS-004: Five-part harness bundle layout

**Date:** 2024-01-01

## Context

A harness bundles the parts an agent is equipped with: skills, agents, MCP servers, evals, and hooks. Without a standard layout these parts would be placed differently in each harness repo, making them hard to find, install, or audit consistently. The install keystone (`ki-bootstrap`) and all tooling need to know where each part lives without repo-specific configuration.

## Decision

Every Knowledge Islands agentic harness uses a five-part top-level directory layout:

- `skills/` — Agent Skills (`SKILL.md` directories)
- `agents/` — subagent definitions
- `mcp/` — MCP server source code
- `evals/` — evaluation suites
- `hooks/` — Claude Code hook scripts, wired into a repo through its `.claude/settings.json`

Each directory must carry a `README.md` describing what it holds. An unpopulated directory is an empty shelf with its `README.md` marking intent — a shelf is not a gap. `hooks/` starts as such a shelf, reserving the structure ahead of the harness shipping hooks. The `ki-harness` skill governs this container layout; the contents of each directory are governed by the relevant sibling skill (`ki-skills`, `ki-agents`, `ki-mcp`) — `evals/` and `hooks/` have no dedicated governing skill today and are advisory.

## Consequences

- Tooling (`skills:link:*`, linters) can locate each part without repo-specific configuration.
- A harness can start with empty shelves and populate them over time without restructuring.
- The `ki-harness` AUDIT mode verifies directory presence and README presence as FAIL criteria.
- New harness repos scaffold to this layout via `ki-harness` INIT mode.

## References

This record is self-contained. The layout it fixes is the normative subject of the `ki-harness` skill — its AUDIT mode verifies the directories and their READMEs, and its INIT mode scaffolds them.
