---
name: knowledgeislands-11ty-websites
description: >
  Codify, audit, conform, and scaffold the Knowledge Islands house approach to building static websites — Eleventy 3 + Nunjucks + Markdown,
  TypeScript run natively on Bun, Tailwind 4 config-less with semantic design tokens — that compile to a portable `dist/`. Use when building
  a new site, bringing an existing site up to the house standard, scaffolding one, or checking its `eleventy.config.ts` / Tailwind tokens /
  `src/` layout / SEO. Triggers: "audit this website", "does this site follow our standard", "scaffold a new 11ty site", "set up a website",
  "build a static site", "add a page or layout", "conform this site", "why isn't Tailwind building". Builds on
  `knowledgeislands-engineering` (the Bun/lint/type/test toolchain) and `knowledgeislands-authoring` (Markdown); to serve the built `dist/`
  on Cloudflare use `knowledgeislands-cloudflare-hosting`. Not for Astro / Next / other frameworks.
argument-hint: 'audit <repo> | conform <repo> | init <repo> | refresh'
---

# Knowledge Islands 11ty website standard

You are applying the **Knowledge Islands 11ty website standard** — the shared way every static website in this work is built: **Eleventy 3,
Nunjucks and Markdown; TypeScript run natively on Bun; Tailwind 4 config-less with design tokens**, compiling to a **portable `dist/`**. A
new site is scaffolded to it; an existing one is audited and conformed against it. This skill carries that standard and the procedure.

This is a **standard, base-agnostic Process skill**. It hard-codes no single repo; it applies to any repo carrying a
`[knowledgeislands-11ty-websites]` table in its `.ki-config.toml` (today: `kit-midnight.ninja` and `vallearmonia-website` as the canonical
pair, with `arcadia-website` a conform target). How it sits beside the other skills, and where it must not overlap them, is documented once
in the arcadia-skills `README.md`.

This skill owns the **site-build delta** only. The generic toolchain (Bun mandate, `lint:*`/`deps:*` families,
`tsconfig`/`biome`/`tsc --noEmit`) is `knowledgeislands-engineering`'s; Markdown/TOML style is `knowledgeislands-authoring`'s; **serving the
built `dist/`** on Cloudflare is `knowledgeislands-cloudflare-hosting`'s. It **composes** on top of those rather than restating them.

The full, quotable standard is [the Eleventy site standard](references/eleventy-site-standard.md); the line-by-line pass/fail items are in
[the audit rubric](references/audit-rubric.md); the tracked provenance is [the source list](references/sources.md). A mechanical checker is
[`scripts/audit-websites.ts`](scripts/audit-websites.ts). Read those for detail; this file is the operating procedure.

## The stack at a glance

```text
<repo>/                         # flat layout — one deployable
├── eleventy.config.ts          # export default (eleventyConfig) ⇒ { dir, htmlTemplateEngine: 'njk', … }
├── src/
│   ├── _data/                  # global data: *.ts (default export, called if a function) + *.json5
│   ├── _includes/
│   │   ├── layouts/            # base.njk (the <html> shell) + page layouts
│   │   └── partials/           # nav, footer, seo-meta — reusable fragments
│   ├── assets/css/             # main.css → @import "tailwindcss" + tokens.css (@theme inline) + page partials
│   ├── assets/{js,images,fonts}/
│   └── <content>/              # Markdown pages + *.11tydata.json cascade (layout, section)
└── dist/                       # BUILD OUTPUT — portable (relative URLs), gitignored. The seam to hosting.
```

