# What the harness is

A short, plain-language guide to what this repository is, what it does for its owner, and where to go for detail.

## Introduction

An agentic harness is everything around an agent that helps it do a job well. Like a capable person, an agent needs tools to act, knowledge and training to use them, and guardrails that keep work safe and consistent. This harness brings those things together: tools and automation let an agent act; skills and specialist agents provide reusable knowledge and ways of working; and governance checks make good practice repeatable. Keeping them together gives each project a dependable working environment rather than a collection of unrelated prompts and scripts.

## What this harness does for its owner

The harness turns loose conventions into something an agent can apply and check consistently. A skill usually combines guidance with the practical checks or actions that put it to work. Governance skills share four modes:

- **Educate (`INIT`)** — give a target the knowledge, checkers, and commands it needs to govern itself. Run it to establish that foundation or bring it up to date.
- **Audit** — read a target (a repository, a document, a knowledge base) and report where it departs from the standard.
- **Conform** — bring the target into line, doing the mechanical fixes automatically.
- **Refresh** — revisit the standard itself against its upstream source, so it stays relevant.

Each skill ships a **mechanical checker** — a script that decides the clear-cut cases deterministically, so an agent review only spends attention on the parts that genuinely need it. The result: standards live in one place as skills, and the checkers keep every repository honest against them over time, rather than the standard living in someone's head and eroding.

This reflects the harness's central working principle: it serves **two kinds of agent — human and LLM** — and its work splits into **mechanical** (a script can decide it) and **judgemental** (an agent must weigh it). The mechanical layer always stands alone: every governed repository, whatever its kind, carries a way to run its own checks (`./.ki-meta/bin/ki-audit`) with no model and no skills installed. Agent judgment — from either kind of agent — is a layer added on top of that baseline, never a requirement for it. The full statement is `ADR-KI-HARNESS-003`.

That matters because a harness does more than make agents faster. It gives people and AI systems access to accumulated knowledge, practical methods, and boundaries that help them use powerful tools well. A hammer can build a home or cause harm; the tool matters, but the education, judgment, and conditions around its use matter just as much. Used thoughtlessly, AI can deskill us and amplify poor decisions. Used deliberately, with shared knowledge and guardrails, it can help more people do capable, constructive work — and improve the quality of what we make together.

## How the parts fit together

The bundle has five parts, each with a different job:

- **Skills** (`skills/`) — reusable knowledge, working methods, and governance checks. This is the most built-out part and the reason the harness exists.
- **Agents** (`agents/`) — focused specialist roles an agent can delegate to.
- **MCP servers** (`mcp/`) — the tool surface an agent uses to act on external systems. It is a scaffolded shelf here; KI's servers currently live in separate repositories.
- **Evals** (`evals/`) — practical scenarios that check the skills change behaviour as intended.
- **Hooks** (`hooks/`) — optional automation around a Claude Code session, such as Plan Mode lifecycle and stale Git-lock recovery.

The five are meant to be co-installed and versioned together: the skills carry the standards, the agents are the roles that apply them, the MCP servers are the tools those roles reach for, the evals hold the whole set honest, and the hooks automate the surrounding session. Shipping them in one bundle keeps them in step — an agent, its skills, and their checks move as a unit rather than drifting apart across separate installs.

The skills are designed to build on each other rather than repeat each other. Where two standards overlap, the more specific skill calls the more general one's checker and adds only its own extra rules on top — so a rule is written down once and reused, never copied and left to drift out of sync. Two general **foundation skills** sit underneath the rest this way: one for how we write (Markdown, config), one for how we build (the toolchain). Every more specialised skill leans on those two instead of restating them.

When a repository genuinely needs something different from the shared standard, it says so in its own `.ki-config.toml` and its own `CLAUDE.md` — a local exception the skills read and respect. It never copies a skill and edits the copy. That keeps one authoritative version of each standard, with per-repository differences recorded as data rather than as diverging forks.

## Repository and user environment

The harness works at two deliberately separate scopes. **Repository bootstrap** gives one repository the checks and guidance it needs to govern itself; it creates the repository's durable `.ki-meta/` machinery and does not change a person's wider machine setup. **User-environment installation** is optional and affects a person's home directory instead — for example, a durable Claude Code hook payload that a chezmoi-managed environment can register in Claude settings. Keeping the two scopes separate makes it clear what a command will change.

## What "Knowledge Islands" means

Several of the skills are built for **Knowledge Islands** work and take its shape as given. A Knowledge Islands base is a single Markdown store organised into five fixed zones — `Calendar`, `Pillars`, `Resources`, `Streams`, and `Admin` — flanked by an inbound (`+`) and an outbound (`-`) staging area. The whole base is an "island"; within it a **Pillar** is a major strand of subject matter — a case, a client, a domain, a theme. The skills assume this structure rather than redefining it, so a base supplies only a few local bindings. For the idea in full, see [knowledgeislands.info](https://knowledgeislands.info).

## Where to go deeper

- **[Install and get started](installation.md)** covers optional machine tools, repository bootstrap, and the separate hook-payload installer.
- **[Use skills](using-skills.md)** covers how a skill fires — by plain-language request or slash command.
- **[Recommended tools](recommended-tools.md)** explains optional machine-level tools such as chezmoi, headroom-ai, and mcporter.
- **[Tuning](tuning.md)** covers making a session lean — the standing surface vs runtime split, which built-in tools and MCP servers to load, and where a compression proxy does and does not help.
- **[Bootstrap reference](onboarding.md)** explains what repository bootstrap creates, its fleet and local forms, the day-to-day bins, and keeping a repository current.
- **[Skills](skills.md)** covers what a skill is, the six clusters, and the shape they all share; the **[skill catalogue](skill-catalogue.md)** then describes them one by one.
