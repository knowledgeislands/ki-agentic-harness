# ki-agentic-harness

The **agentic harness** for Knowledge Islands work — the canonical home for what an agent is equipped with here, kept in one place so the whole set can be versioned, reviewed, and installed together rather than scattered across the bases and projects that use it.

A harness is **four parts** — the things an agent is given to work with:

- **Skills** ([`skills/`](skills)) — reusable [Agent Skills](https://agentskills.io/specification): the most-built-out part of the harness today, all governance skills — including `ki-harness`, which governs this four-part container itself, and `ki-bootstrap`, the install keystone. Installed per-repo: `bootstrap` (the one globally-installed skill) wires each repo's project-local `.claude/skills/` from its `.ki-config.toml`. What a skill is and the map of the set are in [docs/skills.md](docs/guides/user-guide/skills.md); the per-skill catalogue in [docs/skill-catalogue.md](docs/guides/user-guide/skill-catalogue.md); how they fit together — boundaries, the knowledge loops, the shared principles — in [docs/skill-design.md](docs/guides/user-guide/skill-design.md).
- **Agents** ([`agents/`](agents)) — Knowledge Islands [Claude Code subagents](https://code.claude.com/docs/en/sub-agents), one per file. Governance agents live under `agents/governance/`, governed by the `ki-agents` skill. See [`agents/README.md`](agents/README.md).
- **MCP servers** ([`mcp/`](mcp)) — where KI's MCP servers would consolidate as workspace packages. An empty **shelf** today; they currently live as separate `mcp-*` repos, governed by the `ki-mcp` skill. See [`mcp/README.md`](mcp/README.md).
- **Evals** ([`evals/`](evals)) — a behavioural test suite that checks a skill actually _changes what the model does_, not just that its `SKILL.md` is well-formed. A rough signal, not a gate. See [`evals/README.md`](evals/README.md).

All four parts are first-class; skills are simply the most built-out, with agents and the eval suite now populated and `mcp/` still an empty shelf. A skill does not have to be wedded to Knowledge Islands — the repository layout, the install steps, and the linking conventions apply to every kind equally.

## Quick start

```bash
bun install                     # install dev dependencies and wire the git hook
bun run ki:skills:link:global   # install just the keystone into ~/.claude/skills (re-runnable)
bun run ki:skills:link:project  # wire this repo's .claude/skills/ (the harness links --all)
```

Only `ki-bootstrap` is installed globally; every other skill is project-local, wired into each repo's `.claude/skills/` from its `.ki-config.toml` by the keystone. Full install options (the global/project split, plain-shell, verify/remove), how a skill fires once installed, the linking convention, and the development toolchain are in [docs/installation.md](docs/guides/user-guide/installation.md).

## Documentation

| Doc | What's in it |
| --- | --- |
| [Overview](docs/guides/user-guide/overview.md) | A short account: what the harness is, what it does for its owner, how the parts fit. |
| [Skills](docs/guides/user-guide/skills.md) | What a skill is, the map of the set (the six clusters and their interdependencies), and the shared governance-skill shape. |
| [Skill catalogue](docs/guides/user-guide/skill-catalogue.md) | Every skill, one by one, grouped by cluster — what each governs and its mechanical checker. |
| [Onboarding](docs/guides/user-guide/onboarding.md) | Onboarding a repo: the bootstrap chain, the four modes, and the greenfield / legacy / remote-run flows. |
| [Skill design](docs/guides/user-guide/skill-design.md) | How they fit: where they don't overlap, the three knowledge loops, the principles across the set. |
| [Installation](docs/guides/user-guide/installation.md) | Installing · using · linking skills, and the development toolchain. |

The user guide is self-contained. For how it relates to the decisions, feature definitions, plans, and skill code underneath it — and to the Knowledge Islands concept — see [docs/docs.md](docs/docs.md).

## Roadmap

The forward view — what's next and why — lives in [ROADMAP.md](ROADMAP.md). The standards, the mechanical checkers, and the advisory eval harness are all in place, and keeping them applied is a continuous practice (the invariants in [docs/skill-design.md](docs/guides/user-guide/skill-design.md#principles-across-the-set)), not roadmap work.
