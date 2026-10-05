# Optional derived KB search

This contract governs optional retrieval behind `kb_search`, `ki kb search` and [QUERY](mode-query.md). The [adoption decision](../../../../docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-006-qmd-derived-kb-search-index.md) and [synthetic pilot](../../../../docs/decisions/references/qmd-synthetic-pilot.md) record the bounded functional go and measured costs. Search is explicitly provisioned; unavailable search falls back to literal grep and targeted reads.

## Authority and ingestion

Each stable registry KB ID receives one explicit owner-approved unique `search_boundary` assignment and an independent `ki-kb-<registry_id>` index. Reject absent, unsafe or duplicate assignments; do not infer them from a path, basename, visibility, company or Agora. No default cross-KB sharing is allowed. Shared model weights are distinct from private content caches.

Each generation is a private derived cache, built afresh from an isolated Markdown projection after declaration, zone, access and protected-path checks. Exclude symlinked files/directories, protected paths, undeclared zones, nested repositories and source-store binaries before the engine sees content. A later output filter cannot repair earlier ingestion or expansion. Refresh into a fresh database rather than carrying content or embeddings from removed or newly private notes. Retention or disposal of old private generations belongs to the owning implementation, never an unmanaged sweep.

Search binds an alias to an explicit registry ID and matching physical root, then applies current gateway access rules before expansion and snippets. Confirm current declaration and source hashes, validate the returned document against the generation mapping, and reconstruct title, snippets and provenance from authorised current local Markdown. Treat engine text as untrusted; a docid is only a corroborating content fingerprint. Cite repository-relative paths and line ranges.

## Derived configuration schema

The agreed mapping is `mapping.json` with `schema: ki/kb-search/v1`. The tools-ki `docs/specs/kb-search.md` owns native mechanics; these exact fields are the shared consumer boundary:

- **Identity:** `registry_id`, `repository`, physical absolute `root`, explicit `trust_boundary`, `index`, and safe opaque `generation` strings. `index` is exactly `ki-kb-<registry_id>`.
- **Engine:** `engine: {name: "qmd", version: "2.8.3", revision: "facd35e01359e59d938bc9418e93fb9318addee3"}`; `collections: [index]` contains exactly that one collection.
- **Declaration:** `purpose: {title, description}`, `zones: {Calendar, Pillars, Resources, Streams, Admin, inbound, outbound}` with declared local folder strings, and `declaration_sha256`, a full SHA-256 of the relevant declaration.
- **Generation files:** absolute owned `projection`, `config`, `database`, and `model_cache`. The generated config is `<owned-generation>/config/<index>.yml`, the database `<owned-generation>/index.sqlite`, and projection `<owned-generation>/projection`.
- **Endpoint:** `daemon_url` is null or an explicitly assigned strict loopback HTTP URL. It is a trusted operator binding, not an identity attestation from qmd.
- **Source declaration:** separate boolean `source_store_declared` and `source_store_binding_declared`; neither asserts private source existence, availability or completeness.
- **Documents:** `documents` maps `documents/<sha256(original-relative-path)>.md` to `{path: original-relative-path, sha256: full-raw-content-sha256}`. Projection names cannot convey an unapproved source path to the engine.

Use explicit `--index`, `QMD_CONFIG_DIR`, `INDEX_PATH` and `XDG_CACHE_HOME` when invoking qmd. The pinned engine reads `<QMD_CONFIG_DIR>/<index>.yml`; absent that override it uses `XDG_CONFIG_HOME/qmd/<index>.yml`. `INDEX_PATH` explicitly overrides the SQLite path. An explicit index prevents project-local `.qmd/index.yaml` discovery. Generate `models.embed`, `models.rerank` and `models.generate` as absolute already-provisioned local GGUF paths rather than lazy-download aliases. Lexical mode needs no model, vector mode needs embedding, CLI hybrid needs all three, and REST typed hybrid needs embedding and reranking. Missing files fail clearly; a search read never downloads models or provisions runtime state.

## Pinned engine protocol

