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

The reasoning-layer split — plan work once at the top tier, then bank it as an implementation-ready spec a cheaper tier or a cold agent can execute without re-reasoning — is a reusable methodology that first surfaced authoring a Fable planning prompt for a downstream base. The harness already owns two neighbouring concerns: `ki-plans` owns plan-before-execute and the plan quality bar (a KB's equivalent is a `ki-streams` proposal Checklist), and `ki-tokenomics` owns model-tier cost and selection. The unowned concern is the connective doctrine — how to decompose and write work so a cheaper tier can run it. `ki-handoffs` fills it as a composition-shaped governance skill.

## Current state

- `ki-plans`, `ki-streams`, `ki-tokenomics`, `ki-agents` exist and are the composition/off-ramp neighbours.
- No skill owns the delegation-readiness delta (decisions-locked-vs-escalate, per-unit recommended tier, cold-model readiness test).
- `docs/skills.md` is drifted: it says "sixteen" and omits `ki-plans` though 17 skills are on disk. This plan corrects the count and the omission while adding `ki-handoffs` (→ 18).

## Steps

1. ✓ Author `skills/ki-handoffs/SKILL.md` (doctrine, AUDIT/CONFORM/REFRESH, Composition).
2. ✓ Author `references/handoffs-standard.md`, `references/audit-rubric.md`, `references/sources.md` (`canonical · on-change`).
3. ✓ Author `scripts/audit-handoffs.ts` — the light opt-in checker (scans `handoff: true` artifacts; wired to the checker-contract).
4. ✓ ROADMAP "Next" line + this plan + its `docs/plans/README.md` row.
5. ✓ `docs/decisions/ADR-KI-HARNESS-SKILLS-005.md` recording the doctrine and composition boundary.
6. Register: `package.json` `ki:handoffs:audit`; `docs/skills.md` entry + restore `ki-plans` + bump count to eighteen; `README.md` count; `.ki-config.toml` `[ki-handoffs]` table.
7. Verify (below); self-audit via `ki-skills` AUDIT; fix to clean.
8. Close: set this plan `done`, remove the ROADMAP line; register in the host scheduled-refresh routine (manual, non-repo).

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
