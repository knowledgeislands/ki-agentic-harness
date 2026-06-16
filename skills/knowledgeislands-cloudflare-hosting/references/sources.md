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
| ASSETS   | [Workers · Static Assets][assets]           | The `assets` block, `directory`/`binding`/`html_handling`/`not_found_handling` | 2026-06-16    |
| WRANGLER | [wrangler configuration][wrangler]          | `name`, `compatibility_date`, `routes`/`custom_domain`, `observability`        | 2026-06-16    |
| PAGES    | [Pages → Workers migration / status][pages] | Whether Pages remains the recommended target for static sites (it does not)    | 2026-06-16    |

## In-house (the hosting convention)

The standard is the shape of the canonical **deployed** site. It is the living source of truth for house style; the other repo is a conform
target, not a source.

| Tag       | Source                                         | Governs                                                             | Last reviewed |
| --------- | ---------------------------------------------- | ------------------------------------------------------------------- | ------------- |
| CANONICAL | `vallearmonia-website` (`site/wrangler.jsonc`) | The site `wrangler.jsonc` shape, the `site:*` deploy scripts, CI    | 2026-06-16    |
| TARGET    | `kit-midnight.ninja`                           | Conform target — has the build but **no** site `wrangler.jsonc` yet | 2026-06-16    |
| BUILD     | `knowledgeislands-11ty-websites`               | The `dist/` seam this serves (referenced, not restated)             | 2026-06-16    |

## Last review

REFRESH last run **2026-06-16** (initial authoring). Standard extracted from `vallearmonia-website`'s site Worker.

- **Pins:** `wrangler` `^4.x`. Deploy model: Workers + Static Assets via `wrangler deploy` (not `wrangler pages deploy`).
- **Confirmed in the canonical site:** the `assets: { directory: "../dist" }` seam, `routes` with `custom_domain` (apex + www),
  `observability.enabled: true`, the `site:{deploy,preview,clean}` scripts, deploy via Cloudflare Workers Builds on merge.
- **Open watch-items:** the Static-Assets config surface is young — re-confirm `html_handling` / `not_found_handling` / `run_worker_first`
  defaults and any new keys on REFRESH. Re-confirm Cloudflare's Pages-vs-Workers guidance for static sites (it has shifted toward Workers +
  Static Assets; verify it hasn't moved again). Watch for a `wrangler` major bump changing the config schema.

[assets]: https://developers.cloudflare.com/workers/static-assets/
[wrangler]: https://developers.cloudflare.com/workers/wrangler/configuration/
[pages]: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
