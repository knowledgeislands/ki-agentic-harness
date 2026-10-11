---
id: GDR-KI-HARNESS-006
title: "Territory-derived working sets"
date: 2026-10-11
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
decision_type: governance
decision_depends_on: ["GDR-KI-ARCADIA-006", "ADR-KI-ARCADIA-002"]
---

# GDR-KI-HARNESS-006: Territory-derived working sets

## Context

A working set spans independently governed repositories, and its membership needs one clear authority. Each Capital already declares its territory's canonical members, and Arcadia derives repository selection from that roster. A second, separately authored roster would repeat territorial membership and drift from it. Local registry visibility and client workspace state do not themselves define a working set.

## Decision

This island takes its portable working sets from territory. A working set is the Capital's declared `territory_members`, selected by territory handle, or the caller's registered estate; `ki-repo` governs the declaration, the handle and the shared selector rules. The harness declares no separately owned repository groups, inclusions or reference associations, and no skill carries a membership roster of its own.

Canonical repository identities resolve through the local registry. A user chooses an explicit supported target when opening a selected territory; the target is a local operation, not group policy. Selection confers no role labels or permissions: it grants no cross-repository authority, trade route, ownership, priority, implementation, release or acceptance authority.

## Consequences

Territory membership has one authoritative roster, so working sets cannot disagree with territorial governance. Membership changes happen in one place, the Capital's declaration. Opening or observing a working set remains a machine-local act that carries no authority. Repositories outside a territory join a session only through an explicit repository selection.

## References

- [GDR-KI-ARCADIA-006](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Admin/Governance/Decisions/GDR-KI-ARCADIA-006-knowledge-islands-ecosystem-fundamentals.md) - the ecosystem authority and choreography model this decision preserves.
- [ADR-KI-ARCADIA-002](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Admin/Governance/Decisions/ADR-KI-ARCADIA-002-territory-derived-repository-selection.md) - territory-derived repository selection, which this decision applies to the harness.
