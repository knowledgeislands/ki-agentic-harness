# Governance — `GOV`

The behaviour of the governance model the harness applies to itself and to the repos it bootstraps: the universal modes, the mechanical-first contract, the severity ladder, and composition. Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** as-built baseline, behaviour-level.

## Modes

### GOV-001 — Universal modes

Every governance skill MUST carry the universal modes INIT · AUDIT · CONFORM · REFRESH (plus any skill-specific modes), per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-canonical-modes.md).

_Verify:_ `ki-engineering`'s enforcement-framework §5 lists the four modes, and each `skills/*/SKILL.md` exposes them; `ki:skills:lint` passes.

### GOV-002 — Mechanical-first, LLM-optional

Each skill's mechanical criteria MUST be executable as a CLI checker with no LLM, exiting non-zero on any FAIL, per [ADR-KI-HARNESS-006](../decisions/ADR-KI-HARNESS-006-mechanical-first-llm-optional.md).

_Verify:_ every artifact skill ships a `scripts/audit-*.ts` (or `lint-*.ts`) that runs standalone under `bun` and returns a non-zero exit on FAIL-severity findings.

## Contracts

### GOV-003 — Severity ladder

A checker's findings MUST grade on the unified ladder FAIL / WARN / POLISH / ADVISORY / INFO / SKIP / PASS, and the process MUST exit non-zero only when a FAIL is present.

_Verify:_ each checker imports the same `Sev` enum shape from `ki-engineering`'s checker-contract, and `audit-*.ts` exits `1` iff a FAIL is emitted.

### GOV-004 — Composition, not extension

A skill MUST NOT import another skill; it composes by running a sibling's checker or mode in sequence and declaring the edge, per [ADR-KI-HARNESS-003](../decisions/ADR-KI-HARNESS-003-composition-over-extension.md).

_Verify:_ no `skills/*/scripts/*.ts` imports from another skill's directory; cross-skill composition is by subprocess (`execFileSync`) only.

### GOV-005 — Machine-readable implication graph

Each `SKILL.md` MUST declare an `implies:` frontmatter list, and the resulting graph MUST be acyclic with every edge resolving to an existing skill, per [ADR-KI-HARNESS-SKILLS-006](../decisions/ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md).

_Verify:_ `bun run ki:skills:graph:check` passes — it validates that every edge resolves and the graph is acyclic.

## Gaps

- No requirement yet covers the mutual exclusion of repo-structure skills (exactly one per repo); it is enforced in `ki-repo`'s cascade but not yet specified here.
- The license mechanism (declared SPDX in `.ki-config.toml`) is not yet specified as a requirement — it lands in a later work stream.
