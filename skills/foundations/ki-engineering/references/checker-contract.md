# The mechanical-checker contract

ADR: [ADR-KI-HARNESS-SKILLS-002](../../../../docs/decisions/ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md)

A checker is the deterministic half of a standard.

It takes a target path, reads only that target, emits the [canonical checker reporter](../../../general-governance/ki-skills/references/checker-reporter.md) as its only direct output, and exits non-zero if and only if it emits an M/FAIL finding.

The checker collects typed domain findings; it does not calculate a summary, render a terminal table, write report files, or carry an output-format flag.

The shared reporter builds the JSONL stream and the bootstrap aggregate is its sole human renderer.

## The severity ladder

One ladder applies to both audit and conform findings.

| Level        | Group     | Blocks? | Meaning                                                                   |
| ------------ | --------- | ------- | ------------------------------------------------------------------------- |
| **FAIL**     | violation | yes     | A required criterion is violated — a ship-stopper.                        |
| **WARN**     | violation | no      | A recommended criterion is violated — should fix, can ship with a reason. |
| **POLISH**   | violation | no      | A minor or cosmetic divergence.                                           |
| **ADVISORY** | deferred  | no      | A judgment criterion the checker cannot decide — handed to the reader.    |
| **INFO**     | context   | no      | Neutral context, not a verdict against a criterion.                       |
| **NA**       | context   | no      | A criterion checked but not applicable to this target.                    |
| **PASS**     | met       | no      | A criterion is met.                                                       |

An M finding reports deterministic observed state during AUDIT, and an action or resulting state during CONFORM.

A J finding is always ADVISORY, cites its judgment criterion, and never changes the process exit status.

## Canonical transport and presentation

The canonical reporter emits a JSONL run with a meta record, zero or more typed finding records, and a final complete summary record.

Every record shares the run identity, allowing consumers to stream or map-reduce results without reconstructing earlier context.

The aggregate resolves each finding code through the emitting skill's vendored rubric and renders the readable criterion title followed by its stable code.

It also renders file, message, and citation fields; a finding message must not repeat any of those rendered identity fields.

Malformed output is an aggregate failure, not a reason to fall back to a checker's private terminal presentation.

## Portability and dependencies

A checker uses Node/Bun builtins only and is standalone after vendoring.

It must never import across skill boundaries.

The sole shared implementation exception is the declared canonical reporter module: `ki-skills` owns it locally, while each dependent checker imports its copied local payload from `scripts/vendored/ki-skills/`.

Skills compose standards by running checkers in sequence; a checker-module dependency supplies implementation only and does not create a `depends-on:` coverage edge.

## Conform: inspect before writing

A conform script that mutates an external resource must first read live state and write only when the target actually drifts.

When already conformant, it records PASS and skips the write.

The same principle applies to local scaffolding: check content or existence before writing, so the report distinguishes a repaired state from one that was already correct.

## Relationship to rubric tags

Every `[M]` criterion has a corresponding deterministic checker rule.

Every `[J]` criterion is emitted once as a cited J/ADVISORY review prompt, but is decided by reading rather than by the checker.
