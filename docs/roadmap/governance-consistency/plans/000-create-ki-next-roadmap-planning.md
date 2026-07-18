---
id: '000'
title: Create ki-next for roadmap-directed planning
status: open
roadmap: governance-consistency/create-ki-next-for-roadmap-directed-planning
blocks: foundation-tooling/001
blocked-by: —
---

## Context

The next decision is repeatedly performed in conversation: inspect the roadmap, assess whether it remains relevant, decide whether Soon work should enter the immediate queue, select the most beneficial work, and create governed plans in an agreed order.

`ki-next` should make that decision deliberate and repeatable, using current-session context when a recap has just occurred but without making autonomous roadmap changes or substituting historical transcript mining for current-session judgment.

## Current state

`ki-recap` supplies grounded live-session context, while `ki-project-roadmap` and `ki-plan` separately own the roadmap standard and plan lifecycle.

There is no process skill that composes those surfaces to turn a fresh roadmap read and current-session recap context into a user-confirmed, review-first plan queue.

Recent sessions exposed the practical details this process must make routine: canonical theme roadmaps are authored while root and index views are generated; active plans and their dependency graph may span themes; dependency edges, rather than filenames or display order, determine executable order; mechanical audits cannot decide whether work is obsolete or beneficial; and planning discoveries must remain proposals until the user confirms them.

## Steps

1. Define `ki-next` as a process skill and document its ownership boundary: it composes `ki-recap`, `ki-project-roadmap`, and `ki-plan`; it owns neither the roadmap standard nor the plan lifecycle, and it redirects KB repositories to their stream-planning process.
2. Make preflight straightforward: resolve the repository and profile, run the read-only roadmap audit, read canonical theme roadmaps plus the generated active-plan index and dependency graph, and stop on drift rather than repairing unrelated state.
3. Define the optional relevance pass as a short judgment review over stale or obsolete items, satisfied waiting conditions, duplicates, already-planned work, and changed dependencies. Present evidence and proposed changes, but do not silently remove, move, or rewrite an item.
4. Build the candidate set from existing Blocking and Next work first. Only when both global horizons are empty may it propose eligible Soon promotions; exclude Future candidates and externally blocked work unless the user explicitly asks to reconsider them.
5. Rank viable options with brief evidence covering expected benefit, leverage, risk reduction, delivery cost, reversibility, readiness, and dependency availability. Do not invent a single numeric score, and preserve an ordering the user supplies.
6. Define the current-session input contract: a recent `ki-recap` can supply grounded outstanding work, routed learnings, and Specific actions as conversational context, but `ki-next` must freshly re-ground dynamic roadmap claims, work without a recap when necessary, and never scan historical transcripts as a substitute.
7. Present the proposed selection, order, required horizon changes, existing-plan reuse, and new-plan locations before writing. Require explicit confirmation, then use the existing roadmap and `ki-plan` procedures, represent apply order through dependency edges rather than filenames alone, re-run the roadmap audit, and stop for review of every created or revised plan before implementation.
8. Add concise help, worked scenarios, source-map and skills-guide entries, generated composition graph material, and focused tests covering simple and thematic profiles, cross-theme dependencies, empty and non-empty immediate queues, existing plans, user-supplied order, rejected proposals, and the KB off-ramp.
9. Run the skills checks, regenerate derived skill documentation, re-vendor any coverage-scoped checker changes, then run `bun run test` and `bun run ki:audit` sequentially.

## Files touched

- `skills/process/ki-next/`
- `skills/README.md`
- `docs/guides/user-guide/skills.md`
- `.ki-config.toml` and generated `.ki-meta/` payloads if the new or changed coverage requires them
- Focused skill graph, help, and process-skill tests

## Verify

- `ki-next` performs no roadmap or plan write before the user explicitly confirms both selection and order.
- With non-empty global Blocking or Next work, `ki-next` does not propose Soon promotion; with both empty, it proposes eligible Soon work but still does not promote it autonomously.
- A current `ki-recap` can supply live-session context to `ki-next`; the latter rechecks the live roadmap and does not mine historical transcripts.
- Confirmed work is promoted and planned only through the existing roadmap and `ki-plan` contracts, after which `ki-next` stops for plan review.
- Existing plans are reused, cross-theme dependencies are visible, and the confirmed apply order is represented by valid dependency edges rather than inferred from index ordering.
- Relevance findings and newly discovered work remain proposals until the user approves the corresponding roadmap change.
- `bun run ki:skills:audit`, `bun run test`, and `bun run ki:audit` pass sequentially.

## Dependencies / blocks

This is the root of the agreed near-term execution sequence.

It blocks `foundation-tooling/001`; the existing foundation sequence then continues through `foundation-tooling/004` before the focused `ki-recap` handoff update in `governance-consistency/005`.
