# Sources — where the standard comes from

The authoritative and community sources behind the [Workspace MCP Standard](workspace-mcp-standard.md) and [Audit Rubric](audit-rubric.md). Mode REFRESH reads
this file, re-fetches each source, diffs it against the standard + rubric + [`scripts/audit-mcp.ts`](../scripts/audit-mcp.ts), then **bumps the `last reviewed`
dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). This is the skill's memory of where the
standard comes from — keep it current.

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

## Last review

REFRESH last run **2026-06-01** against MCP spec revision **2025-11-25** (the pinned target).

- **Conformant, no change:** the annotation-driven access gate (`readOnlyHint` / `destructiveHint` / `idempotentHint` / `openWorldHint`) matches the spec
  verbatim; "errors via `errorResult`, never `throw`" matches the 2025-11-25 input-validation clarification (failures returned as Tool Execution Errors, not
  protocol errors). 2025-11-25 confirmed (search-verified) as the current stable release; the spec, community, and sibling-repo sources were not re-fetchable
  this run (HTTP 403 / out of session scope), so prior findings stand.
- **Open watch-items:** rate-limiting is a spec MUST kept lower-priority for local stdio servers (revisit if a server goes remote); no repo yet declares
  `outputSchema` for structured output (pair it with `structuredContent` where applicable). **MCP 2026-07-28 release candidate** is published (not yet stable;
  10-week validation) — re-anchor the standard once it stabilises: stateless protocol core (drops the `initialize`/`initialized` handshake and
  `Mcp-Session-Id`), tool `inputSchema` widening to full JSON Schema 2020-12, Authorization hardening (mandatory `iss` per RFC 9207, application-type
  declarations), Tasks promoted to an official extension, and Roots / Sampling / Logging deprecated (12-month minimum removal window).

(What past reviews changed in the standard / checklist / `audit-mcp.ts` — structured output, the OAuth security invariants, tool-name charset bounds, output
sanitization, the relaxed tool-name regex — is in git.)

[spec]: https://modelcontextprotocol.io/specification
[changelog]: https://modelcontextprotocol.io/specification/2025-11-25/changelog
[tools]: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
[sec]: https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices
[auth]: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
[annotations]: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
[csi]: https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf
