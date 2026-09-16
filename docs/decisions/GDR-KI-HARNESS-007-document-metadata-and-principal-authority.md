---
id: GDR-KI-HARNESS-007
title: 'Document metadata and principal authority'
date: 2026-09-16
status: current
decision_type: governance
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
decision_depends_on: ['GDR-KI-HARNESS-004']
---

# GDR-KI-HARNESS-007: Document metadata and principal authority

## Context

Knowledge Base documents and Decision Records need one unambiguous meaning for each metadata field. Generic document classification and decision classification serve different concerns. Principal repositories also need an explicit authority source without adding a second configuration schema.

## Decision

`ki-repo` owns repository `repo_type`. `ki-repo-kb` owns shared Knowledge Base document metadata, including `note_type`. `ki-decision-records` owns Decision Record metadata: `decision_type` and `decision_type_url`; a Decision Record does not use generic `type` or `type_url` fields.

For `shared_record: true`, `ki-decision-records` defines shared identity as a deterministic projection of its fixed decision-owned frontmatter fields followed by the complete body. The projection initially excludes only the container-owned `note_type` field. Every unknown frontmatter field fails closed; no general category of repository-local metadata is excluded implicitly.

Principal authority is represented by one canonical governance Decision Record in the principal repository. It is not represented by a portable principal-authority configuration schema.

## Consequences

Each metadata field has one owner and a meaningful prefix, so generic document classification cannot conflict with decision classification. Decision Records remain readable as stand-alone current-state records. Shared decisions can retain required Knowledge Base classification without weakening their common identity, while a new container field requires an explicit governance decision before exclusion. Principal checks can name and read the canonical authority record without treating local configuration as a competing authority source.

## References

- [GDR-KI-HARNESS-004](GDR-KI-HARNESS-004-four-doc-repository-documentation-ownership.md) — the durable documentation ownership model.
