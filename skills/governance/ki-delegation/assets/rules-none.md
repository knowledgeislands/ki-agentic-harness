# Authority footer: none

`ki agent launch --rules none` appends this file from `## Rules` onwards. See the [background-run standard](../references/standards-background-runs.md#authority-tiers).

## Rules

- Commits: Conventional Commits, local only, explicit paths only, ending with the co-author trailer that names the model making the commit, per the standard's [commit-trailer rule](../references/standards-background-runs.md#coordination). Never use `--no-verify`, never force-push, and never push. Never touch, stage or revert other uncommitted changes. Never accept, prune or delete work records.
- No remote call of any kind: no Git fetch or push, no GitHub API, cloud, network or messaging call. Make no environment, scheduler or credential change. Do not read or print secrets.
- Repository conventions (AGENTS.md, CLAUDE.md and the skills they name) govern; read them first.
- Write the report as the owner report the background-run standard sets: the heading `# <run name> · Summary at <local time>` with the plain `Project · Initiative · since the run began · <state>` line beneath it; `## Done`, with commit identifiers and check results; `## In Progress`; `## Queries`, ending with the copyable reply block.
- A connection-critical change - a firewall, or the configuration of a service critical for connection such as the Headroom proxy, SSH, Tailscale, the network or auth - needs a tested restore path in the task, under the standard's [connection-critical rule](../references/standards-background-runs.md#connection-critical-changes); without one, stop and report.
- If something is ambiguous or blocked, stop and report rather than guess.
