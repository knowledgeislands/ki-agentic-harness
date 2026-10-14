# Diagrams

This repository explains itself in a maintained set of Archify diagrams. Each answers one question, is traced from named source files, and is listed with its staleness trigger and regeneration prompt in [`diagrams.toml`](diagrams.toml).

## Skill map

What skills does the harness hold, in which source concern does each live, and what shape is each? The map is generated from the `skills/<concern>/<skill>/` layout and every `SKILL.md`'s `ki-kind` and `ki-applicability` frontmatter by `ki-repo-harness`. Each region is one concern; colour and sublabel give the shape, from governance that is baseline in every repository, through governance that applies where its evidence is detected or where `.ki.toml` declares it, to processes invoked by name like a command.

![Knowledge Islands skill map](skill-map.svg)

## Skill graph

Which skills rely on which other skills, and is each reliance composition or optional augmentation? The graph is generated from every `SKILL.md`'s `ki-depends-on` and `ki-optional-depends-on` frontmatter by `ki-repo-harness`, so it cannot drift from the declarations: a solid arrow is composition, a dashed arrow is optional augmentation, and every skill sits above everything it relies on. Nodes share the skill map's colours and name their concern; skills with no declared relationship appear only on the map.

![Knowledge Islands skill graph](skill-graph.svg)
