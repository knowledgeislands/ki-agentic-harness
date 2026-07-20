---
id: 'FND-010'
title: Improve CONFORM progress feedback
status: open
roadmap: foundation-tooling/improve-conform-progress-feedback
blocks: —
blocked-by: —
---

## Context

CONFORM's direct and aggregate progress currently uses a fixed-width bar, which provides little useful feedback in wider terminals and can consume disproportionate space in narrow ones.

The progress display is presentation only: it must never alter the actual mechanical-rubric-item totals or the canonical JSONL contract.

## Current state

The aggregate renderer in `.ki-meta/bin/aggregate.ts` and the shared checker reporter both use a fixed 12-column progress bar.

Progress mode already distinguishes `auto`, `always`, and `never`, with `auto` using TTY detection. The renderer records completed and total mechanical items independently of presentation.

## Steps

1. Define one terminal-progress sizing contract: choose the active output TTY width when available, use a deterministic fallback when it is unavailable or invalid, cap the bar at 100 columns, and preserve a readable minimum for narrow terminals.
2. Apply the sizing contract to both the shared checker reporter and aggregate renderer, keeping their existing progress modes, carriage-return behaviour, and non-interactive output semantics unchanged.
3. Add a completed percentage beside the existing `completed/total` count, with deterministic rounding and zero-total handling.
4. Add focused tests for narrow, ordinary, wide, capped, unavailable-TTY, zero-total, `auto`, `always`, and `never` cases; prove that display width does not change progress accounting or structured output.
5. Refresh every affected generated checker payload and HELP/documentation surface, then run the serial repository gates.

## Files touched

- `.ki-meta/bin/aggregate.ts` and its generated source/manifest inputs
- `skills/keystone/ki-skills/scripts/shared/reporter.ts`
- aggregate and shared-reporter focused tests
- generated vendored copies and any HELP or user guidance affected by the displayed contract

## Verify

- A TTY width determines the bar width within the documented minimum and 100-column maximum.
- Missing, invalid, and non-TTY width information selects the deterministic fallback without changing execution behaviour.
- Every progress line includes accurate `completed/total` and percentage values.
- `--progress=auto`, `always`, and `never` retain their current visibility semantics.
- JSONL, rubric-item totals, and aggregate outcomes are byte-for-byte independent of terminal width.
- Focused reporter and aggregate tests.
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan is independent of the completion-record lifecycle work. It improves terminal observability only; it does not change CONFORM repair semantics, rubrics, or aggregate accounting.
