---
id: '001'
title: Rename the ki-kb-* family
status: open
roadmap: Rename the ki-kb-* family
blocks: —
blocked-by: —
---

## Context

The containment-prefix decision taken this session: the four KB-zone skills are meaningful only inside a Knowledge Islands base, so they should carry a shared `ki-kb-*` prefix that names that containment — `ki-kb` → `ki-kb-base`, `ki-streams` → `ki-kb-streams`, `ki-activities` → `ki-kb-activities`, `ki-live-artifacts` → `ki-kb-live-artifacts`. Code-peer skills (`ki-plans`, `ki-mcp`, `ki-repo`, `ki-skills`, `ki-agents`) stay bare: the prefix marks "part of a KB base", not domain or toolchain dependency. The goal is a self-consistent skill set where family membership is readable from the name, not only inferable from each repo's coverage data.

## Current state

- The four skills exist under bare names: `skills/ki-kb`, `skills/ki-streams`, `skills/ki-activities`, `skills/ki-live-artifacts`. Each `SKILL.md` `name:` matches its directory (the `ki-skills` NAME rule).
- `package.json` exposes `ki:kb:audit`, `ki:streams:audit`, `ki:activities:audit`, `ki:live-artifacts:audit`, each pointing at `skills/<name>/scripts/audit-*.ts`.
- Cross-references inside the harness are broad: `ki-kb` appears in ~39 files, `ki-streams` ~25, `ki-activities` ~4, `ki-live-artifacts` ~4 — including `docs/design.md`, `docs/skills.md`, `skills/ki-bootstrap/references/exemplars.md`, and off-ramp / delegation lines across many `SKILL.md`s (e.g. `ki-kb` delegates to `ki-streams`; `ki-decision-records`, `ki-plans`, and `ki-authoring` off-ramp to these).
- The consuming base `arcadia-principal` declares coverage with the **older `[knowledgeislands-*]` table names** (`[knowledgeislands-kb]`, `[knowledgeislands-streams]`, `[knowledgeislands-decision-records]`, …) — it has not caught up to the `ki-*` rename, let alone `ki-kb-*`. Any consuming-config update therefore starts from `knowledgeislands-*`, not `ki-*`.
- `ki-bootstrap` wires a repo's project-local skills from its `.ki-config.toml` table names, so renamed tables must track the renamed skill directories.

## Steps

1. **Rename the directories** with `git mv` (preserve history): `ki-kb`→`ki-kb-base`, `ki-streams`→`ki-kb-streams`, `ki-activities`→`ki-kb-activities`, `ki-live-artifacts`→`ki-kb-live-artifacts`.
2. **Update `name:` frontmatter** in each renamed `SKILL.md` to its new directory name (directory name is the skill name).
3. **Update `package.json`** script families and paths: `ki:kb:audit`→`ki:kb-base:audit` (and `kb-streams` / `kb-activities` / `kb-live-artifacts`), each pointing at `skills/ki-kb-*/scripts/…`; fix any aggregate or lint-staged script that names them.
4. **Sweep cross-references** across `skills/`, `docs/`, `README.md`: every bare `ki-kb` / `ki-streams` / `ki-activities` / `ki-live-artifacts` off-ramp, delegation, or mention → its `ki-kb-*` name. Includes `ki-plans`' `ki-streams` off-ramp → `ki-kb-streams`, `ki-kb-base`'s delegation to `ki-kb-streams`, `ki-decision-records` / `ki-authoring` off-ramps, `ki-bootstrap` exemplars, `docs/design.md`, `docs/skills.md`. Guard against partial matches — do not rewrite an already-correct `ki-kb-base`.
5. **Update the README skill-map** to show the `ki-kb-*` family grouping (base + zone skills).
6. **Update consuming bases' `.ki-config.toml`.** Discover them: `grep -lE '(knowledgeislands|ki)-(kb|streams|activities|live-artifacts)' */.ki-config.toml` across the workspace. Rename the coverage tables to `[ki-kb-base]` / `[ki-kb-streams]` / `[ki-kb-activities]` / `[ki-kb-live-artifacts]`. For `arcadia-principal`, bring the current `[knowledgeislands-*]` tables straight to the new names.
7. **Re-wire bootstrap.** Run `ki:skills:link:project` (or its dry-run) in a consuming base to confirm the renamed skills link from the renamed tables; fix any hardcoded skill names in `ki-bootstrap`.
8. **Verify as one atomic sweep** (below) — never commit an intermediate state where a directory is renamed but its references are not.

## Files touched

- `skills/ki-kb/` → `skills/ki-kb-base/`, `skills/ki-streams/` → `skills/ki-kb-streams/`, `skills/ki-activities/` → `skills/ki-kb-activities/`, `skills/ki-live-artifacts/` → `skills/ki-kb-live-artifacts/` (directories + each `SKILL.md` `name:`).
- `package.json` — the four script families.
- `README.md`, `docs/design.md`, `docs/skills.md`, `skills/ki-bootstrap/references/exemplars.md`, and off-ramp / delegation lines in the `SKILL.md`s and `references/` that name the four (representative; ~40 files for `ki-kb` alone — follow the grep, don't hand-enumerate).
- Consuming bases' `.ki-config.toml` (e.g. `arcadia-principal/.ki-config.toml`).

## Verify

- `bun run ki:skills:lint` → 0 fail / 0 warn; every renamed skill's `name:` matches its new directory; no COLL / LINK breakage.
- `bun run ki:verify` green.
- Each renamed skill's own audit runs under its new script name (e.g. `bun run ki:kb-base:audit <base>`).
- `grep -rIn -e '\bki-kb\b' -e '\bki-streams\b' -e '\bki-activities\b' -e '\bki-live-artifacts\b' skills docs README.md` returns nothing outside the new names (no stale bare references); the old `[knowledgeislands-*]` / bare `[ki-kb]`-style tables no longer appear in any consuming `.ki-config.toml`.
- In a consuming base, `ki:skills:link:project` links the four renamed skills and the base loads them.

## Dependencies / blocks

Independent — blocks nothing, blocked by nothing. Must land as a **single atomic commit** (rename + all references + consuming configs) to avoid a broken intermediate. Related benefit: this also reconciles `arcadia-principal`'s stale `knowledgeislands-*` coverage tables to current names.
