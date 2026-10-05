# Sources — where the standard comes from

**Refresh:** external-spec · monthly

The authoritative and in-house sources behind the [Eleventy site standard](standards-eleventy-site.md) and [Audit Rubric](rubric.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard + rubric + native rubric definition, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). This is the skill's memory of where the standard comes from — keep it current.

Two layers feed the standard: the **upstream tools** (Eleventy, Tailwind, Lucide — what they support and how they're configured) and the **in-house convention** (the shape the standard defines on top of those tools). A finding is only "upstream-driven" if it traces to the Authoritative table; everything else is house style and should be labelled as such.

## Authoritative (upstream tools)

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| ELEVENTY | [Eleventy docs][11ty] | Config API: `addTransform`, `addDataExtension`, `eleventy.before`, `dir` | 2026-10-05 |
| TAILWIND | [Tailwind CSS v4 docs][tw] | Config-less `@import "tailwindcss"`, `@theme inline`, the CLI | 2026-10-05 |
| LUCIDE | [Lucide docs][lucide] | Icon delivery (UMD passthrough, client educate) | 2026-10-05 |

## In-house (the website convention)

The standard is self-contained; it is the source of truth for house style. Any conformant site repo that carries a `[skills.ki-repo-website-content]` table is an example, not a source.

| Tag | Source           | Governs                                                                 | Last reviewed |
| --- | ---------------- | ----------------------------------------------------------------------- | ------------- |
| ENG | `ki-engineering` | Separately coverage-selected toolchain layer (referenced, not restated) | 2026-10-05    |

## Last review

REFRESH last run **2026-10-05**. Re-fetched all three upstream sources and their current package metadata.

- **Current packages:** Eleventy remains stable at **3.1.6** and its `4.0.0-alpha.10` canary remains pre-release; no change since last review. `@tailwindcss/cli` is **4.3.3**; no change since last review. Vanilla `lucide` is now **1.52.0** (was 1.33.0 — 19 minor versions advanced since 2026-08-22).
- **Lucide version drift:** The lucide npm package advanced from 1.33.0 to 1.52.0. The 1.52.0 release includes a `wifi-cog` icon fix; intervening releases added new icons. Direct access to lucide.dev was unavailable this run; the UMD delivery surface (`dist/umd/lucide.min.js`, `createIcons()`) could not be directly confirmed. **Open watch-item:** verify on next refresh (or manually) that the vanilla UMD bundle path and `createIcons()` API remain stable at v1.52.0, and update the standard's pinned version reference if confirmed.
- **Eleventy and Tailwind:** conformant upstream surfaces confirmed unchanged via GitHub releases. Eleventy documents `addTransform`, `addDataExtension`, and `eleventy.before`; Tailwind documents `@import "tailwindcss"` and `@theme`.
- **Open watch-items:** re-anchor Eleventy's config API when v4 becomes stable. Verify the vanilla Lucide UMD distribution path and `createIcons()` surface at v1.52.0 on next refresh.

[11ty]: https://www.11ty.dev/docs/
[tw]: https://tailwindcss.com/docs
[lucide]: https://lucide.dev/guide/
