# GDR-KI-ARCADIA-002: Knowledge Islands ecosystem fundamentals

**Date:** 2026-07-18

## Context

Knowledge Islands is expressed through four primary repositories with different kinds of authority. Without an explicit shared boundary, philosophy can be mistaken for tooling, implementation can accidentally define a standard, normative specifications can be treated as explanatory publication, and vendored website material can become an untraceable parallel source.

## Decision

The four primary repositories have distinct authority:

- `ki-arcadia-principal` is the canonical source of the Knowledge Islands philosophy and conceptual model. It develops and proves the approach without mandating a particular tooling implementation.
- `ki-agentic-harness` is the canonical source of reusable agentic tooling that realises proven Knowledge Islands patterns. It supplies implementation experience but does not originate the philosophy or normative portable contracts.
- `ki-specifications` is the canonical source of normative portable contracts, including KIPs, KIS documents, schemas, templates, conformance rules, and reference examples. It formalises proven concepts and implementation evidence; an Active KIS governs implementations that claim conformance within its scope.
- `ki-website` is the autonomous public publication layer. It vendors source-labelled material from the other three repositories so it can build and deploy independently, but publication never transfers canonical ownership.

The authority and publication structure is:

```text
ki-arcadia-principal
|-- informs -----------> ki-agentic-harness
|-- informs -----------> ki-specifications
`-- publishes through -> ki-website

ki-agentic-harness
|-- informs/validates -> ki-specifications
`-- publishes through -> ki-website

ki-specifications
`-- publishes through -> ki-website
```

GDR002 is mutually mirrored across all four repositories. Any proposed modification must consider its effect on Arcadia Principal, the Agentic Harness, Specifications, and the Website, and must update all four mirrors coherently. Temporary drift is permitted only during a choreographed rollout that identifies the outstanding mirrors explicitly.

Cross-repository work is choreographed rather than centrally orchestrated. Each repository owns its priorities, plans, workspace, verification, and commits. A repository may place a concrete handoff in another repository's Stream or roadmap, naming its origin and whether it blocks or is blocked by the local item. Work should remain non-blocking and independently executable unless a genuine prerequisite requires otherwise.

## Consequences

- Changes to philosophy and conceptual model begin in Arcadia Principal.
- Reusable tooling realisations begin in the harness after the underlying pattern is established.
- Specifications receive conceptual input from Arcadia and implementation evidence from the harness; applicable Active specifications then constrain conforming implementations.
- The website can publish all three source repositories while remaining independently deployable and non-authoritative.
- The Website owns stable public routes such as `https://knowledgeislands.info/harness/install`; the Harness owns the bootstrap artifact to which that route resolves.
- Every primary repository states its place in this ecosystem near the top of its README and carries the shared progress, commit, and choreography conventions in runtime-neutral guidance.
