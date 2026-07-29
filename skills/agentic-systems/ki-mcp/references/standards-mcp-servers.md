# Workspace MCP Standard

The canonical shape shared by every stdio MCP server in the `knowledgeislands/` workspace: `mcp-git-audit`, `mcp-ki-kb-fs`, `mcp-gsuite`, `mcp-m365`, `mcp-claude-housekeeping`, `mcp-ki-kb-notion-mirror`. This is the reference the `ki-mcp` skill codifies and audits against. Where repos disagree, the majority shape is the standard; documented per-repo exceptions are noted inline.

## Applicability

The standard applies when a repository either declares `["knowledgeislands/ki-agentic-harness:ki-mcp"]` in `.ki-config.toml` or carries the structural marker `src/mcp-server/`. Neither signal means the standard is not applicable and the hosted audit reports one `NA`; either signal activates the complete audit. A declaration with missing structure remains an applicable, failing MCP repository, and MCP structure without a declaration remains applicable and is audited for the missing marker.

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

> **Spec vs house style.** Sections 1–11 are the in-house **workspace convention**; §12–13 trace directly to the official MCP specification (latest released: **2026-07-28**) tracked in [the source list](sources.md). When citing a rule, know which layer it comes from — never present a workspace preference as a protocol "MUST". Mode REFRESH in the [SKILL](../SKILL.md) re-anchors §12–13 (and the annotation semantics in §4) to the current spec.
>
> **Stateless core (2026-07-28).** The `2026-07-28` revision made the protocol stateless: it removed the `initialize`/`initialized` handshake and per-connection `Mcp-Session-Id`, added `server/discover` as a **server MUST**, replaced server-initiated sampling/elicitation/roots with the Multi Round-Trip Requests (MRTR) pattern, deprecated the Roots/Sampling/Logging capabilities, and reworked the Streamable HTTP transport (`subscriptions/listen`, `CacheableResult`, header routing, no SSE resumability). For our **stdio** servers almost all of this is transport- and SDK-absorbed — the concrete obligations that reach our code are framed in §12 (results/metadata) and §13 (auth); the rest is owned by the pinned `@modelcontextprotocol/sdk`.

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

Top-level `src/` folders are identical across all six repos: `config`, `main`, `mcp-server`, `tools`, `utils`, plus `cli` where a human-runnable command exists, and per-domain extras (`auth-server` in gmail/m365; `types.ts`).

### Layer responsibilities

- **`config/`** — the only place env is read. `loadConfig(env?) → Config`. No module-level config singleton; nothing reads env at import time.
- **`mcp-server/`** — wiring only: `loadConfig()` once, build the `AuditConfig` slice, `server.registerTool = makeAccessGatedRegister(...)`, then `registerXxxTools(server, config)` per group. Then connect a `StdioServerTransport` and log readiness on **stderr**.
- **`tools/`** — thin shells. Validate args with a `.strict()` zod schema, call a `main/` function (passing the needed config slice), map the result or thrown error to an MCP envelope via `jsonResult` / `errorResult`. `tools/**/index.ts` is coverage-excluded — **never put logic here**.
- **`main/`** — the real implementation, grouped by concern, mirroring the tool groups. Each concern dir has an `index.ts` re-export. Every entry point that touches FS/network/config takes its config (or the specific slice — `safeRoots`, `rootPath`, `NotionConfig`, …) as its **first argument**. No `console.*` here (return data; let the tool/CLI present it). Reusable concerns are surfaced via the package `exports` map.
- **`cli/`** (optional) — `cli.ts` is the `#!/usr/bin/env node` bin: it loads `.env` itself (Node parity with Bun), parses args, dispatches to the **same** `main/` functions the tools use, and does **all** human-readable printing. `cli/index.ts` re-exports the `main/` library surface. The CLI verb surface mirrors the MCP tool surface (same resource/verb structure). `cli.ts` is coverage-excluded; the `main/` functions it calls are not.
- **`utils/`** — cross-MCP helpers that take the **specific primitive** they need, not the whole `Config`. Common files kept in sync across siblings: `access-level.ts`, `annotations.ts`, `audit-log.ts`, and per-repo `paths`/ `results`/`errors`. Domain-specific utils (`git-exec.ts`, `mime.ts`, `html-sanitizer.ts`, `odata-helpers.ts`, `protected.ts`, `atomic-write.ts`) live here too but are not shared.

