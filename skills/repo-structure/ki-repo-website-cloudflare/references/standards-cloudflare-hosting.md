# The Cloudflare hosting standard

The hosting overlay applies to the single core-selected site or, with a named multi-site registry, every registered site by default. `[skills.ki-repo-website-cloudflare]` may use only `sites = ["name"]` to select a non-empty subset of known names; it never declares paths. Every selected site receives a separate hosting audit subject. The existing keyless form remains the complete single-site contract.

The normative, quotable reference for serving a built static site on Cloudflare — what good hosting looks like, and why. The audit rubric ([rubric.md](rubric.md)) turns each section into checkable items; the procedure is in the [SKILL.md](../SKILL.md). See [the source list](sources.md) for provenance.

This skill owns the **deploy/serve delta for the site Worker**. The `dist/` it serves is `ki-repo-website`'s output (the seam); the toolchain is `ki-engineering`'s. Both are referenced here, not restated. **Companion Workers are out of scope.**

## Contents

- [Credential access](#credential-access)
- [Zero Trust team naming](#zero-trust-team-naming)
- [1. Model — Workers Static Assets, not Pages](#1-model--workers-static-assets-not-pages)
- [2. The `dist/` seam](#2-the-dist-seam)
- [3. The site `wrangler.jsonc` shape](#3-the-site-wranglerjsonc-shape)
- [4. The script family](#4-the-script-family)
- [5. CI/CD](#5-cicd)
- [6. Branch previews behind Access](#6-branch-previews-behind-access)
- [7. The Cloudflare guide — dashboard-owned settings](#7-the-cloudflare-guide--dashboard-owned-settings)
- [8. Boundaries — what is not in scope](#8-boundaries--what-is-not-in-scope)

## 1. Model — Workers Static Assets, not Pages

The site is **one Cloudflare Worker serving Static Assets**. The Worker has an `assets` block naming a directory of built files; `wrangler deploy` uploads them and wires the Worker. There is no server-side code for this static deployment — the assets are served directly at the edge.

- **Workers Static Assets**, deployed with `wrangler deploy`. Cloudflare recommends Workers for new static sites and SPAs; Pages is not the house deployment target for new projects. A `wrangler pages deploy` command is a finding.
- **`pages_build_output_dir` is the legacy Pages marker.** Its presence is a failure even when scripts use `wrangler deploy`. Replace it with `"assets": { "directory": "./dist" }`.
- **One `wrangler.jsonc` per deployable.** The **site** Worker's config carries an `assets` block and no `main`. The absence of `main` is load-bearing: an assets-only Worker executes no server-side code, which is what allows a repository to state mechanically that its published deployment has no control plane.
- The site root — and thus where its `wrangler.jsonc` lives — is owned by `[skills.ki-repo-website].site-root`, which defaults to **`apps/site`**. The Cloudflare table is a keyless hosting opt-in: it consumes the core location rather than accepting a second site-root declaration. An explicit flat consumer (`site-root = "."`, with config at the repo root) remains valid.

## 2. The `dist/` seam

The hosting layer and the build layer meet at exactly one place: the **`dist/` directory**.

- The selected website implementation **emits** `dist/`. This skill **serves** it by pointing `assets.directory` at that exact build output.
- **`assets.directory` is relative to the `wrangler.jsonc` file**: `"./dist"` when the config is at the repo root and `"dist"` in the canonical `apps/site/` application workspace. A different core-selected layout may use another relative path, but it must resolve to the build's actual `dist/` output.
- **The build runs before deploy.** `dist/` is gitignored and regenerated; deploy reads whatever the last build produced. A `ki:site:preview` script chains build → `wrangler dev` for a local check against the real Worker runtime.
- Neither layer needs the other's internals — only the `dist/` path. That is what makes the split clean and the hosting skill reusable for any static `dist/`.

## 3. The site `wrangler.jsonc` shape

`wrangler.jsonc` (JSONC — comments encouraged, in the house voice explaining each block). The minimal conformant shape:

```jsonc
{
  // <site> — Cloudflare Workers Static Assets deployment.
  "name": "<site-name>",
  "compatibility_date": "<YYYY-MM-DD>",
  // The selected website implementation builds dist/ beside this file.
  // Path is relative to THIS file.
  "assets": { "directory": "dist" },
  // Persist Workers logs in the dashboard (Workers & Pages → <name> → Logs).
  "observability": { "enabled": true }
}
```

Required fields:

- **`name`** — the Worker name (kebab-case, usually the repo/site name).
- **`compatibility_date`** — a pinned `YYYY-MM-DD`. (For a pure-assets Worker there is no runtime code, but the field is set.)
- **`assets.directory`** — the `dist/` seam (§2).
- **`observability.enabled: true`** — so `console.*` / request logs are queryable in the dashboard, not just live `wrangler tail`.

Optional when the site has a custom domain; omission is conformant and leaves the deployment on its workers.dev URL:

- **`routes` with `custom_domain: true`** — the apex (and usually `www`, redirected to apex). Without a custom domain, the Worker URL is `<name>.<account-subdomain>.workers.dev`, not `<name>.pages.dev`. In the dashboard the operator path is **Workers & Pages → Overview → Worker → Settings → Domains & Routes → Add → Custom Domain**; “Workers & Pages” remains the correct navigation label.
- **An active zone on the same account** — a custom domain requires the hostname to belong to a zone in the Cloudflare account that owns the Worker, because Cloudflare creates the proxied DNS record and issues the certificate itself rather than reading DNS you host elsewhere. The two zone setups that keep authoritative DNS with another provider — partial (CNAME) setup and subdomain setup — are plan-gated: partial setup needs a Business or Enterprise plan and subdomain setup is Enterprise-only, so where a domain is hosted outside Cloudflare the only Free or Pro route to a custom domain is delegating the whole apex zone to Cloudflare nameservers. Deleting a custom domain does not remove its certificate; retire that separately under SSL/TLS → Edge Certificates.

Other `assets` keys (`html_handling`, `not_found_handling`, `binding`, `run_worker_first`) are optional and per-site; do not require them.

For `[skills.ki-repo-website-app]`, `assets.not_found_handling` is not optional: set it to `"single-page-application"` so browser navigation to a client-side route returns `index.html`.

## 4. The script family

The public hosting alias may resolve through the exact selected-package terminal command, one exact `self:site:<primary>:<operation>` hop, or exact `turbo run <operation>` delegation when root `turbo.json` declares that operation. The hosting seam checks exact `deploy`, `preview`, or `upload` task presence without duplicating `ki-engineering`'s generic task-graph adoption and quality checks. Direct `--cwd` command chains, undeclared or mismatched tasks, additional shell commands, missing aliases, and cyclic forwarding remain invalid.

The selected site's `<site-root>/package.json` owns local operations:

- **`deploy`** → `bunx wrangler deploy`.
- **`preview`** → build, then `bunx wrangler dev` through the real Worker runtime.
- **`upload`** → `bunx wrangler versions upload` — create an undeployed Worker version and its Version URL for Workers Builds. It is optional, except that a site with `preview_urls: true` must declare it and its public alias, because its non-production trigger runs `ki:site:upload` ([§6](#6-branch-previews-behind-access)). This is a credentialed remote mutation: only an explicitly authorised operator or Workers Builds service may run it. Audits, conformance, local builds, tests, and dry evaluation inspect the manifest without invoking Wrangler.
- **`clean`** → removes `dist/` and `.wrangler/`; the website core owns the build-output part of that lifecycle.

The repository root owns the public aliases. For the default root these are `"ki:site:deploy": "bun run --cwd apps/site deploy"`, `"ki:site:preview": "bun run --cwd apps/site preview"`, and the upload equivalent, `"ki:site:upload": "bun run --cwd apps/site upload"`, whenever the upload script exists. An explicitly flat site uses `bun run <operation>` instead. This keeps public orchestration stable without duplicating `ki:site:*` names inside the application package.

The root `ki:site:build` / `ki:site:dev` aliases and local build/dev operations belong to `ki-repo-website`, not here. `.wrangler/` is gitignored.

## 5. CI/CD

- **Cloudflare Workers Builds (git integration)** is the deploy path: a push/merge to `main` triggers Cloudflare to build and deploy. The repo needs no deploy workflow of its own for this.
- Workers Builds runs a **build command** followed by a **deploy command**. The house pair is `bun run ki:site:build` and `bun run ki:site:deploy` (or the equivalent `bunx wrangler deploy`). There is no Pages-style “deploy directory” setting; `assets.directory` in Wrangler owns that path. Use the optional root directory only to choose the project working directory in a monorepo.
- Builds of every other branch are optional and follow [§6](#6-branch-previews-behind-access): they upload an undeployed version and never run `wrangler deploy`.
- A repo **may** run a **GitHub Action for pre-deploy content work** (e.g. applying content, optimising images) that commits to `main` and lets Workers Builds deploy the result — but that Action is content tooling, not the hosting standard.
- **Commit-SHA injection** (`WORKERS_CI_COMMIT_SHA` surfaced into the page, e.g. as a `<meta>`) is an optional nicety, not required.

## Credential access

When a run is separately authorised to read Cloudflare credentials, it reads them only through `~/bin/cf_token`. No territory's notes record credential item or token ids, and credential values never enter output or tracked files. Kris adopted the Cloudflare half of RUN-SECRETS on 25 October 2026; this is an access rule, not authority for a credential read or a Cloudflare operation. The background-run [authority limits](../../../governance/ki-delegation/references/standards-background-runs.md#authority-tiers) still apply.

## Zero Trust team naming

Each Cloudflare account's Zero Trust team, which gives the Access login its `<team>.cloudflareaccess.com` domain, is named for that account's own identity in kebab case: the personal account's team is `midnight-ninja` and the 5G Emerge account's is `5g-emerge`. A team never keeps the name of another territory or of a project it once hosted, and carries no stale suffix such as `-io`. The organisation name equals the team domain, as in the Valle Armonia and 5G Emerge accounts, and the login page's text belongs to the account, with no other territory's header or footer. Kris set this on 29 October 2026 when renaming both teams, asking that it be "rolled out uniformly ... following conventions".

A team rename is a change to the Access organisation, which makes it connection-critical under the background-run [connection-critical rule](../../../governance/ki-delegation/references/standards-background-runs.md#connection-critical-changes):

1. **Restore path first.** Save the current team domain, organisation name and login text, and the identity providers' redirect URLs. To undo a rename while the old name is still unclaimed, put those values back on the account's Access organisation.
2. **Rename, never delete.** Deleting an organisation locks its name permanently; a rename frees the old name for any account to claim. To move a name between two accounts, free it in one and claim it in the other straight away.
3. **Dependants.** A team rename is blocked while dashboard SSO is on. Identity providers outside Cloudflare need the new redirect URL; WARP clients must be enrolled again under the new team name; anyone signed in under the old issuer signs in again.
4. **Confirm.** Re-read the organisation and each identity provider's redirect URL, check that the login endpoint answers, and check that every Access application is intact.
5. **References.** The territory that owns any document or configuration naming the old team domain updates it there.

## 6. Branch previews behind Access

A site may build every non-production branch into an **undeployed preview version**, reachable only through **Cloudflare Access**. Production keeps serving the version last deployed from `main`; nothing promotes a preview except a push to `main`. The pattern was proven on a live site on 18 October 2026 and changes only dashboard state plus one `wrangler.jsonc` key, so it is safe to adopt and to undo, provided the six points below are followed in order.

1. **Restore path first.** Before any change, save the current state as JSON, each part beside the call that puts it back, with policy email addresses redacted and no token. Read the Worker's tag (`GET /accounts/{account_id}/workers/scripts`), its Builds triggers (`GET /accounts/{account_id}/builds/workers/{worker_tag}/triggers`), each trigger's variables (`GET /accounts/{account_id}/builds/triggers/{trigger_uuid}/environment_variables`), the `workers.dev` and preview flags (`GET /accounts/{account_id}/workers/scripts/{name}/subdomain`), the Access applications and reusable policies, and the live deployment. Test one undo call by writing a saved value back unchanged. Record the restore steps in the guide ([§7](#7-the-cloudflare-guide--dashboard-owned-settings)): turn preview URLs off and set `preview_urls` false on `main`, delete the non-production trigger, and only then delete the preview Access application.
2. **Token status and expiry.** Check the token with `GET /user/tokens/verify` before the restore capture, and stop if it is inactive or expires within the run. An expired token stops the run before any change, which is the safe failure.
3. **Scoped token.** A `wrangler` OAuth session usually cannot read the Builds API, which needs a **user-scoped** API token. Use one with Workers Scripts Edit, Workers Builds Configuration Edit, Access: Apps and Policies Edit, and Account Settings Read, held in a secret store and never written to the repository or the restore capture.
4. **Non-production trigger and command.** A Worker has at most two Workers Builds triggers: production, on the production branch, and preview, on every other branch. The dashboard shows the preview trigger as **Settings → Build → Branch control → Enable Preview Builds** and its **Preview command**; the API holds it as the second trigger. Create it with `POST /accounts/{account_id}/builds/triggers`, copying the production trigger's `external_script_id`, `repo_connection_uuid` and `build_token_uuid`, with `branch_includes ["*"]`, `branch_excludes ["main"]`, the production build command, and the house `bun run ki:site:upload` as its deploy (Preview) command, which runs `bunx wrangler versions upload`. Never use `wrangler deploy` there: it publishes production from any branch. The undo is to delete the trigger.
5. **Access before `preview_urls`.** Create a self-hosted Access application for `*-<worker>.<account-subdomain>.workers.dev` plus the bare `<worker>.<account-subdomain>.workers.dev`, and attach the site's reusable allow policy with no bypass. The partial wildcard matches both version URLs and branch-alias URLs, and a hostname application takes precedence over Worker-level and account-level Access. Then turn previews on with `POST /accounts/{account_id}/workers/scripts/{name}/subdomain {"enabled":false,"previews_enabled":true}`, check that a preview URL returns 302 to the team's Access login, and only then commit `preview_urls: true`. Every production deploy re-applies `wrangler.jsonc`, so a false value there switches previews off again.
6. **Gotchas.** `preview_urls: false` silently gives branch uploads no URL, and turning `workers_dev` off does not turn previews off. A branch cut before the upload script exists fails its preview build until it is rebased on `main`. Production bypass paths do not carry over to previews. The preview deny page is Cloudflare's default, not the site's own access page. The build log prints both preview URLs — the version URL `<version-prefix>-<worker>.<account-subdomain>.workers.dev` and the branch alias `<branch>-<worker>.<account-subdomain>.workers.dev` — which is the easiest way to find them.

This section uses **Version URLs**, created by `wrangler versions upload`. Cloudflare's newer **Worker Previews**, created by `wrangler preview`, are a separate model: new Workers default to it, and an existing Worker's switch to it is one-way, after which a custom Preview command must invoke `wrangler preview`. Do not make that switch under this section; a Worker already on Worker Previews is a recorded gap until the house standard adopts that model.

## 7. The Cloudflare guide — dashboard-owned settings

Part of a deployment's contract lives in the Cloudflare dashboard, where no versioned file can express it: the Workers Builds build command, deploy command, and root directory; custom-domain and redirect choices; whether `workers.dev` serves. A hosted repository therefore carries **`docs/guides/developer/cloudflare.md`** — the developer and maintainer guide for every Cloudflare aspect of that repository. The exact role stays inside the audience route governed by `ki-guides` rather than bypassing it with a root-level file.

A site with `preview_urls: true` adds preview rows to the guide: the non-production trigger's branch filters, build command and Preview command; the preview Access application's hostnames, login method and policy; the `previews_enabled` flag beside `workers.dev`; and the restore path saved before the change ([§6](#6-branch-previews-behind-access)).

The split rule: **`wrangler.jsonc` owns everything it can express; the guide records only what the dashboard owns**, as the exact values an operator enters — a build-command row, a redirect rule — so the dashboard can be reconstructed from the repository alone and a settings change is visible in review. The guide duplicates nothing the config already declares; it links to `wrangler.jsonc` for the versioned half. When a dashboard setting changes, the guide changes in the same breath — a guide that trails the dashboard is drift, exactly the kind this file exists to catch.

## 8. Boundaries — what is not in scope

This standard governs **only the site Worker** — the one that serves `dist/`. Out of scope, with their homes:

- **Companion Workers** — a bot, an ingress/webhook receiver, an API, anything with a `main` entry and bindings (R2, Durable Objects + their `migrations`, KV, D1), `triggers.crons`, or `vars`/secrets. These are real Workers but **not** the static site; they route to the generic `cloudflare` / `wrangler` skills. The audit notes their presence and moves on.
- **Workers Builds build variables** — not yet a house pattern; record them in the guide when a site sets them.
- **General Cloudflare/Workers/wrangler usage** — `wrangler dev` mechanics, general Access mechanics, binding configuration, secret management, deploy flags, runtime APIs → the `cloudflare` / `wrangler` skills.
- **Building the `dist/`** → `ki-repo-website` plus exactly one of `ki-repo-website-content` or `ki-repo-website-app`.
- **The toolchain** (Bun, lint/deps, tsconfig/biome) → `ki-engineering`.
