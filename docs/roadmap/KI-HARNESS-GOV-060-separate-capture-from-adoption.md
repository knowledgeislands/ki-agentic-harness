---
id: KI-HARNESS-GOV-060
area: GOV
title: Separate Capture From Adoption
theme: governance-consistency
horizon: next
status: done
blocks: []
blocked_by: []
baseline_ref: 654ded9770680a8e720a729430d343503f9e58e0
created_at: 2026-09-14T01:45:26Z
updated_at: 2026-09-14T17:30:26Z
---

# Separate Capture From Adoption

## Goal

Make plausible work durable by default when it emerges in discussion, without treating record creation as approval, adoption, prioritisation, planning, or execution.

## Context

The current roadmap model uses `status: draft` for work that is not ready and `horizon: future` with `candidate: true` for speculative or uncommitted work. That combination can represent a newly captured idea, but it does not name an intake boundary directly. The `ki-next` process also generally asks for confirmation before writing or moving work, so a substantive roadmap concern can be discussed and then disappear unless someone explicitly asks to add it.

Issue trackers such as Linear distinguish triage from the adopted team backlog. Knowledge Islands needs the same authority distinction in its portable work model: capturing a useful candidate should be cheap and automatic, while moving it into an adopted horizon or delivery lifecycle should remain a deliberate human decision.

## Boundary

Do not grant automatic authority to prioritise, plan, implement, batch, accept, or prune work. Do not assume the final representation must be a new lifecycle status, horizon, directory, or frontmatter field before comparing those options. Do not create duplicate records when an existing candidate already owns the concern.

## Current state

The portable roadmap vocabulary has no explicit intake boundary. `future` currently combines adopted long-term work with uncommitted candidates, while `candidate: true` is required on every Future record. `ki-next` requires confirmation for ordinary capture and queue changes, so useful work can remain only in conversation. The roadmap checker, process guidance, decision helpers, and current candidate records encode that combined model.

## Steps

- [x] Amend the living repository-roadmap decision and portable work-item standards so `triage` means captured but not adopted, `future` means adopted long-term work, and `draft` remains delivery maturity.
- [x] Remove `candidate` from the work-item contract and migrate current uncommitted candidates to `triage` without adopting or otherwise reprioritising them.
- [x] Make `ki-next` capture substantive prospective work into triage by default after deduplication, while requiring human approval before adoption into another horizon or rejection.
- [x] Reconcile the Knowledge Base Streams proposal path with the same default-capture and human-adoption boundary, keeping triage as metadata rather than a state directory.
- [x] Define an evidence-backed human-approved Triage disposition that reaches `done` before any later prune, without pretending rejected or merged intake was adopted or implemented.
- [x] Extend the roadmap checker and process decision helpers with triage validation, transition guards, and focused tests.
- [x] Republish generated rubric and capability documentation, then reconcile the outcome guide, scenario evaluation, and lifecycle diagram.

## Files touched

Expected scope is the living repository-roadmap Decision Record; `ki-work-roadmap` standards, checker, focused tests, and generated rubric; `ki-next`, `ki-plan`, and `ki-accept` process guidance, helpers, and focused tests; the `ki-repo-kb-streams` proposal procedure, structure guidance, state-directory check, and focused tests; the skills-by-outcome guide, roadmap evaluation scenario, and lifecycle diagram; current `candidate: true` roadmap records; this item; and batch authorisation records. Generated capability and diagram publication may change only when their source changes require it.

## Verify

