---
name: ki-acquire
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Govern source-independent knowledge capture: supplied scope, provenance, routing, faithful preservation,
  retry identity, required originals and verified destinations. Use for common acquisition rules and direct intake;
  ki-acquire-chatgpt and ki-acquire-granola own their provider contracts, and ki-trades owns downstream movement.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# Knowledge acquisition

Read [the common acquisition standard](references/standards-acquisition.md), then the receiving repository's capture entry point and only the applicable source route. A simple supplied text needs no provider integration or runtime handoff. Keep the response proportionate to the requested preservation.

This skill owns the common capture contract. Provider skills add source completeness and capability requirements; they do not replace the common contract. Repository guides supply local paths, receipt schemas, publication authority and practical environment steps. Knowledge Islands owns the durable lifecycle and rationale; tools-ki owns executable importers and state persistence.

Read the [generated rubric](references/rubric.md) for the review criteria. The shared operation is establish scope, discover existing identity, route, preserve, verify and report. This skill neither supplies a source adapter nor changes provider permissions. It accepts no repository configuration properties.

## Operating modes

For `help`, `-h`, `?` or no recognised mode, explain the contract, modes and source-specific off-ramps without capturing anything; offer a mode choice only in an interactive session.

### Mode AUDIT

Run `ki repo audit --skill ki-acquire --repo <repo>`. Review separately supplied request/package evidence against the common standard. Policy judgments require that evidence: the mechanical audit does not prove source fidelity or successful acquisition. Missing evidence stays a named gap. Do not contact a provider merely to make an audit complete.

### Mode CONFORM

Run AUDIT, then `ki repo conform --skill ki-acquire --repo <repo> --dry-run`. The host may regenerate rubric publication. This mode does not create receipts, choose routes, rewrite source bytes, move checkpoints, publish captures or retire sources. Authored procedure changes need their own owner-approved scope.

### Mode EDUCATE

Explain the common workflow, request/package/state distinction and relevant local entry point. Route provider-specific completeness to its acquisition skill. Do not acquire content or invent local paths just to demonstrate the contract.

### Mode REFRESH

REFRESH writes only in the canonical `ki-agentic-harness` repository. From an installed copy, stop and redirect there. Read [the sources](references/sources.md), compare the durable acquisition model and actual capture trials, then propose and verify the smallest common-contract correction. Provider capability refresh remains with its provider skill. This mode grants no source access, scheduling or provider mutation.
