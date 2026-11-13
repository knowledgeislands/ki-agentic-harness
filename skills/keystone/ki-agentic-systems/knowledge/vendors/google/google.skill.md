---
id: google.skill
title: Skill (Google)
type: vendor-term
status: agreed
territory: knowledge-islands
island: ki-agentic-harness
vendor: Google
origin: Cairn summit change 22, CARD-SKILL, and change 06, KG-SUBGRAPHS (12 November 2026)
links:
  industry.skill:
    predicate: skos:exactMatch
---

# Skill (Google)

Google says skill, as Agent Skills, in the industry's sense of a [skill][industry.skill]: "a self-contained directory that packages instructions and assets into a discoverable capability", built on the Agent Skills open standard ([Agent Skills in Gemini CLI][g8]). Only a skill's name and description go into the system prompt, and the `activate_skill` tool loads the rest, with consent; GEMINI.md, by contrast, is always loaded.

## Examples

- Gemini CLI's Agent Skills ([Agent Skills in Gemini CLI][g8]).

[industry.skill]: ../../industry/industry.skill.md
[g8]: https://geminicli.com/docs/cli/skills/
