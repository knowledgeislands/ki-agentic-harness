---
id: KI-HARNESS-GOV-146
area: GOV
title: Gate acceptance on audits
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-06T23:01:19Z
updated_at: 2026-10-06T23:01:19Z
---

# KI-HARNESS-GOV-146: Gate acceptance on audits

## Goal

The estate has a settled answer to whether a work record may be accepted as `done` while an audit that governs it fails, and that answer is enforced where acceptance happens.

## Context

`KI-HARNESS-GOV-101` reached `status: done` through the commit `chore(roadmap): accept KI-HARNESS-GOV-101` at `39a9b63e`. At that commit the record failed two governing audits: `ki repo audit --skill ki-work-roadmap` failed `ITEM-3` on the order of its `## Review` sub-sections, and `ki repo audit --skill ki-authoring` failed the Markdown gate with two `MD049` findings. Acceptance therefore did not require the governing audits to pass.

`KI-HARNESS-GOV-101` has since been accepted and pruned, so the record repair is moot. The governance question remains open: nothing in `ki-accept`, the acceptance rubric or a hook states whether a passing audit is a precondition of acceptance.

Origin: first raised as branch-local `KI-HARNESS-GOV-108` ("Repair accepted review packet") on the abandoned Paperclip branch `paperclip/KNO-3-record-the-ki-paperclip-boundary-as-a-decision-record-and-activate-it`, commit `49adfa64`. The branch serial collides with a different record on `main`, so only the still-live question is captured again here. A patch copy is kept at `~/.local/state/ki/state-of-play/salvage/KNO-3/`. The cleanup that retired the branch is tracked in the `ki-arcadia-principal` checkpoint `+/_CHECKPOINTS/state-of-play.md`.

## Boundary

In scope: deciding whether a passing governing audit is a precondition of acceptance, which audits count as governing, and where the precondition lives - in `ki-accept`, in a hook, or in the acceptance rubric.

Out of scope: reopening what any accepted record delivered, and repairing pruned records.

## Discussion

### Why this is a governance question

Acceptance is the human-approved closure step. If it can close a record that its own audits reject, then either the audits are advisory at that boundary or the acceptance step is missing a check; the estate should choose one deliberately.

### Open questions

- Should a failing audit block acceptance outright, or require an explicit recorded waiver?
- Do findings that predate the change under review count against its acceptance?
