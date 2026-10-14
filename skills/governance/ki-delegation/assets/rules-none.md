# Authority footer: none

`ki agent launch --rules none` appends this file from `## Rules` onwards. See the [background-run standard](../references/standards-background-runs.md#authority-tiers).

## Rules

- Commits: Conventional Commits, local only, explicit paths only, ending with the co-author trailer that names the model making the commit, per the standard's [commit-trailer rule](../references/standards-background-runs.md#coordination). Never use `--no-verify`, never force-push, and never push. Never touch, stage or revert other uncommitted changes. Never accept, prune or delete work records.
- No remote call of any kind: no Git fetch or push, no GitHub API, cloud, network or messaging call. Make no environment, scheduler or credential change. Do not read or print secrets.
- Repository conventions (AGENTS.md, CLAUDE.md and the skills they name) govern; read them first.
- Write the report as the owner report the ki-pmo [owner-report standard](../../../change-management/ki-pmo/references/standards-pmo.md#owner-report) sets: the ki-pmo report heading of the thread you report to with `› <run name>` added, `# [<Initiative>](<local Initiative note>) › [<Project>](<local Project note>) › <run name>`, then the bold `**Run report at <local time> · last mark <local time>**` line and one `---`; `## Done`, with commit identifiers and check results; `## In Progress`; `## Queries`, each query carrying **Context**, **Query** and **Options** with `a) (recommended)` first and no bullets, ending with the copyable reply block whose entries carry the option a) instruction in full, then the thread's block-letter footer banner, `run report` and the issued time on its top border and one blank framed line inside each border, with its bracketed-state list and, at rest, the resume line.
- A connection-critical change - a firewall, or the configuration of a service critical for connection such as the Headroom proxy, SSH, Tailscale, the network or auth - needs a tested restore path in the task, under the standard's [connection-critical rule](../references/standards-background-runs.md#connection-critical-changes); without one, stop and report.
- If something is ambiguous or blocked, stop and report rather than guess.
