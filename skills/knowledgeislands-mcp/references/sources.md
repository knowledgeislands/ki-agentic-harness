# Sources — where the standard comes from

The authoritative and community sources behind the [Workspace MCP Standard](workspace-mcp-standard.md) and [Audit Rubric](audit-rubric.md).
Mode REFRESH reads this file, re-fetches each source, diffs it against the standard + rubric +
[`scripts/audit-mcp.ts`](../scripts/audit-mcp.ts), then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below
(what changed is recorded in the commit, not a changelog). This is the skill's memory of where the standard comes from — keep it current.

Two layers feed the standard: the **official MCP specification** (what every conformant server must do) and the **in-house workspace
convention** (the opinionated shape the seven sibling repos share on top of the spec). A finding is only "spec-driven" if it traces to the
Authoritative table; everything else is house style and should be labelled as such so it is not mistaken for a protocol requirement.

## Authoritative (official MCP spec)

The spec is versioned by date. Track the **latest released** version and note the current one here.

| Tag       | Source                                 | Governs                                                           | Last reviewed |
| --------- | -------------------------------------- | ----------------------------------------------------------------- | ------------- |
| SPEC      | [MCP spec — versioning / latest][spec] | Which dated revision is current (latest released: **2025-11-25**) | 2026-06-18    |
| CHANGELOG | [2025-11-25 changelog][changelog]      | †                                                                 | 2026-06-18    |
| TOOLS     | [Server → Tools][tools]                | ‡                                                                 | 2026-06-18    |
| SEC       | [Security Best Practices][sec]         | §                                                                 | 2026-06-18    |
| AUTH      | [Authorization][auth]                  | ¶                                                                 | 2026-06-18    |

† What changed since 2025-06-18 (tasks, tool-calling in sampling, OIDC discovery, icons, validation-error clarification).

‡ Tool shape, `inputSchema`/`outputSchema`, `structuredContent`, annotations, `isError` vs protocol errors, tool-name charset/length,
`icons`, `execution.taskSupport`.

§ Confused deputy, token passthrough, SSRF, session hijacking, scope minimization, local-server compromise.

¶ OAuth 2.1 framework, token audience, PKCE, dynamic client registration — relevant to the gmail / m365 auth-servers.

## Community

| Tag       | Source                                                        | Governs | Last reviewed |
| --------- | ------------------------------------------------------------- | ------- | ------------- |
| COMMUNITY | [Tool Annotations as Risk Vocabulary (MCP blog)][annotations] | †       | 2026-06-18    |
| COMMUNITY | [NSA/CISA — MCP security CSI][csi]                            | ‡       | 2026-06-18    |

† What the `*Hint` annotations can and can't do — anchors the annotation-driven gate.

‡ External restatement of MCP server hardening (least privilege, allowlists, logging).

## In-house (the workspace convention)

The standard is defined as the **majority shape** across the seven sibling repos under `knowledgeislands/`. These are the living source of
truth for house style; when they diverge from each other, the majority wins and the outlier is a finding unless documented.

| Tag    | Source                      | Governs                                                                                  | Last reviewed |
| ------ | --------------------------- | ---------------------------------------------------------------------------------------- | ------------- |
| REPOS  | The seven sibling repos †   | Layout, config, tool naming, shared `utils/`, the toolchain ‡                            | 2026-06-18    |
| CLAUDE | Each repo's own `CLAUDE.md` | The per-repo statement of its own invariants — the standard tracks these and flags drift | 2026-06-18    |

† `mcp-git-audit`, `mcp-kb-fs`, `mcp-gmail`, `mcp-m365`, `mcp-claude-housekeeping`, `mcp-voicenotes-edit`, `mcp-kb-notion-mirror`.

‡ Layout, config injection, tool naming, the shared `utils/` helpers, the package/tsconfig/vitest/biome toolchain.

## Last review

REFRESH last run **2026-06-18** against MCP spec revision **2025-11-25** (the pinned stable target).

- **All sources accessible this run** except the NSA/CISA CSI PDF (HTTP 403 on WebFetch — recovered via search; content unchanged). The CSI
  is now a dated artifact: **May 2026 Ver. 1.0 (U/OO/6030316-26)** — least privilege per server, allowlisting / data-classification zones,
  egress filtering (proxy/DLP), input-and-context validation, continuous monitoring. Still supports §6 + audit logging.
- **2025-11-25 confirmed still the current released revision** via the versioning/spec page. No newer dated release exists.
- **Conformant, no change to standard §1–13, the rubric, or audit-mcp.ts.** Re-verified verbatim against the live 2025-11-25 pages:
  annotation-driven gate (`readOnlyHint` / `destructiveHint` / `idempotentHint` / `openWorldHint`; annotations are untrusted) (TOOLS);
  isError semantics — validation/API/logic errors are Tool Execution Errors, not protocol errors (TOOLS); tool naming SHOULD be 1–128 chars
  `[A-Za-z0-9_.-]` (TOOLS, house scheme is a conformant subset); `outputSchema` + `structuredContent` pairing, with the serialized-JSON
  TextContent backwards-compat block (TOOLS); `taskSupport` values `"forbidden"` (default) / `"optional"` / `"required"`, `icons` / `title`
  optional metadata (TOOLS); JSON Schema 2020-12 default dialect (TOOLS/CHANGELOG); §13 — RFC 8707 `resource` parameter + audience
  validation and Client ID Metadata Documents (AUTH), correctly scoped to the remote-resource-server / authorization-server roles that no
  current stdio repo occupies.
- **Draft has progressed to a Release Candidate, not yet released.** The **2026-07-28** revision is now an RC (locked **2026-05-21**, final
  publication **2026-07-28**) — the largest revision since launch. Re-confirmed in the draft this run: stateless core ("Stateless,
  self-contained requests" / "Per-request capability negotiation" — drops the `initialize`/`initialized` handshake and `Mcp-Session-Id`);
  Roots / Sampling / Logging deprecated (draft client features list shows Elicitation only); Tasks is now an official opt-in **extension**
  (alongside MCP Apps and Skills-over-MCP). Carried forward from the prior run, RC-stage and unchanged: `server/discover` required, MRTR
  pattern, `CacheableResult`, RFC 9207 `iss` validation, `application_type` in DCR, input/output schemas loosened to full JSON Schema
  2020-12. DCR is deprecated in favour of Client ID Metadata Documents.
- **Open watch-items:** rate-limiting remains a spec MUST kept lower-priority for local stdio servers (revisit if a server goes remote); no
  repo yet declares `outputSchema` for structured output. **Re-anchor §12–13 + §4 once the 2026-07-28 revision is RELEASED (final
  publication 2026-07-28):** stateless protocol core, `server/discover` required, Roots / Sampling / Logging deprecation window, Tasks as an
  official extension, MRTR pattern, `CacheableResult`; for auth-server repos, RFC 9207 `iss` validation and `application_type` in DCR.

(What past reviews changed in the standard / checklist / `audit-mcp.ts` — structured output, the OAuth security invariants, tool-name
charset bounds, output sanitization, the relaxed tool-name regex — is in git.)

[spec]: https://modelcontextprotocol.io/specification
[changelog]: https://modelcontextprotocol.io/specification/2025-11-25/changelog
[tools]: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
[sec]: https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices
[auth]: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
[annotations]: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
[csi]: https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf
