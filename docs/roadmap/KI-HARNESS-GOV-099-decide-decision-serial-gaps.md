---
id: KI-HARNESS-GOV-099
area: GOV
title: Decide decision serial gaps
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T12:39:00Z
updated_at: 2026-09-26T12:39:00Z
---

# KI-HARNESS-GOV-099: Decide decision serial gaps

## Goal

`ki-decision-records` states plainly whether a serial run may contain a gap, so that a tool checking contiguity is either enforcing a rule or manufacturing noise.

## Context

Raised by `apps-observatory` on 2026-09-25 under `KI-OBS-VIS-004`, which owns the instance. The Decision Records standard requires serials contiguous from `001` per prefix within a scope. That repository built an estate-wide viewer over the records and derived a check from that sentence: a break in a prefix-and-scope run is reported as a structural defect.

Across the registered estate the check currently fires nowhere — 184 records in 28 repositories, no gaps — so the question is open rather than pressing. But the viewer is now the only thing anywhere that enforces the sentence, and it enforces it as written without knowing whether it was meant that strictly.

The question the standard does not answer: what happens when a record is retired. If a record is deleted or moved out of a collection, either the run keeps a hole, or the remaining records are renumbered. A hole contradicts the contiguity requirement as written. Renumbering breaks every `decision_depends_on` naming the moved identifier, and breaks every external reference — commit messages, roadmap records, prose — since the identifier is the record's only durable name.

## Boundary

In scope: whether `ki-decision-records` permits a gap, forbids one, or requires a specific retirement procedure; and consequently whether a contiguity check belongs in `ki repo audit --skill ki-decision-records` rather than in a viewer.

Out of scope: `KI-OBS-VIS-004`, which will follow whatever this decides; and the record format's other fields.

## Discussion

Three answers are available and they are not equally good.

**Gaps are forbidden and retirement means renumbering.** Consistent with the sentence as written, and wrong on reflection: an identifier that can be reassigned is not an identifier. `SDR-KI-FOO-004` meaning one decision this year and a different one next year makes every reference to it a dangling pointer that still resolves, which is worse than one that fails.

**Gaps are permitted, and contiguity applies only to issuance.** The rule becomes "allocate the next serial above the high-water mark, never reuse", which is what `_ISSUES.md` already does for roadmap items in this repository. This is almost certainly the intended meaning, and if so the viewer's check should be deleted rather than moved, because a hole carries no information — you cannot tell a retired record from a skipped allocation.

**Gaps are permitted but must be accounted for.** A retired record leaves a tombstone, and contiguity is checked against records-plus-tombstones. This preserves both the identifier and the detectability of an accidental skip, at the cost of a new artefact the standard does not currently have and would have to specify.

The second is the cheapest and most likely correct; the third is the only one under which a contiguity check is worth running at all. Either way the check does not belong where it currently lives. Whether a single repository's records conform to the format is `ki repo audit --skill ki-decision-records`' job by that skill's own boundary, and a viewer that enforces a format rule nothing else enforces will quietly become the specification.

- `KI-OBS-VIS-004` in `apps-observatory` owns the check as built. This record owns the question, because `ki-decision-records` lives here and that repository cannot answer it.
