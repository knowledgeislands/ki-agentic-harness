# Checkers — `CHK`

The behaviour of a conformant mechanical checker: the deterministic half of every standard. The severity ladder it grades on, its exit-code contract, the pinned `--json` shape, the summary tally, the remediation footer, and its self-containment. Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** as-built baseline, behaviour-level.

## Grading and exit

### CHK-001 — The severity ladder

A checker's findings MUST grade on the unified ladder FAIL / WARN / POLISH / ADVISORY / INFO / NA / PASS, emitting the subset of levels its domain warrants, per [ADR-KI-HARNESS-SKILLS-002](../decisions/ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md).

_Verify:_ `ki-engineering`'s [checker-contract.md](../../skills/ki-engineering/references/checker-contract.md) §The severity ladder enumerates the seven levels every checker draws from.

### CHK-002 — Exit non-zero iff any FAIL

A checker MUST exit non-zero when and only when at least one FAIL-severity finding is present; every other level exits 0, per [ADR-KI-HARNESS-004](../decisions/ADR-KI-HARNESS-004-mechanical-first-progressive-enhancement.md).

_Verify:_ checker-contract.md pins "exit non-zero iff any FAIL"; run any `audit-*.ts` against a fixture with only PASS/WARN findings and observe exit 0.

### CHK-003 — Reads only its target

A checker MUST take a target path as its argument and read only that target, and MUST support `--json` (findings to stdout) and `--report [dir]` (write under the target's `.ki-meta/audits/`), both read-only with respect to the audited content, per [ADR-KI-HARNESS-SKILLS-002](../decisions/ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md).

_Verify:_ checker-contract.md §1 pins the `bun scripts/audit-<concern>.ts <path>` signature and the read-only `--json` / `--report` flags.

## Output shape

### CHK-004 — The pinned `--json` wrapper

Under `--json` a checker MUST emit one wrapper object `{ concern, target, generatedAt, summary, findings }` — never a bare array — where each finding carries exactly `level` / `area` / `msg` and `summary` keys are the lowercased ladder names present even at zero, per [ADR-KI-HARNESS-SKILLS-002](../decisions/ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md).

_Verify:_ checker-contract.md §The `--json` shape pins the wrapper and the `level`/`area`/`msg` field names; a conformant checker's `--json` output validates against it.

### CHK-005 — The summary tally

A checker with an aggregate count MUST print a one-line summary tally in the canonical `KEY=n` form (`FAIL=n WARN=n POLISH=n PASS=n ADVISORY=n NA=n`, ladder order, subset it tracks); a per-finding checker with no aggregate count is exempt.

_Verify:_ checker-contract.md §1 pins the `KEY=n` tally; the DR / feature audits are the named per-finding exemptions.

### CHK-006 — The remediation footer

On any non-clean run (any FAIL / WARN / POLISH) a checker's human output MUST end with a one-line footer naming the owning skill and mode that addresses it, and this footer MUST be suppressed under `--json` and `--report`, per [ADR-KI-HARNESS-004](../decisions/ADR-KI-HARNESS-004-mechanical-first-progressive-enhancement.md).

_Verify:_ `bun skills/ki-skills/scripts/lint-skills.ts skills` — SHAPE-8 scans every `audit-*.ts` / `lint-*.ts` and WARNs if the standardised footer is omitted or names another skill's mode.

## Portability

### CHK-007 — Builtins-only and self-contained

A checker MUST depend on Node/Bun builtins only (no npm dependencies) and MUST NOT import another skill's files; checkers compose by being run in sequence, per [ADR-KI-HARNESS-004](../decisions/ADR-KI-HARNESS-004-mechanical-first-progressive-enhancement.md).

_Verify:_ checker-contract.md §1 pins builtins-only and no cross-skill imports; a vendored checker runs from a target's `.ki-meta/skills/` with no harness beside it.

## Gaps

- Several shipped checkers deviate from the pinned `--json` shape (`ki-housekeeping` emits a bare array with numeric severity; `ki-binding` uses `{severity,criterion,message}`; `ki-decision-records` and `ki-feature-definitions` have no `--json` at all) — tracked on the ROADMAP, not yet conformant, so CHK-004 is aspirational for those.
- The two behavioural halves of the footer contract (guarded on non-clean, suppressed under `--json`) are judgment reads that SHAPE-8 cannot decide mechanically, and are not separately asserted here.
