# Audit Rubric

Line-by-line pass/fail items for auditing a workspace MCP against the [Workspace MCP Standard](workspace-mcp-standard.md). Run
[`../scripts/audit-mcp.ts`](../scripts/audit-mcp.ts) for the mechanical items (marked 🔧), then judge the rest by reading the code.

Severity: **FAIL** (security invariant breach or gate bypass — ship-stopper), **WARN** (layout / naming / tooling divergence), **POLISH**
(docs / consistency) — the shared ladder, defined in `knowledgeislands-engineering`'s
[`enforcement-framework.md`](../../knowledgeislands-engineering/references/enforcement-framework.md) §2.

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

- [ ] 🔧 WARN — `src/` has `config/`, `mcp-server/`, `tools/`, `main/`, `utils/`.
- [ ] 🔧 WARN — `cli/` present ⇒ has both `cli.ts` and `index.ts`.
- [ ] WARN — `tools/<group>/index.ts` is thin: zod-validate → call `main/` → envelope. No FS/network/git/logic in a tool handler.
- [ ] WARN — all real logic lives in `main/`, grouped by concern, each with `index.ts`.
- [ ] FAIL — `main/`/`utils/` have **no `console.*`** (return data; printing is CLI/stderr only). `api`-style layers assert no `console.log`
      in tests.
- [ ] WARN — `cli.ts` holds only arg-parsing + printing; the library it calls (`main/`) is the single source of truth, shared with `tools/`.
- [ ] WARN — no logic that exists _only_ in a tool handler or _only_ in `cli.ts`.

## Config injection

- [ ] FAIL — `loadConfig(env?)` is the only reader of env; **no module-level config singleton**; no top-level `process.env` access outside
      `config/index.ts`. (`grep -rn "process.env" src --include=*.ts | grep -v config/`)
- [ ] FAIL — every `main/`/`utils/` entry point takes config (or its slice) as the **first argument**; nothing reaches for ambient state.
- [ ] 🔧 WARN — `config/index.ts` exports `AccessLevel`, `ACCESS_LEVELS`, `ACCESS_LEVEL_RANK`, `AuditLogMode`, `loadConfig`.
- [ ] WARN — `Config` has `accessLevel`, `auditLogMode`, `auditLogPath`, `auditLogMaxBytes`, `auditLogKeep` + domain fields.
- [ ] WARN — tests build a literal `Config`; none call `loadConfig()` or mutate env.

## Tool naming & surface

- [ ] WARN — every registered tool matches `<app>_<resource>_<action>` with the repo's `<app>` prefix. (`grep -rn registerTool src/tools`)
- [ ] WARN — plural resource for collection ops, singular for single-item ops.
- [ ] POLISH — CLI verbs mirror the tool names/resources.
- [ ] POLISH — README tool catalog lists every registered tool with I/O shape.

## Access-level gate

- [ ] FAIL — `mcp-server` sets `server.registerTool = makeAccessGatedRegister(...)`; nothing registers a tool bypassing the proxy.
- [ ] FAIL — every tool sets `annotations` to a preset from `utils/annotations.ts` (no unannotated/partially-annotated tools).
- [ ] FAIL — destructive & non-idempotent tools default `dry_run: true`, mutate only when explicitly `false`.
- [ ] WARN — default `MCP_<APP>_ACCESS_LEVEL` is `read` (allowed exceptions: voicenotes-edit, kb-notion-mirror default `write` — do not
      flag).

## Audit logging

- [ ] 🔧 WARN — `utils/audit-log.ts` exports `AuditConfig`, `appendAuditEvent`, `withAuditLog`.
- [ ] FAIL — no secret (token/PAT/Bearer) is ever written to the audit log or surfaced in an error; only ids/arg-shapes/status.
- [ ] FAIL — tool boundary returns errors via `errorResult` (not `throw`) so the audit wrapper sees the `isError` envelope.

## Security invariants

- [ ] FAIL — every user path runs through the two-layer guard (lexical + realpath) before any `fs.*`/`execFile`/URL call, against the
      **full** root set.
