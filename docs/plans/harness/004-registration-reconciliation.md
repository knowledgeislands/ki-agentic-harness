---
id: '004'
title: Reconcile registration surfaces with the ki- rename and skill-set growth
status: open
roadmap: Reconcile the registration surfaces with the `ki-` rename and skill-set growth
blocks: —
blocked-by: '006'
---

# Reconcile registration surfaces with the ki- rename and skill-set growth

## Context

The `knowledgeislands-*` → `ki-*` rename (plan 001) and the arrival of four skills since (`ki-plans`, `ki-decision-records`, `ki-handoffs`, `ki-memory`) each updated some registration surfaces but not all. The result is a set of small, individually mechanical drifts that together misdescribe the skill set to readers, auditors, and consumers. This plan closes them in one pass. Every judgement call is made here; the steps are executable cold.

**Recommended implementer tier:** sonnet for steps 4–6 (code/ordering edits against a stated rule), haiku for the rest (mechanical text/config fixes with exact locations given).

## Current state

Verified 2026-07-04, all evidence from live runs:

- `README.md` claims nineteen skills but its skill map contains no entry for `ki-memory` or `ki-handoffs` (`grep -n 'ki-memory\|ki-handoffs' README.md` → empty). `docs/skills.md` is correct (nineteen, both present).
- `CLAUDE.md`'s four-part bundle table says Evals hold "3 scenarios"; `evals/scenarios/` holds 12.
- The canonical dependency order is stale in two different ways: `skills/ki-skills/SKILL.md` (§Mode AUDIT, the synthesis-ranking sentence) still carries the original twelve-name order (`authoring → engineering → repo → kb → streams → mcp → 11ty-websites → cloudflare-hosting → agents → skills → tokenomics → harness`); [ADR-KI-HARNESS-SKILLS-003](../../decisions/ADR-KI-HARNESS-SKILLS-003.md) was extended to eighteen names on 2026-07-04 but omits `memory` and predates the plan-006 renames.
- `bun skills/ki-decision-records/scripts/audit-drs.ts .` reports "0 files, code mode" despite fourteen ADRs in `docs/decisions/` — the DR checker does not see the harness's own records (naming-pattern or scope-config mismatch; diagnose which side is wrong).
- `bun skills/ki-repo/scripts/audit-repo.ts .` warns: the repo carries `agents/**/*.md` but `.ki-config.toml` declares no `[ki-agents]` table.
- `bun skills/ki-agents/scripts/lint-agents.ts agents/ --json` returns an empty summary (0 findings) while the human-readable run reports 5 PASS — the JSON output path drops results.
- `skills/ki-bootstrap/scripts/link-skills.ts` prunes only `ki-*`-named symlinks (comment near line 125), so legacy `knowledgeislands-*` links survive re-linking. Consequence live today: `arcadia-website/.claude/skills/` holds six dangling `knowledgeislands-*` symlinks and zero working ones.
- All repo gates otherwise green: `ki:verify`, `ki:skills:lint` (19/19), `ki:engineering:audit .`, `audit-harness.ts .` all pass.

## Steps

