# Naming proposal

A proposal for the owner's review, written on 12 November 2026 by Kitteth, guardian of the Cairn summit, for the open names in the Cairn summit's change 22. It is not a card and settles nothing. Each name below is mapped onto the industry's word under INDUSTRY-FIRST and LEADERS, checked for clashes, and given a recommendation with its confidence and the alternatives.

## Contents

- [How it was made](#how-it-was-made)
- [The system's own terms](#the-systems-own-terms)
- [The open names](#the-open-names)
- [Where the system's terms overlap](#where-the-systems-terms-overlap)
- [Choices that depend on each other](#choices-that-depend-on-each-other)
- [Cards that would follow](#cards-that-would-follow)

## How it was made

The industry's words were read on 12 November 2026 from the sources this skill cites, and from Anthropic's pages on [channels][a7], [cross-session messaging][a8] and [agent teams][a9]. The system's own definitions were read from the Cairn store, this harness and the Cairn app. Kitteth wrote recommendations first. An independent reviewer then made its own from the same evidence, without seeing Kitteth's, and the two were compared. Where they differ, both are given below with the one recommended, and the reviewer's point is credited where it changed the recommendation.

## The system's own terms

| Name | Today | Maps onto | Clash | Recommendation | Confidence |
| --- | --- | --- | --- | --- | --- |
| **rig** | A machine Knowledge Islands manages through Rig, with its Rig profile and declared setup | [machine][industry.machine], narrower (`skos:broadMatch`) | Moderate: rig.rs and OpenRig, Rust and agent libraries; Rig, the tool | Keep, only for a machine Knowledge Islands manages through Rig; write machine for the computer in general. The Cairn app's "host" and "plane" for a Mac become rig, under HOST-SENSES | Medium to keep; high for the app's words |
| **actor** | Whoever acts at a node, agent or person; persists across sessions | No industry agentic word; the UML actor and OAuth's actor are close | Moderate: GitHub Actions' actor, the actor model, Apify's Actors, each in another field | Keep | Medium |
| **title** | A role at a place, `<work id>+<role>`, read "Eugene, governor of 5G Emerge" | None; the system's own | None outside; inside, a package's `title:` field is a document title | Keep, and fold seat into it | Medium |
| **role** | A job within a tier, from the catalogue | The agent-frameworks' role, as CrewAI's (`skos:closeMatch`) | Weak: chat roles and access-control roles are other fields | Keep, in the catalogue's sense only; a coordinating session is in a "mode", and a subagent definition is an "agent type", as Anthropic says | High |
| **work package** | The folder for a piece of work above a work item, its changes and sub-packages | PRINCE2's work package, close; PMBOK's, broader, since its packages do not nest | Moderate as a bare "package": npm packages, `packages-stoa` | Keep, written "work package" in full outside the store | High |
| **worker** | A session bound to a node, acting on it | [session][industry.session], narrower | Strong: Codex's built-in `worker` role, Anthropic's orchestrator-workers, Orca's workers | Drop: say session for the run and holder for the actor; the `workers` entry becomes `holders` | Medium-high |
| **seat** | One role taking part in a package; the same string as the title | None; to the vendors a seat is a paid licence | Strong: Claude, ChatGPT and Copilot plans | Drop into title; the session holding the keys stays the keyholder, with its 🔑 | Medium; SEAT-RATIFY is still open |
| **the KI harness** | Each territory's repository of skills, subagent definitions, evals and hooks | Anthropic's plugin, "a bundle of skills, hooks, subagents, and MCP servers packaged as a single installable unit"; OpenAI's plugin likewise (`skos:closeMatch`, exact once the repositories ship plugin manifests) | Strong for "harness": Anthropic's glossary calls Claude Code itself the agentic harness | Rename to plugin: it is a kind, one for each territory, so it takes the industry's plain word rather than a proper name | Medium |

Alternatives:

- **rig:** machine everywhere, losing the word for a machine Rig manages.
- **actor:** member, as Anthropic's team configuration lists its `members`, which clashes with territory members.
- **title:** position, the reviewer's recommendation (medium). It frees `title` for documents, but turns a plain reading, "Eugene, governor of 5G Emerge", into a term.
- **worker:** keyholder for the session as well. This merges two ideas the marks keep apart.
- **seat:** keep it, and accept that every vendor's pricing page uses the word otherwise.
- **The KI harness:**
  - marketplace for the canonical repository, with each guild a plugin, as Claude Code's plugin marketplaces work;
  - a proper name such as Quarry, where a cairn's stones come from, if the owner rules it one thing rather than a kind. This was Kitteth's first choice (low); the reviewer's case for the industry's word under INDUSTRY-FIRST is stronger.

## The open names

| Name | Maps onto | Clash | Recommendation | Confidence |
| --- | --- | --- | --- | --- |
| **agentic channel** | Three of Anthropic's words at once: channel, integration and cross-session messaging | "Agentic channel" appears only in commerce | Drop. CARD-CHANNEL's option A, the industry's words only, was taken on the owner's word for high-confidence recommendations; see the [channel card][industry.channel] | High |
| **agentic system** | Anthropic's "agentic systems", workflows and agents together; A2A's "agentic system" (`skos:exactMatch`) | None | Keep, as the industry's umbrella term, with OpenAI's "multi-agent system" as a narrower synonym; a card when the umbrella is needed | High |
| **agent team** | Anthropic's agent team, a team lead and teammates, each a full session messaging the others | None | A card of its own, with team lead and teammate on it, linking the Anthropic card | Medium-high |
| **peer agent** | No standard word; "peer" is descriptive everywhere, and Anthropic's inbox is a "Peer address" | Weak | Fold into a card for cross-session messaging, where peer is defined, rather than keep the drafted [peer agent card][industry.peer-agent] | Medium; the reviewer's recommendation, which changed Kitteth's |
| **remote agent** | A2A's remote agent, exactly | Weak: Google's Gemini CLI calls them remote subagents | Keep the drafted [remote agent card][industry.remote-agent], an industry card linked to [A2A's][spec.a2a.remote-agent] | High |
| **guild folder `agentic-systems`** | Nothing; it holds how to run subagents and delegate | Moderate: the same name as `ki-agentic-systems` and the umbrella term | Rename to `delegation/`, and consider moving `ki-delegation` in from `governance/` | Medium; the reviewer's recommendation, over Kitteth's `subagents/`, since the folder also holds `ki-delegation-orca` |

Alternatives:

- **peer agent:** keep the drafted card, at the cost of a word no standard defines.
- **The guild folder:** `subagents/`, narrower than what the folder holds.

## Where the system's terms overlap

- **Title and seat** are one idea in one string, `<id>+<role>`. Keep title.
- **Worker, actor, session and seat:**
  - the actor is who acts, and persists;
  - an actor holds titles;
  - a session is one run;
  - the actor holding a package's title is its holder;
  - the session holding its keys is the keyholder.
- **Machine, rig and agent host:** machine is the computer, rig is a machine Knowledge Islands manages through Rig, and agent host is the application.
- **"Agentic systems"** names a guild folder, a skill and an umbrella term at once. Renaming the guild settles it.
- **Thread** has at least six senses across the store, the harness and the app. The card's sense, a thread within a session, wins; the others need their own words, in a later pass.
- **Principal,** which was not asked about: the territories' `*-principal` repositories clash strongly with the access-control term. That needs a later look.

## Choices that depend on each other

- **Folding seat into title, and worker into holder and keyholder,** must land together in one change. The thread line, the `workers` entry and the roster's `titles` all depend on them.
- **Dropping worker** frees the word for Orca's sense, which the `ki-delegation-orca` skill already uses.
- **Renaming the KI harness to plugin** makes the guild folders candidates for plugin names, as in `delegation:ki-subagents`. That favours a guild name that reads well as a plugin.
- **Option A for channels** puts peer on the cross-session messaging card, which is why the peer agent card should fold into it.

## Cards that would follow

What each pick would put in the graph, drafted on 13 November 2026 so the owner can see the cards before choosing. These are drafts, not cards: each definition is checked against its sources, and its links set, when its card is written, and only once its pick is settled.

**Industry cards,** in `industry/`:

| Card | Draft definition | Built on | Pick |
| --- | --- | --- | --- |
| `industry.agentic-system` | Any system in which models direct their own steps and tools: workflows, where code sets the path, and agents, where the model does. The umbrella over everything in this graph | Anthropic's agentic systems; A2A's agentic system (`skos:exactMatch`) | NAMES-SYSTEM |
| `industry.agent-team` | Several sessions working on one piece of work together: a team lead that sets the work out, and teammates, each a full, independent session, that message each other and the lead | [Anthropic's agent team][a9], already a vendor card | NAMES-TEAM |
| `industry.cross-session-messaging` | Sessions on the same machine sending each other messages, each arriving as a turn in the receiving session. The **peer** is the session at the other end; there is no separate peer agent | [Anthropic's cross-session messaging][a8] | NAMES-PEER, with CARD-CHANNEL option A |
| `industry.tool` | A function an agent can call to act or to fetch something beyond its model, described by a name, a description and an input schema, and run by the harness or a server on the agent's behalf | MCP's tools, already a specification card; each vendor's tool use | Gap 1 in change 22 |
| `industry.instruction-file` | A plain-text file a harness loads into every session as standing instructions, from the repository or the user's folder, such as `AGENTS.md`, `CLAUDE.md` or `GEMINI.md` | The `AGENTS.md` format; each vendor's memory and instructions pages | Gap 1 in change 22 |
| `industry.plugin` | An installable bundle that extends an agent harness, holding skills and often hooks, subagents and MCP servers, packaged and shared as one unit | Anthropic's plugins; [OpenAI's skills and plugins][o13] | NAMES-HARNESS |

**The system's own words,** in a new `system/` subgraph, each mapped onto its industry card. Where they live is still TERMS-SOURCE, in change 22's gaps; `system/` is the proposal.

| Card | Draft definition | Maps onto | Pick |
| --- | --- | --- | --- |
| `system.rig` | A machine Knowledge Islands manages through Rig, with its Rig profile and declared setup, such as sol or terra. The Cairn app's "host" and "plane" become rig | [machine][industry.machine], narrower (`skos:broadMatch`) | NAMES-RIG |
| `system.actor` | Whoever acts at a node of the work tree, an agent or a person, the owner among them. It persists across sessions and agent hosts, where a session is one run | None; UML's and OAuth's actor are close | NAMES-ACTOR |
| `system.title` | A role at a place, written `<work id>+<role>` and read as "warden of Cairn". An actor holds titles; seat folds into it | None; the system's own | NAMES-TITLE |
| `system.role` | A job within a tier, from the role catalogue, such as governor, warden or housekeeper | The agent frameworks' role, as CrewAI's (`skos:closeMatch`) | NAMES-ROLE |
| `system.work-package` | The folder for one piece of work above a work item, holding its entry file, change documents and sub-packages: a node of the work tree. Always written in full | PRINCE2's work package, close; PMBOK's, broader | NAMES-PACKAGE |
| `system.holder` | The actor holding a package's title, acting on it through its [sessions][industry.session]. It replaces worker, which Codex, Anthropic and Orca each use otherwise | [session][industry.session], through which it acts | NAMES-WORKER |

**No new card** for remote agent, which keeps [its card][industry.remote-agent] (NAMES-REMOTE), or for the guild folder, whose rename moves skills and defines nothing (NAMES-GUILD). If NAMES-HARNESS is taken, the plugin card comes first, and renaming the KI harness throughout waits for a change of its own.

[industry.machine]: ../knowledge/industry/industry.machine.md
[industry.session]: ../knowledge/industry/industry.session.md
[industry.channel]: ../knowledge/industry/industry.channel.md
[industry.peer-agent]: ../knowledge/industry/industry.peer-agent.md
[industry.remote-agent]: ../knowledge/industry/industry.remote-agent.md
[spec.a2a.remote-agent]: ../knowledge/specs/a2a/spec.a2a.remote-agent.md
[a7]: https://code.claude.com/docs/en/channels
[a8]: https://code.claude.com/docs/en/cross-session-messaging
[a9]: https://code.claude.com/docs/en/agent-teams

[o13]: https://learn.chatgpt.com/docs/skills-and-plugins.md