## 2. Config injection

- `loadConfig(env = process.env): Config` hydrates `process.env` from the package's `.env*` files via `process.loadEnvFile()` inside a try/catch (Bun has no such API and throws `TypeError`, which the catch swallows; Bun auto-loads `.env*` itself), then parses env into a plain, immutable `Config`. Resolve each file from the module's own location (`import.meta.url`), **not** `process.cwd()` — the compiled server is launched as `node /abs/path/dist/…` from an arbitrary cwd, so a `./`-relative path silently misses. Load highest precedence first — `.env.local`, then `.env.${NODE_ENV}` (when `NODE_ENV` is set), then `.env`; `loadEnvFile` never overwrites an already-set var, so the launcher's environment always wins over a file.
- **No module-level singleton.** Nothing reads `process.env` at import time outside `config/index.ts`. `main/` and `utils/` receive config as their first argument; tests build a literal `Config` and pass it (never mutate env, never call `loadConfig()` in a test — critical for repos that walk real user dirs).
- Universal exports from `config/index.ts`:
  - `type AccessLevel = 'read' | 'write' | 'destructive'`
  - `const ACCESS_LEVELS = ['read','write','destructive'] as const`
  - `const ACCESS_LEVEL_RANK = { read:1, write:2, destructive:3 }`
  - `type AuditLogMode = 'off' | 'writes' | 'all'`
  - `loadConfig`, plus parse helpers (`parseAccessLevel`, `parseAuditLogMode`, `parseNonNegativeInt`).
- `Config` always includes `accessLevel`, `auditLogMode`, `auditLogPath`, `auditLogMaxBytes` (default 10 MiB), `auditLogKeep` (default 5), plus domain fields (`safeRoots`, `rootPath`, `auth`, …).
- **Divergence:** gmail/m365 export `SERVER_NAME`/`SERVER_VERSION` from `config/index.ts`; others hard-code the name in `mcp-server` or `audit-log.ts`.

## 3. Tool naming

`<app>_<resource>_<action>`, snake_case.

| Repo                    | `<app>` prefix(es)                        |
| ----------------------- | ----------------------------------------- |
| mcp-git-audit           | `git`                                     |
| mcp-ki-kb-fs            | `kb`                                      |
| mcp-gsuite              | `gsuite`                                  |
| mcp-m365                | `m365`                                    |
| mcp-claude-housekeeping | `claude_code`, `claude_desktop`, `vscode` |
| mcp-ki-kb-notion-mirror | `notion_mirror`                           |

- **Plural** resource for collection ops (`git_repos_scan`, `gsuite_email_messages_search`, `kb_notes_list`).
- **Singular** for single-item ops (`kb_note_read`, `git_repo_commit`, `gsuite_email_message_get`).
- Metadata/lifecycle tools may drop the resource segment (`m365_about`, `gsuite_auth_start`).
- The CLI verb surface mirrors the tool names.

The house scheme is a deliberate **subset** of what the spec permits: per [TOOLS](sources.md), names SHOULD be 1–128 chars from `[A-Za-z0-9_.-]`. Snake*case `<app>*<resource>\_<action>` stays well inside that, so a conformant house name is always a conformant spec name — the constraint to enforce is the house scheme, not the looser spec one.

## 4. Access-level gate (annotation-driven)

`utils/access-level.ts` exports `makeAccessGatedRegister(server, accessLevel, audit)`. At registration it derives a level from each tool's `annotations` and registers the tool only if that level ≤ `config.accessLevel`:

- `readOnlyHint: true` → **read**
- `destructiveHint: true` → **destructive**
- explicit `readOnlyHint: false` AND `destructiveHint: false` → **write**
- anything else → **destructive** (fail-safe)

