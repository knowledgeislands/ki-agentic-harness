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

REFRESH last run **2026-06-21** against MCP spec revision **2025-11-25** (the pinned stable target).

- **Authoritative + the annotations community source accessible this run.** The NSA/CISA CSI PDF was not re-fetched this run (it 403'd last
  run and is a fixed dated artifact — **May 2026 Ver. 1.0 (U/OO/6030316-26)**: least privilege per server, allowlisting /
  data-classification zones, egress filtering (proxy/DLP), input-and-context validation, continuous monitoring); its content is unchanged
  and still supports §6 + audit logging.
- **2025-11-25 confirmed still the current released revision** via the versioning/spec page (every section card still points at
  `/specification/2025-11-25/…`). No newer dated release exists.
- **Conformant, no change to standard §1–13, the rubric, or audit-mcp.ts.** Re-verified verbatim against the live 2025-11-25 pages:
  annotation-driven gate (`readOnlyHint` / `destructiveHint` / `idempotentHint` / `openWorldHint`; annotations are untrusted) (TOOLS);
  isError semantics — validation/API/logic errors are Tool Execution Errors, not protocol errors (TOOLS); tool naming SHOULD be 1–128 chars
  `[A-Za-z0-9_.-]` (TOOLS, house scheme is a conformant subset); `outputSchema` + `structuredContent` pairing, with the serialized-JSON
  TextContent backwards-compat block (TOOLS); `taskSupport` values `"forbidden"` (default) / `"optional"` / `"required"`, `icons` / `title`
  optional metadata (TOOLS); JSON Schema 2020-12 default dialect (TOOLS/CHANGELOG); §13 — RFC 8707 `resource` parameter + audience
  validation and Client ID Metadata Documents (AUTH), correctly scoped to the remote-resource-server / authorization-server roles that no
  current stdio repo occupies.
- **The 2026-07-28 revision is still a Release Candidate, not released** (today is before the final-publication date). RC locked
  **2026-05-21**, final publication targeted **2026-07-28**; the released spec remains 2025-11-25. Re-confirmed via the RC blog post this
  run: the largest revision since launch, with breaking changes, and the ~10-week RC→final window is the SDK/implementer validation period.
  Carried forward, RC-stage and unchanged: stateless protocol core (`initialize`/`initialized` handshake and `Mcp-Session-Id` removed —
  SEP-2575 / SEP-2567; capabilities travel in `_meta` with a `server/discover` method); Roots / Sampling / Logging deprecated
  (annotation-only, still functional); Tasks moves to an official opt-in **extension** (alongside MCP Apps) under the new Extensions
  framework; authorization hardened toward OAuth 2.1 / OIDC (RFC 9207 `iss` validation, `application_type` in DCR); full JSON Schema 2020-12
  for tool input/output; missing-resource error code `-32002` → `-32602`; a formal Active → Deprecated → Removed lifecycle policy (≥12
  months before removal). Python SDK v2 alpha shipped 2026-06-11; TS SDK v2 expected at the 2026-07-28 cut.
- **Conformant, no change to standard §1–13, the rubric, or audit-mcp.ts.** Re-verified verbatim against the live 2025-11-25 pages this run:
  annotation-driven gate (`readOnlyHint` / `destructiveHint` / `idempotentHint` / `openWorldHint`, defaults pessimistic; annotations are
  untrusted hints, not enforcement) (TOOLS + annotations blog); isError semantics — validation/API/logic errors are Tool Execution Errors,
  not protocol errors (TOOLS); tool naming SHOULD be 1–128 chars `[A-Za-z0-9_.-]`, the house scheme a conformant subset (TOOLS);
  `outputSchema`
  - `structuredContent` pairing with the serialized-JSON TextContent backwards-compat block (TOOLS); JSON Schema 2020-12 default dialect
    (TOOLS); `taskSupport` `"forbidden"`/`"optional"`/`"required"`, `icons` / `title` optional metadata (TOOLS); "Servers MUST sanitize tool
    outputs" + rate-limit (TOOLS security considerations).
- **Open watch-items:** (1) **re-anchor §12–13 + §4 once 2026-07-28 is RELEASED** — stateless protocol core, `server/discover`, Roots /
  Sampling / Logging deprecation window, Tasks as an official extension, the deprecation-lifecycle policy, and for auth-server repos RFC
  9207 `iss` validation + `application_type` in DCR; (2) rate-limiting remains a spec MUST kept lower-priority for local stdio servers
  (revisit if a server goes remote); (3) no repo yet declares `outputSchema` for structured output; (4) five proposed annotation SEPs
  (`unsafeOutputHint`, `secretHint`, `trustedHint`, trust/sensitivity, governance/UX) are still Draft — the gate's four-hint vocabulary is
  stable, so no action, but watch whether any land in a released spec.

(What past reviews changed in the standard / checklist / `audit-mcp.ts` — structured output, the OAuth security invariants, tool-name
charset bounds, output sanitization, the relaxed tool-name regex — is in git.)

[spec]: https://modelcontextprotocol.io/specification
[changelog]: https://modelcontextprotocol.io/specification/2025-11-25/changelog
[tools]: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
[sec]: https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices
[auth]: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
[annotations]: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
[csi]: https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf
