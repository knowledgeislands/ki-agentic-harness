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

The progress display is presentation only: it must never alter the actual mechanical-rubric-item totals or the canonical JSONL contract. A rendered line needs a stable left label, a centre bar when space permits, and a readable right-side counter, percentage, and status without terminal wrapping. The existing remaining-item count is redundant and should not be retained. The display must also explain the aggregate's startup work before a total is known.

## Current state

The aggregate renderer in `.ki-meta/bin/aggregate.ts` and the shared checker reporter both use a fixed 12-column progress bar and write their progress display to `stderr`.

Progress mode already distinguishes `auto`, `always`, and `never`, with `auto` using `stderr.isTTY`. Before creating its progress tracker, the aggregate invokes every selected checker with `KI_CHECKER_PLAN=1` to discover its mechanical-item count; that preflight can be silent for a noticeable time. The renderer records completed and total mechanical items independently of presentation; a live TTY exposes its current width through `stderr.columns`, which can be read again after a resize.

## Steps

1. Define a startup-progress contract for the aggregate: emit an immediate `initialising` status after argument validation, then a truthful checker-plan discovery status (for example, `reading checker plans 3/12`) while `KI_CHECKER_PLAN=1` preflight derives the eventual total. Do not render a fake total, percentage, or completed bar before the total is known; respect `auto`, `always`, and `never` visibility semantics.
2. Define one terminal-progress layout contract once the total is known: on every render read the current `stderr.columns` only when `stderr.isTTY`; otherwise use a deterministic fallback. Reserve the right-side `completed/total`, percentage, and status—but no remaining-item count—before allocating space to the left label and centre bar; cap the bar at 100 columns and define a readable compact form for very narrow widths.
3. Add display-width and truncation handling so ANSI styling, labels, and status never cause a progress line to exceed the current terminal width. When a bar cannot fit, omit it before shortening the right-side counter or percentage; use a deterministic ellipsis for an overlong left label or status rather than allowing word wrap.
4. Apply the startup and layout contracts to both the aggregate renderer and shared checker reporter where applicable, recalculating the layout for start, active, advance, and complete renders so terminal resize takes effect on the next redraw. Preserve existing carriage-return behaviour and non-interactive output semantics.
5. Add a completed percentage beside the existing `completed/total` count, with deterministic rounding and zero-total handling.
6. Add focused tests for startup-before-total, checker-plan discovery updates, narrow, ordinary, wide, resize-between-redraws, capped, unavailable-TTY, zero-total, `auto`, `always`, and `never` cases; prove that display width and startup reporting do not change progress accounting or structured output.
7. Refresh every affected generated checker payload and HELP/documentation surface, then run the serial repository gates.

## Files touched

- `.ki-meta/bin/aggregate.ts` and its generated source/manifest inputs
- `skills/keystone/ki-skills/scripts/shared/reporter.ts`
- aggregate and shared-reporter focused tests
- generated vendored copies and any HELP or user guidance affected by the displayed contract

## Verify

- Every redraw uses the then-current `stderr.columns`, so a resize is reflected without a separate signal handler.
- Aggregate CONFORM reports immediate startup and its checker-plan discovery progress before a final total exists, without inventing a zero-total percentage or misleading completion bar.
- The right-side counter, percentage, and status remain visible; the left label and centre bar consume only remaining display columns.
- No progress form renders a redundant remaining-item count.
- No rendered progress line exceeds the current width or word-wraps; narrow terminals use the compact no-bar form.
- Missing, invalid, and non-TTY width information selects the deterministic fallback without changing execution behaviour.
- Every progress line includes accurate `completed/total` and percentage values.
- `--progress=auto`, `always`, and `never` retain their current visibility semantics.
- JSONL, rubric-item totals, and aggregate outcomes are byte-for-byte independent of terminal width.
- Focused reporter and aggregate tests.
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan is independent of the completion-record lifecycle work. It improves terminal observability only; it does not change CONFORM repair semantics, rubrics, or aggregate accounting.
