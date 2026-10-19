---
id: KI-HARNESS-GOV-219
area: GOV
title: Feedback work-folder kind
project: observatory
component: governance
kind: deliver
priority: high
size: s
status: ready
horizon: now
blocks: []
blocked_by: []
baseline_ref: f163531d5098a42912a325d2a1b6df84a33d27ee
created_at: 2026-10-18T17:56:31Z
updated_at: 2026-10-19T23:40:00Z
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

- [ ] `ki-work-package` standard: add a Feedback package row, `feedback/<date>-<slug>.md`, to the closed list, kept until a tidy finds every point in it homed; add the owner, through the Observatory, to the entry-point table, writing one package and one `messages.md` line linking it, committed together; add the package to the tidy's What goes and What stays; and name the kind in `SKILL.md`'s work-folder summary.
- [ ] `ki-coordination` standard: Messages between work names the owner, through the Observatory, as a sender, and says the receiver reads the linked package as part of the line, recording each point's disposition where it lands; the prune's judgement line covers a package as it covers a report.
- [ ] COORD-9: admit `feedback` in `WORK_SUBFOLDERS`, and name it in the item description, the `workFolderFindings` comment and the tidy outcome's closed-list string.
- [ ] Extend the closed-list fixture test in `coordination.test.ts` to hold a `feedback/` folder.
- [ ] Regenerate the `ki-coordination` rubric reference and run the verification below.

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

## Discussion

### Kept until

How long a package stays is left to planning; the natural reading is that the receiving work's tidy deletes it once every point in it has a durable home, as a run report goes.

### Kept until, planned

A package goes as a run report goes: the receiving work's tidy deletes it once every point in it has a durable home, and keeps it while any point is open.

### Approval

Planned and set ready on 20 October 2026 by the `lane-triage` run of the ways-of-working work, whose brief, on Kris Brown's TRIAGE-ALL words of 19 October, "anything which is High confidence recommended. Let's move it into now and get it done", directs delivery of this record through `ki-plan` and `ki-implement` to Awaiting review.
