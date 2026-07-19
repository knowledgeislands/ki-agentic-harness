# Governance — `GOV`

The behaviour of the governance model the harness applies to itself and to the repos it bootstraps: the universal modes, the mechanical-first contract, the severity ladder, and composition. Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** as-built baseline, behaviour-level.

## Modes

### GOV-001 — Universal modes

Every governance skill MUST carry the universal modes EDUCATE · AUDIT · CONFORM · REFRESH (plus any skill-specific modes), per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-canonical-modes.md).

_Verify:_ `ki-skills`' enforcement framework §5 lists the four modes, and each `skills/*/SKILL.md` exposes them; `ki:skills:audit` passes.

### GOV-002 — Mechanical-first, LLM-optional

Each skill's mechanical criteria MUST be executable as a CLI checker with no LLM, exiting non-zero on any FAIL, per [ADR-KI-HARNESS-003](../decisions/ADR-KI-HARNESS-003-mechanical-first-progressive-enhancement.md).

_Verify:_ every governance skill ships a `scripts/audit.ts` that runs standalone under `bun`, emits the canonical JSONL checker response by default, and returns a non-zero exit on FAIL findings.

## Contracts

### GOV-003 — Severity ladder

A checker's findings MUST use the unified response levels FAIL / WARN / FIXED / INFO / NOT_APPLICABLE / PASS, and the process MUST exit non-zero only when a FAIL is present. `FIXED` is valid only for CONFORM. Judgment aspects are counted as unevaluated in the summary rather than emitted as synthetic findings.

_Verify:_ each checker vendors the canonical `ki-skills` rubric, checker, and reporter modules; their shared response validator enforces the level and exit contracts.

### GOV-004 — Composition, not extension

A skill MUST NOT import another skill's source tree; it composes by running a sibling's checker or mode in sequence and declaring the edge, per [ADR-KI-HARNESS-004](../decisions/ADR-KI-HARNESS-004-composition-over-extension.md). The narrow implementation exception is a declared checker-module dependency that bootstrap copies into the consumer's own `scripts/vendored/<provider>/` namespace before execution.

_Verify:_ no `skills/*/scripts/**/*.ts` relative import resolves outside its own `scripts/` directory; checker dependencies resolve only to safe declared provider modules and execute from local copies.

### GOV-005 — Machine-readable dependency graph

Each `SKILL.md` MUST declare a `ki-depends-on:` frontmatter list, and the resulting graph MUST be acyclic with every edge resolving to an existing skill, per [ADR-KI-HARNESS-SKILLS-006](../decisions/ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md).

A dependency identifies a governance capability a selected skill requires; it does not select coverage or establish mode execution order. A target that declares a skill MUST explicitly declare each of its dependencies in `.ki-config.toml`.

_Verify:_ `bun run ki:skills:graph:check` passes — it validates that every edge resolves and the graph is acyclic.

### GOV-006 — Exactly one repo-structure skill per repo

A Knowledge Islands repo MUST declare at most one repo-structure table (`[ki-harness]`, `[ki-kb]`, `[ki-website]`, `[ki-mcp]`, `[ki-plugins]`, `[ki-tools]`, `[ki-homebrew-tap]`) in its `.ki-config.toml`, since exactly one skill governs a repo's on-disk shape; declaring more than one is a governance error, per [ADR-KI-HARNESS-SKILLS-006](../decisions/ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md).

_Verify:_ `ki-repo`'s `audit-repo.ts` emits a FAIL (`repo-structure`) when more than one repo-structure table is declared; implied family members (`ki-website-cloudflare`, `ki-kb-streams`) are excluded from the count.

### GOV-007 — Declared SPDX license, matched everywhere

A Knowledge Islands repo MUST declare its license as an SPDX id in `[ki-repo]` `license` (default MIT), and the live GitHub license, the `LICENSE` file, and `package.json` `"license"` MUST all match that declaration, per the `ki-repo` standard.

_Verify:_ `ki-repo`'s `audit-repo.ts` `license` / `license-file` / `package-license` checks FAIL on any mismatch with the declared id.

### GOV-008 — Self-governing checker-contract root

`ki-skills` MUST provide the canonical rubric, checker, and reporter modules from its own shipped files and MUST NOT declare a checker-module dependency on itself or another skill, per [ADR-KI-HARNESS-SKILLS-012](../decisions/ADR-KI-HARNESS-SKILLS-012-local-copies-for-checker-support.md).

_Verify:_ `bun skills/general-governance/ki-skills/scripts/audit.ts skills/general-governance/ki-skills` passes KI-CHECKER-3, and the focused checker tests cover missing or invalid root-module declarations.

### GOV-009 — Structured rubric orchestration

Every mechanical rubric aspect MUST declare its execution phase inside the canonical structured rubric item.

The checker MUST validate the complete catalogue and selected execution plan before a CONFORM context can write. It orders executions by phase, then family, item, and subject; AUDIT and fallback executions remain read-only.

The repository aggregate MUST invoke each selected skill's standalone `scripts/audit.ts` or `scripts/conform.ts` exactly once and validate its canonical response. Cross-skill ordering comes from the resolved governance set; skill-local phase ordering comes from that skill's checker.

_Verify:_ the `ki-skills` checker tests cover phase ordering and invalid plans; `ki-bootstrap`'s resolve and entrypoint-parity tests prove standalone vendoring, one invocation per skill, strict response validation, and aggregate parity.
