# The bootstrap standard — project-local skill install

The normative model `ki-bootstrap` governs. It is small by design: this is the **keystone**, the one `ki-*` skill kept globally installed, so its standing cost is paid on every turn in every project.

Every path below (`.claude/skills/`, `~/.claude/skills/`) is the **Claude Code** discovery path, used as the running example. Each supported runtime has its own — OpenAI Codex CLI's is `.agents/skills/` / `~/.agents/skills/` — per the repo's required `.ki-config.toml` `[ki-repo] supported_runtimes` (see `SDR-KI-HARNESS-002`'s runtime feature-coverage matrix). The invariant below applies once per supported runtime.

## Why project-local, and why a keystone

A skill's `name` + `description` sits in the selection surface on **every turn**. Installing all governance skills globally (`~/.claude/skills/`) pays that cost in every session, including ones that never touch a Knowledge Islands repo. So the governance skills are **project-local** — placed in a repo's `.claude/skills/`, loaded only when that repo is in the session.

That leaves a bootstrap problem: something must be globally available to _wire_ a repo's project-local skills, vendor its self-checking surface, and reach `ki-repo`'s EDUCATE in a repo that has no `.ki-config.toml` yet. Globalizing the heavy `repo` skill wastes the budget. So a single tiny skill — this one — is the global keystone and chain engine; `ki-repo` retains the config's file-level contract and foundation scaffold, while each sibling skill may conform its own table.

## The invariant

For a Knowledge Islands repo, `.claude/skills/` contains exactly:

> **the skills the repo declares** (`[ki-<skill>]` tables in `.ki-config.toml`, its foundations `ki-repo` + `ki-authoring` among them), minus `ki-bootstrap` itself (which is global). There is no injected baseline — coverage is purely what the config declares.

The one deliberate exception is a repo-local `ki-self` skill. Its one committed, runtime-neutral source is `.ki/self/skill/`, containing a regular `SKILL.md` declaring `name: ki-self`; it is neither a generated declaration nor an indexed harness skill. For every declared runtime, publication creates a relative directory link from that runtime's skill root to `.ki/self/skill/`. The source and links are preserved by CLEAN and are governed by `ki-housekeeping`'s companion contract. Every other unfamiliar `ki-*` entry remains a fail-closed migration blocker.

When a repository has no `.ki/self/skill/` source but has one or more valid legacy runtime copies, publication migrates them only when their complete regular-file trees are byte-identical: it copies that source once into `.ki/self/skill/`, then replaces the runtime copies with relative links. A malformed, unsafe, or divergent legacy footprint is a fail-closed migration diagnostic; it is never overwritten or deleted. A repository without any `ki-self` footprint receives none until its authors add the canonical source.

- **Declared coverage** is owned by `ki-repo`'s coverage cascade. Bootstrap reads the root owner from exact and dotted tables but injects nothing; whether the declared set is correct is a `ki-repo` question.
- **Resolution is strict.** Every declared root must exist in the ref-specific harness skill index. An unresolved root is a sorted FAIL in check, write, and dry-run modes before any link mutation; it is never filtered from a partial set and never auto-renamed.
- **The harness** (`ki-agentic-harness`) is not special here: it links its own declared coverage like any repo. It _authors_ every skill (their source lives in its `skills/`), but a structural skill (`ki-mcp`, `ki-website`, …) is exercised against a repo of its type, not loaded in the harness — so linking the whole fleet would only add standing context cost for no authoring gain (ADR-KI-HARNESS-007).

## EDUCATE resolution and owner composition

EDUCATE resolves the root owners from exact and dotted `[ki-*]` tables plus explicit `--seed` values. Every declaration, seed, and `ki-depends-on:` requirement must resolve, and every selected dependency must have its own explicit `[ki-*]` table, before generated `.ki/` state is touched. `ki-bootstrap` itself may be declared or seeded, but as the global chain-starter it is excluded from the vendored set. Bare bootstrap against a missing or empty config with no seed therefore resolves the empty set.

When `ki-repo` is initially seeded or resolved, bootstrap subprocesses `ki-repo`'s scaffold-only EDUCATE leg before vendoring, forwarding dry-run state. This is composition through the owner, not shared ownership: bootstrap embeds no TOML template and never writes `.ki-config.toml` directly. The owner creates a missing file with canonical `[ki-repo]` defaults plus bare `[ki-authoring]`, or append-only repairs whichever exact root marker is missing while preserving all existing bytes. Bootstrap then re-resolves so those declared foundations and their self-check units are vendored in the same run.

## How project skill payloads are stored

- **Consumer bootstrap and CONFORM copy** each declared complete skill into the selected runtime directory. The payload contains regular files and directories, not a symlink to a harness checkout, so it remains usable after the temporary bootstrap source disappears. Its generated marker records the logical harness source and a deterministic tree-integrity digest; a later publisher accepts it for refresh only when that marker still matches the payload.
- **Gitignored and regenerated, never committed.** The copy is a generated deployment payload, not consumer-repository source. The only committed artifact is the `.gitignore` line; a fresh clone re-runs bootstrap or CONFORM to recreate the payload. A changed or forged marker/payload combination is left untouched with a migration diagnostic rather than overwritten.
- A source harness links its declared runtime skills to its own canonical sources; ordinary repository use remains copy-based. The narrower eligibility and physical-resolution rules are below.

## Harness-local source links

`ki-harness` owns the eligibility rule: links are permitted only when the target is the same physical harness root that owns the canonical source tree. `ki-bootstrap` owns the physical source resolution and its guarded publication transaction.

- Resolve a source only from the canonical `skills/` tree under that same root, and only when the exact named descendant contains `SKILL.md`.
- A source harness may link its runtime payloads, declared `scripts/vendored/` shared-module payloads, canonical `skills/` and `agents/` bootstrap roots, educator sources, and direct checker AUDIT/CONFORM units from those canonical sources. A nested harness, an external harness, or another repository never lends a source.
- Ordinary runtime and `.ki/bootstrap/` payloads are dereferenced, regular-file copies. In a source harness, only manifest-proven contained links to the canonical material named above may remain; rendered HELP, launchers, aggregate bins, and the manifest stay regular generated files.
- Never create a development link across checkouts. A bootstrap run therefore remains portable after its acquisition source disappears, except for the source harness's deliberately local runtime links.

## Reproducibility contract

Every Knowledge Islands repo carries a `.gitignore` entry for `.claude/skills/`; re-running the copier regenerates the payload from `.ki-config.toml` alone, on any machine. That makes the project-local skill set reproducible without committing generated deployment files. If any declaration no longer resolves, every publisher mode stops before changing payloads and names the roots a human must reconcile.

Wiring `package.json` convenience keys is no concern of the publisher — it manages only runtime payloads and the `.gitignore` line. Any `ki:<suffix>:<verb>` script sugar is `ki-engineering`'s to add later, over the vendored `.ki/bin` runners.

In a source-bearing harness target, the bootstrap audit also compares every direct file-kind audit and conform unit with the matching canonical source in that target's `skills/` tree, byte-for-byte, and requires both sides to be regular files. This is a commit gate: the harness materializes the staged Git index and audits that snapshot, so partially staged or unrelated working-tree bytes cannot hide or manufacture source-copy drift. Generated command wrappers and HELP snapshots remain governed by their render/manifest path rather than this direct-copy comparison. A bootstrapped-only repository has no canonical skill sources in its own tree, so the source-copy criterion is not applicable there.

## Functional areas under `.ki/`

`.ki/bootstrap/checkers/<skill>/` contains only the standalone AUDIT and CONFORM payloads, their reporter dependencies, rubric metadata, and a HELP snapshot. `.ki/bootstrap/educators/<skill>/` is a separate functional area for selected per-skill EDUCATE dispatch: `educate.ts` calls its colocated `educator.ts` module against its copied `skill/` source snapshot. It has no harness-relative import or network operation. `.ki/bootstrap/skills/` retains the selected source catalogue; bootstrap control files and retained agents live alongside it. `./.ki/bin/ki-educate` with no skill refreshes only that retained current governed set; `./.ki/bin/ki-educate <skill>` runs only the matching local educator. Both are mechanical, model-free operations; `/harness/bootstrap` is the explicit acquisition route for a missing or newer harness revision.

## CLEAN recovery

CLEAN is the inverse of publication, not a broad repository clean. Its source-owned entrypoint may remove only manifest-proven generated `.ki/{bin,bootstrap,manifest.json}` state; incomplete, altered, private-transaction, or unfamiliar content is preserved by failing closed. It removes a runtime skill only when it is a regular directory carrying a valid generated marker and matching integrity. It never follows or removes `.ki/self/skill/`, its runtime projection links, an altered payload, an agent, `.ki-config.toml`, `.gitignore`, canonical source, or an unmarked `ki-*` path. It validates the complete selected set before removal and refuses if it changes before deletion. `--dry-run` is byte-stable; a subsequent EDUCATE restores the normal generated footprint.

## Governance agents

A parallel, smaller invariant covers `agents/governance/*.md`: a repo's `.claude/agents/` may contain those files as **relative file symlinks** when the repo's `.ki-config.toml` carries the bare `[ki-agents]` table. Unlike skills there is no baseline: no agent is always-on, so an undeclared repo gets no agent links at all rather than a default subset. `.claude/agents/` is likewise gitignored and regenerated, never committed.
