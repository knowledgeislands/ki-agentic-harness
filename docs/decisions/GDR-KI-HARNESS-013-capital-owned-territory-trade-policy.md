---
id: GDR-KI-HARNESS-013
title: Capital-owned territory trade policy
date: 2026-10-06
status: current
decision_type: governance
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
decision_depends_on: ['GDR-KI-FUNDAMENTALS-001', 'GDR-KI-HARNESS-006']
---

# GDR-KI-HARNESS-013: Capital-owned territory trade policy

## Context

Knowledge Islands repositories have generic inbound and outbound working areas, but those areas do not establish trusted typed routes, stable identities, immutable sender evidence, or safe release signals. A repository remains the sole authority for its roadmap, priority, implementation, acceptance, and knowledge state, and filesystem visibility of another registered checkout does not prove consent to exchange.

Repositories belong to a territory governed by a Capital. Arcadia Principal's territorial classification and exchange decision, recorded as `KI-ARCADIA-GOV-016` in `knowledgeislands/ki-arcadia-principal`, places the authority to grant routes between territory members with the Capital rather than with each pair of members. Route and standing grants that are scattered across member configuration cannot be reviewed as one policy, and two members can disagree without either being wrong.

## Decision

`ki-trades` is the portable governance owner for optional cross-repository trades, and route authority lives in one territory trade policy owned by the Capital.

- **Territory.** Every repository declares its canonical home and its Capital through `ki-repo` (`repository` and the mandatory `capital`). A Capital names itself and lists its members in `[skills.ki-repo.territory]`.
- **Policy.** The Capital's `[skills.ki-trades.territory]` holds the knowledge subtype vocabulary, the channels that grant exact `(source, receiver, kind)` routes, and the standing grants that layer exact `(source, receiver, subtype)` knowledge intake onto a knowledge channel. Endpoints must be territory members; there are no wildcards, self-routes, or duplicate grants. A malformed or ambiguous policy fails closed and grants nothing.
- **Members.** A member's `[skills.ki-trades]` declares participation only, carrying at most the presentation-only `map_bonus`. Per-repository `routes` and `subtypes` are retired and fail without a transition. A member resolves its policy only through its own declared `capital`, so several territories may share one registry.
- **Activation.** A granted export permits sender-local preparation and submission. A route is active only when the peer is registered once, declares ki-trades, and names the same Capital. When the Capital is not checked out locally, route authority is reported as unverifiable rather than refused.
- **Records.** Each trade has one `TRD-` identity. A sender may commit a mutable preparation that is silently observable through Git but creates no receiver state; submission freezes the sender projection. The receiver creates an inbound copy only on an active route and adds only receiver-local receipt, review, decision, and linkage evidence. Receipt means delivery, not acceptance.
- **Observation and release.** Every record declares its itemized observation policy: knowledge uses `unattended` or `receipt`; work uses `unattended`, `receipt`, `decision`, or `completion`, and completion fails closed until a selected adapter supplies owner-valid evidence. The sender releases its outbound copy when the observation condition is satisfied, and the receiver prunes only after observing eligible release.
- **Standing intake.** Standing intake is knowledge-only, default-deny, and subordinate to an active ordinary route. Direct receiver-local capture requires a marked `STI-*` provenance block tied to an exact source commit and capture location. Removing a grant blocks new capture while preserving historical receiver-owned evidence.

## Consequences

The territory's routes become one reviewable policy that a Capital can sweep against every named island, and a route change becomes a proposal to the Capital accepted under its authority rather than a pair of local edits. The `ki-repo` audit fails a repository without a canonical `capital`, and fails a member that the policy names but that does not declare ki-trades; the `ki-trades` audit warns a participating member that no channel names.

No grant confers cross-repository write, publication, roadmap, priority, implementation, acceptance, or completion authority, and Agora membership confers no route. Any future automatic transport, application, or publication still requires a separate authority contract for scheduling, idempotency, isolation, recovery, evidence, review, and revocation.

The capability depends on the Capital and its members being visible in the local KI registry. Where a member's Capital is not checked out, the audit reports the member's record route authority as unverifiable instead of proving or refusing it. Retiring member route tables is immediate: repositories still declaring them fail until the declaration moves to the Capital's policy. The route-declaration model of GDR-KI-HARNESS-005 is archived.

## References

- [GDR-KI-FUNDAMENTALS-001](GDR-KI-FUNDAMENTALS-001-knowledge-islands-ecosystem-fundamentals.md) - the repository authority and choreography model this decision preserves.
- [GDR-KI-HARNESS-006](GDR-KI-HARNESS-006-owner-declared-agoras.md) - owner-declared Agoras, which select working sets but grant no route.
