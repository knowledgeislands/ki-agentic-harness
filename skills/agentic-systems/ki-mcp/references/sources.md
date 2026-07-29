# Sources — where the standard comes from

**Refresh:** external-spec · monthly

The authoritative and community sources behind the [Workspace MCP Standard](standards-mcp-servers.md) and [Audit Rubric](rubric.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard, rubric, and [`scripts/rubric/items/index.ts`](../scripts/rubric/items/index.ts), then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). This is the skill's memory of where the standard comes from—keep it current.

Two layers feed the standard: the **official MCP specification** (what every conformant server must do) and the **in-house workspace convention** (the opinionated shape the six sibling repos share on top of the spec). A finding is only "spec-driven" if it traces to the Authoritative table; everything else is house style and should be labelled as such so it is not mistaken for a protocol requirement.

## Authoritative (official MCP spec)

The spec is versioned by date. Track the **latest released** version and note the current one here.

| Tag        | Source                                     | Governs | Last reviewed |
| ---------- | ------------------------------------------ | ------- | ------------- |
| SPEC       | [MCP spec — versioning / latest][spec]     | ※       | 2026-07-29    |
| CHANGELOG  | [2026-07-28 changelog][changelog]          | †       | 2026-07-29    |
| TOOLS      | [Server → Tools][tools]                    | ‡       | 2026-07-29    |
| SEC        | [Security Best Practices][sec]             | §       | 2026-06-21    |
| AUTH       | [Authorization][auth]                      | ¶       | 2026-07-29    |
| DEPRECATED | [Deprecated features registry][deprecated] | ◊       | 2026-07-29    |

† What changed at 2026-07-28: stateless core (no `initialize` handshake / `Mcp-Session-Id`), `server/discover` MUST, MRTR replacing server-initiated sampling/elicitation/roots, required `resultType`, `CacheableResult`, the Roots/Sampling/Logging deprecation, JSON-Schema-2020-12 loosening, the deterministic `tools/list` SHOULD, and the RFC 9207 `iss` / `application_type` / DCR-deprecation auth changes.

‡ Tool shape, `inputSchema`/`outputSchema` (2020-12, keyword-loosened), `structuredContent` (now any JSON value), annotations, `isError` vs protocol errors, tool-name charset/length, deterministic ordering, `icons`/`title`.

§ Confused deputy, token passthrough, SSRF, session hijacking, scope minimization, local-server compromise.

¶ OAuth 2.1 framework, token audience, PKCE, client registration (CIMD preferred, DCR deprecated), RFC 9207 `iss` — relevant to the gsuite / m365 auth clients; the framework is HTTP-only and its own text says stdio transports SHOULD NOT follow it.

※ Which dated revision is current (latest released: **2026-07-28**).

◊ The registry of Deprecated features and their earliest-removal dates (Roots, Sampling, Logging, DCR, HTTP+SSE).

## Community

| Tag       | Source                                                        | Governs | Last reviewed |
| --------- | ------------------------------------------------------------- | ------- | ------------- |
| COMMUNITY | [Tool Annotations as Risk Vocabulary (MCP blog)][annotations] | †       | 2026-06-21    |
| COMMUNITY | [NSA/CISA — MCP security CSI][csi]                            | ‡       | 2026-06-21    |

† What the `*Hint` annotations can and can't do — anchors the annotation-driven gate.

‡ External restatement of MCP server hardening (least privilege, allowlists, logging).

## In-house (the workspace convention)

The standard is defined as the **majority shape** across the six sibling repos under `knowledgeislands/`. These are the living source of truth for house style; when they diverge from each other, the majority wins and the outlier is a finding unless documented.

| Tag    | Source                      | Governs                                                       | Last reviewed |
| ------ | --------------------------- | ------------------------------------------------------------- | ------------- |
| REPOS  | The six sibling repos †     | Layout, config, tool naming, shared `utils/`, the toolchain ‡ | 2026-06-21    |
| CLAUDE | Each repo's own `CLAUDE.md` | Per-repo invariants ※                                         | 2026-06-21    |

† `mcp-git-audit`, `mcp-ki-kb-fs`, `mcp-gsuite`, `mcp-m365`, `mcp-claude-housekeeping`, `mcp-ki-kb-notion-mirror`.

‡ Layout, config injection, tool naming, the shared `utils/` helpers, the package/tsconfig/vitest/biome toolchain.

※ The per-repo statement of its own invariants — the standard tracks these and flags drift.

## Last review

REFRESH last run **2026-07-29**. Pinned spec revision: **2026-07-28** — now **RELEASED as Final** (published 2026-07-28, one day before this review; locked as an RC 2026-05-21, then validated for ~10 weeks). This pass executed the §12–13 + §4 re-anchor that the previous review (2026-07-04) staged as its open watch-item.

**Release confirmation (the precondition for editing the standard).** The canonical spec index (SPEC → `/specification`) now serves the `schema/2026-07-28/schema.ts` source on `main` and links every component to `/specification/2026-07-28/*`, and the maintainers' announcement ("The 2026-07-28 Specification" — "officially pushing the release button") confirms Final status. **Caveat noted for the next reviewer:** the `/specification/versioning` page's Revisions section still reads _"The current protocol version is 2025-11-25"_ — a stale line lagging the release; it is contradicted by the canonical index, the schema on `main`, the Final announcement, and downstream adopters, so it was not treated as authoritative.

