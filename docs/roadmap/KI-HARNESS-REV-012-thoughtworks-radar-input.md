---
id: KI-HARNESS-REV-012
area: REV
title: Review ThoughtWorks Radar
component: governance
priority: medium
size: m
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-24T11:38:31Z
updated_at: 2026-10-24T11:38:31Z
---

# KI-HARNESS-REV-012: Review ThoughtWorks Radar

## Goal

Each new ThoughtWorks Technology Radar volume, published about twice a year, becomes a reviewed input to the KI tool radar and learning, with relevant changes, disagreements and follow-up proposals retained under their existing owners.

## Context

Kris, 24 October 2026 at 12:25 BST, while confirming that the tool radar is independent of installation and follows ThoughtWorks: "we should be getting a relatively frequent update from that to make sure that we're also using that as an input into the things that we're learning about" and "That probably needs to go into the agentic harness in some way." The source is the [ThoughtWorks Technology Radar](https://www.thoughtworks.com/en-gb/radar); its [FAQ](https://www.thoughtworks.com/en-gb/radar/faq) gives the twice-yearly cadence. A source check of those pages on 24 October 2026, recorded in [PERSONAL-DOTFILES-UE-108](</Users/krisbrown/.local/share/chezmoi/docs/roadmap/PERSONAL-DOTFILES-UE-108-decide-tool-radar.md#discussion>), supplies the current ring meanings and intake rationale; no additional source fetch is required to capture this request.

The finite delivery is a governed recurring-review procedure and successful-run evidence, shaped under [ki-work-recurring](../../skills/change-management/ki-work-recurring/SKILL.md). Capture at triage grants no adoption, implementation, scheduler or runtime authority.

## Boundary

- **In:** identify each new volume once, retain its number, publication date, source URLs and review date, and compare relevant new or moved blips against KI tool assessments and current learning needs.
- **In:** record contextual agreement or disagreement, evidence gaps and learning candidates; route proposed changes through the owning catalogue, radar, knowledge or work process; retain why an input led to no change.
- **In:** define a proportionate check for a new volume, a per-volume deduplication key and successful-run evidence, and decide whether to extend an existing review or create a dedicated recurring template.
- **Out:** automatic copying of ThoughtWorks rings, automatic adoption, machine selection, installation, retirement, public disclosure, public-site changes, or changes to existing model-radar and agentic-radar vocabularies.
- **Out:** scheduling a job, changing runtime configuration or credentials, fetching a volume, or conducting the first review during this intake.

## Dependencies / blocks

No local build-order dependency for capture or planning. The personal tool catalogue belongs to chezmoi and its executable contract to tools-rig; future proposals go to those owners without requiring the pending tool-radar implementation to finish before the review procedure can be designed.

## Discussion

### Operating model and first deliverable

Prefer a review triggered by each new volume, roughly twice yearly, with a lightweight periodic check only to discover it. Use volume identity to avoid reviewing the same publication twice and retain catch-up handling for a missed release. A calendar interval alone must not claim that a new volume exists or that its contents were reviewed.

The first deliverable should define the source and discovery route, relevance filter, comparison procedure, evidence record and owner-review boundary. For each relevant blip, retain the ThoughtWorks assessment, the KI assessment where one exists, meaningful local differences and any proposed investigation or experiment. Preserve uncertainty; a consultancy's cross-client experience is useful evidence but does not by itself determine Kris's context or tool choice. A reviewed volume with no relevant change is a valid evidenced outcome.

### Existing reviews and vocabulary

The [weekly model-radar review](../housekeeping/KI-HARNESS-HK-003-weekly-model-radar-review.md) already checks tracked model sources, including the ThoughtWorks FAQ for ring semantics; the [weekly agentic-radar review](../housekeeping/KI-HARNESS-HK-005-weekly-agentic-radar-review.md) checks agentic patterns. This request adds new-volume content as a broader tool and learning input, rather than duplicating either weekly refresh. Planning should choose the smallest suitable extension or separate template and cross-reference existing evidence instead of copying source ledgers or creating a second catalogue.

The current ThoughtWorks Radar and FAQ use Adopt / Trial / Assess / Caution; Build Your Own Radar still uses Hold. The [model-radar source notes](../../skills/governance/ki-model-radar/references/sources.md#last-review) explicitly adapt Caution as Hold. Compare those meanings explicitly; this intake does not silently rename that separate model. Tool assessment remains independent of installation, and retirement remains a separate lifecycle action.

### Alternatives and authority

A dedicated per-volume template makes completeness and deduplication easy to inspect; adding a volume check to an existing recurring review may reduce machinery if its owner and evidence fit. An ad hoc bookmark is insufficient because Kris requested a regular input that must survive this session. Choose the procedure and evidence home during planning, without preselecting a scheduler or promising automatic ring movement.

ThoughtWorks is an input to judgement and learning. Ring changes, experiments, machine configuration, retirements and publication each retain their own owner approval and verification rules. The recurring review proposes and routes work; it does not acquire authority to execute those downstream changes.
