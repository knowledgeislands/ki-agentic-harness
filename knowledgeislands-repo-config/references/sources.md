# Sources — where the repo-config standard comes from

The authoritative sources behind [the standard](repo-config-standard.md), [the rubric](audit-rubric.md), and
[`../scripts/audit-repo-config.ts`](../scripts/audit-repo-config.ts). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard +
script, then **bumps the `last reviewed` dates and records what changed** in the changelog below. GitHub's settings surface moves (rulesets, security toggles,
Actions policy), so this is the skill's memory of where the standard comes from — keep it current.

## Authoritative (GitHub)

| Source                                                                                                                              | Governs                                                              | Last reviewed |
| ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------- |
| [REST: repository settings](https://docs.github.com/en/rest/repos/repos#update-a-repository)                                        | merge methods, auto-delete-branch, features, description, visibility | 2026-05-31    |
| [REST: branch protection](https://docs.github.com/en/rest/branches/branch-protection)                                               | the optional `branch-protection` body (PR, `build` check, linear)    | 2026-05-31    |
| [Repository rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets) | the modern alternative to classic protection (private-repo path)     | 2026-05-31    |
| [REST: Dependabot alerts / automated security fixes](https://docs.github.com/en/rest/repos/repos#enable-vulnerability-alerts)       | `vulnerability-alerts`, `automated-security-fixes` endpoints         | 2026-05-31    |
| [Secret scanning & push protection](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)                 | `security_and_analysis` toggles and their plan/GHAS gating           | 2026-05-31    |
| [REST: Actions permissions for a repository](https://docs.github.com/en/rest/actions/permissions)                                   | `allowed_actions` policy                                             | 2026-05-31    |
| [`gh` CLI manual](https://cli.github.com/manual/)                                                                                   | `gh repo list/view/edit`, `gh api` — how the script reads/writes     | 2026-05-31    |

## Review changelog

Record each REFRESH run: date, what was re-fetched, what changed in the standard / script (or "no change").

- **2026-05-31** — Standard derived from an audit of all 10 `knowledgeislands` repos and applied. Established the three layers (local files; core GitHub
  settings; deeper security & Actions), the visibility-by-prefix rule, and the private-repo exceptions (plan-limited branch protection + secret scanning,
  rulesets/GHAS as the upgrade path). Source list created alongside the auditor script.
- **2026-05-31** — Made `main` **open by default** and replaced the two-list override mechanism with a single **per-repo override table**. Each overridable
  check is now one boolean under `[knowledgeislands-repo-config.checks]` (`true` = enforce, `false` = don't); a check omitted takes the org default in the
  script's `CHECK_DEFAULTS`, so a fully-conforming repo writes no overrides. `branch-protection` defaults off; `wiki`/`projects`/`issues`/`topics`/
  `secret-scanning`/`push-protection` default on. (This superseded the short-lived `exceptions`/`enforce` lists from earlier the same day.) The auditor applies
  overrides inline — a not-enforced check no longer fails, an active override prints as a `note`, and a `[…checks]` key naming no overridable check WARNs.
  Standard's "Optional checks" + "Intentional exceptions" sections merged into one "Per-repo overrides" section.
