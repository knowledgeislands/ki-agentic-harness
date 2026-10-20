---
id: KI-HARNESS-GOV-219
area: GOV
title: Feedback work-folder kind
project: observatory
component: governance
kind: deliver
priority: high
size: s
status: done
blocks: []
blocked_by: []
baseline_ref: b004ce1bfef9e6622c84b623b5aca5303690279a
created_at: 2026-10-18T17:56:31Z
updated_at: 2026-10-20T21:16:23Z
---

# KI-HARNESS-GOV-219: Feedback Work-Folder Kind

## Goal

The owner's consolidated feedback on a document reaches the work that produced it through that work's own folder. The `ki-work-package` closed list gains a `feedback/` kind holding `<date>-<slug>.md` consolidated feedback packages, and the owner, through the Observatory, becomes an allowed sender of one `## Messages` line linking a package, so that the work reads the feedback at its next pick-up.

## Context

Kris Brown answered the Observatory work's queries on 18 October 2026: "all of the recomendarions are agreed, please continue." Among them, OBS-FEEDBACK-HOME a) reads: the consolidated feedback lands in the producing work's folder as `feedback/<date>-<slug>.md`, linked from a Messages line, after the harness owner adds the kind and the owner as a sender.

Today the [closed list](../../skills/governance/ki-work-package/references/standards-work-package.md#closed-list) has no feedback kind, and its entry-point table lets other work write only one Messages line. The `ki-coordination` [Messages between work](../../skills/change-management/ki-coordination/references/standards-coordination.md#messages-between-work) rule names coordinating work as the sender, not the owner through the Observatory. A Messages line is about 60 words at most with its detail linked, so a consolidated review needs a file of its own.

This is a handoff from the Observatory work in Knowledge Islands Principal. This repository owns its priority, plan and execution; it is captured as unadopted triage and not implemented here.

## Boundary

- `ki-work-package`: the closed list gains `feedback/<date>-<slug>.md` with its kept-until rule, and the entry-point table gains the owner, through the Observatory, writing one package and one Messages line, committed together. The rubric accepts the kind and `rubric.md` is regenerated.
- `ki-coordination`: Messages between work names the owner, through the Observatory, as an allowed sender, and the receiver's handling of a package link.
- Not the Observatory's `feedback.send` operation, which apps-observatory.local owns.

## Current state

The [closed list](../../skills/governance/ki-work-package/references/standards-work-package.md#closed-list) holds the five package files, run reports, `briefs/` and `design/`; the [entry points](../../skills/governance/ki-work-package/references/standards-work-package.md#entry-points) let other work and State of play write one `messages.md` line and nothing else. `ki-coordination`'s rubric enforces the folder side through COORD-9: `WORK_SUBFOLDERS` in `skills/change-management/ki-coordination/scripts/rubric/contexts/coordination.ts` admits only `briefs` and `design`, so a `feedback/` folder is reported as stray. The `ki-work-package` rubric checks the package files' schema, not the folder's subfolders, so it needs no code change. [Messages between work](../../skills/change-management/ki-coordination/references/standards-coordination.md#messages-between-work) names coordinating work in the same Capital as the only sender beside territory work.

## Steps

- [x] `ki-work-package` standard: add a Feedback package row, `feedback/<date>-<slug>.md`, to the closed list, kept until a tidy finds every point in it homed; add the owner, through the Observatory, to the entry-point table, writing one package and one `messages.md` line linking it, committed together; add the package to the tidy's What goes and What stays; and name the kind in `SKILL.md`'s work-folder summary.
- [x] `ki-coordination` standard: Messages between work names the owner, through the Observatory, as a sender, and says the receiver reads the linked package as part of the line, recording each point's disposition where it lands; the prune's judgement line covers a package as it covers a report.
- [x] COORD-9: admit `feedback` in `WORK_SUBFOLDERS`, and name it in the item description, the `workFolderFindings` comment and the tidy outcome's closed-list string.
- [x] Extend the closed-list fixture test in `coordination.test.ts` to hold a `feedback/` folder.
- [x] Regenerate the `ki-coordination` rubric reference and run the verification below.

## Files touched

- `skills/governance/ki-work-package/references/standards-work-package.md`
- `skills/governance/ki-work-package/SKILL.md`
- `skills/change-management/ki-coordination/references/standards-coordination.md`
- `skills/change-management/ki-coordination/references/rubric.md` (regenerated)
- `skills/change-management/ki-coordination/scripts/rubric/contexts/coordination.ts`
- `skills/change-management/ki-coordination/scripts/rubric/contexts/coordination.test.ts`
- `skills/change-management/ki-coordination/scripts/rubric/items/threads.ts`

## Verify

- `bun test skills/change-management/ki-coordination` passes, the closed-list test holding `feedback/` with no stray finding.
- `bun run test` and `bunx tsc --noEmit` pass.
- `ki repo audit --skill ki-coordination`, `--skill ki-work-package` and `--skill ki-work-roadmap` raise no new finding.
- The regenerated `rubric.md` matches its sources with no further diff.

## Dependencies / blocks

Blocks the Observatory's Capture feedback work in apps-observatory.local, [KI-OBSERVA-BRG-002](https://github.com/knowledgeislands/apps-observatory.local/blob/886833981a7e57c82bda9ee5f562ce6a4804c79f/docs/roadmap/KI-OBSERVA-BRG-002-capture-feedback.md), linked at a fixed revision so the link survives pruning: its send writes into a kind and through a sender this record adds. Nothing here waits on that work.

## Documentation impact

### Decision Records

None expected: Kris Brown's 18 October answer to OBS-FEEDBACK-HOME is recorded in the Observatory work's decisions log, and this applies it to the work-folder contract.

### Specifications

None: the work package is a skill standard here, not a KI Specification.

### Guides

None: no guide names the closed list; the two standards, the `ki-work-package` skill summary and the regenerated `ki-coordination` rubric reference carry the change.

### Roadmap

Unblocks [KI-OBSERVA-BRG-002](https://github.com/knowledgeislands/apps-observatory.local/blob/886833981a7e57c82bda9ee5f562ce6a4804c79f/docs/roadmap/KI-OBSERVA-BRG-002-capture-feedback.md) in apps-observatory.local.

## Review

### Delivered

The approved boundary, against baseline `b004ce1bfef9e6622c84b623b5aca5303690279a`: the `ki-work-package` closed list, entry points and tidy rules gain the feedback package and the owner, through the Observatory, as its writer; `ki-coordination`'s Messages between work names that sender and the receiver's handling of a package link; and COORD-9 admits `feedback/`. The Observatory's `feedback.send` operation stays out, with apps-observatory.local.

### Change Summary

- `skills/governance/ki-work-package/references/standards-work-package.md`: a Feedback package row, `feedback/<date>-<slug>.md`, kept until a tidy finds every point in it homed; an entry point for the owner, through the Observatory, writing one package and one linking `messages.md` line, committed together; the package in the tidy's What goes and What stays.
- `skills/governance/ki-work-package/SKILL.md`: the work-folder summary names feedback packages.
- `skills/change-management/ki-coordination/references/standards-coordination.md`: the Sender bullet adds the owner, through the Observatory; the Receiver bullet takes a linked package with its line and records each point's disposition; the prune's Judgement line covers a package.
- `skills/change-management/ki-coordination/scripts/rubric/contexts/coordination.ts` and `items/threads.ts`: `WORK_SUBFOLDERS` admits `feedback`, and COORD-9's description, the `workFolderFindings` comment and the tidy's closed-list string name it.
- `skills/change-management/ki-coordination/scripts/rubric/contexts/coordination.test.ts`: the closed-list test holds a `feedback/` folder with a package and finds nothing stray.
- `skills/change-management/ki-coordination/references/rubric.md`: COORD-9's line carries the new description. `ki dev skill rubric` renders only from the dev-linked main checkout, not this worktree, so the line was edited to the item's description, checked equal to it by script; the integrating session's `ki dev skill rubric ki-coordination` confirms sync.

### Verification

- `bun test skills/change-management/ki-coordination`: 80 pass, 0 fail.
- `bunx tsc --noEmit`: passes.
- `bun run test`: 1302 pass, 4 fail; the four, in `hooks/pre-commit.test.ts`, `hooks/commit-msg.test.ts` and `hooks/git-hook-stub.test.ts`, fail the same way on the untouched baseline in a clean detached worktree, so none comes from this change.
- `bunx @biomejs/biome check` on the rubric scripts: no fixes; its one warning is not in a changed line.
- `ki repo audit --skill ki-coordination` and `--skill ki-work-package`: PASS. `--skill ki-work-roadmap`: FAIL, every finding ITEM-3 on the other drafts adopted into Now on TRIAGE-ALL and not yet planned; none on this record.

### Outstanding concerns

None for this record. The audit runs the installed harness, so COORD-9's new tolerance takes effect across the estate only once this change is integrated and installed.

### Post-change review

The goal is met: a feedback package has a home, a writer and a tidy rule, and COORD-9 no longer flags it. Scope held to the two skills; the Observatory side is untouched. Regression risk is low: the rubric change widens one allowed set by one name, and the closed-list test still catches a stray file. Ready for acceptance.

### Mini recap

The work folder now admits the owner's consolidated feedback, written through the Observatory beside one linking Messages line and tidied once every point is homed; the tests and both skill audits pass, with four pre-existing hook-test failures unrelated. Learning route, not promoted: `ki dev skill rubric` could render from the current worktree, so a worktree run can regenerate its own rubric.

## Done

Accepted 2026-10-20 by the independent reviewer under Kris Brown's explicit acceptance grant on the review packet above.

## Discussion

### Independent acceptance review, 20 October 2026

Independent review of harness main at `e8f1da6ef0353c8448d0d7984ebe76f8846fb8f2` passes every Goal and Step outcome. The feedback package, owner through Observatory, atomic package-and-message write, receiver dispositions and tidy rules are present in the two standards. Subsequent work moved closed-list enforcement from COORD-9 to `ki-work-package` FOLDER-1; its allowed Markdown folders include `feedback`, its closed-list fixture includes a feedback package, and its stray-file fixture still rejects unsupported files.

`bun test skills/change-management/ki-coordination`, `bun test skills/governance/ki-work-package`, `bun run test` and `bunx tsc --noEmit` pass. Isolated, development-linked `ki repo audit` runs for `ki-coordination`, `ki-work-package`, `ki-work-roadmap` and `ki-authoring` report no failures; existing warnings do not concern this delivery. `ki dev skill rubric ki-coordination` confirms the published reference matches its current sources. No Observatory application changes were required or made.

Kris Brown's acceptance grant of 20 October 2026, renewed at 22:03 BST, explicitly authorises independent acceptance of this record and KI-HARNESS-GOV-224 despite the standing prohibition. This review accepts this record alone; no push or pruning is authorised by this run.

### Kept until

How long a package stays is left to planning; the natural reading is that the receiving work's tidy deletes it once every point in it has a durable home, as a run report goes.

### Kept until, planned

A package goes as a run report goes: the receiving work's tidy deletes it once every point in it has a durable home, and keeps it while any point is open.

### Approval

Planned and set ready on 20 October 2026 by the `lane-triage` run of the ways-of-working work, whose brief, on Kris Brown's TRIAGE-ALL words of 19 October, "anything which is High confidence recommended. Let's move it into now and get it done", directs delivery of this record through `ki-plan` and `ki-implement` to Awaiting review.
