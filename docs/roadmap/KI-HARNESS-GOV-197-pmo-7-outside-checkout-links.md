---
id: KI-HARNESS-GOV-197
area: GOV
title: COORD-7 outside-checkout links
project: ways-of-working
component: governance
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-16T21:10:48Z
updated_at: 2026-10-16T21:10:48Z
---

# KI-HARNESS-GOV-197: COORD-7 Outside-Checkout Links

## Goal

The `ki-coordination` rubric's COORD-7 checks only the shape of a record link whose absolute local path lies outside the audited checkout, and keeps the existence check for a path inside it, so that thread reports written to the linking standard can pass the audit on a CI runner where no other checkout exists.

## Context

The [ki-coordination standard](../../skills/change-management/ki-coordination/references/standards-coordination.md#linking-records) makes every record link in a thread report an absolute local path, and COORD-7 in [threads.ts](../../skills/change-management/ki-coordination/scripts/rubric/items/threads.ts), now at failure level, checks that each target file exists. Most such links point at other repositories' records under `/Users/krisbrown/workspaces/...`, which exist on the owner's machine but never on a GitHub runner.

The first whole-tree `ki repo audit` in ki-principal CI, run [38814652019](https://github.com/knowledgeislands/ki-principal/actions/runs/38814652019) after the `ki` v0.10.5 pin, failed COORD-7 128 times. 65 of those are "missing": absolute local paths that cannot exist on the runner, so they can never pass in CI however the reports are fixed. The other 63 are bare identifiers in older reports, a separate backlog. The finding is recorded in the ways-of-working thread's [cli-pin run report (deleted)](https://github.com/knowledgeislands/ki-principal/blob/528b53b1cddabb0bb4fb809a426a08baac75fa8b/+/_THREADS/ways-of-working/cli-pin.report.md), whose PMO-CI query Kris answered with option a) under ROUTINE on 16 October 2026, in these words:

> Take the recommended option a) for OTHER-PUSH, REPIN, GATE-PRINCIPAL, PMO-CI, CI-FINDINGS, MSG-LANDED, MSG-ORPHANS, THREADS-TRIM and TMP-CLOSE, including pushing other sessions' commits that sit beneath this thread's in ki-agentic-harness and ki-principal.

## Boundary

- In scope: COORD-7's link classification in `threads.ts` and its tests, so that an absolute path outside the audited checkout is checked for shape only, the path inside it still for existence; the COORD-7 description and remediation, the [linking rule](../../skills/change-management/ki-coordination/references/standards-coordination.md#linking-records) and the generated rubric, where they name the existence check.
- Out of scope: the bare-identifier backlog in ki-principal's reports; the ki-principal pin and `ki` release that carry the fix to CI; any change to the absolute-path linking form itself.

## Discussion

Open points for planning: what "shape" admits, such as an absolute path ending in a record file name that matches the linked identifier; how the audit learns the checkout root, presumably from the audited repository's root rather than the working directory; and whether a path into another registered checkout present on the machine should still be checked for existence when it can be.