These four hints (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) and their semantics are defined by the spec ([TOOLS](sources.md)) and have been stable since revision 2025-03-26 (confirmed current through 2026-07-28): `destructiveHint`/`idempotentHint` are only meaningful when `readOnlyHint` is false. (These are **Tools** annotations; the `2026-07-28` deprecation of the Roots/Sampling/Logging capabilities, SEP-2577, does not touch them.) The gate reads them as a risk vocabulary, exactly as the spec intends — the presets in `utils/annotations.ts` set `idempotentHint` (the `_IDEMPOTENT` variants) and `openWorldHint` (the `_REMOTE` variants) too, even though the gate keys only on read/destructive. The spec also warns clients to treat a server's annotations as **untrusted** — which is why the gate is the operator-controlled `MCP_<APP>_ACCESS_LEVEL`, not anything self-asserted at call time.

Levels nest `read ⊂ write ⊂ destructive`; env `MCP_<APP>_ACCESS_LEVEL` (default `read`). Every tool sets `annotations` to a preset from `utils/annotations.ts`: `READ_ONLY`, `WRITE`, `WRITE_IDEMPOTENT`, `WRITE_IDEMPOTENT_REMOTE`, `DESTRUCTIVE`, `DESTRUCTIVE_REMOTE`, `DESTRUCTIVE_ONESHOT`, plus `_REMOTE`/read variants per repo. `DESTRUCTIVE_ONESHOT` = effect depends on current FS/index state. Never bypass the register proxy; never derive the level from the tool name.

**Divergence:** default access level is `read` everywhere except `mcp-ki-kb-notion-mirror`, which defaults to `write` (it ships no read-only tools) — intentional, do not flag.

## 5. Audit logging

`utils/audit-log.ts` exports the `AuditConfig` slice (`{ mode, path, maxBytes, keep }`), an `AuditEvent` shape, `appendAuditEvent(audit, event)`, and `withAuditLog(audit, name, level, cb)`. `mcp-server` wires it through the gated register. Append-only JSONL with size-based rotation (`maxBytes` × `keep`). **Secrets never appear in the log** — tokens/PATs/Bearer values are redacted; only ids, arg shapes, and status/scope/expiry are recorded. The tool boundary returns errors via `errorResult` (not `throw`) so the audit wrapper sees the `isError` envelope.

## 6. Security invariants

1. **Path containment is two-layer.** Every user path goes through a lexical normalize (rejects `..`, Windows separators) **and** a realpath check of the deepest existing ancestor against the allowed root(s) (catches symlink escape), before any `fs.*` / `execFile` / URL call. Validate against the **full** set of roots, threaded in as the first arg of the `main/` function.
2. **Cached results are re-validated.** A tool that consumes a prior tool's output (e.g. a scan envelope) re-checks every path against the live config before acting — a cached result cannot widen the security boundary.
3. **Shell-out uses `execFile` with an argv array, never a shell string.** For git: `execFile('git', ['--no-optional-locks', '-C', repo, ...args], opts)` — `--no-optional-locks` is mandatory.
4. **Subprocess calls are time- and memory-bounded.** Local commands use a short timeout (~8s), network commands a longer one (~60s); both capped by `maxBuffer`. Network git sets `GIT_TERMINAL_PROMPT=0` so auth prompts fail fast instead of hanging. Never spawn an unbounded subprocess.
5. **Directory walks are depth-limited** and prune hidden dirs + `node_modules`.
6. **Identifier inputs that become argv/path tokens have tightened regex schemas** (remote/branch names, URLs, uuids, workspace/project/session ids): reject leading `-` (option injection), `..`, and path separators. Bare `z.string().min(1)` is not acceptable.
7. **Destructive / non-idempotent tools expose `dry_run`, default `true`**, and only mutate when explicitly `false`. Pass native `--dry-run` through where git offers it; approximate otherwise.
8. **Risky multi-state flags are enums, not booleans** (e.g. force-push: `force_mode: 'none' | 'with_lease' | 'force'`).
9. **All zod schemas are `.strict()` with bounded numerics** (`.int().max(N)`, array/string length caps).
10. **Per-item failures don't crash a batch** — aggregate into an `errors[]`.
11. **Errors and audit logs never leak secrets or absolute paths** — surface caller input relative to the root; 401s hint at the `*_auth_start` remedy.

## 7. Bun vs Node

The Bun-install / Node-run split, the **`bun test` trap**, the `process.loadEnvFile()` parity call, and `NODE_ENV`-only-in-dev are the **common engineering standard**, owned by `ki-engineering`. Run `ki repo audit --skill ki-engineering --repo <repo>` for this layer—it is not re-checked here. The MCP-specific consequence: `ki:server:mcp:dev` / `:inspect` set `NODE_ENV=development`, so production ignores `.env.*` and config must come from the client's `env` block.

