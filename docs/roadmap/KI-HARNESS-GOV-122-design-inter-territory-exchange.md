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
updated_at: 2026-10-01T04:23:19Z
---

# KI-HARNESS-GOV-122: Design inter-territory exchange

## Goal

Separate territory-internal work trades and knowledge routing from deliberate exchange between territories, so an island can operate without declaring unavailable external repositories in its public `.ki.toml`.

## Context

The current `ki-trades` contract declares partner-specific work and knowledge routes in both repositories' `.ki.toml` files. Those bindings can name repositories unavailable to a standalone checkout, even inside one territory. The Personal dotfiles and Knowledge Islands `kis` territories exposed an especially inappropriate persistent binding: ten cross-territory route entries existed solely between dotfiles and five Knowledge Islands repositories. The current operating focus is territory-internal exchange; those entries are being retired after the one submitted dotfiles-to-Rig work request has a receiver-owned roadmap home.

Agora membership and inclusion describe a working set, not route consent or peer authority. Any future bridge must preserve each repository's ownership, permit independent checkout or publication, and fail clearly when an external territory is unavailable.

## Boundary

This is unadopted design work. It does not activate inter-territory transport, infer trade permission from an Agora inclusion, introduce automatic knowledge capture, or reopen the retired dotfiles routes. It does not change a repository's roadmap, publication, implementation, or acceptance authority.

## Discussion

### Distinct exchanges

Define when a structured trade is warranted for receiver-owned work or knowledge disposition, and when a source link, local referral, or ordinary knowledge reference is enough. Determine where territory-internal routing belongs so it can use locally available identities without claiming that every peer is globally accessible. Inter-territory exchange needs an explicit boundary crossing, not a standing route implied by a shared tool or occasional collaboration.

### Design questions

Evaluate identity and discovery, receiver invitation or consent, offline and missing-peer behaviour, provenance, revocation, and where any machine-local association belongs. Compare a one-off handoff with a durable bridge, including how a submitted item can be withdrawn or re-homed without losing the originating work. Reconcile the route-expansion assumptions in `KI-HARNESS-GOV-090` before changing the trade contract or CLI.
