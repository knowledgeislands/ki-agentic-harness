---
id: KI-HARNESS-GOV-139
area: GOV
title: Refresh overdue skill sources
theme: governance-consistency
horizon: triage
status: done
intake_disposition: rejected
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-05T23:00:00Z
updated_at: 2026-10-06T10:11:00Z
---

# KI-HARNESS-GOV-139: Refresh overdue skill sources

## Goal

The `ki-authoring` and `ki-repo-mcp` skills are checked against their current upstream sources, so the harness's own audit no longer warns that they are overdue.

## Context

`LONG-3` previously measured a skill's refresh cadence from its newest `Last reviewed` row, so one fresh row hid stale ones. Since the fix in `297f551e`, it measures from the stalest row, and two monthly skills now warn:

- `skills/governance/ki-authoring/references/sources.md`: oldest row 2026-08-12.
- `skills/repo-structure/ki-repo-mcp/references/sources.md`: oldest row 2026-06-21.

## Boundary

In scope: running each skill's Mode REFRESH against its declared sources, reconciling any upstream changes into the skill, and recording the actual review dates.

Out of scope: changing either skill's declared cadence, and any wider change to `LONG-3`.

## Intake disposition

### Outcome

Rejected as Harness intake because its outcome was already achieved outside this record. No retained target applies.

### Rationale

The consolidated weekly refresh in [PR #24](https://github.com/knowledgeislands/ki-agentic-harness/pull/24), squash commit `4c8543719a871b56df5273e163e185ec831e254d`, ran Mode REFRESH for both skills against their declared sources. `ki-authoring` was re-checked in full and no longer warns. `ki-repo-mcp` was re-fetched except the NSA/CISA MCP security CSI, which returned HTTP 403 and keeps its 2026-06-21 date, so `LONG-3` still warns for that one row until the document can be re-checked or is rehosted. That residual is an upstream availability condition, recorded in the skill's own `references/sources.md`, and the next scheduled REFRESH owns it. The repository audit moved from 115 WARN to 2 across that change. No Harness-owned work remains to adopt, and this record carries no delivery evidence of its own.

### Approval

Kris Brown approved closing this intake on 2026-10-06 ("yes, close it out").

## Done

Disposed 2026-10-06 by Kris Brown as rejected on the intake evidence above.

## Discussion

### Scope of the refresh

Every row must be genuinely re-reviewed. Updating only the stale dates would silence `LONG-3` without doing the review it asks for.
