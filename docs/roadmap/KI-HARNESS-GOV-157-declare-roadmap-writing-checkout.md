---
id: KI-HARNESS-GOV-157
area: GOV
title: Declare roadmap writing checkout
status: cancelled
resolution: merged
resolution_target: KI-TOOL-CLI-115
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-08T07:24:10Z
updated_at: 2026-10-09T21:01:43Z
---

# KI-HARNESS-GOV-157: Declare Roadmap Writing Checkout

## Goal

Decide where a repository's designated roadmap writing checkout is declared, and whether to design a remote-history serialisation in which the remote's `main` is the single roadmap history.

## Context

Handoff from Arcadia: [ODR-KI-ARCADIA-001](https://github.com/knowledgeislands/ki-arcadia-principal/blob/a94b76c/Admin/Governance/Decisions/ODR-KI-ARCADIA-001-keeping-work-safe-on-the-agent-host.md), "Keeping work safe on the agent host", designates the Mac checkout as the roadmap writing checkout for every Knowledge Islands repository and records that `ki-agentic-harness` decides where a writing-checkout designation lives. It blocks nothing: the Mac designation stands in the Decision Record meanwhile.

`ki-work-roadmap`'s roadmap write locus requires exactly one designated writing checkout per repository and leaves naming it to a coordination plane's own standard; nothing yet says where a person's or an estate's designation is declared. The [durability report](https://github.com/knowledgeislands/ki-arcadia-principal/blob/a94b76c/Streams/Projects/agent-host/design/agent-host-durability-report.md) records both reviewers' view that a remote-`main` design needs its own approval and a change to GDR-KI-ARCADIA-004, because a standing push breaks the exemption's bound that pushes happen only when asked, and that ledger-only commits can still be dropped on rebase.

## Boundary

- **In:** where a designation is declared (estate-wide, per repository in `.ki.toml`, or per machine), how `ki` and skills read it, and a recommendation on whether a remote-history serialisation design is worth opening.
- **Out:** the host-marker refusal in `tools-ki` (KI-TOOL-CLI-115); the two-checkout rule in personal instructions (chezmoi DOTFILES-UE-072); any change to GDR-KI-ARCADIA-004, which only Arcadia's Enactment Process can make.

## Cancelled

Cancelled 2026-10-09 as merged, approved by Kris Brown (state-of-play decisions log, Decision 21). `tools-ki` owns the enforcing behaviour, so its record absorbs this one: KI-TOOL-CLI-115 in `tools-ki` at `docs/roadmap/KI-TOOL-CLI-115-enforce-roadmap-writing-checkout.md` now also decides where a designated writing checkout is declared and whether a remote-history serialisation design is worth opening. Any `ki-work-roadmap` standard text that decision needs returns here through a `ki-trades` work trade.

## Discussion

- An estate-wide default with per-repository override would cover the Mac designation in one line; is per-repository declaration ever needed?
- Is a per-machine marker (as on the agent host) a designation, or only an exclusion?
