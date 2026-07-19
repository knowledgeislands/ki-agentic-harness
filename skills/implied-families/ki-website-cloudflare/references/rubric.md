<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — website-cloudflare

## WCF — Cloudflare hosting

→ [standard](standards.md)

Workers + Static Assets hosting standard.

- **WCF-1 [M] — site Worker config** — A site Worker configuration with static assets exists.
- **WCF-2 [M] — Workers deploy** — Deployment uses Workers + Static Assets, not Pages.
- **WCF-3 [M] — single site Worker** — Exactly one site Worker carries an assets block.
- **WCF-4 [M] — assets directory** — Assets point at the build dist directory.
- **WCF-6 [M] — generated directories ignored** — dist and .wrangler are gitignored.
- **WCF-8 [M] — Worker identity** — name and compatibility date are present.
- **WCF-9 [M] — observability** — observability.enabled is true.
- **WCF-10 [M] — custom-domain routes** — Routes use custom_domain where appropriate.
- **WCF-13 [M] — deploy script** — A deploy script runs wrangler deploy.
- **WCF-14 [M] — preview script** — A preview script runs wrangler dev.
- **WCF-19 [M] — companion Worker boundary** — Companion Workers remain out of scope.
- **WCF-20 [M] — hosting opt-in** — The Cloudflare opt-in table is present.
- **WCF-21 [M] — opt-in validation** — The opt-in site root is valid.
- **WCF-22 [M] — hosting delta** — This remains the hosting delta only.
