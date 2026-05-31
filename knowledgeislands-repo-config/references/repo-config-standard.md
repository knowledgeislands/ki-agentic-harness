# Knowledge Islands repo-configuration standard

The canonical configuration every repo in the [`knowledgeislands`](https://github.com/knowledgeislands) org should carry, so the repos present and behave
consistently and that consistency is _checkable_ rather than folklore. Three layers — local files, core GitHub settings, deeper GitHub (security & Actions).
Derived and applied 2026-05-31 from an audit of all 10 repos. The mechanical checker is [`../scripts/audit-repo-config.ts`](../scripts/audit-repo-config.ts);
keep this doc and the script's constants in sync.

## Contents

- [Layer 1 — local files](#layer-1--local-files)
- [Layer 2 — core GitHub settings](#layer-2--core-github-settings)
- [Layer 3 — deeper GitHub](#layer-3--deeper-github)
- [Visibility](#visibility)
- [Intentional exceptions](#intentional-exceptions)
- [Applying it](#applying-it)
- [Verifying it](#verifying-it)
- [Conformance](#conformance)

## Layer 1 — local files

Every repo carries these on disk (checked from a local checkout, regardless of host):

| File            | Why                                                    |
| --------------- | ------------------------------------------------------ |
| `README.md`     | The repo's entry point.                                |
| `LICENSE`       | MIT text (matches the GitHub license — layer 2).       |
| `.gitignore`    | Keeps build/dep noise out of history.                  |
| `.editorconfig` | Shared editor defaults across the workspace toolchain. |

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

| Setting           | Value                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Topics            | `mcp`, `model-context-protocol`, `claude`, `typescript`, `bun`                                                                                    |
| Branch protection | `main`: require a PR (0 approvals), require the `build` status check, require linear history, no force-push, no deletion, admins **not** enforced |

## Layer 3 — deeper GitHub

| Setting                         | Value | Scope                                                   |
| ------------------------------- | ----- | ------------------------------------------------------- |
| Dependabot alerts               | On    | All repos                                               |
| Dependabot security updates     | On    | All repos (each ships a `dependabot-auto-merge.yml`)    |
| Secret scanning                 | On    | Public repos (GHAS-gated on private — see exceptions)   |
| Secret-scanning push protection | On    | Public repos                                            |
| Actions `allowed_actions`       | `all` | All repos (CI pulls marketplace actions like setup-bun) |

## Visibility

Set by name prefix; intentional, not drift: `arcadia-*` **private** (bases / internal skills), `mcp-*` **public** (open-source servers).

## Intentional exceptions

- **Private `arcadia-*` repos carry no topics, no classic branch protection, and no secret scanning** — protected branches and secret scanning require a paid
  plan / GHAS for private repos on the current org plan. Revisit via repository **rulesets** (broader plan support) and GHAS if the org upgrades.
- The required status check is **`build`** — the single job in each public repo's `.github/workflows/ci.yml` (workflow "CI"). A repo without that job can't
  require it; add the CI job first.

## Applying it

`gh` CLI, authenticated with repo-admin scope. (zsh: use an array, not a bare string — unquoted `$var` does not word-split.)

```zsh
all=(arcadia-principal arcadia-skills arcadia-website mcp-claude-housekeeping mcp-git-audit mcp-gmail mcp-kb-fs mcp-kb-notion-mirror mcp-m365 mcp-voicenotes-edit)
public=(mcp-claude-housekeeping mcp-git-audit mcp-gmail mcp-kb-fs mcp-kb-notion-mirror mcp-m365 mcp-voicenotes-edit)

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

# Layer 2 — branch protection (public)
read -r -d '' body <<'JSON'
{ "required_status_checks": {"strict": true, "contexts": ["build"]}, "enforce_admins": false,
  "required_pull_request_reviews": {"required_approving_review_count": 0}, "restrictions": null,
  "required_linear_history": true, "allow_force_pushes": false, "allow_deletions": false }
JSON
for r in $public; do printf '%s' "$body" | gh api -X PUT "repos/knowledgeislands/$r/branches/main/protection" --input -; done

# Layer 3 — Dependabot (all) + secret scanning (public)
for r in $all; do gh api -X PUT "repos/knowledgeislands/$r/vulnerability-alerts"; gh api -X PUT "repos/knowledgeislands/$r/automated-security-fixes"; done
for r in $public; do
  printf '%s' '{"security_and_analysis":{"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"}}}' \
    | gh api -X PATCH "repos/knowledgeislands/$r" --input -
done
```

Layer 1 files are added with a normal commit — via a **PR** on public repos, since `main` is protected.

## Verifying it

```zsh
bun ../scripts/audit-repo-config.ts ~/kis/knowledgeislands      # local tree, github.com-gated
bun ../scripts/audit-repo-config.ts --org knowledgeislands      # whole org (GitHub layers only)
```

## Conformance

As of **2026-05-31**, all 10 `knowledgeislands` repos conform on layers 2–3. Layer-1 gap: `mcp-kb-notion-mirror` and `mcp-voicenotes-edit` lack `.editorconfig`
(pending a PR to each, since `main` is protected).
