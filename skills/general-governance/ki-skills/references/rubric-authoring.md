# Rubric authoring

This is the target model for turning a governance standard into an executable rubric.

`ki-skills` proves the model as the self-governing root of the governance-skill system; later skills adopt it one at a time rather than inventing their own checker architecture.

Use this guide when creating or refactoring a governance skill's rubric, audit, conform, or checker implementation.

## The knowledge chain

```text
sources → standard → structured rubric
                          ├──────→ generated rubric.md
                          └──────→ checker runtime
                                     ├─ AUDIT elements by phase
                                     └─ CONFORM elements by phase
                                                ↓
                                      canonical JSONL response
                                                ↓
                                             reporters
```

Each layer has one responsibility:

- `sources.md` records the provenance behind the standard and when moving sources were last reviewed.
- `standards.md` states what good looks like and why, ordered from portable requirements through established practice to Knowledge Islands conventions.
- Structured rubric families and items make the standard assessable. They are the sole authored source for criterion identity, classification, prose, source citations, mode phasing, and executable behaviour.
- The checker runtime plans and executes the rubric's AUDIT or CONFORM elements. It does not define criteria of its own.
- The checker returns one canonical JSONL response containing every structured finding.
- Reporters consume that JSONL response and turn it into terminal, Markdown, or other views without changing what was checked.
- `rubric.md` is a deterministic human-readable publication generated from the structured rubric. It is never a second authored source of truth.
- `exemplars.md` shows representative good outcomes; it does not define requirements.

The [checker contract](checker-contract.md) owns deterministic execution and exit behaviour.

The [canonical checker response](checker-response.md) defines the JSONL transport returned by a checker.

## Target layout

```text
scripts/
  audit.ts                     # read-only command entry
  conform.ts                   # safe-write command entry
  educate.ts                   # scaffold command entry
  lib/                         # deliberately vendorable modules
    rubric/                    # generic structured-rubric module
      index.ts                 # public module entry
      rubric.ts                # rubric, finding, action, and mode-element types
      catalogue.ts             # generic catalogue validation
    checker/                    # one vendorable checker implementation closure
      index.ts                 # public module entry
      planner.ts               # phase and dependency planning
      runtime.ts               # AUDIT and CONFORM execution
      response.ts              # canonical JSONL construction and emission
      transport.ts             # JSONL parsing and response validation
      validation.ts            # rubric-aware result validation
  rubric/                      # private implementation for this skill
    items/
      index.ts
      <family>.ts              # criteria grouped by one coherent concern
    contexts/
      contexts.ts              # public context contracts and composition
      <evidence>.ts            # shared parsing or evidence builders
    render.ts                  # deterministic rubric.md renderer
```

Top-level non-test files in `scripts/` are callable commands.

Reusable implementation lives in `scripts/lib/`; only modules explicitly published through `checker-modules` form a cross-skill contract.

Another skill receives a declared module below `scripts/vendored/<provider>/` and imports only that local copy.

The target shared modules are `scripts/lib/rubric/` and `scripts/lib/checker/`.

The rubric module owns the generic domain model and catalogue mechanics.

The checker module consumes that model and owns planning, execution, and the JSONL boundary.

Together they contain the reusable dependency closure and must not reach into the provider's private `scripts/rubric/` tree.

The [checker contract](checker-contract.md) and [canonical checker response](checker-response.md) are the guidance references for that implementation: the former defines checker behaviour, while the latter defines its JSONL boundary.

Their internal files may change without changing those conceptual contracts or the declared vendorable modules.

## Rubric families and items

A family groups criteria that assess one coherent concern, such as `NAME`, `DESCRIPTION`, or `KI-SHAPE`.

The family catalogue owns its stable family code, readable title, standard section, explanatory introduction, ordered item list, and any presentation metadata needed to reproduce the readable rubric.

Each rubric item owns:

- a stable semantic `code`;
- a concise `title` suitable for `${code}: ${title}` presentation;
- the complete normative `description` needed by the generated rubric;
- its cited `sources`;
- its mechanical or judgment classification;
- an optional AUDIT mode element with its phase and callback;
- an optional CONFORM mode element with its phase and safe callback; and
- an optional judgment `prompt`.

An item may contain both mechanical and judgment behaviour when the criterion genuinely has both parts.

That combination must be explicit structured metadata rather than encoded in prose such as `[M + J]` or `[M-heuristic + J]`.

A deterministic check is mechanical even when it has not yet been implemented; absence of implementation is work to finish, not a reason to relabel it as judgment.

A judgment item carries a concrete review prompt and becomes a `J` / `ADVISORY` finding when applicable.

The item module owns its rule policy.

Helpers, constants, and types used only by one family remain private in that family module; the module exports only its public rubric items and family collection.

## Mode elements and phasing

A mode element is the executable side of a rubric item.

An item may declare an AUDIT element, a CONFORM element, both, or neither when it is purely documentary and intentionally out of execution scope.

Each declared element carries:

- its mode, derived from whether it is the item's `audit` or `conform` element;
- a phase from the shared ordered vocabulary;
- optional `before` or `after` relationships for ordering within the same phase;
- the evidence scopes it reads;
- the capability scopes it writes, empty for AUDIT; and
- the callback that evaluates or changes the subject.

The shared phase order is `prepare → inspect → write → project → normalise`.

AUDIT elements normally inspect, but the phase remains explicit so composed work has one planning model.

CONFORM elements declare where their safe action belongs rather than relying on wrapper order or incidental source order.

The checker runtime selects the elements for the requested mode, rejects cycles, phase reversals, or unordered write collisions, and executes the resulting plan deterministically.

