---
id: GDR-KI-HARNESS-010
title: Named multi-site governance
date: 2026-09-17
status: current
decision_type: governance
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
---

# GDR-KI-HARNESS-010: Named multi-site governance

## Context

The generator-neutral website capability originally selected one repository-relative site root. Repositories can contain multiple independently built and hosted websites, while implementation and hosting capabilities need stable identities for scoping findings and configuration. Repository users also need one unchanged public command seam for the primary website without duplicating terminal commands already expressed by repository-owned named scripts.

## Decision

Knowledge Islands website governance supports either the existing single-site declaration or an explicit named multi-site registry.

- Single-site mode remains a keyless default at `apps/site` or uses one safe `site-root` override.
- Multi-site mode uses lower-kebab-case names mapped to unique physical repository-relative roots and names exactly one `primary-site`; it is mutually exclusive with `site-root`.
- Website implementation and hosting overlays apply to every registered site unless their optional non-empty `sites` list selects a known subset.
- Every selected site receives independently attributed audit evidence. Conform does not infer or create a registry.
- The unqualified root `ki:site:*` commands remain the public seam for the primary site. A primary command may be its exact terminal command or delegate through exactly one `bun run self:site:<primary>:<verb>` hop whose target is that exact terminal command. Chained, cyclic, missing, or mismatched aliases do not satisfy the seam.

## Consequences

One repository can govern several sites without inventing path keys in every overlay or changing callers of the public primary-site commands. Named identities make subset selection and findings stable, while exact one-hop resolution permits repository-owned script organisation without weakening command validation. Registries carry more explicit configuration and every additional site must maintain its own package, output, implementation, and hosting evidence. Existing single-site repositories remain valid without migration.
