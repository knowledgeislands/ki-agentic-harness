---
id: '003'
title: Make governance identifiers readable and navigable
status: open
roadmap: foundation-tooling/make-governance-identifiers-readable-and-navigable
blocks: foundation-tooling/004
blocked-by: foundation-tooling/002
---

## Context

Stable requirement, rubric, and diagnostic identifiers are useful machine references, but opaque codes such as `GOV-002` do not explain themselves to a reader in a report.

The canonical checker reporter now gives one shared rendering point for audit and conform output, making this the right time to make identifiers understandable without casually breaking durable references.

## Current state

The reporter resolves rubric titles for some human output, but the repository has not yet defined a complete human-facing identifier and navigation policy across feature definitions, rubrics, checker findings, documentation, and tests.

Existing codes are durable references and must not be renamed merely for aesthetics.

## Steps

1. Inventory requirement, rubric, diagnostic, and plan identifiers; classify each by its owner, stability requirement, human-facing contexts, and current rendered form.
2. Decide and record the presentation contract: human output presents the readable title with its stable code in one canonical order, links or citations resolve to the owning definition, and machine JSONL retains the stable code separately.
3. Identify cases where title-first presentation and navigation solve the problem, versus any genuine need for a semantic, reorder-safe code scheme; write a decision record before changing durable identifiers.
4. Implement the canonical reporter and aggregate formatter changes once, rather than teaching every checker to compose titles or duplicate wording.
5. Update feature definitions, rubric conventions, guides, and checker tests so every emitted code can resolve to one readable owner title and durable citation.
6. Re-vendor the harness and run reporter, fleet, feature-definition, and aggregate tests; then run `bun run test` and `bun run ki:audit` sequentially.
7. Re-bootstrap representative consumer repositories and confirm their human audit/conform presentation is readable while their machine stream remains stable and parseable.

## Files touched

- `skills/general-governance/ki-skills/` canonical reporter contract and tests
- `skills/keystone/ki-bootstrap/` aggregate renderer and tests
- Rubrics, feature definitions, guides, and decision records that define identifier ownership
- `.ki-meta/` generated payloads and representative consumer payloads

## Verify

- Every human-facing finding renders a readable criterion title and its stable code from one canonical metadata source.
- JSONL consumers continue to receive stable code fields and do not parse terminal presentation.
- No checker copies title formatting or changes durable codes without an approved decision and migration.
- Full harness tests and aggregate audit pass sequentially, followed by representative consumer checks.

## Dependencies / blocks

Blocked by `foundation-tooling/002` solely to preserve the requested execution order; it does not depend on EDUCATE semantics for correctness.

It blocks `foundation-tooling/004` in that requested order.
