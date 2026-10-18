---
id: KI-HARNESS-GOV-201
area: GOV
title: Fetch and machine grants
kind: deliver
purpose: governance
project: ways-of-working
component: governance
status: done
blocks: []
blocked_by: []
baseline_ref: cbe77385540ff630edc7e5495022b2e6c55c8f5c
created_at: 2026-10-16T21:51:55Z
updated_at: 2026-10-18T17:05:00Z
---

# KI-HARNESS-GOV-201: Fetch and Machine Grants

## Goal

The `ki-delegation` background-run standard and its assets define two grant texts, `--allow fetch` and `--allow machine`, each a harness-owned section the launcher appends beside the authority-tier footer and each lifting only its matching ban, so that a brief can authorise a fetch without a push, or an approved machine change, without moving to a wider tier or relying on free text.

## Context

The [Authority tiers](../../skills/governance/ki-delegation/references/standards-background-runs.md#authority-tiers) table offers `none`, `push`, `prune` and `release`, one asset each in `skills/governance/ki-delegation/assets/`. The `none` footer bans every remote call and every environment, scheduler or credential change, so a brief that needs only a `git fetch`, or one approved machine change, contradicts its own footer.

[KI-TOOL-KI-CLI-134](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-134-launch-footer-follows-brief.md) in `tools-ki` makes the launch footer follow the brief and adds the `--allow <grant>` option beside `--rules <tier>`; it consumes the grant assets and stays draft until they are agreed. Kris Brown answered FOOTER-GRANTS on 16 October 2026 at 21:40 BST, taking option a) in the tools-burndown thread: "the harness owner opens a ki-delegation record for the two grant texts", the two being `--allow fetch` and `--allow machine`, each a harness-owned section that lifts only the matching ban.

## Boundary

- In: `grant-fetch.md` and `grant-machine.md` in `skills/governance/ki-delegation/assets/`, each lifting only its matching ban of the tier footer; the standard's tier table or a grants table beside it naming both; the skill's sources note; any rubric or test that lists the assets.
- Out: the launcher option, its parsing and the order in which sections are appended, which KI-TOOL-KI-CLI-134 owns; changing what any existing tier grants; inferring authority from a brief's free text.

## Current state

Both grant texts are adopted as drafted, with their unapproved markers removed. The background-run standard's Authority tiers section names them in a Grants subsection, Prompt shape lets grant sections follow the tier footer, and RUN-1 checks each shipped grant. The launcher option is not built here. Reviewed and accepted; see Review and Done.

## Steps

- [x] Adopt the record and record the immutable baseline under GRANT-WORDING.
- [x] Remove the "Draft, not approved" lines from `grant-fetch.md` and `grant-machine.md`, leaving each grant section's wording as approved.
- [x] Name both grants in the background-run standard beside the tier table, in Prompt shape and in the Contents.
- [x] Extend RUN-1 and its tests to check that each grant exists, is approved, lifts only its own ban, keeps its limits and carries no tier grant; regenerate the rubric catalogue.
- [x] Record the review in the sources note and the rubric mention in `SKILL.md`.
- [x] Write the handoff into KI-TOOL-KI-CLI-134 in `tools-ki`.

## Files touched

- `skills/governance/ki-delegation/assets/grant-fetch.md`, `grant-machine.md`
- `skills/governance/ki-delegation/references/standards-background-runs.md`, `sources.md`, `rubric.md`
- `skills/governance/ki-delegation/SKILL.md`
- `skills/governance/ki-delegation/scripts/rubric/contexts/footers.ts`, `footers.test.ts`
- `skills/governance/ki-delegation/scripts/rubric/items/background-runs.ts`
- this record

## Verify

`bun run test`, `bunx --no-install tsc --noEmit`, `ki dev skill rubric ki-delegation` in sync, and `ki repo audit` for `ki-delegation`, `ki-skills`, `ki-authoring` and `ki-work-roadmap`, each with no new failure.

## Dependencies / blocks

No build dependency. `tools-ki` consumes the two assets to offer `ki agent launch --allow <grant>`; that work is its own and does not block this record.

## Documentation impact

### Decision Records

None; the standard carries the owner's approval in the owner's own words.

### Specifications

None.

### Guides

None in this repository; the launcher's guide changes with the `--allow` option in `tools-ki`.

### Roadmap

This record only.

## Review

### Delivered

