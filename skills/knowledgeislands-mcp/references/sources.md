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
| SPEC      | [MCP spec — versioning / latest][spec] | Which dated revision is current (latest released: **2025-11-25**) | 2026-06-21    |
| CHANGELOG | [2025-11-25 changelog][changelog]      | †                                                                 | 2026-06-21    |
| TOOLS     | [Server → Tools][tools]                | ‡                                                                 | 2026-06-21    |
| SEC       | [Security Best Practices][sec]         | §                                                                 | 2026-06-21    |
| AUTH      | [Authorization][auth]                  | ¶                                                                 | 2026-06-21    |

† What changed since 2025-06-18 (tasks, tool-calling in sampling, OIDC discovery, icons, validation-error clarification).

‡ Tool shape, `inputSchema`/`outputSchema`, `structuredContent`, annotations, `isError` vs protocol errors, tool-name charset/length,
`icons`, `execution.taskSupport`.

§ Confused deputy, token passthrough, SSRF, session hijacking, scope minimization, local-server compromise.

¶ OAuth 2.1 framework, token audience, PKCE, dynamic client registration — relevant to the gmail / m365 auth-servers.

## Community

| Tag       | Source                                                        | Governs | Last reviewed |
| --------- | ------------------------------------------------------------- | ------- | ------------- |
| COMMUNITY | [Tool Annotations as Risk Vocabulary (MCP blog)][annotations] | †       | 2026-06-21    |
| COMMUNITY | [NSA/CISA — MCP security CSI][csi]                            | ‡       | 2026-06-21    |

† What the `*Hint` annotations can and can't do — anchors the annotation-driven gate.

‡ External restatement of MCP server hardening (least privilege, allowlists, logging).

## In-house (the workspace convention)

The standard is defined as the **majority shape** across the seven sibling repos under `knowledgeislands/`. These are the living source of
truth for house style; when they diverge from each other, the majority wins and the outlier is a finding unless documented.

| Tag    | Source                      | Governs                                                                                  | Last reviewed |
| ------ | --------------------------- | ---------------------------------------------------------------------------------------- | ------------- |
| REPOS  | The seven sibling repos †   | Layout, config, tool naming, shared `utils/`, the toolchain ‡                            | 2026-06-21    |
| CLAUDE | Each repo's own `CLAUDE.md` | The per-repo statement of its own invariants — the standard tracks these and flags drift | 2026-06-21    |

† `mcp-git-audit`, `mcp-kb-fs`, `mcp-gmail`, `mcp-m365`, `mcp-claude-housekeeping`, `mcp-voicenotes-edit`, `mcp-kb-notion-mirror`.

‡ Layout, config injection, tool naming, the shared `utils/` helpers, the package/tsconfig/vitest/biome toolchain.

## Last review

REFRESH last run **2026-06-21**. Pinned spec revision: **2025-11-25** (latest released); **2026-07-28** is still a Release Candidate (locked
2026-05-21, final publication targeted 2026-07-28 — not yet shipped).

**Confirmed current** — 2025-11-25 re-verified verbatim against the live spec (annotation-driven gate hints + untrusted-hint warning;
isError Tool Execution Errors vs protocol errors; tool names 1–128 chars `[A-Za-z0-9_.-]`; `outputSchema`/`structuredContent` pairing; JSON
Schema 2020-12 default; `taskSupport` / `icons` / `title` metadata; §13 auth scoped to roles no stdio repo occupies). **No change to
standard §1–13, the rubric, or audit-mcp.ts.** The CSI PDF wasn't re-fetched (fixed dated artifact, 403'd last run, content unchanged).

**Open watch-items:**

- **Re-anchor §12–13 + §4 once 2026-07-28 is RELEASED:** stateless core (handshake + `Mcp-Session-Id` removed, `server/discover`), Roots /
  Sampling / Logging deprecation, Tasks as an official extension, the deprecation-lifecycle policy; for auth repos, RFC 9207 `iss` + DCR
  `application_type`.
- Rate-limiting is a spec MUST kept lower-priority for local stdio servers (revisit if one goes remote).
- No repo yet declares `outputSchema` for structured output.
- Five proposed annotation SEPs (`unsafeOutputHint`, `secretHint`, `trustedHint`, trust/sensitivity, governance/UX) still Draft — gate's
  four-hint vocabulary stable, no action; watch for any landing in a released spec.

(What past reviews changed in the standard / checklist / `audit-mcp.ts` — structured output, the OAuth security invariants, tool-name
charset bounds, output sanitization, the relaxed tool-name regex — is in git.)

[spec]: https://modelcontextprotocol.io/specification
[changelog]: https://modelcontextprotocol.io/specification/2025-11-25/changelog
[tools]: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
[sec]: https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices
[auth]: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
[annotations]: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
[csi]: https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf
