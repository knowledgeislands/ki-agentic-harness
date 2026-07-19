# KI skills exemplar

**Status:** active working document.

This document is the small, evolving reference for the root governance skill.

It records the model we prove in `ki-skills` before rolling it out skill by skill.

It is not a Decision Record, Feature Definition, or execution plan.

When a convention is settled, promote its durable rule into the owning standard, rubric, decision, or feature definition; this document then retains only the concise exemplar and rollout record.

## Goal

Make `ki-skills` the unambiguous root of the governance-skill system: its rubric supplies finding identity and classification, its checker reporter supplies transport, and its own implementation demonstrates the smallest clear script layout.

Use `ki-engineering` only as the first dependent proof after the root model is stable.

## Target layout

```text
scripts/
  audit.ts                    # callable command
  conform.ts                  # callable command
  lib/                        # vendorable modules for other skills
    checker-reporter.ts
    rubric/
      rubric.ts               # minimal shared rubric types
  rubrics/
    # ki-skills-local rubric implementation; never vendored as a dependency
    name.ts                   # one file per rubric family
    description.ts
    optional.ts
    size.ts
    references.ts
    ...
    support/
      text.ts                   # helpers shared by rubric families only
      skill-files.ts            # shared checker traversal helpers
```

Each family owns its rule code, title, description, sources, judgment prompt, and any helper used only by that family.

The shared rubric layer stays deliberately small: types and genuinely cross-family behaviour only.

`scripts/lib/` is the vendorable module surface: another skill may declare and receive only a module from there.

`scripts/rubrics/` is private to `ki-skills`, including `scripts/rubrics/support/`; it is copied only as part of this skill's own checker payload and never separately declared as a dependency.

Until every family has moved, `references/rubric.md` remains the readable publication and compatibility check for the current reporter.

## Proven model

```text
ki-skills
  ├─ governance-skill shape and rubric/checker relationship
  ├─ severity ladder and canonical JSONL reporter
  ├─ checker-module declaration and vendoring contract
  └─ root self-governance
       ↓
dependent exemplars: ki-engineering, ???
       ↓
later skill-by-skill rollout
```

Do not broaden this work into a full checker migration, criterion-catalogue redesign, or lifecycle work from GOV-002.

## To-do list

- [x] Extract the minimal shared rubric types.
- [x] Extract shared skill discovery and Markdown-file traversal into `scripts/rubrics/support/skill-files.ts`.
- [x] Move shared text helpers to `scripts/rubrics/support/text.ts`.
- [x] Codify the NAME family.
- [x] Codify the DESC family.
- [x] Codify the OPT family currently implemented by the checker.
- [x] Codify SIZE-1 through SIZE-4; retain SIZE-5 until its opt-in measurement path moves.
- [x] Codify the REF family and move its table-of-contents check.
- [x] Codify LINK and move the shared Markdown-link helpers under `scripts/rubrics/support/`.
- [x] Codify the judgment-only BODY, INVOKE, and PROC families.
- [x] Codify SCRIPT, COLL, and LONG as their own family modules.
- [ ] Finish LAY: LAY-4 is codified; LAY-1 through LAY-3 still need their structural audit callbacks.
- [x] Codify SHAPE; move its existing mechanical callbacks next, including the root-contract rule.
- [ ] Move existing SCRIPT, COLL, and LONG mechanical callbacks into their family implementations.
- [ ] Replace Markdown-derived judgment reporting only after structured family coverage is complete.
- [ ] Retire `references/rubric.md` only after the structured rubric renders an equivalent readable reference and passes parity verification.

## Decision List

- Top-level non-test `scripts/*.ts` files are directly callable command entries; support code lives in `scripts/lib/` with adjacent tests.
- Declared checker modules are sourced only from the named provider's `scripts/lib/` and copied into each consumer's `scripts/vendored/<provider>/` namespace.
- Checker dependency declarations use the unambiguous `provider:module` form, with no legacy separator or lookup path.
- `ki-skills` validates its root contract, direct JSONL output, module resolution, and vendored consumer copies through focused tests.
- `ki-engineering` proves the dependent model without no-op narration or a second presentation path.

## Rollout

Apply these checks to one later governance skill at a time, only after the root exemplar is complete.

- Its top-level non-test `scripts/*.ts` files are directly callable commands; support code and adjacent tests live under `scripts/lib/`.
- Any shared checker implementation is declared as `provider:module`, sourced only from the provider's `scripts/lib/`, and copied below the consumer's `scripts/vendored/<provider>/`.
- Its audit and conform commands use only their local implementation modules and emit the canonical reporter JSONL with no private rendering path.
- Its rubric remains the sole source of finding code, title, type, and level; its checker emits evidence and available action only.
- Its focused source and vendored tests pass before the next skill is considered.

- Its family-local helpers live beside the owning rubric family, under `scripts/rubrics/lib/` only when another family genuinely shares them.
