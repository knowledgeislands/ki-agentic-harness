# ADR-KI-HARNESS-SKILLS-009: Two repo-structure skills for standalone tools and their Homebrew tap

**Date:** 2026-07-09

## Context

Releasing the `mgit` CLI produced two repos that no existing repo-structure skill governs: `tools-mgit` (a standalone command-line tool — a bash script, no `package.json`, no TypeScript) and `homebrew-tap` (the Homebrew distribution repo carrying `Formula/*.rb`). Neither matches the existing repo-structure shapes in [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md) (`ki-harness`, `ki-kb`, `ki-website`, `ki-mcp`, `ki-plugins`), so both were published with no `.ki-config.toml` and fell outside governance.

Per [ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-composition-over-extension.md), a genuinely new _repo shape_ warrants a new repo-structure skill; a _variation_ of an existing shape is declared in `.ki-config.toml` + `CLAUDE.md`, never forked. A standalone CLI tool and a package-manager tap are each a genuinely new shape. Two precedents make this low-friction: `ki-kb` is a repo-structure skill whose checker uses only Bun/Node built-ins and never rides the `ki-engineering` TS toolchain; `ki-plugins` is a governed repo with no `package.json` that deliberately omits `[ki-engineering]` and is still compliant (a bare `[ki-repo]` marker is a complete config).

## Decision

Add two repo-structure skills — **`ki-tools`** and **`ki-homebrew-tap`** — to the repo-structure cluster, joining `ki-harness`, `ki-kb`, `ki-website`, `ki-mcp`, and `ki-plugins`. Both ride `ki-repo` but **not** `ki-engineering` (the `ki-kb` pattern); each carries the universal INIT/AUDIT/CONFORM/REFRESH modes and a mechanical checker; each `implies:` nothing.

- **`ki-tools`** — governs a `tools-*` repo: one standalone CLI per repo, distributed via a `curl | bash` installer and a companion tap formula. Governs the **container shape**, language-agnostically: `bin/<tool>` executable, a version marker + `--version`, `install.sh` contract, `tests/` + a CI workflow present, README/LICENSE/CHANGELOG (keep-a-changelog + semver), `vX.Y.Z` tags → a GitHub release per tag. Lint/test are **capability conditionals** — a shell entrypoint requires shellcheck-clean + a bats suite run in CI; a `package.json` appearing defers lint/test to `ki-engineering`. Marker `[ki-tools]` (keyless, validate-down). Checker `audit-tools.ts`.
- **`ki-homebrew-tap`** — governs the `homebrew-tap` repo by **wrapping Homebrew's external standard**: `Formula/*.rb` (class/`desc`/`homepage`/`url`/`sha256`/`license`/`install`/`test do`), a versioned-tarball formula source, the README formula table, optional `brew test-bot` CI. Its checker `audit-homebrew-tap.ts` delegates to `brew audit --strict` / `brew style` and degrades to NA when `brew` is absent (the tap's own CI runs test-bot). REFRESH is `external-spec`, tracking the Homebrew Formula Cookbook. Marker `[ki-homebrew-tap]`. The repo name is fixed by Homebrew (`homebrew-<x>` for the `brew tap` shorthand); the skill governs shape, not name.

- **Cascade.** `ki-repo`'s coverage cascade gains both as artifact-detected structure signals: `tools` → `install.sh` + a `bin/<exe>`; `homebrew-tap` → `Formula/*.rb`. A detected-but-undeclared signal WARNs, keeping the one-structure-skill-per-repo invariant mechanical.

## Consequences

- The two live repos are retrofitted to declare their governance — `tools-mgit` carries `[ki-repo]` + `[ki-tools]`, `homebrew-tap` carries `[ki-repo]` + `[ki-homebrew-tap]` — and are audited **from the harness** during development (`bun skills/repo-structure/ki-tools/scripts/audit-tools.ts ../tools-mgit`), the `ki-plugins` pattern. They can also self-govern standalone: the bootstrapping chain and self-sufficiency contract (ADR-KI-HARNESS-006) vendors each checker into `.ki-meta/` and writes the `./.ki-meta/bin/ki-audit` runner **without ever touching a `package.json`** — which suits these repos exactly, since neither carries one (adding npm to a bash tool would contradict its premise). The standalone-runner work this record once anticipated as a follow-up is subsumed by that package.json-free chain.
- The shell toolchain (shellcheck + bats) lives **inside** `ki-tools` for now — a single consumer, so no separate foundations skill. Extracting a `ki-shell` twin of `ki-engineering` is deferred until a second structure skill needs the same shell layer (YAGNI at n=1).
- Homebrew's formula rules (`brew audit`/`brew style`, the Formula Cookbook) become a tracked source for `ki-homebrew-tap`, reconciled on its REFRESH cadence.
- The harness gains `ki:tools:*` / `ki:homebrew-tap:*` script families; both checkers are run from the harness against the sibling repos during development, and each repo also self-governs standalone via its own vendored `.ki-meta/` runner (no `package.json` required).

## References

- [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md) — the taxonomy this extends (the repo-structure cluster).
- [ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-composition-over-extension.md) — composition over extension: new shape → new skill, variation → declaration.
- [ADR-KI-HARNESS-SKILLS-008](ADR-KI-HARNESS-SKILLS-008-feature-definitions-skill.md) — the precedent for adding a skill against the ADR-006 taxonomy.
