---
id: '001'
title: Copy project skills by default, with development links
status: in-progress
roadmap: runtime-portability/copy-project-local-skills-by-default-with-development-links
blocks: —
blocked-by: —
handoff: true
tier: opus
readiness: 2026-07-16
---

## Context

ADR-KI-HARNESS-011 separates two project-local skill modes. Normal bootstrap and repository use must publish complete regular-file skill payloads into each selected runtime's discovery directory, so a project session does not depend on a harness checkout. A harness author may deliberately replace those payloads with live symlinks, but that is a distinct local-development operation and must never be the default.

## Current state

The current `project-links.ts` transaction is link-first: `conform.ts` calls it to create project skill symlinks, its checks expect links, and the compatibility `link-skills.ts` entry point mutates the same surface. Runtime selection is already declarative through `target_runtimes`, mapping Claude Code to `.claude/skills/` and Codex to `.agents/skills/`. Agents, global skills, hooks, user settings, and `.ki-meta/` have separate ownership and are out of scope.

Copied skills remain generated runtime payloads, gitignored and refreshed from their declared harness source. They are not editable forks and are not committed source in consumer repositories.

## Steps

1. [x] Define separate normal-copy and explicit development-link command boundaries without changing the existing runtime-selection mapping or agent/global-skill ownership.
2. [x] Implement normal bootstrap and CONFORM publication of complete regular-file copies for every declared skill and selected runtime; preserve source modes, reject invalid source or destination shapes, and keep copied trees self-contained after a temporary bootstrap source disappears.
3. [x] Implement a deliberately named development-link command that can replace only normal copied payloads or links into the active local harness; make legacy link entry points require the explicit development intent rather than silently creating links.
4. [x] Migrate the skill audit/check contract from expected links to expected copied payloads; preserve generated `.gitignore` handling, selected-runtime behaviour, orphan reporting, and explicit Codex-agent non-support. Keep agents on their existing independent link path.
5. [x] Update bootstrap, runtime-portability, developer-linking, and user-facing guidance so normal use, refresh, migration, and local authoring are distinguishable.
6. [x] Add focused copy, refresh, migration, temporary-source-survival, development-link, runtime-selection, agent-isolation, and hostile-path regressions; run focused tests, `bun run test`, then `bun run ki:audit` sequentially.

## Files touched

The `ki-bootstrap` project-skill publisher, normal bootstrap and CONFORM orchestration, compatibility/development-link entry points, focused tests, source skill guidance and audit wording, relevant user/developer guides, and generated roadmap indexes. Do not change `.ki-meta/` runtime-skill state, global skill publication, hooks, user settings, or agent payload generation.

## Verify

Pass when normal bootstrap and CONFORM leave complete regular-file copies of each declared skill under every selected runtime directory; those copies survive removal of the temporary harness source; the audit detects drift or missing payloads; explicit development linking is the only route that creates project-local symlinks; agents remain on their current independent path; and focused tests, `bun run test`, then `bun run ki:audit` pass.

## Dependencies / blocks

Independent of hook delivery, chezmoi binding, global skill publication, and the MCP fleet rollout. It should land before spreading the normal bootstrap/conform model to more repositories, so the pilot uses the intended default payload topology.

## Decisions

**Locked:** `.ki-meta/` remains the durable mechanical-script surface and never stores complete runtime skills or development-link state. Normal bootstrap and CONFORM create regular copied skill payloads; a separately named command with explicit development intent creates links. Copied payloads remain generated and gitignored, rather than editable or committed consumer-repository source. Existing agents, global skill publication, hooks, settings, and the `target_runtimes` mapping remain outside this migration. A generated payload carries a deterministic marker that binds its logical source and copied-tree integrity; in the deliberately local repository trust model, a valid marker identifies a refreshable generated payload but is not cryptographic provenance against a user who deliberately fabricates one. Unmarked or integrity-mismatched links, real directories, and authored files fail with a migration diagnostic.

**Escalate:** a request to commit copied payloads as consumer source, a new runtime payload location, a need to carry runtime state in `.ki-meta/`, a requirement to alter agent/global/hook ownership, hostile-destination or cryptographic-provenance guarantees, or a migration that cannot distinguish an expected generated payload from authored material under the local convention.

## Readiness

- [x] Readiness test: a cold executor can identify ADR-KI-HARNESS-011, the current link-first publisher, the normal-copy and explicit-development boundaries, the excluded surfaces, and the acceptance tests without re-deriving the runtime model (2026-07-16).
