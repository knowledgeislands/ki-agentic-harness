# Knowledge Islands repo-configuration standard

The canonical configuration every repo in the [`knowledgeislands`](https://github.com/knowledgeislands) org should carry, so the repos present and behave
consistently and that consistency is _checkable_ rather than folklore. Three layers — local files, core GitHub settings, deeper GitHub (security & Actions).
Derived and applied 2026-05-31 from an audit of all 10 repos. The mechanical checker is [`../scripts/audit-repo-config.ts`](../scripts/audit-repo-config.ts);
keep this doc and the script's constants in sync.

## Contents

- [Layer 1 — repo files](#layer-1--repo-files)
- [Layer 2 — core GitHub settings](#layer-2--core-github-settings)
- [Layer 3 — deeper GitHub](#layer-3--deeper-github)
- [Visibility](#visibility)
- [Optional checks](#optional-checks)
- [Intentional exceptions](#intentional-exceptions)
- [Applying it](#applying-it)
- [Verifying it](#verifying-it)
- [Conformance](#conformance)

## Layer 1 — repo files

Every repo carries these at the root. Presence is checked **on the default branch via the GitHub API** (the git-tree endpoint), not from a working checkout — so
what's actually committed is what's audited, and `--org` mode covers uncloned repos.

| File              | Why                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `README.md`       | The repo's entry point.                                                                                                 |
| `LICENSE`         | MIT text (matches the GitHub license — layer 2).                                                                        |
| `.gitignore`      | Keeps build/dep noise out of history.                                                                                   |
| `.editorconfig`   | Shared editor defaults across the workspace toolchain.                                                                  |
| `.ki-config.toml` | Declares this repo's expected config under `[knowledgeislands-repo-config]` — `visibility` and acknowledged exceptions. |

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
(above) keeps history tidy for PRs that do happen, but nothing forces work through a PR. A repo that _wants_ a protected `main` opts in (see
[Optional checks](#optional-checks)) — protection is then `main`: require a PR (0 approvals), the `build` status check, linear history, no force-push, no
deletion, admins **not** enforced.

## Layer 3 — deeper GitHub

| Setting                         | Value | Scope                                                   |
| ------------------------------- | ----- | ------------------------------------------------------- |
| Dependabot alerts               | On    | All repos                                               |
| Dependabot security updates     | On    | All repos (each ships a `dependabot-auto-merge.yml`)    |
| Secret scanning                 | On    | Public repos (GHAS-gated on private — see exceptions)   |
| Secret-scanning push protection | On    | Public repos                                            |
| Actions `allowed_actions`       | `all` | All repos (CI pulls marketplace actions like setup-bun) |

## Visibility

Each repo **declares** its expected visibility in `.ki-config.toml` (`visibility = "public"` or `"private"`); the auditor checks that declaration against the
live GitHub visibility. It is a deliberate per-repo choice, **not inferred from the name**. (In practice the `arcadia-*` repos are private bases / internal
skills and the `mcp-*` repos are public servers — a pattern, not the rule.)

`.ki-config.toml` is a shared per-repo file; each skill reads its own `[table]`, and a skill with only implicit/default behaviour needs no table. This skill
owns `[knowledgeislands-repo-config]`. Scaffold the default keys with `bun scripts/audit-repo-config.ts --init >> .ki-config.toml`, then edit the values:

```toml
# .ki-config.toml — one [table] per skill that needs per-repo options
[knowledgeislands-repo-config]
visibility = "public"   # "public" | "private"
exceptions = []         # baseline checks this repo opts OUT of
enforce = []            # optional (default-off) checks this repo opts IN to, e.g. ["branch-protection"]
```

## Optional checks

Most checks are **baseline**: they apply to every in-scope repo and a repo opts _out_ via `exceptions` (below). A few are **optional** — off by default, and a
repo opts _in_ by listing the check-id in its `.ki-config.toml` `enforce = [...]`. This is how the standard carries a default while letting a specific repo
override it, without that override reading as drift.

| Optional check      | Default | Opt in with                       | When enforced, requires                                                                                           |
| ------------------- | ------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `branch-protection` | off     | `enforce = ["branch-protection"]` | `main`: a PR (0 approvals), the `build` status check, linear history; no force-push/deletion; admins not enforced |

- The required status check is **`build`** — the single job in each repo's `.github/workflows/ci.yml` (workflow "CI"). A repo that opts in but lacks that job
  can't satisfy the check; add the CI job first.
- An `enforce` entry that doesn't name a known optional check WARNs (it would otherwise silently do nothing). The auditor's known set is the source of truth.

## Intentional exceptions

A repo records an **acknowledged divergence** from a _baseline_ check by listing its check-id in `.ki-config.toml` `exceptions = [...]`; the auditor then
reports it as `ack` rather than a failure, so it never reads as drift. (`exceptions` opts out of a baseline check; [`enforce`](#optional-checks) opts in to an
optional one — the two are complementary, and together give per-repo on/off control over the rubric.)

Topics and secret scanning are **public-only** checks — private repos can't take secret scanning on the current plan, so the private `arcadia-*` repos are
simply out of scope for it (no exception needed; their `exceptions = []`). Exceptions are for divergences from a check that _does_ apply — e.g. a public repo
that intentionally keeps Wiki on (`exceptions = ["wiki"]`).

## Applying it

`gh` CLI, authenticated with repo-admin scope. (zsh: use an array, not a bare string — unquoted `$var` does not word-split.)

```zsh
all=(arcadia-principal arcadia-skills arcadia-website mcp-claude-housekeeping mcp-git-audit mcp-gmail mcp-kb-fs mcp-kb-notion-mirror mcp-m365 mcp-voicenotes-edit)
public=(mcp-claude-housekeeping mcp-git-audit mcp-gmail mcp-kb-fs mcp-kb-notion-mirror mcp-m365 mcp-voicenotes-edit)

# Layer 1 — each repo declares its config in .ki-config.toml (committed via PR like any file).
#   Scaffold the [knowledgeislands-repo-config] defaults, then edit:
#     bun scripts/audit-repo-config.ts --init >> .ki-config.toml
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

# Layer 2 — branch protection is OPTIONAL. Default: `main` open — strip any leftover protection:
for r in $all; do gh api -X DELETE "repos/knowledgeislands/$r/branches/main/protection" 2>/dev/null || true; done
# Only for a repo that opts in (enforce = ["branch-protection"] in its .ki-config.toml):
read -r -d '' body <<'JSON'
{ "required_status_checks": {"strict": true, "contexts": ["build"]}, "enforce_admins": false,
  "required_pull_request_reviews": {"required_approving_review_count": 0}, "restrictions": null,
  "required_linear_history": true, "allow_force_pushes": false, "allow_deletions": false }
JSON
printf '%s' "$body" | gh api -X PUT "repos/knowledgeislands/<opted-in-repo>/branches/main/protection" --input -

# Layer 3 — Dependabot (all) + secret scanning (public)
for r in $all; do gh api -X PUT "repos/knowledgeislands/$r/vulnerability-alerts"; gh api -X PUT "repos/knowledgeislands/$r/automated-security-fixes"; done
for r in $public; do
  printf '%s' '{"security_and_analysis":{"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"}}}' \
    | gh api -X PATCH "repos/knowledgeislands/$r" --input -
done
```

Layer 1 files are added with a normal commit, pushed straight to `main` (it is unprotected) or via a PR if you prefer.

## Verifying it

```zsh
bun ../scripts/audit-repo-config.ts ~/kis/knowledgeislands      # enumerate from a local tree (origins)
bun ../scripts/audit-repo-config.ts --org knowledgeislands      # enumerate the whole org
```

Both check every layer against GitHub; the path / `--org` only decides which repos.

## Conformance

As of **2026-05-31**, all 10 `knowledgeislands` repos conform on layers 2–3. Outstanding layer-1 work: every repo still needs a `.ki-config.toml` (declaring its
visibility + any exceptions), and `mcp-kb-notion-mirror` / `mcp-voicenotes-edit` need `.editorconfig` — each a direct commit to `main`.
