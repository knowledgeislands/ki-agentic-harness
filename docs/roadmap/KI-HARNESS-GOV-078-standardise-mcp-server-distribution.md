---
id: KI-HARNESS-GOV-078
area: GOV
title: Standardise MCP server distribution
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: d3e2d80d1f9fe7afecd96e9f88bda9343f7218bd
transferred_from: ki-website
created_at: 2026-09-21T07:33:33Z
updated_at: 2026-09-24T08:04:41Z
---

## Goal

A Knowledge Islands MCP server can be installed by naming its owner and repository in one command, at a deliberate version, without publishing the server itself to npm or another package registry.

## Context

`ki-repo-mcp` governs how an MCP server repository is shaped but says nothing about how a reviewed server becomes a versioned local installation. The current estate therefore relies on a manual source-checkout flow: clone or open the repository, run `bun install`, build it, and bind a client to an absolute `dist/mcp-server/index.js` path. That is workable for development but gives an operator no stable installed location, recorded source revision, atomic activation, or supported update path.

Package metadata remains useful as a build and executable contract, but it must not be mistaken for a publication decision. Repository basename and GitHub owner are the durable install identity; a SemVer tag and immutable commit identify the version. The installer may use the repository's existing locked dependencies while building locally, but it does not publish the server package or add a new runtime dependency on a Knowledge Islands registry package.

KI Website raised the handoff. Its `/projects/` directory lists servers honestly as `availability: source`, because no governed named installer exists. Website discovery can advertise a stable command only after the Harness defines the installable repository contract and the owning tool implements it.

The replan uses the existing source distribution rather than introducing a public registry. A named install resolves an explicit `owner/repository` and optional SemVer tag, checks out or downloads that immutable revision, runs the repository's governed locked build, stages the result under a versioned XDG data path, records provenance, and atomically changes the active version. Omitting the version may resolve only an owner-designated stable GitHub release; it never follows an untagged branch head.

## Boundary

This item defines the repository-side contract in `ki-repo-mcp`. It does not release or install any server. Each MCP repository remains the authority for its tags and releases, while a separate receiver-owned `tools-ki` item owns the `ki manage mcp install` command, local installation layout, activation, rollback, and uninstall behaviour.

It does not change released-tool distribution, live MCP bindings, credentials, or client configuration. It does not require the official MCP Registry, `server.json`, npm publication, Homebrew, or a compiled single-file executable. Those may be evaluated separately without becoming load-bearing dependencies of local MCP installation.

Private repositories remain supported when the local Git credentials can read the named revision. Website availability changes and estate rollouts remain receiver-owned follow-on work after the repository contract and installer both exist.

## Current state

`ki-repo-mcp` governs repository shape but has no versioned source-install contract, release-readiness checks, provenance record, or safe hand-off to an installer. Current servers are locally buildable but not independently installable by name. The first delivery therefore belongs in the Harness contract and fixtures; executable installation belongs in `tools-ki`.

## Steps

- [x] Add a focused MCP source-release standard covering owner/repository identity, SemVer tags, immutable commit evidence, locked builds, the MCP entry point, and the provenance an installer must retain.
- [x] Define the repository-to-installer hand-off, including a minimal machine-readable release descriptor only where existing `.ki.toml`, `package.json`, and Git evidence cannot supply the field without duplication.
- [x] Add WARN-level audit items for source-install readiness and safe CONFORM proposals for deterministic generated material; refuse version, identity, release, or workflow changes that require repository-owner judgment.
- [x] Record the no-registry distribution decision and its split of authority between `ki-repo-mcp`, each server repository, `tools-ki`, bindings, and website discovery.
- [x] Add fixtures for public and private repositories, explicit and omitted versions, missing or mutable revisions, build-contract drift, provenance mismatch, and unsafe-to-conform cases, then regenerate the published rubric.
- [x] Create or enrich the receiver-owned `tools-ki` roadmap item for the named installer without implementing that command from the Harness.

