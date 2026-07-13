# CLAUDE.md — ki-agentic-harness

Always-loaded orientation for an agent working in this repo. The README is the entry point; for a short, human-first summary of what the harness is and does, [docs/overview.md](docs/guides/user-guide/overview.md) is the plainest starting point. The full picture is in the [docs/](docs) the README indexes — what each skill is, the map, the boundaries. The forward view is in [ROADMAP.md](ROADMAP.md). This file is the short anchor.

## What this repo is

The canonical home for the Knowledge Islands **Agent Skills** (per the [Agent Skills standard](https://agentskills.io/)). Skills have two **kinds** ([ADR-KI-HARNESS-SKILLS-006](docs/decisions/ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md)). Most are **governance skills**: each holds a house standard and ships the universal **INIT / AUDIT / CONFORM / REFRESH** modes plus a mechanical checker. They sit in six clusters — the install **keystone** (`ki-bootstrap`, which pulls `ki-repo`); structure-independent **foundations** (`ki-authoring`, `ki-engineering`); **repo-structure** skills, exactly one per repo (`ki-harness`, `ki-kb`, `ki-website`, `ki-mcp`, `ki-plugins`, `ki-tools`, `ki-homebrew-tap`); **general governance** (`ki-skills`, `ki-agents`, `ki-decision-records`, `ki-feature-definitions`, `ki-plans`, `ki-handoffs`); **implied families** (the `ki-kb-*` and `ki-website-*` members their parent pulls in); and **environment** skills that govern the machine, not a repo (`ki-binding`, `ki-housekeeping`, `ki-tokenomics`). A smaller set are **process skills** — lightweight, drive an action or lifecycle rather than holding a standard, exempt from the four-file shape and universal modes: `ki-recap` (live-session summarise / surface-outstanding / harvest-learnings, with an optional compress leg) and `ki-plan` (the plan lifecycle, paired with the governance skill `ki-plans`). The taxonomy and the generated map are in [docs/skills.md](docs/guides/user-guide/skills.md).

## Five-part bundle status

| Part | Directory | Status |
| --- | --- | --- |
| Skills | `skills/` | **Populated** — the governance `ki-*` skills |
| Agents | `agents/` | **Populated**† — governance agents in `agents/governance/` |
| MCP servers | `mcp/` | **Shelf** — scaffolded, no servers yet |
| Evals | `evals/` | **Populated (partial)** — scenarios + result matrices in `evals/` |
| Hooks | `hooks/` | **Populated (partial)**† — plan-file lifecycle pair (`hooks/plan-stamp.sh`, `hooks/plan-sync.sh`) + `ki:hooks:link:global` |

† Agents and Hooks are Claude-Code-specific today; multi-runtime support (Claude Code + OpenAI Codex CLI) is a targeted future effort — see `SDR-KI-HARNESS-002-runtime-portable-contracts.md`.

## How skills relate — composition only

Skills relate to one another by **composition**, never a base-coupled extension: a skill runs a sibling's checker/mode **in sequence** and adds its own delta (it never imports another, so each stays valid installed standalone), and **declares the edge** in its AUDIT mode. What a base or repo needs differently is **declared, not forked** — data in its `.ki-config.toml` table (read validate-down), prose in its `CLAUDE.md` — never a `<base>-*` skill that takes the shared modes. See the `ki-skills` rubric (SHAPE-2) and `ADR-KI-HARNESS-SKILLS-004`.

## Working here

- **Writing or editing a `SKILL.md`** → follow the `ki-skills` rubric: run `bun run ki:skills:audit` (the mechanical half) and apply the judgment half by reading. The directory name **is** the `name:` frontmatter.
- **Adding a `ki-skills` rubric criterion** → pick the next code number by scanning **both** `skills/general-governance/ki-skills/references/audit-rubric.md` **and** `skills/general-governance/ki-skills/scripts/audit.ts`. Judgment-only `[J]` codes live in the rubric but never appear in the linter, so the linter's highest code is not the true maximum — trusting it alone risks a collision (e.g. a mechanical `SHAPE-10` clashing with the rubric's existing judgment `SHAPE-10`).
- **Markdown / TOML style** → the `ki-authoring` conventions; `bun run ki:authoring:audit` is the read-only Markdown gate (prettier `--check` + markdownlint) and `ki:authoring:conform` the write pass. Wide tables → footnotes; relative markdown links, never wikilinks; refer to another skill by its `name`, never a file path.
- **The toolchain** (package.json scripts, `tsconfig`, `biome`) → the `ki-engineering` standard, which this repo itself conforms to (`bun run ki:engineering:audit .`).
- A change touching a standard another skill cites is **cross-skill** — keep the set internally consistent (the skills linter's cross-skill pass flags collisions).
- **Recapping a session** (a prompt like "summarise what has happened, what is outstanding, and what lessons could be captured") — a ROADMAP item **added during the session** counts as _what happened_, not as _outstanding_. Parking work on the ROADMAP is a completed action here (the roadmap **is** the durable home for deferred work), so recording it discharges it — do not then re-list it under outstanding. Outstanding means threads left mid-change, unaddressed in the repo: uncommitted edits, a failing gate, a decision still open, work neither done nor parked.
- **Committing** — this is a solo repo pushed straight to `main` with no PR/review gate. For small or trivial changes (docs, polish, single-file fixes), commit directly on `main`; don't create a branch just to fast-forward-merge and delete it. Reserve branches for work that genuinely needs an isolated review boundary. This repo is often dirty with unrelated in-flight work (parallel doc reorganisations, linter reformatting, other uncommitted edits) — stage only the files a given piece of work actually changed, by explicit path, never a blanket add. The pre-commit hook runs `lint-staged`, then the governance audits gated on what is staged (`ki:decision-records:audit` for `docs/decisions/`, `ki:skills:audit` for `skills/`, `ki:agents:audit` for `agents/`); a new ADR needs a corresponding row in `docs/decisions/README.md` (rubric code `INDEX-2`) or the commit is blocked.
- **Re-vendoring `.ki-meta/`** — the `ki:*:audit`/`conform` package.json keys run the **vendored** `.ki-meta/skills/<skill>/{audit,conform}.ts` copies, **not** your edited `skills/*/scripts/*.ts` source. So after editing a canonical checker you MUST re-bootstrap before the change takes effect through those keys or the aggregate `ki:audit` — otherwise you debug a checker whose vendored copy is stale (a failure that looks persistent no matter how you edit the source). Re-vendor with `bun skills/keystone/ki-bootstrap/scripts/bootstrap.ts .` (coverage-scoped — the harness's declared 12 skills); **not** `--all`, which over-vendors every skill and reintroduces the non-applicable-audit noise coverage-scoping exists to avoid. `ki:bootstrap:audit` (BOOT-9) is **set-based** — vendored skill names/count, not content — so it will not tell you a vendored checker is stale. If a re-vendor explodes the diff, recover with `git checkout -- .ki-meta/ && git clean -fd .ki-meta/`. Note the engine stamps `.ki-meta/bin/ki-init` + `manifest.json` with the current HEAD ref, so those two always show a one-commit-behind diff after a commit — expected, not drift. A re-vendor may also true up vendored copies of skills you didn't touch (e.g. lint-staged reformatted their sources after the last vendor) — benign; include those hunks in the commit rather than leaving `.ki-meta` dirty to reappear on every re-vendor. **Two adjacent traps when the tree is shared/dirty.** (1) _Others' **uncommitted** source pollutes your vendor:_ a re-vendor copies the working-tree source, so a sibling's dirty `skills/<other>/scripts/*.ts` lands in your `.ki-meta` — and because `manifest.json` is one file hashing every vendored copy, you can't cleanly stage a subset. Isolate: `git stash push -- <their dirty sources>`, `git checkout HEAD -- .ki-meta/`, re-vendor, stage only your paths + the now-clean `.ki-meta` delta, commit, `git stash pop`. (2) _lint-staged stale-vendors **your own** checker:_ the pre-commit reformatter rewrites your edited `skills/<skill>/scripts/audit.ts` but not its already-staged vendored `.ki-meta` copy, so the commit ships `source ≠ vendored`. BOOT-9 is set-based and won't catch it. Guard by biome-formatting canonical checkers _before_ re-vendoring (so the copy is born clean), or after committing verify `sha256(source) == sha256(vendored)` and, if not, re-vendor from the reformatted source and `git commit --amend`.
- **Not every shipped skill is coverage-scoped** — some skills live in `skills/` (authored/governed _here_) but are **not** declared in this repo's `.ki-config.toml`, because the harness is not governed _by_ them (e.g. `ki-binding`, `ki-dotfiles-chezmoi`, `ki-binding-chezmoi`). Consequence: they get **no `.ki-meta` vendoring and no `ki:<skill>:audit`/`conform` package.json key** in this repo — so editing their `scripts/*.ts` is **live immediately (no re-vendor)**, and there is no per-skill key to run them; invoke them directly (`bun skills/<skill>/scripts/audit.ts`) or, for a vendored composition like `ki-decision-records`, via `.ki-meta`. But `ki:skills:audit` and `bun run test` (`skill-graph`/`skill-help --check`) **still walk every `skills/` dir**, so a non-scoped skill must fully pass the `ki-skills` rubric + graph/help integrity regardless. Don't hunt for a vendored copy or a `ki:*` key that doesn't exist.
- **`docs/guides/user-guide/skills.md` embeds a hand-pasted `ki:skills:graph --tree` block that no gate checks** — it silently goes stale (it had drifted to omit several skills). When you add/remove a skill or change an `implies:` edge, regenerate it with `bun run ki:skills:graph` and replace the fenced block; don't hand-edit just your node. (A mechanical check that the pasted block matches the command output is a ROADMAP candidate.)

## Toolchain

[Bun](https://bun.sh) for install/dev; `bun install` wires the husky pre-commit hook.

The read-only gate is the aggregate `ki:audit`; the write pass is `ki:conform`. Both fan out over the vendored per-skill modes in `.ki-meta/` (coverage-scoped to `.ki-config.toml`). The per-tool `ki:lint:*` / `ki:deps:*` / `ki:knip` / `ki:verify` keys are retired (ADR-KI-HARNESS-TOOLCHAIN-001) — the tools live **inside** `ki-engineering`'s audit (biome + tsc + knip + syncpack) and `ki-authoring`'s (the Markdown gate).

```bash
bun run ki:audit                 # read-only gate CI runs (aggregate over vendored per-skill audits)
bun run ki:conform               # write pass: every skill's mechanical fixes (aggregate)
bun run test                     # the harness self-tests (checker *.test.ts + graph/help/bootstrap integrity)
bun run ki:engineering:audit     # the TS/Bun toolchain checks alone (biome + tsc + knip + syncpack)
bun run ki:authoring:audit       # the Markdown gate alone (prettier --check + markdownlint)
bun run ki:skills:audit          # audit every skill's mechanical criteria
bun run ki:skills:link:global    # install the bootstrap keystone into ~/.claude/skills
bun run ki:skills:link:project   # wire this repo's project-local skills from .ki-config.toml (--all here)
```

<!-- headroom:learn:start -->

<!-- headroom:learn:end -->
