---
id: KI-HARNESS-GOV-116
area: GOV
title: Define per-item task links
theme: governance-consistency
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 89f4cd8f7fe4c1cb46d22903c28f4e1fe1b0435d
created_at: 2026-09-27T13:06:48Z
updated_at: 2026-09-27T13:26:59Z
---

# KI-HARNESS-GOV-116: Define per-item task links

## Goal

Every local KI roadmap item can carry durable, qualified references to tasks in Paperclip or other task systems, including multiple tasks per item. Readers can distinguish those associations from current ownership and KI acceptance without a shared lookup table.

## Context

The human approved per-item links and asked on 2026-09-27 to implement them alongside a bounded KI recovery batch. The existing [KIS-5 plan](http://127.0.0.1:3100/KIS/issues/KIS-5#document-plan), revision `cbcba3b3-82f2-44dd-9f1f-37d1b672ec71`, records the field proposal. The first four harness items now carry verified interim prose references under commit `d06813d36c2098e24eb8703dda105a7c0f212243`. The `tools-ki` parser rejects nested common frontmatter, so this normative contract must land with a separate CLI change. GOV-103 owns citations and GOV-107 owns audit questions; neither owns this field. Held Techné provenance remains held.

## Boundary

Define the shared work-item field, its identity and validation semantics, and the Paperclip prose backlink and reconciliation rules. The field applies to local project roadmaps and Knowledge Base Streams through the shared format. The parser, public projection, CLI specification and tests belong to the separate `tools-ki` item. This item does not resume agents, add a central mapping registry or remote sync, reopen GOV-103 or GOV-107, or alter Techné work.

## Current state

The work-item format has no `task_links` field; the Paperclip coordination standard permits a task-side locator but lacks the item-side format. A link is durable association evidence, not a live task claim or a copied provider lifecycle. Missing links and paused agents cannot prove work is unassigned. KIS-5 is the existing Paperclip task for this contract and the related CLI delivery; no new Paperclip task is needed.

## Steps

- [x] Define optional provider-keyed `task_links` on each work item, using the six qualified string fields and six relation values in the accepted KIS-5 plan; specify stable identity, within-item duplicates, multiple providers and refs, and backwards compatibility.
- [ ] State that a link preserves evaluation or delivery history, while a current claim or release requires explicit item-local reconciliation and a fresh check of task and worktree evidence. Keep roadmap writes in the designated primary checkout.
- [ ] Specify a task-side ordinary-prose backlink near the top with canonical repository, governing item, admitted revision and bounded purpose; permit related links across items but at most one governing item per delivery task.
- [ ] Update the roadmap and Paperclip judgment rubrics and their publication/tests without claiming a remote-backed mechanical check.
- [ ] Independently review the contract against the `tools-ki` implementation and the four interim pilot items.

## Files touched

The `ki-work-roadmap` work-item and repository standards, the `ki-agent-coordination-paperclip` standard, their focused rubric sources and generated publications, and focused catalogue tests. No other repository's source is edited under this item.

## Verify

Run the focused `ki-skills` and roadmap/coordination audits, rubric generation checks, `bun run test`, and `bunx tsc --noEmit`. Confirm examples cover multiple qualified links, historical versus current ownership, task prose backlinks, local and KB Streams applicability, and the held-work boundary. Independently compare the final field contract with the `tools-ki` parser and CLI specification.

## Dependencies / blocks

The sibling `tools-ki` item implements the same reviewed contract; this is cross-repository delivery sequencing, not a `blocked_by` dependency in this repository. Integration of retained KIS-39 work should be reviewed first because it touches the harness standards and rubrics. No held Techné work is a prerequisite.

## Delegation

Sol coordinates. A bounded harness worker edits only the standards, rubrics and focused tests after the KIS-39 recovery candidate has been dispositioned. A separate tools-ki worker owns parser, specification and CLI tests in its primary checkout. Sol compares both sides, runs final gates and returns evidence; an independent reviewer checks the exact combined result before local integration.

## Documentation impact

### Decision Records

No new decision record: the human-selected per-item storage and no-registry boundary are already in the KIS-5 plan and this scoped record.

### Specifications

The shared format changes here; the executable CLI specification changes under the tools-ki item.

### Guides

The Paperclip coordination standard explains task backlinks and reconciliation; no separate user guide is needed for this bounded contract.

### Roadmap

The tools-ki sibling owns parser delivery. GOV-103 and GOV-107 remain independent; interim prose links migrate only after the parser is verified.

## Discussion

### Identity and availability

The qualified task ID, not its readable key or URL, is the identity. Relations explain why an item references a task and survive completion. A current ownership claim must be independently reconciled and recorded locally; historical associations never reserve an item forever, and missing associations never release retained work.
