---
id: GDR-KI-HARNESS-011
title: Versioned source installation for MCP servers
date: 2026-09-24
status: current
decision_type: governance
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
---

# GDR-KI-HARNESS-011: Versioned source installation for MCP servers

## Context

Knowledge Islands MCP servers can be cloned, built, and bound locally, but that development workflow does not provide a stable installed location, immutable source evidence, atomic activation, rollback, or a durable provenance receipt. Publishing every server package to npm would add public namespace, registry, release, and support obligations that are unnecessary for repositories already distributed as Git source.

## Decision

Knowledge Islands MCP servers use governed, versioned source installation as the default distribution model.

- A GitHub `owner/repository`, annotated `v<SemVer>` tag, and full commit object ID identify a release.
- `.ki.toml`, `package.json`, the committed Bun lockfile, and Git are the repository-to-installer hand-off. No duplicative release descriptor is introduced.
- The server repository owner chooses versions, creates tags, and designates stable releases.
- `ki-repo-mcp` governs release-readiness evidence but never performs a release.
- `tools-ki` owns source resolution, locked build, versioned staging, provenance receipts, activation, update, rollback, and uninstall.
- `ki-binding` owns client registration. Website and registry surfaces own discovery only and cannot become required installation transports.
- npm publication, official MCP Registry metadata, MCPB bundles, compiled artifacts, and Homebrew distribution remain optional.

## Consequences

Servers become installable by repository identity without claiming package-registry names or inserting a package registry into the runtime path. Every active installation can be traced to a tag and immutable commit, and a failed update can leave the prior active version unchanged.

The installer must perform local source builds and manage Git access for private repositories, so installation is slower than downloading a prebuilt artifact. Repositories must maintain aligned package versions, annotated tags, locked dependencies, and build entry points. A future prebuilt transport may supplement this model, but reversing the no-registry default requires a new governance decision and migration path rather than silently making publication a prerequisite.

## References

- [GDR-KI-FUNDAMENTALS-001](GDR-KI-FUNDAMENTALS-001-knowledge-islands-ecosystem-fundamentals.md)
- [Semantic Versioning 2.0.0](https://semver.org/)
- [Git tag documentation](https://git-scm.com/docs/git-tag)
- [Bun install documentation](https://bun.sh/docs/pm/cli/install)
