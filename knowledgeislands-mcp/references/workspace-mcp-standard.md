# Workspace MCP Standard

The canonical shape shared by every stdio MCP server in the `knowledgeislands/` workspace: `mcp-git-audit`, `mcp-kb-fs`, `mcp-gmail`, `mcp-m365`,
`mcp-claude-housekeeping`, `mcp-voicenotes-edit`, `mcp-kb-notion-mirror`. This is the reference the `knowledgeislands-mcp` skill codifies and audits against.
Where repos disagree, the majority shape is the standard; documented per-repo exceptions are noted inline.

## Contents

1. [Project layout](#1-project-layout)
2. [Config injection](#2-config-injection)
3. [Tool naming](#3-tool-naming)
4. [Access-level gate (annotation-driven)](#4-access-level-gate-annotation-driven)
5. [Audit logging](#5-audit-logging)
6. [Security invariants](#6-security-invariants)
7. [Bun vs Node](#7-bun-vs-node)
8. [package.json](#8-packagejson)
9. [tsconfig / vitest / biome](#9-tsconfig--vitest--biome)
10. [.env.example & env vars](#10-envexample--env-vars)
11. [Docs](#11-docs)
12. [Spec conformance: tool results, errors & metadata](#12-spec-conformance-tool-results-errors--metadata)
13. [OAuth security (auth-server repos)](#13-oauth-security-auth-server-repos)

> **Spec vs house style.** Sections 1–11 are the in-house **workspace convention**; §12–13 trace directly to the official MCP specification (latest released:
> **2025-11-25**; draft targeting 2026-07-28 in validation) tracked in [the source list](sources.md). When citing a rule, know which layer it comes from — never
> present a workspace preference as a protocol "MUST". Mode REFRESH in the [SKILL](../SKILL.md) re-anchors §12–13 (and the annotation semantics in §4) to the
> current spec.

## 1. Project layout

```text
src/
├── config/index.ts        # loadConfig(env?) → Config; types/constants re-export
├── mcp-server/index.ts     # stdio wrapper (entry point) — coverage-excluded
├── tools/<group>/index.ts  # MCP tool definitions — coverage-excluded, no logic
├── main/<concern>/         # real implementation, library-usable; index.ts re-export per concern
├── cli/                    # OPTIONAL: cli.ts (bin, all printing) + index.ts (re-export)
└── utils/                  # cross-MCP helpers, kept in sync across siblings
```

Top-level `src/` folders are identical across all seven repos: `config`, `main`, `mcp-server`, `tools`, `utils`, plus `cli` where a human-runnable command
exists, and per-domain extras (`auth-server` in gmail/m365; `types.ts`).

### Layer responsibilities

- **`config/`** — the only place env is read. `loadConfig(env?) → Config`. No module-level config singleton; nothing reads env at import time.
- **`mcp-server/`** — wiring only: `loadConfig()` once, build the `AuditConfig` slice, `server.registerTool = makeAccessGatedRegister(...)`, then
  `registerXxxTools(server, config)` per group. Then connect a `StdioServerTransport` and log readiness on **stderr**.
- **`tools/`** — thin shells. Validate args with a `.strict()` zod schema, call a `main/` function (passing the needed config slice), map the result or thrown
  error to an MCP envelope via `jsonResult` / `errorResult`. `tools/**/index.ts` is coverage-excluded — **never put logic here**.
- **`main/`** — the real implementation, grouped by concern, mirroring the tool groups. Each concern dir has an `index.ts` re-export. Every entry point that
  touches FS/network/config takes its config (or the specific slice — `safeRoots`, `rootPath`, `NotionConfig`, …) as its **first argument**. No `console.*` here
  (return data; let the tool/CLI present it). Reusable concerns are surfaced via the package `exports` map.
- **`cli/`** (optional) — `cli.ts` is the `#!/usr/bin/env node` bin: it loads `.env` itself (Node parity with Bun), parses args, dispatches to the **same**
  `main/` functions the tools use, and does **all** human-readable printing. `cli/index.ts` re-exports the `main/` library surface. The CLI verb surface mirrors
  the MCP tool surface (same resource/verb structure). `cli.ts` is coverage-excluded; the `main/` functions it calls are not.
- **`utils/`** — cross-MCP helpers that take the **specific primitive** they need, not the whole `Config`. Common files kept in sync across siblings:
  `access-level.ts`, `annotations.ts`, `audit-log.ts`, and per-repo `paths`/ `results`/`errors`. Domain-specific utils (`git-exec.ts`, `mime.ts`,
  `html-sanitizer.ts`, `odata-helpers.ts`, `protected.ts`, `atomic-write.ts`) live here too but are not shared.

## 2. Config injection

- `loadConfig(env = process.env): Config` hydrates `.env.${NODE_ENV}` via `process.loadEnvFile()` inside a try/catch (Bun has no such API and throws
  `TypeError`, which the catch swallows — same code runs under Bun and Node), then parses env into a plain, immutable `Config`.
- **No module-level singleton.** Nothing reads `process.env` at import time outside `config/index.ts`. `main/` and `utils/` receive config as their first
  argument; tests build a literal `Config` and pass it (never mutate env, never call `loadConfig()` in a test — critical for repos that walk real user dirs).
- Universal exports from `config/index.ts`:
  - `type AccessLevel = 'read' | 'write' | 'destructive'`
  - `const ACCESS_LEVELS = ['read','write','destructive'] as const`
  - `const ACCESS_LEVEL_RANK = { read:1, write:2, destructive:3 }`
  - `type AuditLogMode = 'off' | 'writes' | 'all'`
  - `loadConfig`, plus parse helpers (`parseAccessLevel`, `parseAuditLogMode`, `parseNonNegativeInt`).
- `Config` always includes `accessLevel`, `auditLogMode`, `auditLogPath`, `auditLogMaxBytes` (default 10 MiB), `auditLogKeep` (default 5), plus domain fields
  (`safeRoots`, `rootPath`, `auth`, …).
- **Divergence:** gmail/m365 export `SERVER_NAME`/`SERVER_VERSION` from `config/index.ts`; others hard-code the name in `mcp-server` or `audit-log.ts`.

## 3. Tool naming

`<app>_<resource>_<action>`, snake_case.

| Repo                    | `<app>` prefix(es)                        |
| ----------------------- | ----------------------------------------- |
| mcp-git-audit           | `git`                                     |
| mcp-kb-fs               | `kb`                                      |
| mcp-gmail               | `gmail`                                   |
| mcp-m365                | `m365`                                    |
| mcp-claude-housekeeping | `claude_code`, `claude_desktop`, `vscode` |
| mcp-voicenotes-edit     | `voicenotes`                              |
| mcp-kb-notion-mirror    | `notion_mirror`                           |

- **Plural** resource for collection ops (`git_repos_scan`, `gmail_messages_search`, `kb_notes_list`).
- **Singular** for single-item ops (`kb_note_read`, `git_repo_commit`, `gmail_message_get`).
- Metadata/lifecycle tools may drop the resource segment (`m365_about`, `gmail_auth_start`).
- The CLI verb surface mirrors the tool names.

The house scheme is a deliberate **subset** of what the spec permits: per [TOOLS](sources.md), names SHOULD be 1–128 chars from `[A-Za-z0-9_.-]`. Snake*case
`<app>*<resource>\_<action>` stays well inside that, so a conformant house name is always a conformant spec name — the constraint to enforce is the house
scheme, not the looser spec one.

## 4. Access-level gate (annotation-driven)

`utils/access-level.ts` exports `makeAccessGatedRegister(server, accessLevel, audit)`. At registration it derives a level from each tool's `annotations` and
registers the tool only if that level ≤ `config.accessLevel`:

- `readOnlyHint: true` → **read**
- `destructiveHint: true` → **destructive**
- explicit `readOnlyHint: false` AND `destructiveHint: false` → **write**
- anything else → **destructive** (fail-safe)

These four hints (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) and their semantics are defined by the spec ([TOOLS](sources.md)) and
have been stable since revision 2025-03-26 (confirmed current through 2025-11-25): `destructiveHint`/`idempotentHint` are only meaningful when `readOnlyHint` is
false. The gate reads them as a risk vocabulary, exactly as the spec intends — the presets in `utils/annotations.ts` set `idempotentHint` (the `_IDEMPOTENT`
variants) and `openWorldHint` (the `_REMOTE` variants) too, even though the gate keys only on read/destructive. The spec also warns clients to treat a server's
annotations as **untrusted** — which is why the gate is the operator-controlled `MCP_<APP>_ACCESS_LEVEL`, not anything self-asserted at call time.

Levels nest `read ⊂ write ⊂ destructive`; env `MCP_<APP>_ACCESS_LEVEL` (default `read`). Every tool sets `annotations` to a preset from `utils/annotations.ts`:
`READ_ONLY`, `WRITE`, `WRITE_IDEMPOTENT`, `WRITE_IDEMPOTENT_REMOTE`, `DESTRUCTIVE`, `DESTRUCTIVE_REMOTE`, `DESTRUCTIVE_ONESHOT`, plus `_REMOTE`/read variants
per repo. `DESTRUCTIVE_ONESHOT` = effect depends on current FS/index state. Never bypass the register proxy; never derive the level from the tool name.

**Divergence:** default access level is `read` everywhere except `mcp-voicenotes-edit` and `mcp-kb-notion-mirror`, which default to `write` (they ship no
read-only tools) — intentional, do not flag.

## 5. Audit logging

`utils/audit-log.ts` exports the `AuditConfig` slice (`{ mode, path, maxBytes, keep }`), an `AuditEvent` shape, `appendAuditEvent(audit, event)`, and
`withAuditLog(audit, name, level, cb)`. `mcp-server` wires it through the gated register. Append-only JSONL with size-based rotation (`maxBytes` × `keep`).
**Secrets never appear in the log** — tokens/PATs/Bearer values are redacted; only ids, arg shapes, and status/scope/expiry are recorded. The tool boundary
returns errors via `errorResult` (not `throw`) so the audit wrapper sees the `isError` envelope.

## 6. Security invariants

1. **Path containment is two-layer.** Every user path goes through a lexical normalize (rejects `..`, Windows separators) **and** a realpath check of the
   deepest existing ancestor against the allowed root(s) (catches symlink escape), before any `fs.*` / `execFile` / URL call. Validate against the **full** set
   of roots, threaded in as the first arg of the `main/` function.
2. **Cached results are re-validated.** A tool that consumes a prior tool's output (e.g. a scan envelope) re-checks every path against the live config before
   acting — a cached result cannot widen the security boundary.
3. **Shell-out uses `execFile` with an argv array, never a shell string.** For git: `execFile('git', ['--no-optional-locks', '-C', repo, ...args], opts)` —
   `--no-optional-locks` is mandatory.
4. **Subprocess calls are time- and memory-bounded.** Local commands use a short timeout (~8s), network commands a longer one (~60s); both capped by
   `maxBuffer`. Network git sets `GIT_TERMINAL_PROMPT=0` so auth prompts fail fast instead of hanging. Never spawn an unbounded subprocess.
5. **Directory walks are depth-limited** and prune hidden dirs + `node_modules`.
6. **Identifier inputs that become argv/path tokens have tightened regex schemas** (remote/branch names, URLs, uuids, workspace/project/session ids): reject
   leading `-` (option injection), `..`, and path separators. Bare `z.string().min(1)` is not acceptable.
7. **Destructive / non-idempotent tools expose `dry_run`, default `true`**, and only mutate when explicitly `false`. Pass native `--dry-run` through where git
   offers it; approximate otherwise.
8. **Risky multi-state flags are enums, not booleans** (e.g. force-push: `force_mode: 'none' | 'with_lease' | 'force'`).
9. **All zod schemas are `.strict()` with bounded numerics** (`.int().max(N)`, array/string length caps).
10. **Per-item failures don't crash a batch** — aggregate into an `errors[]`.
11. **Errors and audit logs never leak secrets or absolute paths** — surface caller input relative to the root; 401s hint at the `*_auth_start` remedy.

## 7. Bun vs Node

- Install + dev: **Bun ≥ 1.3** (`packageManager: "bun@…"`, `engines.node >= 22`). Compiled `dist/` runs under **Node ≥ 22** — what the MCP client launches.
- `bun run test` → vitest. **`bun test`** invokes Bun's own runner instead — the `test` script must be `vitest run`, and nothing should call `bun test`.
- Bun auto-loads `.env.${NODE_ENV}`; Node needs the explicit `process.loadEnvFile()` (try/catch) in `loadConfig()`. `NODE_ENV=development` is set only by
  `server:mcp:dev` / `server:mcp:inspect`, so production ignores `.env.*` — config must come from the client's `env` block.

## 8. package.json

- `"type": "module"`, `"packageManager": "bun@1.3.x"`, `"engines": { "node": ">=22.0.0" }`, `"main": "dist/mcp-server/index.js"`, `"files": ["dist"]`.
- `"bin"`: `{ "mcp-<name>": "dist/mcp-server/index.js" }`, plus a second entry for a CLI (`"mcp-<name>-<verb>": "dist/cli/cli.js"`) or auth server
  (`"mcp-<name>-auth"`) where present.
- `"exports"`: always `"."` (→ `dist/mcp-server`), `"./config"`, and `"./package.json"`; plus one entry per reusable `main/<concern>`.
- Standard scripts (copy verbatim, adapt only paths):

  ```jsonc
  "build":              "tsc -p tsconfig.build.json",   // append `&& chmod +x dist/cli/cli.js` only if a CLI exists
  "clean":              "rm -rf {dist,node_modules}",
  "lint:check":         "bunx @biomejs/biome check",
  "lint:fix":           "bunx @biomejs/biome check --write --unsafe",
  "lint:format":        "bunx @biomejs/biome format --write",
  "lint:md":            "bunx prettier --write \"**/*.md\" --ignore-path .gitignore && bunx markdownlint-cli2",
  "lint:package":       "bunx syncpack format",
  "lint:types":         "tsc --noEmit",
  "prepare":            "husky",
  "server:mcp:dev":     "NODE_ENV=development bun --watch src/mcp-server/index.ts",
  "server:mcp:inspect": "NODE_ENV=development bunx @modelcontextprotocol/inspector bun src/mcp-server/index.ts",
  "server:mcp:start":   "bun run build && node dist/mcp-server/index.js",
  "test":               "vitest run",
  "test:coverage":      "vitest run --coverage",
  "test:watch":         "vitest"
  ```

  Optional: `test:smoke` (`bun run build && bun scripts/smoke.ts`), `deps:*`, and `server:auth:*` for the OAuth repos.

- **Drift to catch:** a `build` that `chmod +x dist/cli/cli.js` while `src/cli/` does not exist — either add the CLI or drop the chmod. (mcp-kb-notion-mirror is
  the repo that legitimately ships a CLI and chmods it.)

## 9. tsconfig / vitest / biome

- **`tsconfig.json`** (identical across repos): `target`/`lib` `es2024`, `module` & `moduleResolution` `nodenext`, `moduleDetection: force`,
  `types: ["node", "vitest/globals"]`, `allowImportingTsExtensions`, `verbatimModuleSyntax`, `isolatedModules`, full `strict` +
  `noUnusedLocals`/`noUnusedParameters`/ `noImplicitReturns`/`noImplicitOverride`/`noFallthroughCasesInSwitch`, `skipLibCheck`, `noEmit`.
  `include: ["**/*.ts"]`.
- **`tsconfig.build.json`** extends it: `noEmit:false`, `declaration` + `declarationMap`, `outDir: ./dist`, `rootDir: ./src`,
  `allowImportingTsExtensions:false`, `noUncheckedIndexedAccess:true`, `exclude: [..., "**/*.test.ts"]`.
- **`vitest.config.ts`**: `globals:true`, `environment:'node'`, `include:['src/**/*.test.ts']`, `fileParallelism:false`, v8 coverage with **100% thresholds**
  (lines/functions/branches/statements) and `exclude`: `src/**/*.test.ts`, `src/mcp-server/index.ts`, `src/tools/**/index.ts`, `src/utils/annotations.ts`, plus
  any pure-data/printing module (`src/cli/cli.ts`, `src/utils/notion-args.ts`). Tests are co-located.
- **`biome.json`**: git VCS + ignore file, formatter (2-space, lineWidth 200), JS formatter (single quotes, semicolons as-needed, no trailing commas),
  recommended lint with `suspicious.noExplicitAny: off`, organize-imports assist.

## 10. .env.example & env vars

- Committed `.env.example` template (real `.env.*` gitignored). Header explains: copy to `.env.development` for `bun run server:mcp:dev`, or set in the client's
  `env` block.
- Prefix `MCP_<SCREAMING_SNAKE_APPNAME>_*`. Shared block across all repos: `MCP_<APP>_ACCESS_LEVEL` (default `read`), `MCP_<APP>_AUDIT_LOG` (default `writes`),
  `MCP_<APP>_AUDIT_LOG_PATH` (default `~/.local/state/mcp-<name>/audit.jsonl`), `MCP_<APP>_AUDIT_LOG_MAX_BYTES` (10485760), `MCP_<APP>_AUDIT_LOG_KEEP` (5), plus
  domain vars (`*_SAFE_ROOTS`, `*_ROOT`, OAuth client id/secret, PAT, …).

## 11. Docs

- **`README.md`** — user-facing: tool catalog (purpose + I/O shape per tool), install/config, client setup, dev commands.
- **`CLAUDE.md`** — architecture invariants, security requirements, and what an agent needs beyond the README. Must stay in sync with the code: a `CLAUDE.md`
  describing a layer that has since been renamed/moved (e.g. an `orchestrator/` section after the move to `cli/` + `main/`) is a finding.
- **`ROADMAP.md`** — planned features / deprecations (most repos).

## 12. Spec conformance: tool results, errors & metadata

These trace to the MCP spec ([TOOLS](sources.md) + [CHANGELOG](sources.md), 2025-11-25). They are how the thin `tools/` layer must shape what it returns.

- **Errors are Tool Execution Errors, not protocol errors.** The spec (clarified 2025-11-25) requires input-validation failures, API failures, and
  business-logic errors to be returned in the result envelope with `isError: true` so the model can self-correct — only malformed requests / unknown tools are
  JSON-RPC protocol errors. This is exactly why the house rule is **`errorResult` (return), never `throw`** at the tool boundary: a thrown zod/validation error
  would surface as a protocol error and also bypass the `withAuditLog` wrapper, which keys on the `isError` envelope. Confirm `errorResult` produces
  `{ content, isError: true }`.
- **Structured output is `outputSchema` + `structuredContent`, paired** (spec 2025-06-18). A tool that returns machine-shaped data SHOULD declare an
  `outputSchema` on registration and return the matching object in `structuredContent`, **and** (for backwards-compat) the same JSON serialized in a text
  content block. Today `jsonResult` returns only the text block; m365 already returns `structuredContent` but **no repo declares `outputSchema`**.
  Recommended-where-applicable, not mandatory: if a tool emits `structuredContent`, it should also declare the `outputSchema` so clients can validate; the
  cleanest path is to derive both from the same zod result schema (e.g. via `zod-to-json-schema`) so they cannot drift. A `jsonResult` that emits
  `structuredContent` without a declared schema is a (polish) finding.
- **`inputSchema` dialect.** The spec defaults schemas to JSON Schema 2020-12. zod-to-json-schema output is accepted by Claude; no action needed unless a client
  rejects the emitted dialect — then set an explicit `$schema`.
- **Optional metadata** (`icons`, `title`, `execution.taskSupport`) is available as of 2025-11-25 but not part of the house standard; adopt per-repo only if a
  client surfaces it. Async **Tasks** (`execution.taskSupport`) are experimental and irrelevant to these short-lived stdio tools — do not flag their absence.

## 13. OAuth security (auth-server repos)

Only the OAuth repos — **mcp-gmail** and **mcp-m365** — have an `auth-server/` and a token store; these items do not apply to the filesystem/subprocess repos.
They trace to the spec's [SEC](sources.md) and [AUTH](sources.md) pages. The §6 invariants still apply on top of these.

1. **No token passthrough.** The server uses tokens it obtained for _itself_ against the downstream API (Google / Microsoft Graph); it must never accept a
   caller- supplied token and forward it. (Spec: "MCP servers MUST NOT accept any tokens that were not explicitly issued for the MCP server.")
2. **Authorization-code flow with PKCE and a single-use `state`.** The loopback OAuth flow generates a cryptographically random `state`, stores it server-side
   until the callback, validates an **exact** match, and expires/deletes it after one use. Reject a callback with missing or mismatched `state`.
3. **Exact `redirect_uri` match** — loopback redirect compared by exact string, not prefix/wildcard.
4. **Least-privilege scopes.** Request only the scopes the shipped tools need; do not pre-request a broad catalog. Scope creep is a finding.
5. **SSRF discipline on any fetched URL.** Discovery/token/Graph endpoints are HTTPS and host-pinned to the known provider; never fetch an
   attacker-influenceable URL, and never follow redirects to internal/loopback/link-local addresses (`169.254.169.254`, `10/172.16/192.168`, `::1`).
6. **Secure token storage & redaction.** Refresh/access tokens are stored with restrictive file permissions outside any served root, never logged, and redacted
   from the audit log and from error messages (already required by §6.11). A 401 hints at the `*_auth_start` remedy without echoing the token.
7. **RFC 8707 `resource` parameter.** Per the 2025-11-25 spec (AUTH): MCP clients MUST include a `resource` parameter in authorization and token requests
   identifying the MCP server's canonical URI. The auth server SHOULD accept and propagate this value into the issued token's `aud` claim; the MCP server
   (acting as the resource server) MUST validate `aud` before accepting tokens — rejecting any token whose audience does not include its own canonical URI.
   Tokens without a bound audience are a token-passthrough risk (§6 invariant #1 applies).
8. **Client ID Metadata Documents (SHOULD).** Per the 2025-11-25 spec (AUTH): auth servers SHOULD declare `client_id_metadata_document_supported: true` in their
   OAuth Authorization Server Metadata and accept URL-formatted `client_id` values. When a URL-formatted `client_id` is received: fetch the JSON document at
   that URL over HTTPS, validate that the document's `client_id` field matches the URL exactly, and validate the authorization-request `redirect_uri` against
   the document's `redirect_uris`. Apply SSRF mitigations when fetching the metadata URL (invariant #5 applies). This is now the preferred client-registration
   path, superseding Dynamic Client Registration as the primary mechanism.
