---
id: GDR-KI-HARNESS-005
title: "Cross-repository trade routes"
date: 2026-08-06
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
decision_type: governance
decision_depends_on: ["GDR-KI-FUNDAMENTALS-001"]
---

# GDR-KI-HARNESS-005: Cross-repository trade routes

## Context

Knowledge Islands repositories have generic inbound and outbound working areas, but those areas do not establish trusted typed routes, stable identities, immutable sender evidence, or safe release signals. A sender may also expose an evolving proposal before submission, then choose to observe receipt, a decision, or completion of linked receiver work.

A repository remains the sole authority for its roadmap, priority, implementation, acceptance, and knowledge state. Local registered-repository visibility can support review of another repository's files, but filesystem visibility alone does not prove that either repository consents to exchange trades.

## Decision

We adopt `ki-trades` as the portable governance owner for optional cross-repository trades. Each repository declares its canonical home through `ki-repo` and its typed export and import routes through `ki-trades`. A sender-declared export permits local preparation and submission; receipt additionally requires one registered receiver with the matching typed import. Missing reciprocity is pending, while malformed or ambiguous configuration is never trusted.

Each trade has one concise `TRD-` identity. A sender may commit a mutable preparation that is silently observable through Git but creates no receiver state. Submission atomically moves that identity to its outbound path and freezes the raw sender projection. The receiver creates an inbound copy only on an active route and may add only receiver-local receipt, review, decision, and linkage evidence. Receipt means delivery, not acceptance. Directly applied work requires a verified local commit; adopted work links to a local item whose lifecycle owns completion.

Every preparation and submission declares its itemized observation policy. Knowledge permits `unattended` or `receipt`; work permits `unattended`, `receipt`, `decision`, or `completion`. `unattended` requests no response but still remains until explicit receipt is observable, so it shares `receipt`'s release boundary and grants no receiver authority. The policy grants no deadline, priority, delivery guarantee, execution, acceptance, publication, or completion authority. The observation declaration is mandatory on every trade record.

The receiver chooses between bounded direct application and separately confirmed local work or knowledge retention. The sender releases only its outbound copy when its observation condition is satisfied; the receiver prunes only after observing eligible release. Neither preparation visibility, receipt, silence, nor elapsed time implies review or a decision.

## Current policy

Knowledge is a delivery handoff: it uses `observation: receipt`, and the sender may release its submitted projection once receipt is observable.

Work uses either `observation: decision`, which waits for a terminal receiver disposition, or `observation: completion`, which waits for selected-adapter, owner-valid completion evidence.

`retained` is the knowledge form of keeping the delivered material locally.

`applied` is the work form of performing bounded work directly.

`adopted` remains distinct: the receiver created a named local follow-on work record, but has not thereby completed it.

The sender has mutable `preparing` and immutable `submitted` records; “waiting” is derived from an unsatisfied policy, not stored as a phase.

Until a selected adapter supplies owner-valid completion evidence, completion fails closed: `applied`, `adopted`, path scans, and absent records do not prove it.

Knowledge routes may additionally declare receiver-owned subtype vocabularies and exact reciprocal standing grants. Standing intake is knowledge-only, default-deny, and subordinate to an active ordinary route. It permits direct receiver-local capture only with a marked `STI-*` provenance block tied to an exact source commit and capture location. Itemized knowledge may use the same subtype only as classification. Revocation blocks new standing capture while preserving historical receiver-owned evidence. Standing intake and Agora membership grant no peer write, publication, roadmap, priority, implementation, acceptance, or completion authority. Any future automatic transport, application, or publication requires a separate authority contract for scheduling, idempotency, isolation, recovery, evidence, review, and revocation; neither standing intake nor `unattended` supplies it.

## Consequences

Repositories gain a reviewable typed-trade protocol without cross-repository write authority or automatic transfer semantics. Preparations use Git history rather than a dialogue log; a receiver may retain a local observation cursor, but observation remains invisible to the sender. Altered sender bytes, peer-side decision writes, and premature release become detectable evidence rather than inferred acceptance.

The initial capability depends on mutually visible repositories in the local KI registry. Remote interchange remains outside this authority model: any later transport may relay permitted records and receiver decisions, but it cannot decide a disposition or mutate either repository's roadmap. The direct-super-trust pilot remains historical bootstrap evidence rather than a compatibility path.

## References

- [GDR-KI-FUNDAMENTALS-001](GDR-KI-FUNDAMENTALS-001-knowledge-islands-ecosystem-fundamentals.md) — the repository authority and choreography model this decision preserves.
