# Knowledge Islands repo standard

The canonical configuration a Knowledge Islands repo should carry, so repos present and behave consistently and that consistency is _checkable_ rather than
folklore. A Knowledge Islands repo is a git repo that carries a `.ki-config.toml` (its presence is the compliance marker); the standard applies to any such repo
— the [`knowledgeislands`](https://github.com/knowledgeislands) org is the reference set it was derived from, not its boundary. Three layers — local files, core
GitHub settings, deeper GitHub (security & Actions). Derived and applied 2026-05-31 from an audit of all 10 `knowledgeislands` repos. The mechanical checker is
[`../scripts/audit-repo.ts`](../scripts/audit-repo.ts); keep this doc and the script's constants in sync.

## Contents

- [Layer 1 — repo files](#layer-1--repo-files)
- [Layer 2 — core GitHub settings](#layer-2--core-github-settings)
- [Layer 3 — deeper GitHub](#layer-3--deeper-github)
- [Visibility](#visibility)
- [Per-repo overrides](#per-repo-overrides)
- [Applying it](#applying-it)
- [Verifying it](#verifying-it)
- [Conformance](#conformance)

## Layer 1 — repo files

Every repo carries these at the root. Presence is checked **on the default branch via the GitHub API** (the git-tree endpoint), not from a working checkout — so
what's actually committed is what's audited, and `--org` mode covers uncloned repos.

| File              | Why                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| `README.md`       | The repo's entry point.                                                                                               |
| `LICENSE`         | MIT text (matches the GitHub license — layer 2).                                                                      |
| `.gitignore`      | Keeps build/dep noise out of history.                                                                                 |
| `.editorconfig`   | Shared editor defaults across the workspace toolchain.                                                                |
| `.ki-config.toml` | Declares this repo's expected config under `[knowledgeislands-repo]` — `visibility` and any per-repo check overrides. |

## Layer 2 — core GitHub settings

For every repo on github.com:

| Setting            | Value                                                              | Why                                      |
| ------------------ | ------------------------------------------------------------------ | ---------------------------------------- |
| Default branch     | `main`                                                             | Uniform; what tooling and docs assume.   |
| License            | MIT                                                                | House default.                           |
| Description        | Present, one sentence; synced with `package.json` where one exists | One-line identity on GitHub.             |
| Merge methods      | **Squash only** — merge-commit off, rebase off                     | One commit per PR; clean, linear `main`. |
| Auto-delete branch | On                                                                 | No stale merged branches.                |
| Issues             | On                                                                 | The tracker.                             |
| Wiki               | Off                                                                | Docs live in-repo.                       |
| Projects           | Off                                                                | Unused.                                  |
| Discussions        | Off                                                                | Unused.                                  |

Public repos (`mcp-*`) additionally:

| Setting | Value                                                          |
| ------- | -------------------------------------------------------------- |
| Topics  | `mcp`, `model-context-protocol`, `claude`, `typescript`, `bun` |

**`main` is open by default** — no branch protection, so direct pushes are allowed and no PR, status check, or linear-history rule gates it. Squash-only merge
(above) keeps history tidy for PRs that do happen, but nothing forces work through a PR. A repo that _wants_ a protected `main` overrides the
`branch-protection` check on (see [Per-repo overrides](#per-repo-overrides)) — protection is then `main`: require a PR (0 approvals), the `build` status check,
linear history, no force-push, no deletion, admins **not** enforced.

## Layer 3 — deeper GitHub

| Setting                             | Value | Scope                                                          |
| ----------------------------------- | ----- | -------------------------------------------------------------- |
| Dependabot alerts                   | On    | All repos                                                      |
| Dependabot security updates         | On    | All repos (each ships a `dependabot-auto-merge.yml`)           |
| Always suggest updating PR branches | On    | All repos (`allow_update_branch`; keeps PRs current with base) |
| Secret scanning                     | On    | Public repos (plan-limited on private — out of scope)          |
| Secret-scanning push protection     | On    | Public repos                                                   |
| Actions `allowed_actions`           | `all` | All repos (CI pulls marketplace actions like setup-bun)        |

## Visibility

Each repo **declares** its expected visibility in `.ki-config.toml` (`visibility = "public"` or `"private"`); the auditor checks that declaration against the
live GitHub visibility. It is a deliberate per-repo choice, **not inferred from the name**. (In practice the `arcadia-*` repos are private bases / internal
skills and the `mcp-*` repos are public servers — a pattern, not the rule.)

`.ki-config.toml` is a shared per-repo file; each skill reads its own `[table]`, and a skill with only implicit/default behaviour needs no table. The full
cross-skill contract — its presence as the compliance marker, the table-per-skill model, and the validate-your-own-table protocol — is in
[the `.ki-config.toml` contract](ki-config-standard.md). This skill owns `[knowledgeislands-repo]`. Scaffold the default keys with
`bun scripts/audit-repo.ts --init >> .ki-config.toml`, then edit the values:

```toml
# .ki-config.toml — one [table] per skill that needs per-repo options
[knowledgeislands-repo]
visibility = "public"   # "public" | "private"

# Optional. One boolean per overridable check; omit any to take the org default.
# A repo that fully conforms needs nothing here.
[knowledgeislands-repo.checks]
branch-protection = true   # default off — protect `main` on this repo
```

## Per-repo overrides

The rubric carries the **org default** for every check. Most are bedrock — file presence, default branch, license, description, merge policy,
auto-delete-branch, visibility, Dependabot — and aren't negotiable. The rest are **overridable**: a repo flips one for itself with a single boolean in its
`[knowledgeislands-repo.checks]` table, where `true` = enforce this check and `false` = don't. A check you omit takes the org default, so **a fully-conforming
repo writes no overrides at all**. The auditor reports every active override as a `note` (never a failure), so a deliberate departure stays visible without
reading as drift.

| Check               | Org default | When enforced, the auditor requires…                                                                              |
| ------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `branch-protection` | **off**     | `main`: a PR (0 approvals), the `build` status check, linear history; no force-push/deletion; admins not enforced |
| `wiki`              | on          | Wiki disabled.                                                                                                    |
| `projects`          | on          | Projects disabled.                                                                                                |
| `issues`            | on          | Issues enabled.                                                                                                   |
| `topics`            | on          | _(public)_ carries the standard topic set.                                                                        |
| `secret-scanning`   | on          | _(public)_ secret scanning enabled.                                                                               |
| `push-protection`   | on          | _(public)_ secret-scanning push protection enabled.                                                               |

- "Org default **on**" means the check fails unless satisfied — the standard's normal behaviour — and a repo sets the key `false` to step out of it (e.g.
  `wiki = false` to keep a Wiki). `branch-protection` is the one check that's **off** by default; a repo sets it `true` to protect `main`.
- The required status check for `branch-protection` is **`build`** — the single job in each repo's `.github/workflows/ci.yml` (workflow "CI"). A repo that turns
  it on but lacks that job can't satisfy the check; add the CI job first.
- `topics` / `secret-scanning` / `push-protection` are **public-only** — they don't apply to a private repo regardless of the override, so the private
  `arcadia-*` repos need say nothing about them.
- A key under `[…checks]` that names no overridable check (a typo, or a bedrock check) **WARNs** — it would otherwise silently do nothing. The auditor's
  `CHECK_DEFAULTS` registry is the source of truth for what's overridable.
- A **redundant** override — one whose value just restates the org default (e.g. `wiki = true`) — does nothing, so the auditor flags it with a `note` advising
  it be dropped. The aim is that a `.ki-config.toml` carries only genuine divergences, and a conforming repo's `[…checks]` is empty or absent.

## Applying it

`gh` CLI, authenticated with repo-admin scope. (zsh: use an array, not a bare string — unquoted `$var` does not word-split.)

```zsh
all=(arcadia-principal arcadia-skills arcadia-website mcp-claude-housekeeping mcp-git-audit mcp-gmail mcp-kb-fs mcp-kb-notion-mirror mcp-m365 mcp-voicenotes-edit)
public=(mcp-claude-housekeeping mcp-git-audit mcp-gmail mcp-kb-fs mcp-kb-notion-mirror mcp-m365 mcp-voicenotes-edit)

# Layer 1 — each repo declares its config in .ki-config.toml (committed via PR like any file).
#   Scaffold the [knowledgeislands-repo] defaults, then edit:
#     bun scripts/audit-repo.ts --init >> .ki-config.toml
# Visibility is verified (declared vs live), not set here; change actual visibility deliberately:
#   gh repo edit knowledgeislands/<name> --visibility public|private --accept-visibility-change-consequences

# Layer 2 — every repo: squash-only + auto-delete branch + Wiki/Projects off
for r in $all; do
  gh repo edit "knowledgeislands/$r" \
    --enable-merge-commit=false --enable-rebase-merge=false --enable-squash-merge=true \
    --delete-branch-on-merge=true --enable-wiki=false --enable-projects=false
done

# Layer 2 — descriptions (per repo) and topics (public)
gh repo edit knowledgeislands/<name> --description "…"
for r in $public; do
  gh repo edit "knowledgeislands/$r" --add-topic mcp --add-topic model-context-protocol --add-topic claude --add-topic typescript --add-topic bun
done

# Layer 2 — branch protection is overridable, default OFF. Default: `main` open — strip any leftover protection:
for r in $all; do gh api -X DELETE "repos/knowledgeislands/$r/branches/main/protection" 2>/dev/null || true; done
# Only for a repo that overrides it on (branch-protection = true under [..checks] in its .ki-config.toml):
read -r -d '' body <<'JSON'
{ "required_status_checks": {"strict": true, "contexts": ["build"]}, "enforce_admins": false,
  "required_pull_request_reviews": {"required_approving_review_count": 0}, "restrictions": null,
  "required_linear_history": true, "allow_force_pushes": false, "allow_deletions": false }
JSON
printf '%s' "$body" | gh api -X PUT "repos/knowledgeislands/<opted-in-repo>/branches/main/protection" --input -

# Layer 3 — Dependabot (all) + always-suggest-updating-PR-branches (all) + secret scanning (public)
for r in $all; do gh api -X PUT "repos/knowledgeislands/$r/vulnerability-alerts"; gh api -X PUT "repos/knowledgeislands/$r/automated-security-fixes"; done
for r in $all; do gh api -X PATCH "repos/knowledgeislands/$r" -F allow_update_branch=true >/dev/null; done
for r in $public; do
  printf '%s' '{"security_and_analysis":{"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"}}}' \
    | gh api -X PATCH "repos/knowledgeislands/$r" --input -
done
```

Layer 1 files are added with a normal commit, pushed straight to `main` (it is unprotected) or via a PR if you prefer.

## Verifying it

```zsh
bun ../scripts/audit-repo.ts ~/kis/knowledgeislands      # enumerate from a local tree (origins)
bun ../scripts/audit-repo.ts --org knowledgeislands      # enumerate the whole org
```

Both check every layer against GitHub; the path / `--org` only decides which repos.

## Conformance

As of **2026-05-31**, all 10 `knowledgeislands` repos conform on layers 2–3. Outstanding layer-1 work: every repo still needs a `.ki-config.toml` (declaring its
visibility + any check overrides), and `mcp-kb-notion-mirror` / `mcp-voicenotes-edit` need `.editorconfig` — each a direct commit to `main`.
