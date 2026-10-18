---
id: KI-HARNESS-GOV-201
area: GOV
title: Fetch and machine grants
project: ways-of-working
component: governance
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-16T21:51:55Z
updated_at: 2026-10-18T09:59:16Z
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

## Discussion

Captured on Kris Brown's FOOTER-GRANTS answer; adoption, priority and plan belong to this repository. Questions for planning: whether `machine` needs the connection-critical restore-path rule restated in its grant or only cited; whether a grant names the scope the brief must state, such as the remote for a fetch; and whether the two grants also suit the `push` tier, where a fetch is already allowed.

Kris Brown answered CLI134-GRANTS on 18 October 2026 in the ways-of-working work, taking option a): a harness run drafts `grant-fetch.md` and `grant-machine.md` under this record for Kris's review, and nothing is adopted until the wording is approved. The drafts sit in `skills/governance/ki-delegation/assets/`, each marked unapproved inside its own section; the standard's tier table, the sources note and the rubric do not yet name them. The drafts take positions on the planning questions for review: `machine` cites the connection-critical rule rather than restating it, a grant names the scope the brief must state, and `fetch` adds nothing under the `push` tier while `machine` suits every tier.
