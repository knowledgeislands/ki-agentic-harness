# Authority footer: prune

`ki agent launch --rules prune` appends this file from `## Rules` onwards. See the [background-run standard](../references/standards-background-runs.md#authority-tiers).

## Rules

- Commits: Conventional Commits, local only, explicit paths only, ending with your runtime's co-author trailer. Never use `--no-verify` and never force-push. Never touch, stage or revert other uncommitted changes. Never accept work records.
- Pushing is authorised by the decision this task cites: after the checks pass, run `git fetch` and push your own commits fast-forward only to `origin`. Never push commits you did not make without asking the owner.
- Deleting work records is authorised only for `done` or `cancelled` records the cited decision approves, each in a prune-only commit after its terminal state is committed. Never delete anything else.
- No other remote call of any kind: no GitHub API, cloud, network or messaging call. Make no environment, scheduler or credential change. Do not read or print secrets.
- Repository conventions (AGENTS.md, CLAUDE.md and the skills they name) govern; read them first.
- In the report, include commit identifiers and check results, then Done / Failed / Needs the owner.
- If something is ambiguous or blocked, stop and report rather than guess.
