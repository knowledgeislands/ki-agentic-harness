---
id: KI-HARNESS-GOV-067
area: GOV
title: Expand Housekeeping Coverage
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: b333daaa3356e827429104d7b7783c0e939e8e76
created_at: 2026-09-15T05:31:18Z
updated_at: 2026-09-15T11:57:29Z
---

# Expand Housekeeping Coverage

## Goal

Keep repository engineering, knowledge, and radar evidence aligned through a small set of independently runnable reviews, with maintenance becoming due when either time or accumulated change warrants it.

## Context

The user approved four review purposes: engineering alignment; knowledge reconciliation; a combined weekly model review; and weekly agentic radar review. They also approved bounded cleanup of redundant `docs/reviews` reports after preserving unresolved findings and useful evidence. The existing housekeeping contract supports only calendar cadence. Five templates currently separate model signals from monthly model reassessment; mechanical governance and decision reconciliation omit broader code and document alignment.

## Boundary

This change affects the Harness's housekeeping contract, process consumers, local templates, radar freshness policy, and review archive. It does not run the substantive reviews, change radar recommendations, mutate consumer repositories or runtime state, prune roadmap records, accept this delivery, or push. Routine working-area cleanup remains under each existing owner's retention guards; no generic deletion policy is introduced.

## Current state

The repository is clean at `8be51b28a44f9df5c5621dbf8d3dfbbe213c2904`; work, roadmap, and housekeeping audits pass. Prior concurrent batch-authority work has been committed and is outside scope. REV-004 and REV-005 retain accepted evidence for the two existing monthly templates. Old review folders include unresolved routed work and historical calibration evidence which must survive cleanup.

## Steps

- [x] Extend housekeeping with an optional commit threshold and verified reviewed-revision anchor, a read-only due evaluator, and boundary tests.
- [x] Align spawning and acceptance instructions with the owner contract without weakening active-run or approval guards.
- [x] Consolidate five local templates into four, broaden engineering and knowledge coverage, and make both radar reviews weekly.
- [x] Align radar source cadence and freshness warnings with weekly review.
- [x] Finish the exact report-retirement decision. Retire the stale REV-001 working evidence after confirming its live follow-ups have canonical owners and its committed archive remains recoverable.
- [x] Regenerate affected publications, run focused and full verification, and record the review packet.

## Files touched

`skills/change-management/ki-work-housekeeping/`; housekeeping paragraphs in `ki-next` and `ki-accept`; cadence and freshness policy in `skills/governance/ki-model-radar/` and `ki-agentic-radar/`; an engineering scheduling clarification if needed; `docs/housekeeping/`; `docs/reviews/`; affected live links, this work record, and the issue ledger. The source-loaded remediation-inventory test is updated only for the added HOUSE-2 criterion. No batch implementation files.

## Verify

Focused housekeeping and radar tests; real temporary-Git schedule fixtures including exact threshold, merge counting, missing or divergent anchors, paused or active runs, and no-write behaviour; TypeScript; full test suite; housekeeping, skills, authoring, roadmap, and delegation audits; generated rubric parity; explicit review-retention mapping and local-link checks.

## Dependencies / blocks

None. The user approved the partition and implementation. Calendar cadence remains valid without commit-trigger fields; consumers do not require migration to opt in.

## Delegation

### Locked decisions

Use optional `commit-threshold` and `last-run-ref` fields, with 100 as this repository's selected threshold rather than a global default. Count first-parent integration commits since the last successfully reviewed full commit, not every branch commit. Either elapsed calendar cadence or the threshold may make a template due. A reached commit threshold needs no additional calendar grace. Unknown Git evidence is not zero or a clean result. Preserve the existing active-run, paused, manual-spawn, and human acceptance boundaries. Baselines must be evidence-backed, never guessed from a date. Combine model reviews under HK-003 and retire HK-004; preserve HK-005 identity.

### Escalate

Stop for an unsafe or ambiguous deletion, lost unresolved finding, required cross-repository write, new authority, or a material contract choice outside these decisions.

### Worker: housekeeping-trigger

- **Deliverable:** Commit-trigger owner contract, read-only evaluator, hosted diagnostics, focused tests, and spawning/acceptance guidance.
- **Inputs:** This plan, existing housekeeping schema and tests, ki-next and ki-accept housekeeping paragraphs.
- **Scope:** `skills/change-management/ki-work-housekeeping/`; housekeeping-only edits in `ki-next` and `ki-accept`.
- **Authority:** Edit and test these sources; no staging, commit, cleanup, external writes, or changes to other skills.
- **Isolation:** Exclusive paths in the shared tree; track every touched file.
- **Verify:** Focused tests and Biome; coordinator checks TypeScript, full suite, audits, and publication parity.
- **Return:** Exact changed paths, API semantics, passing tests, unresolved issues.
- **Checkpoint:** Stop after a tested coherent implementation; do not generate live housekeeping runs.

### Worker: weekly-radars

- **Deliverable:** Both radar owners consistently specify weekly refresh and nine-day freshness warning thresholds.
- **Inputs:** This plan, current radar standards, source cadence, implementations and tests.
- **Scope:** `skills/governance/ki-model-radar/` and `skills/governance/ki-agentic-radar/` only.
- **Authority:** Edit cadence, related wording and freshness checks/tests only; no new facts, snapshot review-date changes, network, staging, commit, or template edits.
- **Isolation:** Exclusive paths in the shared tree; track all touched files.
- **Verify:** Focused radar tests and Biome; coordinator validates generated rubric parity and full integration.
- **Return:** Exact changed paths, test outcomes, remaining monthly assumptions.
- **Checkpoint:** Stop when weekly policy and freshness behaviour agree.

