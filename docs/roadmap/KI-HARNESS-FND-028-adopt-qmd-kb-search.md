---
id: KI-HARNESS-FND-028
area: FND
title: Adopt qmd KB search
theme: foundation-tooling
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 00b4b56181a44a2bf77e0a10836e83429f5b62f6
created_at: 2026-09-30T07:00:00Z
updated_at: 2026-10-05T12:05:15Z
---

# KI-HARNESS-FND-028: Adopt qmd KB search

## Goal

Agents can answer Knowledge Base questions through explicitly provisioned optional hybrid search over the base's Markdown, retaining literal grep and targeted-read fallback, while qmd stays an implementation detail behind `kb_search` on `mcp-ki-kb-fs`, `ki kb search` on the shell and the `ki-repo-kb` QUERY procedure.

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

- `ki kb index` and `ki kb search` in tools-ki (registry to one explicit unique trust boundary and independent named index per stable registered KB ID, collections per repository, `context` from declared purpose, scheduled `update` and `embed`);
- `kb_search` in mcp-ki-kb-fs calling the daemon's `POST /query` with base, zone and access-level scoping and audit-log entries;
- the mcporter and Desktop binding, the launchd daemon, a future owner-managed pinned install in chezmoi.

Excluded: metadata frontmatter for qmd filtering, indexing binary source stores directly, any network exposure of the daemon or any remote service, and the store-mirror content standard owned by [KI-HARNESS-GOV-121](KI-HARNESS-GOV-121-require-substantive-store-mirrors.md). Installing qmd and its models locally for the pilot is in scope.

## Current state

- `qmd` is not installed on the principal's laptop (`which qmd` finds nothing on 2026-10-05).
- `skills/repo-structure/ki-repo-kb/references/mode-query.md` step 1 reads "Search and read the relevant notes"; step 2 asks for a citation to "the source note or paired source document". No retrieval surface or snippet-first rule is named.
- `skills/environment/ki-tokenomics/references/standards-tokenomics.md` covers budgets, configuration, model purpose and ownership; it says nothing about retrieval cost.
- [ADR-KI-HARNESS-TOOLCHAIN-002](../decisions/ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling-current-adoptions.md) lists adopted, available, declined and scale-gated tools; qmd is absent. The highest `TOOLCHAIN` serial is `005`.
- Routes in `.ki.toml`: tools-ki accepts work and knowledge exports from this repository; mcp-ki-kb-fs accepts only knowledge exports, so a `kb_search` work request has no route. chezmoi has no route.

## Steps

- [x] Pilot (step one, time-boxed to one hour): install qmd locally per its README and record the version; index task-owned synthetic Alpha and Omega corpora as two separate named indexes with explicit unique trust boundaries; ask eight to ten synthetic questions of each method, qmd CLI (`qmd --index <name> query <question> --json`) against grep plus reads; record per question whether the right note was found, the characters of context returned, and wall time. Record the results and an explicit go or no-go with its reason in a `## Pilot result` section of this record. Delete the pilot indexes afterwards; the models may stay in the local cache.
- [x] No-go branch assessed as not applicable after functional go: add qmd with the pilot evidence to the "Declined" list in `ADR-KI-HARNESS-TOOLCHAIN-002`, apply only the snippet-first tokenomics guidance below (which does not depend on qmd), mark the remaining steps not applicable, and stop.
- [x] On go: write `docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-006-qmd-derived-kb-search-index.md` (new; take the next free serial at authoring time) adopting qmd as a rebuildable derived index reached only through KI surfaces, citing the pilot, the localhost-only daemon, named indexes per trust boundary, and the rejected direct-agent and per-client-SDK shapes. Add it to `docs/decisions/README.md` and add qmd to "Adopted" in `ADR-KI-HARNESS-TOOLCHAIN-002` with its pinned upstream link; the decision directory index links the new adoption decision without creating a prohibited forward citation in the older record.
- [x] On go: rewrite `mode-query.md` steps 1 and 2: use `kb_search` (or `ki kb search` on the shell) when bound; search exact identifiers literally; read returned line ranges rather than whole files; cite repository paths, never qmd docids; fall back to grep and targeted reads when no search surface is available.
- [x] Add a short "Retrieval" section to `standards-tokenomics.md`: prefer snippet or line-range retrieval to whole-file reads, measure retrieved context in the same terms as standing surfaces, and route search-surface design to `ki-repo-mcp` and `ki-repo-kb`.
- [x] On go: publish the pinned qmd request/response, per-registry-KB trust-boundary and derived mapping contract in `ki-repo-kb/references/standards-search.md`; coordinate tools-ki and mcp-ki-kb-fs consumers under the current explicit user scope. Preserve historical route facts; create no trade or live runtime binding.

## Files touched

