---
id: KI-HARNESS-GOV-208
area: GOV
title: Branch previews behind Access
kind: deliver
purpose: learning
component: repo-structure
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-17T23:40:14Z
updated_at: 2026-10-17T23:53:00Z
---

# KI-HARNESS-GOV-208: Branch Previews Behind Access

## Goal

The `ki-repo-website-cloudflare` hosting standard carries a "branch previews behind Access" section, so that a site on Workers Static Assets with Workers Builds can build every non-production branch into an undeployed preview version, reachable only through Cloudflare Access, without touching production and with a saved restore path.

## Context

Kris Brown said on 18 October 2026, in the 5G Emerge Phase 3 coordination thread, answering BRANCH-DEPLOY: "I do agree that branch deploys would be useful on the site, and I guess in general it's something we should learn as part of the site skill that we're using with [Cloudflare]". The thread's SKILL-HOME reading the same day placed the learning in `ki-repo-website-cloudflare` as a branch-preview standard, through a harness work record once a live run had confirmed it.

The Phase 3 run `branch-previews-2` confirmed it on 18 October 2026, in the `5g-emerge-phase3` repository's commits `80395f5` and `05e1d44`. A second Workers Builds trigger now builds every branch except `main` and runs `wrangler versions upload`. A third Access application covers the preview hostnames with the site's reusable allow policy, and `preview_urls` was committed true only after Access covered them. A throwaway branch's version URL and branch-alias URL both redirected to the Access login on every path tried, `workers.dev` still refused, and production's live version and public page did not change. That repository's Cloudflare developer guide is the worked example.

The current standard names the optional `upload` script in section 4 and the `main` build-and-deploy pair in section 5, but says nothing about non-production branch builds, preview URLs, Access in front of them, or restoring the dashboard state they change.

## Boundary

- In: a new section of `references/standards-cloudflare-hosting.md`, with matching rubric items and their published rubric, a worked exemplar in `references/exemplars.md`, the dashboard rows the section adds to the section 6 guide contract, and refreshed `references/sources.md` entries for the Builds, Access and preview-URL facts it relies on.
- Out: the `cloudflare` and `wrangler` skills' general Wrangler and Access mechanics; companion Workers; any change to a hosted repository, whose owner adopts the section on their own audit; Workers Builds build variables, still an open question in the Phase 3 thread.

## Discussion

Captured from the Phase 3 run's refined skill-learning draft. Adopting this record and approving the section's content are Kris's, under `ki-next` and `ki-plan`.

### Adoption

Kris Brown approved adoption on 18 October 2026 in the 5G Emerge Phase 3 coordination thread, answering ADOPT-208 with option a): "adopt KI-HARNESS-GOV-208 as draft, horizon next, kind deliver, purpose learning, and launch a ki-agentic-harness run to plan it to Ready under ki-plan". Approving the section's content and the plan remains Kris's, at the Ready decision.

### Proposed section content

1. **Restore path first.** Before any change, save the current state as JSON, each part beside the call that puts it back, with policy email addresses redacted and no token. Read the Worker's tag (`GET /accounts/{account_id}/workers/scripts`), its Builds triggers (`GET /accounts/{account_id}/builds/workers/{tag}/triggers`), each trigger's variables (`GET /accounts/{account_id}/builds/triggers/{trigger_uuid}/environment_variables`), the `workers.dev` and preview flags (`GET /accounts/{account_id}/workers/scripts/{name}/subdomain`), the Access applications and reusable policies, and the live deployment. Test one undo call by writing a saved value back unchanged.
2. **Token status and expiry.** Check the token with `GET /user/tokens/verify` before the restore capture and stop if it is inactive or expires within the run. The first Phase 3 attempt stopped before any change because its token had expired.
3. **Scoped token.** A `wrangler` OAuth session usually cannot read the Builds API. Use a scoped API token with Workers Scripts Edit, Workers Builds Configuration Edit, Access: Apps and Policies Edit, and Account Settings Read.
4. **Non-production trigger and command.** Non-production branch builds are a second trigger, not a flag on the production trigger. Create it with `POST /accounts/{account_id}/builds/triggers`, copying the production trigger's `external_script_id`, `repo_connection_uuid` and `build_token_uuid`, with `branch_includes ["*"]`, `branch_excludes ["main"]`, the same build command, and the deploy command set to the house `ki:site:upload` script, `bunx wrangler versions upload`. Never `wrangler deploy`, which publishes production from any branch. The undo is to delete the trigger.
5. **Access before `preview_urls`.** Create a self-hosted Access application for `*-<worker>.<account-subdomain>.workers.dev`, plus the bare `<worker>.<account-subdomain>.workers.dev`, and attach the site's reusable allow policy with no bypass. The partial wildcard is accepted and matches both version URLs and branch-alias URLs. Then turn previews on with `POST .../subdomain {"enabled":false,"previews_enabled":true}`, check that a preview URL returns 302 to the team's Access login, and only then commit `preview_urls: true`. Every production deploy re-applies `wrangler.jsonc`, so a false value there switches previews off again.
6. **Gotchas.** `preview_urls: false` silently gives branch uploads no URL. A branch cut before the upload script exists fails its preview build until it is rebased. Production bypass paths do not carry over to previews. The preview deny page is Cloudflare's default, not the site's own access page. The build log prints both preview URLs, which is the easiest way to find them.

### Questions for planning

- Whether the rubric should check `preview_urls: true` against a declared preview Access application in the guide, or leave the pairing to judgment.
- Whether the restore-path capture belongs in this skill or in a shared connection-critical procedure that other Cloudflare changes would also cite.
- Whether the house `upload` script, now optional, becomes required for a repository that turns on branch previews.
