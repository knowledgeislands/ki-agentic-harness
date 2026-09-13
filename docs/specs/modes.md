# Universal modes — `MODE`

The behavioural contract of the operating vocabulary every governance skill exposes: the four universal modes plus the introspective HELP. What each mode must do and output, who must carry them, and who is exempt. Part of the Specifications corpus; see [index.md](index.md).

> **Status:** accepted contract; conformance is declared per requirement.

## The universal four

### MODE-001 — Governance skills carry the four modes

Every governance skill MUST expose AUDIT, CONFORM, EDUCATE, and REFRESH under those exact names, presented under a single `## Operating modes` H2, per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md).

_Conformance:_ conforming

_Verify:_ `ki repo audit --skill ki-skills --repo .` — the hosted skill rubric reports a governance `SKILL.md` missing any of the four modes.

_Evidence:_ `ki repo audit --skill ki-skills --repo .` — the hosted skill rubric reports a governance `SKILL.md` missing any of the four modes.

### MODE-002 — AUDIT reports, does not fix

AUDIT MUST run the mechanical checker, capture its output, then apply the judgment criteria, reporting by location → criterion → fix, and MUST NOT modify the audited target, per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md).

_Conformance:_ conforming

_Verify:_ each skill's `## Mode AUDIT` section routes to its checker read-only; the shared checker contract (checker-contract.md) pins `--json` / `--report` as read-only with respect to audited content.

_Evidence:_ each skill's `## Mode AUDIT` section routes to its checker read-only; the shared checker contract (checker-contract.md) pins `--json` / `--report` as read-only with respect to audited content.

### MODE-003 — CONFORM fixes then re-audits

CONFORM MUST run AUDIT to obtain the fix list, apply the fixes in place, then re-run AUDIT until clean, per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md).

_Conformance:_ conforming

_Verify:_ each governance `SKILL.md`'s `## Mode CONFORM` describes the audit → fix → re-audit loop; `lint-skills.ts` checks the mode's presence.

_Evidence:_ each governance `SKILL.md`'s `## Mode CONFORM` describes the audit → fix → re-audit loop; `lint-skills.ts` checks the mode's presence.

### MODE-004 — EDUCATE is mandatory even when thin

Every governance skill MUST carry an EDUCATE procedure, even when it scaffolds no standalone artifact. The installed `ki` CLI renders the selected compatible rubric's education; EDUCATE MAY create its skill-specific declared artifact, but it MUST NOT copy a checker, wrapper, or alternate executor into the target, per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md).

_Conformance:_ conforming

_Verify:_ `ki repo educate --skill <declared-skill> --repo <repo>` renders that skill's registered concern and rubric without creating a repository-local executor; `ki repo audit --skill ki-skills --repo .` checks the documented mode shape.

_Evidence:_ `ki repo educate --skill <declared-skill> --repo <repo>` renders that skill's registered concern and rubric without creating a repository-local executor; `ki repo audit --skill ki-skills --repo .` checks the documented mode shape.

### MODE-005 — REFRESH runs only in the harness

REFRESH MUST write only to the skill's canonical files under `skills/<name>/` in `ki-agentic-harness`, and when invoked from a repo where the skill is merely vendored it MUST stop and name the harness as where to run it, per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md).

_Conformance:_ conforming

_Verify:_ each `## Mode REFRESH` section declares the harness-only write target and the vendored-repo stop behaviour.

_Evidence:_ each `## Mode REFRESH` section declares the harness-only write target and the vendored-repo stop behaviour.

## Introspection

### MODE-006 — HELP explains and stops

Every governance skill MUST expose HELP — invoked as `help` / `-h` / `?` — which surfaces the skill's name, one-line purpose, invocation, mode list, and off-ramps from what the `SKILL.md` already declares, and takes no action, per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md).

_Conformance:_ conforming

_Verify:_ the skill's `## Operating modes` section defines its non-acting HELP route, and `ki repo audit --skill ki-skills --repo .` checks that governance skill mode shape.

_Evidence:_ the skill's `## Operating modes` section defines its non-acting HELP route, and `ki repo audit --skill ki-skills --repo .` checks that governance skill mode shape.

## Exemptions

### MODE-007 — Process skills are exempt

A process skill (one that drives a lifecycle rather than holding a standard) MUST NOT be required to carry the universal four modes; the skills rubric gates the four-mode and HELP requirements on "governance skill", per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md).

_Conformance:_ conforming

_Verify:_ `lint-skills.ts` SHAPE-5 / SHAPE-11 pass a process skill (e.g. `ki-recap`, `ki-plan`) that carries only its own lifecycle modes.

_Evidence:_ `lint-skills.ts` SHAPE-5 / SHAPE-11 pass a process skill (e.g. `ki-recap`, `ki-plan`) that carries only its own lifecycle modes.

## Core-optional modes

### MODE-008 — NEW authors one instance

A collection governance skill that exposes NEW MUST use it to author exactly one new instance into the collection it governs, presupposing EDUCATE has established the collection and never substituting for EDUCATE, per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md).

_Conformance:_ conforming

_Verify:_ the collection skills exposing `### Mode NEW` (`ki-decision-records`, `ki-specs`, `ki-repo-kb-activities`, `ki-repo-kb-live-artifacts`) each also expose EDUCATE; the fixed meaning is pinned in [`skills/keystone/ki-skills/references/standards-knowledge-islands.md`](../../skills/keystone/ki-skills/references/standards-knowledge-islands.md).

_Evidence:_ the collection skills exposing `### Mode NEW` (`ki-decision-records`, `ki-specs`, `ki-repo-kb-activities`, `ki-repo-kb-live-artifacts`) each also expose EDUCATE; the fixed meaning is pinned in [`skills/keystone/ki-skills/references/standards-knowledge-islands.md`](../../skills/keystone/ki-skills/references/standards-knowledge-islands.md).

### MODE-009 — OPTIMISE pushes toward excellent

A skill that exposes OPTIMISE MUST use it only to push an already-compliant artifact from the standard floor toward excellent, never to bring an off-standard one onto the floor (that is EDUCATE/CONFORM), per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md).

_Conformance:_ conforming

_Verify:_ `ki-skills`'s `### Mode OPTIMISE`; the fixed meaning is pinned in [`skills/keystone/ki-skills/references/standards-knowledge-islands.md`](../../skills/keystone/ki-skills/references/standards-knowledge-islands.md).

_Evidence:_ `ki-skills`'s `### Mode OPTIMISE`; the fixed meaning is pinned in [`skills/keystone/ki-skills/references/standards-knowledge-islands.md`](../../skills/keystone/ki-skills/references/standards-knowledge-islands.md).

## No-mode routing

### MODE-010 — No mode resolves to HELP, then routes

Invoked with no mode, a governance skill MUST emit the same HELP explanation, then — in an interactive session only — offer the mode choice via `AskUserQuestion`; the pure `help` / `-h` / `?` form MUST take no further action (the headless-safe form), per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md).

_Conformance:_ conforming

_Verify:_ every governance `SKILL.md`'s `## Operating modes` section carries the no-mode/`AskUserQuestion` sentence; `ki repo audit --skill ki-skills --repo .` checks its presence.

_Evidence:_ every governance `SKILL.md`'s `## Operating modes` section carries the no-mode/`AskUserQuestion` sentence; `ki repo audit --skill ki-skills --repo .` checks its presence.
