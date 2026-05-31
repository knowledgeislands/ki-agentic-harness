---
name: knowledgeislands-repo-config
description: >
  Codify, audit, and apply the Knowledge Islands repo-configuration standard across the `knowledgeislands` org — the local files a repo should carry (README,
  LICENSE, .gitignore, .editorconfig), its GitHub settings (merge policy, branch, features, topics, visibility, description), and security (secret scanning,
  Dependabot, Actions permissions). Use when checking whether repos match the standard, bringing one into line, onboarding a new repo, or refreshing the
  standard against GitHub's surface. Triggers: "audit the repos", "do our repos follow the config standard", "check repo settings", "apply the repo standard",
  "set up branch protection", "enable secret scanning / Dependabot", "refresh the repo-config standard". Discovers repos from a local tree (github.com-gated) or
  a whole org via `gh`. Governs how a repo is configured (its settings and standard files), not its source code. For Markdown / TOML authoring style, use the
  `knowledgeislands-authoring` skill.
argument-hint: 'apply <repo> | audit | refresh'
---

# Knowledge Islands repo config

You are helping hold the repos in the [`knowledgeislands`](https://github.com/knowledgeislands) org to one **repository-configuration standard** — how a repo is
_set up_, not what its code does. The standard has three layers (local files, GitHub settings, deeper GitHub). Its full, quotable form with rationale and the
per-repo override model lives in [the standard](references/repo-config-standard.md); the line-by-line checkable items (each tagged mechanical/judgment) live in
[the rubric](references/audit-rubric.md); the mechanical checker is [`scripts/audit-repo-config.ts`](scripts/audit-repo-config.ts).

This skill governs **configuration only** — how a repo is set up, not its source code. How it sits alongside the other skills in this repo (where they
complement and where they must not overlap) is documented once in the arcadia-skills `README.md`, not repeated here.

## The standard at a glance

1. **Files** — every repo carries `README.md`, `LICENSE`, `.gitignore`, `.editorconfig`, and `.ki-config.toml` (its declared config). Presence is checked on the
   default branch **via the GitHub API**, not a checkout.
2. **GitHub** (repos on github.com): default branch `main`, MIT, **squash-only merge + linear history**, auto-delete branch on merge, Issues **on**, Wiki &
   Projects **off**, a non-empty description synced with `package.json` where one exists; public repos also carry the standard topic set. **`main` is open by
   default** — branch protection is an _optional_ check a repo opts into (below).
3. **Deeper GitHub**: Dependabot alerts + security updates **on** everywhere; secret scanning + push protection **on** for public repos; Actions
   `allowed-actions = all`.

**Visibility** is **declared** per repo in `.ki-config.toml` under `[knowledgeislands-repo-config]` (`visibility = "public" | "private"`) and checked against
live GitHub — not inferred from the name. `.ki-config.toml` is a shared file: each skill reads its own `[table]`, and `--init` scaffolds this skill's default
keys. Per-repo overrides live in a `[knowledgeislands-repo-config.checks]` sub-table — one boolean per overridable check (`true` = enforce, `false` = don't);
omit any to take the org default, so a fully-conforming repo writes none. `branch-protection` defaults **off** (set `true` to protect `main`); the
GitHub-feature and security checks default **on** (set `false` to step out). The auditor prints each active override as a `note`, never a failure. See
[the standard](references/repo-config-standard.md).

## Operating modes

Infer the mode from the request; ask if unclear. (Modes are named and alphabetical.)

### Mode APPLY — bring a repo (or the org) into line

Outward-facing: it changes live GitHub settings and may open PRs. Show the diff and confirm before mutating.

1. Run **AUDIT** first, so you change against a known gap list.
2. **Files** — add any missing `README.md` / `LICENSE` / `.gitignore` / `.editorconfig`, and a `.ki-config.toml` (scaffold its `[knowledgeislands-repo-config]`
   defaults with `bun scripts/audit-repo-config.ts --init >> .ki-config.toml`, then set `visibility` and any `[…checks]` overrides). `main` is unprotected, so
   this can be a direct push (or a PR if you prefer).
3. **GitHub settings** — apply with the `gh` commands in [the standard](references/repo-config-standard.md) (merge methods, auto-delete-branch, features,
   description, topics).
4. **Deeper** — Dependabot alerts/updates, secret scanning + push protection (public), Actions permissions.
5. **Re-audit** to confirm convergence.

### Mode AUDIT — check live config against the standard

1. Confirm `gh` is authenticated against the org (`gh auth status`).
2. **Run the mechanical checker**: `bun scripts/audit-repo-config.ts <tree-path>` (local repos, github.com-gated) or `--org <org>` (every repo in the org).
   Capture its PASS / WARN / FAIL output verbatim.
3. **Do the judgment pass the script can't** — the `[J]` items in [the rubric](references/audit-rubric.md): does each description actually _match the repo's
   purpose_ and stay in sync with its `package.json`; is each per-repo override (a `note` in the output) a warranted decision rather than waved-off drift.
4. **Report** by `repo · check · fix`, lead with FAILs, and call out the overrides (`note`s) you judged warranted.

### Mode REFRESH — re-anchor the standard to GitHub's surface

GitHub's settings surface moves (rulesets vs classic protection, new security toggles, Actions policy). Run periodically, or when asked "is the repo-config
standard current".

1. **Read [the source list](references/sources.md)** — the tracked GitHub REST API / `gh` / rulesets / security-features sources, each with a `last reviewed`
   date.
2. **Re-fetch each** and **diff** against [the standard](references/repo-config-standard.md) and [`scripts/audit-repo-config.ts`](scripts/audit-repo-config.ts):
   new or renamed settings, changed defaults, protection moving to rulesets, new security toggles.
3. **Scan the org** for emergent patterns the standard hasn't captured.
4. **Propose a diff** to the standard, the script, and this file; confirm before writing.
5. **Update [the source list](references/sources.md)** — bump each `last reviewed` date and record what changed in the changelog. Mandatory: the source list is
   the skill's memory of where the standard comes from.

## Notes

- Requires the `gh` CLI authenticated with **repo-admin** scope to apply settings.
- `main` is **open by default** — direct pushes are allowed, so local-file fixes (APPLY step 2) can land as a direct commit. A repo overrides the
  `branch-protection` check on (`[…checks]` `branch-protection = true`); only then does APPLY protect that repo's `main`.
- **Private repos**: secret scanning is plan-limited; the standard exempts it (public-only check). Revisit via **GHAS** if the org upgrades — a REFRESH
  follow-up.
- The auditor is **read-only**; only APPLY mutates, and only against confirmed gaps.
