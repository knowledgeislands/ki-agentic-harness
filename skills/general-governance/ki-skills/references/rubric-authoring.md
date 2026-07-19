# Rubric authoring

This is the target model for turning a governance standard into an executable rubric.

`ki-skills` proves the model as the self-governing root of the governance-skill system; later skills adopt it one at a time rather than inventing their own checker architecture.

Use this guide when creating or refactoring a governance skill's rubric, audit, conform, or checker implementation.

## Contents

- [The knowledge chain](#the-knowledge-chain)
- [Target layout](#target-layout)
- [Rubric families and items](#rubric-families-and-items)
- [Target type shape](#target-type-shape)
- [Mode elements and phasing](#mode-elements-and-phasing)
- [Generated projections and selection](#generated-projections-and-selection)
- [Context and evidence](#context-and-evidence)
- [Audit and conform wrappers](#audit-and-conform-wrappers)
- [Checker response and reporters](#checker-response-and-reporters)
- [Generated rubric publication](#generated-rubric-publication)
- [Verification](#verification)
- [Review boundary](#review-boundary)
- [Implementation units](#implementation-units)
- [Rollout checklist](#rollout-checklist)

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
    project.ts                 # deterministic data and Markdown projections
    render.ts                  # deterministic rubric.md renderer
assets/
  checker-response.schema.json # canonical JSONL record schema
  mode-elements.schema.json    # command-scheduling projection schema
  rubric.schema.json           # policy-metadata projection schema
.ki-meta/
  mode-elements.json          # generated command-scheduling projection
  rubric.json                 # generated policy-metadata projection
references/
  rubric.md                   # generated readable publication
```

Top-level non-test files in `scripts/` are callable commands.

Reusable implementation lives in `scripts/lib/`; only modules explicitly published through `checker-modules` form a cross-skill contract.

Another skill receives a declared module below `scripts/vendored/<provider>/` and imports only that local copy.

The target shared modules are `scripts/lib/rubric/` and `scripts/lib/checker/`.

`ki-skills` publishes them as `checker-modules: [rubric, checker]`.

A dependent skill declares `checker-dependencies: [ki-skills:rubric, ki-skills:checker]`; the checker module's relative import of the sibling rubric module remains inside the copied `scripts/vendored/ki-skills/` namespace.

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

## Target type shape

The shared rubric model should be small enough to understand from its public types.

The names below are illustrative TypeScript, but their responsibilities are fixed:

```ts
type RubricMode = 'audit' | 'conform'
type RubricPhase = 'prepare' | 'inspect' | 'write' | 'project' | 'normalise'
type ViolationLevel = 'FAIL' | 'WARN' | 'POLISH'

type RubricExecution<Context, Result> = {
  phase: RubricPhase
  group?: string
  reads: readonly string[]
  writes: readonly string[]
  before?: readonly string[]
  after?: readonly string[]
  run: (context: Context) => readonly Result[]
}

type MechanicalRubric<Context> = {
  level: ViolationLevel
  audit: RubricExecution<Context, AuditObservation>
  conform?: RubricExecution<Context, ConformOutcome>
}

type JudgmentRubric<Context> = {
  phase: 'inspect'
  prompt: string
  applies?: (context: Context) => boolean
}

type RubricItemBase = {
  code: string
  title: string
  description: string
  sources: readonly string[]
}

type RubricItem<Context> = RubricItemBase &
  ({ mechanical: MechanicalRubric<Context>; judgment?: JudgmentRubric<Context> } | { mechanical?: never; judgment: JudgmentRubric<Context> })
```

Classification is derived from the executable branches: `mechanical` means M, `judgment` means J, and both means M + J.

The type and catalogue validator reject an item with neither branch.

The criterion's violation level belongs to `mechanical.level`; callbacks do not repeat it alongside every result.

An audit callback returns observations rather than fully formed findings:

```ts
type AuditObservation = {
  status: 'violation' | 'pass' | 'na' | 'info'
  message: string
  subject?: string
}
```

The checker maps `violation` to the item's declared violation level and maps the other statuses to `PASS`, `NA`, or `INFO`.

A conform callback returns outcomes rather than inventing a second finding model:

```ts
type ConformOutcome = {
  status: 'changed' | 'pass' | 'unresolved' | 'advisory' | 'na' | 'info'
  message: string
  subject?: string
}
```

The checker maps `changed` to `POLISH`, `unresolved` to the item's violation level, and the remaining statuses to their corresponding response levels.

Judgment is always reported as J / ADVISORY when its optional applicability predicate passes.

The family and definition layers carry metadata and connect each family to one focused context facet:

```ts
type RubricFamily<RootContext, FamilyContext> = {
  code: string
  title: string
  description: string
  standard: string
  selectContext: (root: RootContext) => FamilyContext
  items: readonly RubricItem<FamilyContext>[]
}

type RubricDefinition<RootContext> = {
  name: string
  concern: string
  entries: Readonly<Record<RubricMode, string>>
  families: readonly RubricFamily<RootContext, unknown>[]
}
```

The concrete implementation may use a typed family helper to preserve heterogeneous context inference; it must not replace these focused contexts with `unknown` inside item callbacks.

The definition is the one object passed to generic catalogue validation, checker execution, and projection rendering.

## Mode elements and phasing

A mode element is the executable side of a rubric item.

A mechanical item always declares an AUDIT element and may add a CONFORM element.

A judgment branch declares its inspect-phase prompt, and a hybrid item carries both branches.

Each declared element carries:

- its mode, derived from whether it is the item's `audit` or `conform` element;
- a phase from the shared ordered vocabulary;
- an optional semantic group when one mode needs independently scheduled work in the same phase;
- optional `before` or `after` relationships for ordering within the same phase;
- the evidence scopes it reads;
- the capability scopes it writes, empty for AUDIT; and
- the callback that evaluates or changes the subject.

The shared phase order is `prepare → inspect → write → project → normalise`.

`prepare` establishes prerequisites, `inspect` evaluates evidence, `write` mutates primary artifacts, `project` rebuilds derived artifacts, and `normalise` applies final formatting or canonical ordering.

AUDIT elements normally inspect, but the phase remains explicit so composed work has one planning model.

CONFORM elements declare where their safe action belongs rather than relying on wrapper order or incidental source order.

The checker runtime selects the elements for the requested mode, rejects cycles, phase reversals, or unordered write collisions, and executes the resulting plan deterministically.

Criterion codes remain finding identity; mode-element identity is derived from the criterion and mode rather than maintained as a second unrelated name.

An ordering reference is a local criterion code or a qualified `<skill>/<code>` when it crosses a skill boundary; projection lifts item edges between their command groups.

The structured rubric is the authored source of phasing.

Any `.ki-meta/mode-elements.json` needed by repository-wide orchestration is generated from the catalogue and checked for exact parity; it is not separately authored beside the same callbacks.

## Generated projections and selection

The structured TypeScript definition is the authored source.

Two deterministic data projections make it consumable without importing callback code into reporters or repository-wide planners:

- `.ki-meta/rubric.json` contains family and item identity, descriptions, sources, classification, violation levels, and stable order. Reporters use it to resolve `${code}: ${title}` and validators use it to check response identity.
- `.ki-meta/mode-elements.json` contains the command-level scheduling graph consumed by the repository aggregate.

The rubric projection has one versioned shape:

```text
version
name
concern
families[]
  code
  title
  description
  standard
  items[]
    code
    title
    description
    sources[]
    types[]
    violationLevel?
    judgmentPrompt?
    executions[] { mode, phase, group? }
```

It contains no callbacks, filesystem paths to source modules, or rendered prose copied from `rubric.md`.

The mode-element projection groups rubric executions by `mode + phase + group + entry`.

Each projected element unions the declared read and write scopes for its group and lifts ordering edges between groups.

Its stable id is `<concern>-<phase>` unless the executions supply a semantic group, in which case it is `<concern>-<phase>-<group>`.

When one command entry represents more than one projected element, the aggregate invokes it with `--mode-element=<id>`.

The thin wrapper passes that selector to the checker, which executes only the rubric items belonging to the selected group.

When an entry represents exactly one group, omission of `--mode-element` selects that complete group.

This keeps item-level phasing in the rubric while preserving repository-wide inter-skill phase ordering; the same command is never rerun without an explicit selection boundary.

The readable `references/rubric.md`, `.ki-meta/rubric.json`, and `.ki-meta/mode-elements.json` are rendered from the same definition and each has an exact read-only parity check.

## Context and evidence

Rubric items receive prepared domain evidence rather than reading files, parsing frontmatter, invoking the reporter, or knowing CLI arguments.

The wrapper reads the subject into a shared model, then pure context builders select the evidence required by each concern.

Contexts are organised by audited granularity and responsibility rather than by creating one thin file for every item:

- skill-level evidence describes one skill and its parsed artifacts;
- document-level evidence describes a Markdown or frontmatter document;
- collection-level evidence describes relationships across several skills;
- conform capabilities expose the exact safe writes an item may request; and
- footprint or refresh evidence supports those specialised concerns without inflating every item context.

The aggregate context at the wrapper boundary may compose named, required facets.

Dispatch passes only the relevant facet to a family; a family does not accept a repository-wide optional mega-context.

Support modules define the neutral data types they produce and never import types back from the families that consume them.

Parse each immutable artifact once.

Audit may cache its read-only contexts for the whole run.

Conform retains one mutable working model and any raw form needed for faithful persistence.

The checker requests a fresh root context before each conform element so an ordered element sees changes made by an earlier one; context builders may reuse immutable parsed evidence behind that factory.

Name an extracted function when it exposes a domain operation, defines a useful boundary, or removes repeated error-prone mechanics.

Keep a one-use expression inline when extracting it would only hide straightforward work.

## Audit and conform wrappers

Both commands should read as a short orchestration sequence:

```text
parse arguments
  → discover and load subjects
  → create the root-context factory
  → apply an optional mode-element selector
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

The aggregate command owns the default human reporter and reporter-level filtering; it resolves titles from the vendored `.ki-meta/rubric.json`, never from `references/rubric.md`.

Filtering never changes which findings a checker collects or emits.

A skill adopts the structured checker atomically.

An uncodified skill stays on its existing checker until its own catalogue and projections are complete; the new shared checker contains no Markdown compatibility adapter or dual policy path.

## Generated rubric publication

The readable `references/rubric.md` remains useful for people and agents, but it is generated rather than maintained alongside the TypeScript catalogue.

The renderer uses family metadata and ordered item metadata to reproduce:

- family headings and introductions;
- criterion codes, titles, full descriptions, and classification;
- mechanical, judgment, hybrid, and heuristic presentation;
- source citations and standard links; and
- stable item ordering.

The generated file carries a clear generated marker.

A read-only parity check renders in memory and compares exact output with the tracked file; the skill-local `scripts/rubric/project.ts` writes all three generated projections together.

Runtime code using the shared checker never parses the generated Markdown back into policy.

An unmigrated skill may continue using its existing Markdown-driven checker until its structured catalogue and exact renderer/parity gate are complete.

The skill then cuts over atomically: `rubric.md` becomes a generated publication, and the shared checker has no Markdown input or fallback.

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

## Review boundary

The root exemplar refactor changes only `skills/general-governance/ki-skills/`.

It includes the shared rubric and checker modules, the `ki-skills` domain catalogue and contexts, its command wrappers, its generated projections, and its focused tests.

It does not change another skill, bootstrap copying, the generated repository aggregate, fleet declarations, or installed footprints.

Those consumers are addressed only after the root implementation and public module surfaces pass review.

The target contains no legacy aliases, compatibility adapters, dual response names, or Markdown policy fallback.

## Implementation units

Complete these units inside `ki-skills` in order, keeping each independently reviewable.

1. **Rubric model.** Replace the provisional shared types with the target rubric, family, execution, observation, outcome, and definition types. Add generic catalogue validation without changing domain behaviour.
2. **KI skills catalogue.** Wrap the existing item families in family metadata, add focused context selectors, declare violation levels and phases, and export one `KI_SKILLS_RUBRIC` definition. Preserve every existing criterion code and meaning.
3. **Generated projections.** Add the rubric projection schema, then render and parity-check `.ki-meta/rubric.json`, `.ki-meta/mode-elements.json`, and `references/rubric.md` from `KI_SKILLS_RUBRIC`. Remove Markdown parsing from runtime code only after exact parity passes.
4. **Checker module.** Replace the monolithic reporter helper with `scripts/lib/checker/`: planning, execution, response construction, response parsing, and validation. Rename the executable schema to `assets/checker-response.schema.json` with no legacy alias.
5. **Thin wrappers.** Reduce `audit.ts` and `conform.ts` to arguments, subject loading, root-context factories, optional mode-element selection, checker invocation, persistence, and exit. They contain no criterion codes or private result shape.
6. **Module publication.** Publish `rubric` and `checker` as the two `ki-skills` checker modules, prove each declared dependency closure, and add source-level tests for the form another skill will vendor.
7. **Root verification.** Prove direct AUDIT and CONFORM, dry-run, phase selection, all generated parity gates, response schema and exit semantics, and the absence of runtime `rubric.md` reads.

Repository bootstrap changes that copy a consumer's private `scripts/rubric/` tree and both shared modules are a later integration unit outside this focused `ki-skills` refactor.

Do not migrate another skill until these seven units pass review as the root exemplar.

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
