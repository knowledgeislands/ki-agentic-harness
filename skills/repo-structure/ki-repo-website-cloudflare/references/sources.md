# Sources — where the standard comes from

**Refresh:** external-spec · monthly

Mode REFRESH re-fetches these sources, reconciles them with the standard and structured catalogue, then updates the review dates and this review note. The dashboard information architecture and Cloudflare's Pages-to-Workers direction remain moving surfaces.

## Authoritative Cloudflare sources

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| ASSETS | [Workers Static Assets][assets] | `assets`, assets-only Workers, and SPA fallback | 2026-09-28 |
| BUILDS | [Workers Builds configuration][builds] | Build command, deploy command, and optional root directory | 2026-09-28 |
| BEST | [Workers best practices][best] | Workers Static Assets as the target for new projects | 2026-09-28 |
| WRANGLER | [Wrangler configuration][wrangler] | Worker identity, routes, assets, and observability | 2026-09-28 |
| DOMAIN | [Workers Custom Domains][domains] | Dashboard path and `custom_domain` routes | 2026-09-28 |
| DEV | [workers.dev][workers-dev] | `<name>.<account-subdomain>.workers.dev` URL syntax | 2026-09-28 |
| DNS | [Partial setup][dns-partial] · [Subdomain setup][dns-subdomain] | Plan gating for off-Cloudflare zone setups | 2026-09-28 |

The dashboard navigation name **Workers & Pages** remains correct in operator instructions even though Pages is not the deployment target for new projects.

## In-house source

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| BUILD | `ki-repo-website` | The generator-neutral `dist/` seam this adapter consumes | 2026-09-28 |

## Last review

REFRESH last ran **2026-09-28**. developers.cloudflare.com was unreachable from the refresh environment; docs checked via cloudflare/cloudflare-docs on GitHub. Core Cloudflare hosting contract appears unchanged; the Cloudflare Vite plugin is now documented as an alternative path for new projects.

- `pages_build_output_dir` is retained only as a mechanically rejected legacy Pages marker; use `assets.directory`.
- Workers Builds has no "deploy directory" field. The deploy command defaults to `npx wrangler deploy`; the Wrangler assets directory owns the output path.
- `assets.not_found_handling = "single-page-application"` confirmed still valid for SPA fallback.
- **Open watch-item (new):** Cloudflare documentation now explicitly surfaces a "Cloudflare Vite plugin" path as a scaffold option for React SPA + API Worker. Evaluate whether this is an alternative that the standard should acknowledge. This does not displace the Workers Static Assets + Wrangler path; it is an additional supported entry point.
- Watch the Pages-to-Workers direction and dashboard information architecture during each monthly refresh.

[assets]: https://developers.cloudflare.com/workers/static-assets/
[best]: https://developers.cloudflare.com/workers/best-practices/workers-best-practices/
[builds]: https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
[domains]: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
[workers-dev]: https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
[dns-partial]: https://developers.cloudflare.com/dns/zone-setups/partial-setup/
[dns-subdomain]: https://developers.cloudflare.com/dns/zone-setups/subdomain-setup/
[wrangler]: https://developers.cloudflare.com/workers/wrangler/configuration/
