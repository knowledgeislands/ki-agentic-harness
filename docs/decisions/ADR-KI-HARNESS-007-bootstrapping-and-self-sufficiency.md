# ADR-KI-HARNESS-007: The bootstrapping chain and the self-sufficiency contract

**Date:** 2026-07-09

## Context

A repo is brought under Knowledge Islands governance in two situations the earlier "install the skills, then run them" model served poorly: a greenfield repo with nothing installed, and a legacy ki-repo carrying old formats that must be migrated. Requiring the full skill set to be installed first makes onboarding heavy and couples every repo to a global install. The mechanical-first stance ([ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-mechanical-first-llm-optional.md)) already lets the scripts run without an LLM; the remaining step is to let them run without the skill installed at all.

## Decision

Governance bootstraps through a single chain, runnable from the remote source with no skill installed locally.

- `ki-bootstrap` is the minimal chain-starter — kept globally installed only to keep the global surface tiny. It always pulls `ki-repo`; from there each skill's INIT (its `scripts/bootstrap.ts`) declares and triggers the skills it `implies:`.
- INIT satisfies the **self-sufficiency contract**: into the target repo it (1) **vendors copies** of its mechanical scripts (SCRIPT-7 — copies, not symlinks, so they run standalone), (2) installs that skill's `ki:<suffix>:{init,audit,conform}` package.json keys pointing at the vendored copies, and (3) installs or refreshes the repo-wide `ki:audit` / `ki:conform` / `ki:init` aggregates that fan out across every applicable skill.
- The new / legacy / tracking modes are aggressiveness flags over this one chain, not a separate orchestrator: new = INIT; legacy = INIT + full CONFORM (the migration path); tracking = AUDIT + mechanical CONFORM.

## Consequences

- After bootstrap a repo governs itself with `bun run ki:audit` and zero skills installed.
- A greenfield repo and a legacy ki-repo migrate by the same remote-run flow; the only difference is the aggressiveness flag.
- Vendored script copies are re-synced whenever INIT or CONFORM re-runs, so a REFRESH that changes a checker propagates on the next run.
- The remote-run transport is a documented `bun run <raw-github-url>` one-liner against the harness on GitHub — no publish step, pinned to a ref (branch or tag). A skill's INIT is reached as `bun run https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/<ref>/skills/<skill>/scripts/bootstrap.ts <target>`; `ki-bootstrap` starts the chain the same way.

## References

- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-mechanical-first-llm-optional.md) — the mechanical-first stance this depends on.
- [ADR-KI-HARNESS-SKILLS-001](ADR-KI-HARNESS-SKILLS-001-canonical-modes.md) — INIT as the universal mode whose mechanical half is `scripts/bootstrap.ts`.
- [skills/ki-bootstrap/SKILL.md](../../skills/ki-bootstrap/SKILL.md) — the chain-starter keystone.
- [enforcement-framework.md](../../skills/ki-engineering/references/enforcement-framework.md) §5 — INIT and the self-sufficiency contract.
