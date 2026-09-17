---
id: KI-HARNESS-GOV-072
area: GOV
title: Govern multi-site repositories
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: f97e34017e7d58a17d83f422be7f15859b9b3db8
created_at: 2026-09-17T16:53:09Z
updated_at: 2026-09-17T18:22:51Z
---

# Govern multi-site repositories

## Goal

A repository that deploys more than one website should be able to declare and audit every site through `ki-repo-website` and its implementation and hosting overlays, while retaining one stable primary `ki:site:*` command seam.

## Context

`[skills.ki-repo-website].site-root` selects exactly one path, defaulting to `apps/site`. The website core, content, and Cloudflare skills consume that one selection, so additional deployable sites are invisible rather than non-conforming.

`krisb/kit-midnight.ninja` exposed the gap after splitting the Tower dashboard onto a second Cloudflare Worker. `apps/site-apex` is governed; the complete sibling `apps/site-tower` has its own package, Eleventy configuration, Wrangler configuration, custom domain, and Workers Builds pipeline but is outside every website audit.

The existing root aliases also require literal commands for the selected site. A uniform repository-owned `self:site:<name>:<verb>` surface therefore cannot be the terminal source for the primary `ki:site:*` aliases, forcing duplicate script bodies even when both names intentionally target the same command.

## Boundary

Do not remove the implicit single-site `apps/site` default, require every repository to adopt named sites, invent another unqualified `ki:site:*` lifecycle verb, or let an alias pass without validating its terminal command. Do not make assumptions about sites that are absent from the explicit registry.

## Current state

All three website contexts expose one `siteRoot`. Their rubric families produce one site subject, overlay opt-ins have no per-site selection, and exact command checks compare only the literal root script body.

## Locked decisions

- Multi-site repositories are in scope and use a named registry with an explicit primary site:

  ```toml
  [skills.ki-repo-website]
  primary-site = "apex"

  [skills.ki-repo-website.sites]
  apex = "apps/site-apex"
  tower = "apps/site-tower"
  ```

- Existing keyless configuration and `site-root` remain the complete single-site contract. `site-root` is mutually exclusive with `sites` and `primary-site`.
- Site names use lower kebab-case; roots are unique, safe, repository-relative physical directories; `primary-site` must name one declared site.
- A content or hosting overlay applies to all registered sites by default and may use `sites = ["apex"]` to select a non-empty subset. Unknown or duplicate names fail.
- The five unqualified root `ki:site:*` keys remain the public seam for the primary site. Named `self:site:<site>:<verb>` keys remain repository-owned and optional.
- A primary `ki:site:*` key may delegate through exactly one `bun run self:site:<primary>:<verb>` alias. The audit resolves that one hop and validates the terminal command with the same exactness as an inline command; arbitrary or recursive forwarding fails.
- Every declared site receives its own core and selected-overlay evidence and outcomes. Conform never guesses or creates a multi-site registry.

## Steps

- [ ] Record the multi-site registry, overlay selection, primary seam, and one-hop alias rationale in a Decision Record.
- [ ] Add a shared typed site-selection model and validation fixtures, then consume it from the website core, content, and Cloudflare contexts without copying parsers.
- [ ] Generalise core rubric subjects and path checks across every declared site while preserving the legacy single-site output.
- [ ] Generalise content and Cloudflare overlays across all or explicitly selected site names, including per-site packages, configuration, generated output, and Wrangler evidence.
- [ ] Resolve one primary `self:` alias hop before the existing exact command comparisons; reject missing, mismatched, chained, or cyclic aliases.
- [ ] Update standards, mode documentation, generated rubrics, and `.ki.toml` examples for single-site and multi-site forms.
- [ ] Prove the contract with synthetic one-site, two-site, subset-overlay, malformed-registry, and alias fixtures, then audit `kit-midnight.ninja`.

## Files touched

- A shared website site-selection module and focused tests under `skills/repo-structure/`
- `ki-repo-website`, `ki-repo-website-content`, and `ki-repo-website-cloudflare` rubric contexts, items, and focused tests
- The three skills' standards, mode documentation, and generated rubric references
- One new Decision Record allocated at implementation time
- This work item

## Verify

- Legacy keyless and explicit `site-root` fixtures retain their current outcomes and publication shape.
- A two-site registry audits both sites in core and both selected overlays, with findings attributed to the correct name and root.
- Overlay subset fixtures audit only declared selected names; unknown, empty, duplicate, unsafe, or conflicting declarations fail.
- Inline primary commands and validated one-hop `self:` aliases produce the same result; mismatched or chained aliases fail.
- The two real `kit-midnight.ninja` sites are both audited without duplicating terminal command bodies.
- Each affected skill's focused tests and `ki dev skill rubric <skill>` pass, followed by `bun run test`, `bunx tsc --noEmit`, and `ki repo audit --skill ki-skills --repo .`.

## Dependencies / blocks

No delivery blocker. [KI-HARNESS-GOV-071](KI-HARNESS-GOV-071-follow-shared-website-config.md) is a recommended earlier implementation because its resolved-source collection must survive the later multi-site context change, but either item can be implemented and verified independently.

## Documentation impact

### Decision Records

Create a Decision Record because the registry shape, overlay applicability, and primary command seam are durable public governance choices.

### Specifications

Update the three website standards and their generated rubrics. No separate specification area is needed because those standards are the accepted behavioural contract.

### Guides

Update EDUCATE and configuration examples for the named registry, overlay subsets, and primary alias behavior. Repository-specific deployment guides remain outside this item.

### Roadmap

Keep [KI-HARNESS-GOV-071](KI-HARNESS-GOV-071-follow-shared-website-config.md) separate. Capture mixed implementation or hosting adapters only if implementation proves the overlay-subset model insufficient.

## Discussion

### Registry shape

A named map provides stable identities for findings, overlay selection, and repository-owned scripts. Keeping `site-root` as the single-site form avoids forcing ceremony onto existing repositories and avoids two simultaneous sources of primary-root truth.

### Command ownership

The capability continues to own only the unqualified `ki:site:*` seam. Allowing one verified hop into a repository-owned `self:` key removes duplicate bodies without allowing quiet repointing: exactness applies to the resolved terminal command, not merely to the alias text.

### Composition

Overlay selection defaults to all declared sites but permits an explicit subset. This covers the evidenced two-Eleventy/two-Cloudflare repository and leaves room for mixed implementations or hosting adapters without coupling their identities into the core registry.
