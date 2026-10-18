---
id: KI-HARNESS-GOV-197
area: GOV
title: COORD-7 outside-checkout links
kind: deliver
purpose: governance
project: ways-of-working
component: governance
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 583079750db3681509e95db941ebc90b81813a0e
created_at: 2026-10-16T21:10:48Z
updated_at: 2026-10-18T18:10:42Z
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

## Current state

`reportLinkFindings` in [coordination.ts](../../skills/change-management/ki-coordination/scripts/rubric/contexts/coordination.ts) checked every record link with an absolute local target for existence, wherever it pointed, so a link into another repository failed on a CI runner where only the audited checkout exists.

## Plan

Kris Brown adopted and approved this record on 18 October 2026 by taking option a) of GOV-197-NEXT, recorded in the ways-of-working decisions log under "owner answers, evening Summary batch; mark": plan and deliver it in the harness, then carry it to CI in the next `ki` release. The planning points in Discussion are settled as follows:

- **Checkout root:** the audited repository's root, which the coordination session already passes to the link check, never the working directory.
- **Where existence is still checked:** inside the checkout, and outside it wherever the target's folder is present on the machine. A pruned record in a sibling checkout on the owner's machine still fails locally, while a CI runner, which has no such folder, checks shape.
- **Shape:** the target, less any fragment, is a Markdown file whose name is the linked identifier followed by `-` or `.md`. A misshapen link is its own violation, named `misshapen`, apart from `missing`.

## Steps

- [x] Tests first: unit cases for shape-only, sibling-present and inside-checkout links, and a context case for a runner-style report.
- [x] Classify each absolute target by checkout and folder presence, and check shape where existence cannot be checked.
- [x] Update the COORD-7 description, the linking rule in the standard and the generated rubric.
- [x] Run Verify.

## Files touched

- `skills/change-management/ki-coordination/scripts/rubric/contexts/coordination.ts` and `coordination.test.ts`
- `skills/change-management/ki-coordination/scripts/rubric/items/threads.ts`
- `skills/change-management/ki-coordination/references/standards-coordination.md` and the generated `rubric.md`
- this record

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-coordination` reports the rubric in sync.
- `ki repo audit --skill ki-coordination` here and in ki-principal shows no COORD-7 regression on this machine.

## Dependencies / blocks

None. The `ki` release that carries the change to ki-principal CI is outside this record and waits for it.

## Documentation impact

### Decision Records

None: the owner decision above carries the rationale.

### Specifications

None.

### Guides

None.

### Roadmap

None.

## Review

### Delivered

COORD-7 now checks a record link outside the audited checkout for existence only where its folder is on the machine, and for shape elsewhere, so ki-principal's reports can pass on a CI runner once a `ki` release carries the harness.

### Change Summary

- The commit carrying this record: the link classification and shape check, their tests, the COORD-7 description, the linking rule and the regenerated rubric.

### Verification

On 18 October 2026, before commit: `bun run test` passed 1260 tests and `bunx tsc --noEmit` passed; `ki dev skill rubric ki-coordination` reports the rubric in sync; `ki repo audit --skill ki-coordination` and `--skill ki-skills` pass here. In ki-principal on this machine COORD-7 reports no `misshapen` finding; its 8 `missing` findings are pruned records in sibling checkouts that are present here, in the ki.chezmoi, ki.mac-studio-setup and ki.tools-burndown folders, which those works relink, and on a CI runner they are checked for shape and pass. `ki repo audit --skill ki-work-roadmap` passes this record; its one failure is KI-HARNESS-GOV-210's review shape, outside this record.

### Outstanding concerns

- CI picks the change up only after the next `ki` release pins this harness; the ki-release run carries it.

### Post-change review

None.

### Mini recap

A report's links to other repositories no longer fail the audit on a machine where those repositories are not checked out.

## Discussion

Open points for planning: what "shape" admits, such as an absolute path ending in a record file name that matches the linked identifier; how the audit learns the checkout root, presumably from the audited repository's root rather than the working directory; and whether a path into another registered checkout present on the machine should still be checked for existence when it can be.
