---
id: KI-HARNESS-GOV-067
area: GOV
title: Expand Housekeeping Coverage
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-15T05:31:18Z
updated_at: 2026-09-15T05:31:18Z
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

- [ ] Extend housekeeping with an optional commit threshold and verified reviewed-revision anchor, a read-only due evaluator, and boundary tests.
- [ ] Align spawning and acceptance instructions with the owner contract without weakening active-run or approval guards.
- [ ] Consolidate five local templates into four, broaden engineering and knowledge coverage, and make both radar reviews weekly.
- [ ] Align radar source cadence and freshness warnings with weekly review.
- [ ] Reconcile review evidence, preserve unresolved routes and recovery references, remove redundant committed reports, and repair live links.
- [ ] Regenerate affected publications, run focused and full verification, and record the review packet.

## Files touched

`skills/change-management/ki-work-housekeeping/`; housekeeping paragraphs in `ki-next` and `ki-accept`; cadence and freshness policy in `skills/governance/ki-model-radar/` and `ki-agentic-radar/`; an engineering scheduling clarification if needed; `docs/housekeeping/`; `docs/reviews/`; affected live links, this work record, and the issue ledger. No batch implementation files.

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

Retained review orientation explains what remains useful, where unresolved work lives, and how removed historical evidence is recovered. Existing process instructions consume the owner contract.

### Roadmap

This item owns the delivery and review evidence. Existing done review records remain unchanged; no new substantive review is claimed by this maintenance.

## Discussion

### Partition and retention

Partition by independent purpose and cost, not by each artifact type. Engineering and knowledge reviews can run independently when monthly cadence or accumulated change warrants them; each radar remains independently weekly. Lightweight working-area maintenance stays in existing process entry points and obeys specialist retention rather than creating another standing record.

### Counting and baseline

First-parent counting measures integrated repository change and avoids double-counting merged branch history. The accepted run records the full reviewed revision as the next count anchor. A missing, shallow, or divergent history cannot prove the threshold has not been reached; independently due calendar work remains visible. Existing narrower reviews may seed an anchor only through their retained evidence, with the expanded scope disclosed.
