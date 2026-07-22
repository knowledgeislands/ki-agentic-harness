# Knowledge acquisition protocol handoffs

## Status

The KAF, KBEP, and KBIP documents in this directory are preserved source proposals, not yet canonical specifications. GOV-001 adopts their lifecycle direction while reconciling their boundaries before any implementation is accepted.

The original documents stay intact as evidence. Their authoritative successors, once adopted, belong in KI Specifications; this harness only holds the originating analysis and outbound briefs.

## Settled lifecycle

```text
external system
  → KAF acquisition
  → immutable Knowledge Export Package (KEP)
  → KBEP extraction
  → extracted knowledge package
  → KBIP governed ingress
  → Knowledge Island
```

KAF preserves source records, assets, provenance, integrity evidence, and only native source relationships. KBEP extracts, normalises, and reviews reusable knowledge from a KEP without changing the KEP. KBIP assigns canonical representation, governance, and publication treatment while retaining provenance back through KBEP to KAF.

## Source disposition

| Source | GOV-001 disposition | Proposed canonical owner |
| --- | --- | --- |
| `KAF-knowledge-islands-acquisition-framework.txt` | Adopt the acquisition boundary and ChatGPT-first direction; replace its concrete format and automation proposals through KEP v0 specification work. | KI Specifications and the receiving acquisition implementation. |
| `KBEP-knowledge-base-extraction-protocol.txt` | Retain as the downstream extraction proposal; clarify that external retrieval belongs to KAF and that KBEP consumes KEPs. | KI Specifications and KBEP implementation owner. |
| `KBIP-knowledge-base-ingress-protocol.txt` | Retain as the downstream ingress proposal; preserve its governance boundary and immutable upstream lineage requirement. | KI Specifications and Knowledge Base owner. |

## Deferred decisions

- Browser automation, undocumented APIs, authenticated scraping, and any use of browser profiles require a separate safety and feasibility decision.
- KEP archive encoding and optional signatures are not part of the first user-assisted pilot.
- The permanent implementation repository for connectors is not assumed by this harness; `tools-ki` receives only the CLI and first-pilot brief.
