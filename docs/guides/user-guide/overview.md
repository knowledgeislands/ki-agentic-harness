# What the harness is

A short, plain-language guide to what this repository is, what it does for its owner, and where to go for detail.

## In one paragraph

This repository is a **harness**: a single, versioned bundle of the reusable pieces an agent needs to do Knowledge Islands work well, kept together instead of scattered. Its centre of gravity is a set of **skills** — packets of standing know-how the agent loads on demand. Most of them are **governance skills**: each one holds a house standard (how we write Markdown, how a repository is laid out, how a knowledge base is structured) and ships the tools to keep work true to that standard.

## What it does for its owner

The harness turns loose conventions into something an agent can apply and check consistently. Each governance skill carries the same four modes:

- **Init** — bring a target under governance for the first time: vendor the checkers and wire the commands so the repo can govern itself.
- **Audit** — read a target (a repository, a document, a knowledge base) and report where it departs from the standard.
- **Conform** — bring the target into line, doing the mechanical fixes automatically.
- **Refresh** — revisit the standard itself against its upstream source, so it stays relevant.

Each skill ships a **mechanical checker** — a script that decides the clear-cut cases deterministically, so an agent review only spends attention on the parts that genuinely need it. The result: standards live in one place as skills, and the checkers keep every repository honest against them over time, rather than the standard living in someone's head and eroding.

## How the parts fit together

The bundle has five parts, each its own directory:

- **Skills** (`skills/`) — the governance skills. This is the most built-out part and the reason the harness exists.
- **Agents** (`agents/`) — Knowledge Islands subagent definitions: focused roles an agent can delegate to.
- **MCP servers** (`mcp/`) — a shelf for tool servers that consolidate the workspace's external integrations. Scaffolded, not yet populated.
- **Evals** (`evals/`) — behavioural test scenarios that check the skills actually behave as intended.
- **Hooks** (`hooks/`) — Claude Code hook scripts wired into a repo's `.claude/settings.json`. An empty shelf today, reserving the structure ahead of the harness shipping hooks.

The five are meant to be co-installed and versioned together: the skills carry the standards, the agents are the roles that apply them, the MCP servers are the tools those roles reach for, the evals hold the whole set honest, and the hooks automate the surrounding session. Shipping them in one bundle keeps them in step — an agent, its skills, and their checks move as a unit rather than drifting apart across separate installs.

The skills are designed to build on each other rather than repeat each other. Where two standards overlap, the more specific skill calls the more general one's checker and adds only its own extra rules on top — so a rule is written down once and reused, never copied and left to drift out of sync. Two general **foundation skills** sit underneath the rest this way: one for how we write (Markdown, config), one for how we build (the toolchain). Every more specialised skill leans on those two instead of restating them.

When a repository genuinely needs something different from the shared standard, it says so in its own `.ki-config.toml` and its own `CLAUDE.md` — a local exception the skills read and respect. It never copies a skill and edits the copy. That keeps one authoritative version of each standard, with per-repository differences recorded as data rather than as diverging forks.

## The bootstrap keystone

One skill sits apart from the five parts: **`ki-bootstrap`**, the one skill kept installed globally. Every other skill is installed per-repository. Bootstrap reads a repository's own configuration file (`.ki-config.toml`) and wires in exactly the skills that repository has opted into — so each repository self-equips with the right subset, and the harness stays the single source those subsets are drawn from.

## What "Knowledge Islands" means

Several of the skills are built for **Knowledge Islands** work and take its shape as given. A Knowledge Islands base is a single Markdown store organised into five fixed zones — `Calendar`, `Pillars`, `Resources`, `Streams`, and `Admin` — flanked by an inbound (`+`) and an outbound (`-`) staging area. The whole base is an "island"; within it a **Pillar** is a major strand of subject matter — a case, a client, a domain, a theme. The skills assume this structure rather than redefining it, so a base supplies only a few local bindings. For the idea in full, see [knowledgeislands.info](https://knowledgeislands.info).

## Where to go deeper

- **[Installation](installation.md)** covers installing, using, and linking the skills, and the development toolchain.
- **[Onboarding](onboarding.md)** walks through bringing a repository under governance: the bootstrap chain, the four modes, and the greenfield / legacy / remote-run flows.
- **[Skills](skills.md)** covers what a skill is, the six clusters, and the shape they all share; the **[skill catalogue](skill-catalogue.md)** then describes them one by one.
- **[Skill design](skill-design.md)** explains how they fit — where they deliberately do not overlap, the loops by which the standards improve, and the principles common to the set.
