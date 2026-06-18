# Sources — where the standard comes from

The authoritative and in-house sources behind the [Cloudflare hosting standard](cloudflare-hosting-standard.md) and
[Audit Rubric](audit-rubric.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard + rubric +
[`scripts/audit-cloudflare-hosting.ts`](../scripts/audit-cloudflare-hosting.ts), then **bumps the `last reviewed` dates** and refreshes the
`## Last review` block below (what changed is recorded in the commit, not a changelog). This is the skill's memory of where the standard
comes from — keep it current.

Two layers feed the standard: **Cloudflare's platform** (what Workers + Static Assets supports and how `wrangler` is configured) and the
**in-house convention** (the shape the canonical deployed site uses on top of it). A finding is only "platform-driven" if it traces to the
Authoritative table; everything else is house style and should be labelled as such.

## Authoritative (Cloudflare platform)

| Tag      | Source                                      | Governs                                                                        | Last reviewed |
| -------- | ------------------------------------------- | ------------------------------------------------------------------------------ | ------------- |
| ASSETS   | [Workers · Static Assets][assets]           | The `assets` block, `directory`/`binding`/`html_handling`/`not_found_handling` | 2026-06-18    |
| WRANGLER | [wrangler configuration][wrangler]          | `name`, `compatibility_date`, `routes`/`custom_domain`, `observability`        | 2026-06-18    |
| PAGES    | [Pages → Workers migration / status][pages] | Whether Pages remains the recommended target for static sites (it does not)    | 2026-06-18    |

## In-house (the hosting convention)

The standard is the shape of the canonical **deployed** site. It is the living source of truth for house style; the other repo is a conform
target, not a source.

| Tag       | Source                                         | Governs                                                             | Last reviewed |
| --------- | ---------------------------------------------- | ------------------------------------------------------------------- | ------------- |
| CANONICAL | `vallearmonia-website` (`site/wrangler.jsonc`) | The site `wrangler.jsonc` shape, the `site:*` deploy scripts, CI    | 2026-06-18    |
| TARGET    | `kit-midnight.ninja`                           | Conform target — has the build but **no** site `wrangler.jsonc` yet | 2026-06-18    |
| BUILD     | `knowledgeislands-11ty-websites`               | The `dist/` seam this serves (referenced, not restated)             | 2026-06-18    |

## Last review

REFRESH last run **2026-06-18**. Re-fetched the three Cloudflare sources; no structural drift — every config key the standard, rubric, and
checker name is current and correctly named.

- **Pins:** `wrangler` `^4.x` (current major still **v4** — Workers Sites deprecated in v4, no schema-breaking v5). Deploy model: Workers +
  Static Assets via `wrangler deploy` (never `wrangler pages deploy`).
- **Static-Assets config surface (now confirmed, no longer "young"):** `assets.directory` (the seam), `binding`, and the optional per-site
  keys with their verbatim defaults — `html_handling` defaults to `"auto-trailing-slash"`, `not_found_handling` defaults to `"none"`,
  `run_worker_first` defaults to `false`. `observability.enabled` "Defaults to true for all new Workers"; `custom_domain` "Defaults to
  false". The standard correctly treats the three optional keys as per-site and does not require them.
- **Pages vs Workers:** Cloudflare now explicitly steers **new** static sites to Workers + Static Assets (new features focus on Workers;
  `wrangler pages` nudges to `wrangler deploy`; Pages + Workers being unified). Note: the docs do **not** call Pages "deprecated" — only the
  older Workers Sites (`[site]`) is; the docs say "Cloudflare Pages and Workers Assets are preferred over [that] approach." The standard's
  "deprecated" wording was **softened this run** to "Cloudflare steers new sites to Workers + Static Assets" (standard §1 + SKILL.md); the
  operational rule (never `pages deploy`) is unchanged and better-supported than before.
- **Open watch-items:** watch for a `wrangler` major bump (v5) that changes the config schema. Re-confirm the Pages↔Workers guidance hasn't
  reversed (it has only hardened toward Workers so far). The `assets` surface is now mature — re-confirm only on a major bump.

[assets]: https://developers.cloudflare.com/workers/static-assets/
[wrangler]: https://developers.cloudflare.com/workers/wrangler/configuration/
[pages]: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
