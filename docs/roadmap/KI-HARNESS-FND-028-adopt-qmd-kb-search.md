---
id: KI-HARNESS-FND-028
area: FND
title: Adopt qmd KB search
theme: foundation-tooling
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-30T07:00:00Z
updated_at: 2026-09-30T07:00:00Z
---

# KI-HARNESS-FND-028: Adopt qmd KB search

## Goal

Agents answer Knowledge Base questions through hybrid search over the base's Markdown instead of grep and whole-file reads, while qmd stays an implementation detail behind `kb_search` on `mcp-ki-kb-fs`, `ki kb search` on the shell and the `ki-repo-kb` QUERY procedure.

## Context

KI has no retrieval layer today. `ki-repo-kb` QUERY mode says "search and read the relevant notes", which in practice is the agent's own grep plus reading candidate files; `mcp-ki-kb-fs` lists, reads and writes but does not search; `ki manage search` covers installed capabilities, not content. kit-principal alone holds about 1,800 notes and kit-legal about 2,150 evidence mirrors, so grep-then-read is slow and spends context on files that do not answer the question.

[tobi/qmd](https://github.com/tobi/qmd) is a local, MIT-licensed engine that combines BM25, vector search and on-device reranking over Markdown, with collections, per-path `context` descriptions, named indexes, an HTTP MCP daemon, JSON output and a typed SDK. Its index is a rebuildable cache under `~/.cache/qmd`, never a store of knowledge, which keeps it inside the rationale of `ADR-KI-HARNESS-TOOLCHAIN-002` that rejected an opaque memory store.

Kris confirmed on 2026-09-30 that qmd should sit behind the skill and the MCP rather than be called directly by agents.

## Boundary

In scope for the harness: a Decision Record adopting qmd as a derived index with the "behind KI surfaces" shape; the `ki-repo-kb` QUERY update (`kb_search` first, exact-identifier search for IDs, line-range `get` rather than whole reads, cite repository paths not docids, fall back to grep when the daemon is absent); `ki-tokenomics` guidance on snippet-first retrieval; the toolchain adoption entry.

Delivered elsewhere and reached through `ki-trades` or in-repository capture: `ki kb index` in tools-ki (registry → one named index per trust boundary, collections per repository, `context` from declared purpose, scheduled `update` and `embed`); `kb_search` in mcp-ki-kb-fs calling the daemon's `POST /query` with base, zone and access-level scoping and audit-log entries; the mcporter and Desktop binding plus pinned mise install and `brew "sqlite"` in chezmoi.

Excluded: metadata frontmatter for qmd filtering, indexing binary source stores directly, any network exposure of the daemon, and the store-mirror content standard owned by `KI-HARNESS-GOV-121`.

## Discussion

### Why behind the surfaces

`mcp-ki-kb-fs` already knows bases, aliases, zones, access levels, protected paths and writes an audit log; a search hit is a read and belongs behind the same gate. qmd's own MCP has no authentication and only collection-level scoping. A stable `kb_search` vocabulary also lets the engine change without rewriting skills.

### Runtime shape

One HTTP daemon (`qmd mcp --http --daemon`, localhost only) started by launchd holds the roughly 2 GB of models once; `mcp-ki-kb-fs` calls it over HTTP rather than embedding the SDK, so Desktop, Codex and mcporter do not each load a copy. Named indexes separate trust boundaries so an HNR session never receives kit-legal hits.

### First task

Run a one-hour direct-CLI pilot over kit-principal and hnr-shared with eight to ten real questions against grep before building the wrapper; record answer quality and context cost in this item.

### Route gaps

`mcp-ki-kb-fs` currently accepts only knowledge trades from this repository; the `kb_search` work needs either a work-import route or in-repository capture.
