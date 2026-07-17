---
id: '003'
title: Establish canonical checker reports and enforce cited findings
status: open
roadmap: foundation-tooling/establish-canonical-checker-reports-and-enforce-cited-findings
blocks: —
blocked-by: —
---

## Context

An audit checker is a governance skill's small deterministic `scripts/audit.ts` program: it verifies the mechanical portion of that skill's standard and returns findings for the shared aggregate.

Every checker needs one canonical report object so the bootstrap aggregate can render a consistent human view without each checker inventing its own presentation.

`ki-skills` owns this contract and its harness-wide proof because it governs the shape and quality of shipped skills.

`ki-engineering` remains a consumer of the contract and may retain shared technical primitives such as the severity ladder, but it does not own the fleet-wide checker rule.

## Current state

The former JSON-shape exceptions are already resolved: `ki-housekeeping`, `ki-binding`, `ki-decision-records`, and `ki-feature-definitions` now produce a structured report when invoked with `--json`.

What remains is to make that structured report the default, then prove its shape across every shipped audit checker.

No source-harness check currently exercises every checker, compares each emitted rule label with that checker's own rubric, or rejects a message that repeats fields the renderer displays separately.

The existing feature definitions for cited findings and non-repeating messages therefore describe intended behaviour without a durable mechanical gate.

This is intentionally a breaking current-state migration: remove the `--json` reporting switch rather than carrying a compatibility branch.

The aggregate receives canonical reports and owns presentation; a direct checker invocation remains machine-readable by default.

## Steps

1. [ ] Move the checker-report contract into `ki-skills` and name it plainly: **canonical checker report**. Define one versioned report object containing `concern`, `target`, `generatedAt`, `summary`, and `findings`; every finding has a recognised level, stable `code`, human-readable `rule` title, and `message`, with optional citation and file fields. Keep existing identifiers such as `CHK-004` as stable traceability keys, but render the title first — for example, `Canonical checker report (CHK-004)` — rather than displaying a bare code.
2. [ ] Add a source-harness contract test under `ki-skills` that discovers every shipped `scripts/audit.ts`, invokes it against the harness with no output-format flag, and names the emitting checker on every failure. Keep the collector read-only: it must neither alter audited content nor write report files.
3. [ ] Validate every canonical report: one parseable JSON object; non-empty concern, target, and timestamp; every lowercased severity key in `summary`; and findings with a recognised level, code, rule title, and message. Require summary counts and process exit status to agree with the findings.
4. [ ] Parse the emitting skill's own `references/rubric.md` to collect its declared codes and criterion titles. For every FAIL, WARN, and POLISH finding, require its `code` and `rule` to resolve to that rubric and require a non-empty citation; if a finding names a file, require a non-empty file value. PASS, INFO, NA, and ADVISORY remain exempt from the citation requirement while still conforming to the report shape.
5. [ ] Reject a message that begins with its own code, rule title, file path or basename, or a `[J]:` marker: the aggregate already renders those facts in separate columns. Use focused synthetic reports for each rejection plus a clean report so the assertion is independently tested.
6. [ ] Migrate every shipped audit and conform checker to emit the canonical report by default, remove their `--json` branches, and change the bootstrap aggregate to invoke checkers without that flag. Remove its native-display fallback: malformed checker output becomes a clear aggregate failure, not silently different presentation. Preserve the single aggregate renderer, checker self-containment, and each mode's explicit write controls such as `--dry-run`.
7. [ ] Repair only concrete source-checker or rubric violations the collection test exposes. Do not add cross-skill imports, a new shared runtime library, or compatibility shims for the retired output switch.
8. [ ] Update the checker feature definitions, skill references, tests, and roadmap prose to describe semantic concepts such as canonical reports, cited findings, and non-repeating messages. Re-vendor affected coverage-scoped checkers and the aggregate, then run focused tests followed sequentially by the full test and audit gates.

## Files touched

- `skills/general-governance/ki-skills/scripts/checker-report.test.ts` (new source-harness contract test)
- `skills/general-governance/ki-skills/references/checker-report.md` (new canonical contract)
- `skills/general-governance/ki-skills/SKILL.md` and `references/rubric.md`
- `skills/keystone/ki-bootstrap/scripts/bootstrap.ts` (generated aggregate source)
- `docs/features/checkers.md`
- `docs/roadmap/foundation-tooling/ROADMAP.md`
- Every shipped `scripts/audit.ts` and `scripts/conform.ts` that retains a `--json` branch
- `.ki-meta/` generated payloads after the source migration

## Verify

- The new `ki-skills` source-harness test runs every shipped audit checker with its normal invocation and names the emitter for every malformed report or contract breach.
- Every emitted FAIL, WARN, and POLISH finding maps its stable code and readable rule title to that skill's rubric and carries a citation; malformed report fields, inaccurate summaries, and exit/finding disagreement fail the test.
- No emitted message repeats its own code, rule title, file/path basename, or a `[J]:` prefix.
- Audit and conform scripts emit canonical reports by default, and the aggregate's human output derives solely from those reports.
- The focused contract test, then `bun run test`, then `bun run ki:audit` pass sequentially.

## Dependencies / blocks

Independent of the generated-surface rollout evidence in `foundation-tooling/002`.

Existing numbered feature identifiers remain stable references; a broader decision on semantic diagnostic identifiers belongs in a separate roadmap item, rather than mixing an identifier migration into this output-contract change.
