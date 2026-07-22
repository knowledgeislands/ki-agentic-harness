# Knowledge acquisition command and ChatGPT pilot brief

**Origin:** `ki-agentic-harness` GOV-001

**Proposed recipient:** `knowledgeislands/tools-ki` (currently an initialised placeholder repository)

**Relationship:** propose this repository as the CLI implementation home only after it adopts its own roadmap item and plan. The harness owns the originating KAF boundary; a receiving implementation repository would own tests, release, and delivery.

## Requested outcome

If adopted, add the first safe `ki acquire` vertical slice: package a user-prepared ChatGPT capture directory into a locally selected, KEP-shaped evidence set. This is intentionally an import of user-obtained material, not a browser scraper or a ChatGPT API client.

## Command contract

Until this slice is released, `ki acquire` is a reserved unavailable command: it appears in neither completion nor ordinary help, performs no discovery or dispatch, writes a clear unavailable diagnostic to standard error, and exits `2`.

The first released form is:

```text
ki acquire chatgpt import <capture-directory> --output <kep-directory> [--dry-run] [--json]
```

- `<capture-directory>` is local user-prepared evidence, not a URL, browser profile, or session identifier.
- `--output` is required, must name a new or explicitly replaceable user-selected directory, and is the only location the command may write.
- `--dry-run` validates input and reports the deterministic output plan without writing.
- `--json` reports a versioned operation result; ordinary output remains concise and names omissions and limitations.
- `ki export` is not an initial compatibility alias. Add it only if a later adopted command contract establishes a distinct, non-confusing use.

## Input and output boundary

The importer accepts the controlled capture layout described in the originating [pilot procedure](../../../docs/guides/developer/knowledge-acquisition-pilot.md). It validates source-record metadata, asset references, native relationships, and duplicates before emitting the KEP v0 layout defined by KI Specifications.

It must not:

- control a browser, read browser profiles, use cookies, or contact ChatGPT;
- read a repository or infer a working directory;
- extract, summarise, deduplicate, classify, or govern knowledge;
- write checkpoints, credentials, caches, or generated payload outside the selected output;
- overwrite unrecognised output content.

## Integration with the KI CLI contract

The current CLI contract must be amended through its owning FND-003 manual work before this command is published. The manual must distinguish acquisition from package installation, harness binding, KBEP extraction, and KBIP ingress, and must say that the first release is a user-assisted local import.

`ki acquire` is a future top-level command group. It is not part of the initial `ki doctor` seed slice and does not change the existing user/repository lifecycle scopes.

## Definition of done

1. Fixtures prove deterministic output from the same input tree and report byte, manifest, relationship, and asset-reference drift.
2. Fixtures prove that dry-run is write-free and that no browser, network, repository discovery, credential, or child-process access occurs.
3. Fixtures prove refusal of malformed input, unsafe output paths, conflicting output, missing asset evidence, and non-native relationship records.
4. The emitted KEP passes the adopted KI Specifications validator and carries sufficient provenance for a later KBEP process.
5. Root and leaf HELP, completion, JSON output, diagnostics, and exit codes agree with the adopted CLI contract.

## Deferred work

- ChatGPT project enumeration, conversation fetching, asset downloading, and browser automation.
- OAuth, API keys, cookies, profiles, or any other authentication mechanism.
- Other connectors, checkpoint persistence, remote sources, and archive signing.
