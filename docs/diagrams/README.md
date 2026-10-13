# Diagrams

This repository explains itself in a maintained set of Archify diagrams. Each answers one question, is traced from named source files, and is listed with its staleness trigger and regeneration prompt in [`diagrams.toml`](diagrams.toml).

## Skill graph

Which skills rely on which other skills, and is each reliance composition or optional augmentation? The graph is generated from every `SKILL.md`'s `ki-depends-on` and `ki-optional-depends-on` frontmatter by `ki-repo-harness`, so it cannot drift from the declarations: a solid arrow is composition, a dashed arrow is optional augmentation, and every skill sits above everything it relies on.

![Knowledge Islands skill graph](skill-graph.svg)
