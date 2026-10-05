---
id: KI-HARNESS-GOV-139
area: GOV
title: Refresh overdue skill sources
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-05T23:00:00Z
updated_at: 2026-10-05T23:00:00Z
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

## Discussion

### Scope of the refresh

Every row must be genuinely re-reviewed. Updating only the stale dates would silence `LONG-3` without doing the review it asks for.
