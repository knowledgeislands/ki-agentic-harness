---
id: KI-HARNESS-GOV-072
area: GOV
title: Govern multi-site repositories
theme: governance-consistency
horizon: future
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-17T16:53:09Z
updated_at: 2026-09-17T16:53:09Z
---

# Govern multi-site repositories

## Goal

A repository that deploys more than one website should be able to bring every site under `ki-repo-website` and `ki-repo-website-cloudflare`, rather than governing one and leaving the rest unchecked.

## Context

`site-root` is singular by contract: `standards-website.md:16` makes `[skills.ki-repo-website]` its single owner, omission selects `apps/site`, and an override selects one path. The hosting and content skills consume that one selection. A repository with two deployables therefore has exactly one governed site, and its other sites are invisible to every website check — not failing, simply not looked at.

`krisb/kit-midnight.ninja` hit this when it split its Tower dashboard onto a second Cloudflare Worker. `apps/site-apex` is the declared `site-root`; `apps/site-tower` is a full sibling with its own `package.json`, `eleventy.config.ts`, `wrangler.jsonc`, custom domain and Workers Builds pipeline, and nothing in the rubric examines any of it. The second Worker's `wrangler.jsonc` could declare the wrong assets directory or lose its observability block and the audit would stay green.

A second, sharper edge sits in `ki-repo-website-cloudflare`. WCF's deploy and preview checks require the root aliases to be _exactly_ `bun run --cwd <site-root> deploy` and `preview` (`items/wcf.ts:451` and `:512`), and SITE-5 requires `ki:site:dev` to contain that literal substring. A `ki:` key therefore cannot forward to anything. When the repository above adopted a uniform per-site surface — `self:site:apex:*` and `self:site:tower:*`, so that every site is addressable by name — it could not express `ki:site:deploy` as an alias of `self:site:apex:deploy`. The two keys must each hold the command string directly. The apex site consequently carries two names for one lifecycle with duplicated bodies, which is precisely the drift risk exact-match checking exists to prevent.

The exactness is defensible on its own terms: it stops a governed key being quietly repointed at something else. But combined with a singular `site-root` it forces a repository into either an asymmetric command surface, where one site is addressable by name and one is not, or a duplicated one.

## Boundary

This concerns how many sites a repository may declare and how the governed `ki:site:*` seam relates to a per-site surface. It does not propose removing the exact-match checks or inventing a sixth `ki:site:*` key.

## Current state

`site-root` accepts one path. `ki:site:build`, `:clean`, `:deploy`, `:dev` and `:preview` are capability-owned keys bound to that one path, three of them by exact or substring match on the command string. There is no declared notion of a secondary site.

## Steps

- [ ] Decide whether multi-site is in scope for `ki-repo-website` at all, or whether a repository with two deployables is expected to be two repositories.
- [ ] If in scope, choose the declaration shape: a list of site roots with one marked primary, or a table of named sites keyed by name.
- [ ] Decide what the `ki:site:*` seam means when there is more than one site — primary only, as today, or per-site keys.
- [ ] Decide whether a `ki:` key may delegate to a repository-owned `self:` key holding the same command, which would remove the duplication without weakening the check.
- [ ] Carry the decision through `ki-repo-website`, `ki-repo-website-content` and `ki-repo-website-cloudflare` together; all three consume the same selection.

## Files touched

`skills/repo-structure/ki-repo-website/references/standards-website.md` and its rubric, the equivalents in `ki-repo-website-content` and `ki-repo-website-cloudflare`, their shared contexts, and the `.ki.toml` schema for `[skills.ki-repo-website]`.

## Verify

A two-site repository declares both sites, both are audited, and neither the exactness of the governed seam nor the uniformity of the per-site surface has to be given up to achieve it.

## Dependencies / blocks

None. Related to `KI-HARNESS-GOV-071`: both come from the same single-site assumption, but that one is a detection bug within the current model and this one questions the model.

## Documentation impact

### Decision Records

Yes. Whether the website standards govern one deployable per repository or many is an architectural commitment, and the answer "one, deliberately" deserves recording just as much as the alternative.

### Specifications

The `.ki.toml` shape for `[skills.ki-repo-website]` changes if a multi-site declaration is adopted.

### Guides

None.

### Roadmap

Sibling of `KI-HARNESS-GOV-071`.

## Discussion

### The reporting repository's workaround

`kit-midnight.ninja` settled on three tiers of root script: bare `build` and `clean` fan out across the whole repository through Turborepo; `self:site:<site>:<verb>` addresses one named site and is the uniform surface; and the five `ki:site:*` keys remain the governed seam onto the declared `site-root`. The apex site holds both names, each with the command inline. It works and is documented in that repository's `CLAUDE.md`, but it is a workaround for a constraint rather than a shape anyone would choose.

### Why "just use two repositories" is not obviously right

The two sites share an Eleventy config factory, a brand icon set and a token stylesheet through a workspace package. Splitting the repository would mean publishing that package or duplicating it. The monorepo is the correct engineering answer here; the governance model is what does not yet fit it.
