---
id: KI-HARNESS-GOV-121
area: GOV
title: Require substantive store mirrors
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-30T07:00:00Z
updated_at: 2026-09-30T07:00:00Z
---

# KI-HARNESS-GOV-121: Require substantive store mirrors

## Goal

Every Markdown note that mirrors a binary in a paired sources store carries the durable knowledge an agent needs, so a search over the notes store answers most questions without opening the binary, and every Knowledge Base with a sources store holds its own work item to bring its mirrors up to that standard.

## Context

KI's working model is that a sources-store binary always has a mirrored Markdown note, but today that note may be only a summary or a pointer. `ki-repo-kb` describes the relationship in one line ("how note extracts mirror its paths") and the QUERY mode says to cite "the source note or paired source document"; neither defines what a mirror must contain. kit-principal's `Admin/Operations/Source Store Mirroring.md` is the only firm convention: a mirror records the co-located source path, a SHA-256 checksum and "only the durable knowledge needed in the notes store".

Once `KI-HARNESS-FND-028` indexes notes stores with qmd, a pointer-only mirror will be indexed but rarely rank, while a mirror with a real extract will. Kris asked on 2026-09-30 that each Knowledge Base gain a roadmap item to complete its mirrors.

## Boundary

In scope: promote the mirror definition into the `ki-repo-kb` standard (source path, checksum, durable extract, no copied binary), name the note type consistently across `ki-repo-kb` and the `ki-acquire-*` skills, and add an audit signal that surfaces pointer-only mirrors so each base can capture its own enrichment item; describe the expected per-base work record in the standard so those items share one shape.

Out of scope: writing the per-base records from this repository, since KB groups have no `ki-trades` routes here; changing the OneDrive store topology; committing any binary; the search engine itself.

## Discussion

### Bases known to hold a sources store

kit-principal (four controlled mirror groups), kit-legal (about 2,150 record-series notes with `source_path` frontmatter), kit-techmedix (about 46 correspondence notes citing store paths), vallearmonia-principal (store declared, no mirrors yet) and er-research (seven resource notes). vallearmonia-website and kit-midnight.ninja have OneDrive directories but do not declare a store; each needs a decision before it can hold mirrors. The obsolete `hnr-principal`, originally listed here, has since been deregistered and is out of scope.

### Extract scope

The extract should state what the binary is, the facts a reader would otherwise open it for, and the checksum that tells a later session whether the extract is stale. Mirrors may link to canonical knowledge but must not duplicate private source detail with no enduring use, following the kit-principal rule.
