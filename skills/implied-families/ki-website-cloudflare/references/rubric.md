<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — website-cloudflare

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical; this file is generated from the in-memory catalogue. Edit the item definitions, then rerun `scripts/rubric/publish.ts`.

## WCF — Cloudflare hosting

→ [standard](standards.md)

Workers + Static Assets hosting standard.

- **WCF-1 [M] — site Worker config** — A site Worker configuration with static assets exists. (standards.md)
- **WCF-2 [M] — Workers deploy** — Deployment uses Workers + Static Assets, not Pages. (standards.md)
- **WCF-3 [M] — single site Worker** — Exactly one site Worker carries an assets block. (standards.md)
- **WCF-4 [M] — assets directory** — Assets point at the build dist directory. (standards.md)
- **WCF-6 [M] — generated directories ignored** — dist and .wrangler are gitignored. (standards.md)
- **WCF-8 [M] — Worker identity** — name and compatibility date are present. (standards.md)
- **WCF-9 [M] — observability** — observability.enabled is true. (standards.md)
- **WCF-10 [M] — custom-domain routes** — Routes use custom_domain where appropriate. (standards.md)
- **WCF-13 [M] — deploy script** — A deploy script runs wrangler deploy. (standards.md)
- **WCF-14 [M] — preview script** — A preview script runs wrangler dev. (standards.md)
- **WCF-19 [M] — companion Worker boundary** — Companion Workers remain out of scope. (standards.md)
- **WCF-20 [M] — hosting opt-in** — The Cloudflare opt-in table is present. (standards.md)
- **WCF-21 [M] — opt-in validation** — The opt-in site root is valid. (standards.md)
- **WCF-22 [M] — hosting delta** — This remains the hosting delta only. (standards.md)
