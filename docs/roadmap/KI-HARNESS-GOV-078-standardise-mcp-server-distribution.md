---
id: KI-HARNESS-GOV-078
area: GOV
title: Standardise MCP server distribution
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
transferred_from: ki-website
created_at: 2026-09-21T07:33:33Z
updated_at: 2026-09-22T00:03:44Z
---

## Goal

A Knowledge Islands MCP server can be installed by naming it, the way a released command-line tool can. Someone who finds one should get a single command that resolves, at a version its owner deliberately recommends, rather than instructions to clone a repository and build it.

## Context

`ki-repo-mcp` governs how an MCP server repository is shaped but says nothing about how one is released. Its `standards-mcp-servers.md` requires `CHANGELOG.md` to be present and non-empty and stops there; no reference covers tagging, package publication, or registry listing. The consequence is visible across the six public servers — `mcp-git-audit`, `mcp-gsuite`, `mcp-ki-kb-fs`, `mcp-ki-kb-notion-mirror`, `mcp-m365`, `mcp-housekeeping-claude`. Every one is already publish-shaped: a `bin` entry, `files: ["dist"]`, a non-empty changelog, all sitting at `0.9.0`. None has a git tag, a release workflow (only `ci.yml` and `dependabot-auto-merge.yml`), a published package, or a `server.json`. Each README carries an npm version badge for a package that does not exist.

Absent guidance also lets identity drift. `mcp-ki-kb-fs` declares `@knowledgeislands/mcp-ki-kb-fs` in `package.json` while its README names `knowledgeislands/mcp-kb-fs` in every badge and package reference. Nothing catches this today because nothing claims authority over it.

KI Website raised the handoff. Its new `/projects/` directory lists each server honestly as `availability: source`, telling readers to clone and build, because advertising an install command that fails resolution would be worse than admitting there is not one. Those entries stay wrong-shaped until the servers actually release.

The external landscape is settled enough to conform to rather than invent. Ordinary SemVer tagging and package publication is the baseline: for a TypeScript stdio server the channel is npm, and clients invoke it as `npx -y @scope/server`. On top of that sits one MCP-specific and metadata-only layer — a root `server.json` published to the official MCP Registry, which hosts no artefacts and exists to be consumed by downstream aggregators. Optional surface-specific bundles (MCPB) are a separate question that need not be settled here.

## Boundary

This item bakes the standard into the skill. It does not release any server: once `ki-repo-mcp` audits and conforms distribution, the six repositories each cut their own tags and publish on their own schedule, and each remains the authority for what it released.

It does not touch the released-tool contract. Command-line tools distribute through the Homebrew tap and a pinned installer endpoint, governed by KI Website's tool-routes contract; MCP servers distribute through a package registry. The two should share release discipline, not transport.

It does not decide whether private MCP repositories publish anything, and it does not cover the reciprocal website work of advancing directory entries once packages exist.

## Current state

`ki-repo-mcp` governs repository shape but has no distribution standard, release-workflow checks, package-identity rule, or official-registry metadata checks. Six public MCP repositories are publish-shaped but unreleased, so the first delivery belongs in the Harness contract and its fixtures rather than in those repositories.

## Steps

- [ ] Refresh the official MCP Registry, npm trusted-publishing, and GitHub OIDC sources already relevant to the captured requirements.
- [ ] Add a focused MCP distribution standard that makes npm the required load-bearing channel and treats official-registry listing as recommended while that registry remains preview infrastructure.
- [ ] Require package identity to use `@knowledgeislands/<repository-basename>`, exact version agreement between package and registry metadata, an installable `bin`, explicit published files, and a release workflow with provenance-capable authentication.
- [ ] Add WARN-level audit items for distribution readiness and safe CONFORM proposals for missing generated metadata or workflow files; refuse ambiguous identity or version rewrites.
- [ ] Add fixtures for ready, missing, mismatched, private, metadata-only, and unsafe-to-conform repositories, then regenerate the published rubric.

## Files touched

- `skills/repo-structure/ki-repo-mcp/SKILL.md`
- `skills/repo-structure/ki-repo-mcp/references/standards-mcp-distribution.md`
- `skills/repo-structure/ki-repo-mcp/references/sources.md`
- `skills/repo-structure/ki-repo-mcp/references/rubric.md`
- `skills/repo-structure/ki-repo-mcp/scripts/rubric/items/`
- `skills/repo-structure/ki-repo-mcp/scripts/rubric/contexts/`