The [inspected qmd 2.8.3 source](https://github.com/tobi/qmd/tree/facd35e01359e59d938bc9418e93fb9318addee3) and captured pilot JSON are authoritative for this version. Do not infer an endpoint from an older proposal or the moving main branch.

CLI commands are `qmd --index <index> search <query> --json`, `vsearch <query> --json`, and `query <query> --json`; `-n <limit>` bounds the results. `query` uses native expansion and reranking; lexical `search` preserves exact-identifier intent, and vector `vsearch` supplies semantic retrieval. Return value is a JSON array with `docid`, `score`, `file`, `line`, `title`, optional `context`, and `snippet`. The captured special path is `qmd://alpha/Mixed Case Note.md?index=ki-kb-alpha`.

Start each operator-managed auxiliary process with `qmd --index <index> mcp --http --host 127.0.0.1 --port <assigned-port>`. It owns one store/index, with no request-level index selector. HTTP `POST /query` (alias `/search`) accepts:

```json
{
  "searches": [{"type": "lex", "query": "literal terms"}, {"type": "vec", "query": "natural language"}],
  "collections": ["ki-kb-example"],
  "limit": 5,
  "minScore": 0,
  "candidateLimit": 40,
  "intent": "optional disambiguation",
  "rerank": true
}
```

`searches` is required; each type is `lex`, `vec` or `hyde`. The gateway validates a non-empty bounded array, exact names/types and explicit collection scoping before the request. REST does not accept a plain `query`; the actual plain-query probe returns 400. `collections` is plural; qmd silently ignores unknown fields, including singular `collection`. Do not send KB aliases, zones, access controls, paths, a REST index selector or a metadata filter and assume the engine enforces them. The pinned tag has no metadata-filter REST contract.

HTTP response is `{results: [...]}` with `docid`, `file`, `title`, finite `score`, optional `context`, positive `line` and numbered `snippet`. REST URI escaping differs from CLI: the captured special file is `qmd://alpha/Mixed%20Case%20Note.md`, with no named-index suffix. Validate and decode the known collection/path shape against the mapping; reject malformed paths, foreign collections and mismatched hashes. Engine line values are bounded structural hints and may be ignored; they are never canonical offsets. Captured snippets contain synthetic diff-hunk headers and numbering that differs from source lines. Reconstruct and validate the exposed line ranges against authorised current local Markdown; inaccurate engine coordinates alone do not reject an otherwise validated document. Never reuse backend title, snippet or context as trusted text. Lexical REST uses one `lex` search with `rerank: false`; vector uses one `vec` search with `rerank: false`; hybrid uses `lex` plus `vec` with reranking.

`GET /health` returns only `status` and `uptime`. Expose `index_attested: false`; reachable does not mean the expected index, fresh data or complete coverage. A wrongly assigned daemon may produce an indistinguishable empty result. Connection, timeout, malformed-response, missing-model, stale-generation or mapping failures must remain explicit unavailable/error states rather than empty successful retrieval.

Loopback and qmd's Origin/Host checks are useful transport limits, not KB authentication. Other local clients may reach the unauthenticated auxiliary daemon. Do not bind raw qmd directly to agents, expose it off-host, enable wildcard origin/host exemptions, or treat liveness as authorisation. The KI gateway and private generation handling supply the actual approved boundary.

## KI response and mirror labels

The shared response uses `schema: ki/kb-search-result/v1` with `registry_id`, `trust_boundary`, `index`, `generation`, `mode` (`query`, `search`, or `vsearch`), `profile`, `candidate_limit: 200`, `exhaustive: false`, boolean `truncated`, both source-store declaration booleans, and `results`.

Each result carries authorised repository `path`, local `title` and bounded `snippet`, finite `score`, corroborating `docid` (`#` plus the first six raw-content SHA-256 characters), positive `line_start` and ordered `line_end`, and `mirror_content`, `source_path`, `source_sha256`. The [source mirror contract](standards-source-mirrors.md) owns recognized provenance, the shared raw-frontmatter eligibility check, labels and fixtures. Invalid provenance projects to null in the KI response, with `mirror_content: unknown`; do not imply a usable private source from a malformed declaration.

`extract` means only valid declared provenance and the minimum body-text check. It cannot prove fidelity, freshness, binary existence or source authorisation. `pointer` and `unknown` results remain incomplete evidence. Engine snippets never expand to a binary source store, and bounded search never claims exhaustive inventory or source coverage.
