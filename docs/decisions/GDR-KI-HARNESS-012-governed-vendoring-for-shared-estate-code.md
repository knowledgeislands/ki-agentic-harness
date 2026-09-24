---
id: GDR-KI-HARNESS-012
title: Governed vendoring for shared estate code
date: 2026-09-24
status: current
decision_type: governance
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
---

# GDR-KI-HARNESS-012: Governed vendoring for shared estate code

## Context

MCP servers and command-line tools repeat small security-sensitive utilities, installers, and packaging controls. Independent copies drift silently, while a mandatory package-registry dependency would add publication, availability, namespace, and support obligations to repositories that already build from a checkout. Similar filenames do not establish common ownership because audit redaction, signing, delivery, and language boundaries can differ legitimately.

## Decision

Stable cross-repository source is distributed as skill-owned, whole-file vendored profiles with a deterministic manifest, content digests, and visible provenance markers.

- The owning repository skill defines profiles by behaviour and trust boundary rather than by filename or implementation language alone.
- A receiving repository opts into one supported profile explicitly in its skill configuration.
- AUDIT distinguishes missing, exact, modified, obsolete, and repository-owned extension files.
- CONFORM may create only missing managed files when the profile, destinations, prerequisites, and repository-owned seams are unambiguous. It never overwrites modified bytes or removes obsolete files.
- Security policy, credentials, sanitizers, tool identity, and other receiver-specific behaviour remain in separate repository-owned seams.
- Receiver migrations remain independently planned, verified, reviewed, and committed in the receiving repository.

## Consequences

Repositories retain buildable local copies without a package registry, while the Harness can identify drift against one reviewed source. Explicit profiles preserve meaningful variation and make upgrades reviewable. Whole-file ownership keeps integrity checks simple but prohibits local edits inside managed files; extensions require a separate seam. Profile authors must maintain fixtures, manifests, migration evidence, and compatibility boundaries, and receiving repositories must opt in before any projection applies.

## References

- [GDR-KI-HARNESS-011](GDR-KI-HARNESS-011-versioned-source-installation-for-mcp-servers.md)
