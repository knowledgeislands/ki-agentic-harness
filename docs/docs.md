# Documentation

This is the map of `docs/` and the guiding principles that govern everything in it. The harness's documentation is split into four sources, each answering a different question and each held to its own standard. Read this page to know where a given thing belongs and how it is expected to be written.

## Guiding principles

**Each source has one job.** Decisions record the **why**, feature definitions the **what**, guides the **how**, and plans the **when**. A fact belongs in exactly one of them; if it is tempting to write it in two places, one of those is the wrong place.

**A source is written to be read on its own terms.** Two sources are deliberately **standalone** — they do not send the reader out to understand them:

- **The user guide** ([`guides/user-guide/`](guides/user-guide)) is a one-sitting account of the harness for someone using it. It explains the harness on its own terms and names decisions and skills by their ID or `name:` rather than linking into `decisions/` or `skills/`. A reader finishes it without ever leaving it.
- **Decision Records** ([`decisions/`](decisions)) are **self-contained**. A record inlines the context it needs and states the decision in full; its only outbound links are to **sibling DRs in the same set, following the reading-order layering** (a decision may point to the foundations it builds on). It does not link to skills, guides, feature definitions, workflows, or external URLs — those are named in prose. The sole carve-out is a record whose subject _is_ an external artefact (e.g. a toolchain survey), which may cite that artefact's URL as content. The format is governed by the `ki-decision-records` skill.

**The map may link; the sources it maps mostly do not.** This page and each source's own `README.md` / `index.md` are indexes — they exist to point outward. That is not a licence for the records and guide chapters themselves to do so.

## The four sources

### Decisions — the _why_

[`decisions/`](decisions) holds the Decision Records: `ADR-`, `GDR-`, and the other typed records, each a living present-state record in the Nygard five-section shape. The bare `ADR-KI-HARNESS-NNN` series is the **foundations**; sub-scoped series (`TOOLCHAIN`, `SKILLS`, `AGENTS`) carry decisions about a narrower area. See [`decisions/README.md`](decisions/README.md) for the reading order (grouped by scope, numeric within each) and the by-ID index.

### Feature definitions — the _what_

[`features/`](features) holds the behaviour-level specification: what the harness does, stated normatively (RFC-2119) with a `_Verify:_` hook per requirement. Flat, one file per area, with [`features/index.md`](features/index.md) defining the ID scheme and areas table. Governed by the `ki-feature-definitions` skill.

### Guides — the _how_

[`guides/user-guide/`](guides/user-guide) is the standalone user guide: [Overview](guides/user-guide/overview.md) (what the harness is and how the parts fit), [Skills](guides/user-guide/skills.md) (the set and its clusters), [Skill catalogue](guides/user-guide/skill-catalogue.md) (each skill, one by one), [Onboarding](guides/user-guide/onboarding.md) (bootstrap and the governance flows), [Using a skill](guides/user-guide/installation.md) (how a skill fires once installed), [Linking skills](guides/user-guide/linking.md) (the keystone-plus-project-local install mechanics), [Recommended tools](guides/user-guide/recommended-tools.md) (chezmoi, headroom-ai, mcporter, claude.ai connectors), and [Tuning](guides/user-guide/tuning.md) (making a session lean — which tools, skills, and MCP servers load).

[`guides/prompting/`](guides/prompting) is a second guide area: how to prompt the leading models — one guide per model, distilled from that vendor's own prompting docs. It covers the Claude tiers the harness runs ([Fable 5](guides/prompting/fable-5.md), [Opus 4.8](guides/prompting/opus-4-8.md), [Sonnet 5](guides/prompting/sonnet-5.md), [Haiku 4.5](guides/prompting/haiku.md)) plus cross-model reference for the other market leaders — [GPT-5.5](guides/prompting/gpt-5-5.md), [GPT-5.6](guides/prompting/gpt-5-6.md), [Gemini 3](guides/prompting/gemini-3.md), and the leading open-weight models ([GLM-5.2](guides/prompting/glm-5-2.md), [DeepSeek V3.2](guides/prompting/deepseek-v3-2.md), [Llama 4](guides/prompting/llama-4.md), and the local [Gemma 4](guides/prompting/gemma-4.md), [Qwen3](guides/prompting/qwen3.md), [Ministral 3](guides/prompting/ministral-3.md)). Unlike the standalone user guide, this is an externally-sourced reference area, so each guide deliberately carries a **Sources** section of outbound vendor URLs for refresh — the same spirit as the DR carve-out for records whose subject is an external artefact.

### Plans — the _when_

[`plans/`](plans) holds implementation plans for open forward work, written when an item enters the roadmap's **Next** phase and removed when it lands. Governed by the `ki-plans` skill. The always-open forward view itself is the root [`ROADMAP.md`](../ROADMAP.md).
