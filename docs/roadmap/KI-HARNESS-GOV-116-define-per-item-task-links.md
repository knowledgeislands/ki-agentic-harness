---
id: KI-HARNESS-GOV-116
area: GOV
title: Define per-item task links
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 89f4cd8f7fe4c1cb46d22903c28f4e1fe1b0435d
task_links:
  paperclip:
    - authority: http://127.0.0.1:3100
      scope: 558dd49e-7615-409f-b7b2-7f19e22171d9
      id: b76a4ec9-be48-4a3c-8568-7885b5e6789b
      key: KIS-5
      url: http://127.0.0.1:3100/KIS/issues/KIS-5
      relation: related
created_at: 2026-09-27T13:06:48Z
updated_at: 2026-09-27T22:06:13Z
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
- [x] State that a link preserves evaluation or delivery history, while a current claim or release requires explicit item-local reconciliation and a fresh check of task and worktree evidence. Keep roadmap writes in the designated primary checkout.
- [x] Specify a task-side ordinary-prose backlink near the top with canonical repository, governing item, admitted revision and bounded purpose; permit related links across items but at most one governing item per delivery task.
- [x] Update the roadmap and Paperclip judgment rubrics and their publication/tests without claiming a remote-backed mechanical check.
- [x] Independently review the contract against the `tools-ki` implementation and the four interim pilot items.

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

## Review

### Delivered

The provider-neutral per-item association contract, Paperclip backlink guidance, rubric judgments, and offline harness audit are implemented in the designated primary checkout's local `main` delivery window. The tools-ki CLI implementation is separately committed at `c0857d5652060d644fecc7c2f20a308f59feec7c` and awaiting KI review. Seven verified pilot item maps now exist across the two primary checkouts, including the recovered KIS-39 delivery. KIS-5 is recorded only as related planning context, not as the implementer of this direct-session delivery. Nothing was pushed, accepted, resumed, or released from hold.

### Change Summary

The work-item format owns six qualified string fields and six relationship values, with no shared mapping table or provider status cache. The roadmap and Paperclip standards describe primary-checkout writes and task-side delivery backlinks. ITEM-6 and COORD-3 provide judgment review; ITEM-1 now validates nested YAML task links offline using the same YAML interpretation as tools-ki. Six harness records gained verified Paperclip references; the seventh pilot is the tools-ki CLI item. The harness audit parser, focused test, and direct YAML dependency are the necessary additional harness-local files beyond the initial list.

### Verification

- Focused task-link and rubric tests, full `bun run test`, `bunx tsc --noEmit`, and focused Biome checks passed.
- Generated roadmap and Paperclip rubric publications match their catalogues. `ki repo audit --skill ki-skills`, `ki-work-roadmap`, and `ki-agent-coordination-paperclip` passed; focused Markdown checks passed.
- An independent reviewer checked the harness/CLI parser boundary, including escaped YAML identity, and parsed all seven pilot items with the committed tools-ki parser. No material defect remained.

### Outstanding concerns

KI acceptance remains a human review action for this item and the tools-ki sibling. The seven pilot associations are not a complete estate census or a release of retained tasks; missing links and paused agents do not prove availability. KIS-5 remains backlog planning context. Paperclip agent resumption, remote delivery, held Techné work, and KIS-39 workspace cooldown configuration remain separately governed.

### Post-change review

The independent review found no material defect in the corrected parser, contract, or pilot maps. It specifically confirmed that KIS-5's related links do not make it a second governing delivery task and that KIS-39's historical implementation link adds no live status claim. The changed checklist and review packet record implementation readiness only, not self-acceptance.

### Mini recap

Per-item task links are implemented and reviewable in both repositories; local main is the delivery destination. Continue item-by-item reconciliation before assigning more work, and seek human KI acceptance after review.

## Discussion

### Pickup checkpoint — 2026-09-27

- Verified delivery candidate: `a98cce65` is reachable from the audited destination and supplies [the shared task-link format](../../skills/change-management/ki-work-roadmap/references/standards-work-item-format.md#task-links), Paperclip reconciliation guidance, offline nested-YAML validation and tests. The six-field qualified identity and association-not-claim boundary are implemented; this is not a missing-schema task.
- Receiving evidence: `knowledgeislands/tools-ki` commit `c0857d5652060d644fecc7c2f20a308f59feec7c` is reachable from its inspected HEAD `c2e592c8771697f643dd2a923ee3da9fc6e5ee7c`. Its `src/core/work/items.ts::parseTaskLinks`, `src/core/work/roadmap-report.ts` and CLI-088 Review packet provide the separate CLI delivery. Uncommitted receiving-repository changes were present and are excluded from this completion claim; its historical test results were not rerun here.
- Remaining and closure route: review the already-delivered harness packet and contract agreement, then obtain explicit owner acceptance independently in each repository. Live backlinks, current claims, exhaustive association backfill and held Techné work were not verified or released. Do not repeat implementation or treat either awaiting-review record as accepted.

Evidence scope: inspected local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc` on 2026-09-27. The read-only probe of `http://127.0.0.1:3100/api/health` could not connect; live tasks, current claims and runtime configuration were not verified. The local Git worktree registry was inspected, not every retained worktree’s contents. Before further implementation, reconcile the current destination branch, linked coordination tasks and retained worktrees where applicable, including reachability, patch equivalence and uncommitted work. Missing evidence does not release ownership or lift a hold. This checkpoint is guidance, not a mechanical execution block or a grant to resume. Lifecycle, checkboxes and ownership remain unchanged; retain any later done record until the principal explicitly selects pruning.

### Identity and availability

The qualified task ID, not its readable key or URL, is the identity. Relations explain why an item references a task and survive completion. A current ownership claim must be independently reconciled and recorded locally; historical associations never reserve an item forever, and missing associations never release retained work.
