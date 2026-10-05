# qmd synthetic retrieval pilot

This measured pilot supports a bounded functional go for optional explicitly provisioned KI search. It opens no private KB or binary source store. The [complete JSON evidence](qmd-synthetic-pilot.json) contains original questions, all method results, supplementary predeclarations, complete synthetic corpora, model hashes, index/config records and captured protocol frames.

## Method

The pinned engine is qmd 2.8.3, source commit `facd35e01359e59d938bc9418e93fb9318addee3`. Install and model downloads use task-owned runtime directories. Alpha and Omega use independent explicitly assigned boundaries and named indexes, each with eight operational notes plus one path-case/space probe. Raw protected and undeclared canary notes never enter either projection. The initial eight questions per corpus are retained unchanged. Two further paraphrases per corpus are predeclared before their execution, for ten question instances per corpus.

qmd runs the actual native `query --json -n 3` expansion/hybrid/rerank path. The comparison uses case-insensitive whole-word OR keywords with `rg -n -i -w -m 3`, the first three candidate files, and thirteen-line targeted windows; returned grep output and read text are counted together. Cold process startup and model loading are included in qmd wall time. The first substring baseline accidentally matched `rail` inside `trail`; its actual measurements are preserved under `grep_substring_initial`, and the stronger whole-word baseline was rerun without changing qmd observations.

Counts are exact returned Unicode characters and UTF-8 bytes, not tokenizer counts or billing. Quality means the expected note appears among the three candidates; it does not measure complete answer extraction, prose accuracy or production quality.

## Results

Both methods find 16/16 expected notes for the original question instances. Alpha median context/time is 1,705.5 characters / 7.744 seconds for qmd versus 1,228.5 / 0.008651 for grep plus targeted reads. Omega is 1,716.5 / 9.192 versus 1,228.5 / 0.008570. qmd has no demonstrated quality, context or latency advantage on those small corpora.

The supplementary predeclared paraphrases find the expected note in 4/4 qmd cases and 0/4 bounded literal-grep cases. All results and failures remain in the evidence; these four small instances demonstrate semantic capability, not a large-corpus or private-scale benefit.

| Q | KB | Expected | Grep | qmd | Grep chars / s | qmd chars / s |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | alpha | Renewal | found | found | 2259 / 0.0175 | 1663 / 9.813 |
| 02 | alpha | Restoration | found | found | 1197 / 0.0087 | 1885 / 9.943 |
| 03 | alpha | Travel | found | found | 1158 / 0.0088 | 1714 / 9.202 |
| 04 | alpha | Incident | found | found | 3561 / 0.0086 | 1657 / 7.582 |
| 05 | alpha | Retention | found | found | 1275 / 0.0089 | 1832 / 7.568 |
| 06 | alpha | Grant | found | found | 1185 / 0.0085 | 1697 / 7.907 |
| 07 | alpha | Access | found | found | 1212 / 0.0086 | 1521 / 7.526 |
| 08 | alpha | Release | found | found | 1245 / 0.0081 | 1717 / 7.185 |
| 09 | omega | Renewal | found | found | 2259 / 0.0104 | 1663 / 7.783 |
| 10 | omega | Restoration | found | found | 1197 / 0.0087 | 1886 / 8.099 |
| 11 | omega | Travel | found | found | 1158 / 0.0079 | 1716 / 9.475 |
| 12 | omega | Incident | found | found | 3561 / 0.0077 | 1747 / 9.499 |
| 13 | omega | Retention | found | found | 1275 / 0.0086 | 1832 / 9.642 |
| 14 | omega | Grant | found | found | 1185 / 0.0084 | 1697 / 10.175 |
| 15 | omega | Access | found | found | 1212 / 0.0091 | 1521 / 8.909 |
| 16 | omega | Release | found | found | 1245 / 0.0086 | 1717 / 8.594 |
| 17 | alpha | Restoration | miss | found | 11790 / 0.0176 | 1847 / 9.741 |
| 18 | alpha | Access | miss | found | 2 / 0.0106 | 1786 / 8.456 |
| 19 | omega | Restoration | miss | found | 11790 / 0.0180 | 1847 / 8.529 |
| 20 | omega | Access | miss | found | 2 / 0.0106 | 1687 / 8.447 |

## Protocol and failure evidence

Actual HTTP typed hybrid plus reranking and vector-only retrieval both return Alpha Restoration first. A plain REST `{query}` request returns 400 because `searches` is required. Origin and Host probes return 403. Canary lexical search returns an empty result, backed by the complete index path inventory showing their exclusion. These are transport/ingestion checks, not KB authentication proofs.

CLI preserves a special path as `qmd://alpha/Mixed Case Note.md?index=ki-kb-alpha`; REST uses `qmd://alpha/Mixed%20Case%20Note.md` without the index suffix. Health exposes only `status` and `uptime`. Each configured process serves one index; health cannot attest which index. Raw snippets contain diff-hunk wrappers and synthetic numbering, so original source coordinates must be reconstructed from authorised Markdown, not copied from those prefixes.

## Decision and limitations

Go for optional derived retrieval behind KI surfaces, based on correct retrieval, independent indexes and the pinned protocol. Retain exact-identifier lexical handling and explicit grep/targeted-read fallback. The overhead on the original cases is real; no automatic deployment, installation, daemon, binding, private indexing or efficiency claim is authorised. Model weights occupy 2,255,183,040 bytes; runtime memory and large-corpus capacity were not benchmarked.

The supplementary run stays inside the one-hour window measured from the task-owned model-pull log creation. The JSON retains exact timestamps and measured elapsed seconds. The native pilot processes are stopped, named SQLite indexes/configs and synthetic projections are removed, and the task-owned model cache, upstream pinned checkout and non-sensitive logs remain for reproducibility. Endpoint-unavailable evidence is recorded separately from an empty successful result.

## Reproduction

The JSON embeds both synthetic projections byte-for-byte, questions, engine revision, model filenames and SHA-256 hashes, index names and config frames. Recreate only those projections in new task-owned directories, check the recorded pinned source/model identities, run `collection add`, declared context, `embed`, then the recorded CLI questions and typed HTTP frames. Do not substitute a private corpus or an unreviewed engine version.
