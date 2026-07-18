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

This plan is provisional until the mandatory post-002 planning refresh. The checker/educator work will provide concrete naming examples and may change the files and conventions this plan should govern.

## Steps

1. At the post-002 checkpoint, review this plan before execution and incorporate the delivered names and boundaries from `.ki-meta/checkers/`, `.ki-meta/educators/`, command entrypoints, modules such as `checker-reporter`, and any newly exposed naming ambiguity.
2. Inventory governance naming surfaces separately: functional-area directories, command verbs, module and role nouns, requirement and rubric identifiers, diagnostic codes, plan references, human titles, and machine fields. Classify each by owner, scope, stability requirement, collision domain, and rendered context.
3. Compare explicit convention candidates using worked repository examples: plural responsibility nouns for functional-area directories; singular action verbs for commands; role nouns for implementation modules; title-first rendering with a stable opaque code; owner-scoped semantic slugs; and hybrid semantic-family plus serial identifiers. Assess readability, uniqueness, reorder safety, rename pressure, citation stability, and migration cost.
4. Decide which distinctions are normative rather than forcing one scheme across every surface. In particular, do not encode mutable execution order into durable identifiers, and do not make a path name or command verb carry ownership information that belongs in metadata.
5. Record the selected naming and presentation contract before implementation: human output presents a readable title and stable code in one canonical order, links resolve to the owning definition, and machine JSONL retains separate stable identifier, title, owner, and finding-type fields as applicable.
6. Identify cases where title-first presentation and navigation solve the problem, versus a genuine need for semantic, reorder-safe identifiers; write a decision record before changing any durable code or externally referenced path.
7. Implement canonical reporter and aggregate formatter changes once, rather than teaching every checker to compose titles or duplicate wording, then update definitions, conventions, guides, and tests so emitted identifiers resolve to one readable owner and citation.
8. Re-vendor the harness and run reporter, fleet, feature-definition, and aggregate tests; then run `bun run test` and `bun run ki:audit` sequentially.
9. Re-bootstrap representative consumer repositories and confirm human audit/conform presentation is readable while machine streams and approved durable references remain stable and parseable.

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

Blocked by `foundation-tooling/002`. Its current content is provisional and must be refreshed from the actual checker/educator implementation before execution begins.

It blocks `foundation-tooling/004` in that requested order.
