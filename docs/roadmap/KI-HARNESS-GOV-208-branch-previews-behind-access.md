---
id: KI-HARNESS-GOV-208
area: GOV
title: Branch previews behind Access
kind: deliver
purpose: learning
component: repo-structure
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: a0b0296698f2bbaba49652596d9b5be5e9cbcd93
created_at: 2026-10-17T23:40:14Z
updated_at: 2026-10-18T00:52:00Z
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

Awaiting review at `now`, delivered on 18 October 2026 from baseline `a0b0296698f2bbaba49652596d9b5be5e9cbcd93`. The [Cloudflare hosting standard](../../skills/repo-structure/ki-repo-website-cloudflare/references/standards-cloudflare-hosting.md) carries section 6, "Branch previews behind Access", with the guide and boundaries sections renumbered to 7 and 8; WCF-25 requires the upload script and alias when `preview_urls` is true, WCF-27 pairs `preview_urls` with a preview Access application in the guide, and the [source list](../../skills/repo-structure/ki-repo-website-cloudflare/references/sources.md) records the 18 October refresh. Acceptance is Kris's under `ki-accept`.

## Steps

- [x] Refresh the BUILDS, DEV and WRANGLER sources and add Access and preview-URL sources in `references/sources.md` through the skill's REFRESH mode, and reconcile the Preview command watch note with the second-trigger pattern before writing the section; if current documentation makes the second trigger unnecessary, write the section on the documented setting and record the change under Discussion.
- [x] Add a new section 6, "Branch previews behind Access", to `references/standards-cloudflare-hosting.md` carrying the six points under Proposed section content, renumber the guide and boundaries sections to 7 and 8, and update the contents list and every in-skill anchor that cites them.
- [x] State in the new section that turning on `preview_urls` makes the house `upload` script and its `ki:site:upload` alias required, and amend section 4's optional wording to match.
- [x] Add the preview rows to the guide contract in the renumbered section 7: the non-production trigger's branch filters, build and deploy commands, the preview Access application and its policy, and the `previews_enabled` flag.
- [x] Teach the rubric context to read `preview_urls` from the site `wrangler.jsonc`, with context tests.
- [x] Extend WCF-25 so the upload script and alias are required, not optional, when `preview_urls` is true, with fixture tests for both branches.
- [x] Add WCF-27, "preview Access pairing", `[M-heuristic + J]`: when `preview_urls` is true, the Cloudflare guide must declare a preview Access application covering `*-<name>.<account-subdomain>.workers.dev`; judgment confirms it matches the live dashboard. Register it in the item index with its tests.
- [x] Update WCF-26's review prompt to include the preview rows, and move rubric source anchors to the renumbered sections.
- [x] Add a "Branch previews behind Access" exemplar to `references/exemplars.md`, adapted from the Phase 3 guide with account identifiers, hostnames and policy members replaced by placeholders.
- [x] Regenerate `references/rubric.md` with `ki dev skill rubric ki-repo-website-cloudflare`.
- [x] Run the checks under Verify.

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

## Review

### Delivered

The boundary above, from baseline `a0b0296698f2bbaba49652596d9b5be5e9cbcd93`, in the delivery commit that precedes this record's review commit. Excluded as stated: the `cloudflare` and `wrangler` skills, companion Workers, every hosted repository, including `5g-emerge-phase3`, which was read only, and Workers Builds build variables, now named as out of scope in section 8. No Cloudflare API call, dashboard change or token was used; Cloudflare documentation was read through web fetches only.

### Change Summary

- `references/standards-cloudflare-hosting.md`: new section 6 with the six approved points, the documented dashboard name for the preview trigger, and a closing paragraph separating Version URLs from Worker Previews; section 4 makes `upload` required when `preview_urls` is true and names the `ki:site:upload` alias; section 5 points other-branch builds at section 6; section 7 gains the preview rows (trigger branch filters, build and Preview commands, preview Access application and policy, `previews_enabled`, restore path); section 8 names build variables and general Access mechanics as out of scope.
- `scripts/rubric/contexts/website-cloudflare.ts`: reads `name` and `preview_urls` from the site Wrangler config.
- `scripts/rubric/items/wcf.ts`: WCF-25 fails when `preview_urls` is true without the upload script or alias; new WCF-27 `[M-heuristic + J]` looks for an Access application covering `*-<name>.<…>.workers.dev` in the guide; WCF-26's prompt covers the preview rows; source anchors moved to sections 7 and 8.
- `scripts/rubric/items/index.test.ts`, `scripts/rubric/contexts/website-cloudflare.test.ts`: WCF-27 registered in order; one fixture test covers `preview_urls` absent, false and true across WCF-25 and WCF-27.
- `references/exemplars.md`: "Branch previews behind Access — the guide rows", adapted from the Phase 3 guide with placeholders.
- `references/sources.md`: BUILDS, DEV and WRANGLER rechecked; BRANCHES, BUILDS-API, VERSIONS, PREVIEWS and ACCESS added; the Preview command watch note reconciled.
- `references/rubric.md`: regenerated. `references/mode-educate.md`: its anchor moved to section 7. `SKILL.md`: the standard's load line names branch previews.
- Approved-scope deviation: `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts` holds fleet criterion counts, which rise by exactly the one new hybrid diagnostic item; `bun run test` requires the update.

