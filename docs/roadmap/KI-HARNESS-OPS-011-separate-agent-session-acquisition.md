---
id: KI-HARNESS-OPS-011
title: Separate agent-session acquisition
kind: deliver
purpose: capability
theme: model
component: acquire
area: OPS
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-20T22:26:28Z
updated_at: 2026-10-20T22:26:28Z
---

# KI-HARNESS-OPS-011: Separate Agent-Session Acquisition

## Goal

Claude and Codex session acquisition has its own guidance, apart from the `ki-housekeeping-claude` and `ki-housekeeping-chatgpt` skills, and imports a full session only by exception rather than in routine bulk; and the harness has decided whether the `mcp-housekeeping-*` repositories stay shared read-only source adapters or need acquisition-specific names or projections.

## Context

These are two of the eight unfinished AI-session acquisition steps carried by [KI-HARNESS-OPS-009](KI-HARNESS-OPS-009-complete-ai-session-acquisition.md). Kris took OPS009-SPLIT a) on 20 October 2026 at 23:16 BST, in the ways-of-working "query sign-offs, first batch": split OPS-009, keeping in the harness only the steps it owns. Both steps concern the seam `ADR-KI-HARNESS-SKILLS-007` draws between acquisition and housekeeping skills, which the harness owns, so they travel together.

## Boundary

- In: the acquisition and housekeeping skill guidance in this harness, and the decision on the adapters' role and naming, recorded against `ADR-KI-HARNESS-SKILLS-007`.
- Out: renaming or changing an `mcp-housekeeping-*` repository, which that repository plans and accepts in its own record once this decision is made; executable importer changes, which `tools-ki` owns.

## Current state

Split from OPS-009, not yet planned.

## Steps

- [ ] Separate Claude and Codex acquisition guidance from their housekeeping skills, using exception-based full-session import rather than routine bulk import.
- [ ] Decide whether the existing `mcp-housekeeping-*` repositories remain shared read-only source adapters or need acquisition-specific names or projections.

## Files touched

To be set when planned.

## Verify

To be set when planned.

## Dependencies / blocks

None in this repository. If the decision renames or reshapes an adapter, the `mcp-housekeeping-claude` and `mcp-housekeeping-chatgpt` repositories carry that change in their own records.

## Documentation impact

### Decision Records

`ADR-KI-HARNESS-SKILLS-007` sets the seam between acquisition and housekeeping skills; the adapter decision amends or supersedes it.

### Specifications

None yet.

### Guides

None yet.

### Roadmap

Split from KI-HARNESS-OPS-009.

## Discussion

### Split - 2026-10-20

Captured at Next as draft, OPS-009's own horizon and status, under Kris's OPS009-SPLIT a), which lifted the capture gate for this split only. No planning has been done.
