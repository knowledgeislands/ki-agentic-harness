---
id: '002'
title: Multi-runtime install linkers (Workstream B Phase 2)
status: in-progress
roadmap: Vendor-neutral install linkers — multi-runtime skill/agent installation (Workstream B Phase 2)
blocks: —
blocked-by: —
---

# Multi-runtime install linkers (Workstream B Phase 2)

## Context

"Register OpenAI Codex CLI as a target runtime" (plan 001) registered Codex in the governance layer but deliberately shipped no adapter code, and stated that the vendor-neutral install layer must be separately scoped before it changes install links. This plan is that separate scope: the first slice of Workstream B — generalising the bootstrap install linkers so a repo installs its skills and agents for **every runtime it declares**, not only Claude Code. The runtimes differ only in discovery path (Claude Code reads `.claude/`, OpenAI Codex CLI reads `.agents/` — per the runtime feature-coverage matrix in `SDR-KI-HARNESS-002`), so the linkers should loop over a declared runtime set rather than hardcode `.claude/`.

## Current state

The bulk of Phase 2 is **done** (this session): a new `[ki-harness] target_runtimes` key drives per-runtime install, the two self-locating linkers loop over it, and default behaviour is byte-identical for every repo that omits the key. What remains is the one vendored script and the later phases, tracked below.

## Steps

1. ✓ Add `targetRuntimes()`, `runtimeSkillsDir()`, `runtimeAgentsDir()` to `package-scripts.ts` — parse `[ki-harness] target_runtimes` (absent → `["claude-code"]`), map each runtime to its skills/agents discovery path, throw a clear message for an unknown/unsupported runtime.
2. ✓ `link-skills.ts` — parameterise `cmdLink`/`cmdCheck` by the runtime's skills subdir; entry loops the declared runtimes (Claude Code → `.claude/skills`, Codex → `.agents/skills`).
3. ✓ `link-agents.ts` — same loop; Codex is **reported-and-skipped** with an explicit "unsupported pending format spike" message (its subagents are TOML under `~/.codex/agents/`, a generator not a symlink), Claude Code proceeds normally.
4. ✓ `.ki-config.toml` — declare `[ki-harness] target_runtimes = ["claude-code"]` with a comment on the default and the Codex-not-wired-yet state.
5. `sync-skills.ts --runtime` flag — **deferred**: this script is vendored into `.ki-meta/bin/`, so editing it needs a re-vendor; do it when the tree is quiet to avoid a vendored-copy collision.

## Files touched

- `skills/keystone/ki-bootstrap/scripts/package-scripts.ts`
- `skills/keystone/ki-bootstrap/scripts/link-skills.ts`
- `skills/keystone/ki-bootstrap/scripts/link-agents.ts`
- `.ki-config.toml`
- (deferred) `skills/keystone/ki-bootstrap/scripts/sync-skills.ts` + its `.ki-meta/bin/` vendored copy

## Verify

- `bunx @biomejs/biome check` and `bunx tsc --noEmit` clean on the edited scripts.
- `bun test skills/keystone/ki-bootstrap/scripts/link-skills.test.ts` passes.
- `link-skills.ts <repo> --check` and `link-agents.ts <repo> --check` report `0 failed` on a Claude-Code-only repo (default behaviour unchanged).
- A scratch repo with `target_runtimes = ["claude-code", "codex"]` dry-runs to: skills created under both `.claude/skills` and `.agents/skills`; agents linked for Claude Code and reported-and-skipped for Codex.
- An unknown runtime fails loud naming the valid set.
- `bun run ki:audit` FAIL=0 with no new WARN, and the `[ki-harness]` audit accepts `target_runtimes`.

## Dependencies / blocks

Follows plan 001's runtime registration, which is already recorded in `SDR-KI-HARNESS-002` — so this plan is not hard-blocked and stands alone. It does **not** cover the remaining Workstream B phases, which are their own future ROADMAP items: the hooks-registration generator (Phase 3) and the Markdown→TOML governance-agent generator plus the `AGENTS.md` dogfood (Phase 4, gated on the subagent-format spike). The deferred `sync-skills.ts --runtime` flag stays in this plan and keeps it `in-progress` until landed.
