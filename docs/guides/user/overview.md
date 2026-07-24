# What the harness is

A short, plain-language guide to what this repository is, what it does for its owner, and where to go for detail.

## Introduction

An agentic harness is everything around an agent that helps it do a job well. Like a capable person, an agent needs tools to act, knowledge and training to use them, and guardrails that keep work safe and consistent. This harness brings those things together: tools and automation let an agent act; skills and specialist agents provide reusable knowledge and ways of working; and governance checks make good practice repeatable. Keeping them together gives each project a dependable working environment rather than a collection of unrelated prompts and scripts.

## What this harness does for its owner

The harness turns loose conventions into something an agent can apply and check consistently. A skill usually combines guidance with the practical checks or actions that put it to work. Governance skills share four modes:

- **Educate (`EDUCATE`)** — give a target the knowledge, checkers, and commands it needs to govern itself. Run it to establish that foundation or bring it up to date.
- **Audit** — read a target (a repository, a document, a knowledge base) and report where it departs from the standard.
- **Conform** — bring the target into line, doing the mechanical fixes automatically.
- **Refresh** — revisit the standard itself against its upstream source, so it stays relevant.

Each skill ships a **mechanical checker** — a script that decides the clear-cut cases deterministically, so an agent review only spends attention on the parts that genuinely need it. The result: standards live in one place as skills, and the checkers keep every repository honest against them over time, rather than the standard living in someone's head and eroding.

This reflects the harness's central working principle: it serves **two kinds of agent — human and LLM** — and its work splits into **mechanical** (a deterministic operation can decide it) and **judgemental** (an agent must weigh it). The mechanical layer stands independently of an LLM: the approved model has the installed `ki` tool resolve the repository's declared skills from verified compatible harnesses and run their registered native operations. Agent judgment — from either kind of agent — is a layer added on top of that baseline, never a requirement for it. The full statement is [ADR-KI-HARNESS-003](../../decisions/ADR-KI-HARNESS-003-mechanical-first-agent-judgment-progressively-enhances.md), as refined by [ADR-KI-HARNESS-012](../../decisions/ADR-KI-HARNESS-012-compatible-harness-publication-and-native-operation-boundary.md).

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

The approved model has two deliberately separate scopes. **Harness installation** gives a person verified compatible harnesses under the standard XDG locations. **Skill activation** then makes one installed skill discoverable in a selected user runtime or for one repository, and repository activation updates that repository's `.ki-config.toml`. Native repository operations read those declarations but do not own the user's wider runtime state. Keeping the scopes separate makes it clear what a command will change.

The planned command group is deliberately small:

```text
ki harness install <harness-id>
ki user skill add <harness-id>:<skill-name>
ki repo skill add <harness-id>:<skill-name>
ki repo audit
ki repo conform
```

The native skill and repository commands are not yet released. Current `ki` availability and the command contract are in [the CLI guide](command-line-interface.md); the eventual onboarding and migration flow is in [the onboarding guide](onboarding.md). Existing vendored `.ki` state is a migration input only, never a compatibility executor for the native model.

## What "Knowledge Islands" means

Several of the skills are built for **Knowledge Islands** work and take its shape as given. A Knowledge Islands base is a single Markdown store organised into five fixed zones — `Calendar`, `Pillars`, `Resources`, `Streams`, and `Admin` — flanked by an inbound (`+`) and an outbound (`-`) staging area. The whole base is an "island"; within it a **Pillar** is a major strand of subject matter — a case, a client, a domain, a theme. The skills assume this structure rather than redefining it, so a base supplies only a few local bindings. For the idea in full, see [knowledgeislands.info](https://knowledgeislands.info).

## Where to go deeper

- **[Getting started](getting-started.md)** covers optional machine tools, repository bootstrap, and the separate hook-payload installer.
- **[Use skills](using-skills.md)** covers how a skill fires — by plain-language request or slash command.
- **[Recommended tools](recommended-tools.md)** explains optional machine-level tools such as chezmoi, headroom-ai, and mcporter.
- **[Tuning](tuning.md)** covers making a session lean — the standing surface vs runtime split, which built-in tools and MCP servers to load, and where a compression proxy does and does not help.
- **[Bootstrap reference](onboarding.md)** explains what repository bootstrap creates, its fleet and local forms, the day-to-day bins, and keeping a repository current.
- **[Command-line interface](command-line-interface.md)** explains the staged end-user `ki` command surface and its scope boundaries.
- **[Skills](skills.md)** covers what a skill is, the six clusters, and the shape they all share; the **[skill catalogue](skill-catalogue.md)** then describes them one by one.
