# Audit Checklist

Line-by-line pass/fail items for auditing a workspace MCP against the [Workspace MCP Standard](<Workspace MCP Standard.md>). Run [`../scripts/audit-mcp.ts`](../scripts/audit-mcp.ts) for the mechanical items (marked 🔧), then judge the rest by reading the code.

Severity: **B** blocker (security invariant breach or gate bypass — ship-stopper), **S** standard (layout / naming / tooling divergence), **P** polish (docs / consistency).

## Layout & layers

- [ ] 🔧 S — `src/` has `config/`, `mcp-server/`, `tools/`, `main/`, `utils/`.
- [ ] 🔧 S — `cli/` present ⇒ has both `cli.ts` and `index.ts`.
- [ ] S — `tools/<group>/index.ts` is thin: zod-validate → call `main/` → envelope. No FS/network/git/logic in a tool handler.
- [ ] S — all real logic lives in `main/`, grouped by concern, each with `index.ts`.
- [ ] B — `main/`/`utils/` have **no `console.*`** (return data; printing is CLI/stderr only). `api`-style layers assert no `console.log` in tests.
- [ ] S — `cli.ts` holds only arg-parsing + printing; the library it calls (`main/`) is the single source of truth, shared with `tools/`.
- [ ] S — no logic that exists _only_ in a tool handler or _only_ in `cli.ts`.

## Config injection

- [ ] B — `loadConfig(env?)` is the only reader of env; **no module-level config singleton**; no top-level `process.env` access outside `config/index.ts`. (`grep -rn "process.env" src --include=*.ts | grep -v config/`)
- [ ] B — every `main/`/`utils/` entry point takes config (or its slice) as the **first argument**; nothing reaches for ambient state.
- [ ] 🔧 S — `config/index.ts` exports `AccessLevel`, `ACCESS_LEVELS`, `ACCESS_LEVEL_RANK`, `AuditLogMode`, `loadConfig`.
- [ ] S — `Config` has `accessLevel`, `auditLogMode`, `auditLogPath`, `auditLogMaxBytes`, `auditLogKeep` + domain fields.
- [ ] S — tests build a literal `Config`; none call `loadConfig()` or mutate env.

## Tool naming & surface

- [ ] S — every registered tool matches `<app>_<resource>_<action>` with the repo's `<app>` prefix. (`grep -rn registerTool src/tools`)
- [ ] S — plural resource for collection ops, singular for single-item ops.
- [ ] P — CLI verbs mirror the tool names/resources.
- [ ] P — README tool catalog lists every registered tool with I/O shape.

## Access-level gate

- [ ] B — `mcp-server` sets `server.registerTool = makeAccessGatedRegister(...)`; nothing registers a tool bypassing the proxy.
- [ ] B — every tool sets `annotations` to a preset from `utils/annotations.ts` (no unannotated/partially-annotated tools).
- [ ] B — destructive & non-idempotent tools default `dry_run: true`, mutate only when explicitly `false`.
- [ ] S — default `MCP_<APP>_ACCESS_LEVEL` is `read` (allowed exceptions: voicenotes-edit, kb-notion-mirror default `write` — do not flag).

## Audit logging

- [ ] 🔧 S — `utils/audit-log.ts` exports `AuditConfig`, `appendAuditEvent`, `withAuditLog`.
- [ ] B — no secret (token/PAT/Bearer) is ever written to the audit log or surfaced in an error; only ids/arg-shapes/status.
- [ ] B — tool boundary returns errors via `errorResult` (not `throw`) so the audit wrapper sees the `isError` envelope.

## Security invariants

- [ ] B — every user path runs through the two-layer guard (lexical + realpath) before any `fs.*`/`execFile`/URL call, against the **full** root set.
- [ ] B — cached/prior-result paths are re-validated against live config.
- [ ] B — subprocess via `execFile`(argv), never a shell string; git carries `--no-optional-locks`.
- [ ] B — subprocess calls are timeout- and `maxBuffer`-bounded; network git sets `GIT_TERMINAL_PROMPT=0`. No unbounded spawn.
- [ ] B — directory walks are depth-limited and prune hidden dirs/`node_modules`.
- [ ] B — identifier inputs (names, urls, ids, path segments) use tightened regex schemas rejecting leading `-`, `..`, separators — not bare `z.string()`.
- [ ] B — risky multi-state options are enums, not booleans.
- [ ] S — all zod schemas `.strict()` with bounded numerics / length caps.
- [ ] S — batch tools aggregate per-item failures into `errors[]` (no crash).

## Bun vs Node

- [ ] 🔧 B — `test` script is `vitest run`; **no `bun test`** anywhere.
- [ ] B — `loadConfig()` calls `process.loadEnvFile()` in a try/catch.
- [ ] 🔧 S — `NODE_ENV=development` only in `server:mcp:dev`/`:inspect`.

## package.json

- [ ] 🔧 S — `type:module`, `packageManager:bun@…`, `engines.node>=22`, `main:dist/mcp-server/index.js`, `files:["dist"]`.
- [ ] 🔧 S — `bin.mcp-<name>` → `dist/mcp-server/index.js`; CLI/auth bin where applicable.
- [ ] 🔧 S — `exports` has `.`, `./config`, `./package.json` + one per reusable `main/<concern>`.
- [ ] 🔧 S — standard `lint:*`, `server:mcp:*`, `build`, `clean`, `test*` scripts.
- [ ] 🔧 S — `build` chmods `dist/cli/cli.js` **iff** `src/cli/` exists (no dangling chmod; no missing chmod).

## tsconfig / vitest / biome

- [ ] 🔧 S — `tsconfig.json` + `tsconfig.build.json` present and match the standard compiler options.
- [ ] 🔧 B — `vitest.config.ts` coverage thresholds 100% on all four metrics.
- [ ] 🔧 S — coverage `exclude` covers `mcp-server/index.ts`, `tools/**/index.ts`, `utils/annotations.ts`, and any printing/pure-data module (`cli/cli.ts`).
- [ ] 🔧 S — `biome.json` present, matching shared config.
- [ ] S — tests are co-located (`src/**/*.test.ts`) and pass at 100% coverage.

## .env.example & env

- [ ] 🔧 S — committed `.env.example` with `MCP_<APP>_*` prefix and the shared access-level + audit-log block.
- [ ] S — `.env.*` (non-`.example`) is gitignored.

## Docs

- [ ] P — `README.md`, `CLAUDE.md` (and usually `ROADMAP.md`) present.
- [ ] S — `CLAUDE.md` is **not drifted**: every layer/path/concept it names still exists in the code (catch renamed/moved layers).
- [ ] P — README install/config/client-setup steps are current.

## Reporting

Produce a findings table grouped by severity, each row: `severity · file:line · what · fix`. Close with: (a) any intentional, documented divergences you chose **not** to flag, and (b) a one-line verdict (compliant / minor drift / blockers).
