---
id: GDR-KI-HARNESS-006
title: "Reciprocal Agora membership"
date: 2026-08-09
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
decision_type: governance
decision_depends_on: ["GDR-KI-FUNDAMENTALS-001"]
---

# GDR-KI-HARNESS-006: Reciprocal Agora membership

## Context

Local `.ki-agora` profiles currently collect absolute paths for one editor. They cannot establish that a repository approves its members, that a member consents to join, or that any local client projection is permitted. The local KI registry can resolve canonical repositories to physical roots, but registry visibility is not membership consent and must remain distinct from external source stores a client may also open.

## Decision

This island adopts `ki-agora` as the portable governance owner for named reciprocal Agora membership. A registered owner repository declares each Agora's globally unique stable identifier, its own canonical identity, purpose, and approved canonical repository members. The owner is automatically included in the resolved projection; every other member independently declares the same identifier and canonical owner. Home, reciprocal member, and owner-selected reference are fixed relationship kinds, not permissions or repository functions. The portable contract records no local path, target policy, role label, or application-owned state.

The `ki` host owns local registry resolution and reciprocal observation. A user chooses an explicit supported target when opening a resolved Agora; the target is a local operation rather than group policy. A user-environment owner may project an agreed Agora to that client while preserving client-owned state. The full registry may separately derive one protected system-managed estate; named Agoras remain intentional subsets and never enrol external source stores by association.

An Agora owner may also declare canonical HTTPS GitHub repository `references` for working-set projection. References are owner-selected, mutually exclusive with owner and members, need no reciprocal declaration or `.ki.toml`, and remain explicitly classified as non-members without authority. A machine-local host may associate each reference with one selected matching Git checkout; unresolved references yield typed diagnostics and are omitted without weakening reciprocal member results.

## Consequences

Repositories gain one reviewable ownership and consent model that survives machines and clients without granting cross-repository write authority. A peer's absence or mismatch becomes an observable validation result, not a mutation request; an owner identity mismatch or duplicated Agora identifier is rejected by the resolver. The first actual Agora vocabulary and member set remain user-authorised follow-on configuration, and tools-ki can now implement resolution without inventing a competing schema.

## References

- [GDR-KI-FUNDAMENTALS-001](GDR-KI-FUNDAMENTALS-001-knowledge-islands-ecosystem-fundamentals.md) — the ecosystem authority and choreography model this decision preserves.
