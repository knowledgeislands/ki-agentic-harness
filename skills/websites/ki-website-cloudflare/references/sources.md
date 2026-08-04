# Sources — where the standard comes from

**Refresh:** external-spec · monthly

The authoritative and in-house sources behind the [Cloudflare hosting standard](standards-cloudflare-hosting.md) and [generated rubric](rubric.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard and structured catalogue, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). Regenerate the published rubric with `ki dev skill rubric ki-website-cloudflare --write`. This is the skill's memory of where the standard comes from — keep it current.

Two layers feed the standard: **Cloudflare's platform** (what Workers + Static Assets supports and how `wrangler` is configured) and the **in-house convention** (the shape the canonical deployed site uses on top of it). A finding is only "platform-driven" if it traces to the Authoritative table; everything else is house style and should be labelled as such.

## Authoritative (Cloudflare platform)

| Tag      | Source                                      | Governs                                                                 | Last reviewed |
| -------- | ------------------------------------------- | ----------------------------------------------------------------------- | ------------- |
| ASSETS   | [Workers · Static Assets][assets]           | The `assets` block and its keys †                                       | 2026-08-03    |
| WRANGLER | [wrangler configuration][wrangler]          | `name`, `compatibility_date`, `routes`/`custom_domain`, `observability` | 2026-08-03    |
| PAGES    | [Pages → Workers migration / status][pages] | Whether Pages remains the recommended target for static sites ‡         | 2026-08-03    |

† `directory`, `binding`, `html_handling`, `not_found_handling`.

‡ It does not.

## In-house (the hosting convention)

The standard is self-contained; it is the source of truth for house style. Any conformant site repo that carries a `["knowledgeislands/ki-agentic-harness:ki-website-cloudflare"]` table is an example, not a source.

| Tag   | Source       | Governs                                                 | Last reviewed |
| ----- | ------------ | ------------------------------------------------------- | ------------- |
| BUILD | `ki-website` | The `dist/` seam this serves (referenced, not restated) | 2026-08-03    |

## Last review

REFRESH last run **2026-08-03** (previous: 2026-07-04). Cloudflare documentation sites returned 403 in the scheduled proxy environment; Authoritative sources confirmed via WebSearch results and npm registry. No drift to the standard's config keys or deploy model found. Wrangler advanced to 4.118.0 within major v4 — no schema break.

- **Wrangler:** latest release is **4.118.0** on npm as of 2026-08-03 (up from 4.106.0 last run — patch releases within v4; no v5 schema break). Major v4 unchanged; `Workers Sites`/legacy-assets remain removed. Deploy idiom `wrangler deploy` (never `wrangler pages deploy`) unchanged.
- **Static-Assets config surface (confirmed via WebSearch):** `html_handling` (default `"auto-trailing-slash"`), `not_found_handling` (default `"none"`), `run_worker_first` (boolean, default `false`) all confirmed present in current docs. The `assets.directory`, `binding`, `observability.enabled`, and `custom_domain` keys confirmed unchanged. No new `assets` block keys found. Standard correctly treats optional keys as per-site.
- **Pages vs Workers:** WebSearch confirms Cloudflare continues to steer new sites to Workers + Static Assets. Pages → Workers migration guidance unchanged. The operational rule (never `pages deploy`) stands.
- **BUILD (`ki-website`):** `ki-website` ran its own REFRESH this same cycle (monthly, also due 2026-08-03); the `dist/` seam is current.
- **Open watch-items:** watch for a `wrangler` major bump (v5) that changes the config schema — re-confirm only on a major bump. Re-confirm Pages↔Workers guidance hasn't reversed. Track `run_worker_first` route-pattern or `assets_navigation_prefers_asset_serving` flag relevance for static-only sites (still out of scope). **Note:** proxy blocks Cloudflare developer docs in the scheduled run environment; if drift is suspected between runs, re-fetch from a direct session.

[assets]: https://developers.cloudflare.com/workers/static-assets/
[wrangler]: https://developers.cloudflare.com/workers/wrangler/configuration/
[pages]: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
