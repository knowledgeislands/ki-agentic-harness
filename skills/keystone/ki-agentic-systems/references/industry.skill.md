---
id: industry.skill
title: Skill
type: term
status: agreed
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, CARD-SKILL a) (Kris, 12 November 2026)
links:
  industry.agent-harness:
    predicate: ki:extends
  spec.agent-skills:
    predicate: dcterms:conformsTo
  spec.agent-skills.progressive-disclosure:
    predicate: skos:related
---

# Skill

A skill is a common way to extend any [agent harness][industry.agent-harness] with knowledge and procedures, so the same capability works across harnesses and costs the agent little until it is needed.

It keeps that cost low through [progressive disclosure][spec.agent-skills.progressive-disclosure]: the agent holds only the skill's name and description until a task calls for it, then reads its instructions, then the files it bundles. A skill is built as a folder holding a `SKILL.md`, under the [Agent Skills specification][spec.agent-skills].

Tools, instruction files and plugins are not skills: a tool is an action the harness carries out, an instruction file is always loaded, and a plugin is a bundle that can carry skills.

## Our conventions

Every skill in the KI harness's `skills/` folder is a skill in this sense. The `ki-skills` skill governs how they are written, and adds the system's own front-matter metadata, such as `ki-kind`, within what the specification allows.

## Next

The machine card, still to come.

[industry.agent-harness]: ./industry.agent-harness.md
[spec.agent-skills.progressive-disclosure]: ./spec.agent-skills.progressive-disclosure.md
[spec.agent-skills]: ./spec.agent-skills.md
