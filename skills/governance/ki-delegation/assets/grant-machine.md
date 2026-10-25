# Authority grant: machine

`ki agent launch --allow machine` appends this file from the `## Grant: machine` heading, after the tier footer. See the [background-run standard](../references/standards-background-runs.md#authority-tiers).

## Grant: machine

- Machine changes are authorised by the decision this task cites: you may make the local environment and scheduler changes the task names, such as an upgrade of an installed package, a configuration or dotfile edit, or loading, reloading or unloading a scheduled job, on this machine only and nothing beyond them. This overrides only the Rules' ban on an environment or scheduler change; every other line of the Rules stands.
- Never install new software: upgrading an already installed library or tool, our own releases included, is in scope; a new install is not, whatever the task names. A named upgrade may download what it needs from its package source. No other remote call is lifted, and a change on another machine is a remote call.
- A chezmoi or dotfile edit goes ahead only after the judgement check the standard's [dotfiles rule](../references/standards-background-runs.md#dotfiles-and-software) names, a blind review of the `chezmoi diff` the task cites; without one, stop and report.
- Before each change, note how to undo it; after it, check that it took effect. Report each change with its outcome and its undo in one line.
- Credentials stay banned: make no credential change, and do not read or print secrets. A connection-critical change still needs the tested restore path the Rules require, under the standard's [connection-critical rule](../references/standards-background-runs.md#connection-critical-changes); without one, stop and report.
- If a change the task does not name proves necessary, or a named change needs a step the task does not name, stop and report rather than widen it.
