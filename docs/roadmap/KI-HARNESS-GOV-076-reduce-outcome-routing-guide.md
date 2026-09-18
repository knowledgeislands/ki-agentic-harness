---
id: KI-HARNESS-GOV-076
area: GOV
title: Reduce outcome routing guide
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-18T05:35:00Z
updated_at: 2026-09-18T05:35:00Z
transferred_from: KI-WEB-SITE-008
---

# Reduce outcome routing guide

## Goal

Reduce `docs/guides/skills-by-outcome.md` to a pointer at the website copy, so one outcome-to-skill routing exists rather than two.

## Context

The KI Website inventory of public explanatory guidance (`KI-WEB-SITE-002`) classified this guide as website-owned. It answers "I know what I want to achieve, which skill serves it?" for a reader who is unlikely to open this repository, and it pairs with the site's existing skill catalogue, which answers the complementary "what does skill Y govern?".

The website has published the migrated copy at `/guidance/skills/by-outcome/` under `KI-WEB-SITE-008`. The prose was copied verbatim; only the frontmatter and the one relative link to `skills/README.md` were rewritten.

Until this item lands, the two copies coexist. That is recorded rather than silent, but it is exactly the divergence the consolidation exists to prevent, so it should not sit for long.

## Boundary

This reduces one guide. It does not move `docs/docs.md`, the developer guides, the diagrams, or the generated capability catalogue in `skills/README.md` — the same inventory classified all of those as source-owned and they stay.

Whether the pointer lives in `docs/guides/README.md` alone or as a stub file is this repository's call.

## Discussion

The receiving item is `KI-WEB-SITE-008`. If this repository decides the guide should stay here instead, say so on that item rather than leaving both copies in place — the failure mode is two sources, not the wrong one.
