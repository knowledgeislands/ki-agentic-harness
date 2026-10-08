---
id: KI-HARNESS-GOV-099
area: GOV
title: Decide decision serial gaps
kind: decide
purpose: upkeep
initiative: platform-foundations
component: governance
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 083750846f738b1b115796b483e879a847d6c94d
created_at: 2026-09-26T12:39:00Z
updated_at: 2026-10-08T13:13:12Z
---

# KI-HARNESS-GOV-099: Decide decision serial gaps

## Goal

`ki-decision-records` states plainly whether a serial run may contain a gap, so that a tool checking contiguity is either enforcing a rule or manufacturing noise.

## Context

Raised by `apps-observatory` on 2026-09-25 under `KI-OBS-VIS-004`, which owns the instance. The Decision Records standard requires serials contiguous from `001` per prefix within a scope. That repository built an estate-wide viewer over the records and derived a check from that sentence: a break in a prefix-and-scope run is reported as a structural defect.

Across the registered estate the check currently fires nowhere - 184 records in 28 repositories, no gaps - so the question is open rather than pressing. But the viewer is now the only thing anywhere that enforces the sentence, and it enforces it as written without knowing whether it was meant that strictly.

The question the standard does not answer: what happens when a record is retired. If a record is deleted or moved out of a collection, either the run keeps a hole, or the remaining records are renumbered. A hole contradicts the contiguity requirement as written. Renumbering breaks every `decision_depends_on` naming the moved identifier, and breaks every external reference - commit messages, roadmap records, prose - since the identifier is the record's only durable name.

## Boundary

In scope: the `ki-decision-records` standard's serial rule, its reclassification and pending-record allocation consequences, retiring the contiguity criterion `FILENAME-3` with its evidence and tests, and one Decision Record stating the rule.

Out of scope: `KI-OBS-VIS-004` in `apps-observatory`, which will follow this decision under its own authority; the record format's other fields; the `ROOT` check that the first index entry is the collection's adopting `GDR-...-001`, which concerns the adopting record rather than contiguity; tombstones or any other retirement artefact; and renumbering or otherwise touching existing records in any repository.

## Current state

Verified on `main` at `19651664`. `standards-decision-records.md:28` says serials in each prefix+scope series "start at `001` and are contiguous - no gaps, whatever the cause", and that a **reclassified** record leaves no vacancy: the old series renumbers and every citation is swept. It also carries a shared-record mirror exception that exists only for the "serial-continuity calculation". `FILENAME-3` [M, `WARN`] "Contiguous serial series" (`scripts/rubric/items/filename.ts:98`-`:125`) reports missing serials from `serialGaps`, computed in `scripts/rubric/contexts/decision-records.ts:301`-`:313` and consumed at `:531`; tests pin it at `scripts/rubric/contexts/decision-records.test.ts:346`-`:362` and list it at `scripts/rubric/items/index.test.ts:41`. The latest Decision Record in this repository's `SKILLS` series is `ADR-KI-HARNESS-SKILLS-015`.

## Steps

- [x] Write the next free `ADR-KI-HARNESS-SKILLS-NNN` (expected `018`) under `docs/decisions/`, "Decision-record serials may contain gaps", using `ki-decision-records`: serials are issued in ascending order from `001` and never reused; pruning, reclassification and failed or abandoned reservations leave gaps; contiguity is not an audit criterion. Add it to `docs/decisions/README.md`.
- [x] Rewrite the `NNN` bullet in `standards-decision-records.md`: issuance starts at `001` and each new serial is one greater than the highest ever issued in its series; an issued serial is never reused or reassigned; gaps are permitted and carry no meaning; contiguity is not an audit criterion. A pending `XXX` record takes the next serial above that high-water mark.
- [x] Rewrite the reclassification sentence in the same bullet: the record takes the next serial in its new series, its old serial is left vacant and never reused, and nothing is renumbered. Remove the continuity-only clause of the shared-record mirror exception, keeping any wording that still governs uniqueness.
- [x] Remove `FILENAME-3` from `scripts/rubric/items/filename.ts`, the `serialGaps` computation and field from `scripts/rubric/contexts/decision-records.ts`, and the `FILENAME-3` tests and code-list entry; retire the code rather than reuse it.
- [x] Add a test that a collection with a gap in a series (for example `ADR-X-001` and `ADR-X-003`) produces no finding from any `FILENAME` item.
- [x] Regenerate `references/rubric.md` with `ki dev skill rubric ki-decision-records`.
- [x] Raise a trade to `apps-observatory` so `KI-OBS-VIS-004` deletes its serial-contiguity check; a follow-on, not an acceptance criterion here. Not raised: the `ki-trades` hold on new trades applies, so it is carried as an outstanding concern.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-SKILLS-018-decision-record-serials-may-contain-gaps.md` (new; `016` and `017` are taken, the latter by `KI-HARNESS-GOV-117` (done), so `018` unless another record lands first)
- `docs/decisions/README.md`
- `skills/governance/ki-decision-records/references/standards-decision-records.md`
- `skills/governance/ki-decision-records/scripts/rubric/items/filename.ts`
- `skills/governance/ki-decision-records/scripts/rubric/contexts/decision-records.ts`
- `skills/governance/ki-decision-records/scripts/rubric/contexts/decision-records.test.ts`
- `skills/governance/ki-decision-records/scripts/rubric/items/index.test.ts`
- `skills/governance/ki-decision-records/references/rubric.md`

## Verify

1. `standards-decision-records.md` states explicitly that gaps are permitted, that serials are never reused, and that contiguity is not an audit criterion; no sentence in it still requires contiguity or renumbering.
2. `grep -rn -i "contiguous\|serialGaps\|FILENAME-3" skills/governance/ki-decision-records` returns nothing.
3. A fixture collection with a series gap audits with no `FILENAME` finding.
4. The new Decision Record passes `ki repo audit --skill ki-decision-records` and is indexed.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-decision-records --progress never
```

