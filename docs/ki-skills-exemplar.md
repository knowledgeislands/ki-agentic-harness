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
  rubric/
    # ki-skills-local rubric implementation; never vendored as a dependency
    items/
      name.ts                   # one file per rubric family
      description.ts
      optional.ts
      size.ts
      references.ts
      ...
    contexts/
      contexts.ts               # family contracts and named wrapper evidence facets
      text.ts                   # helpers shared by rubric families only
      skill-files.ts            # shared checker traversal helpers
```

Each family owns its rule code, title, description, sources, judgment prompt, and any helper used only by that family.

The shared rubric layer stays deliberately small: types and genuinely cross-family behaviour only.

`scripts/lib/` is the vendorable module surface: another skill may declare and receive only a module from there.

`scripts/rubric/` is private to `ki-skills`: `items/` holds the criteria and `contexts/` holds evidence, parsing, and traversal support.

It is copied only as part of this skill's own checker payload and never separately declared as a dependency.

The TypeScript families are the executable rubric source of truth.

`references/rubric.md` remains a temporary human-readable publication only until a structured-rubric renderer and parity check replace it.

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
- [x] Extract shared skill discovery and Markdown-file traversal into `scripts/rubric/contexts/skill-files.ts`.
- [x] Move shared text helpers to `scripts/rubric/contexts/text.ts`.
- [x] Codify the NAME family.
- [x] Codify the DESC family.
- [x] Codify the OPT family currently implemented by the checker.
- [x] Codify SIZE, including the opt-in SIZE-5 measurement path.
- [x] Codify the REF family and move its table-of-contents check.
- [x] Codify LINK and move the shared Markdown-link helpers under `scripts/rubric/contexts/`.
- [x] Codify the judgment-only BODY, INVOKE, and PROC families.
- [x] Codify SCRIPT, COLL, and LONG as their own family modules.
- [x] Codify LAY, including its structural audit callbacks.
- [x] Codify SHAPE; move its existing mechanical callbacks next, including the root-contract rule.
- [x] Move existing COLL and LONG mechanical callbacks into their family implementations; SCRIPT remains judgment-only.
- [ ] Replace Markdown-derived judgment reporting only after structured family coverage is complete.
- [ ] Retire `references/rubric.md` only after the structured rubric renders an equivalent readable reference and passes parity verification.

## Decision List

- Top-level non-test `scripts/*.ts` files are directly callable command entries; support code lives in `scripts/lib/` with adjacent tests.
- Declared checker modules are sourced only from the named provider's `scripts/lib/` and copied into each consumer's `scripts/vendored/<provider>/` namespace.
- Checker dependency declarations use the unambiguous `provider:module` form, with no legacy separator or lookup path.
- `ki-skills` validates its root contract, direct JSONL output, module resolution, and vendored consumer copies through focused tests.
- `ki-engineering` proves the dependent model without no-op narration or a second presentation path.

## Exemplar rules

- `audit.ts` owns command arguments, target reads, evidence assembly, rubric dispatch, and final reporter invocation.
- `conform.ts` owns command arguments, target reads, safe write callbacks, dry-run enforcement, rubric dispatch, and final reporter invocation.
- A rubric family owns each rule's code, title, description, sources, judgment prompt, audit callback, and conform callback.
- Wrappers do not reimplement a rule, invent a private finding shape, or translate severity through a second ladder.
- The shared rubric runtime owns only cross-family types and execution mechanics, including collecting audit findings and converting conform actions into findings.
- `scripts/rubric/contexts/` owns family input contracts, context factories, and evidence/parsing/traversal helpers shared by rubric families or both wrappers; it contains no rule policy.
- Support modules define the neutral data types they produce. A support module must not import a type back from the family that consumes it.
- `KiSkillsAuditContext` and `KiSkillsConformContext` may compose named, required family contexts at the wrapper boundary. Dispatch selects the appropriate facet; a rubric family never accepts a repository-wide optional mega-context.
- Keep a one-use expression inline unless naming it exposes a meaningful domain operation or removes repeated, error-prone mechanics.
- Parse one artifact through one shared read model. Mutation helpers may preserve the raw representation, but audit and conform must not independently interpret the same frontmatter.
- A conform callback receives explicit write capabilities, performs only its declared safe action, and returns a typed action; the wrapper converts actions through the shared rubric runtime.
- Manual or judgment work is a canonical ADVISORY finding, not a parallel TODO collection or private output stream.
- Tests sit beside the file or command they cover and prove both the source command and its dry-run or vendored boundary where applicable.

## Rollout

Apply these checks to one later governance skill at a time, only after the root exemplar is complete.

- Its top-level non-test `scripts/*.ts` files are directly callable commands; support code and adjacent tests live under `scripts/lib/`.
- Any shared checker implementation is declared as `provider:module`, sourced only from the provider's `scripts/lib/`, and copied below the consumer's `scripts/vendored/<provider>/`.
- Its audit and conform commands use only their local implementation modules and emit the canonical reporter JSONL with no private rendering path.
- Its rubric remains the sole source of finding code, title, type, and level; its checker emits evidence and available action only.
- Its focused source and vendored tests pass before the next skill is considered.

- Its family-local helpers live beside the owning rubric family; helpers shared by families live under `scripts/rubric/contexts/`.