## 8. package.json

`type` / `packageManager` / `engines` / `files`, aggregate/scoped audit wiring, lifecycle scripts, and the `build`/cli-chmod rule are the **common engineering standard** (`ki-engineering`)—copy them from a healthy sibling and let its hosted audit check them; they are not re-checked here. This section is the **MCP delta** on top:

- **`main` / `bin`** — `"main": "dist/mcp-server/index.js"`; `"bin": { "mcp-<name>": "dist/mcp-server/index.js" }`, plus a second entry for a CLI (`"mcp-<name>-<verb>": "dist/cli/cli.js"`) or auth server (`"mcp-<name>-auth"`) where present.
- **`exports`** — always `"."` (→ `dist/mcp-server`), `"./config"`, and `"./package.json"`; plus one entry per reusable `main/<concern>`.
- **`ki:server:mcp:*` scripts** — `ki:server:mcp:dev` / `ki:server:mcp:inspect` (both `NODE_ENV=development bun …`) / `ki:server:mcp:start` (`bun run build && node dist/mcp-server/index.js`); OAuth repos with an `src/auth-server/` add the `ki:server:auth:*` pair (`ki:server:auth:dev` / `ki:server:auth:start`), and a repo with a CLI/smoke harness adds `ki:test:smoke`.
- **`ki:test:record` / `ki:test:replay` (record/replay harness).** A repo with mcporter integration recordings ships the pair together — `ki:test:record` captures a live run into `fixtures/recordings/`, `ki:test:replay` runs against the committed fixture. Defining one without the other is drift (checked by the hosted MCP rubric).
- **CI — the smoke delta.** The common CI shape (`jdx/mise-action` + direct `ki repo audit` + runner-neutral `bun run test`) is `ki-engineering`'s. An MCP repo with a smoke harness also includes `bun run ki:test:smoke` in `.github/workflows/ci.yml` — the MCP delta checked by the hosted MCP rubric. The hosted audit verifies this workflow wiring and reports the explicit smoke command; it does not launch repository scripts.
- **Typed client — `ki:generate:client` script.** Every repo ships a `ki:generate:client` script that emits a typed TypeScript client via `mcporter emit-ts <server-name> --mode client --out src/generated/client.ts --types-out src/generated/types.d.ts`. The emitted `src/generated/client.ts` is committed (it is the deliverable, not build output); it is excluded from vitest coverage. Run `bun run ki:generate:client` explicitly when refreshing it: the script is application code, not a host-owned `ki repo conform` repair. The `<server-name>` must match a registered mcporter instance (`mcporter list`).

## 9. tsconfig / vitest / biome

`tsconfig.json` (the shared compiled-TS base), `tsconfig.build.json`, and `biome.json` are the **common engineering standard** (`ki-engineering` §4–§7); when the repository selects Vitest by carrying `vitest.config.*`, that common layer also requires 100% coverage on all four metrics. Only under that selected profile does the **MCP delta** add its coverage `exclude` list — beyond the common `src/**/*.test.ts`, an MCP excludes its pure-wiring layers: `src/mcp-server/index.ts`, `src/tools/**/index.ts`, `src/utils/annotations.ts`, plus `src/auth-server/**`, `src/cli/cli.ts`, and pure-data modules (`src/utils/notion-args.ts`) where present.

## 10. .env.example & env vars

The committed `.env*.example` template (real `.env.*` gitignored) and the `process.loadEnvFile` parity call are the **common engineering standard** (`ki-engineering` §8). The **MCP delta** is the variable prefix + shared block:

- Prefix `MCP_<SCREAMING_SNAKE_APPNAME>_*`. Shared block across all repos: `MCP_<APP>_ACCESS_LEVEL` (default `read`), `MCP_<APP>_AUDIT_LOG` (default `writes`), `MCP_<APP>_AUDIT_LOG_PATH` (default `~/.local/state/mcp-<name>/audit.jsonl`), `MCP_<APP>_AUDIT_LOG_MAX_BYTES` (10485760), `MCP_<APP>_AUDIT_LOG_KEEP` (5), plus domain vars (`*_SAFE_ROOTS`, `*_ROOT`, OAuth client id/secret, PAT, …).

