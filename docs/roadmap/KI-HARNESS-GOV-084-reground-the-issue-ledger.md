---
id: KI-HARNESS-GOV-084
area: GOV
title: Reground the issue ledger
theme: governance-consistency
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-21T23:35:00Z
updated_at: 2026-09-22T00:03:44Z
horizon: now
status: ready
---

# Reground the issue ledger

## Goal

Settle whether `ki-work-roadmap` states plainly that an issuing area's high-water mark is read at the moment a record is written, not at the moment work is planned, and whether the skills that allocate identifiers say the same.

## Context

The ledger already forbids the durable error: a number is never lowered and never reused after a prune. What it does not address is the interval between choosing a number and writing it. An agent plans work, names the identifiers it intends to create, has the plan approved, and then executes — and a concurrent session in the same repository may have issued numbers in that window.

This happened in `infoschematics` on 2026-09-21. An approved plan named four new captures as `TOOL-108` through `TOOL-111`. Between approval and execution, another session issued `TOOL-108` through `TOOL-112` for a set of node-dragging defects and advanced the ledger. The captures were written as `TOOL-113` through `TOOL-116` only because the executing agent re-read `_ISSUES.md` first; nothing in the standard required it to, and nothing would have objected if it had not.

The failure that was avoided is the interesting part. Two records sharing an identifier is not a conflict Git reports, because the filenames differ by slug: the tree merges cleanly and the ledger simply becomes untrue. Reciprocal `blocks` and `blocked_by` edges then point at an identifier that resolves to two documents, and the audit finding that eventually surfaces describes a symptom several sessions downstream of the cause.

## Boundary

A wording and placement question about existing rules, not a new mechanism. It does not propose locking, reserving numbers in advance, or any other coordination protocol between concurrent sessions, and it does not change what an identifier is or how areas are declared.

Whether the allocation step also belongs in the process skills that write records — capture in `ki-next`, shaping in `ki-plan` — is part of what this settles, since a rule stated only in the class standard is read at a different time from the one in a procedure's preflight.

## Current state

The ledger prevents number reuse after a record exists, but neither the roadmap standard nor the allocating process states that the high-water mark must be re-read immediately before publication. Existing audit logic detects duplicate or regressed outcomes only after the stale allocation has already occurred.

## Steps

- [ ] State in the roadmap identity contract that proposed identifiers are provisional until the writer re-reads `_ISSUES.md` immediately before creating the record and advances the current high-water mark atomically with it.
- [ ] Add the same freshness stop to `ki-next` capture and due-run spawning; if the ledger or target changed after inspection, reallocate before writing rather than retaining a planned number.
- [ ] Clarify that `ki-plan` resolves an existing identifier and therefore performs source-revision freshness checks but never allocates or reserves a new one.
- [ ] Add focused fixtures or decision tests for a stale proposed identifier, a concurrent ledger advance, and a clean atomic allocation.
- [ ] Regenerate the roadmap rubric and ensure the rule remains compatible with area-qualified and repository-wide ledgers.

## Files touched

- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`
- `skills/change-management/ki-work-roadmap/references/rubric.md`
- `skills/change-management/ki-work-roadmap/scripts/rubric/`
- `skills/change-management/ki-next/references/standards-next-work.md`
- `skills/change-management/ki-next/scripts/`
- `skills/change-management/ki-plan/references/standards-plan-lifecycle.md`

## Verify

- Focused roadmap and `ki-next` tests prove stale planned numbers are reallocated against the latest ledger and never overwrite or reuse an issued identity.
- `ki dev skill rubric ki-work-roadmap` reproduces the committed rubric.
- `ki repo audit --skill ki-work-roadmap --repo .` and `ki repo audit --skill ki-skills --repo .` pass.
- `bun run test` and `bunx tsc --noEmit` pass.

## Dependencies / blocks

No locking mechanism or external coordination dependency is required. The rule operates within the existing one-writer publication boundary and stops on source drift.

## Documentation impact

### Decision Records

No Decision Record is required because identifier authority and ledger ownership remain unchanged.

### Specifications

The roadmap identity standard is the accepted contract; no separate specification is needed.

### Guides

No guide is required. The allocating process and roadmap standard must state the freshness rule directly.

### Roadmap

No follow-on record is expected unless implementation reveals allocation paths outside `ki-next` that cannot share the same freshness check.

## Discussion

### Planning decisions

The high-water mark is authoritative only when read at publication time. A number named in a plan is an intention, not a reservation. `ki-next` owns fresh allocation; `ki-plan` never allocates identifiers. No lock or advance reservation is introduced.

Captured on 2026-09-21 from the `infoschematics` session described above, where a plan's identifiers were stale within hours of approval.

Two framings are worth putting side by side. The narrow one is that this is one sentence in the identity section of the roadmap standard: the high-water mark is read when the record is written. The broader one is that it belongs with the "one writer per checkout" reasoning, because it is the same class of problem — an agent treating warm context as current repository state — and the ledger is simply the place where that assumption becomes a durable falsehood rather than a transient error.

There is also a case for saying nothing. A plan that names identifiers is arguably already understood to be naming intent rather than allocation, and the executing agent re-read the ledger without being told to. Against that: it re-read it because the repository had visibly moved, not because the standard asked, and an agent resuming from a summary rather than a live session has no such signal.
