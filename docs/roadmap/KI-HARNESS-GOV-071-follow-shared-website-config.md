---
id: KI-HARNESS-GOV-071
area: GOV
title: Follow shared site config
theme: governance-consistency
horizon: future
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-17T16:53:09Z
updated_at: 2026-09-17T16:53:09Z
---

# Follow shared site config

## Goal

`ki-repo-website-content` should recognise required Eleventy behaviour wherever a site actually obtains it, including from a shared workspace package, rather than only when it is written inline in the site's own config file.

## Context

WEB-12 through WEB-16 are built by one helper, `configRule` in `skills/repo-structure/ki-repo-website-content/scripts/rubric/items/web.ts`, which regex-tests `context.config`. That context field is the raw text of the selected site's config file and nothing else — `contexts/website.ts:203` reads exactly one path. The checks therefore assert that five specific code shapes appear literally in that file: an absolute-to-relative URL transform, `addDataExtension('ts')`, `addDataExtension('json5')`, an `eleventy.before` hook invoking Tailwind, and an `addWatchTarget` for the compiled CSS.

That holds for a single-site repository where the config is the only place such code could be. It stops holding the moment a repository has two sites, because the correct response to two sites is to extract the shared behaviour into a package that both call.

`krisb/kit-midnight.ninja` is the concrete case, and it is named in `ki-repo-website-content`'s own documentation as a canonical reference for this skill. It split its Tower dashboard onto a second Worker, moved the shared Eleventy behaviour into `packages/view-common`, and reduced each site's `eleventy.config.ts` to a call to `applyViewCommon()` plus that site's own asset roots. Every behaviour WEB-12..16 requires is present and was evidenced by a byte-comparison of the built output across the migration. The audit nonetheless reports WEB-12 as FAIL and WEB-13..16 as WARN against `apps/site-apex/eleventy.config.ts`.

The failure mode is the one that matters most for a rubric's credibility: it is not that a check is too strict, but that doing the better thing scores worse than not doing it. A repository can clear all five by copying the same code into both site configs. The rubric currently rewards duplication.

## Boundary

This is about how the five content checks locate the behaviour they require, not about what behaviour is required. Do not relax or remove any of WEB-12..16, and do not extend this to checks that legitimately concern the site config file as a file.

## Current state

`configRule` takes a `RegExp` and tests it against `context.config`. The context builds `config` from a single `read(siteAt(cfgName))`. There is no representation of the site's import graph, of workspace packages, or of any file other than the config itself.

## Steps

- [ ] Decide the detection seam: follow relative and workspace-package imports from the site config one level, or read a declared list of shared config modules, or treat a call into a workspace package as sufficient evidence that the rubric cannot see inside and downgrade to judgment.
- [ ] Extend `WebsiteContext` with whatever that decision needs, keeping the existing single-file case unchanged.
- [ ] Rework `configRule` to search the resolved set rather than one string.
- [ ] Cover the multi-site shape in `website.test.ts`: behaviour inline (passes today), behaviour in a shared package (must pass after), behaviour absent from both (must still fail).

## Files touched

`skills/repo-structure/ki-repo-website-content/scripts/rubric/items/web.ts`, `scripts/rubric/contexts/website.ts`, the matching tests, and `references/standards-website-content.md` plus the generated `references/rubric.md` if the standard's wording changes.

## Verify

`ki repo audit --skill ki-repo-website-content --repo .` against `kit-midnight.ninja` reports PASS for WEB-12..16 without any code moving back into the site configs, and a synthetic fixture with the behaviour genuinely missing still fails.

## Dependencies / blocks

None. Related to `KI-HARNESS-GOV-072`, which records the same single-site assumption in the website core and hosting skills; the two are separable.

## Documentation impact

### Decision Records

A Decision Record is warranted if the answer is "the rubric does not follow imports and says so", because that is a durable statement about how far mechanical checks reach into a codebase.

### Specifications

None.

### Guides

None.

### Roadmap

Sibling of `KI-HARNESS-GOV-072`.

## Discussion

### Why not just require the code inline

Because the standard's own logic points the other way. `ki-engineering` requires workspace repositories to run stages through Turborepo, which presumes shared packages with a dependency graph; `ki-repo-website` documents `apps/site` as the canonical site root, which presumes an `apps/*` layout with siblings. A rubric that then requires each sibling to carry its own copy of the shared behaviour contradicts the structure the rest of the harness asks for.

### The cheapest honest fix

If following imports is too much machinery, the smaller move is to detect that the site config calls into a workspace package at all, and in that case report these five as judgment rather than mechanical. That loses the mechanical assertion but stops the rubric from making a confident false statement, which is the worse of the two failures.