## 11. Docs

**Presence** of `README.md`, `CLAUDE.md`, and `ROADMAP.md` is `ki-repo`'s layer (the first two universal/FAIL, `ROADMAP.md` a warn); this section owns their **MCP content contract**, plus the three MCP-family root docs whose presence is the **MCP delta**:

- **`README.md`** — user-facing: tool catalog (purpose + I/O shape per tool), install/config, client setup, dev commands.
- **`CLAUDE.md`** — architecture invariants, security requirements, and what an agent needs beyond the README. Must stay in sync with the code: a `CLAUDE.md` describing a layer that has since been renamed/moved (e.g. an `orchestrator/` section after the move to `cli/` + `main/`) is a finding.
- **`ROADMAP.md`** — planned features / deprecations.
- **`CONTRIBUTING.md`** — setup, dev loop, conventions (code / commits / testing), pre-PR checklist. _(MCP delta: presence required.)_
- **`SECURITY.md`** — vulnerability reporting, scope (in / out), supported versions (OAuth repos add a token-storage note). _(MCP delta: presence required.)_
- **`CHANGELOG.md`** — release notes; present **and non-empty** (an empty stub at 1.0.0 is a finding). _(MCP delta.)_

## 12. Spec conformance: tool results, errors & metadata

These trace to the MCP spec ([TOOLS](sources.md) + [CHANGELOG](sources.md), 2026-07-28). They are how the thin `tools/` layer must shape what it returns. The `2026-07-28` **stateless core** (no `initialize` handshake, no `Mcp-Session-Id`, `subscriptions/listen`, `CacheableResult`, SSE-resumability removal, error-code renumbering) is owned by the transport and the pinned `@modelcontextprotocol/sdk` — for stdio servers there is nothing to hand-write. The three things that still reach our code are the result envelope (below), the `server/discover` requirement, and the deprecated-capability confirmation.

