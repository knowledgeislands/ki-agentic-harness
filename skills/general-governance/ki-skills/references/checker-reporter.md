# Canonical checker reporter

The canonical checker reporter is the JSON Lines (JSONL) machine-readable result emitted by every governance skill's `audit.ts` and `conform.ts`.

The executable source of truth is [`../assets/checker-reporter.schema.json`](../assets/checker-reporter.schema.json), not a copied JSON example in Markdown.

## Purpose

Checkers collect typed domain findings; they do not construct summaries or own terminal formatting.

The adjacent copied report-builder module turns those findings into a canonical report, and the bootstrap aggregate renders the human view.

The aggregate validates the complete stream before rendering it.

Its human default shows only `FAIL`, `WARN`, and `POLISH`, with compact counts for the suppressed levels.

`--reporter-levels=<comma-separated-levels>` selects the displayed levels; `--reporter-levels=all` restores every finding, including `ADVISORY` judgment prompts.

This is terminal presentation only: checkers always collect, summarise, validate, and emit every JSONL finding, regardless of the selected levels.

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

The aggregate resolves `code` against the emitting skill's vendored rubric metadata and displays the identity as `${code}: ${rule}`.

Titles therefore remain in their owning rubric rather than being duplicated by every checker report.

An applicable `[J]` rubric criterion appears once as a `J` finding at `ADVISORY` level with a citation.

It tells the reviewer what needs judgment without pretending the checker can decide it, and never changes the process exit status.

FAIL, WARN, and POLISH M findings also require a citation.

## Exit status and summary

The final `summary` record has every lower-case severity key, including zero values, and exactly agrees with the preceding `finding` records sharing its `runId`.

A checker exits non-zero if and only if it emits at least one FAIL M finding.

## Portability

The schema is a shipped asset of `ki-skills` for review and validation in the harness source.

The canonical checker-reporter source belongs to `ki-skills`, whose frontmatter publishes it as `checker-modules: [checker-reporter]`.

A dependent governance skill declares the exact implementation dependency as `checker-dependencies: [ki-skills/checker-reporter]`; this declaration is not an `implies:` edge.

The module name is extension-free and identifies one local payload: either the conventional provider file `scripts/<module>.ts` or a directory `scripts/<module>/` containing its own local closure.

The harness preserves that shape under `scripts/vendored/<provider>/`: a file becomes `<module>.ts`; a directory becomes `<module>/` with its contents copied recursively.

The provider must expose exactly one of those shapes, and neither it nor any entry below a directory payload may be a symlink.

This is deliberately separate from `implies:`: checker modules supply implementation, while `implies:` selects governance coverage and composition.

Each checker imports only that local vendored payload, remains standalone after vendoring, uses builtins only, and has no other cross-skill implementation dependency.

The vendored aggregate may consume this shared format because it runs the already-vendored checker copies in sequence.
