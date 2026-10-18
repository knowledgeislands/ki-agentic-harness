---
id: KI-HARNESS-GOV-211
area: GOV
title: Bats fatal assertions
kind: deliver
purpose: governance
project: ways-of-working
component: repo-structure
status: done
blocks: []
blocked_by: []
baseline_ref: a7b3d17a159147934816a4d94c43c42e514e493c
created_at: 2026-10-18T08:42:02Z
updated_at: 2026-10-18T17:35:03Z
---

# KI-HARNESS-GOV-211: Bats Fatal Assertions

## Goal

The `ki-repo-tools` standard states that every `[[ ]]` or `!` assertion in a Bats suite ends `|| false`, because under macOS Bash 3.2 such an assertion failing in the middle of a test does not fail the test, and its checker warns where a shell tool's `tests/*.bats` suite carries an assertion without it.

## Context

Kris Brown answered TEST-FATAL a) on 18 October 2026 in the ways-of-working decisions log, in "owner answers, batch 5": "keep the fix, and add the `|| false` rule for every Bats suite to ki-repo-tools".

The evidence is tools-mgit commit `00ef0de`, "test: make Bats assertions fatal under Bash 3.2". It appended `|| false` to 307 assertions in `tests/mgit.bats`, and the assertions it made fatal exposed five latent faults the suite had been passing over: physical temporary paths in structure output, a manifest grep that matched the source URL, a single-quoted newline in an overview pattern, a deprecation check that matched help text, and a `--git` case that hit a `git-sync` on `PATH`.

## Boundary

- In: the rule and its evidence in the `ki-repo-tools` tool-repository standard and skill summary; a WARN-level mechanical check over the physical `tests/*.bats` files of a shell entrypoint repository; its tests; regenerated skill surfaces.
- Out: editing any other repository's Bats suites, which their owners clean up; `(( ))` arithmetic assertions and `run !`, which the answer did not name; a FAIL level; a release of `ki` or the harness.

## Current state

`ki-repo-tools` requires a shell entrypoint repository to carry a physical `tests/*.bats` suite that CI runs (`SHELL-TEST`) and, where a committed pre-commit hook exists, to run `bats` from it (`SHELL-HOOK`). Neither the standard nor the checker says anything about how a Bats assertion is written, so a suite can pass on macOS Bash 3.2 while mid-test `[[ ]]` and `!` assertions fail silently, as tools-mgit's did until `00ef0de`. The shell context reads only the names of the files under `tests/`, not their text.

## Steps

- [x] State the rule in `references/standards-tool-repositories.md`: in a shell tool's Bats suite every assertion line that starts with `[[` or `!` ends `|| false`, because under macOS Bash 3.2 such an assertion failing in the middle of a test does not fail it; cite tools-mgit `00ef0de` as the evidence and name the new criterion in the capability table.
- [x] Summarise the rule in `SKILL.md`'s shell capability bullet.
- [x] Record the evidence in `references/sources.md` beside the BATS source.
- [x] Read the text of each physical `tests/*.bats` file into the shell context in `scripts/rubric/contexts/tools.ts`.
- [x] Add the WARN-level `SHELL-FATAL` criterion to `scripts/rubric/items/shell.ts`: one VIOLATION per suite naming the count and first line numbers of `[[` or `!` assertion lines without a trailing `|| false`, joining backslash continuations and leaving comments and `&&`/`||` control-flow lines alone; PASS when every assertion is fatal; NOT_APPLICABLE outside a shell entrypoint or without a suite.
- [x] Cover it in `scripts/rubric/contexts/tools.test.ts` and update the ordered catalogue in `scripts/rubric/items/index.test.ts`.
- [x] Regenerate `references/rubric.md` and any other generated surface.
- [x] Run the checks under Verify and list the territory's other Bats suites that would warn.

## Files touched

