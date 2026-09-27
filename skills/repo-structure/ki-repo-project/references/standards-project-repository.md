# Project repository standard

## Primary structure

A KI repository explicitly declares one kind owned by `ki-repo`: `repo_type = "project"` or `repo_type = "kb"`. Both kinds require `primary_shape` in the same `[skills.ki-repo]` table. A general Project selects its declared `ki-repo-project` baseline; a Knowledge Base selects its declared `ki-repo-kb` baseline. There is no implicit kind or primary shape.

Project shape skills compose. A Project's required `[skills.ki-repo].primary_shape` names its selected declared core shape; it may instead name the general `ki-repo-project` baseline. Website implementation and hosting skills refine the website shape. This skill explains the `ki-repo` model but does not infer a competing classification. Governance capabilities such as `ki-engineering` supply prerequisites or independently applicable standards; they are not shapes.

Project does not select a work tracker. `[skills.ki-work]` separately selects `roadmap`, `github-issues`, or `linear`. A Knowledge Base selects its Streams process through `ki-repo-kb-streams`.

## Inheritance

Every Project repository inherits the `ki-repo` baseline. A specialised structure may add layout, toolchain, deployment, or publication rules, but it must not silently redefine the primary classification or install a second change tracker.

## Change boundary

Changing Project to KB or KB to Project changes the repository's primary contract. Treat it as an explicit migration: decide the destination tracker, migrate canonical records, update configuration atomically, and verify the destination structure before removing the source declaration.
