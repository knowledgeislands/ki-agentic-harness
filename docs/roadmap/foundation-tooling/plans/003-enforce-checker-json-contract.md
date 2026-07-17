---
id: '003'
title: Establish canonical checker reports and enforce cited findings
status: open
roadmap: foundation-tooling/establish-canonical-checker-reports-and-enforce-cited-findings
blocks: —
blocked-by: governance-consistency/001
---

## Context

An audit checker is a governance skill's small deterministic `scripts/audit.ts` program: it verifies the mechanical portion of that skill's standard, then returns its results and explicit prompts for the judgment portion in one report for the shared aggregate.

Every checker needs one canonical report object so the bootstrap aggregate can render a consistent human view without each checker inventing its own presentation.

`ki-skills` owns this contract and its harness-wide proof because it governs the shape and quality of shipped skills.

`ki-engineering` remains a consumer of the contract and may retain shared technical primitives such as the severity ladder, but it does not own the fleet-wide checker rule.

Checkers collect domain findings only. A shared report builder creates the canonical JSONL transport, and the bootstrap aggregate alone renders terminal output.

The builder is an explicit checker-support dependency supplied by `ki-skills`, not a composition edge: it must be vendored where a checker runs without causing every governed target to select `ki-skills` itself.

## Current state

The former JSON-shape exceptions are already resolved: `ki-housekeeping`, `ki-binding`, `ki-decision-records`, and `ki-feature-definitions` now produce a structured report when invoked with `--json`.

What remains is to make that structured report the default, then prove its shape across every shipped audit checker.

No source-harness check currently exercises every checker, compares each emitted rule label with that checker's own rubric, or rejects a message that repeats fields the renderer displays separately.

The existing feature definitions for cited findings and non-repeating messages therefore describe intended behaviour without a durable mechanical gate.

This is intentionally a breaking current-state migration: remove the `--json` reporting switch rather than carrying a compatibility branch.

The aggregate receives canonical reports and owns presentation; a direct checker invocation remains machine-readable by default.

## Steps

1. [ ] Move the checker-report contract into `ki-skills` and name it plainly: **canonical checker report**. Define a versioned JSONL stream: a `meta` record, zero or more `finding` records, and a final `summary` record, each carrying the same run identity (`runId`, `mode`, `concern`, `target`, `generatedAt`) so consumers can stream or map-reduce rows independently. Every finding has `type` (`M` or `J`), a recognised level, stable `code`, and `message`, with optional citation and file fields. Ship a small report-builder module beside the contract: checkers pass it typed domain findings and it computes the summary and emits JSONL. Declare that module as a `checker-support` dependency supplied by `ki-skills`; it is separate from `implies:` because it supplies implementation only, never governance coverage or mode composition. The harness and bootstrap copy each declared support module into `scripts/vendored/<provider>/<module>.ts` in the dependent source and vendored payload, so imports remain local, standalone, collision-safe, and visibly attributable. The aggregate resolves each code against the emitting skill's vendored rubric metadata and renders the readable title first, followed by the stable code in parentheses — for example, `Canonical checker report (CHK-004)` — so the title has one source of truth rather than being copied into every checker report. The same stream applies to both modes: an `M` finding reports observed state during AUDIT and an action or resulting state during CONFORM. A `J` finding is an explicit judgment-review prompt and always uses `ADVISORY`, so it never changes the process exit status.
2. [ ] Add a source-harness contract test under `ki-skills` that discovers every shipped `scripts/audit.ts`, invokes it against the harness with no output-format flag, and names the emitting checker on every failure. Keep the collector read-only: it must neither alter audited content nor write report files.
3. [ ] Validate every canonical report stream: one parseable JSON object per non-empty line; a meta-first / summary-last ordered run with a valid audit or conform mode; non-empty concern, target, and timestamp; every lowercased severity key in `summary`; and findings with a valid type, recognised level, code, and message. Require summary counts and process exit status to agree with the findings; `J` findings must be `ADVISORY` and cannot affect that exit status.
4. [ ] Parse the emitting skill's own `references/rubric.md` to collect each declared code, criterion title, and `[M]`/`[J]` type. Require every finding's type and code to resolve to that rubric; require the vendored rubric metadata to resolve each code to its title for the aggregate renderer; and require every `[J]` criterion to appear once as a cited `J`/`ADVISORY` review prompt, so the full audit scope arrives in one report. For every FAIL, WARN, POLISH, or `J` finding, require a non-empty citation; if a finding names a file, require a non-empty file value. PASS, INFO, NA, and `M`/ADVISORY findings remain exempt from the citation requirement while still conforming to the report shape.
5. [ ] Reject a message that begins with its own code, rule title, file path or basename, or a `[J]:` marker: the aggregate already renders those facts in separate columns. Use focused synthetic reports for each rejection plus a clean report so the assertion is independently tested.
6. [ ] Migrate every shipped audit and conform checker to record typed domain findings only and call its locally copied `checker-support` report-builder module to emit the canonical report by default. A support import always resolves under `scripts/vendored/<provider>/<module>.ts`, never beside the dependent skill's owned scripts. Remove their `--json` branches and all terminal rendering, including ANSI, summary, and remediation-footer code. Change the bootstrap aggregate to invoke checkers without that flag and become the sole renderer. Remove its native-display fallback: malformed checker output becomes a clear aggregate failure, not silently different presentation. Preserve standalone deployment by resolving every declared `checker-support` module and copying it under that vendored namespace in both the source harness and `.ki-meta/`; preserve each mode's explicit write controls such as `--dry-run`.
7. [ ] Repair only concrete source-checker or rubric violations the collection test exposes. Do not add arbitrary cross-skill imports or compatibility shims for the retired output switch; the only implementation sharing is through a declared `checker-support` dependency copied into the dependent skill's local payload.
8. [ ] Update the checker feature definitions, skill references, tests, and roadmap prose to describe semantic concepts such as canonical reports, cited findings, and non-repeating messages. Re-vendor affected coverage-scoped checkers and the aggregate, then run focused tests followed sequentially by the full test and audit gates.

