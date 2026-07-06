---
id: '007'
title: Cross-surface binding skill
status: open
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

1. **Lock the skill name and scaffold.** Ratify the concern-first name (recommend `ki-binding`; alternatives `ki-surfaces`, `ki-cross-surface`) — cheap in-plan decision. Scaffold `skills/ki-binding/` per the `ki-skills` rubric: `SKILL.md` with the universal AUDIT / CONFORM / REFRESH modes, `name:` matching the directory, an off-ramp to `ki-mcp` (owns the server standard) and `ki-bootstrap` (owns Code skill links). Move the design record's operating guidance reference so the skill points at [cross-surface-enablement.md](../../../skills/ki-mcp/references/cross-surface-enablement.md) as its grounding.
2. **Define the read model.** Specify how the skill reads the single source (chezmoi `mcp-servers-json`) intersected with a project's `.ki-config.toml` `[ki-*]`/server declarations to compute the per-project enabled set. Document it in the skill's reference; this is the shared input all legs consume.
3. **Build the Claude Code leg (reference implementation).** The skill writes/reconciles the project's `.mcp.json` for the enabled KI servers and composes `ki-bootstrap`'s skill-linking (sequence, don't fork — composition-only). This leg is fully controllable today, so it is the proving ground. Ship a `--check` audit mode mirroring `ki-bootstrap`'s.
4. **Build the Claude Desktop leg.** Reconcile the same chezmoi `mcp-servers-json` source into Desktop's config. Near-free once step 3's read model exists; all-or-nothing per app (no per-project granularity on Desktop — document that limit).
5. **Cowork gate — verify external-edit-honoured.** Before any Cowork packaging: verify that an external edit to `local-agent-mode-sessions/<account>/<workspace>/cowork_settings.json` is honoured on next Cowork launch. This is the first build-time check (design record §). **If it fails, stop the Cowork leg and escalate** — the whole Cowork approach needs rethinking. Record the result in the design record.
6. **Build the Cowork leg (only if step 5 passes).** Package the KI servers + skills + agents as a KI plugin in Claude plugin-marketplace format (this is where the marketplace artifact finally appears — as packaging, not entry point). The skill toggles it in `enabledPlugins` / registers `extraKnownMarketplaces`.
7. **Document the claude.ai web convention.** No build. Record the documented-convention fallback (keep account/org connectors minimal; rely on locally-reachable surfaces for per-project enablement), cross-linked to [claude-ai-connector-control.md](../../../skills/ki-mcp/references/claude-ai-connector-control.md).
8. **Wire the toolchain and cover.** Add the skill's script(s) to `package.json` (`ki:binding:*` family), a `ki-binding` eval scenario under `evals/`, and register the skill in the README skill map + `.ki-config.toml` coverage cascade.

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
