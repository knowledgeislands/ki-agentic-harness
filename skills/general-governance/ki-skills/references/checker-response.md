# Canonical checker response

The canonical checker response is the JSON Lines (JSONL) machine-readable result returned by every governance skill's `audit.ts` and `conform.ts`.

Its executable record schema is [`../assets/checker-response.schema.json`](../assets/checker-response.schema.json).

## Contents

- [Normative language](#normative-language)
- [Purpose](#purpose)
- [Envelope](#envelope)
- [Findings](#findings)
- [Summary and exit status](#summary-and-exit-status)
- [Downstream reporters](#downstream-reporters)
- [Portability](#portability)

## Normative language

Uppercase normative terms such as `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` use the BCP 14 meanings defined by [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174).

Lowercase forms are ordinary prose.

## Purpose

The checker runs structured mechanical rubric executions and returns typed findings.

It does not own terminal formatting or report files.

The response builder turns the complete finding set into a canonical JSONL stream.

Downstream consumers validate that stream before producing a human or system-specific view.

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

- `level` — `FAIL`, `WARN`, `FIXED`, `INFO`, `NOT_APPLICABLE`, or `PASS`;
- `code` — the stable rubric criterion identifier;
- `title` — the concise rubric criterion title;
- `message` — the specific result, without repeating the code, title, or subject; and
- `subject` when the affected artifact or path adds useful context.

A finding records mechanically observed state during AUDIT and an action or resulting state during CONFORM.

The checker MUST NOT emit a finding for a judgment aspect because it has not evaluated that aspect.

The code remains the stable rule identity; including the title makes each streamed finding self-contained without duplicating the full rubric catalogue.

## Summary and exit status

The final summary has every finding-level count, including zero values, and exactly agrees with the preceding findings sharing its `runId`.

It also reports `judgment.unevaluated`, the number of selected rubric items carrying a judgment aspect that the mechanical checker did not perform.

A hybrid item can therefore contribute mechanical findings and one to this count without creating a second rubric entry.

A checker exits non-zero if and only if it returns at least one `FAIL` finding.

Response validation covers record order, repeated identity, schema shape, summary agreement, code resolution, level compatibility, and the unevaluated-judgment count.

Malformed JSONL is a checker failure, not a reason for a reporter to fall back to a private presentation path.

## Downstream reporters

A reporter accepts a canonical checker result and presents it without changing its meaning. A direct checker invocation selects terminal presentation explicitly:

```bash
bun scripts/audit.ts <target> --reporter=terminal --reporter-levels=all
```

The default terminal view shows `FAIL` and `WARN`, plus `FIXED` during CONFORM, with compact counts for suppressed levels and the unevaluated-judgment total.

`--reporter-levels=<comma-separated-levels>` selects displayed levels; `--reporter-levels=all` shows every mechanical finding.

Display filtering never changes which rubric elements run or which findings appear in the JSONL response.

A reporter may render `${code}: ${title}`, add subject and message detail, write a Markdown report, or export telemetry.

It does not inspect the governed target or execute rubric callbacks. The checker retains its own exit status after rendering.

With no `--reporter`, a checker emits the complete canonical JSONL response. Repository aggregates rely on that default and apply their own reporter after collecting one or more checker streams.

## Portability

The response schema is a shipped asset of `ki-skills` for review and validation in the harness source.

The target reusable implementation belongs to `ki-skills`: `scripts/lib/checker.ts` consumes the generic model at `scripts/lib/rubric.ts`, while `scripts/lib/reporter.ts` presents its canonical result.

A dependent governance skill vendors those three declared modules into `scripts/vendored/ki-skills/` and imports only its local copies.

Checker-module dependencies supply implementation; they do not create a `ki-depends-on:` governance-coverage edge.

Each vendored checker remains standalone, uses builtins only, and never imports across skill boundaries at runtime.
