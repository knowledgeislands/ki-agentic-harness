# Checker contract

ADR: [ADR-KI-HARNESS-SKILLS-002](../../../../docs/decisions/ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md)

A checker is the reusable execution engine for a structured governance rubric.

The rubric supplies the rules, their meaning, and their AUDIT and CONFORM executions.

The checker selects, plans, and runs those executions for one requested mode, then returns the [canonical checker response](checker-response.md).

It does not own a domain standard or a human presentation.

## Contents

- [Normative language](#normative-language)
- [Inputs and ownership](#inputs-and-ownership)
- [Execution planning](#execution-planning)
- [Finding levels](#finding-levels)
- [Response and exit behaviour](#response-and-exit-behaviour)
- [Conform safety](#conform-safety)
- [Portability and vendoring](#portability-and-vendoring)
- [Relationship to rubric classification](#relationship-to-rubric-classification)

## Normative language

Uppercase normative terms such as `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` use the BCP 14 meanings defined by [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174).

Lowercase forms are ordinary prose.

## Inputs and ownership

A checker receives:

- the requested mode, `audit` or `conform`;
- the ordered structured rubric catalogue;
- a root-context factory exposing prepared evidence and explicit capabilities for the target;
- immutable run identity such as concern and target.

Rubric items own criterion codes, titles, descriptions, sources, classification, mode phasing, and callbacks.

The checker never invents or parses those values from `rubric.md`.

The command wrapper owns arguments, target discovery, subject reads, context construction, dry-run state, and persistence.

The checker owns generic planning, execution, typed findings, response construction, and exit status.

## Execution planning

Each mechanical rubric item declares an AUDIT execution and MAY declare a CONFORM execution.

An execution states its phase and callback.

The shared phase order is:

```text
PREPARE → INSPECT → PRIMARY → DERIVED → NORMALISE
```

`PREPARE` establishes prerequisites, `INSPECT` evaluates evidence, `PRIMARY` changes primary governed artifacts, `DERIVED` rebuilds artifacts derived from primary state, and `NORMALISE` applies final formatting or canonical ordering.

The checker plans only mechanical executions for the requested mode.

It rejects an unknown phase.

The plan is deterministic: phase first, then stable family and item order.

AUDIT executions are read-only.

CONFORM executions receive only their explicit safe capabilities and return typed outcomes.

When a mechanical item has no CONFORM execution, CONFORM MUST run its required AUDIT execution read-only so the item remains represented in the response.

Every execution MUST return at least one outcome rather than using an empty result to imply PASS.

The checker asks the root-context factory for current evidence before each CONFORM execution, so a later execution observes mutations made by an earlier one.

If repository-wide orchestration later requires a static checker schedule or dependency metadata, that integration MUST define and justify its generated projection without turning it into a second authored execution plan.

## Finding levels

One response vocabulary applies to both modes.

| Level              | Source     | Blocks? | Meaning                                                                   |
| ------------------ | ---------- | ------- | ------------------------------------------------------------------------- |
| **FAIL**           | mechanical | yes     | A required criterion is violated — a ship-stopper.                        |
| **WARN**           | mechanical | no      | A recommended criterion is violated — should fix, can ship with a reason. |
| **FIXED**          | mechanical | no      | CONFORM changed the subject and satisfied the criterion.                  |
| **INFO**           | mechanical | no      | Neutral context, not a verdict against a criterion.                       |
| **NOT_APPLICABLE** | mechanical | no      | A criterion was considered but does not apply to this target.             |
| **PASS**           | mechanical | no      | A criterion was checked and is satisfied.                                 |

A mechanical item declares only `FAIL` or `WARN` as its violation level.

Its callback returns `VIOLATION`, `PASS`, `NOT_APPLICABLE`, `INFO`, or — during CONFORM only — `FIXED`; the checker maps `VIOLATION` to the item's declared level and the others directly to the response level above.

A judgment item has no checker execution.

The checker MUST NOT emit a synthetic finding for it and MUST report the number of mechanically unevaluated judgment items in the response summary.

## Response and exit behaviour

The checker returns one complete canonical JSONL response containing every finding, regardless of how a later reporter will filter its display.

It exits non-zero if and only if the response contains at least one `FAIL` finding.

Malformed planning, execution, or response data is a checker failure.

The checker does not render a terminal table, write report files, or carry a presentation-format flag.

A downstream reporter validates the self-contained response before filtering displayed levels or rendering a human view.

## Conform safety

Every CONFORM execution inspects its own declared target before writing, including a `PREPARE` execution that establishes prerequisites ahead of the shared `INSPECT` phase.

An execution writes only when its target actually drifts, records PASS when already conformant, and honours dry-run without persistence.

A callback receives the smallest capability surface that permits its declared action.

It does not open arbitrary files or mutate through an undeclared side channel.

## Portability and vendoring

The reusable implementation is split into two declared modules owned by `ki-skills`:

- `scripts/lib/rubric/` contains the generic rubric types and catalogue mechanics; and
- `scripts/lib/checker/` contains planning, AUDIT and CONFORM execution, JSONL response construction, and validation.

A dependent governance skill vendors both modules into `scripts/vendored/ki-skills/` and imports only those local copies.

The dependent supplies its domain rubric items, contexts, generated rubric publication, and thin command wrappers.

The shared modules use builtins only, contain their complete declared dependency closure, and never import from another skill at runtime.

A checker-module dependency supplies implementation only and does not create a `depends-on:` governance-coverage edge.

## Relationship to rubric classification

Every rubric item is exactly one of `MECHANICAL` or `JUDGMENT`.

Every mechanical criterion has an executable deterministic element for the modes in which it applies.

Every judgment criterion has a concrete prompt for a later agent or reviewer.

AUDIT and CONFORM MUST NOT evaluate that prompt or present it as a mechanical result.

When a written rule contains both concerns, the author splits it into two independently identifiable rubric items.

Mechanical work belongs in the checker rather than being deferred to a model merely because its callback has not yet been implemented.
