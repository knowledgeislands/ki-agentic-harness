---
id: ADR-KI-HARNESS-SKILLS-007
title: 'Provider-neutral AI session acquisition and adapter pairing'
date: 2026-10-22
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-SKILLS-007: Provider-neutral AI session acquisition and adapter pairing

## Context

Knowledge Islands acquisition is a model-wide architecture. Arcadia owns the lifecycle and boundaries for acquiring external knowledge, including AI sessions, communications, documents, and future sources. The lifecycle is not a Harness concern merely because the first provider adapters serve AI clients.

The Harness owns reusable agent capabilities. `ki-housekeeping-claude` and `ki-housekeeping-chatgpt` guide provider-specific session work, the latter covering both ChatGPT and Codex local stores, while their paired MCPs expose source mechanics. Claude Code and Codex use different storage and protocol mechanisms, so their adapters need a comparable surface without becoming a second knowledge architecture.

## Decision

Harness separates action-first `ki-acquire-*` capabilities from provider housekeeping and source mechanics. A housekeeping skill may own content-minimised local evidence, but it does not own readable acquisition, receiver routing, or retirement authority. Each acquisition skill states the capture contract and carries no front matter advertising executable actions. Executing acquisition belongs to the assistant's `ki-muninn` (krisb/assistant, `packages/ki-muninn/`), which took it over when `ki acquire` left `tools-ki` on 5 November 2026; desired future capabilities remain standard and roadmap requirements until focused tests in `ki-muninn` prove them.

`ki-acquire-chatgpt` composes with `ki-housekeeping-chatgpt`: the housekeeping capability supplies opaque installed-store identity and change evidence, while the acquisition capability owns readable project routing, complete-conversation fidelity, incremental content checkpoints, and receiver staging.

ChatGPT project routing binds immutable provider project IDs to receiver repositories. `<Domain>: <Topic>` names and retained prior names make routing intent reviewable but do not replace stable identity. Unknown prefixes, unmapped projects, and receiver conflicts fail closed.

The Harness adopts Arcadia's provider-neutral knowledge-acquisition architecture. It supplies skills and provider MCP adapters that expose read-only discovery, listing, faithful reading, and checkpoint operations for a selected physical repository.

The shared adapter surface is additive and access-gated. It returns only fields that the provider can faithfully supply, keeps content-minimised checkpoint data separate from source reads, and never writes KI state, classifies knowledge, or mutates a source session. `ki-muninn`'s importers are the consumer of these operations, not an MCP operation.

Claude and Codex readable acquisition guidance lives with `ki-acquire`, separate from their housekeeping skills. Full-session import is an exception for an explicitly selected source-evidence need, never routine bulk history capture. The common acquisition contract continues to govern faithful scope and receiver-local disposition.

The existing `mcp-housekeeping-claude` and `mcp-housekeeping-chatgpt` repositories remain shared source adapters under their current names. Their session discovery, list, read and checkpoint surfaces stay read-only; acquisition-specific names or duplicate projections are unnecessary. Housekeeping's separately authorised cleanup surface does not transfer authority into capture. Staging captures is `ki-muninn`'s concern, and a skill advertises no importer capability.

## Consequences

- ChatGPT project renames do not change routing identity; checkpoints retain current and prior names as evidence.
- The current user-prepared ChatGPT capture remains a bounded import bridge and is not described as incremental provider acquisition.
- Claude and Codex can be operated through the same vocabulary while retaining only verified provider capabilities.
- Existing Claude housekeeping tools remain available while callers adopt the acquisition path.
- A provider adapter reports an unavailable source or no readable sessions rather than synthesising content or silently falling back to another provider.
- Memory remains one area of housekeeping, not a substitute for acquisition. A KB's own `Admin/MEMORY.md` cascade remains `ki-repo-kb`'s concern, and context cost remains `ki-tokenomics`'s concern.
- The server's code quality remains `ki-repo-mcp`'s concern. The skills and provider adapters evolve with Arcadia's acquisition architecture.

## References

- [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-concern-first-skill-taxonomy-and-implication-graph.md) — the taxonomy that places `ki-housekeeping-claude` in the Environment concern.
- [Provider-neutral knowledge acquisition](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/ADR-KI-PRINCIPAL-001-provider-neutral-knowledge-acquisition.md) — the KI-wide architecture this record implements.
