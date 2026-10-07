---
id: KI-HARNESS-GOV-146
area: GOV
title: Gate acceptance on audits
kind: deliver
purpose: governance
initiative: platform-foundations
component: change-management
status: done
blocks: []
blocked_by: []
baseline_ref: 9888595c1b5d94fa49ae20a216aa5cc995691b3f
created_at: 2026-10-06T23:01:19Z
updated_at: 2026-10-07T21:05:02Z
---

# KI-HARNESS-GOV-146: Gate acceptance on audits

## Goal

The estate has a settled answer to whether a work record may be accepted as `done` while an audit that governs it fails, and that answer is enforced where acceptance happens.

## Context

`KI-HARNESS-GOV-101` reached `status: done` through the commit `chore(roadmap): accept KI-HARNESS-GOV-101` at `39a9b63e`. At that commit the record failed two governing audits: `ki repo audit --skill ki-work-roadmap` failed `ITEM-3` on the order of its `## Review` sub-sections, and `ki repo audit --skill ki-authoring` failed the Markdown gate with two `MD049` findings. Acceptance therefore did not require the governing audits to pass.

`KI-HARNESS-GOV-101` has since been accepted and pruned, so the record repair is moot. The governance question remains open: nothing in `ki-accept`, the acceptance rubric or a hook states whether a passing audit is a precondition of acceptance.

Origin: first raised as branch-local `KI-HARNESS-GOV-108` ("Repair accepted review packet") on the abandoned Paperclip branch `paperclip/KNO-3-record-the-ki-paperclip-boundary-as-a-decision-record-and-activate-it`, commit `49adfa64`. The branch serial collides with a different record on `main`, so only the still-live question is captured again here. A patch copy is kept at `~/.local/state/ki/state-of-play/salvage/KNO-3/`. The cleanup that retired the branch is tracked in the `ki-arcadia-principal` checkpoint `+/_CHECKPOINTS/state-of-play.md`.

## Boundary

In scope: state in `ki-accept` that delivery acceptance requires the record's governing audits to pass at the state being accepted, name which audits govern, and say what happens when one fails.

Out of scope: reopening what any accepted record delivered, and repairing pruned records; a hook or CLI enforcement of the rule; a change to the pure `acceptance-cycle.ts` model, whose closure inputs do not carry audit results; and cancellation, which has no delivery evidence to audit.

## Current state

`skills/change-management/ki-accept/references/standards-acceptance.md` `## 1. Resolve the record and closure evidence` step 5 checks status, Steps, delivery evidence and the six-heading `## Review` packet, but no audit result. `SKILL.md` `## What this skill does` step 1 likewise names the packet only. `ki-implement` requires its stated verification before `awaiting-review`, but nothing re-checks it at closure, which is how `KI-HARNESS-GOV-101` closed while failing `ITEM-3` and `MD049`.

## Steps

- [x] In `standards-acceptance.md` step 5, add that delivery acceptance requires the governing audits to pass on the record as it will be committed: the selected adapter's record audit (`ki-work-roadmap` for `roadmap`, `ki-repo-kb-streams` for `kb-streams`), `ki-authoring`, and every audit the record's own `Verify` names, judged by that section's stated criterion. A failure blocks closure; there is no waiver. Fix it and re-run, or return the record to `in-progress` under a failed review.
- [x] In `SKILL.md` step 1, add that delivery closure also requires its governing audits to pass.
- [x] Run the verification below.

## Files touched

- `skills/change-management/ki-accept/SKILL.md`
- `skills/change-management/ki-accept/references/standards-acceptance.md`

## Verify

1. `standards-acceptance.md` names the governing audits, makes their pass a precondition of delivery closure with no waiver, and routes a failure to repair or a failed review.
2. `SKILL.md` carries the same precondition in one clause.
3. No script, test or generated file changes.
4. Added text uses British English and ASCII hyphens only; focused audits report no new finding.
5. `bun run test` and `bunx tsc --noEmit` pass.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-skills --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

