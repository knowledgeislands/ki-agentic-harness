---
id: KI-HARNESS-REV-010
area: REV
title: Review Claude workflow
theme: regular-reviews
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: c67db353b78fa737a615d50468053d3db8455611
created_at: 2026-09-21T07:46:49Z
updated_at: 2026-09-22T06:31:41Z
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

- [x] Inventory the file's substantive rules and identify any imported or synchronised context that already owns the same guidance.
- [x] Classify each rule as Claude-specific runtime guidance, cross-runtime personal configuration, repository-local orientation, shared KI governance, obsolete duplication, or transient advice.
- [x] Record a retain, link, migrate, remove, or separately investigate disposition for every rule, including its canonical owner and evidence.
- [x] Capture any approved implementation work in the repository that owns the affected source; do not mutate those sources during this review.

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

## Findings

The installed `~/.claude/workflow.md` and its chezmoi source are byte-identical at SHA-256 `b651a028b1b49e5211ffd77cac2b39da3923908d6668fe5555209149b53bce2f`. The user-level `~/.claude/CLAUDE.md` imports `@workflow.md`, so every rule below is standing Claude context. `chezmoi status` was clean before and after the read-only review.

### Plan mode first

- **Classification:** Cross-runtime personal configuration.
- **Disposition:** Migrate, then remove the duplicate from the Claude-only workflow.
- **Canonical owner:** Personal `AGENTS.md`, `## Workflow`.
- **Evidence:** The personal source already carries the same non-trivial-work planning rule at lines 27–29.
- **Follow-on:** The chezmoi project should project or link this shared preference into Claude context before deleting the local copy.

### Batch edits before formatting

- **Classification:** Mixed cross-runtime preference and Claude-specific runtime explanation.
- **Disposition:** Split.
- **Canonical owner:** Personal `AGENTS.md` for the one-pass formatting rule; Claude workflow only for any still-useful `Read`/`Edit` cache nuance.
- **Evidence:** The general rule already exists in personal `AGENTS.md`; the stale exact-match explanation is specific to Claude's editing surface.
- **Follow-on:** Reduce the Claude section to the runtime delta or remove it if the shared projection makes the explanation unnecessary.

### Audit skill governs what you made

- **Classification:** Shared KI governance with a cross-runtime routing reminder.
- **Disposition:** Link rather than restate.
- **Canonical owner:** The applicable declared skill and repository `.ki.toml`; personal `AGENTS.md` may retain one concise instruction to run the owner audit.
- **Evidence:** Each governance skill defines its own audit, while `.ki.toml` supplies the repository-specific vocabulary. The long thirteen-item anecdote is explanatory history, not durable policy.
- **Follow-on:** Add a short cross-runtime pointer only if agents still miss the owner-specific audit; do not preserve the anecdote in standing context.

### Project source stores

- **Classification:** Cross-runtime personal configuration.
- **Disposition:** Migrate by reference and remove the duplicate.
- **Canonical owner:** Personal `AGENTS.md`, `## Project source stores`.
- **Evidence:** The destination, opt-in rule, credential exclusion, command, and `chezmoi` approval boundary already appear there.
- **Follow-on:** Ensure Claude receives the shared preference before removing this copy.

### Publishing to package registries

- **Classification:** Cross-runtime personal configuration.
- **Disposition:** Migrate by reference and remove the duplicate.
- **Canonical owner:** Personal `AGENTS.md`, `## Publishing to package registries`.
- **Evidence:** The no-public-registry default, reasons, current-distribution check, and preferred alternatives already appear there.
- **Follow-on:** Preserve the full shared rule once; Claude needs only its projection, not an independently edited copy.

### Work on main

- **Classification:** Repository-local orientation mixed with cross-runtime commit and push preferences.
- **Disposition:** Remove the global branch prohibition and link to the repository's selected Git approach.
- **Canonical owner:** `ki-git` for the portable approaches, repository `AGENTS.md` for the local direct-to-main choice, and personal `AGENTS.md` for commit-completed-work and no-unprompted-push preferences.
- **Evidence:** `ki-git` permits three working approaches, while this repository explicitly selects solo direct-to-main. A user-global “do not create branches” rule is therefore too broad.
- **Follow-on:** Replace this section with no Claude-specific text once the shared and repository owners are visible.

### Never silence commit

- **Classification:** Cross-runtime personal operational guidance.
- **Disposition:** Migrate.
- **Canonical owner:** Personal `AGENTS.md`, under workflow or commit safety.
- **Evidence:** The current personal file requires post-commit inspection but does not explicitly prohibit suppressing hook output; the rule remains useful across runtimes.
- **Follow-on:** Add the concise prohibition and verification instruction to the chezmoi-managed personal source, then remove the Claude copy.

