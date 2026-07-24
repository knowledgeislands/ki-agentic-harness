# AGENTS.md — ki-agentic-harness

**This is the common, runtime-neutral orientation** for any agent working in this repo — the [open agents.md standard](https://agents.md/), read directly by Codex and imported by `CLAUDE.md` for Claude Code. Put shared guidance here; keep only genuinely runtime-specific notes in per-runtime files.

The README is the entry point; [the overview](docs/guides/user/overview.md), [skills map](docs/guides/user/skills.md), and [roadmap](ROADMAP.md) supply detail. This file is the short anchor.

## What this repo is

The canonical home for Knowledge Islands [Agent Skills](https://agentskills.io/). Governance skills hold a standard, universal **EDUCATE / AUDIT / CONFORM / REFRESH** modes, and a checker; lightweight process skills drive a lifecycle. The [skills map](docs/guides/user/skills.md) is the authoritative taxonomy and composition graph.

## Five-part bundle status

| Part        | Directory | Status                                                                                                                |
| ----------- | --------- | --------------------------------------------------------------------------------------------------------------------- |
| Skills      | `skills/` | **Populated** — the governance `ki-*` skills                                                                          |
| Agents      | `agents/` | **Populated**† — governance agents in `agents/governance/`                                                            |
| MCP servers | `mcp/`    | **Shelf** — scaffolded, no servers yet                                                                                |
| Evals       | `evals/`  | **Populated (partial)** — scenarios + result matrices in `evals/`                                                     |
| Hooks       | `hooks/`  | **Populated (partial)**† — three global Claude Code hooks (plan lifecycle + stale Git-lock guard) + payload installer |

† Agents and Hooks are Claude-Code-specific today; multi-runtime support (Claude Code + OpenAI Codex CLI) is a targeted future effort — see `SDR-KI-HARNESS-002-runtime-portable-contracts-and-executor-positioning.md` and the [runtime parity scorecard](docs/decisions/references/runtime-parity-scorecard.md).

## How skills relate — composition only

Skills compose rather than extend: a skill runs a sibling's mode in sequence and adds its delta, declaring the edge in AUDIT. Repo variation is declared in `.ki-config.toml` or orientation guidance, never forked into a base-specific skill. See the `ki-skills` rubric (SHAPE-2) and `ADR-KI-HARNESS-SKILLS-004`.

## Working here

- **Cross-repository choreography** — Arcadia Principal, the harness, `tools-ki`, KI Specifications, and the KI Website may add a concrete handoff item to one another's Stream or roadmap. The receiving repository owns its priority, plan, and execution. Record the originating item and whether the handoff `blocks` or is `blocked by` the local item; prefer independently executable work over a blocking dependency.
- **Writing or editing a `SKILL.md`** → follow the `ki-skills` rubric: run `bun run ki:skills:audit` (the mechanical half) and apply the judgment half by reading. The directory name **is** the `name:` frontmatter.
- **Adding a `ki-skills` rubric criterion** → pick the next code number by scanning **both** `skills/keystone/ki-skills/references/rubric.md` **and** `skills/keystone/ki-skills/scripts/audit.ts`. Judgment-only `[J]` codes live in the rubric but never appear in the linter, so the linter's highest code is not the true maximum — trusting it alone risks a collision (e.g. a mechanical `SHAPE-10` clashing with the rubric's existing judgment `SHAPE-10`).
- **Markdown / TOML style** → the `ki-authoring` conventions; `bun run ki:authoring:audit` is the read-only Markdown gate (prettier `--check` + markdownlint) and `ki:authoring:conform` the write pass. Wide tables → footnotes; relative markdown links, never wikilinks; refer to another skill by its `name`, never a file path.
- **The toolchain** (package.json scripts, `tsconfig`, `biome`) → the `ki-engineering` standard, which this repo itself conforms to (`bun run ki:engineering:audit .`).
- A change touching a standard another skill cites is **cross-skill** — keep the set internally consistent (the skills linter's cross-skill pass flags collisions).
- **Recapping a session** (a prompt like "summarise what has happened, what is outstanding, and what lessons could be captured") — a ROADMAP item **added during the session** counts as _what happened_, not as _outstanding_. Parking work on the ROADMAP is a completed action here (the roadmap **is** the durable home for deferred work), so recording it discharges it — do not then re-list it under outstanding. Outstanding means threads left mid-change, unaddressed in the repo: uncommitted edits, a failing gate, a decision still open, work neither done nor parked.
- **Committing** — this is a solo repo pushed straight to `main` with no PR/review gate. For small or trivial changes (docs, polish, single-file fixes), commit directly on `main`; don't create a branch just to fast-forward-merge and delete it. Reserve branches for work that genuinely needs an isolated review boundary. This repo is often dirty with unrelated in-flight work (parallel doc reorganisations, linter reformatting, other uncommitted edits) — stage only the files a given piece of work actually changed, by explicit path, never a blanket add. The pre-commit hook runs `lint-staged`, then the governance audits gated on what is staged (`ki:decision-records:audit` for `docs/decisions/`, `ki:skills:audit` plus `ki:bootstrap:audit` for `skills/`, `ki:bootstrap:audit` for `.ki/bootstrap/checkers/`, `ki:agents:audit` for `agents/`); a new ADR needs a corresponding row in `docs/decisions/README.md` (rubric code `INDEX-2`) or the commit is blocked.
- **Re-vendoring `.ki/`** — an ordinary repository runs vendored checker copies, so after changing a coverage-scoped checker re-run `bun skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts .` (never `--all`) before testing. This source harness has manifest-proven live links for direct checker units: run `bun run ki:bootstrap:audit` after a source change, and re-bootstrap only when generated bootstrap material (HELP, launcher, aggregate bin, or manifest) changes. The [onboarding guide](docs/guides/user/onboarding.md) covers the model and recovery details.
- **Current-state migrations** — make the contract correct for the current repository, then make every existing footprint conform to it. Do not retain legacy switches, compatibility shims, fallbacks, or dual paths unless the user explicitly requests a transition period.
- **Progress and history** — for sustained work, give concise progress updates at meaningful checkpoints and at least every few minutes; state the active plan or unit, what is complete, and the next gate. After each independently verified, sensible unit of work, make an explicit-path commit so the repository remains recoverable and the history explains the change. Do not wait for an entire multi-step roadmap item before committing its completed units.
- **Non-scoped skills** — skills absent from `.ki-config.toml` are not vendored and their checker changes are live; run their script directly. `ki:skills:audit` and `bun run test` still cover every shipped skill.
- **`docs/guides/user/skills.md` embeds the generated `ki:skills:graph --tree` block** — `bun run test` compares its marked region with the live graph and fails on drift. When you add/remove a skill or change a `ki-depends-on:` edge, regenerate it with `bun run ki:skills:graph` and replace the whole marked block; don't hand-edit just your node.
- **Verification gates** — run `bun run test` and `bun run ki:audit` sequentially. Concurrent runs can cause transient, non-reproducible TypeScript/checker failures; re-run serially before investigating.

## Toolchain

[Bun](https://bun.sh) for install/dev; `bun install` wires the husky pre-commit hook.

The read-only gate is the aggregate `ki:audit`; the write pass is `ki:conform`. Both fan out over the vendored per-skill modes in `.ki/` (coverage-scoped to `.ki-config.toml`). The per-tool `ki:lint:*` / `ki:deps:*` / `ki:knip` / `ki:verify` keys are retired (ADR-KI-HARNESS-TOOLCHAIN-001) — the tools live **inside** `ki-engineering`'s audit (biome + tsc + knip + syncpack) and `ki-authoring`'s (the Markdown gate).

```bash
bun run ki:audit                 # read-only gate CI runs (aggregate over vendored per-skill audits)
bun run ki:conform               # write pass: every skill's mechanical fixes (aggregate)
bun run test                     # the harness self-tests (checker *.test.ts + graph/help/bootstrap integrity)
bun run ki:engineering:audit     # the TS/Bun toolchain checks alone (biome + tsc + knip + syncpack)
bun run ki:authoring:audit       # the Markdown gate alone (prettier --check + markdownlint)
bun run ki:skills:audit          # audit every skill's mechanical criteria
```

Install/link paths are runtime-specific — see `CLAUDE.md` for Claude Code (`~/.claude/skills`, `.claude/agents`) and the [runtime parity scorecard](docs/decisions/references/runtime-parity-scorecard.md) for how Codex differs (`.agents/skills`, `~/.codex/`).
