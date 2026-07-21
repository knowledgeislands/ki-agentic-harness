---
id: ADR-KI-HARNESS-SKILLS-007
title: 'ki-housekeeping scope and the server pairing'
date: 2026-07-09
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-SKILLS-007: ki-housekeeping scope and the server pairing

## Context

The former `ki-memory` skill governed one narrow thing: the Claude Code auto-memory file format. But memory is only one kind of state Claude accumulates on a machine — sessions, artifacts and outputs, backups, plugins, and project caches pile up across Claude Desktop / Cowork, Claude Code (`~/.claude/`), and VSCode chat sessions, none of it owned by any repo-structure skill. Separately, the `mcp-claude-housekeeping` MCP server already ships codified per-surface audits and access-gated cleanup tools over exactly that state, with memory as one of its areas. Two instruments were circling the same domain from opposite ends — a skill with a standard but a memory-only reach, and a server with tools but no opinion on when to use them.

## Decision

`ki-memory` broadens into **`ki-housekeeping`**: the standard-and-judgment governor of the hygiene of accumulated Claude state, across all its areas, sitting in the Environment cluster ([ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-six-cluster-skill-taxonomy-and-the-implication-graph.md)). It pairs with the `mcp-claude-housekeeping` server on one principle: **the skill is the standard and the judgment; the server is the tools.**

- **Memory** stays governed locally in full — a file convention the skill fully specifies and checks with its own `audit-memory.ts`.
- **Every other area** is audited and cleaned through the server's codified audits and access-gated read/`destructive` tools; the skill reads the findings and decides, and never re-implements the tools.

## Consequences

- Memory becomes one area of a coherent housekeeping domain rather than the whole skill.
- The skill and server compose without overlap: the server ships tools with no policy; the skill holds the policy and only the memory checker. The server's own code quality remains `ki-mcp`'s concern.
- The skill now tracks two moving sources — Headroom's memory behavior and the server's tool surface — so its REFRESH re-anchors both.
- Boundaries hold: a KB's own `Admin/MEMORY.md` cascade is `ki-kb`'s concern, and the token cost of the context surface is `ki-tokenomics`.

## References

- [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-six-cluster-skill-taxonomy-and-the-implication-graph.md) — the taxonomy that places ki-housekeeping in the Environment cluster.
