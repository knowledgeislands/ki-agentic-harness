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

## Headroom Learned Patterns

_Auto-generated by `headroom learn` on 2026-06-27 — do not edit manually_

### Audit script limitations

_~900 tokens/session saved_

- `ki-authoring` has **no `scripts/` directory** and no checker script — skip the mechanical checker entirely; proceed directly to judgment using `bun run ki:lint:md:check` and the references in `skills/ki-authoring/references/`.
- `lint-agents.ts` must target `agents/` not `.`: `bun skills/ki-agents/scripts/lint-agents.ts agents/ --json`. Running with `.` scans all repo Markdown and returns 77 spurious FAILs from non-agent files.

### ki-arcadia-principal KB paths

_~600 tokens/session saved_

- The Read tool fails silently (file_not_found) for paths containing spaces, which are common in `ki-arcadia-principal` (e.g. `Territories and Archipelagos/Territories and Archipelagos.md`). Use `Bash cat "path with spaces"` instead — never the Read tool for space-containing KB paths.

### Subagent security constraints

_~400 tokens/session saved_

- Subagent auto-mode blocks reads of `~/.claude.json` and `~/.claude/settings.json` with a "Credential Exploration" error. Do not attempt these in audit or tool subagents. Use project-local `.ki-config.toml` or `.claude/settings.json` within the repo scope for any config lookups.

### Subagent orchestration resilience

- Subagents can die mid-brief on the account **session limit** ("You've hit your session limit"). Resume via `SendMessage` to the **raw agent ID** from the Agent tool result — the assigned `name` can be unreachable after the death. Structure long programmes as **commit-per-deliverable** so an agent death or compaction loses only the in-flight leg.

### GitHub CLI limitations

_~200 tokens/session saved_

- `gh repo view --json` does not accept `topics` as a valid JSON field (returns "Unknown JSON field: topics"). Use `gh api repos/OWNER/REPO --jq '.topics'` to retrieve repository topics.

### Python environment

_~200 tokens/session saved_

- `python3 yaml` (PyYAML) is not installed. Never `import yaml`. Parse YAML/TOML with plain string splitting or `python3 -c "import json,sys; ..."` for JSON output from checkers.

### Large files in skills/

_~8,000 tokens/session saved_

- `skills/ki-kb/SKILL.md` (~500 lines, ~20 KB) and `skills/ki-kb-streams/SKILL.md` (~500 lines, ~20 KB) are the two largest skill files. Read only when working directly on those skills.
- `skills/ki-skills/references/audit-rubric.md` and `skills/ki-skills/references/agent-skills-standard.md` are also large and repeatedly re-read across compactions. Read once, targeted by section (offset/limit or grep for the criterion code); never re-read whole after a compaction unless editing them.
- `README.md` at the harness root is ~30 KB. For structural surveys, prefer `ls` + `cat package.json` + `cat .ki-config.toml` instead.

### Audit script paths

_~1,500 tokens/session saved_

- Run audit scripts from the **harness root** only. Wrong: `bun scripts/audit-repo.ts .` (fails: "Module not found"). Correct: `bun skills/ki-repo/scripts/audit-repo.ts .`
- Cross-repo audits use relative sibling paths: `bun skills/ki-mcp/scripts/audit-mcp.ts ../mcp-gsuite`
- When invoked from a target repo with an absolute harness path: `bun /Users/krisbrown/.claude/skills/ki-mcp/scripts/audit-mcp.ts <target>`

### KB MCP tool limitations

_~1,000 tokens/session saved_

- `kb_note_read` only accepts `.md` files. Attempting to read `.ki-config.toml`, `CLAUDE.md` (protected), or any non-`.md` file errors immediately.
- Use `Bash cat` for `.ki-config.toml` and other config files in KB roots.

### vallearmonia-website path

_~800 tokens/session saved_

- The `vallearmonia-website` repo is at `/Users/krisbrown/kis/vallearmonia/vallearmonia-website/` — **not** under `/Users/krisbrown/kis/knowledgeislands/`.
- Searching inside `knowledgeislands/` for it wastes 3-4 tool calls before the correct location is found.