- `bun test skills/change-management/ki-work-roadmap/scripts/rubric/items/index.test.ts`
- `bun test skills/change-management/ki-next/scripts/decisions.test.ts skills/change-management/ki-plan/scripts/decisions.test.ts`
- `bun test skills/change-management/ki-accept/scripts/acceptance-cycle.test.ts skills/change-management/ki-accept/scripts/prune-selection.test.ts`
- `bun test skills/repo-structure/ki-repo-kb-streams/scripts/rubric/contexts/streams.test.ts`
- `ki dev skill rubric ki-work-roadmap --write`
- Regenerate the roadmap lifecycle diagram from its DOT source.
- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-repo-kb-streams --repo .`
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-decision-records --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `bun run test`
- `bunx tsc --noEmit`

## Dependencies / blocks

No build-order dependency blocks delivery. The user explicitly supplied outcome authority to progress roadmap work and previously established that capture should require no approval while adoption should. This plan resolves the representation as a seventh `triage` horizon because it keeps intake position separate from delivery maturity and projects directly to provider-native triage concepts. A pre-implementation inventory found that Knowledge Base Streams still gates proposal creation on confirmation, so the plan includes that local adapter rather than publishing contradictory portable guidance. Independent review then found that rejection or merging had no honest route to the user's required done-before-prune boundary, so the plan includes a narrow human-approved intake-disposition closure in `ki-accept`. Moving this record from Future directly to Next remains appropriate because the outcome, authority boundary, compatibility migration, affected surfaces, and verification are understood; Soon adds no useful shaping stage.

## Delegation

One same-session read-only inventory may inspect cross-skill impact. Any implementation delegation must use non-overlapping file-level lanes, must not stage or commit, and must return focused verification evidence. The coordinator retains roadmap lifecycle, Decision Record, generated publication, integration, and Git write authority.

## Documentation impact

### Decision Records

Amend `ADR-KI-HARNESS-SKILLS-011` in place because it already owns the canonical repository-roadmap architecture; do not create a competing GDR.

### Specifications

No separate specification changes are needed. The accepted portable behaviour belongs to the work-item and next-work standards.

### Guides

Update the skills-by-outcome guide only where it describes capture and adoption authority.

### Roadmap

Migrate existing `candidate: true` records to triage as a semantic preservation change. Leave their lifecycle state, content, dependencies, and relative priority otherwise unchanged.

## Review

### Delivered

Delivered the approved local-adapter intake lifecycle from immutable baseline `654ded9770680a8e720a729430d343503f9e58e0`. Triage captures unadopted work automatically after deduplication; adoption remains human-approved. Exact human-approved rejected, duplicate, or merged intake closes as retained done before any later prune. No intake record was closed, pruned, or adopted during delivery.

### Summary of changes

Updated the living repository-roadmap ADR, roadmap standards and checker, `ki-next`, `ki-plan`, `ki-accept`, KB Streams, focused fixtures, scenario evaluation, outcome guide, lifecycle diagram, and generated rubric and catalogue. Migrated GOV-058, OPS-003, REV-002, and RTP-010 from the retired candidate marker to Triage. Terminal intake keeps a null execution baseline, forbids delivery sections, and requires a distinct retained canonical target for duplicate or merged outcomes. Batch closure authority cannot close intake.

### Verification

- Full `bun run test`: 622 passed, 0 failed, 2808 assertions across 119 files.
- `bunx tsc --noEmit`: passed after correcting a discriminated-union test fixture; the affected acceptance tests were rerun successfully.
- `ki repo audit` for `ki-work-roadmap`, `ki-skills`, `ki-decision-records`, `ki-authoring`, and `ki-repo-harness`: passed.
- KB Streams audit: passed read-only against `ki-techne-principal`, where that skill is declared; Harness does not declare it for its own repository structure.
- Generated roadmap rubric parity passed; the lifecycle SVG and capability catalogue were regenerated from their sources.

### Outstanding concerns

No unresolved implementation findings. Human acceptance of GOV-060 remains outstanding. Remote adapter execution remains outside this delivery.

### Post-change review

Independent review identified missing target validation, unwanted delivery sections in terminal intake, and stale lifecycle wording and relationship-map coverage. All were corrected with focused evidence. The resulting contract preserves shared-tree change ownership, human adoption and disposition authority, and done-before-prune history. No cross-repository write, push, acceptance, or pruning occurred.

### Mini recap

GOV-060 establishes automatic durable capture with explicit adoption and terminal disposition gates across both local adapters. Verification is clean. The design learning belongs in the amended roadmap standard and existing ADR; no additional learning promotion is proposed.

## Done

Accepted 2026-09-14 by the repository owner under explicit roadmap outcome authority on the review packet above.

## Discussion

### Selected representation

Use an explicit `triage` horizon. It names queue position and adoption state directly, leaves lifecycle status to describe delivery maturity, avoids a second local record surface, and can project cleanly to provider-native triage concepts. Open Triage remains `draft`; adoption requires human approval. An explicitly approved terminal disposition may instead close intake as retained Triage / done. `future` remains available for adopted long-term work and no longer carries `candidate: true`.

### Separate axes

Capture or adoption is an intake disposition; `draft`, `ready`, `in-progress`, `awaiting-review`, and `done` describe delivery maturity. The model should avoid making `draft` carry both meanings. A captured item can be minimally drafted while still awaiting an adoption decision.

### Default capture authority

An agent should be able to create a minimal captured record without a separate approval whenever the conversation substantively identifies a plausible future outcome, concern, dependency, or decision. It should report the capture after writing it. Human approval should be required before the item leaves intake for an adopted horizon, enters readiness shaping, affects sequencing or dependencies, or authorises delivery.

### Triage representation

Shaping should compare an explicit `triage` horizon, an intake or disposition field such as `captured`, and a separate adapter-local intake surface. The result must project cleanly to provider-native triage concepts while preserving one portable meaning across repository roadmaps, Knowledge Base Streams, and later remote adapters.

### Noise and reconciliation

Automatic capture still needs a bounded trigger: substantive prospective work should survive, while rhetorical examples and already-resolved observations should not create records. Before creating one, the process should search for an existing owner and enrich that candidate when the new discussion stays within its goal. Rejection, duplication, and merging need explicit reviewable outcomes so capture remains inexpensive without making the queue permanently noisy.

### Process ownership

`ki-work-roadmap` owns portable intake state and record shape. `ki-next` owns automatic capture, triage review, adoption, and promotion. `ki-accept` owns delivery closure and exact human-approved rejected, duplicate, or merged intake closure; `ki-plan` and `ki-implement` retain their adoption and readiness gates.
