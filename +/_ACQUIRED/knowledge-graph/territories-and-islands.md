---
id: territories-and-islands
title: Territories and Islands
type: concept
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  knowledge-islands:
    predicate: skos:related
  sovereignty:
    predicate: skos:related
  rdf:
    predicate: skos:related
  iri:
    predicate: skos:related
  atomicity:
    predicate: skos:related
---

# Territories and Islands

A territory is a jurisdiction with identifiable authority over its knowledge namespace and the islands within it. An island is a point of curation: islands can curate knowledge independently while remaining semantically interoperable, as [Semantic Sovereignty][sovereignty] sets out. [Knowledge Islands][knowledge-islands] is one such territory.

Each island is realised as exactly one Git repository: one island, one repository. An island may also have other stores alongside its repository. A store is a place where an island keeps material, such as a binary store for files that do not belong in Git.

A territory governs its jurisdiction and naming authority and manages its namespace policy, and it may delegate naming to its constituent islands. Governance authority is distinct from semantic identity: an [IRI][iri] identifies a resource but does not itself prove the right to govern it.

Territories and islands are independently governed graph-level entities. Federated territories, such as Knowledge Islands and Humans Not Robots, form a [graph of graphs][atomicity], which is distinct from the individual nodes in an [RDF][rdf] graph.

[sovereignty]: ./semantic-sovereignty.md
[knowledge-islands]: ../../../knowledge-islands.md
[rdf]: ./rdf.md
[iri]: ./iri.md
[atomicity]: ./contextual-atomicity.md
