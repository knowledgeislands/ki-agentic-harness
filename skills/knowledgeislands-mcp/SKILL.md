---
name: knowledgeislands-mcp
description: >
  Codify and audit Knowledge Islands MCP servers against the canonical "workspace MCP" standard. Use when scaffolding a new MCP server,
  bringing an existing one up to standard, or reviewing one for compliance: project layout, config injection (no module-level singleton),
  the `<app>_<resource>_<action>` tool-naming scheme, the annotation-driven access-level gate, audit logging, the security invariants, the
  common build/lint/test toolchain (now `knowledgeislands-engineering`'s, which this builds on). Also refreshes the standard itself against
  the latest published MCP specification. Triggers: "audit this MCP", "does this MCP follow our standards", "scaffold a new MCP", "bring
  this MCP up to standard", "review the MCP layout / tool surface / package.json", "refresh the MCP standard", "is our MCP standard up to
  date". Operates on the sibling `mcp-*` repos under `knowledgeislands/`. Audits MCP **server code** — not a repo's GitHub configuration,
  nor a skill's prose.
argument-hint: 'audit <repo> | conform <repo> | init <repo> | refresh'
---

# Knowledge Islands MCP standards

You are helping audit, conform, or scaffold a **workspace MCP server** — one of the stdio MCP servers in the `knowledgeislands/` workspace
(`mcp-git-audit`, `mcp-kb-fs`, `mcp-gmail`, `mcp-m365`, `mcp-claude-housekeeping`, `mcp-voicenotes-edit`, `mcp-kb-notion-mirror`). They all
share one canonical shape, so a new one should be scaffolded to it and an existing one should be auditable against it. This skill carries
that standard and the audit procedure.

This skill audits the **server code** — `src/` layout, config injection, tool surface, security invariants, tooling. A repo's GitHub
configuration and standard files, and a `SKILL.md`'s prose, are out of scope (other skills own those). How the skills divide the work is
documented once in the arcadia-agentic-harness `README.md`.

The full, quotable standard lives in [Workspace MCP Standard](references/workspace-mcp-standard.md); the line-by-line pass/fail items live
in [Audit Rubric](references/audit-rubric.md). A mechanical structural checker is [`scripts/audit-mcp.ts`](scripts/audit-mcp.ts). Read those
when you need detail; this file is the operating procedure.

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

1. **Config is injected, never ambient.** `loadConfig()` is called exactly once (in `mcp-server/index.ts`, or by a `cli.ts` / a script). No
   other module reads `process.env` at import time; every `main/` and `utils/` function takes the config (or the specific slice it needs) as
   its **first argument**.
2. **Layers have one job each.** `tools/` validates + envelopes and nothing more; `main/` holds the logic and is runnable without the MCP
   server; `cli/` only prints (the library it calls never writes to stdout); `mcp-server/` only wires.
3. **The access-level gate is annotation-driven, not name-driven.** A tool registers only if the level derived from its `annotations` is ≤
   `config.accessLevel`. See the gate rules below.

## Surface-area model: main vs tools vs cli

Decide _where code lives_ by who needs to call it, not by what it does:

- **`main/`** — the implementation, callable from anywhere. _May contain:_ all real logic, FS / network / git, returns plain data. _Must
  not:_ print to stdout/stderr or read env directly.
- **`tools/`** — exposes `main/` over MCP. _May contain:_ zod schema, arg validation, `jsonResult` / `errorResult`. _Must not:_ hold logic
  or be the only caller of `main/`.
- **`cli/`** — exposes `main/` to a human at a terminal. _May contain:_ arg parsing and ALL human-readable printing. _Must not:_ hold logic
  or be the only caller of `main/`.

`main/` is the single source of truth; `tools/` and `cli/` are two thin shells over the **same** functions. If logic exists only inside a
tool handler or only inside the CLI, that is a finding — push it down into `main/`. Group `main/` by **concern**, mirroring the tool groups
(`main/repo-audit/`, `main/notes/`, …), each with an `index.ts` re-export, and surface the reusable ones through the package `exports` map
so the code is consumable as a library.

## Tool naming

`<app>_<resource>_<action>`, snake_case. `<app>` is fixed per repo (`git`, `kb`, `gmail`, `m365`, `claude_code`/`claude_desktop`/`vscode`,
`voicenotes`, `notion_mirror`). **Plural** resource for collection ops (`git_repos_scan`, `gmail_messages_search`); **singular** for
single-item ops (`kb_note_read`, `git_repo_commit`). Metadata/lifecycle tools may drop the resource segment (`gmail_auth_start`,
`m365_about`). The CLI verb surface mirrors these names.

## Access-level gate

`makeAccessGatedRegister(server, accessLevel, audit)` in `utils/access-level.ts` derives a level from each tool's `annotations` and
registers it only when that level ≤ `config.accessLevel` (env `MCP_<APP>_ACCESS_LEVEL`, default `read`; levels nest
`read ⊂ write ⊂ destructive`):

- `readOnlyHint: true` → **read**
- `destructiveHint: true` → **destructive**
- explicit `readOnlyHint: false` AND `destructiveHint: false` → **write**
- anything else (unannotated / partial) → **destructive** (fail-safe)

Every tool MUST set `annotations` to a preset from `utils/annotations.ts` (`READ_ONLY`, `WRITE`, `WRITE_IDEMPOTENT`, `DESTRUCTIVE`,
`DESTRUCTIVE_ONESHOT`, and the `_REMOTE` variants). `DESTRUCTIVE_ONESHOT` is for tools whose end state depends on current FS/index state
(running twice ≠ same result). Never bypass the register proxy. The default `read` gate hides every mutation until the operator opts in.

## Operating modes

Every governance skill carries **AUDIT · CONFORM · REFRESH**; this one adds **INIT** (scaffold a new server). Infer the mode from the
request; ask if unclear. (Modes are named and alphabetical.)

### Mode AUDIT — check a repo against the standard

1. **Identify the target.** Confirm the repo path (default: the cwd repo). Note its `<app>` prefix and which tool groups it ships.
2. **Run both mechanical checkers — the common layer first.** `bun knowledgeislands-engineering/scripts/audit-engineering.ts <repo-path>`
   covers the shared toolchain (package.json metadata + the `lint:*`/`deps:*` families, the `bun test` trap, tsconfig/biome/vitest with 100%
   coverage, `.env`, the build/cli-chmod rule). Then `bun <skill>/scripts/audit-mcp.ts <repo-path>` (or `node` after build) covers the **MCP
   delta**: presence/shape of `src/` layers, `main`/`bin`/ `exports`, the shared `utils/` helpers, tool names, and the MCP
   coverage-excludes. Capture both — the repo is clean only when both pass.
3. **Do the semantic pass the script can't** — walk [Audit Rubric](references/audit-rubric.md) and judge:
   - **Config injection**: grep for top-level `process.env` reads outside `config/index.ts`; confirm `main/`/`utils/` take config as the
     first arg.
   - **Layer purity**: logic that lives only in a `tools/*` handler or in `cli.ts` (should be in `main/`); `console.*` in `main/`
     (CLI/stderr only).
   - **Tool naming**: `grep -rn registerTool src/tools` — every name matches `<app>_<resource>_<action>` with correct plurality.
   - **Access gate**: every tool sets a real `annotations` preset; nothing bypasses `makeAccessGatedRegister`; destructive tools default
     `dry_run: true`.
   - **Security invariants** (see the checklist): path containment, `execFile`/argv not shell strings, bounded + `--no-optional-locks` git,
     depth-limited walks, tightened identifier regexes (not bare `z.string()`), `.strict()` zod with bounded numerics, no secrets in audit
     logs / error messages.
   - **Docs**: `CLAUDE.md` + `README.md` present and _not drifted_ from the code (notion-mirror's `CLAUDE.md` describing `orchestrator/`
     after the move to `cli/` + `main/` is the cautionary example).
   - **Longevity**: volatile external facts (targeted spec version/date, upstream API versions, third-party URLs, model IDs) aren't
     scattered hard-coded literals — each resolves at runtime or is pinned in one refreshable place, so the server can't rot silently once
     installed. Mirrors the skills rubric's longevity check; see the checklist's _Longevity & staleness_ section.
4. **Report.** Group findings by severity (see checklist): **blocker** (security invariant or gate bypass), **standard**
   (layout/naming/tooling divergence), **polish** (docs/consistency). Cite `file:line`. Give the fix for each, and call out _intentional_
   per-repo divergences (e.g. `voicenotes-edit` defaulting to `write`) so they are not re-flagged.

### Mode CONFORM — bring an existing MCP repo up to standard

1. Run **AUDIT** first, so you change against a known gap list.
2. Fix the gaps in place: restore the `src/` layer boundaries (schema+envelope in `tools/`, logic in `main/` config-first, printing in
   `cli/`, wiring in `mcp-server/`), the shared `utils/` helpers, and the MCP `package.json` delta (`main` / `bin` / `exports` /
   `server:mcp:*`) — **copy from the closest healthy sibling** rather than invent. For the common toolchain block (`tsconfig*` / `vitest` /
   `biome` / the script families), run `knowledgeislands-engineering`'s CONFORM.
3. Re-run both checkers + tests; `bun run test` (NOT `bun test`), `bun run lint:check`, `bun run lint:types` must pass with 100% coverage.

### Mode INIT — scaffold a new MCP server

1. **Copy from the closest healthy sibling** over inventing: take the shared `utils/` helpers, `tsconfig*.json`, `vitest.config.ts`,
   `biome.json`, and the package.json script block verbatim, then adapt the `<app>` prefix, env-var prefix (`MCP_<APP>_*`), `SERVER_NAME`,
   and `exports` map.
2. Keep the layer boundaries from day one: schema+envelope in `tools/`, logic in `main/` (config slice first), printing only in `cli/`,
   wiring only in `mcp-server/`. Add tools with explicit `annotations` presets.
3. Run the checker + tests; `bun run test` (NOT `bun test`), `bun run lint:check`, `bun run lint:types` must pass with 100% coverage.

### Mode REFRESH — re-anchor the standard to the latest MCP spec

The MCP specification is versioned by date and moves; the in-house standard is built **on top of** it. This mode keeps the standard honest —
it pulls the current gold standard and diffs it against what this skill codifies, so the audit never green-lights a repo against a spec that
has moved on. Run it periodically (monthly, with the other skills), or when someone asks "is our MCP standard up to date".

1. **Read [the source list](references/sources.md)** — the tracked authoritative (official MCP spec) + community + in-house sources, each
   with a `last reviewed` date and what it governs. The Authoritative table names the **latest released** spec version; everything else is
   house style layered on top.
2. **Confirm the current spec version**, then re-fetch each source (WebFetch/WebSearch) and **diff against the
   [standard](references/workspace-mcp-standard.md) + [rubric](references/audit-rubric.md) +
   [`scripts/audit-mcp.ts`](scripts/audit-mcp.ts)**. Look for: new/changed tool fields (`outputSchema`, `structuredContent`, `icons`,
   `execution.taskSupport`), changed annotation semantics or defaults, the `isError` vs protocol-error rules, tool-name charset/length
   bounds, and new security mitigations (esp. the OAuth page — it bears on the gmail / m365 auth-servers).
3. **Separate spec-driven from house style.** A change is only a new _requirement_ if it traces to the Authoritative table; otherwise it is
   opinion and must be labelled as such so a protocol "MUST" is never confused with a workspace preference. Where the spec adds something
   optional (e.g. structured output), codify it as recommended-where-applicable, not mandatory.
4. **Scan our own repos** for emergent patterns the standard hasn't captured yet (e.g. m365 already returning `structuredContent`) — promote
   the good ones; flag any that contradict the standard.
5. **Propose a diff** to the standard, checklist, and (where a check became mechanical) `audit-mcp.ts`. Confirm before writing.
6. **Update [the source list](references/sources.md)** — bump each `last reviewed` date, add any new source, retire dead ones, and refresh
   the `## Last review` block (pinned revision, confirmations, open watch-items). What changed goes in the commit, not a changelog. This
   step is mandatory: the source list is the skill's memory of where the standard comes from.

## Bun vs Node — the common layer

The Bun-install / Node-run split, the **`bun test` trap**, and the `process.loadEnvFile()` parity call are the **common engineering
standard** — `knowledgeislands-engineering` owns and checks them (run `engineering:audit`). The one MCP-relevant consequence to keep in
mind: `NODE_ENV=development` is set only by the `server:mcp:dev` / `:inspect` scripts, so in production `.env.*` is ignored and config must
come from the MCP client's `env` block.

## Notes

- This skill targets the standard documented in the sibling repos' own `CLAUDE.md` files; when they disagree, the **majority shape** is the
  standard and the outlier is a finding (unless the outlier is a deliberate, documented exception). When unsure whether a divergence is
  intentional, ask rather than "fix" it.
- Keep the shared `utils/` helpers (`access-level.ts`, `annotations.ts`, `audit-log.ts`) in sync across repos — a fix to one usually applies
  to all.
- The standard sits on top of a moving spec. When citing a requirement, know whether it is **spec-driven** (traces to the official MCP spec
  in [the source list](references/sources.md)) or **house style** — never present a workspace preference as a protocol "MUST". Run Mode
  REFRESH when in doubt.
- Full detail: [Workspace MCP Standard](references/workspace-mcp-standard.md), [Audit Rubric](references/audit-rubric.md), and the tracked
  [source list](references/sources.md).
