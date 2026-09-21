---
id: KI-HARNESS-REV-010
area: REV
title: Review Claude workflow
theme: regular-reviews
horizon: now
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-21T07:46:49Z
updated_at: 2026-09-21T23:51:38Z
---

## Goal

Determine whether the guidance in `~/.claude/workflow.md` remains current and place each useful rule with its narrowest durable owner.

## Context

The current user-scoped Claude workflow is a regular local file containing a mixture of runtime workflow, cross-runtime personal preferences, repository-working practices, and guidance that may now overlap the synchronised personal `AGENTS.md` or an owning KI skill. A focused review can identify stale duplication, Claude-specific guidance worth retaining, and rules that should instead be promoted or linked to their canonical owner.

## Boundary

Review and recommend dispositions only. Do not edit `~/.claude/workflow.md`, its chezmoi source, personal `AGENTS.md`, repository guidance, or KI skills under this item. Any approved migration, deletion, or shared-governance change must be separately scoped and committed in the repository that owns it.

## Current state

`~/.claude/workflow.md` is a regular user-scoped file whose chezmoi-managed source is `~/.local/share/chezmoi/dot_claude/private_workflow.md`. It currently mixes Claude workflow guidance with cross-runtime personal preferences and rules that may already have canonical repository or skill owners. No rule-by-rule disposition has yet been recorded.

## Steps

- [ ] Inventory the file's substantive rules and identify any imported or synchronised context that already owns the same guidance.
- [ ] Classify each rule as Claude-specific runtime guidance, cross-runtime personal configuration, repository-local orientation, shared KI governance, obsolete duplication, or transient advice.
- [ ] Record a retain, link, migrate, remove, or separately investigate disposition for every rule, including its canonical owner and evidence.
- [ ] Capture any approved implementation work in the repository that owns the affected source; do not mutate those sources during this review.

## Files touched

- `docs/roadmap/KI-HARNESS-REV-010-review-claude-workflow.md`

The installed workflow, its chezmoi source, personal `AGENTS.md`, and KI governance sources are read-only evidence for this review.

## Verify

- Every substantive rule has one explicit disposition and, where retained or migrated, one canonical owner.
- Proposed removals identify the duplicate or obsolete authority that makes removal safe.
- `chezmoi diff` confirms that the review itself changed no managed user configuration.
- `ki repo audit --skill ki-work-roadmap --repo .` passes.

## Dependencies / blocks

The installed workflow and its chezmoi source are locally readable. Any migration or deletion remains dependent on separate owner-specific scope and approval, but that does not block completing the review.

## Documentation impact

### Decision Records

No Decision Record is expected unless the review discovers a durable authority choice not already governed by the knowledge-promotion or runtime-binding contracts.

### Specifications

No accepted behaviour changes during the review; any proposed shared contract change must be separately scoped.

### Guides

The review may recommend concise runtime pointers or an existing guide owner, but it creates no guide by default.

### Roadmap

Owner-specific changes discovered by the review become separate records only when they are substantive and approved; this record retains the disposition evidence.

## Discussion

### Review questions

Classify each substantive rule as Claude-specific runtime guidance, cross-runtime personal configuration, repository-local orientation, shared KI governance, obsolete duplication, or transient advice. Check whether retained material has one canonical source and whether runtime files use concise pointers instead of copying shared standards.

### Authority and safety

The local file is evidence to review, not authority to overwrite another owner. The review should identify the chezmoi-managed source before proposing changes and must preserve user approval for any deletion or promotion into durable shared guidance.
