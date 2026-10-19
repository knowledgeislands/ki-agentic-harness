---
id: KI-HARNESS-GOV-219
area: GOV
title: Feedback work-folder kind
project: observatory
component: governance
kind: deliver
priority: high
size: s
status: draft
horizon: now
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-18T17:56:31Z
updated_at: 2026-10-19T23:30:55Z
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

## Dependencies / blocks

Blocks the Observatory's Capture feedback work in apps-observatory.local, [KI-OBSERVA-BRG-002](https://github.com/knowledgeislands/apps-observatory.local/blob/886833981a7e57c82bda9ee5f562ce6a4804c79f/docs/roadmap/KI-OBSERVA-BRG-002-capture-feedback.md), linked at a fixed revision so the link survives pruning: its send writes into a kind and through a sender this record adds. Nothing here waits on that work.

## Discussion

### Kept until

How long a package stays is left to planning; the natural reading is that the receiving work's tidy deletes it once every point in it has a durable home, as a run report goes.
