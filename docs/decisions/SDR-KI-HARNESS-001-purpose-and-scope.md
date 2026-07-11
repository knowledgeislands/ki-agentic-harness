# SDR-KI-HARNESS-001: Purpose and scope of the agentic harness

**Date:** 2026-06-23

## Context

The `ki-agentic-harness` repository accumulates several kinds of artefact — governance skills, agent definitions, MCP server wrappers, evaluation fixtures, workflow scripts. Without an explicit statement of what this repository is for — and what it is not for — its scope tends to drift, and contributors must infer purpose from content.

## Decision

The `ki-agentic-harness` is the canonical home for Knowledge Islands **agentic** capabilities. It is not a general-purpose monorepo: artefacts that belong to a specific product repo, a personal tool, or a sibling MCP server repository should live there, not here. The harness governs how work is done across Knowledge Islands repos; it does not contain the work itself.

## Consequences

- A candidate artefact is admitted only if it is an agentic capability the harness is meant to govern; work that belongs to a product, a personal tool, or a sibling repository lives elsewhere.
- This positioning is the reference point later strategy records build on — notably the runtime-portable-contracts decision, which sets where these capabilities execute.