When the repo also holds **unrelated deployables** (a bot, an ingress Worker — out of this skill's scope), the site moves under `site/`
(`site/eleventy.config.ts`, `site/src/` → `../dist`) and its scripts take a `site:` prefix. Both layouts are conformant.

Four invariants define the standard — most findings are a breach of one:

1. **Config-less Tailwind 4.** No `tailwind.config.*`; `main.css` is `@import "tailwindcss"` then `tokens.css`, whose semantic CSS vars are
   exposed to utilities via `@theme inline`.
2. **The build emits a portable `dist/`.** An `addTransform` rewrites absolute internal URLs to relative ones, so `dist/` serves from any
   root. This is the contract `knowledgeislands-cloudflare-hosting` consumes.
3. **TypeScript runs natively — no transpile.** `eleventy.config.ts` and `_data/*.ts` run under Bun; `.ts` + `.json5` data extensions are
   registered in the config. `tsc` is type-check only (engineering's layer). `tsx` is legacy.
4. **Tailwind compiles inside the Eleventy lifecycle.** An `eleventy.before` hook runs the Tailwind CLI in build mode; dev runs a parallel
   `--watch` and an `addWatchTarget` on the compiled CSS.

## Composition — how a site repo gets fully audited

The checker is the **site-build layer**; the toolchain and hosting layers each audit their own. They compose by being **run in sequence**,
never by importing each other (each skill is symlinked standalone):

```text
engineering:audit <repo>                          →  common toolchain (Bun, lint:*/deps:*, tsconfig/biome)
  then audit-websites.ts <repo>                   →  site-build delta (THIS skill)
  then audit-cloudflare-hosting.ts <repo>         →  serving the dist/ (if the site is deployed to Cloudflare)
```

A repo is "clean" only when **every applicable** skill's audit passes. The `.ki-config.toml` tables are the selector:
`[knowledgeislands-engineering]` marks the common layer; `[knowledgeislands-11ty-websites]` marks this one;
`[knowledgeislands-cloudflare-hosting]` marks the hosting layer.

## The `dist/` contract (the seam to hosting)

This skill's output, and the only thing the hosting skill needs: a `dist/` of static files with **relative** internal links (the URL
transform), Tailwind compiled to `dist/assets/css/main.css`, passthrough assets, and — for a public site — `sitemap.xml` + `robots.txt`.
`dist/` is gitignored and regenerated by the build. Where `dist/` lives (`./dist` flat, `../dist` from `site/`) is the path
`knowledgeislands-cloudflare-hosting` points `assets.directory` at.

## Operating modes

Carries the universal **AUDIT · CONFORM · REFRESH**, plus **INIT** (scaffold a new site). Infer the mode from the request; ask if unclear.
(Modes are named and alphabetical.) The mode shape itself is defined in `knowledgeislands-engineering`'s enforcement framework.

### Mode AUDIT — check a site against the standard

1. **Run the common layer first.** `bun knowledgeislands-engineering/scripts/audit-engineering.ts <repo>` covers the shared toolchain. Don't
   re-derive it here.
2. **Run the mechanical checker.** `bun <skill>/scripts/audit-websites.ts <repo>`. It locates the site root (flat or `site/`), then reports:
   the `@11ty/eleventy` dep, **no `tailwind.config.*`**, `eleventy.config.ts` present, the relative-URL transform, the `.ts` + `.json5` data
   extensions, the Tailwind `eleventy.before` hook, `main.css` importing `tailwindcss`, the `src/` layout dirs, the build/dev script family,
   the `seo-meta` partial, and `dist/` gitignored. Capture its output verbatim.
3. **Apply the judgment items** in [the rubric](references/audit-rubric.md): `tokens.css` actually drives the palette (not hard-coded hexes
   in templates), `_data` is the single source of structure, content is Markdown with cascade data files, SEO meta is wired into `base.njk`,
   and a public site ships a sitemap/robots. Name the hosting audit that must also run if the site is deployed.
4. **Report** by location → criterion → fix, grouped by severity (blocker / standard / polish). Cite `file:line`.

### Mode CONFORM — bring a site up to standard

1. Run **AUDIT** first, so you change against a known gap list.
2. Fix the gaps in place — **copy from the canonical pair**: `kit-midnight.ninja` for the lean shape, `vallearmonia-website` for the fuller
   patterns (tokens, layouts, gallery, SEO). `arcadia-website` and `5g-emerge` are conform _targets_, never copied from. Add the
   `[knowledgeislands-11ty-websites]` table if missing.
3. Re-run the checker; settle the repo's own `bun run lint:*` / `lint:types` (and `lint:md` for any Markdown). For the toolchain block, run
   `knowledgeislands-engineering`'s CONFORM; for the deploy block, `knowledgeislands-cloudflare-hosting`'s.

### Mode INIT — scaffold a new site

**Copy from `kit-midnight.ninja`** (the leanest healthy reference) over inventing: the `eleventy.config.ts`, the `main.css`/`tokens.css`
pair, the `_includes/{layouts,partials}/` shells, and the build/dev script family. Adapt names, palette, and content; keep the four
invariants from day one. Add the `[knowledgeislands-11ty-websites]` table. Then run the checker. For the toolchain scaffold defer to
`knowledgeislands-engineering` INIT; for hosting, `knowledgeislands-cloudflare-hosting` INIT.

### Mode REFRESH — re-anchor the standard to its sources

The standard pins volatile versions (Eleventy, Tailwind, Lucide) and Tailwind-4 idioms that move. Run periodically (monthly, with the other
skills), or when asked "is the website standard current".

1. **Read [the source list](references/sources.md)** — each source with its `last reviewed` date.
2. **Re-fetch each** (WebFetch / WebSearch) and diff against the standard + rubric +
   [`scripts/audit-websites.ts`](scripts/audit-websites.ts): an Eleventy 3.x API change, a Tailwind-4 `@theme`/`@import` change, a
   data-extension or transform-API shift.
3. **Scan the canonical pair** for emergent patterns not yet codified; promote the good ones, flag drift.
4. **Propose a diff**; confirm before writing. Then **update [the source list](references/sources.md)** — bump each `last reviewed` date and
   the `## Last review` block. What changed goes in the commit.

## Boundaries (out of scope, with their homes)

Reciprocal off-ramps — each names this skill back for the site-build layer:

- **The Bun mandate, `lint:*`/`deps:*` families, `tsconfig`/`biome`, type-check** → `knowledgeislands-engineering`. This skill owns the
  _site-build_ delta on top of that common layer; it references it, never restates it.
- **Markdown / TOML formatting style** (including content prose) → `knowledgeislands-authoring`.
- **Serving the built `dist/`** — the `wrangler.jsonc`, Workers + Static Assets, custom domains, deploy scripts →
  `knowledgeislands-cloudflare-hosting`. The `dist/` is the seam between the two.
- **Any Worker that is not a static site** (bots, ingress receivers, APIs, Durable Objects), and general Cloudflare/Workers usage → the
  generic `cloudflare` / `wrangler` skills.
- **A repo's GitHub settings, security, and the universal local files** → `knowledgeislands-repo`.
