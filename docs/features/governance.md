# Governance — `GOV`

The behaviour of the governance model the harness applies to itself and to the repos it bootstraps: the universal modes, the mechanical-first contract, the severity ladder, and composition. Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** as-built baseline, behaviour-level.

## Modes

### GOV-001 — Universal modes

Every governance skill MUST carry the universal modes EDUCATE · AUDIT · CONFORM · REFRESH (plus any skill-specific modes), per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-canonical-modes.md).

_Verify:_ `ki-engineering`'s enforcement-framework §5 lists the four modes, and each `skills/*/SKILL.md` exposes them; `ki:skills:audit` passes.

### GOV-002 — Mechanical-first, LLM-optional

Each skill's mechanical criteria MUST be executable as a CLI checker with no LLM, exiting non-zero on any FAIL, per [ADR-KI-HARNESS-003](../decisions/ADR-KI-HARNESS-003-mechanical-first-progressive-enhancement.md).

_Verify:_ every artifact skill ships a `scripts/audit-*.ts` (or `lint-*.ts`) that runs standalone under `bun` and returns a non-zero exit on FAIL-severity findings.

## Contracts

### GOV-003 — Severity ladder

A checker's findings MUST grade on the unified ladder FAIL / WARN / POLISH / ADVISORY / INFO / NA / PASS, and the process MUST exit non-zero only when a FAIL is present.

_Verify:_ each checker imports the same `Sev` enum shape from `ki-engineering`'s checker-contract, and `audit-*.ts` exits `1` iff a FAIL is emitted.

### GOV-004 — Composition, not extension

A skill MUST NOT import another skill; it composes by running a sibling's checker or mode in sequence and declaring the edge, per [ADR-KI-HARNESS-004](../decisions/ADR-KI-HARNESS-004-composition-over-extension.md).

_Verify:_ no `skills/*/scripts/*.ts` imports from another skill's directory; cross-skill composition is by subprocess (`execFileSync`) only.

### GOV-005 — Machine-readable implication graph

Each `SKILL.md` MUST declare an `implies:` frontmatter list, and the resulting graph MUST be acyclic with every edge resolving to an existing skill, per [ADR-KI-HARNESS-SKILLS-006](../decisions/ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md).

_Verify:_ `bun run ki:skills:graph:check` passes — it validates that every edge resolves and the graph is acyclic.

### GOV-006 — Exactly one repo-structure skill per repo

A Knowledge Islands repo MUST declare at most one repo-structure table (`[ki-harness]`, `[ki-kb]`, `[ki-website]`, `[ki-mcp]`, `[ki-plugins]`, `[ki-tools]`, `[ki-homebrew-tap]`) in its `.ki-config.toml`, since exactly one skill governs a repo's on-disk shape; declaring more than one is a governance error, per [ADR-KI-HARNESS-SKILLS-006](../decisions/ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md).

_Verify:_ `ki-repo`'s `audit-repo.ts` emits a FAIL (`repo-structure`) when more than one repo-structure table is declared; implied family members (`ki-website-cloudflare`, `ki-kb-streams`) are excluded from the count.

### GOV-007 — Declared SPDX license, matched everywhere

A Knowledge Islands repo MUST declare its license as an SPDX id in `[ki-repo]` `license` (default MIT), and the live GitHub license, the `LICENSE` file, and `package.json` `"license"` MUST all match that declaration, per the `ki-repo` standard.

_Verify:_ `ki-repo`'s `audit-repo.ts` `license` / `license-file` / `package-license` checks FAIL on any mismatch with the declared id.

### GOV-008 — Self-governing checker-contract root

`ki-skills` MUST provide the canonical checker-report support from its own shipped files and MUST NOT require checker support from itself or another skill, per [ADR-KI-HARNESS-SKILLS-012](../decisions/ADR-KI-HARNESS-SKILLS-012-local-copies-for-checker-support.md).

_Verify:_ `bun skills/general-governance/ki-skills/scripts/audit.ts skills/general-governance/ki-skills` passes ROOT-1, and `bun skills/general-governance/ki-skills/scripts/audit.test.ts` covers the missing-root declaration.
