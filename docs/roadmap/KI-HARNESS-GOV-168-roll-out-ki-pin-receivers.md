---
id: KI-HARNESS-GOV-168
area: GOV
title: Roll out ki pin receivers
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-09T08:45:00Z
updated_at: 2026-10-09T08:45:00Z
---

# KI-HARNESS-GOV-168: Roll Out ki Pin Receivers

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

- **In:** per repository, moving the inline pin to `.github/ki-version`, adding the receiver copied from the `ki-engineering` exemplar, and handing tap registration to BREW-013 in `homebrew-tap` once the repository's App installation and credentials exist. Each repository owns and commits its own conversion, through `ki-trades` where the work crosses repositories.
- **Out:** `hnr-agentic-harness` (`humansnotrobots`) and `infoschematics`, which are outside the `knowledgeislands` organisation and keep reviewed pin changes; App installation, credentials, rulesets and repository settings, reserved for the organisation owner.

## Discussion

- `tools-ki` installs its own `ki` in CI; check whether a receiver there should track its own releases or whether its CI should build from source instead.
- `homebrew-tap` registration of a repository before its App installation fails the tap's token mint for every consumer, so registration follows provisioning.
- Plan through `ki-plan`, batching repositories whose owner setup is complete.
