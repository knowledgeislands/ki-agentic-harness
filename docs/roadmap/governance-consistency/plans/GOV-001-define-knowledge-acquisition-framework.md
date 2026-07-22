---
id: 'GOV-001'
title: Define the Knowledge Acquisition Framework and ChatGPT pilot
status: in-progress
roadmap: governance-consistency/establish-the-knowledge-acquisition-framework-kaf-for-session-and-project-recovery
blocks: FND-003
blocked-by: —
---

## Context

Knowledge Islands conversations, projects, attachments, and generated assets currently remain fragmented across agent sessions and third-party systems. The received Knowledge Acquisition Framework (KAF), Knowledge Base Extraction Protocol (KBEP), and Knowledge Base Ingress Protocol (KBIP) proposals describe a lifecycle that can recover this material without conflating faithful acquisition, knowledge extraction, and governed ingress.

KAF is the upstream acquisition boundary: it preserves source material and provenance in a portable Knowledge Export Package (KEP). KBEP extracts reusable knowledge from that package, and KBIP governs the extracted knowledge's admission into a Knowledge Island. The KAF CLI surface, notably `ki acquire`, must become part of the public KI CLI contract before FND-003 finalises its user guide and help manual.

## Current state

The KAF, KBEP, and KBIP proposals are preserved as inbound handoffs under `+/_HANDOFFS/`. They have not been adopted into a canonical specification, a receiving implementation repository, a package format, or a ChatGPT connector.

`FND-003` defines the initial KI CLI manual and seed-installation slice, but it has no settled acquisition command or KEP contract to describe. The CLI distribution specification establishes a package-and-binding direction, not an acquisition lifecycle.

## Steps

1. Reconcile the KAF, KBEP, KBIP, and KI CLI distribution proposals into one lifecycle map. Lock the separation of responsibilities: KAF acquires and preserves source material, KBEP extracts knowledge, and KBIP governs ingress. Record any unresolved ownership or terminology decision explicitly rather than resolving it by implementation.
2. Define the smallest portable KEP v0 contract: package identity, source/provenance metadata, source records, asset references, native relationships, integrity evidence, deterministic-output expectations, and the distinction between an immutable export and mutable acquisition checkpoint state. Identify the canonical specification owner and the receiving implementation owner without creating either repository's work unilaterally.
3. Define the KAF connector contract and a first safe acquisition profile. The first profile is a user-assisted ChatGPT project or conversation export that preserves available message order, roles, timestamps, identifiers, attachments, and generated assets; browser automation, authenticated scraping, and undocumented APIs remain explicitly deferred pending a separate safety and feasibility decision.
4. Reconcile the public `ki acquire` command with FND-003 and the existing CLI distribution handoff. State its intended scope, no-write or write boundaries, initial availability, package destination, and how it differs from installation, binding, KBEP, and KBIP. Do not implement the command in this harness.
5. Write implementation-ready outbound briefs for the canonical specification owner and the receiving CLI or acquisition implementation owner. Each brief must name the locked contract, deferred decisions, first-pilot acceptance criteria, and receiving repository ownership; do not infer acceptance or create remote roadmap items.
6. Prepare a controlled first-pilot procedure for exporting one user-selected ChatGPT project or conversation into a KEP-shaped evidence set. It must preserve source fidelity and provenance, keep credentials and private data out of version control, and identify the later KBEP/KBIP handoff without performing extraction or ingress.
7. Update the affected KI CLI manual plan, roadmap dependencies, and inbound-handoff disposition to reflect the settled KAF route. Verify the roadmap and documentation surfaces, then prepare this plan for manual acceptance.

## Files touched

- `docs/roadmap/governance-consistency/ROADMAP.md` and this plan
- `docs/roadmap/foundation-tooling/plans/FND-003-define-ki-cli-user-guide-and-manual.md`
- `+/_HANDOFFS/` disposition material for KAF, KBEP, and KBIP
- `-/_HANDOFFS/` implementation-ready specification and receiving-repository briefs
- KAF/KEP lifecycle documentation in this repository, only where it is the agreed interim owner

## Verify

1. The lifecycle map makes it impossible to mistake acquisition for extraction or governed ingress, and names a durable owner for every proposed public contract.
2. The KEP v0 contract supports a lossless, provenance-preserving, deterministic export without embedding credentials, binaries in Markdown, or inferred knowledge relationships.
3. The first ChatGPT pilot is user-assisted, consent-aware, resumable in its declared local state, and produces material that a later KBEP process can consume without returning to the original session.
4. The `ki acquire` interface agrees with the CLI manual plan and distribution handoff without broadening this repository into the CLI's implementation home.
5. Each outbound brief has a named receiving owner and an explicit adoption boundary; no remote roadmap or implementation change occurs here.
6. `bun run ki:repo-roadmap:audit` and `bun run ki:authoring:audit` pass, with focused link or documentation checks where applicable.

## Dependencies / blocks

This plan is intentionally first in the immediate queue because it establishes the acquisition boundary needed to recover the knowledge currently trapped in agent sessions and projects.

It blocks FND-003 only for the public acquisition command and its terminology. FND-003 may retain its existing evidence and implementation research, but must not finalise a public CLI manual that omits or contradicts the KAF contract.