- `skills/repo-structure/ki-repo-tools/SKILL.md`
- `skills/repo-structure/ki-repo-tools/references/standards-tool-repositories.md`, `sources.md` and generated `rubric.md`
- `skills/repo-structure/ki-repo-tools/scripts/rubric/contexts/tools.ts` and `tools.test.ts`
- `skills/repo-structure/ki-repo-tools/scripts/rubric/items/shell.ts` and `index.test.ts`
- any generated capability catalogue entry the skill generator refreshes
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`, whose pinned criterion counts the new criterion moves

## Verify

- `bun run test` passes, including the new `SHELL-FATAL` cases.
- `bunx tsc --noEmit` passes.
- `ki dev skill rubric ki-repo-tools` reports the rubric current.
- `ki repo audit --skill ki-skills` and `ki repo audit --skill ki-authoring` report no new failure in the contract under change.
- `ki repo audit --repo <tools-mgit> --skill ki-repo-tools` reports `SHELL-FATAL` PASS against tools-mgit after `00ef0de`.

## Dependencies / blocks

No blocker. The audit reaches other repositories only when `ki` loads the harness's updated catalogue; no release is part of this record.

## Documentation impact

### Decision Records

None needed: the rule is a narrow test-authoring convention inside the existing Bats gate, decided by Kris Brown's TEST-FATAL a) answer and evidenced by tools-mgit `00ef0de`; it does not change who owns what.

### Specifications

The `ki-repo-tools` tool-repository standard gains the rule and the `SHELL-FATAL` criterion; no harness specification describes shell-tool test authoring.

### Guides

None: each tool repository's own developer guides own its test procedure, and the rule is quoted from the standard.

### Roadmap

None in this repository. Cleaning up the other repositories' Bats suites belongs to their owners; the run report lists them.

## Review

### Delivered

The approved boundary from baseline `a7b3d17a159147934816a4d94c43c42e514e493c`: the `ki-repo-tools` standard, skill summary and sources state that every `[[ ]]` or `!` assertion in a shell tool's Bats suite ends `|| false`, citing tools-mgit `00ef0de`, and the WARN-level `SHELL-FATAL` criterion reports each `tests/*.bats` suite that carries such an assertion without it. No other repository's suite is edited, `(( ))` and `run !` are not checked, and nothing is released.

### Change Summary

- `references/standards-tool-repositories.md`: the capability table names `SHELL-FATAL`, the scope paragraph says the suite's assertions must be able to fail, and a new "Fatal Bats assertions" section gives the rule, its reason, examples, the tools-mgit `00ef0de` evidence and the check's detection limits.
- `SKILL.md`: the shell capability bullet carries the rule. `references/sources.md`: the BATS and MGIT rows name it and its evidence, with review dates unchanged because no source was re-fetched.
- `scripts/rubric/contexts/tools.ts`: the shell context reads each physical `tests/*.bats` suite's text as `batsSuites`.
- `scripts/rubric/items/shell.ts`: `SHELL-FATAL`, WARN, diagnostic remediation, one outcome per suite with the count and first five line numbers; ordered between `SHELL-TEST` and `SHELL-HOOK`.
- Tests: a `SHELL-FATAL` case in `tools.test.ts` covering plain, negated, already-fatal, control-flow, commented and continued lines, several suites, and the not-applicable paths; the ordered catalogue and levels in `index.test.ts`.
- `references/rubric.md` regenerated.
- Approved deviation: `ki-skills`' `remediation-inventory.test.ts` pins the estate's criterion counts, so criteria, mechanical and diagnostic counts each rise by one and the report-only count from 431 to 432; `SHELL-FATAL` is a justified diagnostic boundary because appending `|| false` can expose latent failures that need a human fix, as it did in tools-mgit.

### Verification

- `bun run test`: pass, 1248 tests.
- `bunx tsc --noEmit`: pass.
- `ki dev skill rubric ki-repo-tools`: current after `--write`.
- `ki repo audit --skill ki-skills`: no failure; WARN=3, all LONG-3 refresh-cadence findings in other skills' `sources.md`, date-driven and outside this change.
- `ki repo audit --skill ki-authoring` and `--skill ki-work-roadmap`: pass.
- `ki repo audit --repo tools-mgit --skill ki-repo-tools`: `tests/mgit.bats`, the suite `00ef0de` fixed, passes `SHELL-FATAL`; its two other suites warn, `territory-producer.bats` with 6 lines and `territory-protocol.bats` with 1, all true `!` or `[[` assertions.
- `ki repo audit --repo tools-rig --skill ki-repo-tools`: 9 suites warn, 64 lines in all; a sample read shows true `!` assertions.

### Outstanding concerns

- The other Bats suites in the territory that would warn, all in tools-mgit and tools-rig, are listed in the run report for their owners to clean up; no other repository in the workspaces or the chezmoi source carries a Bats suite.
- The check is line-based, as Discussion's "Detection limits" says; an assertion that uses `||` between two conditions is not flagged.

### Post-change review

Reviewer: pending; this record awaits an independent review before acceptance.

### Mini recap

`ki-repo-tools` now carries the `|| false` rule for Bats assertions and warns where a suite misses it; tools-mgit's main suite passes, and its two smaller suites and nine of tools-rig's suites are left for their owners.

## Done

Accepted 2026-10-18 by Kris Brown on the review packet above.

## Discussion

Captured on Kris Brown's TEST-FATAL a) answer by the `bats-rule` run in the ways-of-working work, and adopted to Now and planned to Ready by that run under the same answer and its brief, which asked for the record to be captured, planned and delivered to Awaiting review.

### Detection limits

The check is line-based. It joins backslash continuations, skips comments, and leaves lines alone that use `&&` or `||` for control flow, such as `[[ -n $x ]] && skip`, because those are conditions rather than assertions; an assertion written as `[[ a ]] || [[ b ]]` is therefore not flagged. `(( ))` and `run !` are outside the answer and not checked.

### Acceptance

Accepted on 18 October 2026 by the `accept-prune` run of the ways-of-working Project work, under Kris Brown's standing grant recorded in the ways-of-working decisions log, entry "2026-10-18 17:59 BST - owner answers, recap batch" (ACCEPT-AND-PRUNE): "I think anything which is awaiting acceptance can be accepted, and then we can prune anything which is in a state of done". Re-check against `main` at `7d9959dc` before closure: `bun run test` passes, 1255 tests; `bunx tsc --noEmit` passes; `ki dev skill rubric` reports the touched skills' rubrics current and `ki dev skill generate ki-coordination` reports the surfaces in sync; `ki repo audit` passes every skill this record's Verify names, its one failure being the pre-existing `ki-engineering` SCR-11 hook finding outside this record. `ki repo audit --repo tools-mgit --skill ki-repo-tools` still passes `SHELL-FATAL` for `tests/mgit.bats`, the two smaller suites warning under KI-TOOL-MGIT-CLI-027.