- [ ] FAIL — cached/prior-result paths are re-validated against live config.
- [ ] FAIL — subprocess via `execFile`(argv), never a shell string; git carries `--no-optional-locks`.
- [ ] FAIL — subprocess calls are timeout- and `maxBuffer`-bounded; network git sets `GIT_TERMINAL_PROMPT=0`. No unbounded spawn.
- [ ] FAIL — directory walks are depth-limited and prune hidden dirs/`node_modules`.
- [ ] FAIL — identifier inputs (names, urls, ids, path segments) use tightened regex schemas rejecting leading `-`, `..`, separators — not
      bare `z.string()`.
- [ ] FAIL — risky multi-state options are enums, not booleans.
- [ ] WARN — all zod schemas `.strict()` with bounded numerics / length caps.
- [ ] WARN — batch tools aggregate per-item failures into `errors[]` (no crash).
- [ ] WARN — tools sanitize untrusted output before returning it (spec: "Servers MUST sanitize tool outputs"); e.g. m365's
      `html-sanitizer.ts`. Rate-limiting is a spec MUST but low-priority for local stdio servers — note, don't block.

## Spec conformance — tool results & metadata (standard §12)

- [ ] FAIL — tool boundary returns errors as `isError: true` envelopes via `errorResult`, never `throw` (spec 2025-11-25:
      validation/API/logic errors are Tool Execution Errors, not protocol errors; a throw also bypasses the audit wrapper). Same item as
      audit-logging below — verify once.
- [ ] 🔧 WARN — any tool returning `structuredContent` also declares a matching `outputSchema` at registration (paired, ideally derived from
      one zod schema via `zod-to-json-schema`). A `jsonResult` emitting `structuredContent` with no declared schema is a WARN finding.
- [ ] 🔧 WARN — any repo whose tools return structured JSON (via `jsonResult` or otherwise) but has zero `outputSchema` declarations anywhere
      in `src/tools/` is a WARN finding — structured-output adoption is a house SHOULD (spec 2025-11-25), not optional.
- [ ] WARN — tool registration order within each `tools/<group>/index.ts` is stable and deterministic (e.g. alphabetical by tool name or
      consistent CRUD order). Nondeterministic ordering hurts prompt-cache hit rates.
- [ ] POLISH — optional spec metadata (`icons`, `title`, `execution.taskSupport`) is per-repo opt-in, not required — do **not** flag its
      absence.

## OAuth security — auth-server repos only: mcp-gmail, mcp-m365 (standard §13)

Skip this whole section for the filesystem/subprocess repos.

- [ ] FAIL — no token passthrough: server never accepts/forwards a caller-supplied token; it uses tokens issued to itself for the downstream
      API.
- [ ] FAIL — auth-code flow uses PKCE and a cryptographically random, server-stored, single-use `state` validated by exact match at the
      callback.
- [ ] FAIL — `redirect_uri` validated by exact string match (loopback), not prefix/wildcard.
- [ ] FAIL — tokens stored with restrictive perms outside any served root; never logged; redacted from audit log + errors.
- [ ] WARN — least-privilege scopes (only what shipped tools need); SSRF discipline on fetched URLs (HTTPS, host-pinned, no redirect to
      internal/loopback IPs).
- [ ] WARN — _Remote resource-server role only — N/A to today's stdio repos; skip unless a server is deployed as a remote HTTP resource
      server._ RFC 8707 `resource` parameter bound into the token `aud`, and `aud` validated against the server's canonical URI before a
      token is accepted. (AUTH 2025-11-25; standard §13 item 7)
- [ ] WARN — _Authorization-server role only — N/A to today's stdio repos; skip unless a workspace component acts as an MCP authorization
      server._ Client ID Metadata Documents — AS declares `client_id_metadata_document_supported: true` and handles URL-formatted
      `client_id` (HTTPS fetch, exact `client_id` match, `redirect_uris` validation, SSRF mitigations). (AUTH 2025-11-25, SHOULD; standard
      §13 item 8)

> **Common toolchain → `knowledgeislands-engineering`.** The four sections below cover only the **MCP delta**. The generic toolchain — the
> `lint:*`/`deps:*` families, the `bun test` trap, `tsconfig`/`biome`/`vitest` shape with 100% coverage, the `.env*.example` template, the
> build/cli-chmod rule — is the common engineering layer; **run `engineering:audit` first** for it. A repo is fully clean only when both
> audits pass.