## Files touched

- `skills/general-governance/ki-skills/scripts/checker-report.test.ts` (new source-harness contract test)
- `skills/general-governance/ki-skills/scripts/checker-report.ts` (canonical report builder)
- `skills/general-governance/ki-skills/references/checker-report.md` (new canonical contract)
- `skills/general-governance/ki-skills/SKILL.md` and `references/rubric.md`
- `skills/keystone/ki-bootstrap/scripts/bootstrap.ts` (generated aggregate source)
- `docs/features/checkers.md`
- `docs/roadmap/foundation-tooling/ROADMAP.md`
- Every shipped `scripts/audit.ts` and `scripts/conform.ts` that retains a `--json` branch
- `.ki-meta/` generated payloads after the source migration

## Verify

- The new `ki-skills` source-harness test runs every shipped audit checker with its normal invocation and names the emitter for every malformed report or contract breach.
- Every emitted finding maps its type and stable code to that skill's rubric, and the aggregate resolves that code to the readable rubric title. Every declared `[J]` criterion appears once as a cited `J`/`ADVISORY` review prompt; FAIL, WARN, and POLISH findings also carry citations. Checkers have no terminal-rendering branches; their adjacent report-builder module is the only JSON transport implementation. Malformed report fields, inaccurate summaries, and exit/finding disagreement fail the test.
- A checker-support dependency is declared and copied under `scripts/vendored/<provider>/` in every dependent source and vendored checker; it adds no `implies:`/coverage edge, cannot collide with owned scripts, and works when the checker is run directly from `.ki-meta/`.
- No emitted message repeats its own code, rule title, file/path basename, or a `[J]:` prefix.
- Audit and conform scripts emit the same canonical JSONL report stream by default, distinguished by `mode`; the aggregate's human output derives solely from those records.
- The focused contract test, then `bun run test`, then `bun run ki:audit` pass sequentially.

## Dependencies / blocks

Independent of the generated-surface rollout evidence in `foundation-tooling/002`.

Existing numbered feature identifiers remain stable references; a broader decision on semantic diagnostic identifiers belongs in a separate roadmap item, rather than mixing an identifier migration into this output-contract change.
