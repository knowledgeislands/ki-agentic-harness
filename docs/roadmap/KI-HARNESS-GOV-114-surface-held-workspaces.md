---
id: KI-HARNESS-GOV-114
area: GOV
title: Surface held workspaces
kind: deliver
project: paperclip-bootstrap-and-recovery
component: agentic-systems
status: cancelled
resolution: merged
resolution_target: KI-HARNESS-GOV-147
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T23:55:00Z
updated_at: 2026-10-07T20:29:49Z
---

# KI-HARNESS-GOV-114: Surface held workspaces

## Goal

Someone is asked about a workspace the retirement mechanism is holding by a gate that can never pass, without a person first deciding to go looking for it.

## Context

`KI-HARNESS-GOV-113` states the disposition rule: a workspace held past its cooldown by an unsatisfiable gate is unlanded work nobody has been asked about, so it becomes a Triage item in the repository that owns the checkout, decided as land it, discard it, or duplicate. The rule names its trigger and its owner and nothing surfaces the trigger.

There is no report. A held workspace is visible only to whoever walks close-readiness per workspace and reasons about which gate is blocking and whether that gate can ever change: a detached `HEAD` can never satisfy the merge gate, an abandoned branch can never satisfy it either, and neither state announces itself. A workspace list is no help, because the delivery state it carries may be an unpassed default rather than a reading.

This was discovered while writing `GOV-113` and was captured after that record's number was secured, so the two could not race for one ledger advance.

## Boundary

Decided 2026-10-05 under delegated owner authority: the report lives in the `ki-agent-coordination-paperclip` audit as a judgment-assisted listing built from locally held workspace evidence. Disposition stays human. This picks the second of the three candidates below without the coordination-plane API.

In scope:

- a read-only operation attached to the existing `COORD-9` item, keeping its judgment prompt, that lists candidate held workspaces from the selected repository's own Git worktree registry;
- a candidate is a linked worktree whose merge gate cannot pass on local evidence: a detached `HEAD`, or a branch head that is not an ancestor of the destination branch, where the destination is the primary worktree's branch; each entry names the path, head, branch or detached state, ahead and behind counts against the destination, the head commit's age, and whether its working tree is dirty;
- outcomes are `INFO` only, never `VIOLATION`, so the audit verdict for the selected checkout never depends on a sibling worktree, preserving the stability boundary from `KI-HARNESS-GOV-110` and [KI-HARNESS-GOV-115](KI-HARNESS-GOV-115-require-a-current-base-for-a-coordinated-worktree.md);
- each entry states that the plane-side gates (task-tree terminality, cooldown, active runs) were not evaluated, and names the human next step: confirm close-readiness in Paperclip, then capture a Triage item through `ki-next` in this repository, decided as land, discard or duplicate;
- the `mode-audit.md` procedure step that tells the reviewer how to use the listing.

Out of scope: the disposition doctrine, which is already in the standard's `#workspace-retirement`; any removal, prune, rebase, fetch or branch change; any coordination-plane read by the mechanical audit, including close-readiness (the mechanical operation reads nothing from the coordination plane; only the human procedure step in `mode-audit.md` may consult Paperclip's close-readiness view); automatic Triage capture; changing the retirement mechanism or its gates; a fleet sweep across repositories; and any new criterion code.

## Cancelled

Approved by Kris on 2026-10-07 under decision 17 of the state-of-play design, which approved every cancel and merge in the easiest-first delivery plan.

Resolution `merged` into [KI-HARNESS-GOV-147](KI-HARNESS-GOV-147-make-the-branch-durable.md): once the branch is durable, held workspaces are surfaced and retired by the same rule. The scope worth keeping is folded into that record's Boundary and Discussion. It leaves no outstanding change of its own.

## Discussion

### Where the report could live

Three candidates were considered; the 2026-10-05 decision took a local variant of the second, reading the repository's own worktree registry rather than the coordination-plane API. The coordination plane already computes close-readiness per workspace, so a report could belong there and be out of this repository's reach entirely. A `ki` command could read it through the coordination-plane API, which makes this repository depend on a control plane it deliberately treats as optional. A recurring coordination task could walk the list and raise Triage items, which is the cheapest to build and the easiest to forget to check. Adoption should pick one rather than build the cheapest by default.

### Why this is capture rather than delivery

The doctrine it serves is judgment-graded and newly written. Until a repository has held a workspace long enough for the rule to be tested by review, the cost of the missing report is unmeasured. This record exists so the gap is not rediscovered as a surprise, not because the build order is obvious.

### Governing coordination task

Discovered under coordination task `KIS-39` while delivering `KI-HARNESS-GOV-113`, and captured into Triage without adoption. Written in that task's worktree rather than the designated primary checkout, under the same human direction and the same recorded deviation as `GOV-113`.

### Decision

The held-workspace report lives in the `ki-agent-coordination-paperclip` audit as a judgment-assisted listing from locally held workspace evidence; disposition stays human. The other candidates above are superseded. Decided by the Fable reviewer under delegated autonomy, reversible.
