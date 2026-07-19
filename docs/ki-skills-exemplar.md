# KI skills exemplar

**Status:** active working document.

This document is the small, evolving reference for the root governance skill.

It records the model we prove in `ki-skills` before rolling it out skill by skill.

It is not a Decision Record, Feature Definition, or execution plan.

When a convention is settled, promote its durable rule into the owning standard, rubric, decision, or feature definition; this document then retains only the concise exemplar and rollout record.

## Goal

Make `ki-skills` the unambiguous root of the governance-skill system: its rubric supplies finding identity and classification, its checker reporter supplies transport, and its own implementation demonstrates the smallest clear script layout.

Use `ki-engineering` only as the first dependent proof after the root model is stable.

## Proven model

```text
ki-skills
  ├─ governance-skill shape and rubric/checker relationship
  ├─ severity ladder and canonical JSONL reporter
  ├─ checker-module declaration and vendoring contract
  └─ root self-governance
       ↓
one dependent exemplar: ki-engineering
       ↓
later skill-by-skill rollout
```

## Todo List

## Decision List

- [x] Top-level non-test `scripts/*.ts` files are directly callable command entries; support code lives in `scripts/lib/` with adjacent tests.
- [x] Declared checker modules are sourced only from the named provider's `scripts/lib/` and copied into each consumer's `scripts/vendored/<provider>/` namespace.
- [x] Checker dependency declarations use the unambiguous `provider:module` form, with no legacy separator or lookup path.
- [x] `ki-skills` validates its root contract, direct JSONL output, module resolution, and vendored consumer copies through focused tests.
- [ ] `ki-engineering` proves the dependent model without no-op narration or a second presentation path.

## Rollout

Apply these checks to one later governance skill at a time, only after the root exemplar is complete.

- [ ] Its top-level non-test `scripts/*.ts` files are directly callable commands; support code and adjacent tests live under `scripts/lib/`.
- [ ] Any shared checker implementation is declared as `provider:module`, sourced only from the provider's `scripts/lib/`, and copied below the consumer's `scripts/vendored/<provider>/`.
- [ ] Its audit and conform commands use only their local implementation modules and emit the canonical reporter JSONL with no private rendering path.
- [ ] Its rubric remains the sole source of finding code, title, type, and level; its checker emits evidence and available action only.
- [ ] Its focused source and vendored tests pass before the next skill is considered.

## Current focus

Establish the script-entry and checker-module layout in `ki-skills` and `ki-bootstrap`, then prove it through the focused source and vendored checks.

Do not broaden this work into a full checker migration, criterion-catalogue redesign, or lifecycle work from GOV-002.
