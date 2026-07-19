<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — Knowledge Islands MCP servers

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `scripts/rubric/publish.ts`.

## Contents

- [KI — Applicability and declaration](#ki--applicability-and-declaration)
- [LAY — Source layout](#lay--source-layout)
- [DOC — MCP documentation](#doc--mcp-documentation)
- [CFG — Configuration](#cfg--configuration)
- [UTIL — Shared utilities](#util--shared-utilities)
- [TEST — Test wiring](#test--test-wiring)
- [TOOL — Tool surface](#tool--tool-surface)
- [PKG — Package entry points](#pkg--package-entry-points)
- [SCR — MCP scripts](#scr--mcp-scripts)
- [CI — Smoke CI](#ci--smoke-ci)

## KI — Applicability and declaration

→ [standard](standards.md#applicability)

Scope activation and the ki-mcp governance declaration.

- **KI-CONFIG [M] — MCP applicability and declaration** — A repository is applicable when it declares [ki-mcp] or contains src/mcp-server/. Otherwise the audit emits one NOT_APPLICABLE finding and stops; declared keys are rejected because this skill has no configuration options. (standards.md#applicability)

## LAY — Source layout

→ [standard](standards.md#canonical-shape)

MCP source layers.

- **LAY-1 [M + J] — MCP source layout** — src/ contains config/, mcp-server/, tools/, main/, and utils/; an optional cli/ contains cli.ts and index.ts. (standards.md#canonical-shape)
  - _Review prompt:_ Review tools/ for thin validation-and-envelope shells, main/ for concern-grouped implementation, no console output in main/utils, and cli/ as a shared-main human shell rather than a second implementation.

## DOC — MCP documentation

→ [standard](standards.md#documentation)

MCP-specific root documents.

- **DOC-1 [M + J] — MCP root documents** — ROADMAP.md is present; CONTRIBUTING.md and SECURITY.md are present; CHANGELOG.md is present and non-empty. (standards.md#documentation)
  - _Review prompt:_ Review CLAUDE.md for drift against the code and README setup documentation for current client and configuration instructions.

## CFG — Configuration

→ [standard](standards.md#config-injection)

Injected configuration evidence.

- **CFG-1 [M + J] — Injected configuration surface** — config/index.ts exports loadConfig, loads .env through process.loadEnvFile, and refers to ACCESS_LEVELS, ACCESS_LEVEL_RANK, and AuditLogMode; ambient process.env reads elsewhere are surfaced. (standards.md#config-injection)
  - _Review prompt:_ Verify loadConfig(env?) is the only environmental reader, no module-level config singleton exists, config is the first argument of every main/utils entry point, Config contains the standard audit and access fields, and tests use literal config rather than environment mutation.

## UTIL — Shared utilities

→ [standard](standards.md#audit-logging)

Shared MCP helper modules.

- **UTIL-1 [M + J] — Shared audit logging helper** — utils/audit-log.ts is present as the shared audit-log helper. (standards.md#audit-logging)
  - _Review prompt:_ Verify audit logging never captures secrets and tool errors are errorResult envelopes so the audit wrapper sees them.

## TEST — Test wiring

→ [standard](standards.md#testing)

MCP coverage exclusions.

- **TEST-1 [M] — MCP coverage exclusions** — When a Vitest config exists, coverage excludes mcp-server/index.ts, tools wiring, utils/annotations.ts, and src/generated/. (standards.md#testing)

## TOOL — Tool surface

→ [standard](standards.md#tool-naming)

Tool registration names, structured output, and stable registration order.

- **TOOL-1 [M + J] — MCP tool surface** — Registered tool names use snake-case app/resource/action forms; structured output declares outputSchema; and group registration order is stable. (standards.md#tool-naming, standards.md#tool-results)
  - _Review prompt:_ Review plural/singular resource choices, CLI mirroring and README catalogues; confirm the annotation-driven access gate, annotation presets, dry-run defaults, read default, audit/error envelopes, path and subprocess hardening, bounded schemas, error aggregation, output sanitisation, and the applicable OAuth security requirements. Optional metadata remains opt-in.

## PKG — Package entry points

→ [standard](standards.md#packagejson)

MCP package entry points.

- **PKG-1 [M] — MCP package entry points** — package.json has the MCP main and bin target plus ., ./config, and ./package.json exports. (standards.md#packagejson)

## SCR — MCP scripts

→ [standard](standards.md#packagejson)

MCP runtime and generation scripts.

- **SCR-1 [M + J] — MCP scripts** — MCP server scripts are present, typed-client generation is required, auth-server scripts are paired, and record/replay scripts travel together. (standards.md#packagejson)
  - _Review prompt:_ Verify generated typed-client files are committed and current; where generation fails, repair the server registration/build and rerun the explicit generation command.

## CI — Smoke CI

→ [standard](standards.md#packagejson)

The MCP smoke harness and workflow hook.

- **CI-1 [M] — MCP smoke CI** — When ki:test:smoke is defined, ci.yml invokes it after the common engineering gate. (standards.md#packagejson)
- **CI-2 [M] — MCP smoke execution** — When ki:test:smoke is defined, it exits successfully. (standards.md#packagejson)
