---
id: 'FND-009'
title: Add a manual plan acceptance gate
status: acceptance
roadmap: foundation-tooling/add-a-manual-plan-acceptance-gate
blocks: —
blocked-by: —
---

## Context

Implementation and verification do not by themselves show that the requested outcome is acceptable to the person who asked for it.

Every governed plan needs a short, deliberate review point before its roadmap item and implementation record disappear into Git history.

## Current state

`ki-plan` transitions from `in-progress` directly to transient `done`, then removes the plan and canonical roadmap item.

`ki-recap` can summarise a session, but there is no focused, manual acceptance gate or per-plan learning review.

## Steps

1. ✓ Define the `acceptance` plan status, `ki-plan accept` lifecycle command, and a compact `## Acceptance` record that preserves the six core plan sections.
2. ✓ Make `done` require an accepted plan and make `execute` transition completed work to acceptance instead of closing it directly.
3. ✓ Align the roadmap status validator, generated index, plan format, and focused tests with the new state.
4. ✓ Specify the acceptance packet: delivered outputs, verification evidence, outstanding concerns, and a mini recap with proposed learning routes that require explicit user approval before durable promotion.
5. ✓ Use FND-008 as the first acceptance candidate, then verify the lifecycle and aggregate repository gates.

## Files touched

- `skills/process/ki-plan/`
- `skills/process/ki-recap/`
- `skills/general-governance/ki-repo-roadmap/`
- focused roadmap and skill tests
- generated payloads where source parity requires them

## Verify

- An active plan can enter `acceptance` only after its planned work and verification evidence are complete.
- `done` stops unless the user has explicitly accepted the reviewed plan.
- Acceptance produces a concise plan-scoped recap without silently writing a learning to another durable home.
- Existing roadmap indexes and status validation accept the new active state.
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

FND-008 provides the first real acceptance candidate but does not block the lifecycle definition.

## Acceptance

### Delivered

Plans now pause in a manual `acceptance` state with a review packet before they can be removed from the roadmap.

### Summary of changes

- Added the `accept` lifecycle, `acceptance` status, an explicit current-conversation `done` gate, and active-plan index support.
- Added packet validation, focused roadmap coverage, and the boundary that a plan-local recap proposes learning routes without silently publishing them.
- Presented FND-008, then FND-003 through FND-005, as real review candidates to exercise the lifecycle rather than treating the contract as theoretical.

### Verification

- `bun skills/general-governance/ki-repo-roadmap/scripts/repo-roadmap.test.ts`, `bun run test`, and `bun run ki:audit` passed on 2026-07-20.
- Code-evidence baseline: `339a17b5`; the acceptance lifecycle implementation has not changed since that review state.

### Outstanding concerns

The packet was initially terse, which made it harder to find the actual changes or conduct deeper acceptance analysis. This follow-up strengthens the packet shape with expandable headings and revisioned evidence. The manual decision boundary itself remains unchanged: acceptance of a plan does not by itself approve a proposed learning route.

### Mini recap

A plan-local acceptance record makes review evidence visible without prematurely turning a learning into a standard. The approved learning from this review is to record revisioned verification and avoid redundant full gates after prose-only packet refinements.
