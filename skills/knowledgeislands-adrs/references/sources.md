# Sources — where the ADR standard comes from

**Refresh:** external-spec · annually (ADR conventions are stable; re-fetch when writing guidance or tooling changes are suspected)

The authoritative sources behind [the format standard](adr-format.md), [the rubric](audit-rubric.md), and
[`../scripts/audit-adrs.ts`](../scripts/audit-adrs.ts). Mode REFRESH reads this file, re-fetches each source, diffs it against the
standard + script, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below. The ADR format has been stable
since 2011; changes are rare but worth confirming before a major tooling investment.

## Authoritative

| Source                                                                          | Governs                                                                                                                                                    | Last reviewed |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| [Michael Nygard — Documenting Architecture Decisions (Cognitect, 2011)][nygard] | the five canonical sections, Status values, writing guidance (active voice, one to two pages, immutability of Accepted records)                            | 2026-06-23    |
| [Martin Fowler — Architecture Decision Record (bliki)][fowler]                  | summary of best practices: inverted pyramid, forces framing, confidence level, storage in source repo, numbered monotonic files                            | 2026-06-23    |
| [npryce/adr-tools (GitHub)][adr-tools]                                          | tooling conventions: bidirectional superseded links (`-s` flag), self-documenting bootstrap ADR, default storage path `doc/adr`, sequential auto-numbering | 2026-06-23    |

## Last review

REFRESH last run **2026-06-23** — all three sources fetched on this date to establish the initial standard.

- **Nygard (Cognitect, 2011)**: five sections confirmed (Title, Context, Decision, Status, Consequences); Status values confirmed (Proposed,
  Accepted, Deprecated, Superseded); immutability of Accepted records confirmed; one-to-two-page target confirmed. No changes since original
  publication.
- **Fowler (bliki)**: confirms Nygard as the originating reference; adds "forces" framing for Context, inverted-pyramid structure (most
  important first), confidence level annotation (not adopted into the house standard — too speculative for a mechanical check), and storage
  in-repo. No divergence from Nygard's core format.
- **npryce/adr-tools**: bidirectional superseded links are the key tooling convention adopted here (the `superseded-link [M]` check). The
  `doc/adr` default path and self-documenting bootstrap ADR are noted but not mandated — the house standard uses `docs/decisions/` and does
  not require a bootstrap ADR.
- **Open watch-items:** (1) npryce/adr-tools repository maintenance status — the tool is widely referenced but has had infrequent commits;
  confirm it remains the canonical tooling reference at next refresh. (2) Fowler's confidence-level annotation — worth revisiting if the
  team wants to add a lightweight uncertainty marker to the Status block.

[nygard]: https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
[fowler]: https://martinfowler.com/bliki/ArchitectureDecisionRecord.html
[adr-tools]: https://github.com/npryce/adr-tools
