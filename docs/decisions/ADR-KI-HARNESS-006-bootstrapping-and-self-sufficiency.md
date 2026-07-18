# ADR-KI-HARNESS-006: User installation, repository bootstrap, and self-sufficiency

**Date:** 2026-07-09

## Context

The earlier installation model used one remote bootstrap command for two unrelated jobs: preparing a user's agent environment and making one repository govern itself.

That conflation made global skills depend on a local checkout, presented a repository action as the first onboarding step, and left the durable Claude hook payload on a separate path.

A governed repository still needs to run its mechanical checks without an installed harness or a `package.json`.

## Decision

Knowledge Islands has two installation contracts, both owned by `ki-bootstrap` but with strictly separate write scopes.

- **Install the harness once for a user.** `https://knowledgeislands.info/harness/install` serves the `scripts/user-install.sh` entry point. With no runtime selection, it detects only regular top-level `~/.claude/` (Claude Code) and `~/.agents/` (Agents/Codex) directories, then installs regular-file copies of the global core skills (`ki-bootstrap`, `ki-delegate`, `ki-next`, `ki-plan`, and `ki-recap`) for every conformant detected directory. An explicit runtime option selects a runtime when detection finds none or the user wants a narrower install. When Claude Code is selected, it also installs the durable Claude hook payload. The public installer never creates a development symlink or writes Claude settings.
- **Bootstrap a repository.** `https://knowledgeislands.info/harness/bootstrap` serves `scripts/repo-bootstrap.sh`. It downloads a disposable harness source, runs the repository bootstrap engine, and writes only the selected target repository. An installed `ki-bootstrap` skill invokes this same repository operation in an agent session. The route remains available for a person or automation that does not use an agent.
- **Keep the repository self-sufficient.** Repository bootstrap resolves declared governance coverage, vendors each required mechanical checker and HELP snapshot below `.ki-meta/checkers/`, writes the `.ki-meta/bin/{ki-audit,ki-conform,ki-educate,ki-help}` runners, and publishes complete copied project-local runtime skills. It never writes the target's `package.json`, user-global skills, hooks, or settings.
- **Separate copied payloads from deliberate links.** Normal user and repository installation always use regular-file copies. `ki-repo` owns the explicit repository-local linking capability for a future `ki-self` surface and local harness development; `ki-harness` composes that capability where relevant. Linking is never a prerequisite for ordinary use.
- **Keep global development links explicit.** A harness author working from a local checkout may run `ki:skills:link:global`, which replaces only the managed global core-skill copies with symlinks to that checkout. `ki-harness` owns both this local-author command and its fixed five-skill set. It is not a mode of the public installer and it has no public route.
- **Keep entry points small and names descriptive.** `scripts/` exposes only the shell entry points and canonical governance mode entries (`audit.ts`, `conform.ts`, and `educate.ts`). Their TypeScript implementations and private helpers live under `scripts/lib/`. The public routes never expose a `lib/` path.

Re-running either installation contract is the idempotent update path for its own scope. There are no legacy installation modes or compatibility paths.

## Consequences

- The getting-started journey is ordered: install the harness once, then bootstrap each repository. A user can choose `/ki-bootstrap` in an agent session or the repository route in direct automation.
- A repository continues to govern itself through committed `.ki-meta/` payloads after the downloaded source disappears. The optional `ki:*` package keys remain `ki-engineering` aliases over those repository-local runners.
- The user installer can be tested independently of repository bootstrap and Claude settings. A compliant user-environment manager, currently chezmoi, binds the already-installed hook payload into settings.
- `scripts/bootstrap.*`, `install-hooks.*`, and checkout-dependent linkers are replaced by the named entry points and owners above. Their tests move with the responsible entry point or internal component.
- The stable public routes are a website contract. The KI Website binds them to the corresponding raw GitHub shell files after those files exist; friendly URLs must not be documented as live before then.

## References

- [ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-mechanical-first-progressive-enhancement.md) — the mechanical-first stance that makes repository self-sufficiency possible.
- [ADR-KI-HARNESS-SKILLS-001](ADR-KI-HARNESS-SKILLS-001-canonical-modes.md) — the governance modes whose mechanical entries repository bootstrap vendors.