Criterion codes remain finding identity; mode-element identity is derived from the criterion and mode rather than maintained as a second unrelated name.

The structured rubric is the authored source of phasing.

Any `.ki-meta/mode-elements.json` needed by repository-wide orchestration is generated from the catalogue and checked for exact parity; it is not separately authored beside the same callbacks.

## Context and evidence

Rubric items receive prepared domain evidence rather than reading files, parsing frontmatter, invoking the reporter, or knowing CLI arguments.

The wrapper reads the subject once into a shared snapshot, then pure context builders select the evidence required by each concern.

Contexts are organised by audited granularity and responsibility rather than by creating one thin file for every item:

- skill-level evidence describes one skill and its parsed artifacts;
- document-level evidence describes a Markdown or frontmatter document;
- collection-level evidence describes relationships across several skills;
- conform capabilities expose the exact safe writes an item may request; and
- footprint or refresh evidence supports those specialised concerns without inflating every item context.

The aggregate context at the wrapper boundary may compose named, required facets.

Dispatch passes only the relevant facet to a family; a family does not accept a repository-wide optional mega-context.

Support modules define the neutral data types they produce and never import types back from the families that consume them.

Parse each artifact once.

Audit and conform may share the parsed representation, while conform separately retains any raw form needed for faithful mutation.

Name an extracted function when it exposes a domain operation, defines a useful boundary, or removes repeated error-prone mechanics.

Keep a one-use expression inline when extracting it would only hide straightforward work.

## Audit and conform wrappers

Both commands should read as a short orchestration sequence:

```text
parse arguments
  → discover and load subjects
  → build contexts
  → ask the checker runtime to plan and execute the mode
  → return the canonical JSONL response
```

`audit.ts` owns command arguments, read scope, subject discovery, shared snapshot creation, and checker invocation.

It is read-only and contains no criterion codes or policy branches.

`conform.ts` owns command arguments, dry-run behaviour, mutable working state, explicit write capabilities, persistence, and checker invocation.

It contains no criterion codes or duplicate rule logic.

An audit callback returns typed findings.

A conform callback receives only the capabilities it needs, performs its declared safe action, and returns a typed action; shared rubric execution converts that action into a finding.

Manual work is emitted through the same response as a canonical `J` / `ADVISORY` finding, not accumulated in a private TODO collection or rendered through a second path.

## Checker response and reporters

The checker response is transport infrastructure, not a policy engine.

The checker builds and emits the JSONL run, calculates its complete severity summary, and applies the checker exit rule from typed findings.

Response construction does not:

- parse `rubric.md`;
- invent criterion titles, classifications, or judgment prompts;
- read the audited subject;
- render a terminal table; or
- write report files.

JSONL parsing and response validation are separate from response construction.

Rubric-aware validation is also separate: it resolves finding codes against the structured catalogue, checks type and level compatibility, and verifies required judgment coverage.

A reporter starts with a validated JSONL response.

It may filter displayed levels, resolve criterion titles, render a terminal table, write Markdown, or feed another system, but it never reruns or suppresses a check.

The aggregate command owns the default human reporter and reporter-level filtering; filtering never changes which findings a checker collects or emits.

During migration, a legacy Markdown adapter may read an uncodified skill's rubric, but it is not part of the checker runtime or response contract and is deleted when that skill adopts the structured model.

## Generated rubric publication

The readable `references/rubric.md` remains useful for people and agents, but it is generated rather than maintained alongside the TypeScript catalogue.

The renderer uses family metadata and ordered item metadata to reproduce:

- family headings and introductions;
- criterion codes, titles, full descriptions, and classification;
- mechanical, judgment, hybrid, and heuristic presentation;
- source citations and standard links; and
- stable item ordering.

The generated file carries a clear generated marker.

A read-only parity check renders in memory and compares exact output with the tracked file; CONFORM or a dedicated render command writes the current form.

Runtime code never parses the generated Markdown back into policy.

Until a skill has both complete structured metadata and an exact renderer/parity gate, its existing `rubric.md` remains a temporary migration input and must not be removed prematurely.

## Verification

Tests sit beside the command or module they cover.

At minimum, a structured rubric proves:

- every code is unique and belongs to the expected family;
- every item has complete identity, source, and classification metadata;
- every executable item declares a valid mode phase, evidence scope, and write scope;
- mode planning rejects cycles, reversals, and unordered write collisions;
- every mechanical item has its required implementation or an explicit migration failure;
- every applicable judgment item produces exactly one advisory prompt;
- audit is read-only and conform honours dry-run before persistence;
- checker response satisfies the executable schema and exit rule;
- generated `rubric.md` exactly matches the structured catalogue; and
- a vendored checker module behaves the same as its source module.

## Rollout checklist

Apply the model to one governance skill at a time after `ki-skills` proves it.

- Confirm the standard and source list are current enough to serve as inputs.
- Codify every criterion into ordered families without changing its meaning or stable code.
- Declare each item's AUDIT and CONFORM mode elements and phases in the same catalogue.
- Add the family metadata needed to render the readable rubric exactly.
- Build subject snapshots and focused contexts; keep policy in item modules.
- Reduce audit and conform to thin orchestration wrappers over the shared checker runtime.
- Separate checker response construction, response validation, rubric-aware validation, and downstream reporting.
- Generate the repository mode-element projection from the structured catalogue and add an exact parity gate.
- Generate `rubric.md` and add an exact parity gate before retiring Markdown as an authored input.
- Verify source commands, dry-run behaviour, JSONL schema and exit status, and any declared vendored module.
- Record any reusable improvement in this guide before moving to the next skill.
