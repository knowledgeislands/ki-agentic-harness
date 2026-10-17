---
id: KI-HARNESS-OPS-009
title: Complete AI session acquisition
kind: deliver
purpose: capability
project: knowledge-acquisition
component: acquire
area: OPS
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-17T21:42:09Z
updated_at: 2026-10-17T21:42:09Z
---

# KI-HARNESS-OPS-009: Complete AI Session Acquisition

## Goal

AI-session acquisition is complete for the sources the knowledge-acquisition Project covers: a readable, authorised source enumerates ChatGPT projects and returns complete conversations, every unmapped, overlapping, missing, changed or failed case is explicit, acquired sessions are triaged in their receiving repository, Claude and Codex acquisition is separated from housekeeping, and a source is retired only through a fail-closed, human-approved manifest after one complete ChatGPT project move and one agent-session no-op are verified.

## Context

[KI-HARNESS-OPS-005](KI-HARNESS-OPS-005-acquire-ai-sessions.md) was narrowed on 2026-10-14 to what it had delivered and accepted as done on 2026-10-17. Its eight unfinished steps were carried in the Notes of the [knowledge-acquisition Project](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/knowledge-acquisition.md) until a record was opened for them. Kris Brown decided on 2026-10-17 at 22:50 BST, in the knowledge-acquisition thread's SUCCESSOR-RECORD reply, to capture one follow-up record in this harness at Next for all eight, rather than one record per step.

Two open questions travel with the steps: the provisional Spirituality project binding, and what becomes of the 77 export files referenced by no conversation.

## Boundary

- In: the eight steps below, delivered in the harness and, where they touch a sibling repository, by that repository's own record.
- Out: any change to a sibling repository made from here; deleting or mutating a source conversation without a current exact manifest and the owner's approval immediately before; the Pillars lifecycle note and the WhatsApp spool question, which the Project carries separately.

## Current state

Captured, not yet planned. The staging checkpoint in OPS-005's Discussion is the evidence pattern the steps build on. The steps will likely split into separate records when planned; that is a `ki-plan` decision.

## Steps

- [ ] Evaluate the hybrid incremental path: local-cache change nomination, browser retrieval of new or changed readable sessions through the isolated browser trial, and periodic full-export reconciliation before browser coverage is trusted.
- [ ] Connect ChatGPT acquisition to a readable, authorised source that can enumerate projects and return complete conversations with their write-ups and assets.
- [ ] Represent unmapped projects, overlapping receiver mappings, missing sessions, changed sessions and failed reads explicitly without guessing or silently dropping content.
- [ ] Add receiver-local triage after acquisition so complete sessions can be harvested, retained as source evidence, routed onward, or marked as containing no residual knowledge.
- [ ] Separate Claude and Codex acquisition guidance from their housekeeping skills, using exception-based full-session import rather than routine bulk import.
- [ ] Decide whether the existing `mcp-housekeeping-*` repositories remain shared read-only source adapters or need acquisition-specific names or projections.
- [ ] Implement a separately invoked source-retirement manifest and provider-supported deletion path that fails closed on incomplete, changed, uncommitted or unverifiable acquisitions; deletion stays unavailable until every manifest entry has a recoverable acquired copy, the source still matches the manifest and the human approves that exact current manifest.
- [ ] Verify one complete ChatGPT project move and one completed agent-session no-op before enabling any source deletion.

## Files touched

To be set when planned.

## Verify

To be set when planned.

## Dependencies / blocks

[KI-HARNESS-GOV-087 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/715b369c95788974c77d7d578b883e6caea94179/docs/roadmap/KI-HARNESS-GOV-087-evaluate-obscura-browser-runtime.md) evaluated the local browser runtime the incremental path may use; it is done and pruned, and the two kept distinct owners. Receiver-owned executor or MCP changes are planned and accepted in their own repositories.

## Documentation impact

### Decision Records

To be set when planned; `ADR-KI-HARNESS-SKILLS-007` still assigns acquisition semantics to housekeeping skills.

### Specifications

None yet.

### Guides

None yet.

### Roadmap

The Project's Notes list these steps; once this record exists the Project can point to it.

## Discussion

### Captured - 2026-10-17

Captured under `ki-next` on Kris Brown's SUCCESSOR-RECORD decision, directly at Next with status draft because the owner named the horizon. No planning has been done.
