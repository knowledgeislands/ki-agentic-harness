<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — website

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical; this file is generated from the in-memory catalogue. Edit the item definitions, then rerun `scripts/rubric/publish.ts`.

Line-by-line criteria for auditing ki-website. Classifications are derived from item aspects: **[M]** mechanical and **[J]** judgment. Sources are cited as declared by each canonical item.

## Contents

- [WEB — Eleventy website standard](#web--eleventy-website-standard)

## WEB — Eleventy website standard

→ [standard](standards.md)

The static-site stack, workspace layout, generated output, and sustainable operating boundary.

- **WEB-1 [M] — Eleventy dependency** — `@11ty/eleventy` `^3.x` is a dependency. (standards.md)
- **WEB-2 [M] — Eleventy rather than SPA stack** — **not** an `astro` / `next` / SPA project (those deps absent). (standards.md)
- **WEB-3 [M] — native TypeScript runner** — TypeScript runs natively (Bun, or plain `node` on Node ≥ 24 — type stripping stable/unflagged); **no `tsx`** (the `tsx` dep / `tsx/esm` runner is mechanically flagged; the "runs natively" claim is judged). (standards.md)
- **WEB-4 [J] — Nunjucks template engine** — Nunjucks is the template engine (`htmlTemplateEngine`/`markdownTemplateEngine` = `'njk'`); content is `.md`, logic is `.njk`. (standards.md)
  - _Review prompt:_ Does the configuration use Nunjucks and keep content and template logic in their intended forms?
- **WEB-5 [J] — Lucide icon source** — Lucide is the icon source (passthrough from `node_modules`, initialised client-side). (standards.md)
  - _Review prompt:_ Is Lucide the icon source and is it wired through the intended passthrough/client pattern?
- **WEB-6 [M] — site workspace configuration** — exactly one `eleventy.config.ts`, under `site/` (the workspace package — every house site is a monorepo, never flat; a flat repo-root config is WARN). (standards.md)
- **WEB-7 [M] — roadmap** — `ROADMAP.md` present. (standards.md)
- **WEB-8 [J] — workspace declaration** — the root `package.json` declares a `workspaces` array that includes `site` (the monorepo shape, engineering §0; not yet mechanically checked). (standards.md)
  - _Review prompt:_ Does the root workspace declaration include `site`?
- **WEB-9 [M] — source layout** — `src/` (under `site/`) has `_data/`, `_includes/layouts/`, `_includes/partials/`, `assets/css/`. (standards.md)
- **WEB-10 [J] — site script prefix** — every site script carries the `site:` prefix (driven by the monorepo shape, not by observing the folder). (standards.md)
  - _Review prompt:_ Do site scripts carry the required `site:` prefix?
- **WEB-11 [J] — typed structure data** — structure (nav, ordering) lives in a typed `_data/*.ts` single source, not hard-coded across templates. (standards.md)
  - _Review prompt:_ Does typed `_data` own navigation and ordering rather than repeated template literals?
- **WEB-12 [M] — portable URL transform** — a transform rewrites absolute internal URLs to relative (the portable-`dist/` transform; `toRelativeOutputUrl` / `explicit-index-links` per the standard). (standards.md)
- **WEB-13 [M] — TypeScript data extension** — `addDataExtension('ts', …)` registered, calling a function default export. (standards.md)
- **WEB-14 [M] — JSON5 data extension** — `addDataExtension('json5', …)` registered. (standards.md)
- **WEB-15 [M] — Tailwind lifecycle hook** — `eleventyConfig.on('eleventy.before', …)` compiles Tailwind in build mode (CLI invoked), guarded off `serve`/`watch`. (standards.md)
- **WEB-16 [M] — CSS watch target** — `addWatchTarget` on the compiled `dist/assets/css/main.css` (mechanically checked); Lucide + `external-link-icons` transform present (judged). (standards.md)
- **WEB-17 [J] — configuration helpers** — filters (`jsonDump`/`unique`/`groupBy`) and ordered collections where a section needs them. (standards.md)
  - _Review prompt:_ Where the content needs them, do filters and ordered collections use the documented patterns?
- **WEB-18 [M] — config-less Tailwind** — **no `tailwind.config.*`** anywhere (config-less Tailwind 4). (standards.md)
- **WEB-19 [M] — Tailwind import pair** — `main.css` begins `@import "tailwindcss"`, then imports `tokens.css` (+ page partials). (standards.md)
- **WEB-20 [M] — token utility exposure** — `tokens.css` exposes its vars to utilities via `@theme inline`. (standards.md)
- **WEB-21 [J] — semantic design tokens** — tokens.css defines the semantic palette in `@layer base :root {}` (`--background`/`--foreground`/`--primary`/… + brand/layout vars), sampled from the site's imagery; self-hosted fonts use `@font-face` + `font-display: swap`. (standards.md)
  - _Review prompt:_ Do semantic tokens and self-hosted fonts follow the standard rather than embedding arbitrary presentation values?
- **WEB-22 [J] — template token use** — templates use the tokens; no hard-coded hex values in templates. (standards.md)
  - _Review prompt:_ Do templates consume semantic tokens without hard-coded hex colours?
- **WEB-23 [J] — Markdown content** — pages are Markdown with YAML front matter, grouped into content folders. (standards.md)
  - _Review prompt:_ Are pages Markdown with YAML front matter and grouped into sensible content folders?
- **WEB-24 [J] — folder data cascade** — folder front matter (`layout`, section/tag) is set by a `*.11tydata.json`/`.js` cascade file, not repeated per page. (standards.md)
  - _Review prompt:_ Do cascade data files own repeated folder-level front matter?
- **WEB-25 [J] — JSON5 validation** — structured JSON5 data, where present, is validated at build (Zod) and aborts on a bad record. (standards.md)
  - _Review prompt:_ Where structured JSON5 exists, is it validated during the build and does invalid data stop the build?
- **WEB-26 [M] — SEO metadata partial** — a `seo-meta` partial exists under `_includes/partials/`. (standards.md)
- **WEB-27 [J] — site-wide SEO metadata** — `seo-meta` is **included from `base.njk`** so every page carries canonical + OG + Twitter tags. (standards.md)
  - _Review prompt:_ Does base.njk include seo-meta so all pages receive canonical, Open Graph, and Twitter metadata?
- **WEB-28 [J] — noindex metadata** — `noindex` front matter emits the robots meta on non-indexed pages (e.g. `404`). (standards.md)
  - _Review prompt:_ Does noindex front matter emit robots metadata on intentionally non-indexed pages?
- **WEB-29 [J] — public site discovery assets** — a **public** site ships `sitemap.xml` + `robots.txt` (admin-only sections excluded) and a webmanifest + favicons. (standards.md)
  - _Review prompt:_ Where the site is public, does it ship and scope the required discovery and application assets?
- **WEB-30 [M] — site build and development scripts** — a build script invokes Eleventy with `--config=eleventy.config.ts`; a dev script runs Tailwind `--watch` + Eleventy `--serve --port 3000` via `concurrently`. (`ki:site:build`, `ki:site:dev`.) (standards.md)
- **WEB-31 [M] — development script fan-out** — the `concurrently` dev script fans out to `ki:site:dev:css` (the Tailwind watcher) and `ki:site:dev:serve` (the Eleventy server). (standards.md)
- **WEB-32 [M] — site cleanup script** — `ki:site:clean` present. TypeScript checking belongs inside `ki:engineering:audit`; the aggregate gate is `ki:audit`, not a parallel site-specific verify script. (standards.md)
- **WEB-33 [M] — dist ignore** — `site/dist/` is gitignored (entry in `site/.gitignore` or as `site/dist/` from the repo root). (standards.md)
- **WEB-34 [J] — portable generated links** — the build emits relative internal links (the §4 transform actually fires over `.html`), so `dist/` serves from any root. (standards.md)
  - _Review prompt:_ Does the built HTML actually contain portable relative internal links?
- **WEB-35 [J] — generated dist boundary** — `dist/` is never hand-edited; it is fully regenerated by the build. (standards.md)
  - _Review prompt:_ Is dist treated as fully generated build output and never hand-edited?
- **WEB-36 [M] — hosting assets directory seam** — `assets.directory` in `site/wrangler.jsonc` is `"dist"`/`"./dist"` (pointing at `site/dist/`) — a misplaced `"../dist"` is FAIL; verified in full by `ki-website-cloudflare`, named here as the seam. (standards.md)
- **WEB-37 [J] — volatile facts have one home** — volatile facts (Eleventy/Tailwind/Lucide versions, the spec idioms the config relies on) sit in `package.json` / the standard, not scattered — a bump is one known edit. (standards.md)
  - _Review prompt:_ Do volatile facts live in package metadata or the standard rather than being scattered through implementation?
- **WEB-38 [J] — current standard** — this audit runs against a **current** standard: a cited requirement is confirmed by Mode REFRESH + [`sources.md`](sources.md) not having gone stale since its `last reviewed` date. (standards.md)
  - _Review prompt:_ Has Mode REFRESH confirmed the cited sources and updated the review record recently enough?
- **WEB-39 [M] — parseable package manifest** — `package.json` is present and parseable (foundational — the stack/scripts checks read it). (standards.md)
- **WEB-40 [M] — Tailwind CLI dependency** — `@tailwindcss/cli` is a dependency (the config-less Tailwind 4 build tool). (standards.md)
- **WEB-41 [M] — website opt-in** — on an applicable site, the `[ki-website]` opt-in table is present in `.ki-config.toml` (`audit.ts --educate` scaffolds it). (standards.md)
- **WEB-42 [M] — website opt-in validation** — no unknown keys under `[ki-website]` (validate-down — the marker table takes no keys today). (standards.md)
