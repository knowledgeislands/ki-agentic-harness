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

## Steps

1. Define `ki-next` as a process skill and document its ownership boundary: it composes `ki-recap`, `ki-project-roadmap`, and `ki-plan`; it owns neither the roadmap standard nor the plan lifecycle.
2. Specify the read-first selection flow: optionally check roadmap relevance; inspect global Blocking and Next horizons; when both are empty, propose eligible Soon promotions; rank viable options with concise evidence; and present the alternatives without writing.
3. Define the current-session input contract: a recent `ki-recap` can supply grounded outstanding work, routed learnings, and Specific actions as conversational context, but `ki-next` must freshly re-ground dynamic roadmap claims and must not scan historical transcripts as a substitute.
4. Require explicit user confirmation of the selected items and order before changing a horizon or creating a plan; after confirmation, use the existing roadmap and `ki-plan` procedures, then stop and request review of every generated plan before implementation.
5. Add the skill's references, help text, source-map and skills-guide entries, generated composition graph material, and focused tests or fixtures needed to keep its boundary and interaction contracts checkable.
6. Run the skills checks, regenerate derived skill documentation, re-vendor any coverage-scoped checker changes, then run `bun run test` and `bun run ki:audit` sequentially.

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
- `bun run ki:skills:audit`, `bun run test`, and `bun run ki:audit` pass sequentially.

## Dependencies / blocks

This is the root of the agreed near-term execution sequence.

It blocks `foundation-tooling/001`; the existing foundation sequence then continues through `foundation-tooling/004` before the focused `ki-recap` handoff update in `governance-consistency/005`.
