# Project repository standard

## Primary structure

A KI repository has one kind owned by `ki-repo`: Project or Knowledge Base. Project is the default when `[skills.ki-repo]` omits `repo_type`; a Knowledge Base declares `repo_type = "kb"`. The matching `ki-repo-project` or `ki-repo-kb` skill supplies that kind's structure contract. An ordinary non-KB repository is a Project, not a third kind.

Project shape skills compose. `ki-repo` resolves the primary shape from the declared core shapes, requiring `[skills.ki-repo].primary_shape` when several apply. Website implementation and hosting skills refine the website shape. This skill explains that model but does not infer a competing classification. Governance capabilities such as `ki-engineering` supply prerequisites or independently applicable standards; they are not shapes.

Project does not select a work tracker. `[skills.ki-work]` separately selects `roadmap`, `github-issues`, or `linear`. A Knowledge Base selects its Streams process through `ki-repo-kb-streams`.

## Inheritance

Every Project repository inherits the `ki-repo` baseline. A specialised structure may add layout, toolchain, deployment, or publication rules, but it must not silently redefine the primary classification or install a second change tracker.

## Change boundary

Changing Project to KB or KB to Project changes the repository's primary contract. Treat it as an explicit migration: decide the destination tracker, migrate canonical records, update configuration atomically, and verify the destination structure before removing the source declaration.
