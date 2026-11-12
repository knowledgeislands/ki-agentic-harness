---
id: orca.app
title: Orca app (Orca)
type: vendor-name
status: agreed
territory: knowledge-islands
island: ki-agentic-harness
vendor: Orca
origin: Cairn summit change 22, VENDORS-MORE and CARD-CLIENT a) (Kris, 12 November 2026)
links:
  industry.client:
    predicate: skos:broadMatch
  orca.runtime:
    predicate: dcterms:hasPart
---

# Orca app (Orca)

The Orca app is used in two senses, so each is its own link:

- **A client:** its window shows sessions from its own runtime, or from a remote one it is paired with, such as `orca serve` on another machine ([client][industry.client]).
- **An agent host:** it holds the [Orca runtime][orca.runtime], so one program is agent host and client in one ([OR1]).

[industry.client]: ./industry.client.md
[orca.runtime]: ./orca.runtime.md
[OR1]: ./sources.md#21-authoritative
