---
id: KI-HARNESS-GOV-211
area: GOV
title: Bats fatal assertions
kind: deliver
purpose: governance
project: ways-of-working
component: repo-structure
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-18T08:42:02Z
updated_at: 2026-10-18T08:47:00Z
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

- [ ] State the rule in `references/standards-tool-repositories.md`: in a shell tool's Bats suite every assertion line that starts with `[[` or `!` ends `|| false`, because under macOS Bash 3.2 such an assertion failing in the middle of a test does not fail it; cite tools-mgit `00ef0de` as the evidence and name the new criterion in the capability table.
- [ ] Summarise the rule in `SKILL.md`'s shell capability bullet.
- [ ] Record the evidence in `references/sources.md` beside the BATS source.
- [ ] Read the text of each physical `tests/*.bats` file into the shell context in `scripts/rubric/contexts/tools.ts`.
- [ ] Add the WARN-level `SHELL-FATAL` criterion to `scripts/rubric/items/shell.ts`: one VIOLATION per suite naming the count and first line numbers of `[[` or `!` assertion lines without a trailing `|| false`, joining backslash continuations and leaving comments and `&&`/`||` control-flow lines alone; PASS when every assertion is fatal; NOT_APPLICABLE outside a shell entrypoint or without a suite.
- [ ] Cover it in `scripts/rubric/contexts/tools.test.ts` and update the ordered catalogue in `scripts/rubric/items/index.test.ts`.
- [ ] Regenerate `references/rubric.md` and any other generated surface.
- [ ] Run the checks under Verify and list the territory's other Bats suites that would warn.

## Files touched

- `skills/repo-structure/ki-repo-tools/SKILL.md`
- `skills/repo-structure/ki-repo-tools/references/standards-tool-repositories.md`, `sources.md` and generated `rubric.md`
- `skills/repo-structure/ki-repo-tools/scripts/rubric/contexts/tools.ts` and `tools.test.ts`
- `skills/repo-structure/ki-repo-tools/scripts/rubric/items/shell.ts` and `index.test.ts`
- any generated capability catalogue entry the skill generator refreshes

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

## Discussion

Captured on Kris Brown's TEST-FATAL a) answer by the `bats-rule` run in the ways-of-working work, and adopted to Now and planned to Ready by that run under the same answer and its brief, which asked for the record to be captured, planned and delivered to Awaiting review.

### Detection limits

The check is line-based. It joins backslash continuations, skips comments, and leaves lines alone that use `&&` or `||` for control flow, such as `[[ -n $x ]] && skip`, because those are conditions rather than assertions; an assertion written as `[[ a ]] || [[ b ]]` is therefore not flagged. `(( ))` and `run !` are outside the answer and not checked.
