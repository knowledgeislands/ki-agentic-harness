---
id: 'FND-010'
title: Improve CONFORM progress feedback
status: in-progress
roadmap: foundation-tooling/improve-conform-progress-feedback
blocks: —
blocked-by: —
---

## Context

CONFORM's direct and aggregate progress need useful feedback in wide terminals without consuming disproportionate space in narrow ones.

The progress display is presentation only: it must never alter the actual mechanical-rubric-item totals or the canonical JSONL contract. Every rendered line, including startup, has three areas: a stable task label on the left, a centre progress/activity bar, and a readable right-side state. Once a total is known, the right side shows the completed/total counter, percentage, and status; before then it shows the truthful phase status without invented numeric progress. The existing remaining-item count is redundant and should not be retained. The display must also explain the aggregate's startup work before a total is known.

## Current state

The aggregate renderer in `.ki-meta/bin/aggregate.ts` and the shared checker reporter write their progress display to `stderr`.

Progress mode already distinguishes `auto`, `always`, and `never`, with `auto` using `stderr.isTTY`. Before creating its progress tracker, the aggregate invokes every selected checker with `KI_CHECKER_PLAN=1` to discover its mechanical-item count; that preflight can be silent for a noticeable time. The renderer records completed and total mechanical items independently of presentation; a live TTY exposes its current width through `stderr.columns`, which can be read again after a resize.

The first implementation sizes its bar from the changing right-side detail width. Consequently, a changing counter, percentage, phase, or skill name can make the bar jump despite an unchanged terminal. User acceptance feedback requires stable column allocation for one terminal width.

## Steps

1. ✓ Define a startup-progress contract for the aggregate: emit an immediate `initialising` render after argument validation, then a truthful checker-plan discovery state (for example, `reading checker plans 3/12`) while `KI_CHECKER_PLAN=1` preflight derives the eventual total. Keep the three-area layout and its centre bar visible during this phase, but treat that bar as indeterminate activity rather than completed work: do not invent a total, percentage, or completion value. CONFORM preflight must also carry `--dry-run`, so status discovery remains mechanically read-only. Respect `auto`, `always`, and `never` visibility semantics.
2. ✓ Define one stable terminal-progress layout contract for every phase: on every render read the current `stderr.columns` only when `stderr.isTTY`; otherwise use a deterministic fallback. Reserve a fixed padded command column for the running job, subtract separators, then divide the remaining terminal width between a centre bar and right-side detail column. For an unchanged terminal width, both column widths must remain unchanged across startup, active, advance, failure, and completion states. The bar caps at 100 columns; a resize may recalculate all three areas.
3. ✓ Add display-width and truncation handling so ANSI styling, labels, status, and the startup activity bar never cause a progress line to exceed the current terminal width. Truncate an overlong left label or right-side detail with ASCII `...`, rather than changing allocated widths or allowing word wrap. Define a deterministic compact form for very narrow widths.
4. ✓ Apply the startup and stable-layout contracts to both aggregate renderer and shared checker reporter, preserving carriage-return behaviour and non-interactive output semantics.
5. ✓ Add a completed percentage beside the existing `completed/total` count, with deterministic rounding and zero-total handling.
6. ✓ Add focused tests for startup-before-total, checker-plan discovery updates, stable same-width redraws with changing detail, narrow, ordinary, wide, resize-between-redraws, capped, unavailable-TTY, zero-total, `auto`, `always`, and `never` cases; prove that display width and startup reporting do not change progress accounting or structured output.
7. Refresh every affected generated checker payload and HELP/documentation surface, then run serial repository gates.

## Files touched

- `.ki-meta/bin/aggregate.ts` and its generated source/manifest inputs
- `skills/keystone/ki-skills/scripts/shared/reporter.ts`
- aggregate and shared-reporter focused tests
- generated vendored copies and any HELP or user guidance affected by the displayed contract

## Verify

- Every redraw uses the then-current `stderr.columns`, so a resize is reflected without a separate signal handler.
- Aggregate CONFORM reports immediate startup and its checker-plan discovery progress before a final total exists, retaining the three-area layout and an indeterminate centre activity bar without inventing a zero-total percentage or completed-work bar.
- The padded left command column and the right-side detail column keep fixed widths for every redraw at one terminal width; the bar has a fixed width until resize.
- No progress form renders a redundant remaining-item count.
- No rendered progress line exceeds the current width or word-wraps; overlong detail ends in ASCII `...`, and narrow terminals use the compact no-bar form.
- Missing, invalid, and non-TTY width information selects the deterministic fallback without changing execution behaviour.
- Every progress line includes accurate `completed/total` and percentage values.
- `--progress=auto`, `always`, and `never` retain their current visibility semantics.
- JSONL, rubric-item totals, and aggregate outcomes are byte-for-byte independent of terminal width.
- Focused reporter and aggregate tests.
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan is independent of the completion-record lifecycle work. It improves terminal observability only; it does not change CONFORM repair semantics, rubrics, or aggregate accounting.

## Acceptance

### Delivered

Aggregate and direct checker progress now use a terminal-width-aware three-zone layout, with truthful startup feedback before the aggregate knows its work total.

### Summary of changes

- Added immediate `initialising` and `reading checker plans <completed>/<count>` states to the generated aggregate runner before normal checker execution.
- Replaced the fixed 12-column bars with redraw-time layout allocation in the aggregate and `ki-skills` shared reporter; bars cap at 100 columns and disappear before key state text is shortened.
- Added `completed/total`, rounded percentage, deterministic zero-total completion, ANSI-aware display measurement, and ellipsis-based compact rendering; removed the remaining-item count.
- Added direct-reporter resize/narrow/zero-total coverage and aggregate startup/discovery assertions, then regenerated the portable bootstrap, checker, and educator payloads.

### Verification

- `bun test skills/keystone/ki-skills/scripts/shared/reporter.test.ts` passed (13 tests).
- `bun skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/resolve.test.ts` passed, including startup/discovery and `--progress=never` aggregate checks.
- A 30-column pseudo-terminal run showed each redraw stay compact without wrapping, omitting the bar before truncating phase text.
- `bun run test` passed.
- `bun run ki:audit` passed with zero FAIL and WARN findings.
- Implementation commit: `aca903a6` (`feat(bootstrap): improve conform progress feedback`).

### Outstanding concerns

Acceptance feedback identified unstable bar sizing when right-side detail changed. This reopened implementation supersedes the layout claims above; keep the packet as evidence of the initial delivery and replace it after the remedial work is verified.

### Mini recap

Terminal width is read at each render rather than managed through a resize handler, which naturally handles resizes between redraws while leaving progress accounting and JSONL untouched. The portable aggregate remains self-contained, so it mirrors the small layout helper rather than importing from a source skill.