- **Errors are Tool Execution Errors, not protocol errors.** The spec requires input-validation failures, API failures, and business-logic errors to be returned in the result envelope with `isError: true` so the model can self-correct — only malformed requests / unknown tools are JSON-RPC protocol errors. This is exactly why the house rule is **`errorResult` (return), never `throw`** at the tool boundary: a thrown zod/validation error would surface as a protocol error and also bypass the `withAuditLog` wrapper, which keys on the `isError` envelope. Confirm `errorResult` produces `{ content, isError: true }`. (2026-07-28 renumbered several protocol error codes — e.g. resource-not-found `-32002` → `-32602`, and reserved `-32020..-32099` for the MCP spec — and made `resultType` a **required** result field. Both are SDK-produced: the SDK stamps `resultType: "complete"` on our envelopes, and our servers never return `"input_required"` because they do no MRTR / server-initiated input. When bumping the SDK, confirm the `jsonResult` / `errorResult` return shapes still satisfy the SDK's `CallToolResult` type.)
- **Structured output is `outputSchema` + `structuredContent`, paired** (spec 2026-07-28). A tool that returns machine-shaped data **SHOULD** declare an `outputSchema` (JSON Schema 2020-12) on registration and return the matching value in `structuredContent` — the spec now allows `structuredContent` to be **any** JSON value (object, array, string, number, boolean, or null), not only an object — **and** (for backwards-compat with older clients) the same JSON serialized in a text content block. Where an `outputSchema` is declared the spec makes conformance a server **MUST** ("Servers MUST provide structured results that conform to this schema"); declaring one at all remains the house **SHOULD**. The cleanest path is to derive both from the same zod result schema via `zod-to-json-schema` so schema and output cannot drift. A tool that returns `structuredContent` without a declared `outputSchema`, or that uses `jsonResult` (returning JSON) without having adopted `structuredContent` at all, is a **WARN** finding. Plain text-only results need neither.
- **Deterministic `tools/list` ordering.** Tools **SHOULD** be registered in a stable, predictable order within each tool-group file (e.g. alphabetical by tool name, or by natural CRUD order). Deterministic ordering improves prompt-cache hit rates for clients that hash the tool list. Randomised or nondeterministic registration order is a **WARN** finding. (Now an explicit spec **SHOULD** as of 2026-07-28: "Servers SHOULD return tools in a deterministic order … Deterministic ordering enables clients to reliably cache the tool list.")
- **`inputSchema` / `outputSchema` dialect.** The spec defaults schemas to JSON Schema 2020-12 (any tool may opt into another dialect via an explicit `$schema`). 2026-07-28 (SEP-2106) **loosened** both schemas to allow **any** JSON Schema 2020-12 keywords — the earlier keyword allowlist is gone — while adding `$ref` resolution requirements and composition-keyword resource bounds that clients apply during validation. zod-to-json-schema output stays well inside this; no action needed unless a client rejects the emitted dialect — then set an explicit `$schema`. Also new: an `inputSchema` property may carry an `x-mcp-header` annotation to mirror it into an HTTP header — a Streamable-HTTP-only feature that stdio clients ignore, so it is irrelevant here.
- **`server/discover` is a server MUST (2026-07-28).** Every server MUST implement the `server/discover` RPC advertising its supported protocol versions, capabilities, and identity; on stdio a client MAY use it as a backward-compatibility probe. This is provided by the `@modelcontextprotocol/sdk` server implementation — **do not hand-roll it**. The concrete audit action is to confirm the repo's pinned SDK version implements `server/discover` for the stdio transport (i.e. is on a `2026-07-28`-capable release); a pre-`2026-07-28` SDK is a migration finding, not a code-authoring task.
- **Deprecated capabilities — we use none (2026-07-28).** SEP-2577 moved **Roots, Sampling, and Logging** to the Deprecated state (12-month window; earliest removal is the first revision on or after 2027-07-28). Confirm our servers use none of them: they log to **stderr** plus the append-only audit-log files (§5) — which is exactly the spec's recommended stdio migration for Logging — and never declare the MCP `logging` capability, never call Sampling, and never expose Roots. Nothing to migrate; record the confirmation.
- **Optional metadata** (`icons`, `title`) is available but not part of the house standard; adopt per-repo only if a client surfaces it. Async **Tasks** are now an official **extension** (`io.modelcontextprotocol/tasks`) rather than an experimental core field, and remain irrelevant to these short-lived stdio tools — do not flag their absence.

## 13. OAuth security (auth-server repos)

Only the OAuth repos — **mcp-gsuite** and **mcp-m365** — have an `auth-server/` and a token store; these items do not apply to the filesystem/subprocess repos. They trace to the spec's [SEC](sources.md) and [AUTH](sources.md) pages (2026-07-28). The §6 invariants still apply on top of these.

The 2026-07-28 Authorization page is explicit that its framework is a **transport-level, HTTP-only** concern and does **not** govern stdio servers: _"Implementations using an STDIO transport SHOULD NOT follow this specification, and instead retrieve credentials from the environment."_ Every workspace server is a stdio server that obtains its **own** tokens as an OAuth **client** of a third-party IdP (Google / Microsoft) — none is an MCP resource server or MCP authorization server. So the MCP-framework roles (items 7–8, and the 2026-07-28 auth changes recorded at the end of this section) remain N/A to our repos; the live obligations are items 1–6, which are generic OAuth-client hygiene the framework merely restates.

**Two roles, only one of them ours — items 1–6 apply, 7–8 don't (yet).** Items 1–6 govern these repos' actual role: an OAuth **client** of a third-party IdP (Google / Microsoft) running the loopback consent flow and holding the resulting downstream tokens. Items 7–8 come from the **MCP authorization framework**, which governs a server that is itself a **remote HTTP OAuth resource server** (and the authorization server fronting it). **No current workspace server occupies that role** — all are stdio servers that obtain their own tokens — so 7–8 are **N/A today**; they go live only if a server is deployed remotely. When citing 7–8, say which role you mean.

1. **No token passthrough.** The server uses tokens it obtained for _itself_ against the downstream API (Google / Microsoft Graph); it must never accept a caller- supplied token and forward it. (Spec: "MCP servers MUST NOT accept any tokens that were not explicitly issued for the MCP server.")
2. **Authorization-code flow with PKCE and a single-use `state`.** The loopback OAuth flow generates a cryptographically random `state`, stores it server-side until the callback, validates an **exact** match, and expires/deletes it after one use. Reject a callback with missing or mismatched `state`.
3. **Exact `redirect_uri` match** — loopback redirect compared by exact string, not prefix/wildcard.
4. **Least-privilege scopes.** Request only the scopes the shipped tools need; do not pre-request a broad catalog. Scope creep is a finding.
5. **SSRF discipline on any fetched URL.** Discovery/token/Graph endpoints are HTTPS and host-pinned to the known provider; never fetch an attacker-influenceable URL, and never follow redirects to internal/loopback/link-local addresses (`169.254.169.254`, `10/172.16/192.168`, `::1`).
6. **Secure token storage & redaction.** Refresh/access tokens are stored with restrictive file permissions outside any served root, never logged, and redacted from the audit log and from error messages (already required by §6.11). A 401 hints at the `*_auth_start` remedy without echoing the token.
7. **RFC 8707 `resource` parameter + audience validation — _remote resource-server role only; N/A to current repos_.** Per the 2026-07-28 spec (AUTH): when an MCP **client** obtains a token to call a **remote** MCP server, it MUST include a `resource` parameter naming that server's canonical URI; the authorization server SHOULD bind it into the token's `aud`; and the server, **acting as an OAuth resource server**, MUST validate `aud` before accepting the token — rejecting any whose audience isn't itself (a token-passthrough defense, item #1). This governs the MCP authorization framework, not a third-party OAuth-client flow: the current stdio servers are not resource servers, and their IdPs (Google / Microsoft v2) scope tokens by **scope**, not RFC 8707 `resource` — so there is nothing to implement here today. The live protection for our servers is item #1 (no token passthrough).
8. **Client ID Metadata Documents (SHOULD) — _authorization-server role only; N/A to current repos_.** Per the 2026-07-28 spec (AUTH): an **authorization server** SHOULD declare CIMD support and accept URL-formatted `client_id` values — fetch the JSON document at that URL over HTTPS, validate its `client_id` matches the URL exactly, validate the request's `redirect_uri` against its `redirect_uris`, with SSRF mitigations on the fetch (item #5). As of 2026-07-28 CIMD is the **preferred** registration path and OAuth 2.0 **Dynamic Client Registration (RFC 7591) is formally Deprecated** (12-month window; earliest removal the first revision on or after 2027-07-28), retained only for backwards compatibility. Our servers are OAuth **clients** that use **pre-registered** client credentials against Google / Microsoft — they are not authorization servers and do no dynamic registration — so neither CIMD nor the DCR deprecation applies; they go live only for a workspace component that itself acts as an MCP authorization server.

**2026-07-28 authorization changes — applicability to our roles.** Four AUTH changes landed in the released revision. Each is scoped to an MCP-framework role our stdio servers do not occupy, so none changes an obligation today; recorded here so a future remote deployment inherits the assessment rather than re-deriving it:

- **RFC 9207 `iss` (SEP-2468).** In the MCP framework, an authorization server **SHOULD** return `iss` on the authorization response and an MCP **client** **MUST** validate a present `iss` against the recorded issuer before redeeming the code (a mix-up defense); the spec notes a future revision will upgrade the AS side SHOULD→MUST. Our gsuite/m365 loopback flow is an OAuth-client flow **outside** this framework, so the MUST does not bind it — but RFC 9207 is generic mix-up protection that _any_ authorization-code client can adopt. **Assess** whether Google / Microsoft advertise `iss` (`authorization_response_iss_parameter_supported`) and, if so, validate the returned `iss` against the expected issuer in the callback as cheap defense-in-depth alongside the existing single-use `state` check (item #2). Tracked as a watch-item, not yet a required house rule.
- **`application_type` in Dynamic Client Registration (SEP-837)** and **credentials keyed by issuer (SEP-2352)** — both govern **dynamic** client registration (specifying `application_type` at `/register`; keying persisted DCR credentials by issuer, never reusing them across authorization servers, re-registering when the AS changes). Our servers pre-register static client credentials against a single fixed IdP, so they perform no DCR and the credentials are inherently bound to one issuer. **N/A.**
- **DCR deprecation → CIMD** — recorded in item #8 above. Reinforces the existing pre-registration choice; no action.
