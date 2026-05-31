---
name: knowledgeislands-repo-config
description: >
  Codify, audit, and apply the Knowledge Islands repo-configuration standard across the `knowledgeislands` org — the local files a repo should carry (README,
  LICENSE, .gitignore, .editorconfig), its GitHub settings (merge policy, branch, features, topics, visibility, description, branch protection), and security
  (secret scanning, Dependabot, Actions permissions). Use when checking whether repos match the standard, bringing one into line, onboarding a new repo, or
  refreshing the standard against GitHub's surface. Triggers: "audit the repos", "do our repos follow the config standard", "check repo settings", "apply the
  repo standard", "set up branch protection", "enable secret scanning / Dependabot", "refresh the repo-config standard". Discovers repos from a local tree
  (github.com-gated) or a whole org via `gh`. Governs how a repo is configured (its settings and standard files), not its source code.
argument-hint: 'apply <repo> | audit | refresh'
---

# Knowledge Islands repo config

You are helping hold the repos in the [`knowledgeislands`](https://github.com/knowledgeislands) org to one **repository-configuration standard** — how a repo is
_set up_, not what its code does. The standard has three layers (local files, GitHub settings, deeper GitHub). Its full, quotable form with rationale and
intentional exceptions lives in [the standard](references/repo-config-standard.md); the line-by-line checkable items (each tagged mechanical/judgment) live in
[the rubric](references/audit-rubric.md); the mechanical checker is [`scripts/audit-repo-config.ts`](scripts/audit-repo-config.ts).

This skill governs **configuration only** — how a repo is set up, not its source code. How it sits alongside the other skills in this repo (where they
complement and where they must not overlap) is documented once in the arcadia-skills `README.md`, not repeated here.

## The standard at a glance

1. **Local** — files every repo carries: `README.md`, `LICENSE`, `.gitignore`, `.editorconfig`.
2. **GitHub** (repos on github.com): default branch `main`, MIT, **squash-only merge + linear history**, auto-delete branch on merge, Issues **on**, Wiki &
   Projects **off**, a non-empty description synced with `package.json` where one exists; public repos also carry the standard topic set and branch protection
   on `main` (require PR, the `build` check, linear history).
3. **Deeper GitHub**: Dependabot alerts + security updates **on** everywhere; secret scanning + push protection **on** for public repos; Actions
   `allowed-actions = all`.

**Visibility** is set by name prefix and is intentional, not drift: `arcadia-*` private, `mcp-*` public. Intentional exceptions (e.g. private repos can't take
secret scanning / classic branch protection on the current plan) are recorded in [the standard](references/repo-config-standard.md) — don't re-flag them.

## Operating modes

Infer the mode from the request; ask if unclear. (Modes are named and alphabetical.)

### Mode APPLY — bring a repo (or the org) into line

Outward-facing: it changes live GitHub settings and may open PRs. Show the diff and confirm before mutating.

1. Run **AUDIT** first, so you change against a known gap list.
2. **Local files** — add any missing `README.md` / `LICENSE` / `.gitignore` / `.editorconfig`. On public repos `main` is protected, so this lands via a branch +
   PR, not a direct push; copy the file from the closest healthy sibling.
3. **GitHub settings** — apply with the `gh` commands in [the standard](references/repo-config-standard.md) (merge methods, auto-delete-branch, features,
   description, topics, branch protection).
4. **Deeper** — Dependabot alerts/updates, secret scanning + push protection (public), Actions permissions.
5. **Re-audit** to confirm convergence.

### Mode AUDIT — check live config against the standard

1. Confirm `gh` is authenticated against the org (`gh auth status`).
2. **Run the mechanical checker**: `bun scripts/audit-repo-config.ts <tree-path>` (local repos, github.com-gated) or `--org <org>` (every repo in the org).
   Capture its PASS / WARN / FAIL output verbatim.
3. **Do the judgment pass the script can't** — the `[J]` items in [the rubric](references/audit-rubric.md): does each description actually _match the repo's
   purpose_ and stay in sync with its `package.json`; is a divergence an **intentional exception** (per the standard) rather than drift.
4. **Report** by `repo · check · fix`, lead with FAILs, and call out intentional exceptions you chose not to flag.

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

- Requires the `gh` CLI authenticated with **repo-admin** scope to apply settings or branch protection.
- `main` on public repos is protected — local-file fixes (APPLY step 2) land via PR, never a direct push.
- **Private repos**: classic branch protection and secret scanning are plan-limited; the standard exempts them. Revisit via **rulesets** / GHAS if the org
  upgrades — a REFRESH follow-up.
- The auditor is **read-only**; only APPLY mutates, and only against confirmed gaps.
