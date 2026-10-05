---
id: KI-HARNESS-FND-028
area: FND
title: Adopt qmd KB search
theme: foundation-tooling
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-30T07:00:00Z
updated_at: 2026-10-05T08:06:07Z
---

# KI-HARNESS-FND-028: Adopt qmd KB search

## Goal

Agents answer Knowledge Base questions through hybrid search over the base's Markdown instead of grep and whole-file reads, while qmd stays an implementation detail behind `kb_search` on `mcp-ki-kb-fs`, `ki kb search` on the shell and the `ki-repo-kb` QUERY procedure.

## Context

KI has no retrieval layer today. `ki-repo-kb` QUERY mode says "search and read the relevant notes", which in practice is the agent's own grep plus reading candidate files; `mcp-ki-kb-fs` lists, reads and writes but does not search; `ki manage search` covers installed capabilities, not content. kit-principal alone holds about 1,800 notes and kit-legal about 2,150 evidence mirrors, so grep-then-read is slow and spends context on files that do not answer the question.

[tobi/qmd](https://github.com/tobi/qmd) is a local, MIT-licensed engine that combines BM25, vector search and on-device reranking over Markdown, with collections, per-path `context` descriptions, named indexes, an HTTP MCP daemon, JSON output and a typed SDK. Its index is a rebuildable cache under `~/.cache/qmd`, never a store of knowledge, which keeps it inside the rationale of [ADR-KI-HARNESS-TOOLCHAIN-002](../decisions/ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling-current-adoptions.md) that rejected an opaque memory store.

Kris confirmed on 2026-09-30 that qmd should sit behind the skill and the MCP rather than be called directly by agents.

## Boundary

In scope for the harness:

- a one-hour direct-CLI pilot, run first, with a recorded go or no-go;
- on go, a Decision Record adopting qmd as a derived index with the "behind KI surfaces" shape, and its entry among current adoptions;
- the `ki-repo-kb` QUERY update: `kb_search` first where bound, exact-identifier search for IDs, line-range reads rather than whole files, cite repository paths not qmd docids, and fall back to grep when no search surface is available;
- `ki-tokenomics` guidance on snippet-first retrieval.

Delivered elsewhere as separate trades or owner captures, outside this record's acceptance:

- `ki kb index` and `ki kb search` in tools-ki (registry to one named index per trust boundary, collections per repository, `context` from declared purpose, scheduled `update` and `embed`);
- `kb_search` in mcp-ki-kb-fs calling the daemon's `POST /query` with base, zone and access-level scoping and audit-log entries;
- the mcporter and Desktop binding, the launchd daemon, a pinned mise install and `brew "sqlite"` in chezmoi.

Excluded: metadata frontmatter for qmd filtering, indexing binary source stores directly, any network exposure of the daemon or any remote service, and the store-mirror content standard owned by [KI-HARNESS-GOV-121](KI-HARNESS-GOV-121-require-substantive-store-mirrors.md). Installing qmd and its models locally for the pilot is in scope.

## Current state

- `qmd` is not installed on the principal's laptop (`which qmd` finds nothing on 2026-10-05).
- `skills/repo-structure/ki-repo-kb/references/mode-query.md` step 1 reads "Search and read the relevant notes"; step 2 asks for a citation to "the source note or paired source document". No retrieval surface or snippet-first rule is named.
- `skills/environment/ki-tokenomics/references/standards-tokenomics.md` covers budgets, configuration, model purpose and ownership; it says nothing about retrieval cost.
- [ADR-KI-HARNESS-TOOLCHAIN-002](../decisions/ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling-current-adoptions.md) lists adopted, available, declined and scale-gated tools; qmd is absent. The highest `TOOLCHAIN` serial is `005`.
- Routes in `.ki.toml`: tools-ki accepts work and knowledge exports from this repository; mcp-ki-kb-fs accepts only knowledge exports, so a `kb_search` work request has no route. chezmoi has no route.

## Steps

- [ ] Pilot (step one, time-boxed to one hour): install qmd locally per its README and record the version; index kit-principal and hnr-shared as two separate named indexes; ask eight to ten real questions of each method, qmd CLI (`qmd query --json`) against grep plus reads; record per question whether the right note was found, the characters of context returned, and wall time. Record the results and an explicit go or no-go with its reason in a `## Pilot result` section of this record. Delete the pilot indexes afterwards; the models may stay in the local cache.
- [ ] On no-go: add qmd with the pilot evidence to the "Declined" list in `ADR-KI-HARNESS-TOOLCHAIN-002`, apply only the snippet-first tokenomics guidance below (which does not depend on qmd), mark the remaining steps not applicable, and stop.
- [ ] On go: write `docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-006-qmd-derived-kb-search-index.md` (new; take the next free serial at authoring time) adopting qmd as a rebuildable derived index reached only through KI surfaces, citing the pilot, the localhost-only daemon, named indexes per trust boundary, and the rejected direct-agent and per-client-SDK shapes. Add it to `docs/decisions/README.md` and add qmd to "Adopted" in `ADR-KI-HARNESS-TOOLCHAIN-002` with a link.
- [ ] On go: rewrite `mode-query.md` steps 1 and 2: use `kb_search` (or `ki kb search` on the shell) when bound; search exact identifiers literally; read returned line ranges rather than whole files; cite repository paths, never qmd docids; fall back to grep and targeted reads when no search surface is available.
- [ ] Add a short "Retrieval" section to `standards-tokenomics.md`: prefer snippet or line-range retrieval to whole-file reads, measure retrieved context in the same terms as standing surfaces, and route search-surface design to `ki-repo-mcp` and `ki-repo-kb`.
- [ ] On go: raise a work trade to tools-ki for `ki kb index` and `ki kb search`; raise a knowledge trade to mcp-ki-kb-fs describing the `kb_search` need and the missing work route, leaving capture to that repository; record the chezmoi binding, daemon and install need for the owner, since no route exists.

## Files touched

- `docs/roadmap/KI-HARNESS-FND-028-adopt-qmd-kb-search.md` (pilot result)
- `docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-006-qmd-derived-kb-search-index.md` (new, on go)
- `docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling-current-adoptions.md`
- `docs/decisions/README.md` (on go)
- `skills/repo-structure/ki-repo-kb/references/mode-query.md` (on go)
- `skills/environment/ki-tokenomics/references/standards-tokenomics.md`
- `-/_TRADES/knowledgeislands/tools-ki/TRD-<id>.md` (new, on go)
- `-/_TRADES/knowledgeislands/mcp-ki-kb-fs/TRD-<id>.md` (new, on go)

## Verify

1. This record holds a `## Pilot result` section with the qmd version, both corpora, eight to ten questions, per-question found or not found, context size and time for both methods, and a one-line go or no-go with its reason.
2. On no-go: `ADR-KI-HARNESS-TOOLCHAIN-002` lists qmd under "Declined" with a link to this record, no new Decision Record exists, and `mode-query.md` is unchanged.
3. On go: the new Decision Record passes `ki repo audit --skill ki-decision-records`, is indexed in `docs/decisions/README.md`, and `ADR-KI-HARNESS-TOOLCHAIN-002` links it from "Adopted".
4. On go: `mode-query.md` names `kb_search`, exact-identifier search, line-range reads, repository-path citations and the grep fallback, and names no qmd command or docid.
5. `standards-tokenomics.md` holds the retrieval guidance and no budget value changes.
6. No daemon is exposed beyond localhost, no remote service is configured, and no file outside this repository is written; the trades are recorded as outbound records only.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-repo-kb --progress never
ki repo audit --skill ki-tokenomics --progress never
ki repo audit --skill ki-decision-records --progress never
ki repo audit --skill ki-authoring --progress never
```

Follow-on, outside acceptance: tools-ki, mcp-ki-kb-fs and chezmoi deliver their halves under their own records.

## Dependencies / blocks

None. [KI-HARNESS-GOV-121](KI-HARNESS-GOV-121-require-substantive-store-mirrors.md) is a cross-reference rather than a dependency: substantive mirrors make search results better, and search makes pointer-only mirrors more visible, but neither record's acceptance needs the other's output. Both edit `mode-query.md`; whichever lands second rebases a one-line change.

## Documentation impact

### Decision Records

On go, `ADR-KI-HARNESS-TOOLCHAIN-006` (new) and an "Adopted" entry in `ADR-KI-HARNESS-TOOLCHAIN-002`. On no-go, a "Declined" entry in `ADR-KI-HARNESS-TOOLCHAIN-002` only.

### Specifications

`mode-query.md` (on go) and `standards-tokenomics.md` change as described in Steps.

### Guides

None in this repository. A user-facing search guide belongs with the tools-ki or mcp-ki-kb-fs delivery that ships the surface.

### Roadmap

None in this repository beyond the outbound trades.

## Discussion

### Decision

Run a one-hour direct-CLI qmd pilot first as step one with a recorded go or no-go; the harness owns the Decision Record, the QUERY-mode update and the tokenomics guidance; tools-ki and mcp-ki-kb-fs work are separate trades. Installing qmd locally is fine; no remote services. Decided by the Fable reviewer under delegated autonomy, reversible.

### Why behind the surfaces

`mcp-ki-kb-fs` already knows bases, aliases, zones, access levels, protected paths and writes an audit log; a search hit is a read and belongs behind the same gate. qmd's own MCP has no authentication and only collection-level scoping. A stable `kb_search` vocabulary also lets the engine change without rewriting skills.

### Runtime shape

One HTTP daemon (`qmd mcp --http --daemon`, localhost only) started by launchd holds the roughly 2 GB of models once; `mcp-ki-kb-fs` calls it over HTTP rather than embedding the SDK, so Desktop, Codex and mcporter do not each load a copy. Named indexes separate trust boundaries so an HNR session never receives kit-legal hits.

### Route gaps (resolved)

`mcp-ki-kb-fs` accepts only knowledge trades from this repository, so the `kb_search` request travels as a knowledge trade and that repository decides whether to capture its own work record. chezmoi has no route and is recorded for the owner.