### One writer per checkout

- **Classification:** Shared Git governance mixed with stale local operating advice.
- **Disposition:** Replace with a pointer to current shared-tree safety.
- **Canonical owner:** `ki-git` and the repository `AGENTS.md` working approach.
- **Evidence:** Current `ki-git` explicitly permits a shared working copy with disjoint touched paths and a serialised Git write window. The workflow's absolute one-writer rule is stricter and now conflicts with that accepted contract.
- **Follow-on:** Preserve the useful no-discard, contested-path, and quiet-test-run principles through `ki-git`; remove the obsolete authorship and blanket one-writer claims from Claude standing context.

### Stay scoped to the current session

- **Classification:** Cross-runtime personal configuration.
- **Disposition:** Remove as duplication after shared projection.
- **Canonical owner:** Personal `AGENTS.md`, `## Workflow`.
- **Evidence:** It already says to stay focused and treat pre-existing or unrelated working-tree changes as out of scope unless they conflict.
- **Follow-on:** None beyond consolidating the projection.

### Hand over work needing another repository

- **Classification:** Shared KI cross-repository governance.
- **Disposition:** Replace with a link to the governed trade and receiver-disposition process.
- **Canonical owner:** `ki-trades`, `ki-next`, and the selected work adapter.
- **Evidence:** The current paragraph correctly separates authority but can be read as permission to create a record directly in another repository. Current governance requires the receiver to retain adoption, priority, implementation, and acceptance authority.
- **Follow-on:** Remove the bespoke example and rely on the governed cross-repository route; capture a process gap only if the existing skills cannot express the hand-off.

### Search spellings

- **Classification:** Cross-runtime personal configuration.
- **Disposition:** Migrate.
- **Canonical owner:** Personal `AGENTS.md`.
- **Evidence:** The British-English and spelling-variant search rule is useful across tools and is absent from the current shared personal source.
- **Follow-on:** Add a concise version to the chezmoi-managed personal source, then remove the Claude-only copy.

## Review

### Delivered

Completed the approved read-only review from immutable baseline `c67db353b78fa737a615d50468053d3db8455611`. Every substantive workflow section has a classification, disposition, canonical owner, evidence, and follow-on. No user configuration, chezmoi source, repository guidance, or governing skill was edited.

### Summary of changes

Recorded eleven rule-group dispositions in this roadmap item. Five are already duplicated by personal `AGENTS.md`, two should migrate there, three should be replaced by links to current KI governance, and the formatting section should retain at most its Claude-specific editing nuance. The review also identifies the global one-writer and no-branches language as stale against current `ki-git` and repository policy.

### Verification

The installed and source workflow files have the same SHA-256 hash. `~/.claude/CLAUDE.md` confirms the workflow is imported. `chezmoi status` returned no managed drift, and `ki repo audit --skill ki-work-roadmap --repo .` passes with this review packet.

### Outstanding concerns

Claude does not automatically consume the Codex personal `AGENTS.md`, so duplicated sections must not simply be deleted before chezmoi supplies a shared projection or concise Claude pointer. The consolidation itself remains owner-specific follow-on work outside this item.

### Post-change review

The review meets the goal without changing any source under review. The disposition set reduces standing duplication while preserving the few genuinely Claude-specific details and routing shared policy back to its current owners. It is ready for acceptance review.

### Mini recap

The Claude workflow is synchronised with its chezmoi source but is no longer a clean canonical owner: most content is shared personal or KI governance, and two sections conflict with newer Git policy. The next safe step is a chezmoi-owned consolidation, not an in-place edit from this Harness item.

## Discussion

### Planning decisions

The review records one row per substantive rule: source excerpt or stable label, classification, disposition, canonical owner, evidence, and any separately scoped follow-on. It compares the installed file with its chezmoi source and current imported guidance, but treats all of them as read-only evidence. Completion means the disposition inventory is written into this record; it does not mean any recommendation has been applied.

### Review questions

Classify each substantive rule as Claude-specific runtime guidance, cross-runtime personal configuration, repository-local orientation, shared KI governance, obsolete duplication, or transient advice. Check whether retained material has one canonical source and whether runtime files use concise pointers instead of copying shared standards.

### Authority and safety

The local file is evidence to review, not authority to overwrite another owner. The review should identify the chezmoi-managed source before proposing changes and must preserve user approval for any deletion or promotion into durable shared guidance.
