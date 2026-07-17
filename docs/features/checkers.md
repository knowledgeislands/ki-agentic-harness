# Checkers — `CHK`

The behaviour of a conformant governance checker: the deterministic half of a standard and the canonical report it gives the aggregate to render.

Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** current-state contract.

## Grading and exit

### CHK-001 — The severity ladder

A checker MUST grade findings on the unified FAIL / WARN / POLISH / ADVISORY / INFO / NA / PASS ladder, emitting the subset its domain warrants.

_Verify:_ [checker-contract.md](../../skills/foundations/ki-engineering/references/checker-contract.md) enumerates the seven levels.

### CHK-002 — Exit non-zero iff an M/FAIL exists

A checker MUST exit non-zero if and only if at least one M/FAIL finding is present; every other level, including J/ADVISORY, exits zero.

_Verify:_ the canonical reporter contract and its focused tests compare findings with process status.

### CHK-003 — Normal invocation is machine-readable

A checker MUST take its target path, read only that target, and emit canonical JSONL on its normal invocation; it MUST NOT retain an output-format flag, native terminal renderer, or report-file output.

_Verify:_ the `ki-skills` source-harness checker test invokes each checker without a format flag and validates its output.

## Canonical report

### CHK-004 — JSONL event stream

A checker MUST emit exactly one canonical run: a meta record, zero or more typed finding records, and a final summary record, each with the same versioned run identity.

_Verify:_ the canonical reporter validator accepts the stream and rejects invalid order, identity, record fields, or mode.

### CHK-005 — Exact complete summary

The final summary record MUST contain every lowercased severity key, including zeros, and its values MUST exactly count the preceding finding records.

_Verify:_ the canonical reporter validator rejects missing, extra, non-integral, or inaccurate summary values.

### CHK-006 — Judgment prompts are first-class findings

Every declared `[J]` criterion MUST appear once as a cited J/ADVISORY finding; it MUST NOT alter exit status.

_Verify:_ the source-harness checker test resolves emitted codes and types against the emitting rubric.

### CHK-007 — Standalone local dependencies

A checker MUST use only builtins and its own files after vendoring; its only permitted shared implementation dependency is a declared checker module copied under its local `scripts/vendored/<provider>/` namespace.

_Verify:_ `ki-skills` rejects script imports that escape a skill’s scripts tree, and bootstrap verifies declared module payloads.

### CHK-008 — Aggregate-only presentation

The bootstrap aggregate MUST be the sole terminal renderer of checker findings and MUST reject malformed checker output rather than fall back to native text.

_Verify:_ aggregate tests run valid canonical streams and malformed-stream fixtures.

### CHK-009 — Citation completeness

Every FAIL, WARN, POLISH, or J finding MUST resolve to its own rubric code and carry a non-empty citation; a file-scoped finding MUST carry its file.

_Verify:_ the canonical reporter validator and source-harness checker test reject missing citations, files, or unresolved codes.

### CHK-010 — Conform uses the same stream

An audit and conform checker MUST use the same canonical JSONL report format, distinguished only by their mode and typed domain findings.

_Verify:_ the source-harness checker test validates both script families with the same parser and validator.

### CHK-011 — Title-first rendered identity

The aggregate MUST resolve each finding’s code through the emitting rubric and render the readable criterion title followed by its stable code in parentheses.

_Verify:_ aggregate rendering tests assert the resolved title and code for a vendored rubric fixture.

### CHK-012 — Non-repeating messages

A finding message MUST NOT begin with its own code, resolved rule title, file path or basename, or a `[J]:` marker.

_Verify:_ source-harness checker tests reject synthetic reports that repeat those rendered fields.
