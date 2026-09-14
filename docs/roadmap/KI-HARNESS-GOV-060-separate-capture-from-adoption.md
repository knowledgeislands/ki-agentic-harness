---
id: KI-HARNESS-GOV-060
area: GOV
title: Separate Capture From Adoption
theme: governance-consistency
horizon: future
status: draft
candidate: true
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-14T01:45:26Z
updated_at: 2026-09-14T01:45:26Z
---

# Separate Capture From Adoption

## Goal

Make plausible work durable by default when it emerges in discussion, without treating record creation as approval, adoption, prioritisation, planning, or execution.

## Context

The current roadmap model uses `status: draft` for work that is not ready and `horizon: future` with `candidate: true` for speculative or uncommitted work. That combination can represent a newly captured idea, but it does not name an intake boundary directly. The `ki-next` process also generally asks for confirmation before writing or moving work, so a substantive roadmap concern can be discussed and then disappear unless someone explicitly asks to add it.

Issue trackers such as Linear distinguish triage from the adopted team backlog. Knowledge Islands needs the same authority distinction in its portable work model: capturing a useful candidate should be cheap and automatic, while moving it into an adopted horizon or delivery lifecycle should remain a deliberate human decision.

## Boundary

Do not grant automatic authority to prioritise, plan, implement, batch, accept, or prune work. Do not assume the final representation must be a new lifecycle status, horizon, directory, or frontmatter field before comparing those options. Do not create duplicate records when an existing candidate already owns the concern.

## Discussion

### Separate axes

Capture or adoption is an intake disposition; `draft`, `ready`, `in-progress`, `awaiting-review`, and `done` describe delivery maturity. The model should avoid making `draft` carry both meanings. A captured item can be minimally drafted while still awaiting an adoption decision.

### Default capture authority

An agent should be able to create a minimal captured record without a separate approval whenever the conversation substantively identifies a plausible future outcome, concern, dependency, or decision. It should report the capture after writing it. Human approval should be required before the item leaves intake for an adopted horizon, enters readiness shaping, affects sequencing or dependencies, or authorises delivery.

### Triage representation

Shaping should compare an explicit `triage` horizon, an intake or disposition field such as `captured`, and a separate adapter-local intake surface. The result must project cleanly to provider-native triage concepts while preserving one portable meaning across repository roadmaps, Knowledge Base Streams, and later remote adapters.

### Noise and reconciliation

Automatic capture still needs a bounded trigger: substantive prospective work should survive, while rhetorical examples and already-resolved observations should not create records. Before creating one, the process should search for an existing owner and enrich that candidate when the new discussion stays within its goal. Rejection, duplication, and merging need explicit reviewable outcomes so capture remains inexpensive without making the queue permanently noisy.

### Process ownership

`ki-work-roadmap` should own the portable intake state and record shape. `ki-next` should own automatic capture, triage review, adoption, rejection, and promotion authority. `ki-plan`, `ki-implement`, and `ki-accept` should continue to operate only after the applicable adoption and readiness gates.