## Bun vs Node

- [ ] — the `bun test` trap, `process.loadEnvFile()` parity, and `NODE_ENV`-only-in-dev are the **common engineering layer** (run
      `engineering:audit`); not re-checked here. MCP consequence: production ignores `.env.*`, so config comes from the client's `env`
      block.

## package.json

- [ ] 🔧 WARN — `main:dist/mcp-server/index.js`; `bin.mcp-<name>` → `dist/mcp-server/index.js` (+ CLI/auth bin where applicable).
- [ ] 🔧 WARN — `exports` has `.`, `./config`, `./package.json` + one per reusable `main/<concern>`.
- [ ] 🔧 WARN — `server:mcp:dev` / `server:mcp:inspect` / `server:mcp:start` present (OAuth repos add `server:auth:*`).
- [ ] 🔧 WARN — where the repo has a `test:smoke` harness, `.github/workflows/ci.yml` runs `bun run test:smoke` after the common gate. The
      common CI shape (mise-action + `lint:check` / `lint:types` / `lint:md:check` / `test:coverage`) is `knowledgeislands-engineering`'s
      (`engineering:audit`); the smoke step is the MCP delta.
- [ ] — `type`/`packageManager`/`engines`/`files`, the `lint:*`/`deps:*`/`build`/`clean`/`test*`/`prepare` families, and the build/cli-chmod
      rule are the **common engineering layer** (`engineering:audit`); not re-checked here.

## tsconfig / vitest / biome

- [ ] 🔧 WARN — vitest coverage `exclude` covers the MCP wiring layers: `mcp-server/index.ts`, `tools/**/index.ts`, `utils/annotations.ts`,
      and any printing/pure-data module (`cli/cli.ts`, `auth-server/**`).
- [ ] — `tsconfig.json` / `tsconfig.build.json` / `biome.json` shape and the vitest 100% thresholds are the **common engineering layer**
      (`engineering:audit`); not re-checked here.

## .env.example & env

- [ ] 🔧 WARN — `.env.example` uses the `MCP_<APP>_*` prefix and carries the shared access-level + audit-log block.
- [ ] — the committed `.env*.example` template, gitignored real `.env.*`, and the `process.loadEnvFile` parity call are the **common
      engineering layer** (`engineering:audit`).

## Docs

- [ ] 🔧 WARN — `CONTRIBUTING.md` and `SECURITY.md` present; `CHANGELOG.md` present **and non-empty** (an empty stub is a finding) — the
      MCP-family root docs. `README`, `LICENSE`, `.gitignore`, `.editorconfig`, `.ki-config.toml`, and now `CLAUDE.md` (FAIL) + `ROADMAP.md`
      (warn) are `knowledgeislands-repo`'s layers, not re-checked here.
- [ ] WARN — `CLAUDE.md` is **not drifted**: every layer/path/concept it names still exists in the code (catch renamed/moved layers).
- [ ] POLISH — README install/config/client-setup steps are current.

## Longevity & staleness (mirrors `knowledgeislands-skills` rubric LONG-1)

A server installed and left running drifts from the world around it; the audit checks it can't rot silently.

- [ ] WARN — volatile external facts the code depends on (the MCP spec version/date it targets, upstream API/SDK versions, third-party URLs,
      model IDs) are not scattered hard-coded literals: each is either resolved at runtime or pinned in **one** refreshable place
      (`config/`, `CLAUDE.md`, or `package.json`) so a bump is a single known edit, not a hunt.
- [ ] POLISH — the repo's `CLAUDE.md`/`README.md` names the spec version it conforms to, so a reviewer can tell at a glance whether it
      predates a spec move.
- [ ] POLISH — this audit itself is run against a **current** standard: if a finding cites a spec MUST, the skill's Mode REFRESH +
      [`sources.md`](sources.md) confirm the spec hasn't moved since the standard's `last reviewed` date. Don't green-light a repo against a
      stale spec.

## Reporting

Produce a findings table grouped by severity, each row: `severity · file:line · what · fix`. Close with: (a) any intentional, documented
divergences you chose **not** to flag, and (b) a one-line verdict (compliant / minor drift / blockers).