### ki:lint:md workflow

_~600 tokens/session saved_

- `bun run ki:lint:md` — formatter that **writes/fixes** files (use first).
- `bun run ki:lint:md:check` — CI gate, read-only, exits non-zero on violations (use to verify after fixing).
- Workflow: `ki:lint:md` → fix any residual issues → `ki:lint:md:check` to confirm clean.

### Enactment Process KB path

_~600 tokens/session saved_

- In `ki-arcadia-principal`, the Enactment Process is nested: `Pillars/Knowledge Islands/Model/Processes/Enactment Process/Enactment Process.md` (subfolder, not flat).
- Flat path `Pillars/Knowledge Islands/Model/Processes/Enactment Process.md` does not exist and always 404s.

### ki:skills:lint invocation

_~400 tokens/session saved_

- `bun run ki:skills:lint` uses `skills/` as its default argument. Passing `.` fails with "No skills found (no directory with a SKILL.md)".
- Explicit form from harness root: `bun skills/ki-skills/scripts/lint-skills.ts skills`

### Remote-run transport for TS entry points

_~1,500 tokens/session saved_

- **Bun cannot execute a module over HTTP.** `bun run https://raw.githubusercontent.com/.../script.ts` fails `Module not found` even when the URL returns HTTP 200. To run a harness script remotely, fetch the source **tarball** and run from a local extract: `https://codeload.github.com/<owner>/<repo>/tar.gz/<ref>` is generated on demand for any ref — no release/publish step — so `curl -fsSL "$url" | tar -xz -C "$tmp" --strip-components=1 && bun "$tmp/.../script.ts"`. This is what `bootstrap.sh` and the vendored `ki-init` wrapper do.
- **`bunx github:<owner>/<repo>#<ref> …` works** as a bun-present entry point, but only with (a) a package `bin` field pointing at the script, (b) a pinned **sha or tag** — bunx caches floating git refs, so `#main` serves a stale checkout — and (c) an explicit `--ref` passed to the engine, because a bunx/tarball extract has no `.git` and can't derive the ref to stamp into the manifest itself.
- **A `curl … | sh` entry script runs under `sh`, ignoring its shebang** — so the piped entry point (and anything vendored to run bare on a minimal machine) must be **POSIX `sh`**, not bash: no arrays, `[ … ]` not `[[ … ]]`, `$0` not `${BASH_SOURCE[0]}`. Verify with `sh -n` and `dash -n`. Keep target/ref out of the common command by defaulting (cwd, `main`) and injecting only when absent, then let everything else ripple through to the engine verbatim.

### Parallel background agents and shared-file clobbering

- A background agent testing a skill's `init.ts` — even with an unrecognized flag like `--help` — can trigger a real (non-dry-run) repo-wide vendoring/resync via the ki-bootstrap engine, touching `.ki-meta/*` and several sibling skills' `SKILL.md` `vendors:` lines as a side effect. If that agent then reverts its own accidental mutation (e.g. a broad `git checkout`), the revert can silently clobber concurrent edits from other agents or the main session to those same shared/tracked files — even when each task was believed to only touch independent per-skill files. Before fanning out parallel agents over this repo, use `isolation: "worktree"` for any agent whose task could plausibly invoke `init.ts` or the bootstrap engine, even by accident.
- After a suspected clobbering, `git status --short` + `grep` for the expected content is the fastest way to detect loss; don't trust an agent's self-report of "I reverted only my changes."
- **Edit tool "File has not been read yet" after an external revert:** once a file is externally modified (by another process/agent) after your last cached read, `Edit` refuses until re-read — but the fix must be a `Read` called **immediately before** that specific `Edit`, not a Read from earlier in the conversation (even one shown as "content stale" in this same turn can still leave the subsequent `Edit` rejected). Read-then-Edit as a tight pair, one file at a time, rather than batching reads and edits separately.

<!-- headroom:learn:end -->
