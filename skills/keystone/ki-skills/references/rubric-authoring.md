# Rubric authoring

This is the target model for turning a governance standard into an executable rubric.

`ki-skills` proves the model as the self-governing root of the governance-skill system; later skills adopt it one at a time rather than inventing their own checker architecture, so they are focused on the what, how and why, not the how-to-build.

Use this guide when creating or refactoring a governance skill's rubric and checkers (e.g. audit, conform) implementation.

## Contents

- [Rubric authoring](#rubric-authoring)
  - [Contents](#contents)
  - [Normative language](#normative-language)
  - [The knowledge chain](#the-knowledge-chain)
  - [Target layout](#target-layout)
  - [Rubric families and items](#rubric-families-and-items)
  - [Maintaining a rubric](#maintaining-a-rubric)
  - [Target type shape](#target-type-shape)
  - [Rubric execution and phasing](#rubric-execution-and-phasing)
  - [Generated publication and optional projections](#generated-publication-and-optional-projections)
  - [Context and evidence](#context-and-evidence)
  - [Audit and conform wrappers](#audit-and-conform-wrappers)
  - [Educate boundary](#educate-boundary)
  - [Checker response and reporters](#checker-response-and-reporters)
  - [Generated rubric publication](#generated-rubric-publication)
  - [Verification](#verification)
  - [Review boundary](#review-boundary)
  - [Implementation units](#implementation-units)
  - [Rollout checklist](#rollout-checklist)

## Normative language

Uppercase normative terms such as `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` use the BCP 14 meanings defined by [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174).

Lowercase forms are ordinary prose.

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
- The checker runtime plans and executes the rubric's mechanical AUDIT or CONFORM executions. It MUST NOT define criteria of its own or pretend to evaluate judgment aspects.
- The checker returns one canonical JSONL response containing every structured finding.
- Reporters consume that JSONL response and turn it into terminal, Markdown, or other views without changing what was checked.
- `rubric.md` is a deterministic human-readable publication generated from the structured rubric. It is never a second authored source of truth. It contains a statement at the start of it to make this clear to readers and agents.
- `exemplars.md` shows representative good outcomes; it does not define requirements.
- `checker-contract.md` owns deterministic execution and exit behaviour.
- `checker-response.md` defines the JSONL transport returned by a checker.

## Target layout

```text
scripts/
  audit.ts                     # read-only command entry
  conform.ts                   # safe-write command entry
  educate.ts                   # scaffold command entry
  lib/                         # deliberately vendorable modules
    rubric.ts                  # generic rubric model and catalogue validation
    rubric.test.ts
    checker.ts                 # planning, execution, response, and validation
    checker.test.ts
    reporter.ts                # semantic filtering and terminal presentation
    reporter.test.ts
  rubric/                      # private implementation for this skill
    items/
      index.ts
      <family>.ts              # criteria grouped by one coherent concern
    contexts/
      contexts.ts              # public context contracts and composition
      <evidence>.ts            # shared parsing or evidence builders
    publish.ts                 # deterministic rubric.md renderer and publisher
assets/
  checker-response.schema.json # canonical JSONL record schema
references/
  rubric.md                   # generated readable publication
```

Top-level non-test files in `scripts/` are callable commands.

Private reusable implementation lives in `scripts/internal/`. Only modules explicitly published through `checker-modules` live in `scripts/shared/` and form a cross-skill contract for checkers.

Another skill receives a declared module below `scripts/vendored/<provider>/` and imports only that local copy. `ki-skills` is an exception to this as it already owns the shared rubric, checker, and reporter modules under `scripts/shared/`.

Repository bootstrap also copies the consumer's private `scripts/rubric/` tree beside its AUDIT and CONFORM entry points. That tree is part of the consumer's standalone checker payload, not a cross-skill module contract; other skills MUST NOT import it.

The target shared modules are `scripts/shared/rubric.ts`, `scripts/shared/checker.ts`, and `scripts/shared/reporter.ts`.

Each is one self-contained vendorable file with an adjacent source test; ordinary source-code modularity does not justify making a consumer copy an internal module tree.

`ki-skills` publishes them as `checker-modules: [rubric, checker, reporter]`.

A dependent governance skill declares `ki-checker-dependencies: [ki-skills:rubric, ki-skills:checker, ki-skills:reporter]`; relative imports between those modules remain inside the copied `scripts/vendored/ki-skills/` namespace.

The rubric module owns the generic domain model and catalogue mechanics.

The checker module consumes that model and owns planning, execution, and the JSONL boundary.

The reporter module consumes the checker result and owns semantic display filtering and terminal presentation; it never changes what ran or the checker exit status.

Together the three modules contain the reusable dependency closure and must not reach into the provider's private `scripts/rubric/` tree.

`checker-contract.md` and `checker-response.md` are the guidance references for that implementation: the former defines checker behaviour, while the latter defines its JSONL boundary.

Their internal files may change without changing those conceptual contracts or the declared vendorable modules.

## Rubric families and items

A family groups criteria that assess one coherent concern, such as `NAME`, `DESCRIPTION`, or `KI-SHAPE`.

The family catalogue owns its stable family code, readable title, standard section, explanatory introduction, ordered item list, and any presentation metadata needed to reproduce the readable rubric.

The files under `scripts/rubric/items/` MUST have one uniform responsibility:

- `index.ts` is catalogue wiring only. It imports each ordered family collection, defines family metadata and `selectContext`, and exports the complete rubric plus any catalogue-wide aggregates. It MUST NOT define rubric items, execution callbacks, evidence builders, or write capabilities.
- Each family lives in one semantic `<family>.ts` file. Every rule in that family MUST be exported individually with its stable code expressed as an identifier, such as `NAME_1`, and the file MUST also export one ordered family collection, such as `NAME`.
- A family file owns that family's rule policy and pure item-level helpers. Constants, helpers, and types used only by that family remain private.
- Filesystem discovery, parsing shared by several families, target inspection, and CONFORM write capabilities belong under `scripts/rubric/contexts/`, not in an item file.
- A family collection is imported by `index.ts`; another family file MUST NOT import it as an implicit extension mechanism.

This layout is intentionally repetitive at the family boundary: it makes each rule directly testable and each concern immediately locatable while keeping the complete catalogue readable.

Each rubric item owns:

- a stable semantic `code`;
- a concise `title` suitable for `${code}: ${title}` presentation;
- the complete normative `description` needed by the generated rubric;
- its cited `sources`;
- a `MECHANICAL` aspect with its required AUDIT execution and optional safe CONFORM execution;
- a `JUDGMENT` aspect with its concrete review `prompt`; or
- both aspects when one stable rule genuinely has deterministic and judgment concerns.

A hybrid rule remains one item with one stable code rather than duplicating its shared identity and prose across separate entries.

A deterministic check is mechanical even when it has not yet been implemented; absence of implementation is work to finish, not a reason to relabel it as judgment.

A judgment aspect carries a concrete review prompt for a later agent or reviewer.

AUDIT and CONFORM MUST NOT claim to evaluate it mechanically.

The item module owns its rule policy.

Helpers, constants, and types used only by one family remain private in that family module; the module exports only its public rubric items and family collection.

Helpers, constants, and types used only by AUDIT or CONFORM remain private in that command module.

Skill-specific behaviour shared by both commands belongs in `scripts/rubric/contexts/`; only behaviour deliberately reusable across other skills belongs in `scripts/shared/`.

## Maintaining a rubric

Once a skill conforms to this structure, ordinary maintenance SHOULD be isolated to the rule being changed:

1. Update the exported rubric item in its semantic family file.
2. Add or refine focused context evidence only when the rule needs information or a safe write capability that the existing context does not provide.
3. Regenerate `references/rubric.md` from the canonical TypeScript catalogue.
4. Run the skill's focused tests and direct AUDIT, then run the live `ki-skills` audit against the skill.

The top-level AUDIT, CONFORM, and EDUCATE commands, family catalogue wiring, generic checker execution, canonical JSONL response, and reporter SHOULD remain unchanged during an ordinary rule adjustment.

A change MAY cross those boundaries only when it introduces a genuinely new rubric family, requires a reusable context capability, or deliberately changes the shared rubric, checker, or reporter contract.

This boundary is the payoff from codifying the rubric: most future work becomes a local policy change with local evidence and tests rather than another edit to a large audit or conform program.

## Target type shape

The shared rubric model should be small enough to understand from its public types.

The names below are illustrative TypeScript, but their responsibilities are fixed:

```ts
type RubricMode = 'audit' | 'conform'
type RubricPhase =
  | 'PREPARE' // establish prerequisites
  | 'INSPECT' // evaluate evidence
  | 'PRIMARY' // change primary governed artifacts
  | 'DERIVED' // rebuild artifacts derived from primary state
  | 'NORMALISE' // apply final formatting or canonical ordering

type ViolationLevel =
  | 'FAIL' // required criterion; blocks on failure
  | 'WARN' // recommended criterion; does not block

type RubricOutcomes<Result> = readonly [Result, ...Result[]]

type RubricExecution<Context, Result> = {
  phase: RubricPhase
  run: (context: Context) => RubricOutcomes<Result>
}

type RubricType = 'MECHANICAL' | 'JUDGMENT'

type MechanicalRubric<Context> = {
  level: ViolationLevel // default for VIOLATION outcomes
  overrideLevels?: readonly ViolationLevel[] // exceptional alternatives this item explicitly permits
  heuristic?: boolean // presentation metadata for deterministic evidence with known limits
  audit: RubricExecution<Context, AuditOutcome>
  conform?: RubricExecution<Context, ConformOutcome>
}

type JudgmentRubric = {
  prompt: string
}

type RubricItemBase = {
  code: string
  title: string
  description: string
  sources: readonly string[]
}

type RubricItem<Context> = RubricItemBase &
  ({ mechanical: MechanicalRubric<Context>; judgment?: JudgmentRubric } | { mechanical?: never; judgment: JudgmentRubric })
```

Every item contains a mechanical aspect, a judgment aspect, or both; it MUST contain at least one.

Its published `RubricType` values are derived from the aspects it carries rather than repeated as authored metadata.

The type and catalogue validator rejects an item with neither aspect.

The criterion's default violation level belongs to the mechanical item; callbacks do not repeat it alongside every result.

When one stable criterion intentionally distinguishes an exceptional violation from its ordinary severity, its mechanical aspect MAY declare the alternative in `overrideLevels`, and that `VIOLATION` outcome MAY select it. An undeclared override is invalid. Use this only to preserve one rule's established meaning; it is not a substitute for splitting unrelated rules.

Both modes return one common outcome shape.

AUDIT permits the common read-only subset, while CONFORM additionally permits `FIXED`:

```ts
type OutcomeStatus = 'PASS' | 'VIOLATION' | 'NOT_APPLICABLE' | 'INFO' | 'FIXED'

type RubricOutcome<Status extends OutcomeStatus> = { status: Status; message: string; subject?: string } & (Status extends 'VIOLATION'
  ? { level?: ViolationLevel }
  : { level?: never })

type AuditOutcome = RubricOutcome<Exclude<OutcomeStatus, 'FIXED'>>
type ConformOutcome = RubricOutcome<OutcomeStatus>
```

`VIOLATION` means the criterion remains unmet; the checker maps it to the outcome override or the item's default `ViolationLevel` in the canonical response.

The other mechanical outcomes map directly to `PASS`, `NOT_APPLICABLE`, `INFO`, or `FIXED`.

`INFO` is neutral context rather than a violation, so it does not belong in `ViolationLevel`.

An execution MUST return at least one outcome: `PASS` when the criterion is met, `NOT_APPLICABLE` when it cannot apply, or the appropriate substantive result.

During CONFORM, the checker uses the item's CONFORM execution when present and otherwise runs its required AUDIT execution read-only, so every mechanical item remains represented.

A judgment aspect has no executable callback.

AUDIT and CONFORM MUST NOT emit a synthetic finding for it; the checker summary reports how many selected items carry a mechanically unevaluated judgment aspect.

A hybrid item executes its mechanical aspect normally and also contributes one to that judgment count.

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
  families: readonly RubricFamily<RootContext, unknown>[]
}
```

The concrete implementation may use a typed family helper to preserve heterogeneous context inference; it must not replace these focused contexts with `unknown` inside item callbacks.

The definition is the one object passed to generic catalogue validation, checker execution, and projection rendering.

## Rubric execution and phasing

A rubric execution is the executable side of a mechanical rubric aspect.

A mechanical item always declares an AUDIT execution and may add a CONFORM execution.

A judgment aspect declares its review prompt and has no execution or phase.

Each declared execution carries:

- its mode, derived from whether it is the item's `audit` or `conform` element;
- a phase from the shared ordered vocabulary;
- the callback that evaluates or changes the subject.

The shared phase order is `PREPARE → INSPECT → PRIMARY → DERIVED → NORMALISE`.

- `PREPARE` establishes prerequisites
- `INSPECT` evaluates evidence
- `PRIMARY` changes primary governed artifacts
- `DERIVED` rebuilds artifacts derived from primary state
- `NORMALISE` applies final formatting or canonical ordering.

AUDIT executions normally inspect, but the phase remains explicit so composed work has one planning model.

CONFORM executions declare where their safe action belongs rather than relying on wrapper order or incidental source order.

The checker runtime selects the executions for the requested mode and runs them deterministically by phase, then by stable family and item order.

Criterion codes remain finding identity; execution identity is derived from the criterion and mode rather than maintained as a second unrelated name.

The structured rubric is the authored source of phasing.

If repository-wide orchestration later requires a static execution schedule or dependency metadata, that integration MUST define and justify the additional projection without expanding the root item API speculatively.

## Generated publication and optional projections

The structured TypeScript definition is the authored source.

The required projection is the readable `references/rubric.md` publication.

It is generated from the structured catalogue, begins with a conspicuous notice that the canonical definitions live under `scripts/rubric/`, and has an exact read-only parity check.

A versioned machine projection of rubric metadata or an execution schedule MAY be added when a concrete consumer needs to load the catalogue without importing callback code.

Such a projection is generated, never authored, and its path and responsibility-based name are decided by that integration rather than fixed prematurely here.

It MUST contain no callbacks or filesystem paths to source modules, and it MUST have an exact parity gate against the structured catalogue.

No machine projection is a prerequisite for proving the root `ki-skills` checker unless its implementation exposes a concrete consumer that cannot use the in-memory catalogue.

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

Audit caches each subject's read-only context for the whole run.

Conform retains one mutable working model and any raw form needed for faithful persistence.

The checker requests fresh context from the relevant subject before each conform element so an ordered element sees changes made by an earlier one; context builders may reuse immutable parsed evidence behind that factory.

Name an extracted function when it exposes a domain operation, defines a useful boundary, or removes repeated error-prone mechanics.

Keep a one-use expression inline when extracting it would only hide straightforward work.

## Audit and conform wrappers

Both commands should read as a short orchestration sequence:

```text
parse arguments
  → discover and load subjects
  → create each subject-context factory
  → ask the checker runtime to plan and execute the mode
  → return the canonical JSONL response
```

`audit.ts` owns command arguments, read scope, subject discovery, shared snapshot creation, and checker invocation.

It is read-only and contains no criterion codes or policy branches.

`conform.ts` owns command arguments, dry-run behaviour, mutable working state, explicit write capabilities, persistence, and checker invocation.

It contains no criterion codes or duplicate rule logic.

An audit callback returns typed outcomes.

A conform callback receives only the capabilities it needs, performs its declared safe action, and returns a typed action; shared rubric execution converts that action into a finding.

Judgment work is not emitted as synthetic findings or accumulated in a private TODO collection.

The response summary MUST report the number of selected rubric items carrying a judgment aspect that AUDIT or CONFORM did not mechanically evaluate.

## Educate boundary

EDUCATE is a sibling universal mode, not a checker mode.

AUDIT evaluates governed state and CONFORM safely remediates existing governed state; EDUCATE provisions or scaffolds the subject and its mechanical footprint so those checker modes can operate.

An EDUCATE implementation may eventually consume rubric-derived templates or invoke CONFORM after establishing a minimum subject, but it does not execute through `scripts/shared/checker.ts` merely to reuse its orchestration.

For the root exemplar refactor, `scripts/educate.ts` remains unchanged and outside the checker implementation units.

Root verification proves the relationship by auditing an educated fixture; a future reusable educator module is designed separately if repeated implementation demonstrates the need.

## Checker response and reporters

The checker response is transport infrastructure, not a policy engine.

The checker builds and emits the JSONL run, calculates its complete finding summary, and applies the checker exit rule from typed findings.

Response construction does not:

- parse `rubric.md`;
- invent criterion titles, classifications, or judgment prompts;
- read the audited subject;
- render a terminal table; or
- write report files.

JSONL parsing and response validation are separate from response construction.

Rubric-aware validation is also separate: it resolves finding codes against the structured catalogue, checks level compatibility, and verifies the unevaluated-judgment count in the summary.

A reporter starts with a canonical in-memory checker result. A direct `audit.ts` or `conform.ts` invocation selects terminal presentation with `--reporter=terminal`; otherwise the command serialises that result as canonical JSONL. Shared filtering and presentation live in `scripts/shared/reporter.ts`, not in a separate command entry.

An out-of-process consumer parses and validates a checker JSONL stream before passing the equivalent typed result to presentation. Malformed transport never falls back to a private renderer.

It may filter displayed levels, render `${code}: ${title}`, write Markdown, or feed another system, but it never reruns or suppresses a check.

The checker obtains criterion titles from its in-memory catalogue and includes them in the canonical response, so a reporter does not need to parse `references/rubric.md` or load a second policy file.

An aggregate command invokes checkers without a reporter, consumes their complete JSONL streams, and owns aggregate presentation. Direct and aggregate presentation reuse the shared reporter semantics rather than defining separate level vocabularies or filters.

Filtering never changes which findings a checker collects or emits.

A skill adopts the structured checker atomically.

An uncodified skill stays on its existing checker until its own catalogue and generated publication are complete; the new shared checker contains no Markdown compatibility adapter or dual policy path.

## Generated rubric publication

The readable `references/rubric.md` remains useful for people and agents, but it is generated rather than maintained alongside the TypeScript catalogue.

Its first content is a generated notice naming `scripts/rubric/` as the canonical definition and directing changes there.

The renderer uses family metadata and ordered item metadata to reproduce:

- family headings and introductions;
- criterion codes, titles, full descriptions, and classification;
- mechanical, judgment, hybrid, and heuristic presentation;
- source citations and standard links; and
- stable item ordering.

The generated file carries a clear generated marker.

A read-only parity check renders in memory and compares exact output with the tracked file; the skill-local `scripts/rubric/publish.ts` writes the publication.

Runtime code using the shared checker never parses the generated Markdown back into policy.

An unmigrated skill may continue using its existing Markdown-driven checker until its structured catalogue and exact renderer/parity gate are complete.

The skill then cuts over atomically: `rubric.md` becomes a generated publication, and the shared checker has no Markdown input or fallback.

## Verification

Tests sit beside the command or module they cover.

At minimum, a structured rubric proves:

- every code is unique and belongs to the expected family;
- every item has complete identity, source, and classification metadata;
- every mechanical execution declares a valid phase;
- execution order is deterministic by phase and catalogue order;
- every mechanical item has its required implementation or an explicit migration failure;
- the response emits no judgment findings and its unevaluated-judgment count exactly matches the selected items carrying a judgment aspect;
- audit is read-only and conform honours dry-run before persistence;
- checker response satisfies the executable schema and exit rule;
- generated `rubric.md` exactly matches the structured catalogue; and
- each declared vendored rubric, checker, and reporter module behaves the same as its source module.

## Review boundary

The root exemplar refactor changes only `skills/keystone/ki-skills/`.

It includes the shared rubric, checker, and reporter modules, the `ki-skills` domain catalogue and contexts, its command wrappers, its generated rubric publication, and its focused tests.

It does not change another skill, bootstrap copying, the generated repository aggregate, fleet declarations, or installed footprints.

Those consumers are addressed only after the root implementation and public module surfaces pass review.

The target contains no legacy aliases, compatibility adapters, dual response names, or Markdown policy fallback.

## Implementation units

Complete these units inside `ki-skills` in order, keeping each independently reviewable.

1. **Rubric model.** Replace the provisional shared types with the target rubric, family, execution, outcome, and definition types. Add generic catalogue validation without changing domain behaviour.
2. **KI skills catalogue.** Wrap the existing item families in family metadata, add focused context selectors, declare violation levels and phases, and export one `KI_SKILLS_RUBRIC` definition. Preserve every existing criterion code and meaning, including hybrid items with both aspects.
3. **Generated rubric.** Render and parity-check `references/rubric.md` from `KI_SKILLS_RUBRIC`, including its canonical-source notice. Remove Markdown parsing from runtime code only after exact parity passes.
4. **Checker module.** Replace the monolithic reporter helper with the self-contained `scripts/shared/checker.ts`: planning, execution, response construction, response parsing, and validation. Rename the executable schema to `assets/checker-response.schema.json` with no legacy alias.
5. **Thin wrappers.** Reduce `audit.ts` and `conform.ts` to arguments, subject loading, subject-context factories, checker invocation, persistence, and exit. They contain no criterion codes or private result shape.
6. **Module publication.** Publish `rubric`, `checker`, and `reporter` as the three `ki-skills` checker modules, prove the declared dependency closure, and add source-level tests for the exact form another skill will vendor.
7. **Root verification.** Prove direct AUDIT and CONFORM, dry-run, phase selection, generated-rubric parity, response schema and exit semantics, the absence of runtime `rubric.md` reads, and a passing audit of an educated fixture.

Repository bootstrap copies a consumer's private `scripts/rubric/` tree and the three declared shared modules into its standalone checker payload. Generated rubric metadata or a checker schedule is added only when a concrete consumer demonstrates the need and settles the responsibility-based name.

Do not migrate another skill until these seven units pass review as the root exemplar.

## Rollout checklist

Apply the model to one governance skill at a time after `ki-skills` proves it.

- Confirm the standard and source list are current enough to serve as inputs.
- Codify every criterion into ordered families without changing its meaning or stable code.
- Declare each mechanical item's AUDIT and optional CONFORM executions and phases in the same catalogue.
- Add the family metadata needed to render the readable rubric exactly.
- Build subject snapshots and focused contexts; keep policy in item modules.
- Reduce audit and conform to thin orchestration wrappers over the shared checker runtime.
- Declare the complete shared module closure: `rubric`, `checker`, and `reporter`; migrate retired reporter dependencies rather than retaining aliases.
- Verify repository bootstrap copies the skill's private `scripts/rubric/` tree beside its entry points without exposing that tree as a cross-skill dependency.
- Separate checker response construction, response validation, rubric-aware validation, and downstream reporting.
- Generate `rubric.md` and add an exact parity gate before retiring Markdown as an authored input.
- Add machine-readable rubric metadata or a checker schedule only for a concrete consumer, generated from the same catalogue with an exact parity gate.
- Test the source command against one explicit skill target: terminal output for a human and unfiltered JSONL when no reporter is selected.
- Verify that display filtering changes neither executed items nor exit status; use all levels only for diagnosis.
- Verify source commands, dry-run behaviour, JSONL schema and exit status before re-vendoring, then verify source-to-vendored parity for every declared module.
- Migrate one skill atomically; do not mix a structured catalogue with a Markdown-policy fallback or a private reporter.
- Record any reusable improvement in this guide before moving to the next skill.
