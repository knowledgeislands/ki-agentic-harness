---
id: '006'
title: Concern-first skill renames (websites-11ty, hosting-cloudflare)
status: in-progress
roadmap: Concern-first skill renames
blocks: '004'
blocked-by: —
---

# Concern-first skill renames (websites-11ty, hosting-cloudflare)

## Context

The naming-grammar amendment to [ADR-KI-HARNESS-SKILLS-003](../../decisions/ADR-KI-HARNESS-SKILLS-003.md) (§Naming grammar, 2026-07-04) fixes the skill naming grammar as `ki-<concern>[-<technology>]` and ratifies two renames: `ki-11ty-websites` → **`ki-websites-11ty`** and `ki-cloudflare-hosting` → **`ki-hosting-cloudflare`**. This plan executes them. It runs **before** plan 004 (registration reconciliation) so every registration surface is written once, to the final names. All decisions are locked in the ADR; nothing here needs re-deciding.

**Recommended implementer tier:** sonnet — mechanical rename with a systematic sweep; the only care point is distinguishing live surfaces from historical records.

## Current state

- `skills/ki-11ty-websites/` and `skills/ki-cloudflare-hosting/` exist under the old names; each directory name is its `name:` frontmatter (the `ki-skills` rule).
- In-harness mentions: 24 files reference `ki-11ty-websites`, 19 reference `ki-cloudflare-hosting` (grep, 2026-07-04).
- `package.json` scripts are already concern-first (`ki:websites:audit` line ~86, `ki:hosting:audit` line ~61) — only their **paths** embed the old directory names.
- Eval scenarios `evals/scenarios/ki-11ty-websites.ts` and `evals/scenarios/ki-cloudflare-hosting.ts` carry the old names in filename and content.
- Consumers declaring the tables: `../arcadia-website/.ki-config.toml` (lines ~15, ~20) and `/Users/krisbrown/kis/vallearmonia/vallearmonia-website/.ki-config.toml` (lines ~27, ~31). Both repos' `.claude/skills/` are stale/dangling anyway (pre-`ki-*` links) and get re-linked in plan 004.
- Historical records (docs/decisions/, settled/other plans) legitimately mention old names and are **not** swept.

## Steps

1. `git mv skills/ki-11ty-websites skills/ki-websites-11ty && git mv skills/ki-cloudflare-hosting skills/ki-hosting-cloudflare`; update the `name:` frontmatter in both `SKILL.md` files to match, and any self-references inside each skill's own `SKILL.md`/`references/`/`scripts/`.
2. Sweep live in-harness surfaces: `grep -rln 'ki-11ty-websites\|ki-cloudflare-hosting' --include='*.md' --include='*.ts' --include='*.toml' --include='*.json' .` (excluding `node_modules/`, `docs/decisions/`, `docs/plans/`) and replace old → new in each hit. Expected classes: `package.json` script paths, `README.md`, `docs/skills.md`, `docs/design.md`, `.ki-config.toml`, sibling skills' off-ramp mentions (at least `ki-engineering`, `ki-authoring`, `ki-repo`, `ki-harness`, `ki-bootstrap` descriptions/references), `.claude/workflows/ki-multi-skill-audit.ts` if it names skills.
3. Rename the eval scenarios to `evals/scenarios/ki-websites-11ty.ts` and `evals/scenarios/ki-hosting-cloudflare.ts` and sweep their contents (scenario ids, skill references, assertions that match on the name).
4. Consumer tables (consumer-side, two one-line header edits each): in `../arcadia-website/.ki-config.toml` and `/Users/krisbrown/kis/vallearmonia/vallearmonia-website/.ki-config.toml`, rename `[ki-11ty-websites]` → `[ki-websites-11ty]` and `[ki-cloudflare-hosting]` → `[ki-hosting-cloudflare]` (and their `#` comment lines). Do **not** re-link `.claude/skills/` here — that is plan 004 step 8, after the prune fix.
5. Update plan 004 if any of its literal strings still carry old names at execution time (its step 4 order string is already written to the new names).

## Files touched

- `skills/ki-websites-11ty/**`, `skills/ki-hosting-cloudflare/**` (renamed dirs + internal self-references)
- `package.json`, `README.md`, `docs/skills.md`, `docs/design.md`, `.ki-config.toml`, sibling `skills/*/SKILL.md` off-ramp mentions, `.claude/workflows/ki-multi-skill-audit.ts`
- `evals/scenarios/ki-websites-11ty.ts`, `evals/scenarios/ki-hosting-cloudflare.ts` (renamed)
- Consumer-side: `../arcadia-website/.ki-config.toml`, `/Users/krisbrown/kis/vallearmonia/vallearmonia-website/.ki-config.toml`

## Verify

- `bun run ki:verify`, `bun run ki:skills:lint` (19 skills, 0 fail), `bun run ki:websites:audit` and `bun run ki:hosting:audit` (script paths resolve), `bun run ki:engineering:audit .` — all green.
- `grep -rn 'ki-11ty-websites\|ki-cloudflare-hosting' --include='*.md' --include='*.ts' --include='*.toml' --include='*.json' . | grep -v node_modules` — hits only under `docs/decisions/` and `docs/plans/` (historical records).
- `ls skills/` shows `ki-websites-11ty` and `ki-hosting-cloudflare`; both `SKILL.md` `name:` fields match their directories.
- Both consumer `.ki-config.toml` files grep clean of the old table names.

## Dependencies / blocks

Blocks **004** (registration reconciliation writes the post-rename names once). Blocked by nothing. Plan 005 is unaffected (touches none of these files).
