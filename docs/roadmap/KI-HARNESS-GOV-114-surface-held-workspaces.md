---
id: KI-HARNESS-GOV-114
area: GOV
title: Surface held workspaces
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T23:55:00Z
updated_at: 2026-09-26T23:55:00Z
---

# KI-HARNESS-GOV-114: Surface held workspaces

## Goal

Someone is asked about a workspace the retirement mechanism is holding by a gate that can never pass, without a person first deciding to go looking for it.

## Context

`KI-HARNESS-GOV-113` states the disposition rule: a workspace held past its cooldown by an unsatisfiable gate is unlanded work nobody has been asked about, so it becomes a Triage item in the repository that owns the checkout, decided as land it, discard it, or duplicate. The rule names its trigger and its owner and nothing surfaces the trigger.

There is no report. A held workspace is visible only to whoever walks close-readiness per workspace and reasons about which gate is blocking and whether that gate can ever change: a detached `HEAD` can never satisfy the merge gate, an abandoned branch can never satisfy it either, and neither state announces itself. A workspace list is no help, because the delivery state it carries may be an unpassed default rather than a reading.

This was discovered while writing `GOV-113` and was captured after that record's number was secured, so the two could not race for one ledger advance.

## Boundary

In scope: the reporting path that names workspaces whose source task tree is terminal, whose cooldown has elapsed, and whose blocking gate cannot pass, in a form a person or agent can act on.

Out of scope: the doctrine itself, which `GOV-113` owns; changing the retirement mechanism or its gates, which belong to the coordination plane rather than this repository; making the `COORD` family mechanically checkable, which is `KI-HARNESS-GOV-107`; and any automatic disposition — the decision stays a person's.

## Discussion

### Where the report could live

Three candidates, none chosen. The coordination plane already computes close-readiness per workspace, so a report could belong there and be out of this repository's reach entirely. A `ki` command could read it through the coordination-plane API, which makes this repository depend on a control plane it deliberately treats as optional. A recurring coordination task could walk the list and raise Triage items, which is the cheapest to build and the easiest to forget to check. Adoption should pick one rather than build the cheapest by default.

### Why this is capture rather than delivery

The doctrine it serves is judgment-graded and newly written. Until a repository has held a workspace long enough for the rule to be tested by review, the cost of the missing report is unmeasured. This record exists so the gap is not rediscovered as a surprise, not because the build order is obvious.

### Governing coordination task

Discovered under coordination task `KIS-39` while delivering `KI-HARNESS-GOV-113`, and captured into Triage without adoption. Written in that task's worktree rather than the designated primary checkout, under the same human direction and the same recorded deviation as `GOV-113`.
