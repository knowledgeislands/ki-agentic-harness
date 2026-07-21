---
id: ADR-KI-HARNESS-001
title: 'Repository structure — the five-part bundle'
date: 2026-06-23
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-001: Repository structure — the five-part bundle

## Context

The `ki-agentic-harness` repository accumulates several kinds of artefact:

- governance skills
- agent definitions
- MCP server wrappers
- evaluation fixtures
- workflow scripts

Without a standard place for each kind of artefact, the parts would be laid out differently in each harness repo, leaving the tooling unable to find, install, or audit them without repo-specific configuration.

## Decision

Every Knowledge Islands agentic harness uses the same top-level layout — one directory per kind of artefact:

- `skills/` — Agent Skills (`SKILL.md` directories)
- `agents/` — subagent definitions
- `mcp/` — MCP server source code
- `evals/` — evaluation suites
- `hooks/` — Claude Code hook scripts, wired into a repo through its `.claude/settings.json`

Each directory carries a `README.md` describing what it holds. An unpopulated directory is an empty shelf whose `README.md` marks intent — a shelf is not a gap. As this is a piece of governance, skills govern this container layout.

## Consequences

- Adding a new artefact to the harness first confirms it fits one of these five parts; whether it belongs in the harness at all is a question of the harness's purpose and scope.
- The harness is governed by its own skills that validate that the bundle is internally consistent — they should treat a missing directory or `README.md` as a failure, ensuring it conforms to this layout.

## References

- [SDR-KI-HARNESS-001](SDR-KI-HARNESS-001-purpose-and-scope-of-the-agentic-harness.md) — the purpose and scope of the harness this structure realises.
