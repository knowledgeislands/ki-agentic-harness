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
- [Progress](#progress)
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
- ordered evaluation subjects, each with selected rubric families and a context factory exposing prepared evidence and explicit capabilities;
- immutable run identity such as concern and target.

Rubric items own criterion codes, titles, descriptions, sources, classification, mode phasing, and callbacks.

The checker never invents or parses those values from `rubric.md`.

The command wrapper owns arguments, target discovery, subject reads, context construction, dry-run state, and persistence.

The checker owns generic planning, execution, typed findings, response construction, and exit status.

## Execution planning

Each mechanical rubric item declares an AUDIT execution and MAY declare a safe repair action.

An execution or repair action states its phase and callback.

The shared phase order is:

```text
PREPARE → INSPECT → PRIMARY → DERIVED → NORMALISE
```

`PREPARE` establishes prerequisites, `INSPECT` evaluates evidence, `PRIMARY` changes primary governed artifacts, `DERIVED` rebuilds artifacts derived from primary state, and `NORMALISE` applies final formatting or canonical ordering.

The checker plans one progress unit for every selected mechanical rubric item.

During CONFORM, an item with a repair action runs an immediate transaction: AUDIT, conditional repair, then AUDIT again.

`VIOLATION` makes repair eligible by default.

`INFO` is eligible only when that item explicitly declares `repairOn: ['INFO']`.

The final response contains only the terminal post-audit outcomes, never the preliminary audit or action outcome.

The checker emits `FIXED` only when the repair observed a persistent change and the post-audit satisfies the repair eligibility condition.

An item without a repair action runs AUDIT read-only during CONFORM so it remains represented in the response.

It rejects an unknown phase.

The plan is deterministic: phase first, then stable family and item order.

AUDIT executions are read-only.

Repair actions receive only their explicit safe capabilities and return whether they observed a persistent change.

Every execution MUST return at least one outcome rather than using an empty result to imply PASS.

The checker caches each subject's immutable AUDIT context for the run.

For one CONFORM transaction it asks the relevant subject-context factory before the pre-audit, repair, and post-audit, preserving safe mutable state while observing fresh evidence after a write.

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

A mechanical item declares `FAIL` or `WARN` as its default violation level.

Its AUDIT callback returns `VIOLATION`, `PASS`, `NOT_APPLICABLE`, or `INFO`; the checker maps `VIOLATION` to the item's declared default unless that outcome selects an alternative the item explicitly permits through `overrideLevels`, and maps the others directly to the response level above.

The checker alone derives `FIXED` from a verified repair transaction.

A judgment aspect has no checker execution.

The checker MUST NOT emit a synthetic finding for it and MUST report the number of selected rubric items carrying a mechanically unevaluated judgment aspect in the response summary.

A hybrid item runs its mechanical aspect normally and also contributes one to that judgment count.

## Progress

Progress is execution status, not a finding and not a second response transport.

An AUDIT or CONFORM checker MAY receive a tracker callback.

It emits a `start` event before any selected mechanical item, one `item-complete` event after each complete item transaction, and a `complete` event after a successful run.

If an execution fails after it has started, it emits a final `failed` event before rethrowing the error.

Each event carries the requested mode and a stable `completed` / `total` counter; an item event also carries that rubric item's code, title, phase, and subject when present.

The tracker MUST NOT add, remove, reorder, or reinterpret executions or findings.

A tracker error MUST NOT change checker execution, canonical response, or exit status.

Direct AUDIT and CONFORM commands accept `--progress=auto|always|never`.

`auto` is the default and shows a compact status line only when stderr is interactive; `always` writes one status line per event to stderr; `never` suppresses all progress output.

The terminal tracker redraws one line while interactive, so detailed findings still arrive only in the final reporter output.

## Response and exit behaviour

The checker returns one complete canonical JSONL response containing every finding, regardless of how a later reporter will filter its display.

Progress uses its separate tracker callback and, for CLI invocation, stderr; it MUST NOT appear in the JSONL response or stdout.

It exits non-zero if and only if the response contains at least one `FAIL` finding.

Malformed planning, execution, or response data is a checker failure.

The checker does not render a terminal table, write report files, or carry a presentation-format flag.

A downstream reporter validates the self-contained response before filtering displayed levels or rendering a human view.

## Conform safety

Every CONFORM repair is gated by its own immediate AUDIT outcome before writing, including a `PREPARE` action that establishes prerequisites ahead of the shared `INSPECT` phase.

A repair writes only when its target actually drifts and honours dry-run without persistence.

A dry run and a no-op repair never produce `FIXED` because they cannot observe a persistent change.

A callback receives the smallest capability surface that permits its declared action.

It does not open arbitrary files or mutate through an undeclared side channel.

## Portability and vendoring

The reusable implementation is split into three declared modules owned by `ki-skills`:

- `scripts/shared/rubric.ts` contains the generic rubric types and catalogue mechanics; and
- `scripts/shared/checker.ts` contains planning, AUDIT and CONFORM execution, JSONL response construction, and validation; and
- `scripts/shared/reporter.ts` contains shared display filtering and terminal presentation.

Each declared module is one self-contained vendorable file rather than a directory tree.

A dependent governance skill vendors all three modules into `scripts/vendored/ki-skills/` and imports only those local copies.

The dependent supplies its domain rubric items, contexts, generated rubric publication, and thin command wrappers. Repository bootstrap copies that private `scripts/rubric/` tree beside the wrappers so the vendored checker remains standalone; the tree is not a declared module and no sibling skill may import it.

The shared modules use builtins only, contain their complete declared dependency closure, and never import from another skill at runtime.

A shared-module dependency supplies implementation only and does not create a `ki-depends-on:` governance-coverage edge.

## Relationship to rubric classification

Every rubric item has a `MECHANICAL` aspect, a `JUDGMENT` aspect, or both, and MUST have at least one.

Every mechanical aspect has an executable deterministic execution for the modes in which it applies.

Every judgment aspect has a concrete prompt for a later agent or reviewer.

AUDIT and CONFORM MUST NOT evaluate that prompt or present it as a mechanical result.

An item carrying both aspects retains one code and one shared rule identity.

Mechanical work belongs in the checker rather than being deferred to a model merely because its callback has not yet been implemented.
