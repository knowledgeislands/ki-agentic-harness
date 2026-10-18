# Sources — where the standard comes from

**Refresh:** external-spec · monthly

The authoritative and community sources behind the [Workspace MCP Standard](standards-mcp-servers.md) and [Audit Rubric](rubric.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard, rubric, and [`scripts/rubric/items/index.ts`](../scripts/rubric/items/index.ts), then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). This is the skill's memory of where the standard comes from—keep it current.

Two layers feed the standard: the **official MCP specification** (what every conformant server must do) and the **in-house workspace convention** (the opinionated shape the six sibling repos share on top of the spec). A finding is only "spec-driven" if it traces to the Authoritative table; everything else is house style and should be labelled as such so it is not mistaken for a protocol requirement.

## Contents

- [Authoritative MCP sources](#authoritative-official-mcp-spec)
- [Community sources](#community)
- [In-house evidence](#in-house-the-workspace-convention)
- [Source-distribution sources](#source-distribution)
- [Last review](#last-review)
- [Previous review](#previous-review)

## Authoritative (official MCP spec)

The spec is versioned by date. Track the **latest released** version and note the current one here.

| Tag       | Source                                 | Governs | Last reviewed |
| --------- | -------------------------------------- | ------- | ------------- |
| SPEC      | [MCP spec — versioning / latest][spec] | ※       | 2026-10-18    |
| CHANGELOG | [2026-07-28 changelog][changelog]      | †       | 2026-10-18    |
| SDK       | [TypeScript SDK releases][sdk]         | ※       | 2026-10-18    |
| TOOLS     | [Server → Tools][tools]                | ‡       | 2026-10-18    |
| SEC       | [Security Best Practices][sec]         | §       | 2026-10-18    |
| AUTH      | [Authorization][auth]                  | ¶       | 2026-10-18    |

† What changed since 2025-11-25 (stateless core, `server/discover`, required `resultType`, Multi Round-Trip Requests, tasks moved to an extension, transport-session and SSE-resumability removals).

‡ Tool shape, `inputSchema`/`outputSchema`, `structuredContent`, annotations, `isError` vs protocol errors, tool-name charset/length, `icons`, `execution.taskSupport`.

§ Confused deputy, token passthrough, SSRF, session hijacking, scope minimization, local-server compromise.

¶ OAuth 2.1 framework, token audience, PKCE, dynamic client registration — relevant to the gmail / m365 auth-servers.

※ Which dated revision is current and whether a released SDK supports it. All six original sibling repositories now declare the v2 server package (2.3.0) and so select the 2026-07-28 profile; two newer repositories (`mcp-acquire-whatsapp`, `mcp-housekeeping-chatgpt`) declare the v1 SDK (`^1.32.0`) and the 2025-11-25 profile.

## Community

| Tag       | Source                                                        | Governs | Last reviewed |
| --------- | ------------------------------------------------------------- | ------- | ------------- |
| COMMUNITY | [Tool Annotations as Risk Vocabulary (MCP blog)][annotations] | †       | 2026-10-18    |
| REGISTRY  | [GitHub MCP Registry][github-mcp]                             | §       | 2026-10-18    |

† What the `*Hint` annotations can and can't do — anchors the annotation-driven gate.

§ MCP server discovery and integration examples; catalogue entries are discovery evidence, not protocol requirements.

## In-house (the workspace convention)

The standard is defined as the **majority shape** across the six sibling repos under `knowledgeislands/`. These are the living source of truth for house style; when they diverge from each other, the majority wins and the outlier is a finding unless documented.

| Tag    | Source                      | Governs                                                       | Last reviewed |
| ------ | --------------------------- | ------------------------------------------------------------- | ------------- |
| REPOS  | The six sibling repos †     | Layout, config, tool naming, shared `utils/`, the toolchain ‡ | 2026-10-18    |
| CLAUDE | Each repo's own `CLAUDE.md` | Per-repo invariants ※                                         | 2026-10-18    |

† `mcp-git-audit`, `mcp-ki-kb-fs`, `mcp-gsuite`, `mcp-m365`, `mcp-housekeeping-claude`, `mcp-ki-kb-notion-mirror`. Two newer v1 repositories (`mcp-acquire-whatsapp`, `mcp-housekeeping-chatgpt`) are not yet part of the majority basis.

‡ Layout, config injection, tool naming, the shared `utils/` helpers, the package/tsconfig/vitest/biome toolchain.

※ The per-repo statement of its own invariants — the standard tracks these and flags drift.

## Source distribution

These primary sources ground the separate source-install contract. They do not make package or registry publication mandatory.

| Tag | Source | Governs | Last reviewed |
| --- | ------ | ------- | ------------- |
| SEMVER | [Semantic Versioning 2.0.0][semver] | Version grammar and precedence | 2026-10-18    |
| GIT-TAG | [Git tag documentation][git-tag] | Annotated release tags and object identity | 2026-10-18    |
| GITHUB-RELEASE | [GitHub release management][github-release] | Owner-designated stable release marker | 2026-10-18    |
| BUN-INSTALL | [Bun install documentation][bun-install] | Frozen lockfile installation | 2026-10-18    |
| BUN-LOCK | [Bun lockfile documentation][bun-lock] | Committed dependency evidence | 2026-10-18    |

## Last review

REFRESH last ran **2026-10-18** under KI-HARNESS-GOV-194. Every row was re-fetched, and the sibling repositories were re-scanned locally.

- **SPEC / CHANGELOG:** 2026-07-28 is still the latest released revision, with no newer revision or release candidate listed. Its changelog now also records an error-code allocation policy (`-32000` to `-32019` implementation-defined, `-32020` to `-32099` reserved, with three renumbered codes), deterministic `tools/list` ordering (SHOULD), required `ttlMs` and `cacheScope` on cacheable results, and the deprecation of Roots, Sampling and Logging under a twelve-month feature lifecycle. These sharpen the 2026-07-28 profile watch-item; none touches the 2025-11-25 profile.
- **SDK:** `@modelcontextprotocol/server`, `client` and `core` remain at **2.3.1** (2026-10-05) and the v1 SDK at **1.32.1**, with no newer release. 2.3.0 enforces one server per connection, which the per-connection `serveStdio` factory already satisfies.
- **TOOLS / SEC / AUTH:** the 2025-11-25 pages are unchanged since 2026-10-06.
- **COMMUNITY / REGISTRY:** the annotations post is unchanged and still lists SEP-1913, 1984, 1561, 1560 and 1487. The GitHub registry lists 490 servers and states no curation or protocol requirement, so it stays discovery evidence only.
- **Source distribution:** SemVer 2.0.0 is current; the `git tag` manual is unchanged since Git 2.55.0; GitHub release guidance adds immutable releases, which lock assets and the tag but leave the latest-release flag editable; Bun still requires a committed text `bun.lock` and does not freeze the lockfile in CI unless asked, with `bun ci` as the shorthand.
- **REPOS / CLAUDE:** all six original siblings still declare `@modelcontextprotocol/server` 2.3.0, one patch behind; `mcp-acquire-whatsapp` and `mcp-housekeeping-chatgpt` still declare the v1 SDK `^1.32.0`. `mcp-git-audit` (AGENTS.md line 31), `mcp-ki-kb-notion-mirror` (line 21) and `mcp-m365` (now line 109) still declare the 2025-11-25 profile while running the v2 package.
- **Retired:** the [NSA/CISA MCP security CSI][csi] returned HTTP 403 again, as on 2026-10-06, and the CISA resources listing offered no alternative host. It was an external restatement of server hardening that no standard or rubric clause cites, so its row is retired rather than left to keep the skill permanently overdue. Re-add it if a reachable host is found.

**Open watch-items:**

- Correct the sibling names in the standard and `SKILL.md`, which still say `mcp-ki-repo-kb-fs` and `mcp-ki-repo-kb-notion-mirror`, and decide whether the two v1 repositories join the majority basis.
- Add 2026-07-28 TOOLS, SEC and AUTH rows beside the 2025-11-25 ones, make the structured-output rule profile-dependent, and assess the new error-code range, deterministic tool ordering and cacheable-result fields for the 2026-07-28 profile.
- Track the three AGENTS.md profile declarations above, sibling pins against SDK 2.3.1, and migration of the two v1 repositories.
- Unchanged: rate limiting for any future remote server, and the open annotation vocabulary proposals.

## Previous review

REFRESH ran **2026-10-06**. Every row was re-fetched except the NSA/CISA CSI, which returned HTTP 403 and kept its 2026-06-21 date.

- **SPEC / CHANGELOG:** 2026-07-28 is still the latest released revision, with no newer revision or release candidate; its changelog is unchanged.
- **SDK:** `@modelcontextprotocol/server`, `client` and `core` are at **2.3.1** (2026-10-05), with new `server-legacy`, `codemod` and `node` packages; the v1 `@modelcontextprotocol/sdk` is at **1.32.1**.
- **TOOLS:** the 2025-11-25 tool shape is unchanged apart from a note that `structuredContent` is unrelated to LLM structured outputs. The 2026-07-28 page adds `resultType`, input-required tool results, `x-mcp-header` and stateful tools, and allows `structuredContent` to be any JSON value rather than an object.
- **SEC:** content verified at its new `/docs/2025-11-25/tutorials/security/` URL. Its OAuth authorization-URL validation and stdio-proxy sections (February 2026) are client and proxy obligations. The 2026-07-28 version adds SSRF against authorization servers, mix-up attacks, localhost redirect impersonation and CIMD trust policies, and renames session hijacking.
- **AUTH:** 2025-11-25 prefers Client ID Metadata Documents and keeps dynamic client registration for backwards compatibility. RFC 9207 `iss` validation and `application_type` appear only in 2026-07-28, which also deprecates dynamic client registration.
- **COMMUNITY:** the annotations post (2026-03-16) still treats annotations as untrusted hints and lists open proposals SEP-1913, 1984, 1561, 1560 and 1487.
- **REPOS:** all six original siblings declare `@modelcontextprotocol/server` 2.3.0, one patch behind; the `mcp-ki-kb-fs` structured-output gap is resolved, and `mcp-m365` declares `outputSchema` only on tools that emit `structuredContent`, by design. The fleet now also includes three v1 repositories.
- **CLAUDE:** `mcp-git-audit` (AGENTS.md line 31), `mcp-ki-kb-notion-mirror` (line 21) and `mcp-m365` (line 106) still declare the 2025-11-25 profile while running the v2 server package, contradicting the package-derived profile rule.

REFRESH last ran **2026-09-02** for the profile reanchor. The official specification index still resolves to **2026-07-28**, its changelog still requires `server/discover` and result discriminators, and the TypeScript SDK release surface still publishes the v1 SDK alongside the v2 server and client package families.

The accepted `mcp-git-audit` pilot proves the modern package boundary: `@modelcontextprotocol/server` 2.0.0, a per-connection `serveStdio` factory, SDK-owned discovery, and `resultType: "complete"` helpers. The five inspected legacy siblings still declare `@modelcontextprotocol/sdk` 1.30.x. The standard therefore selects a package-derived profile instead of making modern-only requirements universal or adding a claimable configuration switch.

The former reanchor watch-item is resolved. Remaining watch-items are rate limiting for any future remote server, uneven structured-output adoption, and proposed annotation vocabulary changes.

REFRESH last ran **2026-07-29**. SDK availability was rechecked on **2026-07-30**. Latest released spec revision: **2026-07-28** (published 2026-07-28, confirmed live). The TypeScript SDK's released v2 package family supports that revision; the six sibling repositories remain on the 1.x package and therefore still deliver 2025-11-25 pending a governed migration decision.

**The staged re-anchor fired.** The live spec index (SPEC) now names **2026-07-28** as `(latest)`, so the watch-item carried since 2026-07-04 is resolved and retired. The RC shipped on its target date.

**Confirmed changed** — the 2026-07-28 changelog (CHANGELOG) lands the staged set and more: MCP becomes stateless (the `initialize` / `notifications/initialized` handshake removed, SEP-2575); protocol sessions and `Mcp-Session-Id` removed from Streamable HTTP (SEP-2567); a new `server/discover` RPC that servers **MUST** implement to advertise protocol versions, capabilities, and identity; **every result now carries a required `resultType`** (`"complete"`, or `"input_required"` for Multi Round-Trip interim results, SEP-2322), which replaces server-initiated `roots/list` / `sampling/createMessage` / `elicitation/create`; `ping`, `logging/setLevel`, and `notifications/roots/list_changed` removed; Tasks moved out of core into an official extension (SEP-2663); SSE resumability and message redelivery removed; an `extensions` field on client and server capabilities; and cacheable list/read results.

**Why the standard does not re-anchor §12–13 to it yet** — the TypeScript SDK now ships v2 packages with 2026-07-28 support, including explicit migration guidance from `@modelcontextprotocol/sdk` v1.x. The six sibling repositories still declare `@modelcontextprotocol/sdk` 1.x and serve stdio through the legacy entry point. The new standard is therefore available but not yet selected: re-anchoring before a pilot proves the v2 migration would make the existing fleet fail without a delivery path. The active GOV-006 item owns that rollout decision; the source list records the evidence, not a false upstream block.

TOOLS/SEC/AUTH and the Community/In-house rows were not re-fetched this pass (fixed dated artifacts, verbatim-confirmed 2026-06-21); their `last reviewed` cells are unchanged. SPEC and CHANGELOG remain current from 2026-07-29; the SDK release surface was verified on 2026-07-30.

**Open watch-items:**

- **Re-anchor §12–13 + §4 to 2026-07-28 through a v2 migration pilot.** SDK support is available; select the rollout profile before making the new protocol requirements universal. The required `resultType` touches each repo's shared `jsonResult` / `errorResult` envelope helpers, and `server/discover` changes the stdio entry point. For the auth repos, assess RFC 9207 `iss` + DCR `application_type` under the selected profile.
- Rate-limiting is a spec MUST kept lower-priority for local stdio servers (revisit if one goes remote).
- **Structured output is now partly adopted, unevenly.** `mcp-git-audit`, `mcp-gsuite`, `mcp-m365`, `mcp-ki-repo-kb-notion-mirror`, and `mcp-housekeeping-claude` declare `outputSchema`; **`mcp-ki-repo-kb-fs` declares none while its shared `jsonResult` emits `structuredContent` for every tool**, which is the WARN condition in §12. (Supersedes the retired "no repo yet declares `outputSchema`" item.)
- Five proposed annotation SEPs (`unsafeOutputHint`, `secretHint`, `trustedHint`, trust/sensitivity, governance/UX) still Draft — gate's four-hint vocabulary stable, no action; watch for any landing in a released spec.

(What past reviews changed in the standard / checklist / native rubric — structured output, the OAuth security invariants, tool-name charset bounds, output sanitization, the relaxed tool-name regex — is in git.)

[spec]: https://modelcontextprotocol.io/specification
[changelog]: https://modelcontextprotocol.io/specification/2026-07-28/changelog
[sdk]: https://github.com/modelcontextprotocol/typescript-sdk/releases
[tools]: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
[sec]: https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices
[auth]: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
[annotations]: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
[csi]: https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf
[github-mcp]: https://github.com/mcp

[semver]: https://semver.org/

[git-tag]: https://git-scm.com/docs/git-tag

[github-release]: https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository

[bun-install]: https://bun.sh/docs/pm/cli/install

[bun-lock]: https://bun.sh/docs/pm/lockfile
