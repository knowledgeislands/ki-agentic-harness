---
id: semantic-reasoning
title: Semantic Reasoning and Evidence
type: concept
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  graph:
    predicate: ki:applies-to
  kiri:
    predicate: ki:proposed-capability-of
  vocabularies:
    predicate: skos:related
  semantic-markdown:
    predicate: skos:related
  rdf:
    predicate: skos:related
  views:
    predicate: skos:related
  permeability:
    predicate: skos:related
  foundations:
    predicate: skos:related
---

# Semantic Reasoning and Evidence

The [Knowledge Graph][graph] distinguishes explicitly asserted relationships, [ordinary untyped links][semantic-markdown], and logically inferred relationships. [KIRI][kiri] should eventually expose configurable inference, with an option to return only assertions or include derived statements.

[RDF][rdf] graphs use an open-world interpretation: a missing statement is not normally evidence that it is false. RDFS domain and range declarations permit inferences; they do not validate data. Validation rules such as SHACL are a separate concern. Inverse relationships may be inferred with OWL or equivalent rules, not basic RDF alone.

An assertion is what the graph itself states; a claim is what a source states, recorded with its attribution rather than asserted by the graph. RDF 1.2 triple terms and reifiers can help describe claims and particular reports of claims. Provenance should distinguish who asserted something, supporting evidence, confidence, derived consequences and factual accuracy. Provenance also covers what a summary or view was derived from, as [Knowledge Views and Projections][views] sets out, and where a card came from, as Knowledge Independence sets out. In plain words, this is showing your working: a claim carries its attribution, evidence, confidence and source. A report of a claim does not establish its truth.

A summary derived from other knowledge is also derived knowledge. The proposed model should preserve the basis of summaries; detecting when their dependencies have changed is covered by [Knowledge Views and Projections][views]. Candidate vocabularies for provenance and [cross-island concept mappings][permeability] are set out in [Semantic Vocabularies][vocabularies]. [RDF 1.2 features remain subject to library and standards maturity checks][foundations]. Testing these distinctions in a prototype, covering statement provenance, reifiers, evidence, confidence and inference, is future work.

[graph]: ./knowledge-graph.md
[rdf]: ./rdf.md
[kiri]: ./kiri.md
[views]: ./knowledge-views.md
[vocabularies]: ./semantic-vocabularies.md
[semantic-markdown]: ./semantic-markdown.md
[permeability]: ./semantic-permeability.md
[foundations]: ./rdf-foundations.md
