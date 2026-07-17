# Canonical checker report

The canonical checker report is the one machine-readable result emitted by every governance skill's `audit.ts` and `conform.ts`.

The executable source of truth is [`../assets/checker-report.schema.json`](../assets/checker-report.schema.json), not a copied JSON example in Markdown.

## Purpose

Checkers collect results; they do not own terminal formatting.

The bootstrap aggregate consumes reports and renders a consistent human view.

This keeps a direct checker invocation useful to tools and makes presentation changes a single renderer change.

## Envelope

Every report has schema `version` 1, a `mode` of `audit` or `conform`, its `concern`, audited `target`, ISO `generatedAt` timestamp, complete severity `summary`, and `findings`.

AUDIT and CONFORM use this same envelope.

An M finding records observed mechanical state during AUDIT and an action or resulting state during CONFORM.

## Findings

Every finding carries:

- `type` — `M` for a deterministic mechanical result or `J` for a judgment-review prompt.
- `level` — one value from the shared severity ladder.
- `code` — the stable rubric criterion identifier.
- `rule` — the human-readable criterion title.
- `message` — the specific result, without repeating the code, rule, or file field.
- `ref` and `file` when the criterion or target is scoped to them.

The aggregate displays the identity as `${code}: ${rule}`.

An applicable `[J]` rubric criterion appears once as a `J` finding at `ADVISORY` level with a citation.

It tells the reviewer what needs judgment without pretending the checker can decide it, and never changes the process exit status.

FAIL, WARN, and POLISH M findings also require a citation.

## Exit status and summary

`summary` has every lower-case severity key, including zero values, and exactly agrees with `findings`.

A checker exits non-zero if and only if it emits at least one FAIL M finding.

## Portability

The schema is a shipped asset of `ki-skills` for review and validation in the harness source.

Each checker remains self-contained, uses builtins only, and emits the contract without importing another skill's implementation.

The vendored aggregate may consume this shared format because it runs the already-vendored checker copies in sequence.
