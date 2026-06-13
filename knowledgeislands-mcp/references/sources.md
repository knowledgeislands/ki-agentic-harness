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
| SPEC      | [MCP spec — versioning / latest][spec] | Which dated revision is current (latest released: **2025-11-25**) | 2026-06-13    |
| CHANGELOG | [2025-11-25 changelog][changelog]      | †                                                                 | 2026-06-13    |
| TOOLS     | [Server → Tools][tools]                | ‡                                                                 | 2026-06-13    |
| SEC       | [Security Best Practices][sec]         | §                                                                 | 2026-06-13    |
| AUTH      | [Authorization][auth]                  | ¶                                                                 | 2026-06-13    |

† What changed since 2025-06-18 (tasks, tool-calling in sampling, OIDC discovery, icons, validation-error clarification).

‡ Tool shape, `inputSchema`/`outputSchema`, `structuredContent`, annotations, `isError` vs protocol errors, tool-name charset/length, `icons`,
`execution.taskSupport`.

§ Confused deputy, token passthrough, SSRF, session hijacking, scope minimization, local-server compromise.

¶ OAuth 2.1 framework, token audience, PKCE, dynamic client registration — relevant to the gmail / m365 auth-servers.

## Community

| Tag       | Source                                                        | Governs | Last reviewed |
| --------- | ------------------------------------------------------------- | ------- | ------------- |
| COMMUNITY | [Tool Annotations as Risk Vocabulary (MCP blog)][annotations] | †       | 2026-06-13    |
| COMMUNITY | [NSA/CISA — MCP security CSI][csi]                            | ‡       | 2026-06-13    |

† What the `*Hint` annotations can and can't do — anchors the annotation-driven gate.

‡ External restatement of MCP server hardening (least privilege, allowlists, logging).

## In-house (the workspace convention)

The standard is defined as the **majority shape** across the seven sibling repos under `knowledgeislands/`. These are the living source of truth for house
style; when they diverge from each other, the majority wins and the outlier is a finding unless documented.

| Tag    | Source                      | Governs                                                                                  | Last reviewed |
| ------ | --------------------------- | ---------------------------------------------------------------------------------------- | ------------- |
| REPOS  | The seven sibling repos †   | Layout, config, tool naming, shared `utils/`, the toolchain ‡                            | 2026-06-13    |
| CLAUDE | Each repo's own `CLAUDE.md` | The per-repo statement of its own invariants — the standard tracks these and flags drift | 2026-06-13    |

† `mcp-git-audit`, `mcp-kb-fs`, `mcp-gmail`, `mcp-m365`, `mcp-claude-housekeeping`, `mcp-voicenotes-edit`, `mcp-kb-notion-mirror`.

‡ Layout, config injection, tool naming, the shared `utils/` helpers, the package/tsconfig/vitest/biome toolchain.

## Last review

REFRESH last run **2026-06-13** against MCP spec revision **2025-11-25** (the pinned stable target).

- **All sources accessible this run** (previously HTTP 403 for spec, changelog, tools, auth, and community pages). 2025-11-25 confirmed as current stable via
  the versioning page.
- **Conformant, no change to standard §1–12:** annotation-driven access gate (`readOnlyHint` / `destructiveHint` / `idempotentHint` / `openWorldHint`) confirmed
  verbatim in the TOOLS page; isError semantics (validation/API/logic errors → Tool Execution Errors, not protocol errors) confirmed; tool naming 1–128 chars
  `[A-Za-z0-9_.-]` confirmed (house scheme is a conformant subset); `outputSchema` + `structuredContent` pairing confirmed; `taskSupport` values `"forbidden"`
  (default) / `"optional"` / `"required"` confirmed; `icons` / `title` remain optional metadata.
- **Standard §13 updated (new, from AUTH page 2025-11-25):** two requirements that were not verified in the 2026-06-01 refresh (HTTP 403) are now added to the
  standard: RFC 8707 `resource` parameter (clients MUST include in auth/token requests; auth servers should accept, propagate to token `aud`, and the
  resource-server role validates `aud`) and Client ID Metadata Documents (auth servers SHOULD support URL-formatted client IDs as the preferred registration
  path). See workspace-mcp-standard.md §13 items 7–8.
- **MCP draft (target date 2026-07-28) confirmed accessible** at `/specification/draft`. Changelog verified — changes beyond the prior watch-item description:
  `server/discover` RPC (servers MUST implement); `subscriptions/listen` replaces HTTP GET + `resources/subscribe`; `ping` removed; MRTR pattern replaces
  sampling/roots/elicitation server-initiated requests; `CacheableResult` interface (`ttlMs`, `cacheScope`) on list/read results; tools/list SHOULD return
  deterministic order; RFC 9207 `iss` parameter validation added to auth; `application_type` required in Dynamic Client Registration; `inputSchema` /
  `outputSchema` loosened to full JSON Schema 2020-12 keywords. Dynamic Client Registration (RFC7591) deprecated in the draft in favour of Client ID Metadata
  Documents.
- **Open watch-items:** rate-limiting is a spec MUST kept lower-priority for local stdio servers (revisit if a server goes remote); no repo yet declares
  `outputSchema` for structured output. **Re-anchor the standard once the draft stabilises (target 2026-07-28):** stateless protocol core (drops the
  `initialize`/`initialized` handshake and `Mcp-Session-Id`), `server/discover` required, Roots / Sampling / Logging deprecated (12-month removal window), Tasks
  as an official extension, MRTR pattern, `CacheableResult` interface; for auth-server repos, RFC 9207 `iss` validation and `application_type` in DCR.

(What past reviews changed in the standard / checklist / `audit-mcp.ts` — structured output, the OAuth security invariants, tool-name charset bounds, output
sanitization, the relaxed tool-name regex — is in git.)

[spec]: https://modelcontextprotocol.io/specification
[changelog]: https://modelcontextprotocol.io/specification/2025-11-25/changelog
[tools]: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
[sec]: https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices
[auth]: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
[annotations]: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
[csi]: https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf
