---
id: '002'
title: Cross-surface MCP/skill enablement
status: open
roadmap: Cross-surface MCP/skill enablement
blocks: —
blocked-by: —
---

## Context

The workspace can turn MCP servers and skills on and off for Claude Code, and nowhere else. mcporter proxies the 19 KI servers behind a single Claude Code slot ([ADR-KI-HARNESS-TOOLCHAIN-003](../../decisions/ADR-KI-HARNESS-TOOLCHAIN-003.md)) and `ki-bootstrap` symlinks project-local skills from each repo's `.ki-config.toml` — both write Claude-Code-only locations. Two surfaces have no story: **claude.ai web connectors**, currently disabled wholesale because there is no way to scope them per project, and **Claude Cowork**, which has no per-workspace MCP or skill enablement at all. This is the pain a house-mcp-manager successor should remove — but house-mcp-manager itself is Claude-Code-only (it edits `~/.claude.json`), so the successor is a genuinely new, cross-surface capability. This plan is **design-only**: it decides the shape and, crucially, whether the hardest surface (claude.ai/cloud) is even programmatically controllable. No tool is built in this pass.

## Current state

- **Claude Code MCP** — controllable. Single `ki-mcporter` URL in `~/.claude.json`; the server set lives in `~/.mcporter/mcporter.json`, generated from the chezmoi `mcp-servers-json` template, which already **fans out to Claude Desktop** as well.
- **Claude Code skills** — controllable. `ki-bootstrap` links `.claude/skills/<name>` from `.ki-config.toml` coverage tables (relative symlinks, gitignored, regenerated).
- **claude.ai web connectors** — no local config file; enablement is account/connector state in the claude.ai UI. No in-repo machinery; the concepts "claude.ai", "connector", "enablement" do not appear in the harness today. Currently all disabled.
- **Cowork** — per-workspace on-disk state lives under `~/Library/Application Support/Claude/local-agent-mode-sessions/<account>/<workspace>/`, including a `cowork_settings.json`. `mcp-claude-housekeeping` already **discovers** these workspaces and that marker file (for pruning) but never reads or writes enablement from it. Whether `cowork_settings.json` (or a sibling) carries MCP/skill enablement, and whether edits are honoured, is unverified.
- **Prior art** — house-mcp-manager (Claude-Code-only MCP toggle/profiles, [ADR-KI-HARNESS-TOOLCHAIN-002](../../decisions/ADR-KI-HARNESS-TOOLCHAIN-002.md)); the `mcp-servers-json` chezmoi template is the closest thing to a single source of truth for the server set.

## Steps

1. **Controllability spike (do this first — it reshapes everything).** For each surface, establish whether MCP/skill enablement is programmatically controllable and how:
   - Claude Code — known controllable (local `mcp.json` / mcporter). Confirm the write path.
   - Cowork — read `cowork_settings.json` under a real workspace; determine whether it carries per-workspace MCP/skill enablement and whether a written edit is respected on next launch. `mcp-claude-housekeeping` already locates the file — reuse its discovery.
   - claude.ai web connectors — no local file; establish whether any account/API or automation surface can toggle a connector, or whether it is manual-only.
2. **Per-surface targeting table.** Define which MCP server is wanted on which of Claude Code / Desktop / claude.ai / Cowork, **with a controllability column** (file-editable / API / manual-only) from step 1. This table does not exist today; the natural home is the `ki-mcp` workspace-mcp-standard.
3. **Decide the home** (shape-agnostic until now): a new KI-owned tool (CLI or `mcp-*` server), an extension of `mcp-claude-housekeeping` (already Cowork-aware), or adopting/wrapping house-mcp-manager. Weigh against the KI-authored-only and composition-only principles.
4. **Single source of truth + fan-out.** Design the tool to read one declaration (anchored on the chezmoi `mcp-servers-json` template, extended as needed) and apply it to every **controllable** surface. A surface the spike finds uncontrollable is handled by **documented convention** (e.g. keep cloud connectors minimal; do per-project enablement on the locally-reachable surfaces), not by the tool.
5. **Sequencing.** Locally-controllable surfaces first (deliverable immediately: Claude Code via mcporter/`mcp.json`, Cowork if the spike confirms the file is writable). The claude.ai/cloud surface is in scope for this design only if the spike shows it is controllable; otherwise it is deferred to a documented convention plus a follow-on research item.

## Files touched

Design-only this pass — the artifacts are the spike findings and the targeting table, not a built tool:

- This plan (the design record); the spike's per-surface controllability findings captured here or in a linked note.
- `skills/ki-mcp/references/workspace-mcp-standard.md` — likely home for the per-surface targeting table once defined.
- No tool code, `wrangler.jsonc`, chezmoi template, or `mcp-*` repo is modified in this pass; those follow once the shape and controllability are decided.

## Verify

Design acceptance only (no build to exercise):

- The controllability spike has a recorded verdict for each of the four surfaces (controllable-how, or manual-only).
- The per-surface targeting table exists with the controllability column populated.
- The home decision (new tool vs extend housekeeping vs adopt) is recorded with its rationale against the KI-authored-only / composition-only principles.
- The sequencing and the fallback for any uncontrollable surface are explicit.

## Spike findings (2026-07-02, preliminary — build parked)

Step 1 was run read-only against the live machine; the build is deferred.

- **Claude Code MCP** — controllable, but all-or-nothing. The 18 KI servers are keep-alive behind a single `ki-mcporter` entry; the set lives in `~/.mcporter/mcporter.json` (chezmoi). No per-project on/off today.
- **Claude Desktop** — controllable via the same chezmoi `mcp-servers-json` template.
- **Cowork** — `cowork_settings.json` (under `local-agent-mode-sessions/<account>/<workspace>/`) carries `enabledPlugins` and `extraKnownMarketplaces` — a **plugin/marketplace** model (e.g. `cowork-plugin-management@knowledge-work-plugins`), not raw MCP entries. File-controllable in principle; that an external edit is honoured on next launch is **not yet verified**.
- **claude.ai web** — no local config file found; connector/account state. A programmatic control surface is **unconfirmed** (treat as manual-only until proven otherwise).
- **house-mcp-manager verdict** — poor fit: it toggles individual entries in `~/.claude.json` (Claude Code / Cursor / Cline only), but the KI servers sit behind mcporter as one proxy entry (so it sees only that, all-or-nothing) and it does not reach claude.ai or Cowork.
- **Key insight** — Cowork's `enabledPlugins` is the same Claude **plugin-marketplace** mechanism Claude Code supports, and a Claude plugin can bundle MCP servers + skills + agents. A **KI plugin marketplace** is therefore the natural single-source artifact that enables both Claude Code (per-project) and Cowork (per-workspace); claude.ai remains a separate research question. This is the recommended shape when the build resumes.

## Dependencies / blocks

Independent — blocks nothing, blocked by nothing. Reuses `mcp-claude-housekeeping`'s existing Cowork-workspace discovery for the spike. The claude.ai/cloud controllability finding may spawn a follow-on ROADMAP research item if that surface proves uncontrollable.
