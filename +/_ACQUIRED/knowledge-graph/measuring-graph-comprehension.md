---
id: measuring-graph-comprehension
title: Measuring Graph Comprehension
type: concept
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: future-concept
links:
  graph:
    predicate: ki:applies-to
  disclosure:
    predicate: skos:related
---

# Measuring Graph Comprehension

Kris asked on 2 November 2026 how to tell whether the [Knowledge Graph][graph] is actually helping: whether it improves an agent's comprehension, supports [Progressive Disclosure][disclosure] when a topic is taken up, and improves token economics.

## A first answer

The first answer was "partly, and not yet measurably". In one night's curation a single routing card and one link placed the material, existing cards were linked to rather than redefined, and the checks caught a broken link and a malformed date. On the other hand the agent fell back on searching a repository that was not in graph shape, chose link types by counting their use elsewhere because none was defined, checked for duplicates by searching rather than by asking the graph, and spent most of its tokens on coordination rather than knowledge.

## Candidate measures

1. **Paired trials:** the same question answered from the graph and from the repositories alone, comparing files read, tokens, tool calls and correctness.
2. **Session-trace counts:** reads per task, and card hops against searches.
3. **Hop counts** for a fixed set of questions.
4. **The concept check's trend** over time.

## The cost curve

Creating many new connections is likely to cost more at first. Once they are in place, an agent can quickly find a route to where the graph needs augmenting, or see that the knowledge is already there. A key return is noticing that something is already covered when it comes up again, rather than capturing it twice.

This is a future concept; Kris asked that it not be sent anywhere or turned into process yet.

[graph]: ./knowledge-graph.md
[disclosure]: ./progressive-disclosure.md
