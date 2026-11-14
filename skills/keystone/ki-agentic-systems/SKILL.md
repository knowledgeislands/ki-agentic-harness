---
name: ki-agentic-systems
ki-kind: knowledge
ki-applicability: invocation-only
ki-guild: keystone
ki-leads: agentic-systems
ki-depends-on: []
description: >
  Define the words of agentic systems as a knowledge graph: industry cards from model, agent harness, agent, session,
  subagent and skill to environment, machine, agent host and client, with Anthropic's, OpenAI's, Google's and Microsoft's own words in vendor subgraphs linked to them.
  Use to learn what an agentic term means, which sense a vendor name such as Claude or Codex carries, how vendors' words
  compare, or which card to link instead of redefining a term; `ki-agentic-radar` owns maturity and stance, and
  `ki-subagents` how to run subagents.
argument-hint: 'educate <term> | help | refresh'
---

# Knowledge Islands agentic systems

This is a knowledge skill: it equips a session with the vocabulary of agentic systems and audits or conforms nothing. It is the one canonical source for agentic terms in Knowledge Islands. Its cards form a knowledge graph in the Semantic Markdown format the `ki-knowledge-graph` skill defines, opened by its root definition, [`_graph.md`](knowledge/_graph.md), which declares the card types, link vocabulary, properties, constraints and subgraphs. The decisions behind its shape are in [the sources](references/sources.md#3-decisions).

## Rules

1. **The industry's word wins** (INDUSTRY-FIRST). Where an industry standard defines a term, its meaning stands, and the system's own conventions move to fit, so this skill never contradicts the outside world. Each term card says where a convention of ours maps onto the term, and a convention that clashes is renamed.
2. **Anthropic and OpenAI lead** (LEADERS). Where vendors differ, Anthropic's and OpenAI's usage leads, and their subgraphs are read first.
3. **Vendors' words are subgraphs** (VENDORS, KG-SUBGRAPHS). Each vendor, Anthropic, OpenAI, Google and Microsoft, and others where they matter, has a subgraph of cards holding its own words, each with its sense, current examples and sources, and linking to the industry's term with a SKOS predicate. A name used in more than one sense, as Anthropic's Claude and OpenAI's Codex are, links once for each sense. How a vendor differs from the industry, or from another vendor, is read from those links, never listed on a term card.
4. **Purpose first** (PURPOSE-FIRST). A term or specification card says first what the thing achieves, then what it is and how it is built.
5. **Each term card uses only words already defined** (CARD-ORDER). The industry's cards are read in order, starting from the model, the one thing every other layer is built from, and each links to the next.
6. **Specifications are cards of their own** (SPEC-CARDS). Each specification a term rests on, such as the Agent Skills specification, MCP, ACP, AHP and A2A, is its own card, split so each part a card links to is a card (KG-GRAIN). A term card links the specification card rather than restating it; until that card exists, it names the pending card's id, never a definition.
7. **Never a bare "host"** (HOST-SENSES). Write **agent host** for the application or process that runs harnesses and owns their sessions, and **machine** for the computer. Where a vendor writes "host" for a computer, the machine card notes it as a synonym.

## The cards

The cards sit in `knowledge/`, in a folder for each subgraph: `industry/`, `specs/` with a folder for each specification, `vendors/` with a folder for each vendor, and `diagrams/` (KNOWLEDGE-FOLDER, GRAPH-FOLDERS). Each file is named by its id, `<id>.md`, and each id carries its subgraph, as `industry.session` and `openai.thread` do (FILE-NAME). [`_graph.md`](knowledge/_graph.md) lists every card by subgraph.

### Industry cards

Read them in order:

1. [Model](knowledge/industry/industry.model.md): the LLM, which takes text and images in, gives text out, and acts on nothing by itself.
2. [Agent harness](knowledge/industry/industry.agent-harness.md): the software that turns a model into an agent, its loop, tools and context handling.
3. [Agent](knowledge/industry/industry.agent.md): a model working through an agent harness, what you deal with when work gets done.
4. [Session](knowledge/industry/industry.session.md): one run of an agent, a conversation with its own context, id and folder, made of turns and of threads.
5. [Subagent](knowledge/industry/industry.subagent.md): an agent subordinate to another, started by it to do part of its work in a thread of its own, returning its result to it.
6. [Skill](knowledge/industry/industry.skill.md): a common way to extend any agent harness with knowledge and procedures, loaded by progressive disclosure.
7. [Environment](knowledge/industry/industry.environment.md): where an agent's work runs, a whole machine or a container or sandbox inside one; local, remote or cloud.
8. [Machine](knowledge/industry/industry.machine.md): the computer, physical or virtual, that environments run on.
9. [Agent host](knowledge/industry/industry.agent-host.md): the application or process that runs agent harnesses and owns their sessions, independently of clients.
10. [Client](knowledge/industry/industry.client.md): a window onto a session an agent host owns.

Pending, in this order and not yet defined here:

1. Channel, drafted as a [proposal](knowledge/industry/industry.channel.md) under CARD-CHANNEL's option A, the industry's words; then integration and session-to-session messaging, under a card for the ways into a session.
2. The agent kinds beside the subagent, drafted as proposals: the [peer agent](knowledge/industry/industry.peer-agent.md) and the [remote agent](knowledge/industry/industry.remote-agent.md).
3. Agent team, tool, instruction file and plugin.
4. The system's own terms (NAMES): rig, actor, work package and role, and backpack, the KI harness's own name, mapped onto plugin. Title, seat and worker go. What is still open is decided in the Cairn summit's change 23. Guild, the first of them, is written below.

### Specification cards

- [The Agent Skills specification](knowledge/specs/agent-skills/spec.agent-skills.md), with its part [progressive disclosure](knowledge/specs/agent-skills/spec.agent-skills.progressive-disclosure.md).

Proposals, drafted for the owner's decision in the Cairn summit's change 22 and not yet agreed, so no agreed card links them yet:

- [The Model Context Protocol](knowledge/specs/mcp/spec.mcp.md), with its parts [MCP host](knowledge/specs/mcp/spec.mcp.host.md), [MCP client](knowledge/specs/mcp/spec.mcp.client.md), [MCP server](knowledge/specs/mcp/spec.mcp.server.md), [tools](knowledge/specs/mcp/spec.mcp.tools.md) and [transports](knowledge/specs/mcp/spec.mcp.transports.md).
- [The Agent Client Protocol](knowledge/specs/acp/spec.acp.md), with its [client](knowledge/specs/acp/spec.acp.client.md), [agent](knowledge/specs/acp/spec.acp.agent.md) and [session](knowledge/specs/acp/spec.acp.session.md).
- [The Agent Host Protocol](knowledge/specs/ahp/spec.ahp.md), with its [agent host](knowledge/specs/ahp/spec.ahp.agent-host.md), [client](knowledge/specs/ahp/spec.ahp.client.md), [session](knowledge/specs/ahp/spec.ahp.session.md) and [channels](knowledge/specs/ahp/spec.ahp.channels.md).
- [Agent2Agent](knowledge/specs/a2a/spec.a2a.md), with its [client](knowledge/specs/a2a/spec.a2a.client.md), [remote agent](knowledge/specs/a2a/spec.a2a.remote-agent.md), [Agent Card](knowledge/specs/a2a/spec.a2a.agent-card.md) and [task](knowledge/specs/a2a/spec.a2a.task.md).

### System cards

Knowledge Islands' own words, in the `system/` subgraph, each mapped onto the industry's terms:

- [Guild](knowledge/system/system.guild.md): a set of skills that belong together and work together, led by one lead skill; Keystone is the guild of guilds.

### Vendor subgraphs

- **Anthropic** (`anthropic.`) and **OpenAI** (`openai.`): their names [Claude](knowledge/vendors/anthropic/anthropic.claude.md), [Claude Code](knowledge/vendors/anthropic/anthropic.claude-code.md), [Codex](knowledge/vendors/openai/openai.codex.md) and [ChatGPT](knowledge/vendors/openai/openai.chatgpt.md), each used in more than one sense, and their words for each term, from Anthropic's [model](knowledge/vendors/anthropic/anthropic.model.md) to its [skill](knowledge/vendors/anthropic/anthropic.skill.md), and OpenAI's [task](knowledge/vendors/openai/openai.task.md), [chat](knowledge/vendors/openai/openai.chat.md) and [thread](knowledge/vendors/openai/openai.thread.md) for a session and its parts.
- **Google** (`google.`): [Gemini](knowledge/vendors/google/google.gemini.md), and its words, among them [conversation](knowledge/vendors/google/google.conversation.md) and [session](knowledge/vendors/google/google.session.md).
- **Microsoft** (`microsoft.`): [Copilot](knowledge/vendors/microsoft/microsoft.copilot.md), and its and GitHub's words, among them [agent harness](knowledge/vendors/microsoft/microsoft.agent-harness.md) and [agent session](knowledge/vendors/microsoft/microsoft.agent-session.md).
- **Orca** (`orca.`) and **Zed Industries** (`zed.`): Orca's [runtime](knowledge/vendors/orca/orca.runtime.md), an agent host, and its [app](knowledge/vendors/orca/orca.app.md), client and agent host in one; and [Zed](knowledge/vendors/zed/zed.zed.md), a client through ACP.

### Diagrams

Resource cards (`diagram.`) point to diagrams of the terms, kept with the harness's living diagrams: [agentic terms by example](knowledge/diagrams/diagram.agentic-terms-by-example.md), an instance diagram from machine to client, and [agentic standards and channels](knowledge/diagrams/diagram.agentic-standards.md), a proposal until the channel card is settled.

## Adding a card

A card's wording is settled first in the Cairn summit's knowledge-skills change, by the owner's decision. Only then is it written here, and once it is, it leaves that change.

1. **Write the card** as `<id>.md` in its subgraph's folder under `knowledge/`, in the `ki-knowledge-graph` card format and with the properties [`_graph.md`](knowledge/_graph.md) requires of its type. A term card gives its purpose, then what the thing is and how it is built, the specifications it rests on, our conventions, and a link to the next card. A vendor card gives the vendor's word and its sense, its current examples, and its sources, and links to the industry's term with the predicate `_graph.md` sets for its match.
2. **Use only words already defined** on earlier term cards, and link the cards it builds on. Where a term rests on a specification, link the specification card, or a card for the part it rests on, or name the pending card's id until it is written.
3. **Evidence it:** add each new source to [the sources](references/sources.md) with the date it was checked, and the decision to its Decisions.
4. **Place it:** list it under its subgraph in `_graph.md` and here, move it out of Pending, point the previous term card's link at it, and replace any pending id that waited for it.

## Linking to a card

Another skill that uses an agentic term links to its industry card here rather than defining the term again: a standard's Terms table names the term and points to the card. Where a skill needs a narrower sense, it states the narrowing and still links the card. A vendor's word is linked at its vendor card only where the vendor's own usage is the point.

## Boundaries

- **This skill says what a thing is.**
- **`ki-agentic-radar`** says how mature a subject is, who has adopted it and the house stance, and names its card in the subject's `card` field.
- **`ki-subagents`** and its runtime bindings say how to run subagents in a given agent host: the practice, not the vocabulary.
- **`ki-knowledge-graph`** owns the card format, root definitions, subgraphs and link vocabularies, and how cards are curated and tended; it sits beside this skill in the Keystone guild.
- **`ki-skills`** owns the knowledge kind and how a skill holds its graph.

## Operating modes

Invoked as `help`, `-h` or `?`, explain the skill, its rules, its cards and its boundaries, then stop. With no recognised mode, give the same explanation and, only in an interactive session, offer a mode choice. It has no AUDIT or CONFORM: a knowledge skill holds knowledge and checks nothing.

### Mode EDUCATE

Explain the named term from its industry card: its purpose and definition first, then the cards it builds on, then each vendor's words for it, read from the vendor cards that link to it, Anthropic and OpenAI first, with how they compare. Given a vendor's word or product name, start from its vendor card and follow its links to the industry's terms. For a term with no card yet, say so, give its place in the pending order, and do not define it here.

### Mode REFRESH

REFRESH writes only in this skill's canonical source in the `ki-agent-backpack` repository; invoked from an installed copy, stop and name the harness as the place to run it.

Refreshing is a regular activity (TERMS-REFRESH), because vendors' naming keeps changing. Follow the procedure in [the sources](references/sources.md#1-introduction): re-check each vendor source, see how the industry's terms are moving, keep every vendor card's examples and links current, add a vendor card for a new word and retire one a vendor has dropped, and record the review there. A change to an industry card's definition is not a refresh; it goes back to the change that settles cards.
