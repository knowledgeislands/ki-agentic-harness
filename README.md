# arcadia-agentic-harness

The **agentic harness** for Knowledge Islands work — the canonical home for what an agent is equipped with here, kept in one place so the whole set can be versioned, reviewed, and installed together rather than scattered across the bases and projects that use it.

A harness is **four parts** — the things an agent is given to work with:

- **Skills** ([`skills/`](skills/)) — reusable [Agent Skills](https://agentskills.io/specification): the most-built-out part of the harness today (**sixteen**, all governance skills — including `ki-harness`, which governs this four-part container itself, and `ki-bootstrap`, the install keystone). Installed per-repo: `bootstrap` (the one globally-installed skill) wires each repo's project-local `.claude/skills/` from its `.ki-config.toml`. The catalogue is in [docs/skills.md](docs/skills.md); how they fit together — boundaries, the knowledge loops, the shared principles — in [docs/design.md](docs/design.md).
- **Agents** ([`agents/`](agents/)) — Knowledge Islands [Claude Code subagents](https://code.claude.com/docs/en/sub-agents), one per file. Five governance agents live under `agents/governance/` today, governed by the `ki-agents` skill. See [`agents/README.md`](agents/README.md).
- **MCP servers** ([`mcp/`](mcp/)) — where KI's MCP servers would consolidate as workspace packages. An empty **shelf** today; they currently live as separate `mcp-*` repos, governed by the `ki-mcp` skill. See [`mcp/README.md`](mcp/README.md).
- **Evals** ([`evals/`](evals/)) — a behavioural test suite that checks a skill actually _changes what the model does_, not just that its `SKILL.md` is well-formed. A rough signal, not a gate. See [`evals/README.md`](evals/README.md).

All four parts are first-class; skills are simply the most built-out, with agents and the eval suite now populated and `mcp/` still an empty shelf. A skill does not have to be wedded to Knowledge Islands — the repository layout, the install steps, and the linking conventions apply to every kind equally.

## What a skill is

A skill is a directory containing a `SKILL.md` with YAML frontmatter and a markdown body, per the Agent Skills open standard (originated by Anthropic for Claude Code, consumed by Cowork and other agent platforms). Longer detail goes in `references/`, executables in `scripts/`, templates in `assets/` — all loaded on demand (progressive disclosure). Keep `SKILL.md` under ~500 lines / ~5,000 tokens.

```text
<skill-name>/
├── SKILL.md            # required - frontmatter (name, description) + body
├── references/         # optional - long-form detail
├── scripts/            # optional - executable helpers
└── assets/             # optional - templates and resources
```

The directory name **is** the skill's `name`: lowercase, hyphenated, and matching the `name:` frontmatter field exactly. Agents discover a skill by its `name`, so the two must stay in sync.

Skills here fall into a few kinds, and the set will grow:

- **Knowledge Islands skills** — operate over the standard Knowledge Islands knowledge-base structure (see [docs/knowledge-islands.md](docs/knowledge-islands.md)). They carry reusable mode logic and resolve only a few store-level bindings from the host base. The `kb` and `streams` skills are these.
- **Process skills** — encode a workflow or procedure not tied to any particular base (a review process, a release checklist, a research harness).
- **Scoped skills** — target a specific area: a subset of folders, a single project, or one recurring task.

Every skill in the repo today is a **governance skill**: it holds a house standard and ships the universal **AUDIT / CONFORM / REFRESH** modes plus a mechanical checker.

## The map — the skills at a glance

The sixteen skills sit in **two layers** plus a container governor and an install keystone: two cross-cutting **foundations** that every other skill builds on, the **domain** skills that each govern one kind of artifact, `harness` — which governs the four-part bundle holding them all — and `bootstrap`, which wires a repo's project-local skills into place. The arrows are the structural ties (who _delegates to_, _composes on_, or _feeds_ whom), spelled out in [docs/skills.md](docs/skills.md) and [docs/design.md](docs/design.md).

```text
FOUNDATIONS — cross-cutting "how" (every domain skill builds on both)
  authoring     how we WRITE  ·  Markdown + TOML formatting style
  engineering   how we BUILD  ·  the shared toolchain + the enforcement framework
                                       ▲
                                       │ build on
───────────────────────────────────────┼──────────────────────────────────────
                                       │
DOMAIN — what each skill governs
  knowledge bases   kb ──delegates the Streams zone──▶ streams
                    kb ──hands its Admin/ subtrees to──▶ activities · live-artifacts · decision-records
  repos & code      repo ──owns the .ki-config.toml contract──▶ (kb · mcp · engineering consume it)
                    mcp  ──composes its checker on──▶ engineering
  skills & agents   skills ── a SKILL.md (frontmatter + body)   ·   agents ── a subagent definition (the twin)
  websites          11ty-websites ──emits dist/──▶ cloudflare-hosting   (both compose on engineering)
  context budget    tokenomics ──audits the standing surface composed across──▶ (kb · mcp · skills · settings)

CONTAINER — the bundle that holds all the above (this repo is one)
  harness       ──composes the checkers of──▶ (skills · agents · mcp · engineering · repo), adds the bundle-layout delta

INSTALL KEYSTONE — the one skill kept installed globally; wires every other skill into a repo
  bootstrap     ──reads a repo's .ki-config.toml coverage──▶ links its .claude/skills/  (composes on repo)
```

The per-skill detail is in [docs/skills.md](docs/skills.md); [docs/design.md](docs/design.md) draws the boundaries between the pairs that could be confused and shows the process loops that run across them.

## Quick start

```bash
bun install                  # install dev dependencies and wire the git hook
bun run ki:skills:link:global   # install just the keystone into ~/.claude/skills (re-runnable)
bun run ki:skills:link:project  # wire this repo's .claude/skills/ (the harness links --all)
```

Only `ki-bootstrap` is installed globally; every other skill is project-local, wired into each repo's `.claude/skills/` from its `.ki-config.toml` by the keystone. Full install options (the global/project split, plain-shell, verify/remove), how a skill fires once installed, the linking convention, and the development toolchain are in [docs/installation.md](docs/installation.md).

## Documentation

| Doc | What's in it |
| --- | --- |
| [docs/skills.md](docs/skills.md) | The sixteen skills one by one, and the shared governance-skill shape. |
| [docs/design.md](docs/design.md) | How they fit: where they don't overlap, the three knowledge loops, the principles across the set. |
| [docs/knowledge-islands.md][ki-doc] | The Knowledge Islands zone model the KI skills assume, and standard skills & per-base config. |
| [docs/installation.md](docs/installation.md) | Installing · using · linking skills, and the development toolchain. |

## Roadmap

The forward view — what's next and why — lives in [ROADMAP.md](ROADMAP.md). The standards, the mechanical checkers, and the advisory eval harness are all in place, and keeping them applied is a continuous practice (the invariants in [docs/design.md](docs/design.md#principles-across-the-set)), not roadmap work.

[ki-doc]: docs/knowledge-islands.md
