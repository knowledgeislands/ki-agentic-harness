# Authority footer: none

`ki agent launch --rules none` appends this file from `## Rules` onwards. See the [background-run standard](../references/standards-background-runs.md#authority-tiers).

## Rules

- Commits: Conventional Commits, local only, explicit paths only, ending with the co-author trailer that names the model making the commit, per the standard's [commit-trailer rule](../references/standards-background-runs.md#coordination). Never use `--no-verify`, never force-push, and never push. Never touch, stage or revert other uncommitted changes. Never accept, prune or delete work records.
- No remote call of any kind: no Git fetch or push, no GitHub API, cloud, network or messaging call. Make no environment, scheduler or credential change. Do not read or print secrets.
- Repository conventions (AGENTS.md, CLAUDE.md and the skills they name) govern; read them first.
- Write the report as the owner report the background-run standard sets: what has been done, with commit identifiers and check results; what is in progress; outstanding queries, ending with the copyable reply block.
- If something is ambiguous or blocked, stop and report rather than guess.
