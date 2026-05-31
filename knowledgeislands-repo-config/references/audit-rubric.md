# Repo-config audit rubric

The line-by-line checkable criteria behind [the standard](repo-config-standard.md). Each is tagged **[M] mechanical** (the bundled
[`../scripts/audit-repo-config.ts`](../scripts/audit-repo-config.ts) enforces it and prints the **id** in brackets) or **[J] judgment** (a reader assesses it).
Codes are the check ids the script emits. Each cites the standard layer it verifies.

A criterion's tag is a contract with the script: if you find yourself eyeballing an **[M]** check, run the auditor instead; a **[J]** check that becomes
deterministic should move into the script and flip to **[M]**.

## Layer 1 — repo files (presence on the default branch, via the GitHub git-tree API)

- **readme [M]** `README.md` present. (standard: Layer 1)
- **license-file [M]** `LICENSE` (or `LICENSE.md`) present. (Layer 1)
- **gitignore [M]** `.gitignore` present. (Layer 1)
- **editorconfig [M]** `.editorconfig` present. (Layer 1)
- **ki-config [M]** `.ki-config.toml` present (and read for `visibility` + `exceptions`). (Layer 1)

## Layer 2 — core GitHub settings (repos on github.com)

- **default-branch [M]** default branch is `main`. (Layer 2)
- **license [M]** license is MIT. (Layer 2)
- **description [M]** description is non-empty. (Layer 2)
- **merge [M]** squash only — merge-commit off, rebase off. (Layer 2)
- **delete-branch [M]** auto-delete head branch on merge is on. (Layer 2)
- **issues [M]** Issues enabled. (Layer 2)
- **wiki [M]** Wiki disabled. (Layer 2)
- **projects [M]** Projects disabled. (Layer 2)
- **visibility [M]** live GitHub visibility matches the value **declared** in `.ki-config.toml` (`visibility = "public" | "private"`); missing/invalid
  declaration → fail. (standard: Visibility)
- **topics [M]** _(public)_ carries the standard topic set. (Layer 2)
- **branch-protection [M]** _(public)_ `main` requires a PR, the `build` check, and linear history. (Layer 2)

## Layer 3 — deeper GitHub

- **dependabot-alerts [M]** Dependabot alerts on. (Layer 3)
- **dependabot-updates [M]** Dependabot security updates on. (Layer 3)
- **secret-scanning [M]** _(public)_ secret scanning on. (Layer 3; private exempt — plan-limited)
- **push-protection [M]** _(public)_ secret-scanning push protection on. (Layer 3)
- **actions [M, WARN]** `allowed_actions` is `all`; anything else WARNs rather than fails (tightening is a deliberate per-repo choice). (Layer 3)

## Judgment (not deterministic — apply by reading)

- **description-fit [J]** the description actually _describes the repo's purpose_, and stays in sync with its `package.json` `description` where one exists. The
  script only checks non-emptiness. (Layer 2)
- **exceptions** a repo acknowledges a divergence by listing the check-id in its `.ki-config.toml` `exceptions = [...]`; the script then reports it as `ack`,
  not a fail. **[J]** part: confirm each acknowledged exception is genuinely warranted (e.g. a private repo that can't take `branch-protection`), not a way to
  silence real drift. (standard: Intentional exceptions)
- **sync [J]** this rubric, [the standard](repo-config-standard.md), and the script's constants agree. When the standard moves, all three move together
  (REFRESH).
