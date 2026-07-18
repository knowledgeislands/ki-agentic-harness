---
id: '000'
title: Create ki-next for roadmap-directed planning
status: in-progress
roadmap: governance-consistency/create-ki-next-for-roadmap-directed-planning
blocks: foundation-tooling/001
blocked-by: —
---

## Context

The next decision is repeatedly performed in conversation: inspect the roadmap, assess whether it remains relevant, decide whether Soon work should enter the immediate queue, select the most beneficial work, and create governed plans in an agreed order.

`ki-next` should make that decision deliberate and repeatable, using current-session context when a recap has just occurred but without substituting historical transcript mining for current-session judgment.

When the current horizon has no eligible work, the process must actively refill the pipeline through confirmed, governance-valid promotions and then evaluate the work in its new stage rather than merely report that the queue is empty.

## Current state

`ki-recap` can supply grounded live-session context, while `ki-project-roadmap` and `ki-plan` separately own the roadmap standard and plan lifecycle.

There is no process skill that composes those surfaces to turn a fresh roadmap read and current-session recap context into a user-confirmed, review-first plan queue.

`ki-project-roadmap` defines the five horizons but does not yet state the complete readiness and transition contract for a judgment-led process that replenishes an empty immediate queue. CONFORM correctly refuses to move authored items, so the missing behaviour belongs in a process applying governance rules rather than in the mechanical conformer.

Recent sessions exposed the practical details this process must make routine: canonical theme roadmaps are authored while root and index views are generated; active plans and their dependency graph may span themes; dependency edges, rather than filenames or display order, determine executable order; mechanical audits cannot decide whether work is obsolete or beneficial; and planning discoveries must remain proposals until the user confirms them.

## Steps

1. ✓ Define the acyclic relationship map. `ki-project-roadmap` is the governance dependency that owns horizon meaning, readiness, transition rules, roadmap profiles, and plan format; `ki-plan` is a process dependency that owns one governed plan's lifecycle; `ki-recap` is an optional upstream process that may supply current-session context; and `ki-next` owns portfolio selection and promotion orchestration. None of the three process skills becomes a `.ki-config.toml` governance root, and the governance skill must not depend back on them.
2. ✓ Extend `ki-project-roadmap`'s standard and judgment rubric with explicit transition eligibility: Future to Soon requires enough scoping to state an intended outcome and boundary; Soon to Next requires actionable scope, understood dependencies, and readiness to start; Waiting work re-enters only after its named condition changes; and only Blocking or Next work may receive a plan. Keep CONFORM non-judgmental and incapable of moving items.
3. ✓ Make preflight straightforward: resolve the repository and profile, run the read-only roadmap audit, read canonical theme roadmaps plus the generated active-plan index and dependency graph, and stop on drift rather than repairing unrelated state.
4. ✓ Define the optional relevance pass as a short judgment review over stale or obsolete items, satisfied waiting conditions, duplicates, already-planned work, and changed dependencies. Present evidence and proposed changes, but do not remove, move, or rewrite an item until the user confirms the change.
5. ✓ Implement the staged candidate loop. First evaluate eligible, dependency-ready work already in Blocking and Next. If none exists, evaluate Soon items against the governance-owned Next readiness rule, present the best options, and after confirmation promote the selected work to Next; then restart evaluation in Next rather than planning directly from Soon.
6. ✓ When Soon is empty or contains no eligible candidate, inspect Future candidates, conduct the minimum scoping needed for the selected work to satisfy the Soon entry rule, present that proposed rewrite and promotion, and after confirmation move it to Soon. Restart evaluation in Soon, and promote it onward to Next only when the separate Next readiness evaluation succeeds. If no Future candidate can reach Soon, report that the roadmap has no eligible work instead of manufacturing an item.
7. ✓ Rank viable options at each stage with brief evidence covering expected benefit, leverage, risk reduction, delivery cost, reversibility, readiness, and dependency availability. Do not invent a single numeric score, preserve an ordering the user supplies, and re-evaluate after every promotion because the destination horizon has a different contract.
8. ✓ Define the current-session input contract: a recent `ki-recap` can supply grounded outstanding work, routed learnings, and Specific actions as conversational context, but `ki-next` must freshly re-ground dynamic roadmap claims, work without a recap when necessary, and never scan historical transcripts as a substitute.
9. ✓ Present the proposed selection, order, item wording changes, horizon transitions, existing-plan reuse, and new-plan locations before writing. Require explicit confirmation, perform the approved roadmap transitions as real authored changes, regenerate and audit derived views, then use `ki-plan` only for confirmed Blocking or Next work. Represent apply order through dependency edges rather than filenames alone and stop for review of every created or revised plan before implementation.
10. ✓ Add concise help, a relationship diagram or equivalent mapping, worked scenarios, source-map and skills-guide entries, generated composition graph material, and focused tests covering simple and thematic profiles, cross-theme dependencies, non-empty immediate queues, Soon-to-Next promotion, Future-to-Soon-to-Next promotion, ineligible Future work, changed Waiting conditions, existing plans, user-supplied order, rejected proposals, and the KB off-ramp.
11. Run the roadmap, plan, and skills checks; regenerate derived roadmap and skill documentation; re-vendor any coverage-scoped checker changes; then run `bun run test` and `bun run ki:audit` sequentially.

## Files touched

- `skills/process/ki-next/`
- `skills/general-governance/ki-project-roadmap/` transition standard, judgment rubric, and tests
- `skills/README.md`
- `docs/guides/user-guide/skills.md`
- `.ki-config.toml` and generated `.ki-meta/` payloads if the new or changed coverage requires them
- Focused skill graph, help, and process-skill tests

## Verify

- `ki-next` performs no roadmap or plan write before the user explicitly confirms both selection and order.
- With eligible global Blocking or Next work, `ki-next` evaluates that work without reaching into later horizons.
- With no eligible Blocking or Next work, a confirmed Soon item is actually promoted to Next and re-evaluated there; it is never planned while still in Soon.
- With no eligible Soon work, a confirmed Future candidate is minimally scoped, promoted to Soon, and re-evaluated there before any separate Next promotion; an ineligible candidate remains in Future.
- A current `ki-recap` can supply live-session context to `ki-next`; the latter rechecks the live roadmap and does not mine historical transcripts.
- Confirmed work is promoted and planned only through the existing roadmap and `ki-plan` contracts, after which `ki-next` stops for plan review.
- Existing plans are reused, cross-theme dependencies are visible, and the confirmed apply order is represented by valid dependency edges rather than inferred from index ordering.
- Relevance findings and newly discovered work remain proposals until the user approves the corresponding roadmap change.
- The documented dependency direction is acyclic: optional `ki-recap` handoff → `ki-next` orchestration → `ki-plan` lifecycle, with both planning processes governed by `ki-project-roadmap` and no reverse dependency from governance.
- `bun run ki:skills:audit`, `bun run test`, and `bun run ki:audit` pass sequentially.

## Dependencies / blocks

This is the root of the agreed near-term execution sequence and the place where the shared horizon-transition governance required by the process is established.

It blocks `foundation-tooling/001`; the existing foundation sequence then continues through `foundation-tooling/004` before the focused `ki-recap` handoff update in `governance-consistency/005`.
