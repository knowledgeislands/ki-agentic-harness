---
id: KI-HARNESS-REV-010
area: REV
title: Review Claude workflow
theme: regular-reviews
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-21T07:46:49Z
updated_at: 2026-09-21T07:46:49Z
---

## Goal

Determine whether the guidance in `~/.claude/workflow.md` remains current and place each useful rule with its narrowest durable owner.

## Context

The current user-scoped Claude workflow is a regular local file containing a mixture of runtime workflow, cross-runtime personal preferences, repository-working practices, and guidance that may now overlap the synchronised personal `AGENTS.md` or an owning KI skill. A focused review can identify stale duplication, Claude-specific guidance worth retaining, and rules that should instead be promoted or linked to their canonical owner.

## Boundary

Review and recommend dispositions only. Do not edit `~/.claude/workflow.md`, its chezmoi source, personal `AGENTS.md`, repository guidance, or KI skills under this item. Any approved migration, deletion, or shared-governance change must be separately scoped and committed in the repository that owns it.

## Discussion

### Review questions

Classify each substantive rule as Claude-specific runtime guidance, cross-runtime personal configuration, repository-local orientation, shared KI governance, obsolete duplication, or transient advice. Check whether retained material has one canonical source and whether runtime files use concise pointers instead of copying shared standards.

### Authority and safety

The local file is evidence to review, not authority to overwrite another owner. The review should identify the chezmoi-managed source before proposing changes and must preserve user approval for any deletion or promotion into durable shared guidance.