## Files touched

- `skills/repo-structure/ki-repo-mcp/SKILL.md`
- `skills/repo-structure/ki-repo-mcp/references/standards-mcp-distribution.md`
- `skills/repo-structure/ki-repo-mcp/references/sources.md`
- `skills/repo-structure/ki-repo-mcp/references/rubric.md`
- `skills/repo-structure/ki-repo-mcp/scripts/rubric/items/`
- `skills/repo-structure/ki-repo-mcp/scripts/rubric/contexts/`
- `docs/decisions/`
- `docs/roadmap/KI-HARNESS-GOV-078-standardise-mcp-server-distribution.md`

## Verify

- Focused `ki-repo-mcp` rubric tests cover every source-release readiness and refusal case.
- The standard proves that npm publication and official-registry listing are optional and cannot become hidden prerequisites.
- `ki dev skill rubric ki-repo-mcp` reproduces the committed rubric.
- `ki repo audit --skill ki-repo-mcp --repo .` and `ki repo audit --skill ki-work-roadmap --repo .` pass.
- `ki repo audit --skill ki-skills --repo .` passes.
- `bun run test` and `bunx tsc --noEmit` pass.

## Dependencies / blocks

No implementation dependency blocks the Harness contract. The named installer cannot be delivered here: `tools-ki` must separately accept and implement the hand-off before a website or client guide advertises the command. Repository credentials, chosen release versions, tags, and rollout remain receiver-owned.

## Documentation impact

### Decision Records

Record the decision to use governed, versioned source installation rather than publish Knowledge Islands MCP servers to npm, including the authority split and reversal path.

### Specifications

No separate specification is required for the repository side; the `ki-repo-mcp` standard and generated rubric own it. The installer will own its user-facing behaviour in `tools-ki`.

### Guides

Add concise maintainer guidance for cutting an installable tagged release. User installation guidance belongs with the eventual `tools-ki` command.

### Roadmap

Create or enrich one receiver-local `tools-ki` installer item and leave per-server release adoption to independently reviewable local records. Do not create speculative migration items before the contract identifies a real gap.

## Review

### Delivered

Delivered the approved repository-side source-install contract from immutable baseline `d3e2d80d1f9fe7afecd96e9f88bda9343f7218bd`. The Harness now defines release identity, resolution, locked builds, provenance, authority boundaries, WARN-level readiness evidence, and maintainer procedure without publishing an MCP package or implementing the installer.

### Summary of changes

Added the `ki-repo-mcp` source-distribution standard, a `DIST-1` generated-rubric family, live Git and lockfile evidence, a pure installer-candidate assessment model, focused fixtures, the no-registry Governance Decision Record, and the MCP source-release developer guide. Updated the generated rubric and remediation inventory. Captured the receiver-owned installer as `KI-TOOL-CLI-082` in `tools-ki` commit `7dd233f`.

The implementation concluded that no repository release descriptor is needed: `.ki.toml`, `package.json`, the committed lockfile, and Git already provide every source fact. The installer-owned provenance receipt is the only new machine-readable record.

### Verification

- Focused `ki-repo-mcp` rubric suite: 23 tests passed.
- Full Harness suite: 768 tests passed across 138 files; 3,307 assertions passed.
- `bunx tsc --noEmit`: passed.
- Generated rubric publication and reproduction through `ki dev skill rubric ki-repo-mcp --write`: passed with no subsequent drift.
- `ki-decision-records`, `ki-skills`, `ki-authoring`, and `ki-work-roadmap` audits: passed.
- Live `ki-repo-mcp` audit of `mcp-git-audit`: no failures and the expected single release-readiness warning because its development HEAD is not tagged `v0.9.0`.
- `tools-ki` authoring and roadmap audits after receiver capture: passed.

