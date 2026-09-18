---
id: KI-HARNESS-HK-002
title: Knowledge reconciliation
status: active
cadence: P1M
last-run: 2026-09-09
commit-threshold: 100
last-run-ref: null
grace: P7D
spawn-policy: when-due
spawn-horizon: now
active-run: KI-HARNESS-REV-009
---

# Knowledge reconciliation

## Goal

Keep decisions, specifications, guides, source references, and retained review evidence consistent with the implemented system and discoverable under their correct owners.

## Procedure

1. Bound the review to this repository's current knowledge collections and material changes since the previous reviewed revision. Use the monthly or 100-first-parent-commit trigger, whichever comes first.
2. Reconcile current Decision Record authority, status, indexes, predecessor and successor links through `ki-decision-records`; compare accepted Specifications with implemented behaviour through `ki-specs`, and operating instructions with actual workflows through `ki-guides`.
3. Check relevant skill standards, source lists, and README entry points for contradictions, stale claims, broken references, and duplicated authority. Follow each source owner's refresh procedure for volatile facts; report unavailable evidence explicitly rather than rewriting history.
4. Examine retained `docs/reviews` evidence: ensure unresolved findings have an owner, move independently durable conclusions to their approved homes, and propose exact redundant-report cleanup through `ki-repo`'s review-retention procedure. Historical records and trades are evidence, not current policy.
5. Check that temporary inputs and outputs remain useful and correctly routed. Routine `ki-next` and `ki-recap` batch maintenance follows `ki-batch`; other areas keep their specialist retention and delivery guards. Do not infer a blanket expiry or deletion authority.
6. Deduplicate and route material corrections through `ki-next`. The review itself does not rewrite or prune decisions, work items, source records, or another repository.

## Successful-run evidence

The linked run records inspected collections and revision, coverage gaps, contradictions or an evidenced no-change result, source freshness, preserved reasoning, proposed dispositions, and canonical follow-up owners. It records the successful completion date and full reviewed commit for acceptance to advance the schedule.

The carried-forward date comes from the accepted [decision reconciliation](https://github.com/knowledgeislands/ki-agentic-harness/blob/d3b18f1c9d67a96b58017ffa1675df90e489baf3/docs/roadmap/KI-HARNESS-REV-005-reconcile-decision-records.md). That review covered the narrower decision collection, not all documentation and source material.

The recorded historical baseline does not resolve in the local Git object database. Commit-volume evidence is therefore unavailable until an accepted run supplies a verified reviewed revision; calendar scheduling remains active. Do not substitute the current HEAD or infer a baseline from the date.

## Obsolescence

Retire this template only when an accepted replacement keeps current knowledge aligned and discoverable while preserving unresolved findings and historical evidence.
