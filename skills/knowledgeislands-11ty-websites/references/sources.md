# Sources — where the standard comes from

The authoritative and in-house sources behind the [Eleventy site standard](eleventy-site-standard.md) and [Audit Rubric](audit-rubric.md).
Mode REFRESH reads this file, re-fetches each source, diffs it against the standard + rubric +
[`scripts/audit-websites.ts`](../scripts/audit-websites.ts), then **bumps the `last reviewed` dates** and refreshes the `## Last review`
block below (what changed is recorded in the commit, not a changelog). This is the skill's memory of where the standard comes from — keep it
current.

Two layers feed the standard: the **upstream tools** (Eleventy, Tailwind, Lucide — what they support and how they're configured) and the
**in-house convention** (the shape the standard defines on top of those tools). A finding is only "upstream-driven" if it traces to the
Authoritative table; everything else is house style and should be labelled as such.

## Authoritative (upstream tools)

| Tag      | Source                     | Governs                                                                  | Last reviewed |
| -------- | -------------------------- | ------------------------------------------------------------------------ | ------------- |
| ELEVENTY | [Eleventy docs][11ty]      | Config API: `addTransform`, `addDataExtension`, `eleventy.before`, `dir` | 2026-06-18    |
| TAILWIND | [Tailwind CSS v4 docs][tw] | Config-less `@import "tailwindcss"`, `@theme inline`, the CLI            | 2026-06-18    |
| LUCIDE   | [Lucide docs][lucide]      | Icon delivery (UMD passthrough, client init)                             | 2026-06-18    |

## In-house (the website convention)

The standard is self-contained; it is the source of truth for house style. Any conformant site repo that carries a
`[knowledgeislands-11ty-websites]` table is an example, not a source.

| Tag | Source                         | Governs                                                         | Last reviewed |
| --- | ------------------------------ | --------------------------------------------------------------- | ------------- |
| ENG | `knowledgeislands-engineering` | The toolchain layer this composes on (referenced, not restated) | 2026-06-18    |

## Last review

REFRESH last run **2026-06-18**. Re-anchored against upstream docs; standard confirmed current.

- **Pins:** Eleventy `^3.1.x` (stable **3.1.6**; v4 still pre-release — latest canary `4.0.0-alpha.8`), `@tailwindcss/cli` `^4.3.x` (current
  **4.3.1**), Lucide current. TypeScript runs natively on Bun (or plain `node` on Node ≥ 24 — type stripping is stable/unflagged since v24.3
  / v22.18; the `--experimental-strip-types` flag is now a no-op); `tsx` recorded as legacy.
- **Confirmed conformant upstream:** config-less Tailwind 4 `@import "tailwindcss"`, `@theme` and `@theme inline` (inline confirmed current
  — inlines the variable value, avoiding `var()` resolution surprises; a sibling `@theme static` now also exists, unused by our standard);
  Eleventy `addTransform`, `addDataExtension('ts'|'json5', { read: false, parser })`, and the `eleventy.before` hook all current with no
  rename/deprecation.
- **Open watch-items:** **Eleventy v4** still on the horizon (canary alpha-8; possible "Build Awesome" rename; v4 adds experimental
  zero-config `.ts` data/config which may make our hand-rolled `addDataExtension('ts')` optional) — re-anchor the config API (transforms,
  data extensions, `dir`) when it lands. **Tailwind `@theme` / `@import` surface** confirmed stable this pass — downgrade to routine but
  keep tracked. **Node type-stripping** now stable/unflagged (v24.3 / v22.18) — fallback wording updated this run; nothing further to watch
  unless Node changes the default again.

[11ty]: https://www.11ty.dev/docs/
[tw]: https://tailwindcss.com/docs
[lucide]: https://lucide.dev/guide/