The planned `ki repo audit --skill ki-repo-mcp --repo .` check cannot target the Harness itself because the Harness does not declare the detected MCP-repository skill. The declared `mcp-git-audit` consumer and focused hosted-rubric tests provide the applicable execution evidence instead.

### Outstanding concerns

The `tools-ki` installer does not exist yet. `KI-TOOL-CLI-082` is deliberately Triage/draft until its XDG layout, CLI surface, stable-release lookup, receipt schema, recovery, and garbage-collection behaviour are shaped and adopted. No Harness-side concern blocks acceptance.

### Post-change review

The delivered contract satisfies the approved Harness boundary and keeps npm, official MCP Registry metadata, release assets, MCPB, compiled binaries, and Homebrew optional. Audit severity is proportionate: development checkouts remain valid with a clear WARN rather than failing repository governance. The item is ready for acceptance review.

### Mini recap

MCP release readiness is now governed by source evidence and immutable provenance. The executable product work is durably routed to `tools-ki`; server-by-server adoption remains independent follow-on work once the installer is available.

## Discussion

### Planning decisions

The load-bearing channel is a tagged Git repository and owner-controlled GitHub release, not publication of the server package to npm. The install identity is `owner/repository`; the version is an exact SemVer tag resolving to an immutable commit. An omitted version may resolve only the repository owner's stable release marker, never a mutable default branch.

`ki-repo-mcp` owns the repository's readiness and hand-off evidence. The repository owner owns the release. `tools-ki` owns resolution, local build staging, provenance recording, atomic activation, rollback, and uninstall. `ki-binding` continues to own client inventory and rendering; it must consume an installed entry point rather than become an installer. Website discovery may link the command only after both sides are delivered.

### Installation contract

The first contract keeps the current, proven Bun-install and Node-run model. The installer resolves an exact source revision, stages it outside the working checkout, installs from the committed lockfile, runs the governed build, verifies the declared MCP entry point, and activates the completed version only after every step succeeds. It records owner, repository, tag, commit, package version, entry point, installation time, and active-version link so updates and rollback are inspectable.

The Harness does not define the final XDG path or command flags; those are executable product behaviour for `tools-ki`. It does define the minimum evidence the installer can rely on and forbids mutable branch installation from being presented as a released version.

### Optional discovery surfaces

The official MCP Registry and `server.json` can remain useful discovery metadata, but neither is an installation transport and neither becomes required. npm metadata may remain in `package.json` because the repository is a TypeScript package, but an npm package release is not implied. MCPB or compiled bundles are later optimisations only if they preserve the same provenance and rollback contract.

### Scope of the skill delta

A separate `standards-mcp-distribution.md` keeps installable-release concerns distinct from source layout. Existing `.ki.toml`, `package.json`, lockfile, and Git evidence supply every repository-side field, so no release descriptor or workflow material is generated. Existing deterministic package entry-point repairs remain safe CONFORM actions; version, tag, release, identity, credential, and workflow decisions remain diagnostic and repository-owner controlled.

### Alternatives considered

Publishing the servers to npm would make `npx` convenient, but it claims public package names, inserts a registry into a previously local install path, and creates release and support obligations that are unnecessary for this estate. It is explicitly rejected as the default.

Shipping self-contained binaries or MCPB bundles could later reduce local build cost. It is not the first slice because the nine servers do not yet share one proven packaging shape and some include OAuth or platform-sensitive behaviour. The source-install contract is reversible and works with their current build model.

Leaving installation as manual clone/build/bind instructions preserves the current failure mode: no stable active version, no provenance receipt, no atomic update, and no one-command route. That option is rejected.

### Decisions fixed for implementation

- No Knowledge Islands MCP package publication is required.
- Exact Git tags and immutable commits are the release identity; branch heads are development inputs only.
- The Harness defines repository evidence, while `tools-ki` implements local installation and lifecycle behaviour.
- Official-registry metadata is optional discovery, never the load-bearing transport.
- Each server owner chooses its first release version and release timing.
