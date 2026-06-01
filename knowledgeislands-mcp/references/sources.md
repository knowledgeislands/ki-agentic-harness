# Sources — where the standard comes from

The authoritative and community sources behind the [Workspace MCP Standard](workspace-mcp-standard.md) and [Audit Rubric](audit-rubric.md). Mode REFRESH reads
this file, re-fetches each source, diffs it against the standard + rubric + [`scripts/audit-mcp.ts`](../scripts/audit-mcp.ts), then **bumps the `last reviewed`
dates and records what changed** in the changelog below. This is the skill's memory of where the standard comes from — keep it current.

Two layers feed the standard: the **official MCP specification** (what every conformant server must do) and the **in-house workspace convention** (the
opinionated shape the seven sibling repos share on top of the spec). A finding is only "spec-driven" if it traces to the Authoritative table; everything else is
house style and should be labelled as such so it is not mistaken for a protocol requirement.

## Authoritative (official MCP spec)

The spec is versioned by date. Track the **latest released** version and note the current one here.

| Tag       | Source                                 | Governs                                                           | Last reviewed |
| --------- | -------------------------------------- | ----------------------------------------------------------------- | ------------- |
| SPEC      | [MCP spec — versioning / latest][spec] | Which dated revision is current (latest released: **2025-11-25**) | 2026-06-01    |
| CHANGELOG | [2025-11-25 changelog][changelog]      | †                                                                 | 2026-06-01    |
| TOOLS     | [Server → Tools][tools]                | ‡                                                                 | 2026-06-01    |
| SEC       | [Security Best Practices][sec]         | §                                                                 | 2026-06-01    |
| AUTH      | [Authorization][auth]                  | ¶                                                                 | 2026-06-01    |

† What changed since 2025-06-18 (tasks, tool-calling in sampling, OIDC discovery, icons, validation-error clarification).

‡ Tool shape, `inputSchema`/`outputSchema`, `structuredContent`, annotations, `isError` vs protocol errors, tool-name charset/length, `icons`,
`execution.taskSupport`.

§ Confused deputy, token passthrough, SSRF, session hijacking, scope minimization, local-server compromise.

¶ OAuth 2.1 framework, token audience, PKCE, dynamic client registration — relevant to the gmail / m365 auth-servers.

## Community

| Tag       | Source                                                        | Governs | Last reviewed |
| --------- | ------------------------------------------------------------- | ------- | ------------- |
| COMMUNITY | [Tool Annotations as Risk Vocabulary (MCP blog)][annotations] | †       | 2026-06-01    |
| COMMUNITY | [NSA/CISA — MCP security CSI][csi]                            | ‡       | 2026-06-01    |

† What the `*Hint` annotations can and can't do — anchors the annotation-driven gate.

‡ External restatement of MCP server hardening (least privilege, allowlists, logging).

## In-house (the workspace convention)

The standard is defined as the **majority shape** across the seven sibling repos under `knowledgeislands/`. These are the living source of truth for house
style; when they diverge from each other, the majority wins and the outlier is a finding unless documented.

| Tag    | Source                      | Governs                                                                                  | Last reviewed |
| ------ | --------------------------- | ---------------------------------------------------------------------------------------- | ------------- |
| REPOS  | The seven sibling repos †   | Layout, config, tool naming, shared `utils/`, the toolchain ‡                            | 2026-06-01    |
| CLAUDE | Each repo's own `CLAUDE.md` | The per-repo statement of its own invariants — the standard tracks these and flags drift | 2026-06-01    |

† `mcp-git-audit`, `mcp-kb-fs`, `mcp-gmail`, `mcp-m365`, `mcp-claude-housekeeping`, `mcp-voicenotes-edit`, `mcp-kb-notion-mirror`.

‡ Layout, config injection, tool naming, the shared `utils/` helpers, the package/tsconfig/vitest/biome toolchain.

## Review changelog

Record each REFRESH run: date, what was re-fetched, what changed in the standard / checklist / `audit-mcp.ts` (or "no change").

- **2026-06-01 (REFRESH)** — Monthly refresh. MCP spec 2025-11-25 confirmed as current stable release (search-verified). Individual spec pages (TOOLS, SEC,
  AUTH, CHANGELOG) returned HTTP 403 — unverifiable; prior review's findings stand. Community sources (annotations blog, NSA/CISA CSI) also 403. Sibling repos
  not in session scope. Notable forward-look: **MCP 2026-07-28 release candidate** published (not yet stable; 10-week validation window). Major RC changes to
  track for the next REFRESH once it stabilises: (1) stateless protocol core — removes `initialize`/`initialized` handshake and `Mcp-Session-Id`; (2) tool
  `inputSchema` expands to full JSON Schema 2020-12 (composition, conditionals, `$ref`); (3) Authorization hardening — mandatory `iss` validation per RFC 9207,
  application-type declarations; (4) Tasks promoted to official extension; (5) **Roots, Sampling, and Logging deprecated** (12-month minimum removal window). No
  changes to standard, rubric, or `audit-mcp.ts`.
- **2026-05-30 (REFRESH)** — Initial source list assembled; standard audited against MCP spec **2025-11-25**. Confirmed the annotation-driven access gate
  (`readOnlyHint`/`destructiveHint`/`idempotentHint`/`openWorldHint`) still matches the spec verbatim, and that the house "errors via `errorResult`, never
  `throw`" rule already matches the 2025-11-25 clarification that input-validation failures be returned as Tool Execution Errors (`isError: true`), not protocol
  errors. Gaps found and codified into the standard + checklist: (1) **Structured output** — `outputSchema` + `structuredContent` (added in spec 2025-06-18)
  were undocumented; m365 already returns `structuredContent` but no repo declares `outputSchema`. Added as a recommended-where-applicable item, paired. (2)
  **OAuth security invariants** for the gmail / m365 auth-servers (token audience / no passthrough, PKCE + single-use `state`, exact `redirect_uri` match, scope
  minimization, SSRF on discovery/token URLs, secure local token storage) — the prior security list was FS/subprocess-only. Added a dedicated subsection. (3)
  **Tool-name charset/length** spec bounds (1–128 chars, `[A-Za-z0-9_.-]`) noted; the house `<app>_<resource>_<action>` snake_case is a conformant subset. (4)
  **Output sanitization** (spec "Servers MUST sanitize tool outputs") promoted to a checklist item (m365's `html-sanitizer.ts` is the worked example);
  rate-limiting noted as a spec MUST that is lower-priority for local stdio servers. `audit-mcp.ts`: relaxed the tool-name regex so documented 2-segment
  metadata tools (`m365_about`) no longer false-WARN.

[spec]: https://modelcontextprotocol.io/specification
[changelog]: https://modelcontextprotocol.io/specification/2025-11-25/changelog
[tools]: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
[sec]: https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices
[auth]: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
[annotations]: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
[csi]: https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf
