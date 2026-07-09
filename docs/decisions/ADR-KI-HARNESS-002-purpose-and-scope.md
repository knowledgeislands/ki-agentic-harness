# ADR-KI-HARNESS-002: Purpose, scope, and structure of this repository

**Date:** 2026-06-23

## Context

The `ki-agentic-harness` repository accumulates several kinds of artefacts:

- governance skills
- agent definitions
- MCP server wrappers
- evaluation fixtures
- workflow scripts

Without an explicit statement of what this repository is for — and what it is not for — its scope tends to drift, and contributors must infer purpose from content. And without a standard place for each kind of artefact, the parts would be laid out differently in each harness repo, leaving the tooling unable to find, install, or audit them without repo-specific configuration.

## Decision

The `ki-agentic-harness` is the canonical home for Knowledge Islands **agentic** capabilities. It is not a general-purpose monorepo: artefacts that belong to a specific product repo, a personal tool, or a sibling MCP server repository should live there, not here. The harness governs how work is done across Knowledge Islands repos; it does not contain the work itself.

Every Knowledge Islands agentic harness uses the same top-level layout — one directory per kind of artefact:

- `skills/` — Agent Skills (`SKILL.md` directories)
- `agents/` — subagent definitions
- `mcp/` — MCP server source code
- `evals/` — evaluation suites
- `hooks/` — Claude Code hook scripts, wired into a repo through its `.claude/settings.json`

Each directory carries a `README.md` describing what it holds. An unpopulated directory is an empty shelf whose `README.md` marks intent — a shelf is not a gap. As this is a piece of governance, skills govern this container layout.

## Consequences

- Adding a new artefact to the harness first confirms it fits one of these parts; if it does not, it belongs elsewhere.
- The harness is governed by its own skills that validate that the bundle is internally consistent — they should treat a missing directory or `README.md` as a failure, ensuring it conforms to this layout.
