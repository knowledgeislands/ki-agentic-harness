# Documentation

This is the map of `docs/` and the guiding principles that govern everything in it. The harness repository keeps four durable documentation sources, while the KI Website publishes broader public user and prompting guidance. Read this page to know where a given thing belongs and how it is expected to be written.

## Guiding principles

**Each source has one job.** Decisions record the **why**, Specifications the **what**, guides the **how**, and roadmap items the **when**. The generated capability catalogue publishes exact local skill facts; the skills-by-outcome guide explains how to choose among them. A fact belongs in exactly one of them; if it is tempting to write it in two places, one of those is the wrong place.

**A source is written to be read on its own terms.** Decision Records ([`decisions/`](decisions)) are **self-contained**. A record inlines the context it needs and states the decision in full; its only outbound links are normally to sibling DRs in the same set, following the reading-order layering. The sole carve-out is a record whose subject is an external artefact or whose canonical public publication has moved, which may cite that current location while preserving the historical decision. The format is governed by the `ki-decision-records` skill.

**The map may link; the sources it maps mostly do not.** This page and each source's own `README.md` or `index.md` are indexes — they exist to point outward. That is not a licence for records and guide chapters to duplicate content from another authority.

## Documentation locations

### Decisions — the _why_

[`decisions/`](decisions) holds the Decision Records: `ADR-`, `GDR-`, and the other typed records, each a living present-state record in the Nygard five-section shape. The bare `ADR-KI-HARNESS-NNN` series is the **foundations**; sub-scoped series (`TOOLCHAIN`, `SKILLS`, `AGENTS`) carry decisions about a narrower area. See [`decisions/README.md`](decisions/README.md) for the reading order (grouped by scope, numeric within each) and the by-ID index.

### Specifications — the _what_

[`specs/`](specs) holds the behaviour-level contract: what the harness does, stated normatively (RFC-2119) with a `_Verify:_` hook per requirement. Flat, one file per area, with [`specs/index.md`](specs/index.md) defining the ID scheme and areas table. Governed by the `ki-specs` skill.

### Guides — the _how_

[`guides/`](guides) holds repository-local practical instructions. Its [index](guides/README.md) directs readers to the website-owned [skills-by-outcome guide](https://knowledgeislands.info/guidance/skills/by-outcome/) and repository-local contributor procedures; [`guides/developer/`](guides/developer) stays lightweight, covering local Harness development and skill testing. It is governed by the `ki-guides` skill.

### Public guidance — website-owned

The KI Website is the canonical home for public explanatory guidance:

- [Using KI](https://knowledgeislands.info/guidance/using-ki/) explains installation, onboarding, safe operation, tuning, and planning journeys.
- [Skills and journeys](https://knowledgeislands.info/guidance/skills/) owns public outcome routing, while the generated [capability catalogue](../skills/README.md#generated-capability-catalogue) remains authoritative for the exact capabilities in this repository.
- [Prompting guides](https://knowledgeislands.info/guidance/prompting/) publish the source-backed, model-specific guidance and current portable type-to-model resolution.

The harness retains the underlying `SKILL.md` files, generated capability catalogue, standards, generated rubric publications, decisions, specifications, and developer procedures. A short pointer may preserve a former local URL, but it must not duplicate the website-owned guide.

### Repository roadmaps — the _when_

[`roadmap/`](roadmap) holds this non-KB repository's canonical flat work items. The root [`ROADMAP.md`](../ROADMAP.md) is their concise orientation; `ki-work-roadmap` governs both layers. Knowledge Bases use `ki-repo-kb-streams` instead of this repository-roadmap layout.

## Temporary working documents

A temporary working document may sit directly under `docs/` when a small design needs to converge through implementation before it can honestly become a decision, definition, guide, or plan.

It must name its temporary status and promote settled material into the appropriate durable source rather than becoming a parallel documentation system.
