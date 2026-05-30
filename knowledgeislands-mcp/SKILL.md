---
name: knowledgeislands-mcp
description: >
  Codify and audit Knowledge Islands / HNR MCP servers against the canonical "workspace MCP" standard. Use when scaffolding a new MCP server, bringing an
  existing one up to standard, or reviewing one for compliance: project layout (config / main / tools / cli / mcp-server / utils), config injection (no
  module-level singleton), the `<app>_<resource>_<action>` tool-naming scheme, the annotation-driven access-level gate, audit logging, the security invariants,
  the Bun-install / Node-run split, and the package.json / tsconfig / vitest / biome tooling. Triggers: "audit this MCP", "does this MCP follow our standards",
  "scaffold a new MCP", "bring this MCP up to standard", "review the MCP layout / tool surface / package.json". Operates on the sibling repos under
  `knowledgeislands/` (mcp-git-audit, mcp-kb-fs, mcp-gmail, mcp-m365, mcp-claude-housekeeping, mcp-voicenotes-edit, mcp-kb-notion-mirror). Do NOT use to audit a
  SKILL.md itself — that is the `knowledgeislands-skills` skill.
---

# Knowledge Islands MCP standards

You are helping codify or audit a **workspace MCP server** — one of the stdio MCP servers in the `knowledgeislands/` workspace. They all share one canonical
shape, so a new one should be scaffolded to it and an existing one should be auditable against it. This skill carries that standard and the audit procedure.

The full, quotable standard lives in [Workspace MCP Standard](references/workspace-mcp-standard.md); the line-by-line pass/fail items live in
[Audit Checklist](references/audit-checklist.md). A mechanical structural checker is [`scripts/audit-mcp.ts`](scripts/audit-mcp.ts). Read those when you need
detail; this file is the operating procedure.

## The canonical shape at a glance

```text
src/
├── config/index.ts   # loadConfig(env?) → Config. NO module-level singleton; nothing reads env at import time.
├── mcp-server/index.ts# stdio entry: loadConfig() once, makeAccessGatedRegister, registerXxxTools(server, config). Coverage-excluded.
├── tools/<group>/index.ts # thin: zod-validate args → call main/, map to MCP envelope (jsonResult/errorResult). Coverage-excluded. NO logic.
├── main/<concern>/    # the real implementation, usable from a script. Each entry takes its config slice as the FIRST arg.
├── cli/               # OPTIONAL human-runnable bin: cli.ts does ALL stdout printing; index.ts re-exports main. Mirrors the tool surface. cli.ts coverage-excluded.
└── utils/             # cross-MCP helpers kept in sync across siblings: access-level.ts, annotations.ts, audit-log.ts, paths/results, …
```

Three rules define the layer boundaries — most audit findings are a violation of one:

1. **Config is injected, never ambient.** `loadConfig()` is called exactly once (in `mcp-server/index.ts`, or by a `cli.ts` / a script). No other module reads
   `process.env` at import time; every `main/` and `utils/` function takes the config (or the specific slice it needs) as its **first argument**.
2. **Layers have one job each.** `tools/` validates + envelopes and nothing more; `main/` holds the logic and is runnable without the MCP server; `cli/` only
   prints (the library it calls never writes to stdout); `mcp-server/` only wires.
3. **The access-level gate is annotation-driven, not name-driven.** A tool registers only if the level derived from its `annotations` is ≤ `config.accessLevel`.
   See the gate rules below.

## Surface-area model: main vs tools vs cli

Decide _where code lives_ by who needs to call it, not by what it does:

| Layer    | Exists to…                                    | May contain                                            | Must NOT                                  |
| -------- | --------------------------------------------- | ------------------------------------------------------ | ----------------------------------------- |
| `main/`  | be the implementation, callable from anywhere | all real logic; FS / network / git; returns plain data | print to stdout/stderr; read env directly |
| `tools/` | expose `main/` over MCP                       | zod schema, arg validation, `jsonResult`/`errorResult` | hold logic; be the only caller of `main/` |
| `cli/`   | expose `main/` to a human at a terminal       | arg parsing, ALL human-readable printing               | hold logic; be the only caller of `main/` |

`main/` is the single source of truth; `tools/` and `cli/` are two thin shells over the **same** functions. If logic exists only inside a tool handler or only
inside the CLI, that is a finding — push it down into `main/`. Group `main/` by **concern**, mirroring the tool groups (`main/repo-audit/`, `main/notes/`, …),
each with an `index.ts` re-export, and surface the reusable ones through the package `exports` map so the code is consumable as a library.

## Tool naming

`<app>_<resource>_<action>`, snake_case. `<app>` is fixed per repo (`git`, `kb`, `gmail`, `m365`, `claude_code`/`claude_desktop`/`vscode`, `voicenotes`,
`notion_mirror`). **Plural** resource for collection ops (`git_repos_scan`, `gmail_messages_search`); **singular** for single-item ops (`kb_note_read`,
`git_repo_commit`). Metadata/lifecycle tools may drop the resource segment (`gmail_auth_start`, `m365_about`). The CLI verb surface mirrors these names.

## Access-level gate

