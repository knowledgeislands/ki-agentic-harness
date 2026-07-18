---
id: '005'
title: Update ki-recap for the direct ki-next handoff
status: open
roadmap: governance-consistency/update-ki-recap-for-the-direct-ki-next-handoff
blocks: —
blocked-by: —
---

## Context

The completed `ki-next` process will consume current-session context and make the user-confirmed next-work decision repeatable.

`ki-recap` already grounds a live session, routes learnings, and ends with Specific actions, but it does not yet name the direct handoff that makes those outputs immediately usable by `ki-next`.

## Current state

The two process skills are independently usable, but their relationship is implicit.

As a result, an agent can treat a roadmap update as a separate reconstruction task instead of carrying the grounded learning from the current conversation directly into the next planning choice.

The completed checker/educator work established a useful boundary for this handoff: a recap may report generated-footprint rollout evidence and unrelated consumer drift separately, but it must not treat one as proof of the other or create a durable write without the user's confirmation.

## Steps

1. Preserve the one-way process relationship established by plan 000: `ki-recap` is an optional upstream source of context, not a hard dependency of `ki-next`, and neither `ki-recap` nor `ki-next` becomes a dependency of the `ki-project-roadmap` governance skill or the `ki-plan` lifecycle process.
2. Define the minimal `ki-recap` to `ki-next` handoff: grounded outstanding work, learning routes the user has approved or is considering, and roadmap-ready Specific actions from the current session.
3. Update the `ki-recap` procedure and help so it can offer `ki-next` as an explicit follow-on while keeping the handoff as current-session context rather than a persistent transcript, memory write, direct invocation requirement, or automatic durable promotion.
4. State the receiving boundary in `ki-next`: re-read the live roadmap, distinguish a recap suggestion from current fact, and require explicit confirmation before any learning-route write, horizon promotion, or plan creation.
5. Add focused examples or tests covering a clean recap, a roadmap-free session, a deferred item already parked on the roadmap, an unapproved learning route, a generated-footprint rollout with unrelated consumer audit drift, and a confirmed multi-step item that proceeds through `ki-next` to plan review.
6. Refresh the skills map and any generated composition documentation, re-vendor coverage-scoped changes, then run `bun run test` and `bun run ki:audit` sequentially.

## Files touched

- `skills/process/ki-recap/`
- `skills/process/ki-next/`
- `skills/README.md`
- `docs/guides/user-guide/skills.md`
- Focused process-skill tests and generated graph material
- Generated `.ki-meta/` payloads if coverage changes require them

## Verify

- A recap communicates only grounded, current-session context to `ki-next` and does not cause a write by itself.
- `ki-recap` remains usable without a roadmap or `ki-next`, and `ki-next` remains usable without a preceding recap.
- `ki-next` rechecks the roadmap rather than trusting recap wording as current fact.
- No reverse dependency or invocation cycle is introduced among `ki-recap`, `ki-next`, `ki-plan`, and `ki-project-roadmap`.
- Unapproved learning routes remain proposals; confirmed planning work stops after the generated plans are presented for review.
- `bun run test` and `bun run ki:audit` pass sequentially.

## Dependencies / blocks

This is last in the agreed execution chain and may begin once the preceding foundation-tooling work is complete.