### Verification

- `bun run test`: 1216 pass, 0 fail, on the result rebased onto `c6b6dd4b1`.
- `bunx tsc --noEmit`: clean.
- `ki dev skill rubric ki-repo-website-cloudflare`: publication exact after regeneration; it lists WCF-27.
- `ki repo audit --skill ki-skills --repo .`: pass with three LONG-3 refresh-cadence warnings on untouched skills; no finding for `ki-repo-website-cloudflare`.
- `ki repo audit --skill ki-work-roadmap --repo .`: pass.
- Biome and `rumdl` on the touched files: clean.
- Assertion: no in-skill link targets `#6-the-cloudflare-guide` or `#7-boundaries`.
- Assertion: no account identifier, token, email address or real policy member appears in the new section or exemplar.

### Outstanding concerns

- The Builds API reference documents no trigger `DELETE` call; the restore path's trigger deletion rests on the live Phase 3 run, as `sources.md` records.
- Cloudflare's Worker Previews (`wrangler preview`) now default for new Workers and switch one-way for existing ones. The section stays on Version URLs and tells operators not to switch; whether the house adopts Worker Previews is a separate decision.
- WCF-27 is heuristic: it finds the hostname pattern and the word Access in the guide, and the dashboard match stays a judgment.

### Post-change review

The Goal is met: the standard now carries the branch-previews pattern with its restore path, the rubric checks the two cheap mechanical halves the planning answers approved, and the worked exemplar matches the live Phase 3 guide without its identifiers. Scope held apart from the one count update the shared test requires. Regression risk is low: the new checks are not applicable unless `preview_urls` is true, so existing sites see no new finding. Ready for acceptance.

### Mini recap

Branch previews behind Access land in `ki-repo-website-cloudflare` as section 6, WCF-25's preview clause and WCF-27, with tests, type check and audits green. Learning routes, not promoted: a record to assess Worker Previews for the house standard, and a source check for a documented trigger `DELETE` at the next monthly REFRESH.

## Discussion

Captured from the Phase 3 run's refined skill-learning draft. Kris adopted this record under `ki-next` and approved its plan and section content under `ki-plan`.

### Adoption

Kris Brown approved adoption on 18 October 2026 in the 5G Emerge Phase 3 coordination thread, answering ADOPT-208 with option a): "adopt KI-HARNESS-GOV-208 as draft, horizon next, kind deliver, purpose learning, and launch a ki-agentic-harness run to plan it to Ready under ki-plan". Kris approved the section's content and the plan at the Ready decision, recorded under Approval.

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

Proposed by the planning run on 18 October 2026 and approved by Kris with the plan:

- **Rubric pairing.** Check it. A preview URL without Access is a public copy of unreleased work, and the mechanical half is cheap: WCF-27 reads `preview_urls` and looks for a preview Access application in the guide, while judgment confirms the dashboard matches, as WCF-26 already does for the other dashboard rows.
- **Restore-path home.** Keep the capture in this skill's section. It is the only consumer today, and Access for preview hostnames does not cut an operator's connection, so it falls outside the `ki-engineering` connection-critical rule rather than under it. Extract a shared Cloudflare restore procedure only when a second Cloudflare change needs one.
- **Upload script.** Make it required when `preview_urls` is true. The non-production trigger's deploy command is `ki:site:upload`, so a site with previews on and no upload script has failing preview builds.

### Delivery reconciliation

The delivery run's source refresh on 18 October 2026 found that the second trigger and the Workers Builds Preview command are one setting: the [Builds API reference](https://developers.cloudflare.com/workers/ci-cd/builds/api-reference/) allows each Worker a production and a preview trigger, and [Build branches](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/) shows the preview trigger as Enable Preview Builds with its Preview command. The section therefore keeps the second-trigger pattern and names its dashboard form. The same refresh found [Worker Previews](https://developers.cloudflare.com/workers/previews/), a separate `wrangler preview` model announced on 22 September 2026, now the default for new Workers; the section stays on Version URLs, as the [Version URLs](https://developers.cloudflare.com/workers/configuration/previews/) page documents, and records Worker Previews as not adopted. [Cloudflare Access for Workers](https://developers.cloudflare.com/workers/configuration/cloudflare-access/) and [Access application paths](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/) confirm hostname-application precedence and the partial-wildcard form; the [workers.dev](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/) page confirms that turning it off leaves Version URLs on.

### Approval

Kris Brown approved the plan on 18 October 2026 in the 5G Emerge Phase 3 coordination thread, answering READY-208 with option a), "Approve as Ready": "approve the KI-HARNESS-GOV-208 plan and its three planning answers as recorded; a ki-agentic-harness run sets it to Ready under ki-plan". The three planning answers above are settled as written. Delivery follows under `ki-implement`; acceptance remains Kris's under `ki-accept`.
