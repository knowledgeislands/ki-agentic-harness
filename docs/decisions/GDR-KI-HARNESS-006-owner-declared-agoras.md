---
id: GDR-KI-HARNESS-006
title: "Owner-declared Agoras"
date: 2026-10-06
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
decision_type: governance
decision_depends_on: ["GDR-KI-ARCADIA-006"]
---

# GDR-KI-HARNESS-006: Owner-declared Agoras

## Context

An Agora is a portable working set across independently governed repositories. Its membership needs one clear authority, while opening it may also require repositories from another group or a non-member Git checkout. Local registry visibility and client workspace state do not themselves define that working set.

## Decision

This island adopts `ki-agora` as the portable governance owner for named Agoras. A registered owner repository declares each Agora's globally unique stable identifier, required readable title, purpose, and canonical direct members. The identifier is the only machine key, used for lookups, selection, projected roots and derived paths; the title is what people see and mirrors any derived heading. Changing a title renames nothing and moves nothing. Its owner identity comes from `ki-repo.repository` and participates automatically. Ordinary members declare nothing. Members have no role labels or Agora-derived permissions.

An owner may include another named Agora or a canonical repository identity as a working-set addition without making it a member. Included Agoras contribute their owner and direct members only; their own inclusions are not followed. Registered repositories resolve through the local registry; an unregistered Git repository needs an explicit machine-local checkout association. Resolved roots are deduplicated and sorted alphabetically by local registry key. Neither inclusion nor title grants cross-repository authority or a trade route.

The `ki` host owns local registry resolution and observation. A user chooses an explicit supported target when opening a resolved Agora; the target is a local operation rather than group policy. A user-environment owner may project the Agora to that client while preserving client-owned state. The portable declaration contains no local path, target policy, or application-owned state. The full registry separately derives a protected system-managed estate; named Agoras remain intentional subsets.

## Consequences

Repositories gain a single reviewable membership authority without copying membership declarations into each member. A missing or malformed direct member or included Agora becomes an observable validation result, never a mutation request; duplicated Agora identifiers are rejected. Including an unregistered repository may produce a typed local diagnostic while leaving direct membership intact. A tool may use the resolved working set without treating it as ownership, priority, implementation, release, or acceptance authority.

## References

- [GDR-KI-ARCADIA-006](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Admin/Governance/Decisions/GDR-KI-ARCADIA-006-knowledge-islands-ecosystem-fundamentals.md) — the ecosystem authority and choreography model this decision preserves.
