---
id: KI-HARNESS-GOV-141
area: GOV
title: Auto-bump released ki pin
kind: deliver
project: estate-factorisation
component: governance
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-06T01:21:00Z
updated_at: 2026-10-07T14:00:01Z
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

In scope: the harness-owned receiver contract - the event a consumer accepts, the pin it rewrites, and how the bump PR proves itself through the ordinary gates and auto-merge - expressed in `ki-engineering` CI-1 or the CI shape skill, with conformance through `ki repo conform`.

Out of scope: registering consumers in the tap, which `homebrew-tap` owns; per-repository adoption, which follows through CONFORM or trades rather than one record per repository; and any change to the 14-day freshness window.

## Current state

Adopted into Next on 2026-10-06 and not yet planned through `ki-plan`. No receiver contract exists. The only registered consumer is `knowledgeislands/ki-website`, whose receiver updates website content rather than a CI pin. The other repositories that pin `KI_VERSION` still move the pin by hand.

## Steps

- [ ] Plan through `ki-plan`: settle the open questions below, choose where the receiver contract is expressed, and replace these steps with a reviewable plan.

## Files touched

To be settled by planning. Expected: `ki-engineering` CI-1 or the CI shape skill's references and checks in this repository; tap-side registry changes land in `homebrew-tap`, not here.

## Verify

To be settled by planning. At minimum, `ki repo audit --skill ki-work-roadmap` passes and the chosen skill's focused audit passes.

## Dependencies / blocks

No local blocker. This item blocks `homebrew-tap` BREW-011, which is folded into it (see Context and Discussion).

## Documentation impact

### Decision Records

To be settled by planning; a per-repository receiver versus central fan-out choice may warrant one.

### Specifications

To be settled by planning; the receiver contract is expected to live in a skill standard rather than `docs/specs/`.

### Guides

To be settled by planning.

### Roadmap

BREW-011 in `homebrew-tap` closes or is respecified once this item's plan places the tap-side registry work.

## Discussion

### Cross-repository relationship

This item blocks `homebrew-tap` BREW-011 (Register ki pin consumers): the tap should not register repositories as consumers until a receiver contract exists for them to implement. BREW-011 records the reciprocal `blocked by KI-HARNESS-GOV-141`. Neither item blocks any other local record.

### Adoption

Kris approved adoption from Triage into Next on 2026-10-06, as a disposition of the state-of-play review (`ki-arcadia-principal`, `+/_CHECKPOINTS/state-of-play.md`). In the same review Kris approved merging BREW-011 into this item; because a terminal `merged` disposition must name a target in the same roadmap, BREW-011 stays open in the tap's Triage and records the fold instead.

### Open questions

- Per-repository receiver workflow, or central fan-out from one workflow that opens the bump PRs itself? A central fan-out needs a credential with write access to every consumer; a per-repository receiver needs only the existing dispatch.
- Should the bump also refresh the active KI skill collection CI verifies, or only the executable pin?
