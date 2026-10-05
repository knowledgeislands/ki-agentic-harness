# AGENTS.md — ki-agentic-harness

**This is the common, runtime-neutral orientation** for any agent working in this repo — the [open agents.md standard](https://agents.md/), read directly by Codex and imported by `CLAUDE.md` for Claude Code. Put shared guidance here; keep only genuinely runtime-specific notes in per-runtime files.

The README is the entry point; the website-owned [skills-by-outcome guide](https://knowledgeislands.info/guidance/skills/by-outcome/), generated [capability catalogue](skills/README.md#generated-capability-catalogue), and [roadmap](ROADMAP.md) supply detail. This file is the short anchor.

## What this repo is

The canonical home for reusable Knowledge Islands agentic capabilities. The [README](README.md) owns the four-part source layout and current repository status; the website-owned [skills-by-outcome guide](https://knowledgeislands.info/guidance/skills/by-outcome/) owns task-oriented selection, while the generated [capability catalogue](skills/README.md#generated-capability-catalogue) publishes exact membership and declared dependencies.

## How skills relate

The `ki-skills` skill and its cited decisions own the dependency, optional-augmentation, shared-module, and repository-variation contracts. Do not restate or fork those contracts here.

## Working here

- **Cross-repository work** → use `ki-trades` for the portable contract. The receiving repository retains priority, execution, and acceptance authority.
- **Skill work** → use `ki-skills` for `SKILL.md`, rubric, dependency, collision, and cross-skill consistency concerns.
- **Markdown and TOML** → use `ki-authoring` for formatting, authored shape, and knowledge placement.
- **TypeScript and Bun** → use `ki-engineering` for code, tests, package scripts, and toolchain configuration.
- **Git** → use `ki-git` for portable commit and hygiene policy. This repository's local delta is a solo direct-to-`main` workflow with no PR gate; branches remain available for an isolated review boundary. Its pre-commit hook runs `lint-staged`, TypeScript for staged `.ts` changes, and a staged-snapshot `ki-skills` audit for touched skill roots.
- **Verification** → run `bun run test`, `bunx tsc --noEmit`, and the relevant focused `ki repo audit --skill <skill>` sequentially. Record fleet findings separately from failures in the contract under change.

## Paperclip local delivery

The cross-company operational programme and [recovery checkpoint](../ki-arcadia-principal/+/_CHECKPOINTS/paperclip-bootstrap-and-recovery.md) are owned by Arcadia Principal. This harness retains reusable coordination capabilities and its own delivery policy.

This repository currently delivers to the principal's laptop, in its designated primary checkout on local `main`. The `ki-agent-coordination-paperclip` skill owns the shared local-delivery semantics, worktree naming and prerequisite for a reviewed remote-delivery policy; this file supplies only the repository's operating choice and authority grant.

Use `ki-agent-coordination-paperclip` for task-to-repository delivery and recovery. This repository selects `worktrees-with-local-integration`: Wright implements in isolation, Steward reviews the exact commit, and Convenor owns local integration and the visible result.

The Knowledge Islands Convenor (`4b312799-a51c-43c4-876e-161b1f6ce4c2`, company `558dd49e-7615-409f-b7b2-7f19e22171d9`) may merge approved, verified harness deliveries into this repository's local `main`. Eligible work is an approved Ready item or explicitly scoped direct user instruction. The grant covers local non-force integration only, using a fast-forward or `--no-ff` merge; it grants no push, release, deployment, KI acceptance or deletion of retained work.

Steward (`61d06d85-a1c0-4505-a043-4a8f3a66286b`) must review the exact candidate independently of its author. Required evidence is the governing scope, source and destination commits, `bun run test`, `bunx tsc --noEmit`, and relevant focused audits against the proposed combined result. Convenor must establish the serialised Git write window required by `ki-git` before advancing the primary checkout and record the resulting `main` commit. A changed candidate returns to review; an ordinary destination advance requires revalidation, not a fresh approval of unchanged scope.

This grant remains valid until the principal revokes or changes it. Recovery starts with one harness delivery at a time; do not expand concurrency until one cycle has demonstrated review, local integration, evidence return and safe workspace retirement. Other repositories require their own integration grants. Paperclip completion does not accept a KI work item.

## Toolchain

[Bun](https://bun.sh) is the install and development runtime; `ki` is the repository-governance executor.

```bash
ki repo audit --skill ki-skills             # current proven skill-quality audit
ki repo conform --skill ki-skills --dry-run # validate and report safe proposals
ki dev skill rubric ki-skills               # verify generated rubric publication
bun run test                                # harness source tests
bunx tsc --noEmit                           # TypeScript gate
```
