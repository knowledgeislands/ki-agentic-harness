---
id: spec.agent-skills
title: Agent Skills specification
type: specification
status: agreed
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS and CARD-SKILL a) (12 November 2026)
links:
  spec.agent-skills.progressive-disclosure:
    predicate: dcterms:hasPart
---

# Agent Skills specification

The Agent Skills specification lets one [skill][industry.skill] work in any agent harness that adopts it, by fixing the form a skill takes ([specification][s1]).

A skill is a directory holding at least a `SKILL.md` file. Its front matter carries a `name`, of up to 64 characters, and a `description`, of up to 1,024, and may carry `license`, `compatibility`, `metadata` and `allowed-tools`; the body holds the instructions. The directory may also hold `scripts/`, `references/` and `assets/`, and any other files or directories. Skills are loaded by [progressive disclosure][spec.agent-skills.progressive-disclosure].

The specification advises keeping file references one level deep from `SKILL.md`. That concerns chains of references, one file sending the reader to another, not the depth of folders, which the specification leaves open.

Anthropic, OpenAI, Google and Microsoft each build their skills on it.

[industry.skill]: ../../industry/industry.skill.md
[spec.agent-skills.progressive-disclosure]: ./spec.agent-skills.progressive-disclosure.md
[s1]: https://agentskills.io/specification
