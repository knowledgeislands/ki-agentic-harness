---
id: '002'
title: Cross-surface MCP/skill enablement
status: in-progress
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

1. ✓ **Controllability spike (do this first — it reshapes everything).** Run 2026-07-02; verdicts recorded under _Spike findings_ below. For each surface, establish whether MCP/skill enablement is programmatically controllable and how:
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
- **claude.ai web** — no local config file, but **not** manual-only, revising the earlier verdict. Governable on three axes, documented in [claude-ai-connector-control.md](../../../skills/ki-mcp/references/claude-ai-connector-control.md): (a) org admin — the claude.ai Admin Console (Policies / Organization → Connectors) pushes an MCP allowlist and tool permissions to all members, and Enterprise-managed auth provisions connectors via the IdP; (b) account/connector state in the web UI (the only install point); (c) **Claude Code can allow/deny claude.ai connectors from an admin-controlled surface** via `managed-mcp.json` + `allowedMcpServers` / `deniedMcpServers` — the same mechanism that governs local servers (see step-5 note). What is still absent is _per-project_ scoping **on** the claude.ai surface itself: control is account-wide or org-wide, not per-repo. So for this plan's per-project goal, claude.ai stays coarse — but it is a real, admin-controllable surface, not a manual-only one.
- **house-mcp-manager verdict** — poor fit: it toggles individual entries in `~/.claude.json` (Claude Code / Cursor / Cline only), but the KI servers sit behind mcporter as one proxy entry (so it sees only that, all-or-nothing) and it does not reach claude.ai or Cowork.
- **Key insight** — Cowork's `enabledPlugins` is the same Claude **plugin-marketplace** mechanism Claude Code supports, and a Claude plugin can bundle MCP servers + skills + agents. A **KI plugin marketplace** is therefore the natural single-source artifact that enables both Claude Code (per-project) and Cowork (per-workspace). claude.ai is now understood (see [claude-ai-connector-control.md](../../../skills/ki-mcp/references/claude-ai-connector-control.md)): it is admin-controllable but only account/org-wide, so it stays outside the per-project single-source artifact and is handled by the documented-convention fallback (keep the account/org connector set minimal; do per-project enablement on the locally-reachable surfaces). This is the recommended shape when the build resumes.

## Remaining work and tiers (2026-07-04)

Step 1 is done; the plan's residue is steps 2–5, now largely pre-reasoned by the spike:

- **Step 2 (targeting table)** — sonnet: the surfaces, controllability verdicts, and home (`ki-mcp` workspace-mcp-standard) are all decided above; the work is drafting the table from the chezmoi `mcp-servers-json` server set.
- **Step 3 (home decision)** — opus, and it is the one open judgement: ratify (or reject) the spike's recommended shape, a **KI plugin marketplace** bundling MCP servers + skills + agents for Claude Code and Cowork. Escalate the ratification to Kris — it seeds the ROADMAP _(candidate)_ "KI plugin marketplace" item's promotion to Next.
- **Steps 4–5 (fan-out design, sequencing)** — collapse into the design record once step 3 is decided; sonnet against the decided shape.

## Dependencies / blocks

Independent — blocks nothing, blocked by nothing. Reuses `mcp-claude-housekeeping`'s existing Cowork-workspace discovery for the spike. The claude.ai/cloud controllability question is now closed (admin-controllable, account/org-wide only — see [claude-ai-connector-control.md](../../../skills/ki-mcp/references/claude-ai-connector-control.md)); no follow-on research item is needed, only the documented-convention fallback in step 4.