`grant-fetch.md` and `grant-machine.md` are in force as approved, each a `## Grant: <name>` section that lifts exactly one ban of the tier footer. The background-run standard lists them under Authority tiers in a Grants subsection, with the interim rule that a brief appends a grant section by hand until the launcher offers `--allow`. RUN-1 checks them mechanically.

### Change Summary

Against baseline `cbe77385`: the two draft markers are removed and each intro line now states what the launcher appends; the standard gains the Grants subsection, a Contents entry and the grant clause in Prompt shape and Authority tiers; RUN-1's title, description and remediation name grants; `footers.ts` adds a grant check beside the tier check; the tests cover the shipped grants and every grant violation; the rubric catalogue is regenerated; the sources note records the review.

### Verification

`bun run test` and `bunx --no-install tsc --noEmit` passed; `ki dev skill rubric ki-delegation` reports the catalogue in sync; Biome and rumdl pass on the touched paths; `ki repo audit` for `ki-delegation`, `ki-skills`, `ki-authoring` and `ki-work-roadmap` passed with no failure or warning. All checks are local; no launcher behaviour is exercised, so no live proof is claimed.

### Outstanding concerns

The interim rule that a brief appends a grant section by hand is this run's addition, so that the approved texts are usable before KI-TOOL-KI-CLI-134 ships; the reviewer should confirm or strike it.

### Post-change review

The grant wording is byte-for-byte the approved draft below each `## Grant:` heading. The check rejects a grant that lifts the other grant's ban or carries a tier grant, so neither grant can widen without a failing audit.

### Mini recap

Adopted the two approved grant texts, wired them into the standard and RUN-1, and handed the launcher option to `tools-ki`. No acceptance or pruning.

## Done

Accepted as delivered on 2026-10-18 at 18:05 BST under Kris Brown's answers of 18 October 2026 in the ways-of-working decisions log, entry "2026-10-18 17:59 BST - owner answers, recap batch": REVIEW-GOV-194-201 a), "review GOV-194-2 of 1, yes agreed", taken as one independent review run with acceptance after a clean review, and ACCEPT-AND-PRUNE, "anything which is awaiting acceptance can be accepted, and then we can prune anything which is in a state of done". The outstanding concern is settled by GRANT-INTERIM a), answered in the same entry: the interim sentence that a brief appends a grant section by hand stays until [KI-TOOL-KI-CLI-134](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-134-launch-footer-follows-brief.md) ships `--allow`, which is still in progress and whose handoff says the sentence can then go. Reviewer: the `review-gov194-201` run of the ways-of-working Project work, independent of the `harness-upkeep` run that delivered it, against `main` at `021dddbf`. Commit `ef9d275f` removes only the draft markers and intro lines from both assets, leaving each grant section's approved wording unchanged; the standard's Grants subsection, Contents entry and Prompt shape clause match the record; RUN-1 checks each grant. `bun run test` 1254 pass, 0 fail; `bunx --no-install tsc --noEmit` clean; `ki dev skill rubric ki-delegation` in sync; `ki repo audit` passes with no failure or warning for `ki-delegation`, `ki-skills`, `ki-authoring` and `ki-work-roadmap`. No finding; the six-part Review packet above stands as the closure evidence.

## Discussion

Captured on Kris Brown's FOOTER-GRANTS answer; adoption, priority and plan belong to this repository. Questions for planning: whether `machine` needs the connection-critical restore-path rule restated in its grant or only cited; whether a grant names the scope the brief must state, such as the remote for a fetch; and whether the two grants also suit the `push` tier, where a fetch is already allowed.

Kris Brown answered CLI134-GRANTS on 18 October 2026 in the ways-of-working work, taking option a): a harness run drafts `grant-fetch.md` and `grant-machine.md` under this record for Kris's review, and nothing is adopted until the wording is approved. The drafts sit in `skills/governance/ki-delegation/assets/`, each marked unapproved inside its own section; the standard's tier table, the sources note and the rubric do not yet name them. The drafts take positions on the planning questions for review: `machine` cites the connection-critical rule rather than restating it, a grant names the scope the brief must state, and `fetch` adds nothing under the `push` tier while `machine` suits every tier.

Kris Brown answered GRANT-WORDING on 18 October 2026 in the ways-of-working work, taking option a), "you've got my approval for all those things that were recommended": both grant texts are approved as drafted and a harness run adopts them under this record. That answer adopts the record, agrees its plan and authorises delivery; the `harness-upkeep` run delivered it the same day and returned it as Awaiting review.
