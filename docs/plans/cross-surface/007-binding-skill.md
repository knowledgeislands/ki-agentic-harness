---
id: '007'
title: Cross-surface binding skill
status: in-progress
roadmap: Build the cross-surface binding skill
blocks: —
blocked-by: —
---

# Cross-surface binding skill

## Context

The workspace controls MCP servers and skills for **Claude Code only** today: mcporter proxies the KI servers ([ADR-KI-HARNESS-TOOLCHAIN-003](../../decisions/ADR-KI-HARNESS-TOOLCHAIN-003.md)) and `ki-bootstrap` links project-local skills — both write Claude-Code-only locations. The other surfaces drift: Cowork has no per-workspace enablement, Desktop is fed only incidentally by the shared chezmoi template, and claude.ai web has no local config. The goal is **one place to declare "these tools are on for this project"** that fans out to every controllable surface.

The shape is already ratified (2026-07-05, plan 002, design-only): the fan-out home is a **per-project binding skill**, not a marketplace repo, a CLI, or a bespoke `mcp-*` server. The skill is the actor; a KI plugin (Claude plugin-marketplace format) is only the Cowork packaging artifact the skill toggles. Full design — per-surface targeting table, home decision, sequencing — is the design record [cross-surface-enablement.md](../../../skills/ki-mcp/references/cross-surface-enablement.md). This plan builds what that record designed.

## Current state

- **Single source exists.** The chezmoi `mcp-servers-json` template already feeds both Claude Code and Claude Desktop; it is the tool declaration the binding skill reads. No new source of truth is needed.
- **Claude Code leg is half-built.** mcporter (`~/.mcporter/mcporter.json`, under chezmoi) proxies the KI servers; `ki-bootstrap` links project-local skills from `.ki-config.toml`. There is no single skill that composes "servers on + skills linked" for a project from the shared source.
- **Desktop, Cowork, web are unwired.** Desktop reads the same chezmoi source but only incidentally; Cowork's `cowork_settings.json` (`enabledPlugins` + `extraKnownMarketplaces`) is untouched; web has no local file.
- **One assumption is unverified** (design record §): whether Cowork honours an external edit to `cowork_settings.json` on next launch. Everything on the Cowork leg depends on it. No KI plugin artifact exists yet.
- **No skill directory yet.** `skills/` has 19 `ki-*` skills; there is no binding skill. `docs/plans/` currently has no active plans.

## Steps

✓ 1. **Lock the skill name and scaffold.** Ratified `ki-binding`. Scaffolded `skills/ki-binding/` per the `ki-skills` rubric: `SKILL.md` (AUDIT / CONFORM / REFRESH, `name:` matches dir, off-ramps to `ki-mcp` + `ki-bootstrap`), `references/binding-standard.md`, `references/audit-rubric.md`, `references/sources.md`, `scripts/audit-binding.ts`. Passes `ki:skills:lint` (0 fail, 0 warn) and `ki:verify`. ✓ 2. **Define the read model.** Documented in [binding-standard.md](../../../skills/ki-binding/references/binding-standard.md). **Correction:** the single source is `.chezmoidata/mcps.yaml` (not the `mcp-servers-json` template, which is only its renderer), and it already carries a per-server **`clients:` field** — the existing surface-targeting lever. The expected set per surface is `{name : surface ∈ clients}`; the skill half stays `.ki-config.toml` coverage via `ki-bootstrap`. ✓ 3. **Build the Claude Code leg (reference implementation).** Shipped the `--check` audit (BIND-1) in `audit-binding.ts`, verified against real machine state (Code = the 1 `ki-mcporter` proxy, agrees with source). **Deviation:** the leg does **not** write a bespoke project `.mcp.json` — that would fork the single source and drift. The write path is chezmoi (`mcps.yaml` edit → `chezmoi apply`), documented in CONFORM; the skill's genuine contribution to this leg is the audit plus composing `ki-bootstrap` for the skill half (BIND-3). ✓ 4. **Build the Claude Desktop leg.** Same checker covers `desktop` (verified: 18 servers agree). Per-machine, all-or-nothing limit documented in the standard's _Known limits_. ◐ 5. **Cowork gate — verify external-edit-honoured.** _Partially done — BLOCKED on a human relaunch._ The write-target schema is characterized (design record Verification log, 2026-07-06): `cowork_settings.json` carries `enabledPlugins` (`"<plugin>@<marketplace>": bool`) + `extraKnownMarketplaces` (github-repo marketplaces). The **runtime** half — does Cowork honour an external edit on next launch? — needs a full Cowork quit + relaunch to observe and cannot be driven headlessly. **Escalated to the user** with a concrete reversible probe. Until it passes, step 6 does not proceed. 6. **Build the Cowork leg (only if step 5 passes).** _Blocked on step 5._ Package the KI servers + skills + agents as a KI plugin in a GitHub marketplace repo (the marketplace artifact, as packaging not entry point); the skill registers it in `extraKnownMarketplaces` and toggles it in `enabledPlugins`. ✓ 7. **Document the claude.ai web convention.** No build. Documented-convention fallback recorded in [binding-standard.md](../../../skills/ki-binding/references/binding-standard.md) (_claude.ai web_ section), cross-linked to [claude-ai-connector-control.md](../../../skills/ki-mcp/references/claude-ai-connector-control.md). ✓ 8. **Wire the toolchain and cover.** Added `ki:binding:audit` to `package.json`; added the `ki-binding` eval scenario (`evals/scenarios/ki-binding.ts`, registered in `evals/harness.ts`); registered the skill in the README skill map + [docs/skills.md](../../skills.md) catalogue and bumped the skill count (nineteen → twenty). **Note:** no `[ki-binding]` `.ki-config.toml` table added — the harness links `--all` and tables are declared only where a repo needs a skill's config (many skills have none); a table is added downstream when a consuming repo opts in.

## Files touched

- `skills/ki-binding/SKILL.md` (new) + `skills/ki-binding/scripts/` + `skills/ki-binding/references/`
- `skills/ki-mcp/references/cross-surface-enablement.md` (record step-5 verification outcome; supersede sequencing notes as legs land)
- `package.json` (add `ki:binding:*` script family)
- `README.md` (skill map), `.ki-config.toml` (coverage cascade)
- `evals/` (new `ki-binding` scenario)
- `ROADMAP.md` (remove the item once done)

## Verify

- `bun run ki:skills:lint skills` passes for `ki-binding` (mechanical rubric clean).
- `bun skills/ki-binding/scripts/*.ts <a-project> --check` reports the project's enabled set correctly for the Claude Code and Desktop legs, and exits non-zero on drift (parity with `ki-bootstrap --check`).
- Step 5's Cowork external-edit verification has a recorded pass/fail outcome in the design record before step 6 is attempted.
- `bun run ki:verify` and `bun skills/ki-plans/scripts/audit-plans.ts` are clean.

## Dependencies / blocks

Blocked-by: none — the single source (chezmoi `mcp-servers-json`) and the `ki-bootstrap` pattern it extends already exist. Internally gated: steps 6+ (Cowork) depend on step 5's verification passing; if it fails, the Cowork leg is deferred back to the ROADMAP rather than forced. Blocks: nothing currently on the ROADMAP.
