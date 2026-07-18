---
id: '005'
title: Update ki-recap for the direct ki-next handoff
status: open
roadmap: governance-consistency/update-ki-recap-for-the-direct-ki-next-handoff
blocks: —
blocked-by: foundation-tooling/004
---

## Context

The completed `ki-next` process will consume current-session context and make the user-confirmed next-work decision repeatable.

`ki-recap` already grounds a live session, routes learnings, and ends with Specific actions, but it does not yet name the direct handoff that makes those outputs immediately usable by `ki-next`.

## Current state

The two process skills are independently usable, but their relationship is implicit.

As a result, an agent can treat a roadmap update as a separate reconstruction task instead of carrying the grounded learning from the current conversation directly into the next planning choice.

## Steps

1. Define the minimal `ki-recap` to `ki-next` handoff: grounded outstanding work, learning routes the user has approved or is considering, and roadmap-ready Specific actions from the current session.
2. Update the `ki-recap` procedure and help so the handoff is clearly current-session context, not a persistent transcript, memory write, or automatic durable promotion.
3. State the receiving boundary in `ki-next`: re-read the live roadmap, distinguish a recap suggestion from current fact, and require explicit confirmation before any learning-route write, horizon promotion, or plan creation.
4. Add focused examples or tests covering a clean recap, a deferred item already parked on the roadmap, an unapproved learning route, and a confirmed multi-step item that proceeds to plan review.
5. Refresh the skills map and any generated composition documentation, re-vendor coverage-scoped changes, then run `bun run test` and `bun run ki:audit` sequentially.

## Files touched

- `skills/process/ki-recap/`
- `skills/process/ki-next/`
- `skills/README.md`
- `docs/guides/user-guide/skills.md`
- Focused process-skill tests and generated graph material
- Generated `.ki-meta/` payloads if coverage changes require them

## Verify

- A recap communicates only grounded, current-session context to `ki-next` and does not cause a write by itself.
- `ki-next` rechecks the roadmap rather than trusting recap wording as current fact.
- Unapproved learning routes remain proposals; confirmed planning work stops after the generated plans are presented for review.
- `bun run test` and `bun run ki:audit` pass sequentially.

## Dependencies / blocks

This is last in the agreed execution chain.

It follows `foundation-tooling/004`, which itself follows the root `governance-consistency/000` plan through the foundation-tooling sequence.