## Verify

- Focused `ki-repo-mcp` rubric tests cover every new readiness and refusal case.
- `ki dev skill rubric ki-repo-mcp` reproduces the committed rubric.
- `ki repo audit --skill ki-skills --repo .` passes.
- `bun run test` and `bunx tsc --noEmit` pass.

## Dependencies / blocks

No implementation dependency blocks the Harness contract. Publication credentials, release versions, tags, and registry submissions remain receiver-owned rollout work and are explicitly outside this item.

## Documentation impact

### Decision Records

Amend or add a Decision Record only if implementation changes the existing repository-kind ownership boundary rather than documenting its distribution projection.

### Specifications

No separate specification is required; the `ki-repo-mcp` standard and generated rubric own the accepted repository contract.

### Guides

Add concise release guidance only where an operator must perform steps that cannot be safely conformed automatically.

### Roadmap

Capture receiver-local publication work separately after the Harness contract lands; do not include cross-repository releases in this item.

## Discussion

### Planning decisions

npm is the required install channel; official-registry listing is recommended rather than mandatory until its preview lifecycle stabilises. Public package identity matches the repository basename under the `@knowledgeislands` scope. The standard requires version consistency but does not choose a receiver's first release version. MCP-specific release readiness belongs to `ki-repo-mcp`; any broader tool-release rule is separate work.

### What the official registry actually requires

A root `server.json` declares a reverse-DNS `name` — `io.github.knowledgeislands/<repo>` under the GitHub namespace — a `version`, and a `packages[]` entry naming the npm identifier, its version, and the transport. Namespace ownership is verified, which is what prevents impersonation. Publication uses the `mcp-publisher` CLI, and CI can authenticate through GitHub OIDC with `id-token: write` rather than storing a token.

The rules that differ from ordinary package publishing are worth encoding as rubric checks:

- the `server.json` version must be unique per publication and is immutable once published; metadata cannot be amended in place, only republished at a new version;
- version _ranges_ (`^1.2.3`, `1.x`, `>=1.2.3`) are rejected outright;
- SemVer is recommended but not required — and a non-SemVer string will be marked "latest" even where it should sort earlier, so the recommendation is effectively load-bearing;
- `server.json.version` should track the npm package version, with the server version indicating the overall release where several packages exist;
- metadata-only republishes should use a semantic prerelease (`1.2.3-1`), noting that a prerelease published after its release will not be marked latest.

Git tags are irrelevant to the registry itself. They matter for house release discipline, not for conformance, and the standard should say so rather than implying the registry enforces them.

### Scope of the skill delta

Two shapes are available. A `standards-mcp-distribution.md` reference alongside the existing structure standard keeps the concerns legible and gives the rubric somewhere obvious to hang publication checks. Folding it into `standards-mcp-servers.md` keeps one document per repository kind but mixes "how the repository is laid out" with "how an artefact reaches a user", which are audited at different moments.

Either way the conform mode needs to be able to add what is missing — a release workflow, a `server.json`, corrected package identity — rather than only reporting it, or the six repositories will each solve it differently again.

### Alternatives considered

Publishing to npm without listing in the official registry would deliver the install command with less ceremony, since the registry is metadata pointing at npm anyway. It costs discovery: the registry is designed for aggregator consumption, so absence from it means absence from the surfaces that read it. The registry is also still in preview with possible data resets, which argues for npm as the load-bearing channel and registry listing as an additive step that a reset cannot break.

Leaving distribution to each repository is the status quo, and the evidence above is what it produces: six repositories that independently reached the same publish-ready shape and then independently failed to publish.

### Questions resolved by the plan

- Does the standard mandate registry listing, or require npm and recommend the registry?
- Is `1.0.0` the right first tag for servers sitting at `0.9.0` with full coverage, or does a `0.x` publication better match a surface that may still move?
- Should package identity be required to match the repository name exactly? That would settle `mcp-ki-kb-fs` by rule rather than by correction.
- `tools-mgit` has no release workflow either, while `tools-ki` does. Is release-workflow presence a general `ki-engineering` concern that `ki-repo-mcp` merely specialises?
