---
id: KI-HARNESS-GOV-076
area: GOV
title: Reduce outcome routing guide
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 6e6c2e282366087f14a65594318546dd8976d601
created_at: 2026-09-18T05:35:00Z
updated_at: 2026-09-19T11:38:02Z
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

## Current state

The website copy is published at `https://knowledgeislands.info/guidance/skills/by-outcome/`. The Harness still retains the full 108-line source and links to it from repository orientation, documentation indexes, and the generated skill catalogue, so the copies can diverge.

Keep a short stub at the existing local path. It preserves inbound repository links and Git history while making the website page the sole maintained routing guide. Update repository-owned navigation to link directly to the website where the reader is choosing a skill; retain the stub only as a compatibility pointer.

## Steps

- [x] Replace the local guide body with a concise pointer to the website-owned canonical guide.
- [x] Update repository orientation and indexes that currently present the local file as the maintained guide.
- [x] Preserve generated capability catalogue ownership and its complementary skill-by-name purpose.
- [x] Run Markdown and roadmap audits.

## Files touched

- `docs/guides/skills-by-outcome.md`
- `docs/guides/README.md`
- `docs/docs.md`
- `README.md`
- `AGENTS.md`
- `skills/README.md`
- this roadmap record

## Verify

```sh
ki repo audit --skill ki-authoring --repo .
ki repo audit --skill ki-work-roadmap --repo .
rg -n 'docs/guides/skills-by-outcome\.md|guides/skills-by-outcome\.md|skills-by-outcome\.md' README.md AGENTS.md docs skills/README.md
```

## Dependencies / blocks

The website publication under `KI-WEB-SITE-008` is complete. No delivery dependency remains.

## Documentation impact

### Decision Records

None.

### Specifications

None.

### Guides

The website becomes the sole maintained outcome-routing guide; the Harness path becomes a compatibility pointer.

### Roadmap

No follow-up is required unless the website URL changes.

## Review

### Delivered

Reduced the duplicated local outcome-routing guide from baseline `6e6c2e282366087f14a65594318546dd8976d601` while preserving its former path as a compatibility pointer.

### Summary of changes

- Replaced the 108-line local guide with a five-line pointer to the website-owned canonical page.
- Updated the repository README, AGENTS orientation, documentation map, guide index, and skill catalogue introduction to route readers directly to the website.
- Retained the generated capability catalogue as the repository-owned exact inventory.

### Verification

- `ki-authoring` and `ki-work-roadmap` audits pass.
- The full Harness test suite, TypeScript, and Biome checks pass.
- Repository navigation contains no active link to the former local maintained copy outside its compatibility role or historical records.

### Outstanding concerns

None. The pointer intentionally depends on the published website URL recorded by `KI-WEB-SITE-008`.

### Post-change review

The change establishes one maintained source without breaking existing local URLs and preserves the catalogue's separate exact-inventory role. It is ready for human acceptance.

### Mini recap

Outcome routing is now website-owned; the Harness retains only a stable pointer and its generated capability facts.

## Discussion

The receiving item is `KI-WEB-SITE-008`. The website owns the maintained prose; this repository retains only a stable pointer so existing local links fail gracefully rather than becoming a second source.
