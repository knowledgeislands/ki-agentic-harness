# Modes AUDIT and CONFORM

_On-demand procedure for mcp's AUDIT and CONFORM modes (CONFORM runs AUDIT first, so they share this file). The canonical shape, surface-area model, tool naming, and access-level gate — lives in [`SKILL.md`](../SKILL.md) and is already loaded; this file is the procedure only._

## Mode AUDIT — check a repo against the standard

Auditing all the `mcp-*` servers at once is a set audit — **bound the context** (the set-audit discipline in `ki-skills`' enforcement framework §5): walk the servers **one at a time**, running each server's full audit (the common `engineering` layer then the MCP delta below) and releasing it before the next; the servers are independent, so the order is free.

1. **Identify the target.** Confirm the repo path (default: the cwd repo). Note its `<app>` prefix and which tool groups it ships.
2. **Run both mechanical checkers — the common layer first.** `bun ki-engineering/scripts/govern.ts <repo-path>` covers the shared toolchain (package.json metadata + aggregate/scoped audit wiring, direct code-tool checks, the `bun test` trap, tsconfig/biome, config-gated Vitest, `.env`, and the build/cli-chmod rule). Then `bun <skill>/scripts/govern.ts <repo-path>` (or `node` after build) covers the **MCP delta**: presence/shape of `src/` layers, `main`/`bin`/`exports`, the shared `utils/` helpers, tool names, and — when the repo selects Vitest — the MCP coverage excludes. Both grade findings on the unified severity ladder (FAIL / WARN / POLISH / ADVISORY / INFO / NA / PASS — see `ki-skills`' [checker contract](../../../keystone/ki-skills/references/checker-contract.md)), exit non-zero on any FAIL, and with `--json` / `--report` emit machine-readable findings and write the latest report under the target's `.ki/audits/<concern>.{md,json}` (`audit.ts` → `mcp`). Capture both — the repo is clean only when both pass.
3. **Do the semantic pass the script can't** — walk [Audit Rubric](rubric.md) and judge:
   - **Config injection**: grep for top-level `process.env` reads outside `config/index.ts`; confirm `main/`/`utils/` take config as the first arg.
   - **Layer purity**: logic that lives only in a `tools/*` handler or in `cli.ts` (should be in `main/`); `console.*` in `main/` (CLI/stderr only).
   - **Tool naming**: `grep -rn registerTool src/tools` — every name matches `<app>_<resource>_<action>` with correct plurality.
   - **Access gate**: every tool sets a real `annotations` preset; nothing bypasses `makeAccessGatedRegister`; destructive tools default `dry_run: true`.
   - **Security invariants** (see the checklist): path containment, `execFile`/argv not shell strings, bounded + `--no-optional-locks` git, depth-limited walks, tightened identifier regexes (not bare `z.string()`), `.strict()` zod with bounded numerics, no secrets in audit logs / error messages.
   - **Docs**: `CLAUDE.md` + `README.md` present and _not drifted_ from the code (notion-mirror's `CLAUDE.md` describing `orchestrator/` after the move to `cli/` + `main/` is the cautionary example).
   - **Longevity**: volatile external facts (targeted spec version/date, upstream API versions, third-party URLs, model IDs) aren't scattered hard-coded literals — each resolves at runtime or is pinned in one refreshable place, so the server can't rot silently once installed. Mirrors the skills rubric's longevity check; see the checklist's _Longevity & staleness_ section.
4. **Report.** Group findings on the unified severity ladder: a security invariant or gate bypass is a **FAIL**, layout/naming/tooling divergence a **WARN**, docs/consistency a **POLISH**. Cite `file:line`. Give the fix for each, and call out _intentional_ per-repo divergences (e.g. `kb-notion-mirror` defaulting to `write`) so they are not re-flagged.

## Mode CONFORM — bring an existing MCP repo up to standard

1. Run **AUDIT** first, so you change against a known gap list.
2. Fix the gaps in place: restore the `src/` layer boundaries (schema+envelope in `tools/`, logic in `main/` config-first, printing in `cli/`, wiring in `mcp-server/`), the shared `utils/` helpers, and the MCP `package.json` delta (`main` / `bin` / `exports` / `ki:server:mcp:*`) — **copy from the closest healthy sibling** rather than invent. For the common toolchain block (`tsconfig*` / `biome` / aggregate and scoped entrypoints, plus Vitest only when selected), run `ki-engineering`'s CONFORM.
3. **Run this skill's `conform.ts`** (`bun <skill>/scripts/govern.ts <repo-path>`): it fixes the mechanical `package.json` delta above and, when `ki:generate:client` is already defined, runs it to regenerate `src/generated/{client.ts,types.d.ts}` — no daemon needed (ki-mcp servers are ephemeral; `mcporter emit-ts` spawns its own short-lived process). A regen failure (server not registered, `dist/` stale) is printed as a manual TODO, not fatal.
4. Re-run both checkers and `bun run test` (NOT `bun test`). When the repo carries `vitest.config.*`, its configured 100% coverage gate must also pass.
