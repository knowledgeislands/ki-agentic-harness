---
id: 'FND-002'
title: Show progress during checker execution
status: open
roadmap: foundation-tooling/show-progress-during-checker-execution
blocks: —
blocked-by: —
---

## Context

Individual and aggregate checker runs can remain silent while all work completes, then emit a large JSONL-derived report at once. That makes a healthy long-running process indistinguishable from a stalled one and becomes especially confusing while aggregate output is captured for final rendering.

## Current state

The checker contract separates result collection from final reporting, but it does not yet expose execution progress. The target keeps canonical JSONL complete and uncontaminated on stdout; concise progress uses a separate channel and never changes which rubric items execute or which final findings the reporter selects. Interactive runs show progress by default, automation can disable it explicitly, aggregate progress names the active skill, and individual progress reflects meaningful rubric execution rather than arbitrary timers.

## Steps

1. Define one small progress event shape and `auto`, `always`, and `never` behaviour in the canonical checker contract, with stdout reserved for result JSONL and progress directed to stderr or an explicitly supplied callback.
2. Add progress callbacks at stable checker boundaries—run start, rubric family or subject completion, and run completion—without coupling rubric items to terminal rendering.
3. Make individual AUDIT and CONFORM entry points render concise progress in interactive use and remain machine-clean when progress is disabled or stderr is not interactive.
4. Make the aggregate runner surface the active skill plus completed and remaining skills while preserving each child's full result stream for final validation and reporting.
5. Add focused tests for progress visibility, quiet automation, uncontaminated JSONL, failure handling, and aggregate sequencing; then re-vendor and run the serial repository gates.

## Files touched

- `skills/keystone/ki-skills/scripts/shared/{checker,reporter}.ts`
- governance skill AUDIT and CONFORM entry points where progress callbacks are wired
- `skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts`
- generated `.ki-meta/` aggregate and checker payloads
- focused checker, reporter, bootstrap, and aggregate tests

## Verify

- An intentionally slow individual checker visibly advances on an interactive terminal.
- An aggregate run identifies the active skill and completed/remaining count before final findings appear.
- Redirected stdout remains valid canonical JSONL with progress enabled or disabled.
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

The aggregate runner must first capture complete checker output without truncation. This plan blocks treating long-running checker operation as a usable stable baseline.
