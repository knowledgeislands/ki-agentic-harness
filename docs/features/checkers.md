# Checkers — `CHK`

The behaviour of a conformant mechanical checker: the deterministic half of every standard. The severity ladder it grades on, its exit-code contract, the pinned `--json` shape, the summary tally, the remediation footer, and its self-containment. Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** as-built baseline, behaviour-level.

## Grading and exit

### CHK-001 — The severity ladder

A checker's findings MUST grade on the unified ladder FAIL / WARN / POLISH / ADVISORY / INFO / NA / PASS, emitting the subset of levels its domain warrants, per [ADR-KI-HARNESS-SKILLS-002](../decisions/ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md).

_Verify:_ `ki-engineering`'s [checker-contract.md](../../skills/ki-engineering/references/checker-contract.md) §The severity ladder enumerates the seven levels every checker draws from.

### CHK-002 — Exit non-zero iff any FAIL

A checker MUST exit non-zero when and only when at least one FAIL-severity finding is present; every other level exits 0, per [ADR-KI-HARNESS-003](../decisions/ADR-KI-HARNESS-003-mechanical-first-progressive-enhancement.md).

_Verify:_ checker-contract.md pins "exit non-zero iff any FAIL"; run any `audit-*.ts` against a fixture with only PASS/WARN findings and observe exit 0.

### CHK-003 — Reads only its target

A checker MUST take a target path as its argument and read only that target, and MUST support `--json` (findings to stdout) and `--report [dir]` (write under the target's `.ki-meta/audits/`), both read-only with respect to the audited content, per [ADR-KI-HARNESS-SKILLS-002](../decisions/ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md).

_Verify:_ checker-contract.md §1 pins the `bun scripts/audit-<concern>.ts <path>` signature and the read-only `--json` / `--report` flags.

## Output shape

### CHK-004 — The pinned `--json` wrapper

Under `--json` a checker MUST emit one wrapper object `{ concern, target, generatedAt, summary, findings }` — never a bare array — where each finding carries at least `level` / `area` / `msg` (required) plus optional `ref` / `file`, `area` MUST be a rubric code, and `summary` keys are the lowercased ladder names present even at zero, per [ADR-KI-HARNESS-SKILLS-002](../decisions/ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md).

_Verify:_ checker-contract.md §The `--json` shape pins the wrapper and the required `level`/`area`/`msg` plus optional `ref`/`file` field names; a conformant checker's `--json` output validates against it.

### CHK-005 — The summary tally

A checker with an aggregate count MUST print a one-line summary tally in the canonical `KEY=n` form (`FAIL=n WARN=n POLISH=n PASS=n ADVISORY=n NA=n`, ladder order, subset it tracks), optionally prefixed by a severity icon, while keeping the `KEY=n` tokens byte-parseable; a per-finding checker with no aggregate count is exempt.

_Verify:_ checker-contract.md §1 pins the `KEY=n` tally; the DR / feature audits are the named per-finding exemptions.

### CHK-006 — The remediation footer

On any non-clean run (any FAIL / WARN / POLISH) a checker's human output MUST end with a one-line footer naming the owning skill and mode that addresses it, and this footer MUST be suppressed under `--json` and `--report`, per [ADR-KI-HARNESS-003](../decisions/ADR-KI-HARNESS-003-mechanical-first-progressive-enhancement.md).

_Verify:_ `bun skills/ki-skills/scripts/lint-skills.ts skills` — SHAPE-8 scans every `audit-*.ts` / `lint-*.ts` and WARNs if the standardised footer is omitted or names another skill's mode.

### CHK-011 — The finding line

The shared aggregate renderer MUST render every structured finding as the pinned row layout `<icon> <level, 4-wide> [<area>] <file> <msg> (<ref>)`, with a two-display-column icon per ladder level (narrow-base VS16 glyphs padded by a trailing space) and the short level tags `fail`/`warn`/`pol`/`adv`/`info`/`na`/`pass`, per [ADR-KI-HARNESS-SKILLS-010](../decisions/ADR-KI-HARNESS-SKILLS-010-comparable-cited-checker-findings.md).

_Verify:_ checker-contract.md §The finding line pins the layout; a run of `bun run ki:audit` renders every structured finding in it, with the `[area]` column aligned across levels.

### CHK-012 — Non-restating messages

A finding's `msg` MUST NOT begin with its own `area` code or its own `file` path/basename — those render as their own columns of the finding line — and ADVISORY messages MUST NOT carry a `[J]:` prefix, per checker-contract.md §The finding line.

_Verify:_ a `--json` run of every checker shows no finding whose `msg` starts with its `area` or with its `file`'s basename.

## Portability

### CHK-007 — Builtins-only and self-contained

A checker MUST depend on Node/Bun builtins only (no npm dependencies) and MUST NOT import another skill's files; checkers compose by being run in sequence, per [ADR-KI-HARNESS-003](../decisions/ADR-KI-HARNESS-003-mechanical-first-progressive-enhancement.md).

_Verify:_ checker-contract.md §1 pins builtins-only and no cross-skill imports; a vendored checker runs from a target's `.ki-meta/skills/` with no harness beside it.

### CHK-008 — Footer guarded and suppressed

A checker's remediation footer MUST appear only on a non-clean run (any FAIL / WARN / POLISH) and MUST be suppressed under both `--json` and `--report`, so machine consumers receive only the wrapper object, per [ADR-KI-HARNESS-003](../decisions/ADR-KI-HARNESS-003-mechanical-first-progressive-enhancement.md).

_Verify:_ checker-contract.md §The remediation footer pins the non-clean guard and the `--json`/`--report` suppression; SHAPE-8 surfaces the standardised footer, and a `--json` run of any `audit-*.ts` emits no footer line.

### CHK-009 — Citation completeness

Every FAIL / WARN / POLISH finding MUST carry a resolvable rubric `code` (equal to its `area`) and a `ref` reference-doc pointer, and a file-scoped finding MUST additionally carry the `file` it concerns, per [ADR-KI-HARNESS-SKILLS-002](../decisions/ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md).

_Verify:_ each checker's emitted `area` values are a subset of its `references/audit-rubric.md` codes; a `--json` run's violation-group findings each carry a non-empty `ref`, and file-scoped ones a `file`.

### CHK-010 — Conform is structured

A conform script MUST support `--json`, emitting the CHK-004 wrapper object so the aggregate renders conform and audit identically, per [ADR-KI-HARNESS-SKILLS-002](../decisions/ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md).

_Verify:_ checker-contract.md §The `--json` shape notes conform scripts emit the same wrapper; `bun skills/ki-authoring/scripts/conform.ts . --json` validates against the CHK-004 shape.
