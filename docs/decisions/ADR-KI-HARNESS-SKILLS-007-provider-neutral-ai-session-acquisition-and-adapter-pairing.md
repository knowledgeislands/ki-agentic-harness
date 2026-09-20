---
id: ADR-KI-HARNESS-SKILLS-007
title: 'Provider-neutral AI session acquisition and adapter pairing'
date: 2026-08-23
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-SKILLS-007: Provider-neutral AI session acquisition and adapter pairing

## Context

Knowledge Islands acquisition is a model-wide architecture. Arcadia owns the lifecycle and boundaries for acquiring external knowledge, including AI sessions, communications, documents, and future sources. The lifecycle is not a Harness concern merely because the first provider adapters serve AI clients.

The Harness owns reusable agent capabilities. `ki-housekeeping-claude` and `ki-housekeeping-codex` guide provider-specific session work, while their paired MCPs expose source mechanics. Claude Code and Codex use different storage and protocol mechanisms, so their adapters need a comparable surface without becoming a second knowledge architecture.

## Decision

The Harness adopts Arcadia's provider-neutral knowledge-acquisition architecture. It supplies skills and provider MCP adapters that expose read-only discovery, listing, faithful reading, and checkpoint operations for a selected physical repository.

The shared adapter surface is additive and access-gated. It returns only fields that the provider can faithfully supply, keeps content-minimised checkpoint data separate from source reads, and never writes KI state, classifies knowledge, or mutates a source session. `ki acquire import --adapter <provider>` remains the repository-context consumer of these operations, not an MCP operation.

## Consequences

- Claude and Codex can be operated through the same vocabulary while retaining only verified provider capabilities.
- Existing Claude housekeeping tools remain available while callers adopt the acquisition path.
- A provider adapter reports an unavailable source or no readable sessions rather than synthesising content or silently falling back to another provider.
- Memory remains one area of housekeeping, not a substitute for acquisition. A KB's own `Admin/MEMORY.md` cascade remains `ki-repo-kb`'s concern, and context cost remains `ki-tokenomics`'s concern.
- The server's code quality remains `ki-repo-mcp`'s concern. The skills and provider adapters evolve with Arcadia's acquisition architecture.

## References

- [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-concern-first-skill-taxonomy-and-implication-graph.md) — the taxonomy that places `ki-housekeeping-claude` in the Environment concern.
- [Provider-neutral knowledge acquisition](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Admin/Governance/Decisions/ADR-KI-ARCADIA-001-provider-neutral-knowledge-acquisition.md) — the KI-wide architecture this record implements.