`makeAccessGatedRegister(server, accessLevel, audit)` in `utils/access-level.ts` derives a level from each tool's `annotations` and registers it only when that
level ≤ `config.accessLevel` (env `MCP_<APP>_ACCESS_LEVEL`, default `read`; levels nest `read ⊂ write ⊂ destructive`):

- `readOnlyHint: true` → **read**
- `destructiveHint: true` → **destructive**
- explicit `readOnlyHint: false` AND `destructiveHint: false` → **write**
- anything else (unannotated / partial) → **destructive** (fail-safe)

Every tool MUST set `annotations` to a preset from `utils/annotations.ts` (`READ_ONLY`, `WRITE`, `WRITE_IDEMPOTENT`, `DESTRUCTIVE`, `DESTRUCTIVE_ONESHOT`, and
the `_REMOTE` variants). `DESTRUCTIVE_ONESHOT` is for tools whose end state depends on current FS/index state (running twice ≠ same result). Never bypass the
register proxy. The default `read` gate hides every mutation until the operator opts in.

## Operating modes

Infer the mode from the request; ask if unclear.

### Mode AUDIT — check a repo against the standard

1. **Identify the target.** Confirm the repo path (default: the cwd repo). Note its `<app>` prefix and which tool groups it ships.
2. **Run the mechanical checker** for the structural/tooling layer: `bun <skill>/scripts/audit-mcp.ts <repo-path>` (or `node` after build). It reports
   presence/shape of `src/` layers, `package.json` fields and scripts (incl. the `bun test` vs `vitest run` trap), tsconfig/vitest/biome, `.env.example`, the
   shared `utils/` helpers, and drift like a `build` script that chmods a `dist/cli/cli.js` with no `src/cli/`.
3. **Do the semantic pass the script can't** — walk [Audit Checklist](references/audit-checklist.md) and judge:
   - **Config injection**: grep for top-level `process.env` reads outside `config/index.ts`; confirm `main/`/`utils/` take config as the first arg.
   - **Layer purity**: logic that lives only in a `tools/*` handler or in `cli.ts` (should be in `main/`); `console.*` in `main/` (CLI/stderr only).
   - **Tool naming**: `grep -rn registerTool src/tools` — every name matches `<app>_<resource>_<action>` with correct plurality.
   - **Access gate**: every tool sets a real `annotations` preset; nothing bypasses `makeAccessGatedRegister`; destructive tools default `dry_run: true`.
   - **Security invariants** (see the checklist): path containment, `execFile`/argv not shell strings, bounded + `--no-optional-locks` git, depth-limited walks,
     tightened identifier regexes (not bare `z.string()`), `.strict()` zod with bounded numerics, no secrets in audit logs / error messages.
   - **Docs**: `CLAUDE.md` + `README.md` present and _not drifted_ from the code (notion-mirror's `CLAUDE.md` describing `orchestrator/` after the move to
     `cli/` + `main/` is the cautionary example).
4. **Report.** Group findings by severity (see checklist): **blocker** (security invariant or gate bypass), **standard** (layout/naming/tooling divergence),
   **polish** (docs/consistency). Cite `file:line`. Give the fix for each, and call out _intentional_ per-repo divergences (e.g. `voicenotes-edit` defaulting to
   `write`) so they are not re-flagged.

### Mode CODIFY — scaffold or bring a repo up to standard

1. Run AUDIT first so you change against a known gap list.
2. Prefer **copying from the closest healthy sibling** over inventing: take the shared `utils/` helpers, `tsconfig*.json`, `vitest.config.ts`, `biome.json`, and
   the package.json script block verbatim, then adapt the `<app>` prefix, env-var prefix (`MCP_<APP>_*`), `SERVER_NAME`, and `exports` map.
3. Keep the layer boundaries from day one: schema+envelope in `tools/`, logic in `main/` (config slice first), printing only in `cli/`, wiring only in
   `mcp-server/`. Add tools with explicit `annotations` presets.
4. Re-run the checker + tests; `bun run test` (NOT `bun test`), `bun run lint:check`, `bun run lint:types` must pass with 100% coverage.

## Bun vs Node (the standing trap)

Install/dev use **Bun (≥1.3)**; the compiled `dist/` runs under **Node (≥22)** — that is what the MCP client launches. Two consequences the audit always checks:

- `bun run test` runs vitest; **`bun test`** silently invokes Bun's own runner — the `test` script must be `vitest run`, and nothing should call `bun test`.
- Bun auto-loads `.env.${NODE_ENV}`; Node needs the explicit `process.loadEnvFile()` in `loadConfig()`, wrapped in try/catch (Bun has no such API and throws
  `TypeError`). `NODE_ENV=development` is set only by the dev/inspect scripts, so in production `.env.*` is ignored — config must come from the MCP client's
  `env` block.

## Notes

- This skill targets the standard documented in the sibling repos' own `CLAUDE.md` files; when they disagree, the **majority shape** is the standard and the
  outlier is a finding (unless the outlier is a deliberate, documented exception). When unsure whether a divergence is intentional, ask rather than "fix" it.
- Keep the shared `utils/` helpers (`access-level.ts`, `annotations.ts`, `audit-log.ts`) in sync across repos — a fix to one usually applies to all.
- Full detail: [Workspace MCP Standard](references/workspace-mcp-standard.md) and [Audit Checklist](references/audit-checklist.md).
