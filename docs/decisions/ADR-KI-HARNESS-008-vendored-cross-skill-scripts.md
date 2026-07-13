# ADR-KI-HARNESS-008: Vendored cross-skill scripts for harness-shaped targets

**Date:** 2026-07-13

## Context

[ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md) fixed bootstrap's one job as building `.ki-meta/` — a per-skill vendored `audit`/`conform`/`help` unit for each skill in the resolved set, plus the four `bin/` wrappers over the `aggregate.ts` runner — and barred it from ever touching `package.json`. That surface is enough for any ordinary target: a KB, a tap, an MCP server, or a code repo self-audits against the standards that govern it. But one class of target needs more. A new independent harness — a repo whose own governance job is to author and operate a `skills/` tree — carries a `ki-harness` structure skill whose Mode INIT scaffolds `package.json` keys (`ki:skills:graph`, `ki:skills:help`, `ki:skills:link:global`, `ki:skills:status`, `ki:skills:unlink`) that operate on the whole skills tree at once: validate the `implies:` graph, render HELP blocks and the skills index, and symlink-install skills into a Claude skills directory. Those keys named implementations that existed nowhere in the scaffolded repo — a self-sufficiency gap: the per-skill vendored units are the wrong shape, because these tools are cross-skill (they range over every `SKILL.md`), not per-skill mechanical checkers.

## Decision

The bootstrap engine (`skills/keystone/ki-bootstrap/scripts/bootstrap.ts`) vendors three cross-skill operational scripts into a target's `.ki-meta/bin/`, but only when the resolved skill set includes `ki-harness`.

- **The three scripts.** `skill-graph.ts` validates and renders the `implies:` dependency graph across every `SKILL.md` (a `--check` gate and a `--tree` render); `skill-help.ts` renders a skill's HELP block and the skills index, with `--check` guarding catalogue coverage; `sync-skills.ts` symlink-installs skills into a Claude skills directory (`link`/`unlink`/`status`).
- **Engine-level, not per-skill.** These are cross-skill tools that range over the whole tree, so they are vendored by an engine-level rule rather than through the per-skill `vendors:` frontmatter grammar — which is a per-skill, per-mode `{audit, conform, init, help}` contract and cannot express a whole-tree tool. They belong to the same engine-level class as the `aggregate.ts` runner and the four `bin/` wrappers, which are likewise engine artifacts and not per-skill declarations.
- **Harness-gated.** The copy happens only when `ki-harness` is in the resolved set. A non-harness target — a KB, a tap, an MCP server, a code repo — has no `skills/` tree to operate on and does not receive them. This keeps the vendored surface minimal and matches the coverage-scoping principle: a target carries only the machinery its declared coverage warrants.
- **Canonical home is `skills/keystone/ki-bootstrap/scripts/`.** The three scripts move there from the harness repo root `scripts/`. `ki-harness` owns the standard for the `package.json` keys; `ki-bootstrap` owns the machinery, and the engine already shells to `skill-help.ts` at vendor time to render the per-skill HELP snapshots, so co-locating them makes the engine self-contained.
- **Vendored copies are manifest-hashed and regenerable.** They land in `.ki-meta/bin/` alongside `aggregate.ts` and the wrappers, each recorded with its sha256 in `.ki-meta/manifest.json` like every other vendored file, so drift and tamper are caught the same way. Deleting `.ki-meta/` and re-running INIT regenerates them; they are authored nowhere in the target.

## Consequences

- A newly bootstrapped harness is self-sufficient: the `ki:skills:*` keys its `ki-harness` INIT scaffolds now resolve to real implementations under `.ki-meta/bin/`, closing the gap where they named scripts that did not exist. The self-sufficiency contract of ADR-006 extends to the cross-skill surface, not just the per-skill one.
- The vendored surface stays minimal for the common case. Every ordinary target's `.ki-meta/` is unchanged — the three scripts appear only where a `ki-harness` skill is present — so the harness-gating both honours coverage-scoping and avoids shipping whole-tree tooling to repos with no tree to run it against.
- This repo dogfoods the rule: its own operational `ki:skills:*` keys point at the vendored `.ki-meta/bin/` copies. The one exception is the `test` and CI `--check` invocations, which stay pointed at the canonical `skills/keystone/ki-bootstrap/scripts/` sources — so the gate exercises a fresh edit before it is re-vendored rather than testing a stale copy. The set-based bootstrap audit checks vendored skill names and count, not file content, so it would not flag a stale vendored script; keeping the gate on the canonical sources is what catches a broken edit.
- The engine grows a second vendoring class beside the per-skill `vendors:` grammar. The distinction is now explicit and load-bearing: per-skill mechanical units are declared in each skill's frontmatter and vendored per skill; cross-skill tools and the runner/wrappers are engine artifacts vendored by engine rule. A future whole-tree tool follows this precedent rather than being forced into the per-skill grammar.

## References

- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md) — the self-sufficiency contract and the `.ki-meta/` build job this amends.
- [ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-uniform-skill-modes-and-coverage-scoped-audit.md) — the coverage-scoped vendoring this harness-gating aligns with.
