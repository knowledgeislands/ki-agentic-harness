---
id: KI-HARNESS-OPS-011
title: Separate agent-session acquisition
kind: deliver
purpose: capability
theme: model
component: acquire
size: m
area: OPS
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: d2e2a8964c4868e407e3b2bc2d5d12c9c081589d
created_at: 2026-10-20T22:26:28Z
updated_at: 2026-10-22T02:07:40Z
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

Shaped and delivered under the 22 October overnight brief. The bounded plan homes agent-session acquisition in one reference under `ki-acquire`, makes both housekeeping skills off-ramps, and amends the existing architecture decision to keep shared read-only adapters and their names. Immutable baseline is in front matter.

## Steps

- [x] Separate Claude and Codex capture into acquisition-owned guidance, with owner-selected full-session exceptions, faithful preservation and no routine bulk import.
- [x] Retain the existing shared MCP session-source surfaces and names, recording that bounded choice in the existing architecture decision; make no adapter or importer change.
- [x] Refresh the generated capability catalogue for the revised housekeeping description and run the required harness checks before the review handoff.

## Files touched

- This roadmap record.
- `skills/acquire/ki-acquire/SKILL.md` and new `references/standards-agent-session-acquisition.md`.
- `skills/environment/ki-housekeeping-claude/SKILL.md` and `skills/environment/ki-housekeeping-chatgpt/SKILL.md`.
- `docs/decisions/ADR-KI-HARNESS-SKILLS-007-provider-neutral-ai-session-acquisition-and-adapter-pairing.md`.
- Generated `skills/README.md`.

## Verify

Run `bun run test`, `bunx --no-install tsc --noEmit`, and sequential focused audits for `ki-acquire`, `ki-housekeeping-claude`, `ki-housekeeping-chatgpt`, `ki-decision-records`, `ki-skills`, `ki-authoring`, `ki-repo-harness`, `ki-work` and `ki-work-roadmap`. Verify the capability catalogue, full isolated harness audit and mandatory commit hooks. Judge exception-based selection, complete-payload honesty, no adapter mutation and the independent cleanup authority boundary. No live session or provider access is required.

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

## Review

### Delivered

Delivered the two approved guidance-and-decision steps from `baseline_ref`, under the overnight triage-and-draft grant. No session was imported and no adapter, runtime, credential or provider changed.

### Change Summary

Blind-review repair restores the Claude read-route distinction in its acquisition-owned reference: the repository/session form of `claude_code_session_read` supplies the faithful source payload, while the legacy project/session form is a bounded preview. The guidance requires checking the currently exposed schema and coverage before capture. It changes no adapter or importer and makes no claim of a live provider exercise. The architecture decision remains edited in place with its current as-of date, as required by its owner standard.

Homed Claude/Codex acquisition in a common acquisition reference, linked it from `ki-acquire`, and routed both housekeeping skills to it. Full-session capture requires a selected source-evidence need and retains faithful-completeness checks; routine bulk capture is excluded. Amended the existing architecture decision in place to retain shared read-only source adapters and their names, and refreshed the generated catalogue for the changed description.

### Verification

Before commit, the full harness suite, TypeScript, the nine sequential focused audits named in Verify, the full isolated audit and mandatory hooks pass. The generated catalogue matches canonical descriptions. Judgment review preserves readable ChatGPT's provider route, distinguishes discovery/checkpoints from source payloads, and makes no new importer capability claim. Existing fleet warnings remain separate from this delivery.

### Outstanding concerns

No guidance-delivery concern. Proving or extending executable importer support remains with `tools-ki`; no future capability is advertised by this change. Independent acceptance remains outstanding.

### Post-change review

The separation is discoverable from acquisition and both housekeeping entry points without creating another skill or a duplicate adapter. Retaining names is conservative and reversible, needs no cross-repository mutation, and keeps source-read authority distinct from separately reviewed cleanup.

### Mini recap

Delivered acquisition-owned session guidance and the adapter naming decision, with source and hosted verification. Durable rationale is in the existing architecture decision. No roadmap record was created, accepted or pruned.

## Discussion

### Split - 2026-10-20

Captured at Next as draft, OPS-009's own horizon and status, under Kris's OPS009-SPLIT a), which lifted the capture gate for this split only. No planning has been done.

### Overnight delivery - 22 October 2026

The approved brief scopes this delivery to session-acquisition guidance and the adapter decision. Retaining shared read-only session-source surfaces supplies the least-change decision within that authority; no adapter repository requires a rename or projection delivery.
