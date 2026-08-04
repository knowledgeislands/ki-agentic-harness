# Sources — where the standard comes from

**Refresh:** external-spec · monthly

The authoritative and in-house sources behind the [Eleventy site standard](standards-eleventy-site.md) and [Audit Rubric](rubric.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard + rubric + native rubric definition, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). This is the skill's memory of where the standard comes from — keep it current.

Two layers feed the standard: the **upstream tools** (Eleventy, Tailwind, Lucide — what they support and how they're configured) and the **in-house convention** (the shape the standard defines on top of those tools). A finding is only "upstream-driven" if it traces to the Authoritative table; everything else is house style and should be labelled as such.

## Authoritative (upstream tools)

| Tag      | Source                     | Governs                                                                  | Last reviewed |
| -------- | -------------------------- | ------------------------------------------------------------------------ | ------------- |
| ELEVENTY | [Eleventy docs][11ty]      | Config API: `addTransform`, `addDataExtension`, `eleventy.before`, `dir` | 2026-08-03    |
| TAILWIND | [Tailwind CSS v4 docs][tw] | Config-less `@import "tailwindcss"`, `@theme inline`, the CLI            | 2026-08-03    |
| LUCIDE   | [Lucide docs][lucide]      | Icon delivery (UMD passthrough, client educate)                          | 2026-08-03    |

## In-house (the website convention)

The standard is self-contained; it is the source of truth for house style. Any conformant site repo that carries a `["knowledgeislands/ki-agentic-harness:ki-website"]` table is an example, not a source.

| Tag | Source           | Governs                                                                 | Last reviewed |
| --- | ---------------- | ----------------------------------------------------------------------- | ------------- |
| ENG | `ki-engineering` | Separately coverage-selected toolchain layer (referenced, not restated) | 2026-08-03    |

## Last review

REFRESH last run **2026-08-03** (previous: 2026-07-04). Re-fetched npm registry for all three upstream tools; Eleventy docs and Tailwind docs blocked by proxy (versions confirmed via npm). No drift to config-less idioms the standard depends on; two version bumps noted.

- **Eleventy:** stable **3.1.6** — unchanged from last review (npm `@11ty/eleventy` latest tag). v4 canary status not checked this run (Eleventy docs proxy-blocked); assumed still pre-release. Watch-item carried.
- **Tailwind CSS:** `@tailwindcss/cli` now **4.3.3** on npm (up from 4.3.2, 2026-06-29 → small patch). Still within `^4.3.x`. The config-less `@import "tailwindcss"`, `@theme`, and `@theme inline` idioms are stable additive additions confirmed in the 4.3.x line; no breaking changes in this patch range.
- **Lucide:** vanilla `lucide` now **1.28.0** on npm (up from 1.23.0 — five minor versions). **UMD delivery confirmed intact at 1.28.0:** `unpkg: dist/umd/lucide.min.js` and `main:umd: dist/umd/lucide.js` both present in the package manifest. The standard's UMD passthrough + `createIcons()` delivery remains correct. The framework-packages-dropped-UMD watch-item: still clear — vanilla `lucide` has not withdrawn it. The `^1.x` range in any conformant repo's `package.json` would absorb this without a standard change.
- **ENG:** `ki-engineering` toolchain layer referenced — no change this cycle; note the TS 7.0 and Node 22 EOL signals found in ki-engineering's refresh this same run; re-evaluate the Node type-stripping note once Node 22 is fully retired in the repos.
- **Open watch-items:**
  - **Eleventy v4** — still watch-only (docs proxy-blocked this run; check next monthly pass via direct session).
  - **Lucide v1 UMD exception** — still intact at 1.28.0. Continue watching each minor release for UMD removal signal.
  - **Tailwind `@theme` / `@import` surface** — stable; routine tracking.
  - **Node type-stripping note** — re-anchor once Node 22 floor moves to 24 (see ki-engineering open items).

[11ty]: https://www.11ty.dev/docs/
[tw]: https://tailwindcss.com/docs
[lucide]: https://lucide.dev/guide/
