---
id: KI-HARNESS-HK-001
title: Engineering alignment review
status: active
cadence: P1M
last-run: 2026-09-18
commit-threshold: 100
last-run-ref: 216523fde3d5353aaa13a1379de460af53dc491a
grace: P7D
spawn-policy: when-due
spawn-horizon: now
active-run: null
---

# Engineering alignment review

## Goal

Keep the repository's code, tests, skills, and mechanical governance aligned with their accepted contracts while identifying worthwhile reductions in maintenance cost.

## Procedure

1. Bound the review to this repository, its applicable standards, and changes since the previous reviewed revision. Use the monthly or 100-first-parent-commit trigger, whichever comes first; do not treat the trigger as a finding.
2. Run relevant mechanical checks once, then review changed module boundaries, naming, ownership, duplication, public behaviour, and contract-level test coverage through `ki-engineering`. Inspect unchanged neighbours only where needed to understand those changes.
3. Where skills are present, review cross-skill consistency, source freshness, generated publication parity, repeated mechanical checks, and assisted-outcome evidence through `ki-skills`. Ordinary engineering repositories need not acquire skills merely to use this review pattern.
4. Classify each material issue as retained judgment, better prepared evidence, bounded automation, code alignment, or separately owned work. Record evidence, affected owner, expected value, and safety boundary; deduplicate follow-ups through `ki-next`.
5. Keep the review separate from remediation. Do not silently change implementation, skills, configuration, runtime state, or another repository.

## Successful-run evidence

The linked run records inspected revision and scope, checks and their limits, concrete code and governance findings or an evidenced no-change result, and routed follow-ups. It records the successful completion date and full reviewed commit for acceptance to advance the schedule. Missing effectiveness or runtime evidence is unavailable, not a passing score.

The carried-forward date comes from the accepted [mechanical-governance review](https://github.com/knowledgeislands/ki-agentic-harness/blob/d3b18f1c9d67a96b58017ffa1675df90e489baf3/docs/roadmap/KI-HARNESS-REV-004-review-mechanical-governance.md). That earlier review covered the narrower mechanical-governance scope; it is not retrospective evidence of full engineering alignment.

The recorded historical baseline does not resolve in the local Git object database. Commit-volume evidence is therefore unavailable until an accepted run supplies a verified reviewed revision; calendar scheduling remains active. Do not substitute the current HEAD or infer a baseline from the date.

## Obsolescence

Retire this template only when an accepted replacement covers both repository code alignment and applicable governance maintenance without duplicating review obligations.
