---
id: ki-agentic-systems
title: The vocabulary of agentic systems
type: graph
status: agreed
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 06, KG-ROOT, ROOT-FORM a) and KG-SUBGRAPHS, and change 22, SPEC-CARDS (Kris, 12 November 2026)
---

# The vocabulary of agentic systems

This graph gives every Knowledge Islands session the same words for agentic systems, in the industry's sense, so a skill or standard links a card here rather than defining a term again. The industry's terms form one subgraph, read in order from the [model][industry.model]; each specification a term rests on has cards of its own; and each major vendor's own words form a subgraph whose cards link to the industry's terms, so how a vendor differs from the industry, or from another vendor, is read from those links.

## Contents

- [Card types](#card-types)
- [Link vocabulary](#link-vocabulary)
- [Properties](#properties)
- [Constraints](#constraints)
- [Subgraphs](#subgraphs)
- [Extent and limitations](#extent-and-limitations)

## Card types

| Type | What a card of this type is about | Further properties required |
| --- | --- | --- |
| `graph` | This graph's root definition: this card | None |
| `term` | A term in the industry's sense: what it achieves first, then what it is and how it is built, then where our conventions map onto it | None |
| `specification` | A specification a term rests on, or a part of one that a card links to | None |
| `vendor-term` | One vendor's own word for a term, in one sense, with its current examples and sources | `vendor` |
| `vendor-name` | A vendor's product name used in more than one sense, linking once for each | `vendor` |

## Link vocabulary

| Prefix | Vocabulary | Namespace | Predicates in use |
| --- | --- | --- | --- |
| `skos:` | SKOS, the default | `http://www.w3.org/2004/02/skos/core#` | `skos:exactMatch`, `skos:closeMatch`, `skos:broadMatch`, `skos:relatedMatch`, `skos:broader`, `skos:related` |
| `dcterms:` | Dublin Core terms, where SKOS has no term for a whole and its parts or for conformance | `http://purl.org/dc/terms/` | `dcterms:hasPart`, `dcterms:isPartOf`, `dcterms:conformsTo` |
| `ki:` | Knowledge Islands, for what neither has | Not yet published | `ki:runs`, `ki:run-of`, `ki:run-by`, `ki:extends` |

A predicate reads from the card that holds it to its target. A vendor card whose word means the industry's term exactly uses `skos:exactMatch`, nearly `skos:closeMatch`; one whose word is narrower than the term, as a product is, uses `skos:broadMatch`, saying the target is broader; and one whose word is only related, as a part of the thing or something easily mistaken for it, uses `skos:relatedMatch`.

## Properties

| Property | Meaning | Values | Required for |
| --- | --- | --- | --- |
| `id` | The card's identity and file name | `<subgraph>.<name>`, or for a part of a specification `<specification id>.<part>` | Every card |
| `title` | The thing's name; a vendor card's title names the vendor in brackets | Text | Every card |
| `type` | The card's type | A card type above | Every card |
| `status` | Whether the card is adopted | `proposal`, `future-concept` or `agreed` | Every card |
| `territory` | The territory the knowledge belongs to | `knowledge-islands` | Every card |
| `island` | The island that owns the knowledge | `ki-agentic-harness` | Every card |
| `vendor` | The vendor whose word the card holds | `Anthropic`, `OpenAI`, `Google` or `Microsoft` | `vendor-term`, `vendor-name` |
| `origin` | The decisions the card was written from, in one line | Text | Every card |
| `links` | Typed links, keyed by the target card's id | A predicate from the vocabulary above | Optional |

## Constraints

- **The industry's word wins** (INDUSTRY-FIRST): a term card takes the industry's meaning, and says where a convention of ours maps onto it.
- **Anthropic and OpenAI lead** (LEADERS): where vendors differ, a term card follows Anthropic's and OpenAI's usage, and their subgraphs are read first.
- **Purpose first** (PURPOSE-FIRST): a term or specification card says first what the thing achieves, then what it is and how it is built.
- **In order** (CARD-ORDER): each term card uses only words defined on the cards before it, and ends by linking the next.
- **Senses are links** (KG-SUBGRAPHS): a term card never lists vendors' words; each vendor card links to the term it matches, once for each sense of its word.
- **Never a bare "host"** (HOST-SENSES): write agent host for the application or process that runs harnesses and owns their sessions, and machine for the computer.
- **"Task" is no term here** (CARD-SESSION): it means a session, delegated work and scheduled work by vendor and surface, so it appears only as a vendor's word.
- **Specifications are cited, not restated** (SPEC-CARDS): a term card links the specification card it rests on, or names the pending card's id until it is written; each part of a specification that a card links to is a card of its own (KG-GRAIN).

## Subgraphs

| Subgraph | Id prefix | Subject | Cards |
| --- | --- | --- | --- |
| Industry | `industry.` | The industry's terms, in reading order | [model][industry.model], [agent harness][industry.agent-harness], [agent][industry.agent], [session][industry.session], [subagent][industry.subagent], [skill][industry.skill] |
| Specifications | `spec.` | The specifications the terms rest on | [Agent Skills][spec.agent-skills], with [progressive disclosure][spec.agent-skills.progressive-disclosure] |
| Anthropic | `anthropic.` | Anthropic's own words | [Claude][anthropic.claude], [Claude Code][anthropic.claude-code], [model][anthropic.model], [agentic harness][anthropic.agentic-harness], [agentic coding tool][anthropic.agentic-coding-tool], [session][anthropic.session], [conversation][anthropic.conversation], [subagent][anthropic.subagent], [agent team][anthropic.agent-team], [skill][anthropic.skill] |
| OpenAI | `openai.` | OpenAI's own words | [Codex][openai.codex], [ChatGPT][openai.chatgpt], [model][openai.model], [harness][openai.harness], [agent][openai.agent], [task][openai.task], [chat][openai.chat], [thread][openai.thread], [subagent][openai.subagent], [skill][openai.skill], [plugin][openai.plugin] |
| Google | `google.` | Google's own words | [Gemini][google.gemini], [model][google.model], [agent harness][google.agent-harness], [agent][google.agent], [conversation][google.conversation], [session][google.session], [subagent][google.subagent], [remote subagent][google.remote-subagent], [skill][google.skill] |
| Microsoft | `microsoft.` | Microsoft's and GitHub's own words | [Copilot][microsoft.copilot], [model][microsoft.model], [agent harness][microsoft.agent-harness], [agent][microsoft.agent], [agent session][microsoft.agent-session], [chat][microsoft.chat], [subagent][microsoft.subagent], [agent skill][microsoft.agent-skill] |

## Extent and limitations

- **What it covers:** six terms, from the model to the skill, the Agent Skills specification, and the four leading vendors' words for those terms as their documentation used them on 12 November 2026. Other vendors are added where they matter (VENDORS).
- **Beside the cards:** the root folder is the skill's `references/` folder, which also holds [the sources](sources.md), with every vendor source and the date it was last checked, and the decisions behind the cards; it is not a card.
- **Refreshed monthly** (TERMS-REFRESH): the vendor cards' examples date quickly, as products are renamed, merged and closed.
- **Pending terms,** in this order: `industry.machine`, `industry.agent-host`, `industry.client`, `industry.channel`, and the system's own terms: rig, actor, title, role, package, worker, seat, and the KI harness's new name. A vendor card that would link to one, such as the agent-host sense of Claude or ChatGPT, gains that link when the card is written.
- **Pending specifications:** `spec.mcp`, the Model Context Protocol; `spec.acp`, the Agent Client Protocol; `spec.ahp`, the Agent Host Protocol; and `spec.a2a`, Agent2Agent.
- **Due a vocabulary review:** the `ki:` predicates, until the `ki:` namespace is published.

[industry.model]: ./industry.model.md
[industry.agent-harness]: ./industry.agent-harness.md
[industry.agent]: ./industry.agent.md
[industry.session]: ./industry.session.md
[industry.subagent]: ./industry.subagent.md
[industry.skill]: ./industry.skill.md
[spec.agent-skills]: ./spec.agent-skills.md
[spec.agent-skills.progressive-disclosure]: ./spec.agent-skills.progressive-disclosure.md
[anthropic.claude]: ./anthropic.claude.md
[anthropic.claude-code]: ./anthropic.claude-code.md
[anthropic.model]: ./anthropic.model.md
[anthropic.agentic-harness]: ./anthropic.agentic-harness.md
[anthropic.agentic-coding-tool]: ./anthropic.agentic-coding-tool.md
[anthropic.session]: ./anthropic.session.md
[anthropic.conversation]: ./anthropic.conversation.md
[anthropic.subagent]: ./anthropic.subagent.md
[anthropic.agent-team]: ./anthropic.agent-team.md
[anthropic.skill]: ./anthropic.skill.md
[openai.codex]: ./openai.codex.md
[openai.chatgpt]: ./openai.chatgpt.md
[openai.model]: ./openai.model.md
[openai.harness]: ./openai.harness.md
[openai.agent]: ./openai.agent.md
[openai.task]: ./openai.task.md
[openai.chat]: ./openai.chat.md
[openai.thread]: ./openai.thread.md
[openai.subagent]: ./openai.subagent.md
[openai.skill]: ./openai.skill.md
[openai.plugin]: ./openai.plugin.md
[google.gemini]: ./google.gemini.md
[google.model]: ./google.model.md
[google.agent-harness]: ./google.agent-harness.md
[google.agent]: ./google.agent.md
[google.conversation]: ./google.conversation.md
[google.session]: ./google.session.md
[google.subagent]: ./google.subagent.md
[google.remote-subagent]: ./google.remote-subagent.md
[google.skill]: ./google.skill.md
[microsoft.copilot]: ./microsoft.copilot.md
[microsoft.model]: ./microsoft.model.md
[microsoft.agent-harness]: ./microsoft.agent-harness.md
[microsoft.agent]: ./microsoft.agent.md
[microsoft.agent-session]: ./microsoft.agent-session.md
[microsoft.chat]: ./microsoft.chat.md
[microsoft.subagent]: ./microsoft.subagent.md
[microsoft.agent-skill]: ./microsoft.agent-skill.md
