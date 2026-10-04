# Sources — where the standard comes from

**Refresh:** external-spec · monthly

Mode REFRESH re-fetches these sources, reconciles them with the standard and structured catalogue, then updates the review dates and this review note. The dashboard information architecture and Cloudflare's Pages-to-Workers direction remain moving surfaces.

## Authoritative Cloudflare sources

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| ASSETS | [Workers Static Assets][assets] | `assets`, assets-only Workers, and SPA fallback | 2026-10-04 |
| BUILDS | [Workers Builds configuration][builds] | Build command, deploy command, and optional root directory | 2026-10-04 |
| BEST | [Workers best practices][best] | Workers Static Assets as the target for new projects | 2026-10-04 |
| WRANGLER | [Wrangler configuration][wrangler] | Worker identity, routes, assets, and observability | 2026-10-04 |
| DOMAIN | [Workers Custom Domains][domains] | Dashboard path and `custom_domain` routes | 2026-10-04 |
| DEV | [workers.dev][workers-dev] | `<name>.<account-subdomain>.workers.dev` URL syntax | 2026-10-04 |
| DNS | [Partial setup][dns-partial] · [Subdomain setup][dns-subdomain] | Plan gating for off-Cloudflare zone setups | 2026-10-04 |

The dashboard navigation name **Workers & Pages** remains correct in operator instructions even though Pages is not the deployment target for new projects.

## In-house source

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| BUILD | `ki-repo-website` | The generator-neutral `dist/` seam this adapter consumes | 2026-10-04 |

## Last review

REFRESH last ran **2026-10-04**; all eight pages were reachable. Current Cloudflare documentation still confirms Workers Static Assets for new projects, assets-only deployments without a Worker script, Workers Builds' build/deploy command pair, the Worker custom-domain path, workers.dev URL syntax, and the `assets` key set. The canonical deployed site still matches the standard.

- Corrected: partial (CNAME) setup is available on Business and Enterprise plans, not Enterprise only; subdomain setup remains Enterprise-only. The standard's custom-domain clause now says so.
- `pages_build_output_dir` is retained only as a mechanically rejected legacy Pages marker; use `assets.directory`.
- Workers Builds has no "deploy directory" field. The deploy command defaults to `npx wrangler deploy`; the Wrangler assets directory owns the output path.
- An interactive app adds `assets.not_found_handling = "single-page-application"` without adding a `main` Worker entry.
- Watch: Workers Builds now names its non-production setting **Preview command**, defaulting to `npx wrangler preview`; `npx wrangler versions upload` remains a documented replacement that yields a Version URL. The house `upload` script is unchanged pending a proposal.
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
