# Audit Rubric

Line-by-line pass/fail items for auditing a site against the [Eleventy site standard](eleventy-site-standard.md). Run
[`../scripts/audit-websites.ts`](../scripts/audit-websites.ts) for the mechanical items (marked 🔧), then judge the rest by reading. Each
item cites the standard section it verifies.

Severity: **FAIL** (ship-stopper — the site won't build or `dist/` isn't portable), **WARN** (layout / config / Tailwind divergence),
**POLISH** (SEO / consistency) — the shared ladder, defined in `knowledgeislands-engineering`'s
[`enforcement-framework.md`](../../knowledgeislands-engineering/references/enforcement-framework.md) §2.

> **Common toolchain → `knowledgeislands-engineering`.** This rubric is the **site-build delta** only. The Bun mandate, the
> `lint:*`/`deps:*` families, `tsconfig`/`biome`, and the `tsc --noEmit` type-check are the common engineering layer — **run
> `engineering:audit` first**. Serving the built `dist/` is **`knowledgeislands-cloudflare-hosting`** — run its audit too if the site is
> deployed. The repo is fully clean only when every applicable audit passes.

## Contents

- [Stack](#stack-1)
- [Layout](#layout-2)
- [eleventy.config.ts](#eleventyconfigts-4)
- [Tailwind](#tailwind-5)
- [Content](#content-6)
- [SEO](#seo-7)
- [Scripts](#scripts-8)
- [dist/ contract](#dist-contract-9)
- [Longevity & staleness](#longevity--staleness-1)
- [Reporting](#reporting)

## Stack (§1)

- [ ] 🔧 FAIL — `@11ty/eleventy` `^3.x` is a dependency. (§1)
- [ ] 🔧 WARN — **not** an `astro` / `next` / SPA project (those deps absent). (§1)
- [ ] WARN — Nunjucks is the template engine (`htmlTemplateEngine`/`markdownTemplateEngine` = `'njk'`); content is `.md`, logic is `.njk`.
      (§1)
- [ ] WARN — TypeScript runs natively (Bun, or plain `node` on Node ≥ 24 — type stripping stable/unflagged); **no `tsx`**. (§1, §10)
- [ ] POLISH — Lucide is the icon source (passthrough from `node_modules`, initialised client-side). (§1)

## Layout (§2)

- [ ] 🔧 FAIL — exactly one `eleventy.config.ts` at the site root — repo root (flat) or `site/` (subfolder). (§2)
- [ ] 🔧 WARN — `src/` has `_data/`, `_includes/layouts/`, `_includes/partials/`, `assets/css/`. (§2, §3)
- [ ] WARN — the `site:` script prefix is present **iff** the `site/`-subfolder layout is used; otherwise scripts are unprefixed. (§2, §8)
- [ ] WARN — structure (nav, ordering) lives in a typed `_data/*.ts` single source, not hard-coded across templates. (§3)

## eleventy.config.ts (§4)

- [ ] 🔧 FAIL — a transform rewrites absolute internal URLs to relative (the portable-`dist/` transform; `toRelativeOutputUrl` /
      `explicit-index-links` per the standard). (§4, §9)
- [ ] 🔧 WARN — `addDataExtension('ts', …)` registered, calling a function default export. (§4)
- [ ] 🔧 WARN — `addDataExtension('json5', …)` registered. (§4)
- [ ] 🔧 WARN — `eleventyConfig.on('eleventy.before', …)` compiles Tailwind in build mode (CLI invoked), guarded off `serve`/`watch`. (§4)
- [ ] WARN — `addWatchTarget` on the compiled `dist/assets/css/main.css`; Lucide + `external-link-icons` transform present. (§4)
- [ ] POLISH — filters (`jsonDump`/`unique`/`groupBy`) and ordered collections where a section needs them. (§4)

## Tailwind (§5)

- [ ] 🔧 FAIL — **no `tailwind.config.*`** anywhere (config-less Tailwind 4). (§5)
- [ ] 🔧 WARN — `main.css` begins `@import "tailwindcss"`, then imports `tokens.css` (+ page partials). (§5)
- [ ] 🔧 WARN — `tokens.css` exposes its vars to utilities via `@theme inline`. (§5)
- [ ] WARN — `tokens.css` defines the semantic palette in `@layer base :root {}` (`--background`/`--foreground`/`--primary`/… + brand/layout
      vars), sampled from the site's imagery; self-hosted fonts use `@font-face` + `font-display: swap`. (§5)
- [ ] WARN — templates use the tokens; no hard-coded hex values in templates. (§5)

## Content (§6)

- [ ] WARN — pages are Markdown with YAML front matter, grouped into content folders. (§6)
- [ ] WARN — folder front matter (`layout`, section/tag) is set by a `*.11tydata.json`/`.js` cascade file, not repeated per page. (§6)
- [ ] POLISH — structured JSON5 data, where present, is validated at build (Zod) and aborts on a bad record. (§6, optional)

## SEO (§7)

- [ ] 🔧 WARN — a `seo-meta` partial exists under `_includes/partials/`. (§7)
- [ ] WARN — `seo-meta` is **included from `base.njk`** so every page carries canonical + OG + Twitter tags. (§7)
- [ ] POLISH — `noindex` front matter emits the robots meta on non-indexed pages (e.g. `404`). (§7)
- [ ] POLISH — a **public** site ships `sitemap.xml` + `robots.txt` (admin-only sections excluded) and a webmanifest + favicons. (§7)

## Scripts (§8)

- [ ] 🔧 WARN — a build script invokes Eleventy with `--config=eleventy.config.ts`; a dev script runs Tailwind `--watch` + Eleventy
      `--serve --port 3000` via `concurrently`. (`(site:)build`, `(site:)dev`.) (§8)
- [ ] WARN — `clean`, `types` (`tsc --noEmit -p <site root>`), and `verify` (types + build) present, matching the layout's prefix. (§8)

## dist/ contract (§9)

- [ ] 🔧 FAIL — `dist/` is gitignored. (§9)
- [ ] FAIL — the build emits relative internal links (the §4 transform actually fires over `.html`), so `dist/` serves from any root. (§9)
- [ ] WARN — `dist/` is never hand-edited; it is fully regenerated by the build. (§9)
- [ ] POLISH — `assets.directory` for hosting points at this `dist/` — verified by `knowledgeislands-cloudflare-hosting`, named here as the
      seam. (§9)

## Longevity & staleness (§1)

Mirrors the `knowledgeislands-skills` rubric's **LONG-1**.

- [ ] WARN — volatile facts (Eleventy/Tailwind/Lucide versions, the spec idioms the config relies on) sit in `package.json` / the standard,
      not scattered — a bump is one known edit.
- [ ] POLISH — this audit runs against a **current** standard: a cited requirement is confirmed by Mode REFRESH + [`sources.md`](sources.md)
      not having gone stale since its `last reviewed` date.

## Reporting

Produce a findings table grouped by severity, each row: `severity · file:line · what · fix`. Close with: (a) any intentional, documented
divergences you chose **not** to flag (e.g. an internal site skipping sitemap/robots), and (b) a one-line verdict (compliant / minor drift /
blockers). Name the sibling audits that must also pass — `engineering:audit` (toolchain) and, if deployed,
`knowledgeislands-cloudflare-hosting` — for the repo to be fully clean.