- `docs/roadmap/KI-HARNESS-FND-028-adopt-qmd-kb-search.md` (pilot result)
- `docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-006-qmd-derived-kb-search-index.md` (new, on go)
- `docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling-current-adoptions.md`
- `docs/decisions/README.md` (on go)
- `skills/repo-structure/ki-repo-kb/references/mode-query.md` (on go)
- `skills/environment/ki-tokenomics/references/standards-tokenomics.md`
- `skills/repo-structure/ki-repo-kb/references/standards-search.md` (new, on go)
- `skills/repo-structure/ki-repo-kb/SKILL.md` (search contract discoverability, on go)
- `docs/decisions/references/qmd-synthetic-pilot.md` (durable pilot evidence)
- `docs/decisions/references/qmd-synthetic-pilot.json` (measured synthetic evidence)

## Verify

1. This record holds a `## Pilot result` section with the qmd version, both corpora, eight to ten questions, per-question found or not found, context size and time for both methods, and a one-line go or no-go with its reason.
2. On no-go: `ADR-KI-HARNESS-TOOLCHAIN-002` lists qmd under "Declined" with a link to this record, no new Decision Record exists, and `mode-query.md` is unchanged.
3. On go: the new Decision Record passes `ki repo audit --skill ki-decision-records`, is indexed in `docs/decisions/README.md`, and `ADR-KI-HARNESS-TOOLCHAIN-002` names the optional adoption and links the pinned upstream engine; the directory index links the new decision, preserving backward-only decision citations.
4. On go: `mode-query.md` names `kb_search`, exact-identifier search, line-range reads, repository-path citations and the grep fallback, and names no qmd command or docid.
5. `standards-tokenomics.md` holds the retrieval guidance and no budget value changes.
6. No daemon is exposed beyond localhost, no remote service is configured, and only task-owned local pilot runtime directories outside this repository are written; no private KB, provider, route, live binding or source store is touched. Named indexes and synthetic projections are removed after the pilot; model cache retention is recorded.

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

No formal trade was emitted. Receiving repositories retain their own records and authority under the current explicit scope.

## Pilot result

**Go for optional derived retrieval behind explicitly provisioned KI surfaces.** qmd 2.8.3 at `facd35e01359e59d938bc9418e93fb9318addee3` ran two independent synthetic Alpha/Omega indexes, ten question instances per corpus. The [durable report](../decisions/references/qmd-synthetic-pilot.md) and [complete JSON](../decisions/references/qmd-synthetic-pilot.json) retain every per-question finding, exact characters/bytes and wall time, original and improved grep baselines, supplementary predeclarations, protocol frames and cleanup.

Both methods found 16/16 expected notes on the original instances; qmd had no observed quality, context or latency advantage. The four predeclared paraphrases yielded qmd 4/4 and bounded literal grep 0/4. This limited semantic capability and verified isolation/protocol correctness justify availability, not a production performance claim. The actual explicit-local-GGUF probe passed. The stopped endpoint produced connection refusal; indexes/configs and synthetic projections were removed, with task-owned model cache and reproducibility logs retained. The intermediate publication did not claim acceptance; the final verification and independent review are recorded below.

## Review

### Delivered

Optional qmd adoption, QUERY/snippet-first retrieval and the discoverable pinned search/mapping/result contract are delivered. The complete ten-instance-per-corpus synthetic pilot is published in decision supporting material. Initial publication `e71a769f779d3d45ac03886dd9dfc57e2b3d7489`, strict/shared-metadata correction `357c094f2cbafb4232756740a24b74919dc22bf4`, entry-point correction `7247129d97b3b21c1521b23f1362d41c6e072d2b`, and separate verification prerequisite `b953cb28d06715396692169ac28ae0392e3d664e` form the reviewed source delivery from baseline `00b4b56181a44a2bf77e0a10836e83429f5b62f6`.

### Change Summary

Adopt pinned qmd 2.8.3 as optional derived retrieval behind KI gateways, with explicit independent registered-KB boundaries, private fresh projections and one KB per operator-managed daemon. URI/hash mapping, locally reconstructed snippets/citations, typed REST protocol, untrusted engine text, missing-model/error states and unauthenticated loopback limitations are explicit. QUERY keeps literal exact identifiers and grep/targeted-read fallback; tokenomics measures actual returned units without budget changes. ADR/decision index/current adoptions retain backward-only decision citation rules.

The original sixteen instances gave both methods 16/16 expected-note retrieval, with qmd slower and returning more median context. All results, the initial substring baseline and stronger whole-word baseline remain recorded. Four predeclared supplementary paraphrases gave qmd 4/4 and bounded literal grep 0/4. This supports functional availability only, with no private/large-scale or efficiency claim. Actual local GGUF paths and endpoint-unavailable behavior are captured; task-owned synthetic indexes/configs/projections were removed and only documented cache/source/logs retained.

### Verification

