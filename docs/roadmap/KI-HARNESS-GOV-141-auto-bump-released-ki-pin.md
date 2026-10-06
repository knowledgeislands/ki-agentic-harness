---
id: KI-HARNESS-GOV-141
area: GOV
title: Auto-bump released ki pin
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-06T01:21:00Z
updated_at: 2026-10-06T01:21:00Z
---

# KI-HARNESS-GOV-141: Auto-bump released ki pin

## Goal

When `tools-ki` publishes an immutable release, every repository whose CI pins the released `ki` by `KI_VERSION` receives a reviewable pin bump automatically, instead of each pin drifting until someone edits it by hand.

## Context

The `ki-engineering` CI-1 standard requires CI to install exactly one immutable, verified `ki` release rather than a source checkout. On 2026-10-06, 21 repositories outside `homebrew-tap` pinned `KI_VERSION: v0.6.1` in their workflows, and each pin moves only by a manual edit.

The release chain already exists up to the tap. A `tools-ki` release dispatches to `homebrew-tap`, whose formula PR auto-merges and whose `notify-consumers` job then sends `tool-release-published` to every repository listed in `.github/tool-release-consumers.json`. That registry lists only `knowledgeislands/ki-website`, whose `update-tool-release.yml` is the one working receiver, and it updates website content rather than a CI pin.

Raised by the 2026-10-06 estate roadmap consolidation (finding "released ki pin drift", action C12).

## Boundary

In scope: the harness-owned receiver contract - the event a consumer accepts, the pin it rewrites, and how the bump PR proves itself through the ordinary gates and auto-merge - expressed in `ki-engineering` CI-1 or the CI shape skill, with conformance through `ki repo conform`.

Out of scope: registering consumers in the tap, which `homebrew-tap` owns; per-repository adoption, which follows through CONFORM or trades rather than one record per repository; and any change to the 14-day freshness window.

## Discussion

### Cross-repository relationship

This item blocks `homebrew-tap` BREW-011 (Register ki pin consumers): the tap should not register repositories as consumers until a receiver contract exists for them to implement. BREW-011 records the reciprocal `blocked by KI-HARNESS-GOV-141`. Neither item blocks any other local record.

### Open questions

- Per-repository receiver workflow, or central fan-out from one workflow that opens the bump PRs itself? A central fan-out needs a credential with write access to every consumer; a per-repository receiver needs only the existing dispatch.
- Should the bump also refresh the active KI skill collection CI verifies, or only the executable pin?
