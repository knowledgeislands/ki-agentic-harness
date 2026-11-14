# Project repository standard

## Primary structure

A KI repository explicitly declares one kind owned by `ki-repo`: `repo_type = "project"` or `repo_type = "kb"`. Both kinds require `primary_shape` in the same `[skills.ki-repo]` table. A general Project selects its declared `ki-repo-project` baseline; a Knowledge Base selects its declared `ki-repo-kb` baseline. There is no implicit kind or primary shape.

Project shape skills compose. A Project's required `[skills.ki-repo].primary_shape` names its selected declared core shape; it may instead name the general `ki-repo-project` baseline. Website implementation and hosting skills refine the website shape. This skill explains the `ki-repo` model but does not infer a competing classification. Governance capabilities such as `ki-engineering` supply prerequisites or independently applicable standards; they are not shapes.

Project does not select a work tracker. `[skills.ki-work]` separately selects `roadmap`, `github-issues`, or `linear`. A Knowledge Base selects its Streams process through `ki-repo-kb-streams`.

## Inheritance

Every Project repository inherits the `ki-repo` baseline. A specialised structure may add layout, toolchain, deployment, or publication rules, but it must not silently redefine the primary classification or install a second change tracker.

## Commit gate

The general Project shape's commit gate is check-only: its canonical hooks, with and without a `package.json`, compose the `ki-repo` frame with the `ki-engineering` package lines or the `ki-authoring` staged-Markdown line and nothing more, published as worked examples under [`assets/githooks/`](../assets/githooks/); copy them exactly, since `ki-repo` HOOK-4 compares each hook byte for byte ([ADR-KI-HARNESS-SKILLS-017](../../../../docs/decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content-are-owned-separately.md)). The `ki repo audit --skill ki-repo` of the inherited repository contract runs in CI, not at commit time, as Kris chose COMMIT-VS-CI a) on 26 October 2026. GATE-1 checks that content where `ki-repo-project` is the declared primary shape and a committed hook exists, failing any `ki repo audit`, `ki repo conform`, `ki repo repair`, `--fix` or `--write` line; specialised primary shapes retain their own gates even when they also declare Project orientation; `ki-repo` retains existence, binding and canonical-text ownership. No audit, test suite, rewriting operation or network access belongs in this gate.

The hook calls no `ki`, so no provider call can start from a commit; where an audit is run offline, `KI_REPO_OFFLINE=1` makes the `ki-repo` collector select local evidence before authentication. Hosted settings remain outside this gate; ordinary full audits keep their provider checks.

## Change boundary

Changing Project to KB or KB to Project changes the repository's primary contract. Treat it as an explicit migration: decide the destination tracker, migrate canonical records, update configuration atomically, and verify the destination structure before removing the source declaration.
