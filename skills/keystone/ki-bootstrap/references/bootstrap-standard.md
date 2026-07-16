# The bootstrap standard — project-local skill install

The normative model `ki-bootstrap` governs. It is small by design: this is the **keystone**, the one `ki-*` skill kept globally installed, so its standing cost is paid on every turn in every project.

Every path below (`.claude/skills/`, `~/.claude/skills/`) is the **Claude Code** discovery path, used as the running example. Each declared runtime has its own — OpenAI Codex CLI's is `.agents/skills/` / `~/.agents/skills/` — per the repo's `.ki-config.toml` `[ki-repo] target_runtimes` (default `["claude-code"]`; see `SDR-KI-HARNESS-002`'s runtime feature-coverage matrix). The invariant below applies once per declared runtime.

## Why project-local, and why a keystone

A skill's `name` + `description` sits in the selection surface on **every turn**. Installing all governance skills globally (`~/.claude/skills/`) pays that cost in every session, including ones that never touch a Knowledge Islands repo. So the governance skills are **project-local** — placed in a repo's `.claude/skills/`, loaded only when that repo is in the session.

That leaves a bootstrap problem: something must be globally available to _wire_ a repo's project-local skills, vendor its self-checking surface, and reach `ki-repo`'s INIT in a repo that has no `.ki-config.toml` yet. Globalizing the heavy `repo` skill wastes the budget. So a single tiny skill — this one — is the global keystone and chain engine; `ki-repo` retains the config's file-level contract and foundation scaffold, while each sibling skill may conform its own table.

## The invariant

For a Knowledge Islands repo, `.claude/skills/` contains exactly:

> **the skills the repo declares** (`[ki-<skill>]` tables in `.ki-config.toml`, its foundations `ki-repo` + `ki-authoring` among them), minus `ki-bootstrap` itself (which is global). There is no injected baseline — coverage is purely what the config declares.

- **Declared coverage** is owned by `ki-repo`'s coverage cascade. Bootstrap reads the root owner from exact and dotted tables but injects nothing; whether the declared set is correct is a `ki-repo` question.
- **Resolution is strict.** Every declared root must exist in the ref-specific harness skill index. An unresolved root is a sorted FAIL in check, write, and dry-run modes before any link mutation; it is never filtered from a partial set and never auto-renamed.
- **The harness** (`ki-agentic-harness`) is not special here: it links its own declared coverage like any repo. It _authors_ every skill (their source lives in its `skills/`), but a structural skill (`ki-mcp`, `ki-website`, …) is exercised against a repo of its type, not loaded in the harness — so linking the whole fleet would only add standing context cost for no authoring gain (ADR-KI-HARNESS-007).

## INIT resolution and owner composition

INIT resolves the root owners from exact and dotted `[ki-*]` tables plus explicit `--seed` values, then follows the transitive `implies:` graph. Every declaration, seed, and dependency must resolve before `.ki-meta/` is touched. `ki-bootstrap` itself may be declared or seeded, but as the global chain-starter it is excluded from the vendored set. Bare bootstrap against a missing or empty config with no seed therefore resolves the empty set.

When `ki-repo` is initially seeded or resolved, bootstrap subprocesses `ki-repo`'s scaffold-only INIT leg before vendoring, forwarding dry-run state. This is composition through the owner, not shared ownership: bootstrap embeds no TOML template and never writes `.ki-config.toml` directly. The owner creates a missing file with canonical `[ki-repo]` defaults plus bare `[ki-authoring]`, or append-only repairs whichever exact root marker is missing while preserving all existing bytes. Bootstrap then re-resolves so those declared foundations and their self-check units are vendored in the same run.

## How the links are stored

- **Relative symlinks** into the harness's `skills/` (e.g. `.claude/skills/ki-mcp -> ../../../ki-agentic-harness/skills/repo-structure/ki-mcp`), computed for wherever the harness actually sits.
- **Gitignored and regenerated, never committed.** Committed cross-repo symlinks dangle on a clone that lacks the harness beside it. The only committed artifact is the `.gitignore` line; a fresh clone re-runs the keystone linker once to recreate the links.
- The keystone linker **self-locates** the harness through its own real path — no hard-coded harness location.

## Reproducibility contract

Every Knowledge Islands repo carries a `.gitignore` entry for `.claude/skills/`; re-running the linker regenerates the links from `.ki-config.toml` alone, on any machine. That makes the project-local skill set reproducible without ever committing the symlinks. If any declaration no longer resolves, every linker mode stops before changing links and names the roots a human must reconcile.

Wiring `package.json` convenience keys is no concern of the linker — it manages only the symlinks and the `.gitignore` line. Any `ki:<suffix>:<verb>` script sugar is `ki-engineering`'s to add later, over the vendored `.ki-meta/bin` runners.

In a source-bearing harness target, the bootstrap audit also compares every direct file-kind audit and conform unit with the matching canonical source in that target's `skills/` tree, byte-for-byte, and requires both sides to be regular files. This is a commit gate: the harness materializes the staged Git index and audits that snapshot, so partially staged or unrelated working-tree bytes cannot hide or manufacture source-copy drift. Generated command wrappers and HELP snapshots remain governed by their render/manifest path rather than this direct-copy comparison. A bootstrapped-only repository has no canonical skill sources in its own tree, so the source-copy criterion is not applicable there.

## Governance agents

A parallel, smaller invariant covers `agents/governance/*.md`: a repo's `.claude/agents/` should contain exactly those files, as **relative file symlinks**, when — and only when — the repo's `.ki-config.toml` carries the bare `[ki-agents]` table. Unlike skills there is no baseline: no agent is always-on, so an undeclared repo gets no agent links at all rather than a default subset. [`link-agents.ts`](../scripts/link-agents.ts) is a direct sibling of the skill linker, sharing its self-location and gitignore logic (factored into [`package-scripts.ts`](../scripts/package-scripts.ts)); like the skill linker it manages only relative symlinks and the `.gitignore` line, so `.claude/agents/` is likewise gitignored and regenerated, never committed.
