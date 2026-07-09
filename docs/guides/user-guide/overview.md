# What the harness is

A short, plain-language account for a human reader — what this repository is, what it does for its owner, and where to go for detail. The README is the full working reference; this is the one-sitting summary.

## In one paragraph

This repository is a **harness**: a single, versioned bundle of the reusable pieces an AI coding agent needs to do Knowledge Islands work well, kept together instead of scattered. Its centre of gravity is a set of **skills** — packets of standing know-how the agent loads on demand. Most of them are **governance skills**: each one holds a house standard (how we write Markdown, how a repository is laid out, how a knowledge base is structured) and ships the tools to keep work true to that standard.

## What it does for its owner

The harness turns loose conventions into something an agent can apply and check consistently. Each governance skill carries the same three modes:

- **Audit** — read a target (a repository, a document, a knowledge base) and report where it departs from the standard.
- **Conform** — bring the target into line, doing the mechanical fixes automatically.
- **Refresh** — revisit the standard itself against its upstream source, so it does not drift out of date.

Alongside the human-judgement half of each standard, a skill ships a **mechanical checker** — a script that decides the clear-cut cases deterministically, so a review only spends attention on the parts that genuinely need it. The result: standards live in one place as skills, and the checkers keep every repository honest against them over time, rather than the standard living in someone's head and eroding.

## How the parts fit together

The bundle has four parts, plus one install keystone:

- **Skills** (`skills/`) — the twenty governance skills. This is the most built-out part and the reason the harness exists.
- **Agents** (`agents/`) — Knowledge Islands subagent definitions: focused roles an agent can delegate to.
- **MCP servers** (`mcp/`) — a shelf for tool servers that consolidate the workspace's external integrations. Scaffolded, not yet populated.
- **Evals** (`evals/`) — behavioural test scenarios that check the skills actually behave as intended.
- **Bootstrap** (`ki-bootstrap`) — the one skill kept installed globally. Every other skill is installed per-repository; bootstrap reads a repository's own configuration file (`.ki-config.toml`) and wires in exactly the skills that repository has opted into. So each repository self-equips with the right subset, and the harness stays the single source those subsets are drawn from.

The skills are not independent islands. They **compose**: one skill runs a sibling's checker in sequence and adds its own piece, rather than copying it. Two foundation skills — one for how we write, one for how we build — underpin the domain skills above them. A repository declares what it needs differently in its own configuration and prose; it never forks a shared standard.

## Where to go deeper

- The **[README](../../../README.md)** is the full working reference, with the skill map and quick-start commands.
- **[docs/skills.md](skills.md)** describes the twenty skills one by one and the shape they all share.
- **[docs/design.md](design.md)** explains how they fit — where they deliberately do not overlap, the loops by which the standards improve, and the principles common to the set.
- **[docs/installation.md](installation.md)** covers installing, using, and linking the skills, and the development toolchain.
- **[ROADMAP.md](../../../ROADMAP.md)** is the forward view — what is next and why.
