# The bootstrap standard — project-local skill install

The normative model `knowledgeislands-bootstrap` governs. It is small by design: this is the **keystone**, the one `knowledgeislands-*`
skill kept globally installed, so its standing cost is paid on every turn in every project.

## Why project-local, and why a keystone

A skill's `name` + `description` sits in the selection surface on **every turn**. Installing all governance skills globally
(`~/.claude/skills/`) pays that cost in every session, including ones that never touch a Knowledge Islands repo. So the governance skills
are **project-local** — placed in a repo's `.claude/skills/`, loaded only when that repo is in the session.

That leaves a bootstrap problem: something must be globally available to _wire_ a repo's project-local skills, and to reach
`knowledgeislands-repo`'s INIT in a repo that has no `.ki-config.toml` yet. Globalizing the heavy `repo` skill wastes the budget. So a
single tiny skill — this one — is the global keystone; it does nothing but mirror a repo's declared coverage into its `.claude/skills/`.

## The invariant

For a Knowledge Islands repo, `.claude/skills/` contains exactly:

> **the skills the repo declares** (`[knowledgeislands-<skill>]` tables in `.ki-config.toml`) **∪ the baseline `knowledgeislands-repo` +
> `knowledgeislands-authoring`**, minus `knowledgeislands-bootstrap` itself (which is global).

- **Declared coverage** is owned by `knowledgeislands-repo`'s coverage cascade — this skill _reads_ the tables, never edits them. Whether
  the declared set is correct for the repo is a `knowledgeislands-repo` question.
- **The baseline** is always linked: `repo` so a greenfield repo can reach INIT to scaffold its config; `authoring` because Markdown/TOML
  style is universal (it is cascade-exempt — no per-repo table — so it is added explicitly).
- **The harness** (`arcadia-agentic-harness`) is the exception: as the authoring hub it links **all** skills, not a subset (`--all`).

## How the links are stored

- **Relative symlinks** into the harness's `skills/` (e.g.
  `.claude/skills/knowledgeislands-mcp -> ../../../arcadia-agentic-harness/skills/knowledgeislands-mcp`), computed for wherever the harness
  actually sits.
- **Gitignored and regenerated, never committed.** Committed cross-repo symlinks dangle on a clone that lacks the harness beside it. The
  committed artifacts are a `ki:skills:link:project` package.json script (which re-runs the keystone linker) and the `.gitignore` line. A
  fresh clone runs `ki:skills:link:project` once.
- The keystone linker **self-locates** the harness through its own real path — no hard-coded harness location.

## Reproducibility contract

Every Knowledge Islands repo carries:

- a `package.json` `"ki:skills:link:project"` script that invokes the global keystone linker (the harness uses `--all`); and
- a `.gitignore` entry for `.claude/skills/`.

Together these make the project-local skill set reproducible from `.ki-config.toml` alone, on any machine, after a single
`ki:skills:link:project`.
