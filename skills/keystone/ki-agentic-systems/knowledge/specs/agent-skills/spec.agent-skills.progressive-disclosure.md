---
id: spec.agent-skills.progressive-disclosure
title: Progressive disclosure, in the Agent Skills specification
type: specification
status: agreed
territory: knowledge-islands
island: ki-agent-backpack
origin: Cairn summit change 22, CARD-SKILL a), and change 06, KG-GRAIN (12 November 2026)
links:
  spec.agent-skills:
    predicate: dcterms:isPartOf
---

# Progressive disclosure, in the Agent Skills specification

Progressive disclosure keeps a [skill][industry.skill] cheap until it is needed, so an agent can hold many skills at once. It is part of the [Agent Skills specification][spec.agent-skills] ([specification][s1]).

A skill is loaded in three levels:

1. **Metadata:** the `name` and `description`, about 100 tokens, loaded at startup for every skill.
2. **Instructions:** the body of `SKILL.md`, advised to stay under 5,000 tokens, loaded when the skill is activated.
3. **Resources:** the files the skill bundles, loaded only as they are needed.

[industry.skill]: ../../industry/industry.skill.md
[spec.agent-skills]: ./spec.agent-skills.md
[s1]: https://agentskills.io/specification
