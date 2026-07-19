# Canonical checker response

The canonical checker response is the JSON Lines (JSONL) machine-readable result returned by every governance skill's `audit.ts` and `conform.ts`.

The executable source of truth is the current [`../assets/checker-reporter.schema.json`](../assets/checker-reporter.schema.json); its filename will align with this response terminology when the shared checker implementation is refactored.

## Purpose

The checker executes structured rubric elements and returns typed findings.

It does not own terminal formatting or report files.

The response builder turns the complete finding set into a canonical JSONL stream.

Downstream reporters validate and consume that stream to produce a human or system-specific view.

This separation lets one checker result feed a terminal reporter, Markdown report, dashboard, or another machine without rerunning the checks.

## Envelope

The response begins with one `meta` record, contains zero or more `finding` records, and ends with one `summary` record.

Every record is schema `version` 1 and repeats the immutable run identity:

- a UUID `runId`;
- `mode`, either `audit` or `conform`;
- the governed `concern`;
- the audited `target`; and
- an ISO `generatedAt` timestamp.

Repeated identity lets consumers filter, stream, or map-reduce rows without reconstructing context from earlier lines.

AUDIT and CONFORM use the same envelope.

## Findings

Every `finding` record carries:

- `type` — `M` for a deterministic mechanical result or `J` for a judgment-review prompt;
- `level` — one value from the shared severity ladder;
- `code` — the stable rubric criterion identifier;
- `message` — the specific result, without repeating the code, title, or subject; and
- `subject` when the affected artifact or path adds useful context.

An M finding records observed mechanical state during AUDIT and an action or resulting state during CONFORM.

An applicable J criterion appears once as a `J` / `ADVISORY` finding.

It tells the reviewer what needs judgment without pretending the checker can decide it and never changes process exit status.

The code is sufficient to identify the rule; a reporter resolves its readable title from the structured rubric catalogue.

## Summary and exit status

The final summary has every lower-case severity key, including zero values, and exactly agrees with the preceding findings sharing its `runId`.

A checker exits non-zero if and only if it returns at least one `M` / `FAIL` finding.

Response validation covers record order, repeated identity, schema shape, summary agreement, code resolution, finding classification, and required judgment coverage.

Malformed JSONL is a checker failure, not a reason for a reporter to fall back to a private presentation path.

## Downstream reporters

A reporter accepts a validated canonical response and presents it without changing its meaning.

The default aggregate reporter shows `FAIL`, `WARN`, and `POLISH`, with compact counts for suppressed levels.

`--reporter-levels=<comma-separated-levels>` selects displayed levels; `--reporter-levels=all` shows every finding, including judgment advisories.

Display filtering never changes which rubric elements run or which findings appear in the JSONL response.

A reporter may resolve `${code}: ${title}`, add subject and message detail, write a Markdown report, or export telemetry.

It does not inspect the governed target or execute rubric callbacks.

## Portability

The response schema is a shipped asset of `ki-skills` for review and validation in the harness source.

The target reusable implementation belongs to `ki-skills` under `scripts/lib/checker/` and consumes the generic model under `scripts/lib/rubric/`.

A dependent governance skill vendors those declared modules into `scripts/vendored/ki-skills/` and imports only its local copies.

Checker-module dependencies supply implementation; they do not create a `depends-on:` governance-coverage edge.

Each vendored checker remains standalone, uses builtins only, and never imports across skill boundaries at runtime.
