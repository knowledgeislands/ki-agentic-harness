# Authority grant: fetch

> **Draft, not approved.** This wording awaits Kris Brown's review under [KI-HARNESS-GOV-201](../../../../docs/roadmap/KI-HARNESS-GOV-201-fetch-and-machine-grants.md). No launcher reads this file, the background-run standard does not list it, and it grants nothing until its wording is approved.

Once approved, `ki agent launch --allow fetch` appends this file from `## Grant: fetch` onwards, after the tier footer. See the [background-run standard](../references/standards-background-runs.md#authority-tiers).

## Grant: fetch

- **Draft, not approved: this grant is not in force, and the Rules above stand unchanged.**
- Fetching is authorised by the decision this task cites: you may run `git fetch`, and `git pull --rebase --no-autostash` or `git pull --ff-only`, from the remotes the task names, or from `origin` where it names none. This overrides only the Rules' ban on a Git fetch; every other line of the Rules stands.
- A fetch or pull may update remote-tracking branches and replay your own local commits; it never authorises a push, a force-push, a stash, a reset of shared `main`, or resolving a conflict in another session's work. If a pull refuses or conflicts, stop and report.
- Every other remote call stays banned: no push unless your tier or task grants one, and no GitHub API, cloud, network or messaging call. Under a tier that already allows `git fetch`, this grant adds nothing.