Combined source candidate `b953cb28d06715396692169ac28ae0392e3d664e`: `bun run test` passed 874 tests across 144 files in 27.80 seconds, with zero failures; `bunx tsc --noEmit` passed. Sequential focused audits passed for the synthetic KB fixture (four resolved KB skills), `ki-tokenomics`, `ki-decision-records`, `ki-authoring`, `ki-skills` and `ki-engineering`. The pure helper also passes strict consumer TypeScript flags, and the final focused source set passed 26 tests. Logs and exact ownership/digests are retained under `/tmp/ki-harness-qmd-pilot-20261005-runtime/logs/`; the full successful gate is `harness-test-repaired.log`.

The initial model-contended full run failed; the idle run reproduced nine timeouts and two cleanup errors. Independent unchanged repository-context tests reproduced eight timeouts and three cleanup errors. Byte predicates prove baseline audit/test identity (audit SHA-256 `9ea1d1ab676494d4c8dd6f053dc1cdb2d84ae59ea3ae0dc5ef47139a94409863`; test SHA-256 `f3d93e7116f3800b986bf3de1699177758e341f39489020675858c30ec7a68e2`). Root authorised the separate necessary repair `b953cb28`: local-content auditing now prevents hosted checks before execution, retains local Dependabot policy findings, and leaves default hosted audits intact. Two scoped public-collector fixtures prove zero local provider calls and all six hosted API requests; all 55 repository/collector tests passed in 3.37 seconds. No skipped tests or timeout changes were used.

### Outstanding concerns

No blocking source or required-gate concern remains. Historical per-base and route observations were not refreshed through private KB reads. Receiver-owned implementation, provisioning and enrichment retain their own acceptance authority. No push, registry publication, private indexing, provider mutation or live binding occurred.

### Post-change review

Independent reviewer approved clean `e71a769f`, rebound to the shared-metadata and strict-TypeScript corrections, and approved exact `b953cb28` repair/combined source. Evidence includes native mirror confinement and ambiguous-provenance assertions, 104 embedded-evidence predicates, scoped collector tests and the root's independent 115 original-pilot predicates. This packet is the final documentation transition; root and reviewer bind their terminal review to its clean commit before acceptance. Five unrelated ki-repo-tools paths remain byte-identical and have zero delivery diff; 25 owned paths are recorded in the runtime ownership evidence. The approved batch marker remains until root's Done boundary.

### Mini recap

Local direct-to-main delivery is committed and verified. Source contracts and synthetic evidence are published; root owns acceptance and subsequent pruning. No new work or fleet migration was admitted to the batch.

## Done

Accepted by the principal's approved exact-set outcome batch; root independently reviewed the delivery and reviewer approved exact clean `b79a0941aa74891cca396457a4b9369e69399c5b`. Combined source `b953cb28d06715396692169ac28ae0392e3d664e` passed 874 tests, TypeScript and all required focused audits. Delivered source, limitations and synthetic evidence are recorded in Review. No remote push, publication, private indexing or live provider mutation occurred.

Retain this Done record because Arcadia coordination still refers to the roadmap pathname; that receiver must route its reference to the delivered search decision before pruning. Cross-repository preflight covered 22 local roadmap roots and five declared receiver KB roadmap roots; only roadmap metadata was read.

## Discussion

### Current user authority (2026-10-05)

The principal approved the upstream qmd pilot, explicit one-trust-boundary-per-registered-KB policy with no cross-KB sharing by default, registry/index contract, mirror labels and subsequent MCP search. Verification uses synthetic KBs, superseding the earlier private-corpus plan. Local runtime installation and model downloads are allowed for this bounded pilot; live private KB indexing, source-store access, provider operations, push, publish and runtime deployment remain outside authority. The approved harness plan is revised in place before implementation.

### Decision

Run a one-hour direct-CLI qmd pilot first as step one with a recorded go or no-go; the harness owns the Decision Record, the QUERY-mode update and the tokenomics guidance; tools-ki and mcp-ki-kb-fs work are separate trades. Installing qmd locally is fine; no remote services. Decided by the Fable reviewer under delegated autonomy, reversible.

### Why behind the surfaces

`mcp-ki-kb-fs` already knows bases, aliases, zones, access levels, protected paths and writes an audit log; a search hit is a read and belongs behind the same gate. qmd's own MCP has no authentication and only collection-level scoping. A stable `kb_search` vocabulary also lets the engine change without rewriting skills.

### Runtime shape

Each explicitly configured operator-managed loopback daemon owns one KB trust boundary and named index. The pinned HTTP handler has no request-level index selector or KB authentication; health is liveness only. The prior single-global-daemon/model-sharing proposal is superseded. KI gateways enforce current authorisation before expansion and snippets; loopback alone cannot prevent other local clients reaching the auxiliary daemon. No launchd or live binding is deployed by this work.

### Route gaps (resolved)

`mcp-ki-kb-fs` accepts only knowledge trades from this repository, so the `kb_search` request travels as a knowledge trade and that repository decides whether to capture its own work record. chezmoi has no route and is recorded for the owner.
