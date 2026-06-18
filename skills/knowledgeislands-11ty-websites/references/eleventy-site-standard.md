# The Eleventy site standard

The normative, quotable reference for the Knowledge Islands 11ty website standard — what a good site looks like, and why. The audit rubric
([audit-rubric.md](audit-rubric.md)) turns each section into checkable items; the procedure is in the [SKILL.md](../SKILL.md). The standard
is the **majority shape** of the canonical pair — `kit-midnight.ninja` (lean) and `vallearmonia-website` (full); `arcadia-website` and
`5g-emerge-testbed-website` are conform targets, not sources (see [the source list](sources.md)).

This skill owns the **site-build delta**. The toolchain it sits on (Bun mandate, `lint:*`/`deps:*` families, `tsconfig`/`biome`, the
`tsc --noEmit` type-check) is `knowledgeislands-engineering`'s and is referenced here, not restated.

## Contents

- [1. Stack](#1-stack)
- [2. Repo layout — flat vs `site/`](#2-repo-layout--flat-vs-site)
- [3. The `src/` shape](#3-the-src-shape)
- [4. `eleventy.config.ts` patterns](#4-eleventyconfigts-patterns)
- [5. Tailwind 4, config-less](#5-tailwind-4-config-less)
- [6. Content model](#6-content-model)
- [7. SEO](#7-seo)
- [8. Dev-workflow delta](#8-dev-workflow-delta)
- [9. The `dist/` contract](#9-the-dist-contract)
- [10. Migrate-from (legacy)](#10-migrate-from-legacy)

## 1. Stack

- **Eleventy 3** (`@11ty/eleventy` `^3.x`) is the generator — a static-site generator, **not** a JS framework. **Not** Astro, Next, Vite, or
  a SPA. The output is HTML + CSS + a little progressive-enhancement JS.
- **Nunjucks** (`.njk`) is the template engine for both HTML templates and Markdown (`htmlTemplateEngine: 'njk'`,
  `markdownTemplateEngine: 'njk'`). **Markdown** (`.md`) carries prose content; `.njk` carries logic/layout.
- **TypeScript runs natively on Bun — no transpile step.** `eleventy.config.ts` and `_data/*.ts` are executed directly (Bun, or plain `node`
  on Node ≥ 24 — type stripping is stable and unflagged since v24.3 / v22.18; the older `--experimental-strip-types` flag is now a no-op).
  `tsc` is used only for `--noEmit` type-checking, which is the `knowledgeislands-engineering` layer. **`tsx` is legacy** (see §10).
- **Bun is mandated** as the package manager and runtime. The Bun-install / Node-run split, the `packageManager: bun@…` pin, `engines`, and
  the `lint:*`/`deps:*` families are `knowledgeislands-engineering`'s — this standard assumes them.
- **Lucide** provides icons, copied from `node_modules` as a passthrough and initialised client-side (no build-time icon framework).

## 2. Repo layout — flat vs `site/`

Two conformant layouts; the trigger is whether the repo holds **other deployables**.

- **Flat** — the site is the whole repo. `eleventy.config.ts` and `src/` sit at the repo root; the build emits `./dist`. Scripts are
  unprefixed: `build`, `dev`, `dev:css`, `dev:serve`, `clean`. (`arcadia-website`, `5g-emerge`.)
- **`site/` subfolder** — the repo also holds unrelated deployables (a bot, an ingress Worker — **out of this skill's scope**, see
  [SKILL.md](../SKILL.md) boundaries). The site lives under `site/` (`site/eleventy.config.ts`, `site/src/`), the build emits `../dist` at
  the repo root, and the scripts take a `site:` prefix (`site:build`, `site:dev`, …). (`kit-midnight.ninja`, `vallearmonia-website`.)

Either way **`dist/` lives at the repo root** and is the single build output. The site root is "the directory that contains
`eleventy.config.ts`".

## 3. The `src/` shape

Under the site root, `src/` is Eleventy's input directory and follows a fixed shape:

```text
src/
├── _data/                      # global data, available in every template
│   ├── site.ts                 # the SiteConfig (title, description, url, …) — typed, default-exported
│   └── *.ts | *.json5          # structure, nav, collections config — the single source of truth
├── _includes/
│   ├── layouts/
│   │   ├── base.njk            # the <html> shell: <head> meta, fonts, main.css, nav, footer, scripts
│   │   └── *.njk               # page/section layouts that extend or wrap base
│   └── partials/
│       ├── seo-meta.njk        # canonical + OG + Twitter tags, included from base
│       ├── nav.njk · footer.njk
│       └── *.njk               # reusable fragments
├── assets/
│   ├── css/                    # main.css + tokens.css + page partials (§5)
│   ├── js/                     # progressive-enhancement scripts, kept small
│   ├── images/ · fonts/        # passthrough-copied verbatim
└── <content>/                  # Markdown pages, grouped in folders, each with a *.11tydata.json cascade
```

- **Structure lives in `_data/`, not in templates.** A single typed `_data/*.ts` object (e.g. a reading-order / nav definition) drives nav,
  ordering, and prev/next, so the shape has one source of truth.
- **`_includes/layouts/` vs `partials/`**: a layout is a whole-page frame (`base.njk` and its extensions); a partial is an `{% include %}`-d
  fragment.

## 4. `eleventy.config.ts` patterns

The config is `export default function (eleventyConfig) { … return { dir, … } }`. These patterns are expected:

- **Portable-`dist/` transform.** An `addTransform` rewrites absolute internal `href`/`src` URLs to paths relative to the current output
  file (skipping `http(s):`/`mailto:`/`tel:`/`data:`/`#`), so `dist/` serves from any root. In the canonical pair this is a
  `toRelativeOutputUrl` helper inside a transform named `explicit-index-links`. **This is invariant 2** — the seam to hosting (§9).
- **`.ts` data extension.** `addDataExtension('ts', { read: false, parser })` dynamically imports the file and, mirroring Eleventy's JS
  handling, **calls the default export if it is a function** (sync or async), else uses it directly.
- **`.json5` data extension.** `addDataExtension('json5', { read: false, parser: JSON5.parse(readFileSync(...)) })` — JSON5 for human-edited
  data (comments, trailing commas).
- **Tailwind in the lifecycle.** `eleventyConfig.on('eleventy.before', ({ runMode }) => …)` runs the Tailwind CLI with `--minify` when
  `runMode` is **not** `serve`/`watch` (i.e. a one-shot build), and `addWatchTarget('…/dist/assets/css/main.css')` reloads the dev server
  when the parallel `--watch` process rewrites the CSS. **This is invariant 4.**
- **Lucide passthrough** + an `external-link-icons` transform that appends an external-link glyph to `https?://` anchors.
- **Filters**, where used: `jsonDump` (debug), `unique`, `groupBy`. **Collections** sorted by front-matter order keys where a content
  section needs ordering.
- **`return { dir: { input: 'src', output: '<./dist|../dist>', includes: '_includes', data: '_data' }, htmlTemplateEngine: 'njk', markdownTemplateEngine: 'njk', templateFormats: ['njk','md','html'] }`.**

## 5. Tailwind 4, config-less

- **No `tailwind.config.*` file** anywhere. Tailwind 4 is configured in CSS. **This is invariant 1.**
- **`main.css` is the entry point** and an import chain: `@import "tailwindcss"` first, then `tokens.css`, then page/section partials
  (`base.css`, `home.css`, `nav.css`, …). A lean site imports only `tokens.css` + a couple of partials; a full site imports several.
- **`tokens.css` defines semantic design tokens** as CSS custom properties in `@layer base :root { … }` — a shadcn/ui-style palette
  (`--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--ring`, `--radius`, …) plus brand and layout vars, **sampled from
  the site's brand/hero imagery**. `@font-face` for any self-hosted font sits here too (`font-display: swap`).
- **`@theme inline { … }`** then exposes those vars to Tailwind utilities (`--color-background: var(--background)`, `--font-sans: …`, the
  `--radius-*` scale), so utilities and raw CSS share one palette. Templates use the tokens; they do **not** hard-code hex values.

## 6. Content model

- **Pages are Markdown** (`.md`) with YAML front matter (`title`, `description`, and page-specific keys), grouped into content folders.
- **Cascade data files** (`<folder>.11tydata.json` or `.js`) set shared front matter for a whole folder — typically `layout` and a
  section/tag — so individual pages stay prose-only.
- **Structured data lives in `_data/`** as typed `.ts` (or `.json5`) — the single source of truth for nav and ordering (§3).
- **Optional: build-time validation.** A site with structured JSON5 data may validate it with **Zod** at build time and abort on a bad
  record (the `5g-emerge` pattern) — promoted here as an _optional capability_, not a requirement.

## 7. SEO

- **`seo-meta.njk`** partial emits the canonical link, Open Graph, and Twitter-card tags from `site` data + page front matter, and is
  **included from `base.njk`** so every page carries it.
- **`noindex`** front matter (e.g. on `404.njk`) emits `<meta name="robots" content="noindex, nofollow">` and nothing else.
- **A public site ships `sitemap.xml` and `robots.txt`** (generated from a `.njk` template over the page collection; exclude any admin-only
  section). **A webmanifest + favicons** complete the head. (An internal/unlisted site may skip sitemap/robots — a judgment call, not a
  blocker.)

## 8. Dev-workflow delta

The site-specific scripts (the rest of the script families are engineering's):

- **`<site:>dev`** — `concurrently` runs the Tailwind `--watch` (`dev:css`) and the Eleventy `--serve --port 3000` (`dev:serve`) in
  parallel, named `css`,`11ty`.
- **`<site:>build`** — `bun …/@11ty/eleventy/cmd.cjs --config=eleventy.config.ts` (the `eleventy.before` hook compiles Tailwind with
  `--minify`).
- **`<site:>clean`** — removes `dist/` (and `.wrangler/` where present). **`<site:>types`** — `tsc --noEmit -p <site root>`.
  **`<site:>verify`** — types + build.

The `site:` prefix is present iff the `site/`-subfolder layout is used (§2).

## 9. The `dist/` contract

The build's output, and the **only** thing `knowledgeislands-cloudflare-hosting` needs:

- a tree of static files with **relative** internal links (the §4 transform), so it serves from any root;
- `dist/assets/css/main.css` (Tailwind, minified in build mode), plus passthrough `assets/{js,images,fonts}/`;
- for a public site, `sitemap.xml` + `robots.txt`;
- `dist/` is **gitignored** and fully regenerated by the build — never hand-edited.

Where `dist/` sits — `./dist` (flat) or `../dist` (from `site/`) — is the path the hosting skill points `assets.directory` at. **Building
`dist/` is this skill; serving it is `knowledgeislands-cloudflare-hosting`.**

## 10. Migrate-from (legacy)

Older sites predate the standard; CONFORM moves them toward it. The known legacy patterns and their fixes:

- **npm + `tsx`** (`node --import tsx/esm …`) → Bun running `.ts` natively (or plain `node` on Node ≥ 24, type stripping now stable and
  unflagged). `tsx` and the npm lockfile go. (`5g-emerge`.)
- **No portable-`dist/` transform** → add the `addTransform` from §4.
- **Skeletal `src/`** — no `tokens.css`, no `_includes/{layouts,partials}/`, no `seo-meta` partial → add them, copying the shape from the
  canonical pair. (`arcadia-website`: a modern `eleventy.config.ts` but a skeletal `src/`.)
- **Minimal SEO** (a bare `<title>` only) → the `seo-meta.njk` partial wired into `base.njk`, plus sitemap/robots for a public site.
