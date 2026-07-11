# Universal modes — `MODE`

The behavioural contract of the operating vocabulary every governance skill exposes: the four universal modes plus the introspective HELP. What each mode must do and output, who must carry them, and who is exempt. Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** as-built baseline, behaviour-level.

## The universal four

### MODE-001 — Governance skills carry the four modes

Every governance skill MUST expose AUDIT, CONFORM, INIT, and REFRESH under those exact names, presented under a single `## Operating modes` H2, per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-canonical-modes.md).

_Verify:_ `bun skills/ki-skills/scripts/lint-skills.ts skills` — the SHAPE mode-coverage check FAILs a governance `SKILL.md` missing any of the four.

### MODE-002 — AUDIT reports, does not fix

AUDIT MUST run the mechanical checker, capture its output, then apply the judgment criteria, reporting by location → criterion → fix, and MUST NOT modify the audited target, per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-canonical-modes.md).

_Verify:_ each skill's `## Mode AUDIT` section routes to its checker read-only; the shared checker contract (checker-contract.md) pins `--json` / `--report` as read-only with respect to audited content.

### MODE-003 — CONFORM fixes then re-audits

CONFORM MUST run AUDIT to obtain the fix list, apply the fixes in place, then re-run AUDIT until clean, per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-canonical-modes.md).

_Verify:_ each governance `SKILL.md`'s `## Mode CONFORM` describes the audit → fix → re-audit loop; `lint-skills.ts` checks the mode's presence.

### MODE-004 — INIT is mandatory even when thin

Every governance skill MUST carry an INIT — a `scripts/init.ts` delegating into the `ki-bootstrap` chain — even when it scaffolds no standalone artifact, in which case INIT's job is to vendor the skill's declared `vendors:` unit into the target's `.ki-meta/`, per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-canonical-modes.md).

_Verify:_ every `skills/*/scripts/init.ts` exists and execs the chain engine; `lint-skills.ts` SHAPE checks the INIT mode and delegator.

### MODE-005 — REFRESH runs only in the harness

REFRESH MUST write only to the skill's canonical files under `skills/<name>/` in `ki-agentic-harness`, and when invoked from a repo where the skill is merely vendored it MUST stop and name the harness as where to run it, per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-canonical-modes.md).

_Verify:_ each `## Mode REFRESH` section declares the harness-only write target and the vendored-repo stop behaviour.

## Introspection

### MODE-006 — HELP explains and stops

Every governance skill MUST expose HELP — invoked as `help` / `-h` / `?` — which surfaces the skill's name, one-line purpose, invocation, mode list, and off-ramps from what the `SKILL.md` already declares, and takes no action, per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-canonical-modes.md).

_Verify:_ `bun run ki:skills:help <name>` renders the generated block via `scripts/skill-help.ts` with no per-skill authored prose; the block is non-acting.

## Exemptions

### MODE-007 — Process skills are exempt

A process skill (one that drives a lifecycle rather than holding a standard) MUST NOT be required to carry the universal four modes; the skills rubric gates the four-mode and HELP requirements on "governance skill", per [ADR-KI-HARNESS-SKILLS-001](../decisions/ADR-KI-HARNESS-SKILLS-001-canonical-modes.md).

_Verify:_ `lint-skills.ts` SHAPE-5 / SHAPE-11 pass a process skill (e.g. `ki-recap`, `ki-plan`) that carries only its own lifecycle modes.

## Gaps

- The core-optional modes NEW and OPTIMISE have fixed meanings wherever they appear but are not yet lifted into the numbered contract, since they are optional per skill.
- The no-mode → HELP-then-`AskUserQuestion` interactive routing is specified in the ADR but not asserted here, as it is behaviour of the in-session mode rather than a mechanically checkable artifact.