**What was re-diffed and changed this pass** (standard §4, §12, §13; sources; exemplars — checker unchanged):

- **`server/discover` is now a server MUST** (SEP-2575). Applies to stdio too (a client MAY use it as a backward-compat probe). It is provided by the `@modelcontextprotocol/sdk`, not hand-rolled — §12 now states the requirement and makes the concrete audit action "confirm the repo's pinned SDK implements it" (a 2026-07-28-capable release). Per-repo SDK-version verification is an AUDIT action against each `mcp-*` repo, out of scope for this REFRESH (the sibling repos are not vendored here).
- **Stateless core** — no `initialize` handshake (SEP-2575), no `Mcp-Session-Id` (SEP-2567), `subscriptions/listen`, SSE-resumability removal, `CacheableResult` (`ttlMs`/`cacheScope`) on list results, required `resultType`, header routing (SEP-2549/2243). For stdio these are transport/SDK-absorbed; §12 now frames what our code still owns (the `isError` envelope; `resultType: "complete"` is SDK-stamped and we never emit `"input_required"`) versus what the SDK handles.
- **Roots / Sampling / Logging Deprecated** (SEP-2577; 12-month window, earliest removal the first revision on/after **2027-07-28**). Confirmed our servers use **none**: they log to stderr + append-only audit files (§5) — exactly the spec's recommended stdio Logging migration — and never declare the `logging` capability, call Sampling, or expose Roots. Recorded in §12; nothing to migrate.
- **`outputSchema` + `structuredContent` / JSON Schema 2020-12 loosened** (SEP-2106). `structuredContent` may now be any JSON value; both schemas accept any 2020-12 keywords (allowlist gone) with new `$ref`/composition bounds. Already a house **SHOULD** and already enforced by the checker (`TOOL-1`: `structuredContent`/`jsonResult` without `outputSchema` → WARN) — this closes the standing "no repo declares `outputSchema`" watch-item; it is now an ordinary AUDIT finding, not a spec-watch item.
- **Deterministic `tools/list` order** is now an explicit spec **SHOULD** (Minor #3). Already codified in §12 and enforced by the checker — confirmed, no code change.
- **Auth (§13)** — the released AUTH page states plainly that its framework is HTTP-only and _"Implementations using an STDIO transport SHOULD NOT follow this specification, and instead retrieve credentials from the environment."_ That anchors items 7–8 and all four 2026-07-28 auth changes as **N/A** to our stdio OAuth-client repos. Recorded per-change: RFC 9207 `iss` (SEP-2468) — a client-validate MUST inside the framework, tracked as optional defense-in-depth for the gsuite/m365 loopback flow; `application_type` (SEP-837) and credentials-keyed-by-issuer (SEP-2352) — DCR-only, and we pre-register, so N/A; DCR (RFC 7591) now formally **Deprecated** in favour of Client ID Metadata Documents — reinforces our pre-registration choice.

**Sources re-fetched live this pass:** SPEC (versioning), CHANGELOG (2026-07-28), TOOLS (2026-07-28 server/tools), AUTH (2026-07-28 authorization), and the new DEPRECATED registry — all bumped to 2026-07-29 and re-pinned to the `2026-07-28` URLs. SEC (security best practices) was **not** re-fetched (stable dated artifact, verbatim-confirmed 2026-06-21); its URL is re-pinned to 2026-07-28 but its `last reviewed` cell is unchanged. Community and In-house rows were not re-fetched (the sibling repos are not accessible from this harness); their dates are unchanged.

**Open watch-items:**

- **Per-repo SDK re-anchor (AUDIT action).** For each of the six `mcp-*` repos, confirm the pinned `@modelcontextprotocol/sdk` is a `2026-07-28`-capable release that implements `server/discover` on stdio, and that the `jsonResult`/`errorResult` return shapes still satisfy the SDK's `CallToolResult` type (now carrying required `resultType`). This is done against each repo, not in REFRESH.
- **RFC 9207 `iss` defense-in-depth (gsuite/m365).** Assess whether Google / Microsoft advertise `authorization_response_iss_parameter_supported`; if so, validate the returned `iss` against the expected issuer in the loopback callback. Not yet a required house rule; the spec also signals a future SHOULD→MUST upgrade of AS `iss` inclusion.
- Rate-limiting remains a spec-side concern (server/tools §Security: "Rate limit tool invocations") kept lower-priority for local stdio servers — revisit if one goes remote.
- Tasks are now an official extension (`io.modelcontextprotocol/tasks`, SEP-2663) rather than experimental core — irrelevant to short-lived stdio tools; revisit if a server grows long-running operations.
- Five proposed annotation SEPs (`unsafeOutputHint`, `secretHint`, `trustedHint`, trust/sensitivity, governance/UX) still Draft — gate's four-hint vocabulary stable, no action; watch for any landing in a released spec.

(What past reviews changed in the standard / checklist / native rubric — structured output, the OAuth security invariants, tool-name charset bounds, output sanitization, the relaxed tool-name regex — is in git.)

[spec]: https://modelcontextprotocol.io/specification
[changelog]: https://modelcontextprotocol.io/specification/2026-07-28/changelog
[tools]: https://modelcontextprotocol.io/specification/2026-07-28/server/tools
[sec]: https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices
[auth]: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
[deprecated]: https://modelcontextprotocol.io/specification/2026-07-28/deprecated
[annotations]: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
[csi]: https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf
