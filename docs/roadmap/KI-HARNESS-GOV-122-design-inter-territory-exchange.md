---
id: KI-HARNESS-GOV-122
area: GOV
title: Design inter-territory exchange
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-01T04:23:19Z
updated_at: 2026-10-05T07:54:24Z
---

# KI-HARNESS-GOV-122: Design inter-territory exchange

## Goal

Separate territory-internal work trades and knowledge routing from deliberate exchange between territories, so an island can operate without declaring unavailable external repositories in its public `.ki.toml`.

## Context

The current `ki-trades` contract declares partner-specific work and knowledge routes in both repositories' `.ki.toml` files. Those bindings can name repositories unavailable to a standalone checkout, even inside one territory. The motivating cross-territory route cleanup is complete, and the outstanding request has a receiver-owned roadmap home. The current operating focus is territory-internal exchange. Public KI governance should describe reusable classifications and behaviour without requiring declarations of unrelated private consumers.

Agora membership and inclusion describe a working set, not route consent or peer authority. Any future bridge must preserve each repository's ownership, permit independent checkout or publication, and fail clearly when an external territory is unavailable.

## Boundary

This is unadopted design work. It does not activate inter-territory transport, infer trade permission from an Agora inclusion, introduce automatic knowledge capture, or reopen the retired cross-territory routes. It does not change a repository's roadmap, publication, implementation, or acceptance authority.

Arcadia owns the territory model, territorial Capital, authoritative internal Known Lands inventory, and external signposting. This item owns the later reusable exchange-governance consequence. The machine registry resolves local availability and stores; it is not the source of territorial assignment. Company and Agora bindings must be reconciled against governed territory meaning rather than substituted for it.

## Discussion

### Conceptual owner and revised sequence

The human requested a wider KB-governance drift review and assessment of absorbing Techné's engineering knowledge into Arcadia while retaining the Techné harness and operator CLI. Arcadia's existing [Island concepts record](https://github.com/knowledgeislands/ki-arcadia-principal/blob/688fb4e4a019a0ef9590edb0e2f95413010c6318/Streams/Roadmap/KI-ARCADIA-MOD-002-island-concepts.md) already owns Known Lands, Routes, Customs, and signposting. Its [territory governance review](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/+/territory-governance-reconciliation-review.md) supplies the proposed sequence and public evidence; private estate identities remain in the owner's private review.

First reconcile territorial authority and KB drift; then agree knowledge classification and directional exchange; then define the Observatory's read-only knowledge experience; finally amend shared standards and derive receiver-owned implementation work. Agoras and trade mechanisms follow those principles. The territorial authority reconciliation and Arcadia's bounded Techné knowledge consolidation were accepted on 2026-10-02; their retained review records own that evidence. This later exchange-design item stays Triage. No migration, company transfer, remote programme resumption, or runtime policy change is authorised by capture here.

### Direction and classification

Public upstream knowledge can be followed and adopted under a receiving territory's private policy without a reciprocal public list of consumers. Use the existing known-version, receiver-chosen pull model as an input, and distinguish it from a contribution back, restricted bilateral exchange, and receiver-owned work. Determine where internal routes and restricted agreements belong from their authority and audience rather than assuming every relationship requires paired repository tables or a machine-local permission file.

Agree the meaning of ownership, topic and kind, audience, source revision, reference versus adopted adaptation, and lifecycle state before choosing metadata keys. Membership or a subject tag alone grants no exchange authority. Preserve source-store privacy and repository-specific acceptance even within one territory.

### Distinct exchanges

Define when a structured trade is warranted for receiver-owned work or knowledge disposition, and when a source link, local referral, or ordinary knowledge reference is enough. Determine where territory-internal routing belongs so it can use locally available identities without claiming that every peer is globally accessible. Inter-territory exchange needs an explicit boundary crossing, not a standing route implied by a shared tool or occasional collaboration.

### Design questions

Evaluate identity and discovery, receiver invitation or consent, offline and missing-peer behaviour, provenance, revocation, and where any machine-local association belongs. Compare a one-off handoff with a continuing receiver-owned adoption relationship and an explicit restricted agreement, including how a submitted item can be withdrawn or re-homed without losing the originating work. Reconcile the route-expansion assumptions in [Accept estate work trades](https://github.com/knowledgeislands/ki-agentic-harness/blob/ff6d023be0985ff4d431945fbdf241ef7318b6a3/docs/roadmap/KI-HARNESS-GOV-090-accept-estate-work-trades.md) before changing the trade contract or CLI. The Observatory should be able to distinguish governed membership, external reference, adoption, and exchange in a chart and reader without making its display the authority for those relationships.

### Owner question

Recorded 2026-10-05 by the Fable reviewer during make-ready triage; this record stays draft until Kris answers. Should inter-territory exchange be designed now, or stay unadopted until Arcadia's knowledge-classification sequence step is accepted?
