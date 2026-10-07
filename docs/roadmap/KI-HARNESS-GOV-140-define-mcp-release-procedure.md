---
id: KI-HARNESS-GOV-140
area: GOV
title: Define MCP release procedure
kind: deliver
purpose: governance
project: estate-factorisation
component: repo-structure
status: cancelled
resolution: rejected
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-06T01:19:00Z
updated_at: 2026-10-07T20:29:48Z
---

# KI-HARNESS-GOV-140: Define MCP release procedure

## Goal

An MCP server owner can cut a release of any `mcp-*` repository by following one documented procedure, and the result satisfies the release identity the MCP standard already defines.

## Context

On 2026-10-06 none of the nine `mcp-*` repositories under `knowledgeislands/` had a Git tag or a release workflow; each carries only `.github/workflows/ci.yml`. By contrast `tools-ki` has `release.yml` and `tools-rig` has `notify-homebrew-tap.yml`.

`skills/repo-structure/ki-repo-mcp/references/standards-mcp-distribution.md` defines release _identity_ (`DIST-1`): an annotated `v<SemVer>` tag, the full commit it resolves to, the same version in `package.json`, and the declared entry point `dist/mcp-server/index.js`, with a provenance receipt. It defines no release _procedure_, and its CONFORM rule leaves choosing a version, creating a tag and publishing a release to the repository owner. `skills/repo-structure/ki-repo-tools/references/standards-release-readiness.md` already turns the tool standard into a reviewable release checklist and is the natural pattern to reuse.

Raised by the 2026-10-06 estate roadmap consolidation (finding "MCP release process", action C11).

## Boundary

In scope: one shared procedure owned by the `ki-repo-mcp` standard - release workflow shape, annotated tag, version bump and provenance receipt - reusing `ki-repo-tools` release readiness where it applies, plus any audit criterion needed to tell a governed release from an ad hoc one.

Out of scope: per-repository work items. Each `mcp-*` repository's cutover follows through CONFORM or a trade, not nine duplicate records here. Also out of scope: deciding whether or when any MCP is released, which stays with its owner under `DIST-1`; and npm, MCP Registry or bundle publication, which the distribution standard keeps optional.

## Cancelled

Approved by Kris on 2026-10-07 under decision 17 of the state-of-play design, which approved every cancel and merge in the easiest-first delivery plan.

Resolution `rejected`: no MCP release is wanted yet, and the distribution phase it served waits on the ownerless FND-5 phase of Estate factorisation. Recapture when the first MCP release is planned. It leaves no outstanding change.

## Discussion

### Relationship to the tap consumer chain

`tools-ki` releases already fan out through `homebrew-tap`'s release dispatch. Whether MCP releases should join that chain, or stay source-installed from tags, is an open question for shaping; nothing in the distribution standard requires a tap formula.

### Decision owner

Kris decided on 2026-10-06, in the state-of-play review (`ki-arcadia-principal`, `+/_CHECKPOINTS/state-of-play.md`), that this record stays in Triage and that its adoption decision belongs to the estate-factorisation thread (`ki-arcadia-principal`, `+/_CHECKPOINTS/estate-factorisation.md`), since a shared MCP release procedure is a factorisation choice across the `mcp-*` repositories.

### Open questions

- Should the procedure ship as a reusable workflow in the harness, or as a standard each repository implements locally?
- Does `DIST-1` need a mechanical check that a release workflow exists, or only that tags present are valid?