1. `README.md` — in the section `## The map — the skills at a glance` (line ~36), add `ki-memory` and `ki-handoffs` to the domain layer alongside their siblings, in the section's existing style (match how `ki-plans` and `ki-decision-records` are rendered there); copy each one-line description from its entry in `docs/skills.md`. Verify the "nineteen" counts in `README.md` (lines ~7 and ~38) remain consistent.
2. `CLAUDE.md` — in the four-part bundle table, change the Evals row to "**Populated (partial)** — 12 scenarios (7 skills uncovered) + result matrices".
3. `.ki-config.toml` — add an empty `[ki-agents]` table (opt-in), matching the file's existing table style, so `audit-repo.ts` stops warning.
4. Canonical dependency order — bring both copies to the same nineteen-name order. In `ADR-KI-HARNESS-SKILLS-003`, start from its existing eighteen-name order and rationale (amend per `ki-decision-records` convention: changelog entry, do not rewrite history): insert `memory` after the KB family (it is a governance instrument with no skill dependants, like `decision-records`), and apply the plan-006 renames (`websites-11ty`, `hosting-cloudflare`). In `skills/ki-skills/SKILL.md`, replace the stale twelve-name sentence with the resulting order verbatim. Keep the ADR as the canonical source and the SKILL.md a copy of it. Do not re-derive placements the ADR already justifies.
5. Diagnose the DR-checker blind spot: run `bun skills/ki-decision-records/scripts/audit-drs.ts .` and establish why it reports 0 files against fourteen ADRs — if the checker's discovery pattern misses the `ADR-KI-HARNESS-<SCOPE>-NNN` serial-in-scope naming that `ki-decision-records` itself documents, fix the checker (harness debt); if the records or the `.ki-config.toml` `[ki-decision-records]` scope declaration are non-conformant, record what conformance requires as a follow-up rather than renaming fourteen records in this plan.
6. `skills/ki-agents/scripts/lint-agents.ts` — the `--json` branch (line ~330) emits `summary` and `findings: all`; diagnose why a run over `agents/` produces an empty summary there while the human-readable branch reports 5 PASS (suspect: the JSON payload is written before/without the aggregation the console path performs, or `all` excludes PASS records the summary needs). Fix so `--json` carries the same counts as the console output; extend the script's test to assert parity on the `agents/` fixture.
7. `skills/ki-bootstrap/scripts/link-skills.ts` — the prune loop (lines 125–131) skips any entry not starting with `ki-`; extend it to also remove symlinks whose target does not resolve (dangling), whatever their name — this covers legacy `knowledgeislands-*` leftovers. Keep the existing behaviour of never touching non-symlink entries. Extend the script's test.
8. Consumer follow-through (sibling repos, after step 7): from arcadia-website and vallearmonia-website (`/Users/krisbrown/kis/vallearmonia/vallearmonia-website/` — same six dangling `knowledgeislands-*` links) run each repo's `ki:skills:link:project`; confirm both `.claude/skills/` now hold only live `ki-*` links. Separately for the four mcp repos (`mcp-claude-housekeeping`, `mcp-git-audit`, `mcp-kb-notion-mirror`, `mcp-ki-kb-fs`): each still carries the pre-rename `[knowledgeislands-mcp]` table (e.g. `mcp-git-audit/.ki-config.toml:15`) — **rename** it to `[ki-mcp]` (not an addition) — consumer-side, one line each.
9. Machine-level residue: `~/.claude/skills/` still carries pre-rename `knowledgeislands-*` skill installs alongside the `ki-*` set (both appear in a live session's skill list). List them, confirm each has a `ki-*` successor, remove the stale copies — the repo's global install convention is `ki:skills:link:global` (bootstrap keystone only).

## Files touched

- `README.md`, `CLAUDE.md`, `.ki-config.toml`
- `skills/ki-skills/SKILL.md`, `docs/decisions/ADR-KI-HARNESS-SKILLS-003.md`
- `skills/ki-agents/scripts/lint-agents.ts` (+ its test)
- `skills/ki-bootstrap/scripts/link-skills.ts` (+ its test)
- Consumer-side (step 8): `arcadia-website/.claude/skills/` and `vallearmonia-website/.claude/skills/` (regenerated), four `mcp-*/.ki-config.toml`

## Verify

- `grep -c 'ki-memory' README.md` and `grep -c 'ki-handoffs' README.md` both ≥ 1.
- `bun skills/ki-repo/scripts/audit-repo.ts .` — the `[ki-agents]` coverage warn is gone.
- `bun skills/ki-agents/scripts/lint-agents.ts agents/ --json` — summary lists 5 agents, matching the human-readable run.
- The step-6 DR-checker diagnosis is recorded: either `audit-drs.ts .` now sees the fourteen ADRs, or the plan notes the conformance follow-up with its rationale.
- `ls -la ../arcadia-website/.claude/skills/` — only `ki-*` symlinks, all resolving.
- `bun run ki:verify`, `bun run ki:skills:lint`, `bun run ki:engineering:audit .` — still green.
- `bun skills/ki-mcp/scripts/audit-mcp.ts ../<repo>` over the four mcp repos — the `[ki-config]` warn is gone (0 warn each).

## Dependencies / blocks

Blocked by **006** (the concern-first renames land first so every registration surface here is written once, to the final names). Blocks nothing. Step 8 depends on step 7 within the plan. Does not touch eval authorship (that is the Soon item "Complete behavioural-eval coverage").
