# The bootstrap standard — project-local skill install

The normative model `ki-bootstrap` governs. It is small by design: this is the **keystone**, the one `ki-*` skill kept globally installed, so its standing cost is paid on every turn in every project.

## Why project-local, and why a keystone

A skill's `name` + `description` sits in the selection surface on **every turn**. Installing all governance skills globally (`~/.claude/skills/`) pays that cost in every session, including ones that never touch a Knowledge Islands repo. So the governance skills are **project-local** — placed in a repo's `.claude/skills/`, loaded only when that repo is in the session.

That leaves a bootstrap problem: something must be globally available to _wire_ a repo's project-local skills, and to reach `ki-repo`'s INIT in a repo that has no `.ki-config.toml` yet. Globalizing the heavy `repo` skill wastes the budget. So a single tiny skill — this one — is the global keystone; it does nothing but mirror a repo's declared coverage into its `.claude/skills/`.

## The invariant

For a Knowledge Islands repo, `.claude/skills/` contains exactly:

> **the skills the repo declares** (`[ki-<skill>]` tables in `.ki-config.toml`) **∪ the baseline `ki-repo` + `ki-authoring`**, minus `ki-bootstrap` itself (which is global).

- **Declared coverage** is owned by `ki-repo`'s coverage cascade — this skill _reads_ the tables, never edits them. Whether the declared set is correct for the repo is a `ki-repo` question.
- **The baseline** is always linked: `repo` so a greenfield repo can reach INIT to scaffold its config; `authoring` because Markdown/TOML style is universal (it is cascade-exempt — no per-repo table — so it is added explicitly).
- **The harness** (`ki-agentic-harness`) is the exception: as the authoring hub it links **all** skills, not a subset (`--all`).

## How the links are stored

- **Relative symlinks** into the harness's `skills/` (e.g. `.claude/skills/ki-mcp -> ../../../ki-agentic-harness/skills/ki-mcp`), computed for wherever the harness actually sits.
- **Gitignored and regenerated, never committed.** Committed cross-repo symlinks dangle on a clone that lacks the harness beside it. The only committed artifact is the `.gitignore` line; a fresh clone re-runs the keystone linker once to recreate the links.
- The keystone linker **self-locates** the harness through its own real path — no hard-coded harness location.

## Reproducibility contract

Every Knowledge Islands repo carries a `.gitignore` entry for `.claude/skills/`; re-running the global keystone linker (the harness uses `--all`) regenerates the links from `.ki-config.toml` alone, on any machine. That makes the project-local skill set reproducible without ever committing the symlinks.

Wiring `package.json` convenience keys is no concern of the linker — it manages only the symlinks and the `.gitignore` line. Any `ki:<suffix>:<verb>` script sugar is `ki-engineering`'s to add later, over the vendored `.ki-meta/bin` runners.

## Governance agents

A parallel, smaller invariant covers `agents/governance/*.md`: a repo's `.claude/agents/` should contain exactly those files, as **relative file symlinks**, when — and only when — the repo's `.ki-config.toml` carries the bare `[ki-agents]` table. Unlike skills there is no baseline: no agent is always-on, so an undeclared repo gets no agent links at all rather than a default subset. [`link-agents.ts`](../scripts/link-agents.ts) is a direct sibling of the skill linker, sharing its self-location and gitignore logic (factored into [`package-scripts.ts`](../scripts/package-scripts.ts)); like the skill linker it manages only relative symlinks and the `.gitignore` line, so `.claude/agents/` is likewise gitignored and regenerated, never committed.