`blocked_by` and `blocks` empty by intent.

## Documentation impact

### Decision Records

None. The rule is a precondition in the acceptance procedure, which `ki-accept` owns; no Decision Record owns acceptance gating.

### Specifications

None.

### Guides

None.

### Roadmap

None.

## Review

### Delivered

The acceptance precondition in `ki-accept`, within the approved boundary: governing audits must pass before delivery closure, with no waiver. No hook, CLI, model, test or generated file changed, and cancellation is untouched. Baseline `9888595c1b5d94fa49ae20a216aa5cc995691b3f`; the delivery is the commit that carries this packet.

### Change Summary

- `skills/change-management/ki-accept/references/standards-acceptance.md`, step 5: delivery closure confirms that the governing audits pass on the record as it will be committed - the selected adapter's record audit (`ki-work-roadmap` or `ki-repo-kb-streams`), `ki-authoring`, and every audit the record's `Verify` names, judged by its stated criterion. A failure blocks closure; repair and re-run, or return the record to `in-progress` under a failed review.
- `skills/change-management/ki-accept/SKILL.md`, step 1: delivery closure requires passing governing audits alongside the review packet.
- Planning deviation: the plan's verification block first named `ki repo audit --skill ki-accept`, which the CLI rejects because `ki-accept` is not a declared repository skill; it was dropped before delivery, and `ki-skills` covers the skill.

### Verification

- `ki repo audit --skill ki-skills --progress never`: FAIL=0, one pre-existing `LONG-3` refresh-cadence warning.
- `ki repo audit --skill ki-authoring --progress never`: PASS.
- `ki repo audit --skill ki-work-roadmap --progress never`: PASS on this record.
- `bun run test`: 1007 pass, 0 fail. `bunx tsc --noEmit`: clean.
- Full `ki repo audit` in the worktree: no new finding. Its only failures are `REPO-REG-1` and `RUNTIMES-2`, which arise because the temporary worktree path is not registered; the registered primary checkout reports FAIL=0.

### Outstanding concerns

None. A mechanical gate (hook or CLI) remains a possible later record, as the Decision notes.

### Post-change review

The estate now has a settled, stated answer: a record whose governing audits fail cannot be accepted, which closes the gap that let `KI-HARNESS-GOV-101` reach `done` while failing `ITEM-3` and `MD049`. Scope held to two prose edits. No regression risk to code. Ready for acceptance.

### Mini recap

Delivered the acceptance precondition in `ki-accept`; all gates pass. This record was itself closed under the new rule.

## Done

Accepted 2026-10-07 under Kris's standing grant in the state-of-play design decisions (Decisions 12 and 17: "Delivered records count as done ... and are pruned once verified"; Decision 19 authorises continuous delivery of this record), on the review packet above. The governing audits (`ki-work-roadmap`, `ki-authoring`, `ki-skills`) pass on this record as committed.

## Discussion

### Why this is a governance question

Acceptance is the human-approved closure step. If it can close a record that its own audits reject, then either the audits are advisory at that boundary or the acceptance step is missing a check; the estate should choose one deliberately.

### Decision

Governing audits must pass before delivery acceptance, stated in `ki-accept`. Adopted from the approved focus plan in the state-of-play design (Decision 19, 2026-10-07: deliver the remaining focus records), whose recommended scope for this record is "State in ki-accept that the governing audits must pass before acceptance."

- **Block or waive:** a failing governing audit blocks outright. A waiver would make the audits advisory at the one boundary where they matter.
- **Pre-existing findings:** the record-format audits run over the record itself, so any failure there is the record's own. A repository-wide audit governs only through the record's `Verify`, whose stated criterion (for example "no new finding") already says how pre-existing findings count.
- **Where it lives:** in the `ki-accept` procedure, because acceptance happens there. A hook or CLI gate stays a possible later record.
