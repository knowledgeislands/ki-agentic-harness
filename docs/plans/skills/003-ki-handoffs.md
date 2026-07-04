---
id: '003'
title: Add the ki-handoffs governance skill
status: in-progress
roadmap: Add the `ki-handoffs` governance skill
blocks: —
blocked-by: —
---

# Add the ki-handoffs governance skill

## Context

The reasoning-layer split — plan work once at the top tier, then bank it as an implementation-ready spec a cheaper tier or a cold agent can execute without re-reasoning — is a reusable methodology that first surfaced authoring a Fable planning prompt for a downstream base. The harness already owns two neighbouring concerns: `ki-plans` owns plan-before-execute and the plan quality bar (a KB's equivalent is a `ki-kb-streams` proposal Checklist), and `ki-tokenomics` owns model-tier cost and selection. The unowned concern is the connective doctrine — how to decompose and write work so a cheaper tier can run it. `ki-handoffs` fills it as a composition-shaped governance skill.

## Current state

- `ki-plans`, `ki-kb-streams`, `ki-tokenomics`, `ki-agents` exist and are the composition/off-ramp neighbours.
- No skill owns the delegation-readiness delta (decisions-locked-vs-escalate, per-unit recommended tier, cold-model readiness test).
- Updated 2026-07-04: the skill, references, and checker are on disk; registrations verified (`package.json` `ki:handoffs:audit`, `docs/skills.md` entry with `ki-plans` present and count nineteen — `ki-memory` landed meanwhile, so the count passed eighteen — and the `.ki-config.toml` `[ki-handoffs]` table). `bun run ki:handoffs:audit .` exits green. Not yet done: `ki-tokenomics` carries no reciprocal off-ramp to `ki-handoffs` (`grep -rn 'handoff' skills/ki-tokenomics/` → 0 hits, a COLL-2 reciprocity gap), and the judgment self-audit and close-out have not run. The `README.md` skill-map entry is handled by plan 004, not here.

## Steps

1. ✓ Author `skills/ki-handoffs/SKILL.md` (doctrine, AUDIT/CONFORM/REFRESH, Composition).
2. ✓ Author `references/handoffs-standard.md`, `references/audit-rubric.md`, `references/sources.md` (`canonical · on-change`).
3. ✓ Author `scripts/audit-handoffs.ts` — the light opt-in checker (scans `handoff: true` artifacts; wired to the checker-contract).
4. ✓ ROADMAP "Next" line + this plan + its `docs/plans/README.md` row.
5. ✓ `docs/decisions/ADR-KI-HARNESS-SKILLS-005.md` recording the doctrine and composition boundary.
6. ✓ Register: `package.json` `ki:handoffs:audit`; `docs/skills.md` entry + restore `ki-plans`; `.ki-config.toml` `[ki-handoffs]` table. (README skill-map entry → plan 004.)
7. Add the reciprocal off-ramp: name `ki-handoffs` in `skills/ki-tokenomics/SKILL.md`'s description/off-ramps (tier cost/selection stays with tokenomics; delegation-readiness points here) — sonnet, one-sentence edit plus `ki:skills:lint` re-run for COLL-2.
8. Verify (below); judgment self-audit via `ki-skills` AUDIT (opus — description quality and boundary calls); fix to clean.
9. Close: set this plan `done`, remove the ROADMAP line; register in the host scheduled-refresh routine (manual, non-repo — escalate to Kris).

## Files touched

- `skills/ki-handoffs/**` (SKILL.md, 3 references, 1 script)
- `package.json`, `docs/skills.md`, `README.md`, `.ki-config.toml`
- `ROADMAP.md`, `docs/plans/README.md`, `docs/decisions/ADR-KI-HARNESS-SKILLS-005.md`

## Verify

- `bun run ki:skills:lint` — clean (name==dir, frontmatter, caps, links, COLL cross-skill pass).
- `bun run ki:handoffs:audit .` — checker runs, exits 0 on the current tree, `--json` / `--report` emit.
- `bun run ki:plans:audit` — this plan is frontmatter-valid, index-synced, roadmap-linked.
- `bun run ki:harness:audit` and `bun run ki:verify` — repo gates green.
- Judgment: `ki-skills` Mode AUDIT over `ki-handoffs` — description trigger-rich and third-person, off-ramps reciprocal, no hard-coded model ids.

## Dependencies / blocks

Independent — no blockers, blocks nothing.
