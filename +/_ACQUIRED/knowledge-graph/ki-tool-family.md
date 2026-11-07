---
id: ki-tool-family
title: KI Tool Family
type: naming-convention
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  kiri:
    predicate: ki:has-member
  kig:
    predicate: ki:has-member
  kiv:
    predicate: ki:has-member
  semantic-markdown:
    predicate: ki:has-candidate-member
  graph:
    predicate: skos:related
  territory:
    predicate: skos:related
---

# KI Tool Family

The [Knowledge Islands][territory] tools share one naming theme: **KI** followed by a short word or a letter or two, written in capitals as a name and in lower case as a command. Kris wants to build on this theme, so new tools and formats are named to follow it.

## Members

- [KIRI][kiri] is the engine library underneath the others, which interprets cards into the [Knowledge Graph][graph].
- [KIG][kig] is the command line over KIRI.
- [KIV][kiv] is the viewer, a working name for the local viewer prototype.
- **KITE** is a name Kris would like to use, perhaps for a Knowledge Islands Telemetry Explorer. What it would be is open, and no tool carries it yet.

[Semantic Markdown][semantic-markdown], the card format, is a candidate member: it wants a short name in the family, such as KISM or KIMD, not yet chosen.

The family is separate from the existing `ki` command-line tooling, which keeps its own name and role until integration is deliberately planned.

## Open questions

- What should KITE be, and is Knowledge Islands Telemetry Explorer its meaning?
- Which short name should the card format take?

[kiri]: ./kiri.md
[kig]: ../../../tools-kig/tools-kig.md
[kiv]: ./kiv.md
[semantic-markdown]: ./semantic-markdown.md
[graph]: ./knowledge-graph.md
[territory]: ../../../knowledge-islands.md
