# Canonical checker report

The canonical checker report is the JSON Lines (JSONL) machine-readable result emitted by every governance skill's `audit.ts` and `conform.ts`.

The executable source of truth is [`../assets/checker-report.schema.json`](../assets/checker-report.schema.json), not a copied JSON example in Markdown.

## Purpose

Checkers collect typed domain findings; they do not construct summaries or own terminal formatting.

The adjacent copied report-builder module turns those findings into a canonical report, and the bootstrap aggregate renders the human view.

The builder emits a `meta` record, zero or more `finding` records, and one final `summary` record.

Each record repeats the immutable run identity, so a consumer can filter, stream, or map-reduce rows without reconstructing context from earlier output.

This keeps a direct checker invocation useful to tools and makes presentation changes a single renderer change.

## Envelope

Every line is schema `version` 1 and has a UUID `runId`, `record` kind, `mode` of `audit` or `conform`, its `concern`, audited `target`, and ISO `generatedAt` timestamp.

A run begins with `record: "meta"`, emits its typed findings as `record: "finding"`, and ends with `record: "summary"` carrying the complete severity summary.

AUDIT and CONFORM use this same envelope.

An M finding records observed mechanical state during AUDIT and an action or resulting state during CONFORM.

## Findings

Every `finding` record carries:

- `type` — `M` for a deterministic mechanical result or `J` for a judgment-review prompt.
- `level` — one value from the shared severity ladder.
- `code` — the stable rubric criterion identifier.
- `message` — the specific result, without repeating the code, rule, or file field.
- `ref` and `file` when the criterion or target is scoped to them.

The aggregate resolves `code` against the emitting skill's vendored rubric metadata and displays the identity as `${rule} (${code})`.

Titles therefore remain in their owning rubric rather than being duplicated by every checker report.

An applicable `[J]` rubric criterion appears once as a `J` finding at `ADVISORY` level with a citation.

It tells the reviewer what needs judgment without pretending the checker can decide it, and never changes the process exit status.

FAIL, WARN, and POLISH M findings also require a citation.

## Exit status and summary

The final `summary` record has every lower-case severity key, including zero values, and exactly agrees with the preceding `finding` records sharing its `runId`.

A checker exits non-zero if and only if it emits at least one FAIL M finding.

## Portability

The schema is a shipped asset of `ki-skills` for review and validation in the harness source.

The canonical report-builder source belongs to `ki-skills` and is declared by dependent governance skills as a `checker-support` dependency.

The harness and bootstrap copy it under `scripts/vendored/<provider>/<module>.ts` in each dependent checker's source and vendored payload.

This is deliberately separate from `implies:`: checker support supplies implementation, while `implies:` selects governance coverage and composition.

Each checker imports only that local vendored copy, remains standalone after vendoring, uses builtins only, and has no other cross-skill implementation dependency.

The vendored aggregate may consume this shared format because it runs the already-vendored checker copies in sequence.
