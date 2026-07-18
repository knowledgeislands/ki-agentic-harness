---
id: '006'
title: Align the four-repository ecosystem contract
status: in-progress
roadmap: governance-consistency/align-the-four-repository-ecosystem-contract
blocks: —
blocked-by: —
---

## Context

Arcadia Principal, the KI Agentic Harness, KI Specifications, and the KI Website need one explicit account of authority, formalisation, publication, bootstrap discovery, and cross-repository choreography. The harness must state its role as a practical realisation of the base without becoming the source of the philosophy, while Specifications owns the normative portable contracts produced from proven concepts and implementation evidence.

## Current state

The base already holds an accepted repository-boundary decision, but its original flow covered three repositories and was linear. Draft working-tree changes introduce the expanded authority graph, stable installer URL, shared working conventions, and initial website publication surfaces. The four repositories still need consistent mirrored GDR001/GDR002 foundations and verified bootstrap governance.

## Steps

1. [ ] Establish mirrored GDR001 and GDR002 foundations across all four repositories, migrating the harness licensing GDR without losing it.
2. [ ] Update the harness README and runtime-neutral guidance with its four-repository role and lightweight choreography convention.
3. [ ] Align the website and specifications governance declarations and re-bootstrap them from the harness.
4. [ ] Verify the four GDR002 mirrors have the same decision substance and ASCII relationship diagram.
5. [ ] Run the harness audits and tests, then close the plan through the plan lifecycle.

## Files touched

- `AGENTS.md`
- `README.md`
- `docs/decisions/`
- `docs/roadmap/governance-consistency/ROADMAP.md`
- `docs/roadmap/governance-consistency/plans/006-align-four-repository-ecosystem.md`

## Verify

`bun run ki:audit` and `bun run test` pass in `ki-agentic-harness`; the shared foundations are indexed; the licensing decision remains present under its migrated identifier.

## Dependencies / blocks

The repository units are independently executable. Cross-repository consistency is verified after all four local units land; no repository is treated as an execution orchestrator for the others.
