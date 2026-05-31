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
- **ki-config [M]** `.ki-config.toml` present (and read for `visibility` + the `[…checks]` override table). (Layer 1)

## Layer 2 — core GitHub settings (repos on github.com)

- **default-branch [M]** default branch is `main`. (Layer 2)
- **license [M]** license is MIT. (Layer 2)
- **description [M]** description is non-empty. (Layer 2)
- **merge [M]** squash only — merge-commit off, rebase off. (Layer 2)
- **delete-branch [M]** auto-delete head branch on merge is on. (Layer 2)
- **issues [M, override↓ on]** Issues enabled. (Layer 2)
- **wiki [M, override↓ on]** Wiki disabled. (Layer 2)
- **projects [M, override↓ on]** Projects disabled. (Layer 2)
- **visibility [M]** live GitHub visibility matches the value **declared** in `.ki-config.toml` (`visibility = "public" | "private"`); missing/invalid
  declaration → fail. (standard: Visibility)
- **topics [M, override↓ on]** _(public)_ carries the standard topic set. (Layer 2)
- **branch-protection [M, override↓ off]** `main` requires a PR, the `build` check, and linear history. **Off by default** (`main` open) — runs only when a repo
  sets `branch-protection = true`. (standard: Per-repo overrides)

## Layer 3 — deeper GitHub

- **dependabot-alerts [M]** Dependabot alerts on. (Layer 3)
- **dependabot-updates [M]** Dependabot security updates on. (Layer 3)
- **secret-scanning [M, override↓ on]** _(public)_ secret scanning on. (Layer 3; private out of scope — plan-limited)
- **push-protection [M, override↓ on]** _(public)_ secret-scanning push protection on. (Layer 3)
- **actions [M, WARN]** `allowed_actions` is `all`; anything else WARNs rather than fails (tightening is a deliberate per-repo choice). (Layer 3)

**override↓** marks an **overridable** check: its org default (`on`/`off`) lives in the script's `CHECK_DEFAULTS`, and a repo flips it for itself with a boolean
under `[knowledgeislands-repo-config.checks]` (`true` = enforce, `false` = don't). Every other check is bedrock — not overridable. An active override prints as
a `note`, never a failure; a `[…checks]` key that names no overridable check **WARNs** (`checks` id). (standard: Per-repo overrides)

## Judgment (not deterministic — apply by reading)

- **description-fit [J]** the description actually _describes the repo's purpose_, and stays in sync with its `package.json` `description` where one exists. The
  script only checks non-emptiness. (Layer 2)
- **overrides** each boolean under `[knowledgeislands-repo-config.checks]` flips an overridable check for that repo (the script prints it as a `note`). **[J]**
  part: confirm each override is a genuine, warranted per-repo decision (e.g. a public repo that deliberately keeps a Wiki, or one that protects `main`), not a
  way to wave off real drift. (standard: Per-repo overrides)
- **sync [J]** this rubric, [the standard](repo-config-standard.md), and the script's constants agree. When the standard moves, all three move together
  (REFRESH).
