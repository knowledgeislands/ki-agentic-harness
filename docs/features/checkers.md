# Checkers — `CHK`

The behaviour of a conformant governance checker: the deterministic half of a standard and the canonical report it gives the aggregate to render.

Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** current-state contract.

## Grading and exit

### CHK-001 — The severity ladder

A checker MUST grade findings on the unified FAIL / WARN / FIXED / INFO / NOT_APPLICABLE / PASS ladder, emitting the subset its domain warrants. `FIXED` is valid only during CONFORM.

_Verify:_ [checker-contract.md](../../skills/keystone/ki-skills/references/checker-contract.md) and the shared checker tests enumerate and enforce the six levels.

### CHK-002 — Exit non-zero iff a FAIL exists

A checker MUST exit non-zero if and only if at least one FAIL finding is present; every other level exits zero. Judgment aspects are not mechanical findings and cannot affect checker exit status.

_Verify:_ the canonical reporter contract and its focused tests compare findings with process status.

### CHK-003 — Normal invocation is machine-readable

A checker MUST take its target path, read only that target during AUDIT, and emit canonical JSONL on its normal invocation. It MAY explicitly select a shared reporter such as `--reporter=terminal`; this changes presentation only, never execution, findings, or exit status.

_Verify:_ the `ki-skills` source-harness checker test invokes each checker without a format flag and validates its output.

## Canonical report

### CHK-004 — JSONL event stream

A checker MUST emit exactly one canonical run: a meta record, zero or more typed finding records, and a final summary record, each with the same versioned run identity.

_Verify:_ the canonical reporter validator accepts the stream and rejects invalid order, identity, record fields, or mode.

### CHK-005 — Exact complete summary

The final summary record MUST contain every lowercased finding-level key, including zeros, and its values MUST exactly count the preceding finding records. It MUST also contain the exact `judgment.unevaluated` count for selected rubric items whose judgment aspect was not mechanically performed.

_Verify:_ the canonical reporter validator rejects missing, extra, non-integral, or inaccurate summary values.

### CHK-006 — Judgment remains explicitly unevaluated

The checker MUST NOT emit a synthetic finding for a judgment aspect it did not evaluate. Every selected judgment aspect MUST contribute once to `summary.judgment.unevaluated`; a hybrid item contributes mechanical outcomes and one unevaluated judgment count under the same stable code.

_Verify:_ the shared checker tests cover judgment-only and hybrid items, prevent synthetic findings, and validate the summary count.

### CHK-007 — Standalone local dependencies

A checker MUST use only builtins and its own files after vendoring; its only permitted shared implementation dependency is a declared shared module copied under its local `scripts/vendored/<provider>/` namespace.

_Verify:_ `ki-skills` rejects script imports that escape a skill’s scripts tree, and bootstrap verifies declared module payloads.

### CHK-008 — Shared presentation

Direct commands and the bootstrap aggregate MUST use the same semantic reporter rules. The aggregate MUST reject malformed checker output rather than fall back to native text; direct terminal output MUST be explicitly selected from the same complete checker result.

_Verify:_ aggregate tests run valid canonical streams and malformed-stream fixtures.

### CHK-009 — Citation completeness

Every finding MUST resolve to one selected rubric item and carry its stable `code`, current `title`, and non-empty `message`. It MAY carry a `subject` when an affected artifact or path adds useful context. Sources remain canonical rubric metadata rather than being repeated on each outcome.

_Verify:_ the checker validator rejects unknown codes, title drift, malformed messages, invalid subjects, and summary disagreement.

### CHK-010 — Conform uses the same stream

An audit and conform checker MUST use the same canonical JSONL report format, distinguished only by their mode and typed domain findings.

_Verify:_ the source-harness checker test validates both script families with the same parser and validator.

### CHK-011 — Title-first rendered identity

The reporter MUST render the finding's self-contained title followed by its stable code (`title (CODE)`).

_Verify:_ shared reporter and aggregate parity tests assert the title and code from a canonical checker result.

### CHK-012 — Non-repeating messages

A finding message MUST NOT repeat its own code, title, or subject as a synthetic prefix.

_Verify:_ focused checker tests reject malformed response records and reporter tests prove presentation adds identity separately.
