---
id: '003'
title: Develop-in-both milestone — AGENTS.md orientation + Codex MCP rendering
status: open
roadmap: Develop-in-both milestone — AGENTS.md orientation + Codex MCP rendering
blocks: —
blocked-by: —
---

# Develop-in-both milestone — AGENTS.md orientation + Codex MCP rendering

## Context

The near-term goal is not full feature parity but the narrower, higher-value milestone of **developing in both runtimes side by side** (see the runtime parity scorecard). Skills already install and discover in both. Two parts remain on that critical path: a Codex session needs **project orientation** (Codex reads `AGENTS.md`, which the harness does not emit), and it needs the **same MCP servers** reachable (Codex reads TOML in `~/.codex/config.toml`, which nothing renders from the neutral source). This plan delivers both.

## Current state

- **Orientation.** All orientation lives in `CLAUDE.md`, which Claude Code reads and Codex ignores. Verified facts: Claude Code reads `CLAUDE.md` only and supports `@path` imports (recursive, depth 4); Codex reads `AGENTS.md` (the open agents.md standard, honored by 20+ tools) and merges across scopes but has **no import directive** — literal content only, 32 KiB cap. Neither reads the other's file natively.
- **MCP.** `ki-binding` audits surface agreement against a renderer-neutral `mcp-servers.yaml`, but does not itself render surfaces (a backend such as `ki-binding-chezmoi` does). No Codex surface is recognised and nothing writes `~/.codex/config.toml`. `ki-binding`'s checker is not coverage-scoped/vendored here, so edits to it are live (no re-vendor).

## Steps

### A. AGENTS.md as the common orientation core

1. Create `AGENTS.md` at the repo root holding the **runtime-neutral** orientation — the bulk of today's `CLAUDE.md` that is not Claude-Code-specific (what the repo is, the skill taxonomy, how skills compose, markdown/TOML style, the toolchain). Self-contained (Codex can't import); keep it under Codex's 32 KiB cap.
2. Reduce `CLAUDE.md` to `@AGENTS.md` (first line) plus a thin **Claude-specific appendix**: the `.claude/` paths, re-vendoring via `ki-bootstrap`, `ki:*` package.json keys, and the headroom-managed learn markers.
3. Update the `ki-harness` standard + checker so the CLAUDE.md orientation-coverage criteria (`CLAUDE-1..5`) follow the split — assert the neutral sections in `AGENTS.md` (or follow the `@import`), and assert `CLAUDE.md` opens with `@AGENTS.md`. This is the load-bearing governance change; without it the split trips the harness's own audit. `ki-harness` is coverage-scoped, so re-vendor `.ki-meta/` after editing its checker.
4. Update `ki-harness`/`ki-repo` prose (and the parity scorecard row) so the AGENTS.md-common pattern is the documented house shape, not a one-repo hack.

### B. ki-binding Codex MCP renderer

1. Recognise `codex` / `~/.codex/config.toml` as a binding **surface** in `ki-binding` (standard + rubric + `sources.md`), alongside the existing Claude surfaces.
2. Add a **render** capability to `ki-binding` that writes `[mcp_servers.<name>]` TOML into `~/.codex/config.toml` from the neutral `mcp-servers.yaml` — the read side stays the single source; Codex becomes a rendered surface. Verify the exact Codex MCP TOML shape (`command`/`args`/`env`, stdio) and the config keys **against the shipped `codex` binary** before treating them as settled (the research flagged `project_doc_*` and config spellings as doc-sourced, not binary-verified).
3. Extend `ki-binding`'s AUDIT so the Codex surface is checked for agreement with the source, exactly as the Claude surfaces are.

## Files touched

- `AGENTS.md` (new), `CLAUDE.md` (reduced to import + appendix)
- `skills/repo-structure/ki-harness/` — standard, rubric, `scripts/audit.ts` (CLAUDE/AGENTS coverage) + re-vendored `.ki-meta/`
- `skills/environment/ki-binding/` — `references/binding-standard.md`, `references/audit-rubric.md`, `references/sources.md`, `scripts/audit.ts`, a render path
- `docs/decisions/references/runtime-parity-scorecard.md` (flip the orientation + MCP rows toward ●)

## Verify

- `bun run ki:audit` FAIL=0 after the CLAUDE.md/AGENTS.md split (the `ki-harness` coverage check passes against the new shape).
- `bun run ki:authoring:audit .` clean on `AGENTS.md` and `CLAUDE.md`.
- A Codex session started in the repo picks up `AGENTS.md` (manual check, or assert the file exists and is self-contained).
- `ki-binding` render writes a `~/.codex/config.toml` whose `[mcp_servers.*]` set matches `mcp-servers.yaml`; a follow-up `ki-binding` AUDIT of the Codex surface reports agreement (0 drift).
- Codex actually loads the rendered MCP servers (drive one tool through Codex CLI).

## Dependencies / blocks

Independent of plans 001/002 — skills install (the other concurrent-dev prerequisite) already landed. Does not cover agents (MD→TOML generator) or hooks (Phase 3) — those stay off the concurrent-dev path as their own future items. Workstream A (orientation) and Workstream B (MCP) are independently landable; either can go first.
