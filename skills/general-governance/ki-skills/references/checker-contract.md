# Checker contract

ADR: [ADR-KI-HARNESS-SKILLS-002](../../../../docs/decisions/ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md)

A checker is the reusable execution engine for a structured governance rubric.

The rubric supplies the rules, their meaning, and their AUDIT and CONFORM mode elements.

The checker selects, plans, and executes those elements for one requested mode, then returns the [canonical checker response](checker-response.md).

It does not own a domain standard or a human presentation.

## Contents

- [Inputs and ownership](#inputs-and-ownership)
- [Mode planning](#mode-planning)
- [Severity ladder](#severity-ladder)
- [Response and exit behaviour](#response-and-exit-behaviour)
- [Conform safety](#conform-safety)
- [Portability and vendoring](#portability-and-vendoring)
- [Relationship to rubric classification](#relationship-to-rubric-classification)

## Inputs and ownership

A checker receives:

- the requested mode, `audit` or `conform`;
- the ordered structured rubric catalogue;
- prepared contexts and explicit capabilities for the target; and
- immutable run identity such as concern and target.

Rubric items own criterion codes, titles, descriptions, sources, classification, mode phasing, and callbacks.

The checker never invents or parses those values from `rubric.md`.

The command wrapper owns arguments, target discovery, subject reads, context construction, dry-run state, and persistence.

The checker owns generic planning, execution, typed findings, response construction, and exit status.

## Mode planning

Each executable rubric item declares an AUDIT element, a CONFORM element, or both.

An element states its phase, optional ordering edges, read scopes, write scopes, and callback.

The shared phase order is:

```text
prepare → inspect → write → project → normalise
```

The checker plans only elements for the requested mode.

It rejects an unknown phase, dependency cycle, phase reversal, or write collision without an explicit ordering edge.

The plan is deterministic: phase first, declared dependencies second, and stable rubric order as the final tie-breaker.

AUDIT elements are read-only and declare no write scope.

CONFORM elements receive only their explicit safe capabilities and return typed actions or resulting findings.

Any `.ki-meta/mode-elements.json` used by repository-wide orchestration is a generated projection of the structured rubric rather than a second authored execution plan.

## Severity ladder

One ladder applies to both modes.

| Level        | Group     | Blocks? | Meaning                                                                   |
| ------------ | --------- | ------- | ------------------------------------------------------------------------- |
| **FAIL**     | violation | yes     | A required criterion is violated — a ship-stopper.                        |
| **WARN**     | violation | no      | A recommended criterion is violated — should fix, can ship with a reason. |
| **POLISH**   | violation | no      | A minor or cosmetic divergence.                                           |
| **ADVISORY** | deferred  | no      | Judgment or manual work is needed; the checker does not decide it.        |
| **INFO**     | context   | no      | Neutral context, not a verdict against a criterion.                       |
| **NA**       | context   | no      | A criterion was considered but does not apply to this target.             |
| **PASS**     | met       | no      | A criterion was checked and is satisfied.                                 |

An M finding records deterministic observed state during AUDIT and an action or resulting state during CONFORM.

An applicable J criterion becomes one `J` / `ADVISORY` finding and never changes process exit status.

## Response and exit behaviour

The checker returns one complete canonical JSONL response containing every finding, regardless of how a later reporter will filter its display.

It exits non-zero if and only if the response contains at least one `M` / `FAIL` finding.

Malformed planning, execution, or response data is a checker failure.

The checker does not render a terminal table, write report files, or carry a presentation-format flag.

A downstream reporter validates the response before resolving titles, filtering displayed levels, or rendering a human view.

## Conform safety

CONFORM inspects before writing.

An element writes only when its target actually drifts, records PASS when already conformant, and honours dry-run without persistence.

A callback receives the smallest capability surface that permits its declared action.

It does not open arbitrary files or mutate through an undeclared side channel.

## Portability and vendoring

The reusable implementation is split into two declared modules owned by `ki-skills`:

- `scripts/lib/rubric/` contains the generic rubric types and catalogue mechanics; and
- `scripts/lib/checker/` contains planning, AUDIT and CONFORM execution, JSONL response construction, and validation.

A dependent governance skill vendors both modules into `scripts/vendored/ki-skills/` and imports only those local copies.

The dependent supplies its domain rubric items, contexts, and thin command wrappers.

The shared modules use builtins only, contain their complete declared dependency closure, and never import from another skill at runtime.

A checker-module dependency supplies implementation only and does not create a `depends-on:` governance-coverage edge.

## Relationship to rubric classification

Every mechanical criterion has an executable deterministic element for the modes in which it applies.

Every judgment criterion has a concrete prompt and produces one advisory when applicable.

A criterion may declare both parts when it genuinely combines deterministic evidence with a judgment decision.

Mechanical work belongs in the checker rather than being deferred to a model merely because its callback has not yet been implemented.
