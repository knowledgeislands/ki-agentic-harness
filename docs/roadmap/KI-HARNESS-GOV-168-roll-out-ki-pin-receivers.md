---
id: KI-HARNESS-GOV-168
area: GOV
title: Roll out pin receivers
kind: deliver
purpose: adoption
project: baseline-rollout
component: governance
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-09T08:45:00Z
updated_at: 2026-10-09T21:18:31Z
---

# KI-HARNESS-GOV-168: Roll out pin receivers

## Goal

Every `knowledgeislands` repository that installs a released `ki` in CI keeps its pin in `.github/ki-version`, runs the auto-merging `update-ki-pin.yml` receiver, and is registered as a tap-dispatch consumer, so each `ki` release reaches it within minutes without a hand bump.

## Context

KI-HARNESS-GOV-161 amended XDR-KI-HARNESS-001 so that a released `ki` pin bump may auto-merge in the `knowledgeislands` organisation behind pin-only, required-check and signed-checksum guards, and updated the `ki-engineering` receiver contract and exemplar. Kris approved installing `ki-tools-release-bot` across the organisation (GOV-020 owner decision 7, 2026-10-09). Only this harness has adopted the receiver; the repositories below still pin `KI_VERSION` inline in a workflow, which the receiver cannot edit because the App has no Workflows permission.

Inline pins found on 2026-10-09, all at `v0.8.4`:

- `apps-observatory`
- `homebrew-tap`
- `ki-arcadia-principal`
- `ki-specifications`
- `ki-techne-harness`
- `ki-website`
- `mcp-acquire-whatsapp`
- `mcp-git-audit`
- `mcp-gsuite`
- `mcp-housekeeping-chatgpt`
- `mcp-housekeeping-claude`
- `mcp-housekeeping-codex`
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

## Current state

Verified locally on 2026-10-09:

- `ki-agentic-harness` already reads `.github/ki-version` (`v0.10.0`) and carries `update-ki-pin.yml`. The release bot is now installed on it with its App ID variable and private-key secret set, and its `main` ruleset exists (verified 2026-10-09). It is the reference receiver.
- The 20 repositories listed above still pin `KI_VERSION: v0.8.4` inline in their CI workflow, with no `.github/ki-version` and no receiver.
- `ki-engineering`'s CI criterion warns when a workflow does not read `.github/ki-version` or lacks the receiver; its exemplar carries the receiver to copy.
- The release bot is installed only on `homebrew-tap`, `ki-website` and `ki-agentic-harness`. Every further repository needs the same `main` ruleset in place before the bot is installed there, as [Arcadia's Release Cascade](/Users/krisbrown/workspaces/kit/knowledgeislands/ki-arcadia-principal/Admin/Operations/Processes/Release%20Cascade.md) sets out. Rulesets, App installation, credentials and the auto-merge setting are Kris's to change.

## Steps

- [ ] Re-ground the repository list and each repository's pin, receiver and owner-setup state (ruleset, App installation, credentials, auto-merge); split it into repositories whose owner setup is complete and those still waiting.
- [ ] Decide with Kris how `tools-ki` should be handled: a receiver tracking its own releases, or CI building from source; record the answer under Discussion.
- [ ] For each repository, prepare one outbound `ki-trades` work trade asking it to move its inline pin to `.github/ki-version` at the current release and add `update-ki-pin.yml` copied from the `ki-engineering` exemplar. Send first to repositories whose owner setup is complete; the others wait, since a receiver cannot open pull requests until the bot is installed.
- [ ] Ask Kris to complete each waiting repository's owner setup in order: `main` ruleset first, then App installation, App ID variable, private-key secret and auto-merge setting.
- [ ] Once a repository is provisioned and converted, send `homebrew-tap` a work trade to add it to `.github/tool-release-consumers.json` and replay a `ki` release to it, never before provisioning. `ki-agentic-harness` is provisioned already and can be the first entry.
- [ ] Track each trade's receipt and outcome in Discussion, run Verify, assemble the review packet and set this record `awaiting-review`.

## Files touched

- This record.
- Outbound trade records under this repository's `ki-trades` root, one per receiving repository plus the `homebrew-tap` registration trades.
- No file in another repository: each receiver commits its own conversion.

## Verify

- Every in-scope repository's CI reads `.github/ki-version` and carries `update-ki-pin.yml`, confirmed by its own `ki repo audit --skill ki-engineering` with no pin-receiver warning.
- Each converted repository has received at least one bot-opened pin-bump pull request that auto-merged after its required check, or the record names why one has not yet fired.
- `homebrew-tap` lists every converted repository as a dispatch consumer in `.github/tool-release-consumers.json`, its release-event tests pass, and a replayed `ki` release reaches each newly registered receiver, which exits without a pull request when its pin is current.
- `ki repo audit --skill ki-trades` passes here.

## Dependencies / blocks

Follows KI-HARNESS-GOV-161, which decided automatic pin moves, and the release-bot setup BOT-1 to BOT-4. Each repository depends on Kris completing its owner setup in the order above. Tap registration is a `homebrew-tap` registry change made through a trade.

## Delegation

Each receiving repository converts itself in its own session or detached run, through its trade; this record coordinates and verifies only.

## Documentation impact

### Decision Records

None: XDR-KI-HARNESS-001 already carries the auto-merge exception.

### Specifications

None.

### Guides

Update Arcadia's Release Cascade rows for pin bumps and bot installation as repositories convert, through a trade to `ki-arcadia-principal`.

### Roadmap

None beyond this record; a `tools-ki` source-build choice may become its own record.

## Discussion

- `tools-ki` installs its own `ki` in CI; check whether a receiver there should track its own releases or whether its CI should build from source instead.
- `homebrew-tap` registration of a repository before its App installation fails the tap's token mint for every consumer, as the tap's release App operations guide explains, so registration follows provisioning.
- The receiver accepts the tap's existing `tool-release-published` event unchanged and treats it only as a trigger, so the registry and its payload need no change; the receiver contract comes from KI-HARNESS-GOV-141.
- Merged on 2026-10-09 with Kris's approval (state-of-play decisions log, Decision 21): this record absorbed `homebrew-tap` BREW-013 (Register ki pin receivers), which is cancelled as merged into it. The tap registration it covered is now the registration step above.
- Plan through `ki-plan`, batching repositories whose owner setup is complete.

### Adoption

Kris adopted this record on 2026-10-09 to start after the release-bot setup (BOT-1 to BOT-4), for planning only. The plan above awaits Kris's Ready approval; nothing is implemented yet.