## Dependencies / blocks

None. Serial sequencing: `KI-HARNESS-GOV-117` (done) took `ADR-KI-HARNESS-SKILLS-017`; this record takes the next free serial. Follow-on, non-blocking: tell `apps-observatory` the outcome so `KI-OBS-VIS-004` can delete its contiguity check; that repository owns the change.

## Documentation impact

### Decision Records

One new `ADR-KI-HARNESS-SKILLS` record, because the change reverses a normative rule (renumbering on reclassification) that downstream repositories may have followed.

### Specifications

`standards-decision-records.md`, as above.

### Guides

None.

### Roadmap

None.

## Review

### Delivered

- The Decision Records standard now issues serials in ascending order from `001`, never reuses or reassigns an issued serial, permits gaps, and states that contiguity is not an audit criterion. A pending `XXX` record takes the next serial above the high-water mark.
- A reclassified record takes the next serial in its new series and leaves its old serial vacant; nothing is renumbered. The shared-record mirror's continuity-only exclusion is gone, and a mirror's serial still counts towards uniqueness.
- `FILENAME-3` and its `serialGaps` evidence are removed and the code is retired. A test pins that a series with a gap produces no `FILENAME` finding.
- `ADR-KI-HARNESS-SKILLS-018` records the rule and is indexed.

### Change Summary

- `docs/decisions/ADR-KI-HARNESS-SKILLS-018-decision-record-serials-may-contain-gaps.md` (new) and `docs/decisions/README.md`.
- `skills/governance/ki-decision-records/`: `references/standards-decision-records.md`, generated `references/rubric.md`, `scripts/rubric/contexts/decision-records.ts` and its test, and `scripts/rubric/items/filename.ts`, `index-records.ts`, `depends.ts` and `index.test.ts`.
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`: criterion counts fall by one mechanical diagnostic criterion.

### Verification

1. The standard states that gaps are permitted, serials are never reused, and contiguity is not an audit criterion; no sentence requires contiguity or renumbering.
2. `grep -rn -i "contiguous\|serialGaps\|FILENAME-3" skills/governance/ki-decision-records` returns nothing.
3. The new gap fixture (`ADR-EXAMPLE-001`, `ADR-EXAMPLE-003`) reports no `FILENAME` violation.
4. `bun run test` passes (1054 tests), `bunx tsc --noEmit` is clean, and `ki repo audit --skill ki-decision-records` passes with the new record indexed. `ki-skills` reports only its existing LONG-3 refresh warning.
5. `references/rubric.md` was rendered from the worktree's catalogue with the `tools-ki` renderer, which reproduces the primary checkout's committed publication byte for byte; `ki dev skill rubric --write` resolves the dev-linked primary checkout, not the worktree.

### Outstanding concerns

- The trade asking `apps-observatory` to delete its contiguity check under `KI-OBS-VIS-004` is not raised, because the `ki-trades` standard holds new trades until the territory model is settled. It needs raising, or recording directly in that repository, once the hold lifts.
- `INDEX-8` previously said a reveal-order violation is fixed by renumbering. That contradicted the never-reassigned rule, so its description and guidance, and the standard's matching sentence, now move the index entry to its serial position instead.
- `ki-specs` keeps its own requirement-serial gap check; requirement serials are a separate instrument and were out of scope.

### Post-change review

The change only removes a constraint and corrects wording that depended on it, so no existing collection gains a finding. Retiring rather than reusing `FILENAME-3` keeps old audit output unambiguous.

### Mini recap

Decision Record serials are now identifiers that are never reused: gaps are allowed, nothing is renumbered, and the contiguity check is gone.

## Discussion

Three answers are available and they are not equally good.

**Gaps are forbidden and retirement means renumbering.** Consistent with the sentence as written, and wrong on reflection: an identifier that can be reassigned is not an identifier. `SDR-KI-FOO-004` meaning one decision this year and a different one next year makes every reference to it a dangling pointer that still resolves, which is worse than one that fails.

**Gaps are permitted, and contiguity applies only to issuance.** The rule becomes "allocate the next serial above the high-water mark, never reuse", which is what `_ISSUES.md` already does for roadmap items in this repository. This is almost certainly the intended meaning, and if so the viewer's check should be deleted rather than moved, because a hole carries no information - you cannot tell a retired record from a skipped allocation.

**Gaps are permitted but must be accounted for.** A retired record leaves a tombstone, and contiguity is checked against records-plus-tombstones. This preserves both the identifier and the detectability of an accidental skip, at the cost of a new artefact the standard does not currently have and would have to specify.

The second is the cheapest and most likely correct; the third is the only one under which a contiguity check is worth running at all. Either way the check does not belong where it currently lives. Whether a single repository's records conform to the format is `ki repo audit --skill ki-decision-records`' job by that skill's own boundary, and a viewer that enforces a format rule nothing else enforces will quietly become the specification.

- `KI-OBS-VIS-004` in `apps-observatory` owns the check as built. This record owns the question, because `ki-decision-records` lives here and that repository cannot answer it.

### Decision

Decision-record serial gaps are permitted, since pruning and failed reservations leave gaps; contiguity is not an audit criterion, and the standard says so explicitly. Decided by the Fable reviewer under delegated autonomy, reversible.

Gaps are permitted. Pruning and failed reservations leave gaps, and so does reclassification, which no longer renumbers. Contiguity is not an audit criterion, and the standard says so explicitly. This is the second answer above; the tombstone answer is not taken, so no contiguity check survives anywhere.
