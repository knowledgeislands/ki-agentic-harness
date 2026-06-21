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
| ASSETS   | [Workers · Static Assets][assets]           | The `assets` block, `directory`/`binding`/`html_handling`/`not_found_handling` | 2026-06-21    |
| WRANGLER | [wrangler configuration][wrangler]          | `name`, `compatibility_date`, `routes`/`custom_domain`, `observability`        | 2026-06-21    |
| PAGES    | [Pages → Workers migration / status][pages] | Whether Pages remains the recommended target for static sites (it does not)    | 2026-06-21    |

## In-house (the hosting convention)

The standard is self-contained; it is the source of truth for house style. Any conformant site repo that carries a
`[knowledgeislands-cloudflare-hosting]` table is an example, not a source.

| Tag   | Source                           | Governs                                                 | Last reviewed |
| ----- | -------------------------------- | ------------------------------------------------------- | ------------- |
| BUILD | `knowledgeislands-11ty-websites` | The `dist/` seam this serves (referenced, not restated) | 2026-06-21    |

## Last review

REFRESH last run **2026-06-21**. Re-fetched the three Cloudflare sources; **no drift** — every config key and default the standard, rubric,
and checker name is current and correctly named. Date bump + confirmed current.

- **Pins:** `wrangler` `^4.x` (current major still **v4** — Workers Sites deprecated in v4, no schema-breaking v5). Deploy model: Workers +
  Static Assets via `wrangler deploy` (never `wrangler pages deploy`).
- **Static-Assets config surface (confirmed, mature):** `assets.directory` (the seam), `binding`, and the optional per-site keys with their
  verbatim defaults — `html_handling` defaults to `"auto-trailing-slash"`, `not_found_handling` defaults to `"none"`, `run_worker_first`
  defaults to `false` (all re-confirmed this run). `observability.enabled` "Defaults to true for all new Workers"; `custom_domain` "Defaults
  to false". The standard correctly treats the three optional keys as per-site and does not require them.
- **Pages vs Workers:** Cloudflare still steers **new** static sites to Workers + Static Assets (new features focus on Workers;
  `wrangler pages` nudges to `wrangler deploy`). The migration page still does **not** call Pages "deprecated" — it frames migration as
  optional and notes Workers has the "distinctly broader set of features." The standard's "Cloudflare steers new sites to Workers + Static
  Assets" wording (standard §1 + SKILL.md) remains accurate; the operational rule (never `pages deploy`) is unchanged.
- **Open watch-items:** watch for a `wrangler` major bump (v5) that changes the config schema. Re-confirm the Pages↔Workers guidance hasn't
  reversed (it has only hardened toward Workers so far). The `assets` surface is mature — re-confirm only on a major bump.

[assets]: https://developers.cloudflare.com/workers/static-assets/
[wrangler]: https://developers.cloudflare.com/workers/wrangler/configuration/
[pages]: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
