---
id: ADR-KI-HARNESS-TOOLCHAIN-006
title: qmd derived KB search index
date: 2026-10-05
status: current
decision_type: architecture
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
---

# ADR-KI-HARNESS-TOOLCHAIN-006: qmd derived KB search index

## Context

Knowledge remains in governed Markdown. Optional retrieval needs a stable KI surface, current access controls and repository-path citations, rather than another persistent-memory authority. A local derived engine can add semantic and hybrid retrieval while preserving that boundary.

The synthetic pilot, recorded in the decision supporting material as qmd-synthetic-pilot.md and its complete JSON evidence, uses qmd 2.8.3 at commit `facd35e01359e59d938bc9418e93fb9318addee3`, three downloaded model files with recorded SHA-256 hashes, and independent Alpha/Omega indexes. Both methods find the expected note for the original sixteen question instances. qmd's median cold CLI query takes 7.74/9.19 seconds and returns 1,705.5/1,716.5 characters, versus 0.00865/0.00857 seconds and 1,228.5 characters for whole-word grep plus targeted reads. There is no observed quality, context or latency advantage on those nine-note corpora. Four supplementary predeclared paraphrase instances find the expected note through qmd and miss through the bounded literal grep baseline. These small synthetic cases demonstrate an available semantic capability; they do not establish large-corpus, private-corpus or production performance.

The principal approves a bounded functional go on that evidence, with optional provisioned search, explicit per-KB boundaries and no automatic runtime activation.

## Decision

Adopt the pinned qmd engine as an optional rebuildable derived index behind `kb_search`, `ki kb search` and the `ki-repo-kb` QUERY procedure. The `ki-repo-kb` search and source-mirror standards own the portable boundary; tools-ki and mcp-ki-kb-fs own their respective implementation and configuration. Agents receive authorised repository snippets and paths, never a direct qmd binding or opaque docid as knowledge authority.

Each stable registered KB ID has an explicit owner-approved unique trust-boundary assignment and its own named index. No path, basename, company or Agora membership creates that assignment, and no cross-KB sharing is enabled by default. Each configured auxiliary HTTP daemon serves exactly one KB/index; this release does not accept an index selector on REST queries. The general model-file cache may be shared, but content, projection, SQLite caches, configuration and process bindings remain boundary-specific.

Build the index from a fresh private generation containing only authorised regular Markdown selected through declared zones. Exclude protected paths, undeclared zones, source-store binaries, symlinks and stale or removed content before engine ingestion, query expansion or snippets. Search rechecks current gateway permissions and source hashes, validates engine provenance, and constructs displayed text from authorised current Markdown. Mirror labels attest only declaration syntax and minimum text, never source fidelity or source-store access.

Use an explicitly assigned loopback-only auxiliary endpoint and already-provisioned local model paths. qmd has no KB authentication; loopback and Origin/Host checks do not authorise access or prevent other local clients reaching a daemon. Only the operator-managed KI gateway is bound to agents. Health is liveness alone (`index_attested: false`); an operator may misbind a reachable endpoint and receive an ambiguous empty result. Do not infer index identity or complete coverage from health or emptiness.

Keep literal lexical handling for exact identifiers and grep plus targeted reads as the explicit fallback when search is absent, unavailable or insufficient. Installation, models, daemon startup, scheduling and client bindings require their own owner-managed delivery. Reject direct-agent qmd exposure, a single global daemon/index spanning KBs, and per-client SDK embedding as the default shape.

## Consequences

Semantic/hybrid retrieval is available through stable KI vocabulary without replacing Markdown authority. It carries real model-download, cold latency, context and per-index process costs; this decision claims no efficiency win from the pilot. Provisioning and future capacity or scale validation remain explicit operator work.

Derived files may contain private knowledge and require private filesystem handling, fresh-generation refresh and current access checks. Indexes are disposable caches, never source stores or a substitute for canonical reads. Unsupported engines, missing models, invalid mappings, stale sources and unavailable endpoints remain explicit failures rather than fabricated empty success. Search responses are bounded and non-exhaustive.

The pilot removes its named indexes and projections, retains only the documented task-owned model cache and non-sensitive evidence, and changes no private KB, source store, provider, global installation or live client binding. A version or model change requires renewed contract verification and proportionate evidence; broader performance benefit remains unproven.

## References

- [ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling-current-adoptions.md) — complementary tooling and the retained file-based knowledge authority.
- [Pinned qmd source](https://github.com/tobi/qmd/tree/facd35e01359e59d938bc9418e93fb9318addee3) — the inspected release, CLI, model resolution and HTTP implementation.
