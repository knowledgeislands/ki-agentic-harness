# ADR-KI-HARNESS-002: Four-part harness bundle layout

**Status:** Accepted

**Date:** 2024-01-01

## Context

A harness bundles the four components an agent is equipped with: skills, agents, MCP servers, and evals. Without a standard layout these four parts would be placed differently in each harness repo, making them hard to find, install, or audit consistently. The install keystone (`knowledgeislands-bootstrap`) and all tooling need to know where each part lives without repo-specific configuration.

## Decision

Every Knowledge Islands agentic harness uses a four-part top-level directory layout:

- `skills/` — Agent Skills (`SKILL.md` directories)
- `agents/` — subagent definitions
- `mcp/` — MCP server source code
- `evals/` — evaluation suites

Each directory must carry a `README.md` describing what it holds. An unpopulated directory is an empty shelf with its `README.md` marking intent — a shelf is not a gap. The `knowledgeislands-harness` skill governs this container layout; the contents of each directory are governed by the relevant sibling skill (`knowledgeislands-skills`, `knowledgeislands-agents`, `knowledgeislands-mcp`).

## Consequences

- Tooling (`skills:link:*`, linters) can locate each part without repo-specific configuration.
- A harness can start with empty shelves and populate them over time without restructuring.
- The `knowledgeislands-harness` AUDIT mode verifies directory presence and README presence as FAIL criteria.
- New harness repos scaffold to this layout via `knowledgeislands-harness` INIT mode.

## References

- [skills/knowledgeislands-harness/SKILL.md](../../skills/knowledgeislands-harness/SKILL.md) — Mode AUDIT step 1 and Mode INIT step 2.
- [skills/knowledgeislands-harness/references/harness-standard.md](../../skills/knowledgeislands-harness/references/harness-standard.md) — the normative layout specification.
