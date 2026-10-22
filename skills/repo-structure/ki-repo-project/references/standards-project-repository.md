# Project repository standard

## Primary structure

A KI repository explicitly declares one kind owned by `ki-repo`: `repo_type = "project"` or `repo_type = "kb"`. Both kinds require `primary_shape` in the same `[skills.ki-repo]` table. A general Project selects its declared `ki-repo-project` baseline; a Knowledge Base selects its declared `ki-repo-kb` baseline. There is no implicit kind or primary shape.

Project shape skills compose. A Project's required `[skills.ki-repo].primary_shape` names its selected declared core shape; it may instead name the general `ki-repo-project` baseline. Website implementation and hosting skills refine the website shape. This skill explains the `ki-repo` model but does not infer a competing classification. Governance capabilities such as `ki-engineering` supply prerequisites or independently applicable standards; they are not shapes.

Project does not select a work tracker. `[skills.ki-work]` separately selects `roadmap`, `github-issues`, or `linear`. A Knowledge Base selects its Streams process through `ki-repo-kb-streams`.

## Inheritance

Every Project repository inherits the `ki-repo` baseline. A specialised structure may add layout, toolchain, deployment, or publication rules, but it must not silently redefine the primary classification or install a second change tracker.

## Commit gate

The general Project shape owns a staged, check-only `ki repo audit --skill ki-repo` commit gate over its inherited repository contract. Both package variants run it through the canonical quiet-audit helper after their staged lint. GATE-1 checks this content where `ki-repo-project` is the declared primary shape and a committed hook exists; specialised primary shapes retain their own gates even when they also declare Project orientation; `ki-repo` retains existence, binding and canonical-text ownership. No full audit, test suite, rewriting operation or network access belongs in this gate. Its canonical hooks, with and without a `package.json`, compose the `ki-repo` frame with the `ki-engineering` package lines or the `ki-authoring` staged-Markdown line, followed by this focused audit, published as worked examples under [`assets/githooks/`](../assets/githooks/); copy them exactly, since `ki-repo` HOOK-4 compares each hook byte for byte ([ADR-KI-HARNESS-SKILLS-017](../../../../docs/decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content-are-owned-separately.md)).

The Project hook prefixes both audit attempts with `KI_REPO_OFFLINE=1`. The `ki-repo` collector selects local evidence before authentication, so even a hosted origin with an authenticated GitHub CLI cannot trigger a remote call. Hosted settings remain outside this gate; ordinary full audits keep their provider checks.

## Change boundary

Changing Project to KB or KB to Project changes the repository's primary contract. Treat it as an explicit migration: decide the destination tracker, migrate canonical records, update configuration atomically, and verify the destination structure before removing the source declaration.
