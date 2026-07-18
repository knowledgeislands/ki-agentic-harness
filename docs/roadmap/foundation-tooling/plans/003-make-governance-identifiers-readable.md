---
id: '003'
title: Make governance identifiers readable and navigable
status: open
roadmap: foundation-tooling/make-governance-identifiers-readable-and-navigable
blocks: foundation-tooling/004
blocked-by: —
---

## Context

Stable requirement, rubric, and diagnostic identifiers are useful machine references, but opaque codes such as `GOV-002` do not explain themselves to a reader in a report.

The canonical checker reporter now gives one shared rendering point for audit and conform output, making this the right time to make identifiers understandable without casually breaking durable references.

## Current state

The delivered reporter and aggregate already render title-first findings such as `CAPABILITY-COMPLETE: complete local governance payloads`, while JSONL retains stable machine fields. The checker/educator split also supplies concrete naming examples: plural responsibility directories (`checkers`, `educators`), verb entrypoints (`ki-audit`, `ki-educate`), and role modules (`checker-reporter`).

Existing codes are durable references and must not be renamed merely for aesthetics.

## Steps

1. Inventory governance naming surfaces separately: functional-area directories, command verbs, module and role nouns, requirement and rubric identifiers, diagnostic codes, plan references, human titles, and machine fields. Classify each by owner, scope, stability requirement, collision domain, and rendered context.
2. Use the delivered examples as the baseline: plural responsibility nouns for `.ki-meta` functional areas, action verbs for commands, role nouns for implementation modules, title-first terminal presentation plus a stable code, and separate JSONL fields for machine consumers.
3. Compare the remaining identifier candidates: title-first presentation with stable codes, owner-scoped semantic slugs, and hybrid semantic-family plus serial identifiers. Assess readability, uniqueness, reorder safety, rename pressure, citation stability, and migration cost.
4. Decide which distinctions are normative rather than forcing one scheme across every surface. Do not encode mutable execution order into durable identifiers, and do not make a path name or command verb carry ownership information that belongs in metadata.
5. Record the selected naming and presentation contract before implementation: human output presents a readable title and stable code in one canonical order, links resolve to the owning definition, and machine JSONL retains separate stable identifier, title, owner, and finding-type fields as applicable.
6. Identify cases where title-first presentation and navigation solve the problem, versus a genuine need for semantic, reorder-safe identifiers; write a decision record before changing any durable code or externally referenced path.
7. Implement canonical reporter and aggregate formatter changes once, rather than teaching every checker to compose titles or duplicate wording, then update definitions, conventions, guides, and tests so emitted identifiers resolve to one readable owner and citation.
8. Re-vendor the harness and run reporter, fleet, feature-definition, and aggregate tests; then run `bun run test` and `bun run ki:audit` sequentially.
9. Re-bootstrap one representative consumer and confirm readable human presentation while JSONL and approved durable references remain stable and parseable. Treat unrelated consumer audit findings as separate work, not evidence against the generated-layout migration.

## Files touched

- `skills/general-governance/ki-skills/` canonical reporter contract and tests
- `skills/keystone/ki-bootstrap/` aggregate renderer and tests
- Rubrics, feature definitions, guides, and decision records that define identifier ownership
- `.ki-meta/` generated payloads and representative consumer payloads

## Verify

- Every human-facing finding renders a readable criterion title and its stable code from one canonical metadata source.
- JSONL consumers continue to receive stable code fields and do not parse terminal presentation.
- No checker copies title formatting or changes durable codes without an approved decision and migration.
- The adopted conventions explicitly distinguish functional-area directories, command verbs, implementation-role names, human titles, and durable machine identifiers, with repository examples for each.
- Full harness tests and aggregate audit pass sequentially, followed by representative consumer checks.

## Dependencies / blocks

It follows the completed checker and educator layout, and blocks `foundation-tooling/004` in that requested order.
