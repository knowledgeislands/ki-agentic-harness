---
id: 'FND-015'
title: Add safe multiprogress aggregate execution
status: open
roadmap: foundation-tooling/add-safe-multiprogress-aggregate-execution
blocks: —
blocked-by: —
---

## Context

FND-010 completed stable, resize-aware terminal layout and truthful aggregate startup feedback.

Its aggregate bar still advances only when a child checker exits, so a checker with most of the planned items can make the global bar appear to jump from a small percentage directly to completion.

The aggregate needs a structured child-progress protocol that supports a continuously advancing default single bar and an optional multi-row view without parsing terminal prose or weakening the canonical JSONL result contract.

## Current state

The generated aggregate runner preflights each checker with `KI_CHECKER_PLAN=1`, then runs each selected checker through synchronous process capture into private temporary files.

It knows each child's planned item count but only calls `advance` with that full count after the child process has returned.

The aggregate is the sole renderer for its terminal progress, while checkers retain canonical JSONL on standard output and direct-mode terminal reporting through the shared reporter.

## Steps

1. Define a versioned, machine-readable child-progress protocol carried over a dedicated non-terminal channel. Specify event identity, checker name, completed and total counts, phase, completion, failure, cancellation, malformed-event handling, and whether an absent event stream is a supported legacy condition or a clear aggregate diagnostic. Preserve JSONL stdout byte-for-byte and never infer progress by parsing stderr text.
2. Define the aggregate interface and display contract. Keep `--progress=auto|always|never` as the visibility control; add an explicit opt-in style selector for single versus multi-row rendering. The default single bar converts the active child's validated events into global completed work without waiting for checker exit. The multi-row view gives every selected checker a stable labelled row such as `AUDIT [ki-skills]`, with pending, active, completed, failed, and cancelled states; terminal width, resize, non-TTY, narrow, and final newline behaviour remain compatible with FND-010.
3. Refactor the aggregate child transport so it can receive and validate progress while retaining safe, complete capture of large child JSONL output, deterministic selected-checker order, final report order, exit behaviour, and cleanup of private temporary state. Keep execution sequential for both modes initially; do not make rendering parallelism imply concurrent checker execution.
4. Update the shared checker/reporter path to emit the protocol only when aggregate collection explicitly requests it. Keep direct checker terminal output and standalone checker invocation unchanged, make progress accounting monotonic and bounded by the preflight plan, and route all aggregate presentation decisions back to the parent renderer.
5. Implement the single and multi-row renderers from the same validated event model. Preserve aggregate startup and discovery feedback, reflect child failure or cancellation honestly, avoid fabricated per-item completion after a malformed or interrupted child, and leave canonical stdout, final findings, and reporter-level filtering independent of display style and width.
6. Evaluate bounded concurrency only for read-only AUDIT after the streaming protocol and sequential semantics are verified. Document a concrete independence, process-limit, cancellation, ordered-reporting, and resource contract before enabling it; keep CONFORM sequential unless a separate write-ownership proof authorises a specific concurrent set.
7. Add focused protocol, renderer, transport, and integration fixtures: a large active checker, zero-item and no-finding checkers, selected subset, malformed stream, child failure, cancellation, narrow/wide/resize/non-TTY output, `auto`/`always`/`never`, single and multi styles, ordered final reports, and any approved audit concurrency limit. Re-vendor affected payloads, update HELP and user guidance, then run the serial repository gates.

## Files touched

- `skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts` — generated aggregate runner, child transport, and protocol validation.
- `skills/keystone/ki-skills/scripts/shared/` — aggregate-requested progress emission and focused reporter coverage.
- `skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/*test.ts` and shared-reporter tests — protocol, display, ordering, and failure fixtures.
- `.ki-meta/` generated runner, checker, and educator payloads — refreshed from changed coverage-scoped sources.
- Aggregate HELP and user guidance affected by the new opt-in display style.

## Verify

1. A large checker advances the aggregate default single bar continuously from child progress events; its final report, JSONL, exit status, and item total match the sequential baseline.
2. Multi-row output gives each selected checker a stable, correctly labelled state row and retains deterministic final report order.
3. Direct checker terminal output, `--progress=auto|always|never`, reporter-level filtering, non-TTY output, and FND-010 resize/narrow-width guarantees remain unchanged except for the new explicit aggregate style option.
4. Malformed, missing, failed, and cancelled child streams are diagnosed without parsing terminal text, fabricating item progress, leaking temporary state, or corrupting subsequent final output.
5. AUDIT concurrency, if enabled, satisfies its documented limit, cancellation, safety, and report-order contract; CONFORM remains sequential otherwise.
6. `bun skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts .` succeeds after coverage-scoped source changes.
7. `bun run test` passes.
8. `bun run ki:audit` passes after the test suite completes.

## Dependencies / blocks

FND-010 remains complete: it owns the stable single-row layout that this plan reuses rather than revises.

No concurrency is assumed or required for the initial continuous single-bar and multiprogress implementation.
