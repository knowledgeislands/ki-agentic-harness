# CLAUDE.md — ki-agentic-harness

Always-loaded orientation for an agent working in this repo. The README is the entry point; for a short, human-first summary of what the harness is and does, [docs/overview.md](docs/guides/user-guide/overview.md) is the plainest starting point. The full picture is in the [docs/](docs) the README indexes — what each skill is, the map, the boundaries. The forward view is in [ROADMAP.md](ROADMAP.md). This file is the short anchor.

## What this repo is

The canonical home for the Knowledge Islands **Agent Skills** (per the [Agent Skills standard](https://agentskills.io/)). Skills have two **kinds** ([ADR-KI-HARNESS-SKILLS-006](docs/decisions/ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md)). Most are **governance skills**: each holds a house standard and ships the universal **INIT / AUDIT / CONFORM / REFRESH** modes plus a mechanical checker. They sit in six clusters — the install **keystone** (`ki-bootstrap`, which pulls `ki-repo`); structure-independent **foundations** (`ki-authoring`, `ki-engineering`); **repo-structure** skills, exactly one per repo (`ki-harness`, `ki-kb`, `ki-website`, `ki-mcp`, `ki-plugins`, `ki-tools`, `ki-homebrew-tap`); **general governance** (`ki-skills`, `ki-agents`, `ki-decision-records`, `ki-feature-definitions`, `ki-plans`, `ki-handoffs`); **implied families** (the `ki-kb-*` and `ki-website-*` members their parent pulls in); and **environment** skills that govern the machine, not a repo (`ki-binding`, `ki-housekeeping`, `ki-tokenomics`). A smaller set are **process skills** — lightweight, drive an action or lifecycle rather than holding a standard, exempt from the four-file shape and universal modes: `ki-recap` (live-session summarise / surface-outstanding / harvest-learnings, with an optional compress leg) and `ki-plan` (the plan lifecycle, paired with the governance skill `ki-plans`). The taxonomy and the generated map are in [docs/skills.md](docs/guides/user-guide/skills.md).

## Five-part bundle status

| Part        | Directory | Status                                                            |
| ----------- | --------- | ----------------------------------------------------------------- |
| Skills      | `skills/` | **Populated** — the governance `ki-*` skills                      |
| Agents      | `agents/` | **Populated** — governance agents in `agents/governance/`         |
| MCP servers | `mcp/`    | **Shelf** — scaffolded, no servers yet                            |
| Evals       | `evals/`  | **Populated (partial)** — scenarios + result matrices in `evals/` |
| Hooks       | `hooks/`  | **Shelf** — scaffolded, no hooks yet                              |

## How skills relate — composition only

Skills relate to one another by **composition**, never a base-coupled extension: a skill runs a sibling's checker/mode **in sequence** and adds its own delta (it never imports another, so each stays valid installed standalone), and **declares the edge** in its AUDIT mode. What a base or repo needs differently is **declared, not forked** — data in its `.ki-config.toml` table (read validate-down), prose in its `CLAUDE.md` — never a `<base>-*` skill that takes the shared modes. See the _Composition only_ principle in [docs/skill-design.md](docs/guides/user-guide/skill-design.md) and the `ki-skills` rubric (SHAPE-2).

## Working here

- **Writing or editing a `SKILL.md`** → follow the `ki-skills` rubric: run `bun run ki:skills:lint` (the mechanical half) and apply the judgment half by reading. The directory name **is** the `name:` frontmatter.
- **Adding a `ki-skills` rubric criterion** → pick the next code number by scanning **both** `skills/ki-skills/references/audit-rubric.md` **and** `skills/ki-skills/scripts/lint-skills.ts`. Judgment-only `[J]` codes live in the rubric but never appear in the linter, so the linter's highest code is not the true maximum — trusting it alone risks a collision (e.g. a mechanical `SHAPE-10` clashing with the rubric's existing judgment `SHAPE-10`).
- **Markdown / TOML style** → the `ki-authoring` conventions; `bun run ki:lint:md` is the mechanical gate. Wide tables → footnotes; relative markdown links, never wikilinks; refer to another skill by its `name`, never a file path.
- **The toolchain** (package.json scripts, `tsconfig`, `biome`) → the `ki-engineering` standard, which this repo itself conforms to (`bun run ki:engineering:audit .`).
- A change touching a standard another skill cites is **cross-skill** — keep the set internally consistent (the skills linter's cross-skill pass flags collisions).
- **Recapping a session** (a prompt like "summarise what has happened, what is outstanding, and what lessons could be captured") — a ROADMAP item **added during the session** counts as _what happened_, not as _outstanding_. Parking work on the ROADMAP is a completed action here (the roadmap **is** the durable home for deferred work), so recording it discharges it — do not then re-list it under outstanding. Outstanding means threads left mid-change, unaddressed in the repo: uncommitted edits, a failing gate, a decision still open, work neither done nor parked.
- **Committing** — this is a solo repo pushed straight to `main` with no PR/review gate. For small or trivial changes (docs, polish, single-file fixes), commit directly on `main`; don't create a branch just to fast-forward-merge and delete it. Reserve branches for work that genuinely needs an isolated review boundary.
- **Re-vendoring `.ki-meta/`** — don't reach for `bun skills/ki-bootstrap/scripts/bootstrap.ts . --all` to refresh a vendored checker copy after editing a canonical `skills/*/scripts/*.ts`. The current engine regenerates a broad set of never-committed artifacts (`help.md`, `conform.ts`, extra `bin/` wrappers, `manifest.json`) from pre-existing engine-version drift — far beyond the file you changed. `ki:bootstrap:audit` (BOOT-9) is **set-based** — it checks vendored skill names/count, not content — so it will not tell you a vendored checker is stale. If a stray `--all` run explodes the diff, recover with `git checkout -- .ki-meta/ && git clean -fd .ki-meta/`. A faithful resync is the deliberate re-bootstrap tracked on the ROADMAP (_Reconcile the harness's own `.ki-meta/`_), not an incidental step in an unrelated change.

## Toolchain

[Bun](https://bun.sh) for install/dev; `bun install` wires the husky pre-commit hook.

```bash
bun run ki:conform        # write pass: bring the repo into mechanical conformance (update → format → fix → md)
bun run ki:verify         # read-only gate: the exact checks CI runs (lint:check + lint:types + lint:md:check)
bun run ki:lint:check     # Biome (TypeScript + JSON)
bun run ki:lint:types     # tsc --noEmit
bun run ki:lint:md        # Prettier + markdownlint over Markdown (writes)
bun run ki:lint:md:check  # the check-mode twin (the CI Markdown gate)
bun run ki:skills:lint           # audit every skill's mechanical criteria
bun run ki:skills:link:global    # install the bootstrap keystone into ~/.claude/skills
bun run ki:skills:link:project   # wire this repo's project-local skills from .ki-config.toml (--all here)
```

<!-- headroom:learn:start -->

<!-- headroom:learn:end -->
