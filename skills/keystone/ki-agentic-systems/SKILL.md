---
name: ki-agentic-systems
ki-kind: knowledge
ki-applicability: invocation-only
ki-depends-on: []
description: >
  Define the words of agentic systems, one card per term with each major vendor's usage, starting from model,
  agent harness, agent, session and subagent. Use to learn what an agentic term means, which sense a vendor name such as
  Claude or Codex carries, or which card to link instead of redefining a term; `ki-agentic-radar` owns maturity
  and stance, and `ki-subagents` how to run subagents.
argument-hint: 'educate <term> | help | refresh'
---

# Knowledge Islands agentic systems

This is a knowledge skill: it equips a session with the vocabulary of agentic systems and audits or conforms nothing. It is the one canonical source for agentic terms in Knowledge Islands. Its cards are in the Semantic Markdown format the `ki-knowledge-graph` skill defines, in two sets: **term cards**, each with the industry's name for a term, its definition, examples from each major vendor and a link to the next card, and **specification cards**, one for each specification a term rests on.

The knowledge kind is declared here ahead of its definition in `ki-skills`, under AHEAD-OF-REVIEW; until `ki-skills` defines it, this skill has no rubric, and the decisions behind its shape are in [the sources](references/sources.md#3-decisions).

## Rules

1. **The industry's word wins** (INDUSTRY-FIRST). Where an industry standard defines a term, its meaning stands, and the system's own conventions move to fit, so this skill never contradicts the outside world. Each card says where a convention of ours maps onto the term, and a convention that clashes is renamed.
2. **Anthropic and OpenAI lead** (LEADERS). Where vendors differ, Anthropic's and OpenAI's usage leads, and the card notes where Google, Microsoft and others differ.
3. **Every card names, defines and evidences its term** (VENDORS). A card gives the industry's name, its definition, and examples from Anthropic, OpenAI, Google and Microsoft, and others where they matter, each traced to a source in [the sources](references/sources.md). Where a vendor uses one name in more than one sense, as Anthropic with Claude and OpenAI with Codex, the card says which sense it means.
4. **Each card uses only words already defined** (CARD-ORDER). The cards are read in order, starting from the model, the one thing every other layer is built from, and each links to the next.
5. **Specifications are cards of their own** (SPEC-CARDS). Each specification a term rests on, such as the Agent Skills specification, MCP, ACP, AHP and A2A, is its own card. A term card cites the specification and links to the part of that card it rests on rather than restating it; until the specification card exists, the term card carries a pending marker in its place, never a definition.
6. **Never a bare "host"** (HOST-SENSES). Write **agent host** for the application or process that runs harnesses and owns their sessions, and **machine** for the computer. Where a vendor writes "host" for a computer, the machine card notes it as a synonym.

## The cards

The cards sit flat in `references/`, one file each: a term card is `term-<id>.md` and a specification card is `spec-<id>.md`, so the two sets sit side by side.

### Term cards

Read them in order:

1. [Model](references/term-model.md): the LLM, which takes text and images in, gives text out, and acts on nothing by itself.
2. [Agent harness](references/term-agent-harness.md): the software that turns a model into an agent, its loop, tools and context handling.
3. [Agent](references/term-agent.md): a model working through an agent harness, what you deal with when work gets done.
4. [Session](references/term-session.md): one run of an agent, a conversation with its own context, id and folder, made of turns and of threads.
5. [Subagent](references/term-subagent.md): an agent subordinate to another, started by it to do part of its work in a thread of its own, returning its result to it.

Pending, in this order and not yet defined here:

1. Skill.
2. Machine.
3. Agent host.
4. Client.
5. Channel.
6. The system's own terms: rig, actor, title, role, package, worker, seat, and the KI harness's new name.

### Specification cards

None yet. Pending, not yet written here:

1. Model Context Protocol (MCP).
2. Agent Client Protocol (ACP).
3. Agent Host Protocol (AHP).
4. Agent2Agent (A2A).
5. The Agent Skills specification.

## Adding a card

A card's wording is settled first in the Cairn summit's knowledge-skills change, by Kris's decision. Only then is it written here, and once it is, it leaves that change.

1. **Write the card** as `references/term-<id>.md`, or `references/spec-<id>.md` for a specification, one file per card beside the others, in the `ki-knowledge-graph` card format: front matter with `id`, `title`, `type`, `status`, `territory`, `island` and one `origin:` line naming the decision; the definition first; a table of vendor examples, Anthropic and OpenAI first, then Google and Microsoft, with the vendor's own word and its sources; where a name has more than one sense; the specifications it rests on; our conventions; and a link to the next card.
2. **Use only words already defined** on earlier cards, and link the cards it builds on. Where a term rests on a specification, link the part of its specification card, or leave a pending marker until that card is written.
3. **Evidence it:** add each new source to [the sources](references/sources.md) with the date it was checked, and the decision to its Decisions.
4. **Place it:** move it from Pending into its list above, point the previous card's link at it, and replace any pending marker that waited for it.

## Linking to a card

Another skill that uses an agentic term links to its card here rather than defining the term again: a standard's Terms table names the term and points to the card. Where a skill needs a narrower sense, it states the narrowing and still links the card.

## Boundaries

- **This skill says what a thing is.**
- **`ki-agentic-radar`** says how mature a subject is, who has adopted it and the house stance, and links to its card.
- **`ki-subagents`** and its runtime bindings say how to run subagents in a given agent host: the practice, not the vocabulary.
- **`ki-knowledge-graph`** owns the card format and how cards are curated and tended; it sits beside this skill in the Keystone guild.

## Operating modes

Invoked as `help`, `-h` or `?`, explain the skill, its rules, its cards and its boundaries, then stop. With no recognised mode, give the same explanation and, only in an interactive session, offer a mode choice. It has no AUDIT or CONFORM: a knowledge skill holds knowledge and checks nothing.

### Mode EDUCATE

Explain the named term from its card: the definition first, then the vendors' examples and senses, then the cards it builds on. For a term with no card yet, say so, give its place in the pending order, and do not define it here.

### Mode REFRESH

REFRESH writes only in this skill's canonical source in the `ki-agentic-harness` repository; invoked from an installed copy, stop and name the harness as the place to run it.

Refreshing is a regular activity (TERMS-REFRESH), because vendors' naming keeps changing. Follow the procedure in [the sources](references/sources.md#1-introduction): re-check each vendor source, see how the industry's terms are moving, keep every card's examples current, and record the review there. A change to a card's definition is not a refresh; it goes back to the change that settles cards.
