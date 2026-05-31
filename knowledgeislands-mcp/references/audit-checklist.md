# Audit Checklist

Line-by-line pass/fail items for auditing a workspace MCP against the [Workspace MCP Standard](workspace-mcp-standard.md). Run
[`../scripts/audit-mcp.ts`](../scripts/audit-mcp.ts) for the mechanical items (marked 🔧), then judge the rest by reading the code.

Severity: **B** blocker (security invariant breach or gate bypass — ship-stopper), **S** standard (layout / naming / tooling divergence), **P** polish (docs /
consistency).

## Contents

- [Layout & layers](#layout--layers)
- [Config injection](#config-injection)
- [Tool naming & surface](#tool-naming--surface)
- [Access-level gate](#access-level-gate)
- [Audit logging](#audit-logging)
- [Security invariants](#security-invariants)
- [Spec conformance — tool results & metadata](#spec-conformance--tool-results--metadata-standard-12)
- [OAuth security — auth-server repos only](#oauth-security--auth-server-repos-only-mcp-gmail-mcp-m365-standard-13)
- [Bun vs Node](#bun-vs-node)
- [package.json](#packagejson)
- [tsconfig / vitest / biome](#tsconfig--vitest--biome)
- [.env.example & env](#envexample--env)
- [Docs](#docs)
- [Longevity & staleness](#longevity--staleness-mirrors-knowledgeislands-skills-rubric-long-1)
- [Reporting](#reporting)

## Layout & layers

- [ ] 🔧 S — `src/` has `config/`, `mcp-server/`, `tools/`, `main/`, `utils/`.
- [ ] 🔧 S — `cli/` present ⇒ has both `cli.ts` and `index.ts`.
- [ ] S — `tools/<group>/index.ts` is thin: zod-validate → call `main/` → envelope. No FS/network/git/logic in a tool handler.
- [ ] S — all real logic lives in `main/`, grouped by concern, each with `index.ts`.
- [ ] B — `main/`/`utils/` have **no `console.*`** (return data; printing is CLI/stderr only). `api`-style layers assert no `console.log` in tests.
- [ ] S — `cli.ts` holds only arg-parsing + printing; the library it calls (`main/`) is the single source of truth, shared with `tools/`.
- [ ] S — no logic that exists _only_ in a tool handler or _only_ in `cli.ts`.

## Config injection

- [ ] B — `loadConfig(env?)` is the only reader of env; **no module-level config singleton**; no top-level `process.env` access outside `config/index.ts`.
      (`grep -rn "process.env" src --include=*.ts | grep -v config/`)
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
- [ ] S — tools sanitize untrusted output before returning it (spec: "Servers MUST sanitize tool outputs"); e.g. m365's `html-sanitizer.ts`. Rate-limiting is a
      spec MUST but low-priority for local stdio servers — note, don't block.

## Spec conformance — tool results & metadata (standard §12)

- [ ] B — tool boundary returns errors as `isError: true` envelopes via `errorResult`, never `throw` (spec 2025-11-25: validation/API/logic errors are Tool
      Execution Errors, not protocol errors; a throw also bypasses the audit wrapper). Same item as audit-logging below — verify once.
- [ ] P — any tool returning `structuredContent` also declares a matching `outputSchema` at registration (paired, ideally from one zod schema). A `jsonResult`
      emitting `structuredContent` with no declared schema is a polish finding; plain text-only results need neither.
- [ ] P — optional spec metadata (`icons`, `title`, `execution.taskSupport`) is per-repo opt-in, not required — do **not** flag its absence.

## OAuth security — auth-server repos only: mcp-gmail, mcp-m365 (standard §13)

Skip this whole section for the filesystem/subprocess repos.

- [ ] B — no token passthrough: server never accepts/forwards a caller-supplied token; it uses tokens issued to itself for the downstream API.
- [ ] B — auth-code flow uses PKCE and a cryptographically random, server-stored, single-use `state` validated by exact match at the callback.
- [ ] B — `redirect_uri` validated by exact string match (loopback), not prefix/wildcard.
- [ ] B — tokens stored with restrictive perms outside any served root; never logged; redacted from audit log + errors.
- [ ] S — least-privilege scopes (only what shipped tools need); SSRF discipline on fetched URLs (HTTPS, host-pinned, no redirect to internal/loopback IPs).

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

## Longevity & staleness (mirrors `knowledgeislands-skills` rubric LONG-1)

A server installed and left running drifts from the world around it; the audit checks it can't rot silently.

- [ ] S — volatile external facts the code depends on (the MCP spec version/date it targets, upstream API/SDK versions, third-party URLs, model IDs) are not
      scattered hard-coded literals: each is either resolved at runtime or pinned in **one** refreshable place (`config/`, `CLAUDE.md`, or `package.json`) so a
      bump is a single known edit, not a hunt.
- [ ] P — the repo's `CLAUDE.md`/`README.md` names the spec version it conforms to, so a reviewer can tell at a glance whether it predates a spec move.
- [ ] P — this audit itself is run against a **current** standard: if a finding cites a spec MUST, the skill's Mode REFRESH + [`sources.md`](sources.md) confirm
      the spec hasn't moved since the standard's `last reviewed` date. Don't green-light a repo against a stale spec.

## Reporting

Produce a findings table grouped by severity, each row: `severity · file:line · what · fix`. Close with: (a) any intentional, documented divergences you chose
**not** to flag, and (b) a one-line verdict (compliant / minor drift / blockers).
