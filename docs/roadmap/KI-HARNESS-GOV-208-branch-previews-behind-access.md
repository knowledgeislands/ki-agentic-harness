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
updated_at: 2026-10-17T23:53:51Z
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

## Current state

Draft at `next`, adopted on 18 October 2026 and shaped here for Kris's Ready decision. The [Cloudflare hosting standard](../../skills/repo-structure/ki-repo-website-cloudflare/references/standards-cloudflare-hosting.md) names the optional `upload` script in section 4 and the `main` build-and-deploy pair in section 5, and says nothing about non-production branch builds, preview URLs, Access in front of them, or a restore path for the dashboard state they change. Rubric item WCF-25 treats the upload script as optional in every case, WCF-26 checks the guide for builds, domains, redirects and `workers.dev` but not previews, and the rubric context does not read `preview_urls` from `wrangler.jsonc`. The [source list](../../skills/repo-structure/ki-repo-website-cloudflare/references/sources.md) was last refreshed on 4 October 2026 and carries a watch note that Workers Builds now names a non-production **Preview command** on its build settings; the Phase 3 run instead built previews through a second trigger. The worked example is the `5g-emerge-phase3` repository's Cloudflare developer guide at commits `80395f5` and `05e1d44`.

## Steps

- [ ] Refresh the BUILDS, DEV and WRANGLER sources and add Access and preview-URL sources in `references/sources.md` through the skill's REFRESH mode, and reconcile the Preview command watch note with the second-trigger pattern before writing the section; if current documentation makes the second trigger unnecessary, write the section on the documented setting and record the change under Discussion.
- [ ] Add a new section 6, "Branch previews behind Access", to `references/standards-cloudflare-hosting.md` carrying the six points under Proposed section content, renumber the guide and boundaries sections to 7 and 8, and update the contents list and every in-skill anchor that cites them.
- [ ] State in the new section that turning on `preview_urls` makes the house `upload` script and its `ki:site:upload` alias required, and amend section 4's optional wording to match.
- [ ] Add the preview rows to the guide contract in the renumbered section 7: the non-production trigger's branch filters, build and deploy commands, the preview Access application and its policy, and the `previews_enabled` flag.
- [ ] Teach the rubric context to read `preview_urls` from the site `wrangler.jsonc`, with context tests.
- [ ] Extend WCF-25 so the upload script and alias are required, not optional, when `preview_urls` is true, with fixture tests for both branches.
- [ ] Add WCF-27, "preview Access pairing", `[M-heuristic + J]`: when `preview_urls` is true, the Cloudflare guide must declare a preview Access application covering `*-<name>.<account-subdomain>.workers.dev`; judgment confirms it matches the live dashboard. Register it in the item index with its tests.
- [ ] Update WCF-26's review prompt to include the preview rows, and move rubric source anchors to the renumbered sections.
- [ ] Add a "Branch previews behind Access" exemplar to `references/exemplars.md`, adapted from the Phase 3 guide with account identifiers, hostnames and policy members replaced by placeholders.
- [ ] Regenerate `references/rubric.md` with `ki dev skill rubric ki-repo-website-cloudflare`.
- [ ] Run the checks under Verify.

## Files touched

- `skills/repo-structure/ki-repo-website-cloudflare/references/standards-cloudflare-hosting.md`
- `skills/repo-structure/ki-repo-website-cloudflare/references/exemplars.md`
- `skills/repo-structure/ki-repo-website-cloudflare/references/sources.md`
- `skills/repo-structure/ki-repo-website-cloudflare/references/rubric.md` (generated)
- `skills/repo-structure/ki-repo-website-cloudflare/scripts/rubric/contexts/website-cloudflare.ts` and its test
- `skills/repo-structure/ki-repo-website-cloudflare/scripts/rubric/items/wcf.ts`, `index.ts` and `index.test.ts`
- `skills/repo-structure/ki-repo-website-cloudflare/SKILL.md`, only if its section summary names the sections being renumbered

## Verify

- `bun run test` passes, including new context and item tests: `preview_urls: true` without an upload script fails WCF-25; `preview_urls: true` with a guide lacking a preview Access application fails WCF-27; a guide declaring one passes; `preview_urls` absent or false leaves both not applicable.
- `bunx tsc --noEmit` passes.
- `ki dev skill rubric ki-repo-website-cloudflare` leaves `references/rubric.md` unchanged after regeneration, and it lists WCF-27.
- `ki repo audit --skill ki-skills --repo .` reports no new finding for `ki-repo-website-cloudflare`, and `ki repo audit --skill ki-work-roadmap --repo .` passes.
- Assertion: no in-skill link targets the old section 6 or 7 anchors (`grep` for `#6-the-cloudflare-guide` and `#7-boundaries` finds nothing).
- Assertion: no account identifier, token, email address or real policy member appears in the new section or exemplar.

## Dependencies / blocks

No local blocker. The Phase 3 run that confirmed the pattern has landed in the `5g-emerge-phase3` repository, whose Cloudflare developer guide is the worked example. The source refresh step reads Cloudflare's public documentation, so the delivery run needs read-only web access; it makes no Cloudflare API call and changes no hosted repository. Workers Builds build variables stay out, pending the Phase 3 thread's open BUILD-VARS question.

## Documentation impact

### Decision Records

None. The section records an operating pattern under an existing hosting standard; the authority for it is Kris's 18 October 2026 direction quoted under Context, and the planning answers below are approved with the plan.

### Specifications

None. The skill standard and its rubric are the contract; no repository Specification governs Cloudflare hosting.

### Guides

The hosting standard's guide contract gains preview rows. Hosted repositories adopt them through their own audit; this item edits no hosted guide.

### Roadmap

None expected. If the source refresh shows the Workers Builds Preview command replaces the second trigger, the section follows the documentation and no follow-on is needed; a shared Cloudflare restore procedure is captured only when a second Cloudflare change needs one.

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

### Planning answers

Proposed by the planning run on 18 October 2026 for Kris's approval with the plan:

- **Rubric pairing.** Check it. A preview URL without Access is a public copy of unreleased work, and the mechanical half is cheap: WCF-27 reads `preview_urls` and looks for a preview Access application in the guide, while judgment confirms the dashboard matches, as WCF-26 already does for the other dashboard rows.
- **Restore-path home.** Keep the capture in this skill's section. It is the only consumer today, and Access for preview hostnames does not cut an operator's connection, so it falls outside the `ki-engineering` connection-critical rule rather than under it. Extract a shared Cloudflare restore procedure only when a second Cloudflare change needs one.
- **Upload script.** Make it required when `preview_urls` is true. The non-production trigger's deploy command is `ki:site:upload`, so a site with previews on and no upload script has failing preview builds.
