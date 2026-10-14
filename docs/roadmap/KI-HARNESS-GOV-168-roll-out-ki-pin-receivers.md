---
id: KI-HARNESS-GOV-168
area: GOV
title: Roll out pin receivers
kind: deliver
purpose: adoption
project: baseline-rollout
component: governance
status: cancelled
resolution: rejected
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-09T08:45:00Z
updated_at: 2026-10-14T13:44:24Z
---

# KI-HARNESS-GOV-168: Roll out pin receivers

## Goal

Every `knowledgeislands` repository that installs a released `ki` in CI keeps its pin in `.github/ki-version`, runs the auto-merging `update-ki-pin.yml` receiver, and is registered as a tap-dispatch consumer, so each `ki` release reaches it within minutes without a hand bump.

## Context

KI-HARNESS-GOV-161 amended XDR-KI-HARNESS-001 so that a released `ki` pin bump may auto-merge in the `knowledgeislands` organisation behind pin-only, required-check and signed-checksum guards, and updated the `ki-engineering` receiver contract and exemplar. Kris approved installing `ki-tools-release-bot` across the organisation (state-of-play owner decision 7, 2026-10-09). Only this harness has adopted the receiver; the repositories below still pin `KI_VERSION` inline in a workflow, which the receiver cannot edit because the App has no Workflows permission.

Inline pins found on 2026-10-09, all at `v0.8.4`:

- `apps-observatory`
- `homebrew-tap`
- `ki-principal`
- `ki-specifications`
- `ki-techne-harness`
- `ki-website`
- `mcp-acquire-whatsapp`
- `mcp-git-audit`
- `mcp-gsuite`
- `mcp-housekeeping-chatgpt`
- `mcp-housekeeping-claude`
- `mcp-ki-kb-fs`
- `mcp-ki-kb-notion-mirror`
- `mcp-m365`
- `tools-git-almanac`
- `tools-ki`
- `tools-mgit`
- `tools-rig`
- `tools-techne`

## Boundary

- **In:** per repository, moving the inline pin to `.github/ki-version`, adding the receiver copied from the `ki-engineering` exemplar, and, once the repository's App installation and credentials exist, a `ki-trades` work trade asking `homebrew-tap` to add it to the tap's dispatch registry `.github/tool-release-consumers.json` and replay a `ki` release to it. Each repository owns and commits its own conversion, through `ki-trades` where the work crosses repositories.
- **Out:** `hnr-agentic-harness` (`humansnotrobots`) and `infoschematics`, which are outside the `knowledgeislands` organisation and keep reviewed pin changes; App installation, credentials, rulesets and repository settings, reserved for the organisation owner.

## Cancelled

Cancelled 2026-10-14 as rejected (parked): Kris Brown approved it on 14 October 2026 in the state-of-play thread's roadmap census ('RC-ALL: approve all; ways-of-working applies the harness part'). The record sat at Future since Kris's 2026-10-12 approval ('ROADMAP-BATCHES 3 to 5 approved as recommended') because only this harness and Knowledge Islands Principal carry the receiver today and the current rollout does not need the rest. Its Goal, the repository list, the owner-setup order, the `tools-ki` question and Kris's 2026-10-09 approvals (installing `ki-tools-release-bot` across the organisation, and 'BREW-013 into KI-HARNESS-GOV-168') are kept as an idea in the baseline-rollout Project (`ki-principal`, `Streams/Projects/baseline-rollout.md`); Git history keeps the full record. It leaves no outstanding change.

## Discussion

Deferred to Future on 2026-10-12 by Kris Brown's approval of the roadmap minimisation batch 4 (Kris's 2026-10-12 approval in the state-of-play run, 'ROADMAP-BATCHES 3 to 5 approved as recommended'): only ki-agentic-harness and ki-principal carry `.github/ki-version` and `update-ki-pin.yml` today, and the current rollout does not need the rest. Re-scope before it becomes actionable.

- `tools-ki` installs its own `ki` in CI; check whether a receiver there should track its own releases or whether its CI should build from source instead.
- `homebrew-tap` registration of a repository before its App installation fails the tap's token mint for every consumer, as the tap's release App operations guide explains, so registration follows provisioning.
- The receiver accepts the tap's existing `tool-release-published` event unchanged and treats it only as a trigger, so the registry and its payload need no change; the receiver contract comes from KI-HARNESS-GOV-141.
- Merged on 2026-10-09 with Kris's approval in the state-of-play run ('BREW-013 into KI-HARNESS-GOV-168'): this record absorbed the `homebrew-tap` work to register the `ki` pin receivers, which `homebrew-tap` cancelled as merged into it. The tap registration it covered is now the registration step above.
- Plan through `ki-plan`, batching repositories whose owner setup is complete.

### Adoption

Kris adopted this record on 2026-10-09 to start after the release-bot setup (BOT-1 to BOT-4), for planning only. The plan above awaits Kris's Ready approval; nothing is implemented yet.
