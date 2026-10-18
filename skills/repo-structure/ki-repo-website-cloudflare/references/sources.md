# Sources — where the standard comes from

**Refresh:** external-spec · monthly

Mode REFRESH re-fetches these sources, reconciles them with the standard and structured catalogue, then updates the review dates and this review note. The dashboard information architecture and Cloudflare's Pages-to-Workers direction remain moving surfaces.

## Authoritative Cloudflare sources

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| ASSETS | [Workers Static Assets][assets] | `assets`, assets-only Workers, and SPA fallback | 2026-10-04 |
| BUILDS | [Workers Builds configuration][builds] | Build command, deploy command, Preview command, and optional root directory | 2026-10-18 |
| BRANCHES | [Workers Builds build branches][branches] | Production branch and Enable Preview Builds under Branch control | 2026-10-18 |
| BUILDS-API | [Workers Builds API reference][builds-api] | Production and preview triggers, branch filters, trigger variables, user-scoped token | 2026-10-18 |
| BEST | [Workers best practices][best] | Workers Static Assets as the target for new projects | 2026-10-04 |
| WRANGLER | [Wrangler configuration][wrangler] | Worker identity, routes, assets, observability, `workers_dev`, and `preview_urls` | 2026-10-18 |
| DOMAIN | [Workers Custom Domains][domains] | Dashboard path and `custom_domain` routes | 2026-10-04 |
| DEV | [workers.dev][workers-dev] | `<name>.<account-subdomain>.workers.dev` URL syntax; disabling it leaves Version URLs on | 2026-10-18 |
| VERSIONS | [Version URLs][version-urls] | Version and alias URL syntax, the `preview_urls` default, and alias limits | 2026-10-18 |
| PREVIEWS | [Worker Previews][previews] | The separate `wrangler preview` model and its one-way switch | 2026-10-18 |
| ACCESS | [Cloudflare Access for Workers][access] · [Access application paths][access-paths] | Preview protection, rule precedence, and partial-wildcard hostnames | 2026-10-18 |
| DNS | [Partial setup][dns-partial] · [Subdomain setup][dns-subdomain] | Plan gating for off-Cloudflare zone setups | 2026-10-04 |

The dashboard navigation name **Workers & Pages** remains correct in operator instructions even though Pages is not the deployment target for new projects.

## In-house source

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| BUILD | `ki-repo-website` | The generator-neutral `dist/` seam this adapter consumes | 2026-10-04 |

## Last review

A focused refresh on **2026-10-18**, under `KI-HARNESS-GOV-208`, rechecked BUILDS, DEV and WRANGLER and added BRANCHES, BUILDS-API, VERSIONS, PREVIEWS and ACCESS for the branch-previews section; the other rows keep their 4 October review.

- Reconciled: the Preview command watch item and the second-trigger pattern are one setting. A Worker has at most two Builds triggers, production and preview; the dashboard shows the preview trigger as Enable Preview Builds with its Preview command, and the API holds it as the second trigger. The house Preview command stays `bun run ki:site:upload`, which runs `bunx wrangler versions upload` and yields Version URLs.
- New: Worker Previews (`wrangler preview`, changelog of 22 September 2026) are a separate model. New Workers default to it, and an existing Worker's switch is one-way, after which a custom Preview command must invoke `wrangler preview`. The standard does not adopt it; watch for a proposal.
- Confirmed: disabling `workers.dev` leaves Version URLs on; `preview_urls` defaults to the `workers_dev` value when no setting exists; Access hostname applications accept a partial wildcard in one subdomain label and take precedence over Worker-level and account-level Access; the Builds API needs a user-scoped token.
- Unconfirmed in documentation: the Builds API reference documents no trigger DELETE call; the restore path's `DELETE /accounts/{account_id}/builds/triggers/{trigger_uuid}` rests on the live run of 18 October 2026.

REFRESH last ran in full on **2026-10-04**; all eight pages were reachable. Current Cloudflare documentation still confirms Workers Static Assets for new projects, assets-only deployments without a Worker script, Workers Builds' build/deploy command pair, the Worker custom-domain path, workers.dev URL syntax, and the `assets` key set. The canonical deployed site still matches the standard.

- Corrected: partial (CNAME) setup is available on Business and Enterprise plans, not Enterprise only; subdomain setup remains Enterprise-only. The standard's custom-domain clause now says so.
- `pages_build_output_dir` is retained only as a mechanically rejected legacy Pages marker; use `assets.directory`.
- Workers Builds has no "deploy directory" field. The deploy command defaults to `npx wrangler deploy`; the Wrangler assets directory owns the output path.
- An interactive app adds `assets.not_found_handling = "single-page-application"` without adding a `main` Worker entry.
- Watch: Wrangler remains on major version 4, and Cloudflare now defaults `observability.enabled` to true for new Workers; the explicit declaration stays required.
- Watch the Pages-to-Workers direction and dashboard information architecture during each monthly refresh.

[assets]: https://developers.cloudflare.com/workers/static-assets/
[best]: https://developers.cloudflare.com/workers/best-practices/workers-best-practices/
[builds]: https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
[domains]: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
[workers-dev]: https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
[dns-partial]: https://developers.cloudflare.com/dns/zone-setups/partial-setup/
[dns-subdomain]: https://developers.cloudflare.com/dns/zone-setups/subdomain-setup/
[wrangler]: https://developers.cloudflare.com/workers/wrangler/configuration/
[branches]: https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/
[builds-api]: https://developers.cloudflare.com/workers/ci-cd/builds/api-reference/
[version-urls]: https://developers.cloudflare.com/workers/configuration/previews/
[previews]: https://developers.cloudflare.com/workers/previews/
[access]: https://developers.cloudflare.com/workers/configuration/cloudflare-access/
[access-paths]: https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/
