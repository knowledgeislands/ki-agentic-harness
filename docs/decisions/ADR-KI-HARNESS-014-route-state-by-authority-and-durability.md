---
id: ADR-KI-HARNESS-014
title: 'Route state by authority and durability'
date: 2026-09-16
status: current
decision_type: architecture
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_depends_on: [SDR-KI-HARNESS-002, ADR-KI-HARNESS-006, ADR-KI-HARNESS-010, GDR-KI-HARNESS-004]
---

# ADR-KI-HARNESS-014: Route state by authority and durability

## Context

Harness-related state appears in Git repositories, generated projections, installed payloads, XDG registry and configuration, managed runtime settings, project memory, checkpoints, acquired sessions, credentials, logs, and caches. Existing decisions assign several of these surfaces to different owners, but no single rule explains how their authorities compose.

A checkout-path change caused Claude to resolve a new project-memory directory while durable-looking guidance remained under the old path. Both copies were writable, but neither path alone established which content should survive or where it should be maintained. The same ambiguity can occur when generated projections, runtime sessions, provider snapshots, or caches resemble durable sources.

## Decision

Knowledge Islands routes every Harness state class to one canonical authority according to its required durability, sharing, sensitivity, regeneration, and recovery. A derived or runtime-local representation never becomes the sole authority merely because it is available.

- **Repository source and accepted documentation:** the owning Git repository is canonical. Generated catalogues and runtime projections are derived, carry no independent authority, and must be reproducible from reviewed source.
- **Installed Harness state:** the host's XDG registry and configuration own the selected user installation. Verified installed payloads and discovery links are replaceable projections; caches are disposable. Recovery uses declared Harness sources and retained configuration rather than a nearby checkout.
- **Managed user-runtime bindings:** the user-environment manager owns intended settings and hook registration. Runtime-native files are rendered projections. Sensitive values remain in the secret authority and are injected without becoming configuration source.
- **Project knowledge and learned preferences:** runtime memory is proposal and convenience state. Repository-specific durable guidance is promoted to its tracked documentation or instructions owner; cross-project personal guidance is promoted to managed user instructions. Unpromoted memory remains runtime-local and must be deliberately retained, exported, or discarded.
- **Work and session continuity:** Git work records, commits, complete patches, and explicit repository checkpoints own recoverable work state. Transcripts, runtime sessions, environment disks, and provider snapshots may assist recovery but are not sufficient authority. Acquired session material follows its housekeeping and repository staging lifecycle.
- **Credentials:** the designated secret manager is canonical. Repositories, generated projections, logs, caches, checkpoints, and provider snapshots must not become credential stores.
- **Logs, caches, and temporary execution state:** these are disposable machine-local evidence with no canonical authority. A durable finding is promoted to its owning Decision Record, Specification, Guide, roadmap item, or knowledge base rather than preserving the whole runtime store.

## Consequences

Every new state surface must name its canonical owner, projections, durability, sharing, sensitivity, regeneration, and recovery before it can be treated as supported. Moving a checkout or changing a runtime cannot silently move durable authority. Deleting a projection is safe only when its source and regeneration path are proven; deleting runtime-local material still requires its owning retention and approval boundary.

The decision does not migrate existing state or make all user-local state disposable. A concrete contradiction or misplaced class becomes separately scoped roadmap work. Detailed installation, user-environment binding, documentation, checkpoint, and housekeeping contracts remain with their existing owners.

## References

- [SDR-KI-HARNESS-002](SDR-KI-HARNESS-002-runtime-portable-contracts-and-executor-positioning.md) — keeps governance and capability contracts independent of one runtime.
- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md) — separates installed user state from repository activation.
- [ADR-KI-HARNESS-010](ADR-KI-HARNESS-010-managed-hook-payloads-and-user-environment-binding.md) — separates Harness payload publication from runtime registration.
- [GDR-KI-HARNESS-004](GDR-KI-HARNESS-004-four-doc-repository-documentation-ownership.md) — assigns durable repository documentation to named owners.
