---
id: KI-HARNESS-GOV-196
area: GOV
title: Scratch output in temp
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-16T00:49:23Z
updated_at: 2026-10-16T00:49:23Z
---

# KI-HARNESS-GOV-196: Scratch Output in Temp

## Goal

The `ki-delegation` background-run standard tells every background agent to put screenshots and other scratch output in the system temp folder, never in a thread folder or a repository, so that tracked thread folders and working trees carry only durable work.

## Context

Background agents have been writing screenshots and similar scratch output into tracked thread folders under `+/_THREADS/<run>/`, which then have to be tidied or risk being committed. The rule came from the 5G Emerge Phase 3 coordination thread in Humans Not Robots Principal, recorded in that thread's decisions log. Kris said on 16 October 2026, in these words:

> basically you should be using the temp folder for things like screenshots, not the threads folders.

and then decided, in these words:

> Create a Harness work record to add the rule to the ki-delegation background-run standard: screenshots and other scratch output go in the system temp folder, never in a thread folder or repository.

The [background-run standard](../../skills/governance/ki-delegation/references/standards-background-runs.md) owns the run packet, the [prompt shape](../../skills/governance/ki-delegation/references/standards-background-runs.md#prompt-shape) and the [coordination](../../skills/governance/ki-delegation/references/standards-background-runs.md#coordination) rules an agent follows; it says nothing today about where scratch output goes. The [run-prompt skeleton](../../skills/governance/ki-delegation/assets/run-prompt.md) and the authority footers in the same `assets/` folder are what `ki agent new` and `ki agent launch` put in front of every agent.

## Boundary

- In scope: one rule in the background-run standard, most likely a Coordination bullet beside Isolation, naming the system temp folder (`$TMPDIR`, or a per-run subfolder of it) for screenshots and other scratch output and forbidding thread folders and repositories; and, if planning finds it earns its place, a one-line pointer in the run-prompt rules or the authority footers so that every launched agent sees it.
- Out of scope: the `ki agent` launcher itself, which belongs to `tools-ki`; tidying scratch already committed in any thread folder; deliberate evidence an owner asks to keep, such as screenshots attached to a report, which planning should distinguish from scratch; any edit to the standard made by this capture.

## Discussion

Open points for planning: whether the rule belongs in Coordination, Run packet or Prompt shape; whether the footers should repeat it in one line, as they do for the connection-critical rule, or point to the standard's line as they do for the commit trailer; whether a per-run temp subfolder, such as `$TMPDIR/ki-agents/<run>/`, should be named so a coordinator can find and clear it; and how an agent keeps a screenshot the owner wants as evidence, for example by copying it into the thread folder deliberately and naming it in the report.