## Documentation impact

### Decision Records

No new architectural owner or workflow is introduced. The existing housekeeping standard records optional change-volume scheduling and the evidence boundary; this record retains the approved local consolidation.

### Specifications

The housekeeping standard and executable checks gain the optional trigger contract. Radar standards retain evidence and movement gates while shortening review cadence.

### Guides

Review orientation explains the retained evidence and how removed historical evidence is recovered. Existing process instructions consume the owner contract.

### Roadmap

This item owns the delivery and review evidence. Existing done review records remain unchanged; no new substantive review is claimed by this maintenance.

## Review

### Delivered

Implemented the housekeeping and radar changes against immutable baseline `b333daaa3356e827429104d7b7783c0e939e8e76`. Five local templates become four independent obligations: monthly-or-100-commits engineering and knowledge reviews, and weekly model and agentic reviews. This is not evidence that any substantive review ran. Retired the stale REV-001 working evidence after the user confirmed it no longer had concrete use; its live follow-ups remain canonically owned and its historical evidence remains recoverable from Git.

### Summary of changes

The housekeeping owner now provides optional `commit-threshold` and `last-run-ref` metadata, a read-only first-parent schedule evaluator, schema validation, and HOUSE-2 diagnostics. Calendar and volume triggers are alternatives; manual, paused, active-run, and acceptance guards remain. Successful acceptance records the actual completion date and verified reviewed revision in one coherent closure/template commit. Both radar policies warn after nine days and retain their evidence and movement gates.

The combined HK-003 incorporates both signal and release reassessment; HK-004 is retired with its history preserved. HK-001 and HK-002 broaden existing purposes instead of multiplying records. Review navigation now distinguishes retained historical evidence from active work, removes obsolete progress duplication, and fixes an absent trade link. The detailed REV-001 reports are retired: FND-014 and OPS-002 remain the canonical live follow-ups, while two unverified historical observations were not promoted into new work merely to preserve stale review material.

### Verification

- Final `bun run test`: passed after review retirement.
- `bunx tsc --noEmit` and `bunx biome check`: passed.
- Trigger and acceptance focused suite: 22 tests and 104 assertions passed. Radar focused suite: 25 tests and 61 assertions passed.
- Housekeeping audit: no failures; two intentional HOUSE-2 warnings for missing historical anchors. Model radar, agentic radar, skills, authoring, roadmap, delegation, and harness audits passed.
- Post-retirement focused audits for `ki-repo`, `ki-authoring`, `ki-work-roadmap`, `ki-work-housekeeping`, and `ki-trades`: passed; the two intentional HOUSE-2 warnings remain.
- Three changed rubrics regenerated; scoped Biome, rumdl, and whitespace checks passed. Local Markdown targets throughout retained `docs/reviews` evidence resolve.
- The first full suite exposed the new criterion's expected inventory-count delta; that assertion was updated and the full suite passed. Independent review found initial-run grace, future-completion-date, and atomic-closure edge cases, all corrected with focused regression tests.

### Outstanding concerns

No delivery concern remains. The prior accepted REV-004 and REV-005 records cite a baseline unavailable in this checkout's non-shallow Git object database. The broadened templates retain their historical dates and disclose narrower prior scope, but intentionally leave `last-run-ref: null`. Monthly scheduling remains active; volume is unknown until a successful review supplies a verified revision. No current HEAD, date-derived guess, or historical implementation baseline was substituted.

### Post-change review

Independent file-bounded review confirmed that model consolidation retains evidence, evaluated-unit, counter-evidence, and human movement gates. Disposable-Git scenarios verified exact thresholds, merge counting, missing-history handling, and manual/paused/reserved guards. The coordinator integrated and corrected the reported edge cases. Unrelated work advanced HEAD and pruned older records during this delivery; historical review links were pinned to retained commits, and no unrelated file is included in the commit.

### Mini recap

The requested four-review structure, optional change-volume scheduling, weekly radar cadence, and historical-review retirement are implemented and verified. Routine working-area maintenance remains under existing specialist guards; no new generic retention policy, substantive review, external write, acceptance, roadmap prune, or push occurred.

## Discussion

### Historical review retirement

REV-001 was bounded working evidence, not a standing standard or current assurance claim. Its live remote-adapter and memory follow-ups remain in FND-014 and OPS-002. The old host-evidence and user-MCP observations were never verified into current work, and the user confirmed the review no longer had concrete use, so this delivery does not manufacture new roadmap items from them. The exact committed review remains recoverable from Git at `b333daaa3356e827429104d7b7783c0e939e8e76`.

### Partition and retention

Partition by independent purpose and cost, not by each artifact type. Engineering and knowledge reviews can run independently when monthly cadence or accumulated change warrants them; each radar remains independently weekly. Lightweight working-area maintenance stays in existing process entry points and obeys specialist retention rather than creating another standing record.

### Counting and baseline

First-parent counting measures integrated repository change and avoids double-counting merged branch history. The accepted run records the full reviewed revision as the next count anchor. A missing, shallow, or divergent history cannot prove the threshold has not been reached; independently due calendar work remains visible. Existing narrower reviews may seed an anchor only through their retained evidence, with the expanded scope disclosed.

### Successful-run evidence migration

The former calendar policy advanced to the scheduled date. New acceptance deliberately advances to the evidenced actual successful completion date, so a late review is measured from when it finished. Existing dates are not backfilled. Missing historic Git anchors remain visible warnings; acquiring a usable anchor requires a real evidenced review, not a reset disguised as completion.
