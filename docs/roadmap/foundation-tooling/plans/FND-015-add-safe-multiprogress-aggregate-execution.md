---
id: 'FND-015'
title: Add safe in-process multiprogress aggregate execution
status: open
roadmap: foundation-tooling/add-safe-multiprogress-aggregate-execution
blocks: —
blocked-by: —
---

## Context

FND-010 completed stable, resize-aware terminal layout and truthful aggregate startup feedback.

Its aggregate bar still advances only when a child checker exits, so a checker with most of the planned items can make the global bar appear to jump from a small percentage directly to completion.

The harness owns every selected checker and its vendored source locally. Aggregate execution should call those local checker entry points directly, receive their existing structured status events in process, and render them without inventing a child-process protocol.

## Current state

The generated aggregate runner is an inline template in `repo-bootstrap.ts`. It preflights each checker with `KI_CHECKER_PLAN=1`, then starts Bun twice per selected checker, captures JSONL through private temporary files, and parses that output back into records.

The shared `runChecker` already has synchronous per-item status events and a known planned-item count. All vendorable audit and conform wrappers use it, but execute immediately on import instead of exporting an aggregate-safe entry point.

The aggregate remains the sole renderer for its terminal progress, while direct checker CLI use retains canonical JSONL on standard output and direct-mode terminal reporting through the shared reporter.

The review also found other avoidable local process boundaries: bootstrap's local publisher/synchroniser/help/scaffold paths, tokenomics' local engines, and the user installer’s local hook installer. They have separate write, legacy-result, and user-install safety contracts, so they are explicitly out of scope for this plan. External commands (for example Git, Biome, formatters, package tools, Homebrew, and runtime CLIs) remain legitimate process boundaries.

## Steps

1. Define and add one aggregate-callable entrypoint contract for every vendorable audit and conform wrapper. Each exposes a pure plan result and a run result with an injected status tracker; the existing CLI wrapper stays a guarded thin layer that renders JSONL and sets its own exit status. Use the shared checker's existing structured status events and replace the internal-only `KI_CHECKER_PLAN` environment branch with a callable plan API.
2. Extract the generated aggregate runner from the `repo-bootstrap.ts` template into a canonical standalone source file that bootstrap copies and manifest-hashes into `.ki-meta/bin/aggregate.ts`. Keep the vendored file self-sufficient: it may dynamically import only its selected local vendored checker entries and Node/Bun standard facilities.
3. Replace per-checker Bun launches, stdout/stderr capture files, JSONL reparsing, and child-progress transport with sequential in-process calls. Validate the returned checker result and preserve selected-checker order, complete aggregate report order, exit semantics, failure isolation, and canonical direct-checker JSONL. No aggregate child process is permitted for a local vendored checker.
4. Define the aggregate interface and display contract. Retain `--progress=auto|always|never`; add an explicit opt-in single versus multi-row style selector. Map the active checker's direct status events into global progress continuously. Multi-row display gives each selected checker a stable `AUDIT [ki-skills]`-style row with pending, active, completed, and failed states; terminal width, resize, non-TTY, narrow, and final-newline behaviour remain compatible with FND-010.
5. Keep aggregate execution sequential for AUDIT and CONFORM. Bounded concurrency is out of scope: it needs a separate independence, resource, cancellation, and ordered-reporting decision after the direct-call design is proven.
6. Add focused contract, renderer, and integration fixtures: a large active checker, zero-item and no-finding checkers, selected subsets, returned-error and thrown-error handling, narrow/wide/resize/non-TTY output, `auto`/`always`/`never`, single and multi styles, local standalone invocation, deterministic final reports, and the assertion that aggregate execution makes no Bun child launch. Re-vendor affected payloads, update HELP and user guidance, then run serial repository gates.

## Files touched

- `skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/aggregate.ts` and `repo-bootstrap.ts` — canonical aggregate source, generated copy, manifest integration, and direct result validation.
- Vendored skills’ `scripts/audit.ts` and `scripts/conform.ts` — guarded CLI wrappers plus the uniform callable aggregate entrypoint.
- `skills/keystone/ki-skills/scripts/shared/checker.ts` — callable planning/status surface and focused coverage.
- `skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/*test.ts` and shared-checker tests — callable contract, display, ordering, and error fixtures.
- `.ki-meta/` generated runner, checker, and educator payloads — refreshed from changed coverage-scoped sources.
- Aggregate HELP and user guidance affected by the new opt-in display style.

## Verify

1. A large checker advances the aggregate default single bar continuously from its direct status events; its final report, JSONL, exit status, and item total match the direct standalone baseline.
2. Multi-row output gives each selected checker a stable, correctly labelled state row and retains deterministic final report order.
3. Direct checker terminal output, `--progress=auto|always|never`, reporter-level filtering, non-TTY output, and FND-010 resize/narrow-width guarantees remain unchanged except for the new explicit aggregate style option.
4. Returned errors and thrown checker failures are diagnosed without parsing terminal text, fabricating item progress, leaking temporary state, or corrupting subsequent final output.
5. Aggregate execution remains sequential and does not launch Bun for selected local vendored checkers.
6. `bun skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts .` succeeds after coverage-scoped source changes.
7. `bun run test` passes.
8. `bun run ki:audit` passes after the test suite completes.

## Dependencies / blocks

FND-010 remains complete: it owns the stable single-row layout that this plan reuses rather than revises.

The bootstrap-internal, tokenomics-engine, and user-installer local-process candidates found by this review need separately scoped follow-ups; this plan changes no external-tool or test/evaluation process boundary.

## Delegation

- Round 1 — research: ✓ mapped aggregate runner entry points, imports, result contracts, and progress ownership; files: read-only aggregate and shared checker/reporter scope; gate: minimal in-process orchestration design.
- Round 1 — research: ✓ inventoried production child-process calls and classified external-tool, CLI/test, and avoidable local-module boundaries; files: read-only source scope; gate: evidence-backed refactor candidates.
- Round 2 — judgment: revise this plan around the settled direct-call architecture and separately scoped follow-ups; files: this plan and any affected roadmap items; gate: user review before implementation.
- Orchestrator: reconcile worker findings, review every proposal against process isolation and standalone-vendored constraints, and commit only the revised planning record.
