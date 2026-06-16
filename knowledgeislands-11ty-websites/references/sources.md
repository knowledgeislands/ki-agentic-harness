# Sources — where the standard comes from

The authoritative and in-house sources behind the [Eleventy site standard](eleventy-site-standard.md) and [Audit Rubric](audit-rubric.md).
Mode REFRESH reads this file, re-fetches each source, diffs it against the standard + rubric +
[`scripts/audit-websites.ts`](../scripts/audit-websites.ts), then **bumps the `last reviewed` dates** and refreshes the `## Last review`
block below (what changed is recorded in the commit, not a changelog). This is the skill's memory of where the standard comes from — keep it
current.

Two layers feed the standard: the **upstream tools** (Eleventy, Tailwind, Lucide — what they support and how they're configured) and the
**in-house convention** (the shape the canonical pair share on top of those tools). A finding is only "upstream-driven" if it traces to the
Authoritative table; everything else is house style and should be labelled as such.

## Authoritative (upstream tools)

| Tag      | Source                     | Governs                                                                  | Last reviewed |
| -------- | -------------------------- | ------------------------------------------------------------------------ | ------------- |
| ELEVENTY | [Eleventy docs][11ty]      | Config API: `addTransform`, `addDataExtension`, `eleventy.before`, `dir` | 2026-06-16    |
| TAILWIND | [Tailwind CSS v4 docs][tw] | Config-less `@import "tailwindcss"`, `@theme inline`, the CLI            | 2026-06-16    |
| LUCIDE   | [Lucide docs][lucide]      | Icon delivery (UMD passthrough, client init)                             | 2026-06-16    |

## In-house (the website convention)

The standard is the **majority shape** across the canonical pair. They are the living source of truth for house style; when they diverge,
the majority wins and the outlier is a finding unless documented. The other two repos are conform targets, not sources.

| Tag       | Source                                          | Governs                                                                    | Last reviewed |
| --------- | ----------------------------------------------- | -------------------------------------------------------------------------- | ------------- |
| CANONICAL | `kit-midnight.ninja` (lean)                     | The minimal shape — `eleventy.config.ts`, `main.css`/`tokens.css`, scripts | 2026-06-16    |
| CANONICAL | `vallearmonia-website` (full)                   | The fuller patterns — layouts, gallery, SEO, sitemap/robots, `site/` split | 2026-06-16    |
| TARGET    | `arcadia-website` · `5g-emerge-testbed-website` | Conform _targets_ — what the standard moves a legacy site toward           | 2026-06-16    |
| ENG       | `knowledgeislands-engineering`                  | The toolchain layer this composes on (referenced, not restated)            | 2026-06-16    |

## Last review

REFRESH last run **2026-06-16** (initial authoring). Standard extracted from the canonical pair `kit-midnight.ninja` +
`vallearmonia-website`.

- **Pins:** Eleventy `^3.1.x`, `@tailwindcss/cli` `^4.3.x`, Lucide current. TypeScript run natively on Bun (or
  `node --experimental-strip-types`); `tsx` recorded as legacy.
- **Confirmed conformant in the canonical pair:** config-less Tailwind 4 (`@theme inline`), the `toRelativeOutputUrl`/`explicit-index-links`
  portable-`dist/` transform, the `.ts` + `.json5` data extensions, the `eleventy.before` Tailwind compile, the `seo-meta.njk` partial.
- **Open watch-items:** Tailwind 4's `@theme`/`@import` surface is young — re-confirm on REFRESH. Eleventy v4 is on the horizon; re-anchor
  the config API (transforms, data extensions, `dir`) when it lands. Confirm `node --experimental-strip-types` stays the Node fallback as
  Node's native TS support stabilises.

[11ty]: https://www.11ty.dev/docs/
[tw]: https://tailwindcss.com/docs
[lucide]: https://lucide.dev/guide/
