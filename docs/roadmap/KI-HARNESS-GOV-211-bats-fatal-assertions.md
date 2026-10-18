---
id: KI-HARNESS-GOV-211
area: GOV
title: Bats fatal assertions
project: ways-of-working
component: repo-structure
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-18T08:42:02Z
updated_at: 2026-10-18T08:42:02Z
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

## Discussion

Captured on Kris Brown's TEST-FATAL a) answer by the `bats-rule` run in the ways-of-working work.
