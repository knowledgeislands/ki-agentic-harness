# ADR-KI-HARNESS-007: The bootstrapping chain and the self-sufficiency contract

**Date:** 2026-07-09

## Context

A repo is brought under Knowledge Islands governance in two situations the earlier "install the skills, then run them" model served poorly: a greenfield repo with nothing installed, and a legacy Knowledge Islands repo carrying old formats that must be migrated. Requiring the full skill set to be installed first makes onboarding heavy and couples every repo to a global install. The mechanical-first stance ([ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-mechanical-first-llm-optional.md)) already lets the scripts run without an LLM; the remaining step is to let them run without the skill installed at all.

## Decision

Governance bootstraps through a single chain, runnable from the remote source with no skill installed locally.

- The bootstrap is the minimal chain-starter — kept globally installed only to keep the global surface tiny. It always pulls in the repo standard; from there each skill's INIT (its `scripts/bootstrap.ts`) declares and triggers the skills it `implies:`.
- INIT satisfies the **self-sufficiency contract**, and does so **without requiring the target to have a `package.json`** — a non-code repo (dotfiles, KB, tap) is bootstrapped the same way. Into the target repo it (1) **vendors copies** of each skill's mechanical scripts (copies, not symlinks, so they run standalone) under a dot-prefixed, generated-not-authored `.ki-meta/<skill>/` — kept off the repo's own `scripts/` — (2) writes a `.ki-meta/aggregate.ts` runner that discovers those copies on the filesystem (it does **not** read `package.json`) and fans out across them for a given verb, and (3) writes an executable `bin/ki-audit` wrapper — the `package.json`-free entry point. Where the target **does** have a `package.json`, INIT additionally installs that skill's `ki:<suffix>:{init,audit,conform}` keys and the repo-wide `ki:audit` / `ki:conform` / `ki:init` aggregates as convenience aliases over the same runner. The npm-script wiring is thus an _additive_ code-repo convenience, not the contract.
- The new / legacy / tracking modes are aggressiveness flags over this one chain, not a separate orchestrator: new = INIT; legacy = INIT + full CONFORM (the migration path); tracking = AUDIT + mechanical CONFORM.
- A confirmed Knowledge Islands repo that carries no self-check runner (`bin/ki-audit` or `.ki-meta/aggregate.ts`) is a **FAIL** in the repo standard — a `.ki-config.toml` marker without a way to run the checks is incomplete. There is no WARN ramp: the fleet re-bootstraps to the new form.

## Consequences

- After bootstrap a repo governs itself with `./bin/ki-audit` (or `bun run ki:audit` where a `package.json` exists) and zero skills installed.
- A greenfield repo and a legacy Knowledge Islands repo migrate by the same remote-run flow; the only difference is the aggressiveness flag.
- Vendored script copies are re-synced whenever INIT or CONFORM re-runs, so a REFRESH that changes a checker propagates on the next run.
- The remote-run transport is a documented `bun run <raw-github-url>` one-liner against the harness on GitHub — no publish step, pinned to a ref (branch or tag). A skill's INIT is reached as `bun run https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/<ref>/skills/<skill>/scripts/bootstrap.ts <target>`; the bootstrap starts the chain the same way.
- The self-sufficiency mechanics live **once**, in the bootstrap's chain engine (`scripts/bootstrap.ts`): it discovers each skill's checker/conform scripts by naming convention, resolves the `implies:` closure, vendors the copies into `.ki-meta/`, writes the `.ki-meta/aggregate.ts` runner and `bin/ki-audit` wrapper, and (where a `package.json` exists) wires the convenience keys. Each other skill's `scripts/bootstrap.ts` is a **thin delegator** that execs that engine with itself as an explicit `--seed`. Delegating by subprocess is composition — running a sibling in sequence — not a cross-skill import, so every skill keeps its INIT mechanical half without duplicating the engine and stays valid standalone (the standalone-validity requirement of [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md), earlier in the reading order).

## References

- [ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-mechanical-first-llm-optional.md) — the mechanical-first stance this depends on.
- [ADR-KI-HARNESS-SKILLS-001](ADR-KI-HARNESS-SKILLS-001-canonical-modes.md) — INIT, the universal mode whose mechanical half is `scripts/bootstrap.ts`; the role it plays in bootstrapping is set out above.
