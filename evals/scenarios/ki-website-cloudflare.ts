/**
 * Eval scenarios for the `ki-hosting-cloudflare` skill — the deploy/serve
 * delta for the one site Worker.
 *
 * Design note: a capable model knows wrangler generically, so testing that shows "no
 * difference". These scenarios target house-ARBITRARY specifics a baseline cannot derive:
 * the Workers-Static-Assets-not-Pages decision, the `assets`-vs-`main` site/companion
 * distinction, and the exact `dist/` seam.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-hosting-cloudflare',
    id: 'host-not-pages',
    prompt:
      'How do we deploy a static site to Cloudflare under the Knowledge Islands house standard — which Cloudflare product, which deploy command, and which command must never be used?',
    assertions: [
      { name: 'Workers + Static Assets', re: /workers[^.\n]{0,20}static assets|static assets/i },
      { name: 'not Pages', re: /not pages|never[^.\n]{0,20}pages|migrated off pages/i },
      { name: 'never wrangler pages deploy', re: /wrangler pages deploy/i }
    ],
    rubric:
      'House decision: serve the site as a **Cloudflare Worker + Static Assets**, NOT Pages. Deploy with `wrangler deploy` (a Worker carrying an `assets` block). **Never `wrangler pages deploy`** — Cloudflare steers new sites to Workers + Static Assets and the house sites were explicitly migrated off Pages. A correct answer names Workers + Static Assets, says not Pages, and flags `wrangler pages deploy` as forbidden.'
  },
  {
    skill: 'ki-hosting-cloudflare',
    id: 'host-seam-and-companion',
    prompt:
      'In our site `wrangler.jsonc`, what does `assets.directory` point at, and how do we tell the in-scope site Worker apart from a companion Worker (a bot or ingress receiver) that lives in the same repo?',
    assertions: [
      { name: 'assets.directory points at dist/', re: /assets\.directory|\.\.?\/dist|dist\//i },
      { name: 'site Worker has assets and no main', re: /assets[^.\n]{0,30}(no|without)[^.\n]{0,8}main|no `?main`?/i },
      { name: 'companion routes to cloudflare/wrangler', re: /cloudflare[^.\n]{0,8}\/?[^.\n]{0,8}wrangler|generic (cloudflare|wrangler)/i }
    ],
    rubric:
      "House model: `assets.directory` is the **seam** — it points at the `dist/` that `ki-websites-11ty` emits (`./dist` flat, `../dist` from a `site/` subfolder). The in-scope **site Worker carries `assets` and no `main`**; a Worker with a `main` entry and no `assets` is a **companion** (bot, ingress, API, …) that belongs to the generic `cloudflare` / `wrangler` skills, not this one. A correct answer states assets.directory → dist/, the assets-and-no-main test for the site Worker, and that a main/no-assets Worker routes to the generic cloudflare/wrangler skills."
  },
  {
    skill: 'ki-hosting-cloudflare',
    id: 'host-config-keys',
    prompt: 'Beyond the `assets` block, what must our site `wrangler.jsonc` carry, and what gets gitignored for hosting?',
    assertions: [
      { name: 'name + compatibility_date', re: /compatibility_date/i },
      { name: 'observability enabled', re: /observability/i },
      { name: 'gitignore dist and .wrangler', re: /\.wrangler/i }
    ],
    rubric:
      'House shape: the site `wrangler.jsonc` carries `name`, a `compatibility_date`, the `assets` block, custom-domain `routes` (`custom_domain: true`, apex + www), and `observability.enabled: true`. For hosting, **`dist/` and `.wrangler/` are gitignored**. A correct answer names `compatibility_date`, `observability` enabled, and `.wrangler/` (plus `dist/`) gitignored.'
  }
]
