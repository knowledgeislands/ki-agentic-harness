---
id: SDR-KI-HARNESS-001
title: 'Purpose and scope of the agentic harness'
date: 2026-06-23
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/sdr
decision_type: strategy
---

# SDR-KI-HARNESS-001: Purpose and scope of the agentic harness

## Context

The `ki-agentic-harness` repository accumulates several kinds of artefact — agent skills, agent definitions, MCP servers, evaluation fixtures, workflow scripts. Without an explicit statement of what this repository is for — and what it is not for — its scope tends to drift, and contributors must infer purpose from content.

## Decision

The `ki-agentic-harness` is the canonical home for Knowledge Islands **agentic** capabilities. It is not a general-purpose monorepo: artefacts that belong to a specific product repo, a personal tool, or a sibling MCP server repository should live there, not here. The harness governs how work is done across Knowledge Islands repos; it does not contain the work itself.

## Consequences

- A candidate artefact is admitted only if it is an agentic capability the harness is meant to govern; work that belongs to a product, a personal tool, or a sibling repository lives elsewhere.
- Ownership divides into four classes, each with one canonical owner. A portable contract that constrains every conforming implementation belongs to `ki-specifications`. Estate purpose, authority and cross-repository direction belong to `ki-arcadia-principal`. A reusable agentic capability - skills, governed rubric definitions, the compatible-harness payload and capability semantics - belongs to this harness, with `tools-ki` hosting its generic execution. A vendor runtime binding belongs to the matching `ki-<concern>-<runtime>` adapter here, whose portable root remains the source of any runtime-neutral declaration. Two classes conflict only when both claim the same authoritative rule or write target; otherwise a link, conformance dependency, implementation evidence or generated projection is an intended boundary crossing.
- This positioning is the reference point later strategy records build on — notably the runtime-portable-contracts decision, which sets where these capabilities execute.
