---
id: KI-HARNESS-OPS-009
title: Incremental ChatGPT acquisition path
kind: investigate
purpose: capability
theme: model
component: acquire
area: OPS
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-17T21:42:09Z
updated_at: 2026-10-20T22:26:28Z
---

# KI-HARNESS-OPS-009: Incremental ChatGPT Acquisition Path

## Goal

The harness knows whether a hybrid incremental path can keep ChatGPT acquisition current: local-cache change nomination, browser retrieval of new or changed readable sessions through the isolated browser trial, and periodic full-export reconciliation, with the evidence that browser coverage can be trusted before it is.

## Context

[KI-HARNESS-OPS-005 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/bf227839/docs/roadmap/KI-HARNESS-OPS-005-acquire-ai-sessions.md) was narrowed on 2026-10-14 to what it had delivered and accepted as done on 2026-10-17. Its eight unfinished steps were carried in the Notes of the [knowledge-acquisition Project](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/knowledge-acquisition.md) until a record was opened for them. Kris Brown decided on 2026-10-17 at 22:50 BST, in the knowledge-acquisition thread's SUCCESSOR-RECORD reply, to capture one follow-up record in this harness at Next for all eight, rather than one record per step.

Kris took OPS009-SPLIT a) on 20 October 2026 at 23:16 BST, in the ways-of-working "query sign-offs, first batch": split this record, keeping in the harness only the steps it owns. This record keeps the evaluation of the incremental path; [KI-HARNESS-OPS-010](KI-HARNESS-OPS-010-receiver-local-acquisition-triage.md) carries receiver-local triage and [KI-HARNESS-OPS-011](KI-HARNESS-OPS-011-separate-agent-session-acquisition.md) the separation of Claude and Codex acquisition from housekeeping, with the adapter decision. The importer, explicit-case, retirement and verification steps belong to `tools-ki`, which is asked to capture its own records for them.

Two open questions travel with the evaluation: the provisional Spirituality project binding, and what becomes of the 77 export files referenced by no conversation.

## Boundary

- In: the evaluation of the incremental path and the two open questions, recorded in the ChatGPT acquisition standard or a Decision Record.
- Out: the steps now carried by KI-HARNESS-OPS-010 and KI-HARNESS-OPS-011; the importer, explicit-case, retirement and verification steps `tools-ki` owns; any change to a sibling repository made from here; deleting or mutating a source conversation; the Pillars lifecycle note and the WhatsApp spool question, which the Project carried separately.

## Current state

Split on 2026-10-20, not yet planned. The staging checkpoint in OPS-005's Discussion is the evidence pattern the evaluation builds on.

## Steps

- [ ] Evaluate the hybrid incremental path: local-cache change nomination, browser retrieval of new or changed readable sessions through the isolated browser trial, and periodic full-export reconciliation before browser coverage is trusted.

## Files touched

To be set when planned.

## Verify

To be set when planned.

## Dependencies / blocks

[KI-HARNESS-GOV-087 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/715b369c95788974c77d7d578b883e6caea94179/docs/roadmap/KI-HARNESS-GOV-087-evaluate-obscura-browser-runtime.md) evaluated the local browser runtime the incremental path may use; it is done and pruned, and the two kept distinct owners. `tools-ki` owns the executable importer, and is asked to capture its own records for four steps split from here: connecting ChatGPT acquisition to a readable, authorised source that enumerates projects and returns complete conversations; representing unmapped projects, overlapping receiver mappings, missing sessions, changed sessions and failed reads explicitly; a separately invoked, fail-closed source-retirement manifest and provider-supported deletion path; and verifying one complete ChatGPT project move and one agent-session no-op before any source deletion is enabled. The source the importer connects to follows this evaluation. Receiver-owned executor or MCP changes are planned and accepted in their own repositories.

## Documentation impact

### Decision Records

To be set when planned; the acquisition and housekeeping seam in `ADR-KI-HARNESS-SKILLS-007` moved with KI-HARNESS-OPS-011.

### Specifications

None yet.

### Guides

None yet.

### Roadmap

The Knowledge acquisition Project closed on 20 October 2026, and this record carried its unfinished AI-session steps under the Model theme until the split of 2026-10-20 narrowed it to the incremental-path evaluation.

## Discussion

### Captured - 2026-10-17

Captured under `ki-next` on Kris Brown's SUCCESSOR-RECORD decision, directly at Next with status draft because the owner named the horizon. No planning has been done.

### Split - 2026-10-20

Under Kris's OPS009-SPLIT a), which lifted the capture gate for this split only, the harness kept the incremental-path evaluation here, captured KI-HARNESS-OPS-010 and KI-HARNESS-OPS-011 at this record's horizon and status, and sent the four `tools-ki` steps to the owning work's messages for `tools-ki` to capture. The title and kind now follow the narrowed scope; the file name is unchanged so existing links hold.
