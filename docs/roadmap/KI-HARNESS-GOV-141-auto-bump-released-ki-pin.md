---
id: KI-HARNESS-GOV-141
area: GOV
title: Auto-bump released ki pin
kind: deliver
project: estate-factorisation
component: governance
horizon: now
status: in-progress
blocks: [KI-HARNESS-GOV-161]
blocked_by: []
baseline_ref: 9c930be71faa94f8bc55f3d67d3b9b3d2a63bdb3
created_at: 2026-10-06T01:21:00Z
updated_at: 2026-10-08T09:00:00Z
---

# KI-HARNESS-GOV-141: Auto-bump released ki pin

## Goal

When `tools-ki` publishes an immutable release, every repository whose CI pins the released `ki` by `KI_VERSION` receives a reviewable pin bump automatically, instead of each pin drifting until someone edits it by hand.

## Context

The `ki-engineering` CI-1 standard requires CI to install exactly one immutable, verified `ki` release rather than a source checkout. On 2026-10-06, 21 repositories outside `homebrew-tap` pinned `KI_VERSION: v0.6.1` in their workflows, and each pin moves only by a manual edit.

The release chain already exists up to the tap. A `tools-ki` release dispatches to `homebrew-tap`, whose formula PR auto-merges and whose `notify-consumers` job then sends `tool-release-published` to every repository listed in `.github/tool-release-consumers.json`. That registry lists only `knowledgeislands/ki-website`, whose `update-tool-release.yml` is the one working receiver, and it updates website content rather than a CI pin.

Raised by the 2026-10-06 estate roadmap consolidation (finding "released ki pin drift", action C12).

`homebrew-tap` BREW-011 (Register ki pin consumers) is folded into this item. Its scope is the tap side of the same outcome: adding each receiver-ready repository to `.github/tool-release-consumers.json`, any registry or event-payload change the receiver contract needs, and confirming the release-bot App installation covers each registered consumer. The tap still owns that registry, the dispatch and its credentials, and the App and credential steps remain Kris-only under BREW-005, so the tap-side changes are delivered in `homebrew-tap` when this item is planned.

## Boundary

In scope: the harness-owned receiver contract - the event a consumer accepts, the pin it rewrites, and how the bump PR proves itself through the ordinary gates - expressed in the `ki-engineering` CI workflow standard and exemplars, with a CI-1 warning so `ki repo conform` can find unadopted repositories; the harness's own adoption as the reference receiver; and the `ki-repo-tools` release-readiness sentence on tool-repository credentials, routed here from `homebrew-tap` BREW-012.

Out of scope: auto-merge of the bump PR, which would amend XDR-KI-HARNESS-001 and moves to KI-HARNESS-GOV-161; registering consumers in the tap, which `homebrew-tap` owns; per-repository adoption beyond the harness, which follows through CONFORM or trades rather than one record per repository; and any change to the 14-day freshness window.

## Current state

Planned and started on 2026-10-08; the open questions are settled in Discussion. The receiver is per repository, the pin moves out of the workflow into `.github/ki-version`, and the bump PR is reviewed by a person. The tap-side registry and payload need no change: the tap's existing event already carries `tool` and `source_repository`, and the receiver re-reads the latest immutable `tools-ki` release rather than trusting the payload.

## Steps

- [ ] State the released-pin contract in `standards-engineering.md` under the CI workflow standard: the `.github/ki-version` pin, the `update-ki-pin.yml` receiver, its triggers, verification and PR boundary.
- [ ] Add the receiver workflow and the pin-reading install step to `exemplars.md`.
- [ ] Add CI-1 evidence: warn when `ci.yml` pins `KI_VERSION` inline, when the pin file is malformed, or when the pin file has no receiver; pass when both are present. Cover it with focused tests and regenerate the rubric.
- [ ] Adopt in the harness: `.github/ki-version`, `ci.yml` reading it, and an inert-until-provisioned `update-ki-pin.yml`.
- [ ] Correct the `ki-repo-tools` release-readiness sentence: tool repositories hold the App credentials only to mint a tap-scoped token for their dispatch.
- [ ] Capture KI-HARNESS-GOV-161 for the auto-merge decision and a `homebrew-tap` triage record for registering receiver-ready repositories.

## Files touched

`skills/governance/ki-engineering/references/standards-engineering.md`, `exemplars.md`, `rubric.md` (generated), `scripts/rubric/contexts/audit-evidence.ts` and `scripts/rubric/items/ci.ts` with their tests; `skills/repo-structure/ki-repo-tools/references/standards-release-readiness.md`; `.github/ki-version`, `.github/workflows/ci.yml` and `.github/workflows/update-ki-pin.yml`; and the new KI-HARNESS-GOV-161 record.

## Verify

1. `bun run test` passes and the new CI-1 evidence has full coverage.
2. `ki repo audit --repo .` passes in the harness, with no CI-1 warning for the harness itself.
3. The `ki-engineering` and `ki-work-roadmap` focused audits pass.
4. `update-ki-pin.yml` parses as YAML and its job is skipped until `KI_TOOLS_RELEASE_BOT_APP_ID` is set.

## Dependencies / blocks

No local blocker. `homebrew-tap` BREW-011 was closed as merged into this item. KI-HARNESS-GOV-161 is blocked by this item: auto-merge can only be decided for a receiver that exists. Live operation in any repository waits on the organisation owner installing the release App there and provisioning its credentials, under BREW-005.

## Documentation impact

### Decision Records

None. The design follows existing decisions: each consumer owns its response to a tap event, and XDR-KI-HARNESS-001 keeps a person reviewing dependency changes. Changing the latter for this pin is KI-HARNESS-GOV-161's decision.

### Specifications

None; the receiver contract lives in the `ki-engineering` standard.

### Guides

None here. The tap's release App operations guide covers onboarding a consumer.

### Roadmap

KI-HARNESS-GOV-161 captures the auto-merge decision; a `homebrew-tap` triage record captures registration of receiver-ready repositories.

## Discussion

### Cross-repository relationship

This item blocks `homebrew-tap` BREW-011 (Register ki pin consumers): the tap should not register repositories as consumers until a receiver contract exists for them to implement. BREW-011 records the reciprocal `blocked by KI-HARNESS-GOV-141`. Neither item blocks any other local record.

### Adoption

Kris approved adoption from Triage into Next on 2026-10-06, as a disposition of the state-of-play review (`ki-arcadia-principal`, `+/_CHECKPOINTS/state-of-play.md`). In the same review Kris approved merging BREW-011 into this item; because a terminal `merged` disposition must name a target in the same roadmap, BREW-011 stays open in the tap's Triage and records the fold instead.

### Open questions

Settled on 2026-10-08 in planning:

- **Per-repository receiver.** Each repository carries its own `update-ki-pin.yml`. It keeps the established rule that each consumer owns its response to a tap event, and the App's existing Contents and Pull requests permissions suffice. A central fan-out would make the tap write into other repositories, which the tap's boundary does not allow.
- **Executable pin only.** A `ki` release embeds the canonical harness revision, so bumping the executable pin refreshes the verified skill collection too.

### Decision

The pin moves from an inline `KI_VERSION` in `ci.yml` to `.github/ki-version`, because a token that edits `.github/workflows/` needs the App's Workflows permission, which would let the App rewrite CI in every installed repository. The receiver treats the event only as a trigger and re-reads the latest immutable `tools-ki` release itself, with a daily schedule as backstop, so it works before the tap registers the repository. The bump PR is reviewed and merged by a person under XDR-KI-HARNESS-001. Decided by the delivering agent under delegated autonomy; reversible.
