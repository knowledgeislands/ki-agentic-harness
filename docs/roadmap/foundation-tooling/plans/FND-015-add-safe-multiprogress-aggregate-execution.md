---
id: 'FND-015'
title: Unify governed entrypoints and in-process aggregate execution
status: in-progress
roadmap: foundation-tooling/add-safe-multiprogress-aggregate-execution
blocks: —
blocked-by: —
---

## Context

FND-010 completed stable, resize-aware terminal layout and truthful aggregate startup feedback.

Its aggregate bar still advances only when a child checker exits, so a checker with most of the planned items can make the global bar appear to jump from a small percentage directly to completion.

The first FND-015 refactor established that a checker’s actual operation is separate from its command-line argument handling: both direct use and the aggregate need the same plan/check operation. That makes the existing per-skill `audit.ts`/`conform.ts` pair and the identical `ki-vendors:` declaration unnecessary duplication.

## Current state

The canonical aggregate runner now imports each vendored `govern.ts` and calls its `plan`/`check` contract in-process for AUDIT and CONFORM. The old per-checker Bun launches, temporary capture files, and JSONL reparsing are removed. Whole-set EDUCATE and HELP retain their separately scoped local launcher boundary.

However, the first aggregate renderer introduced during that migration regressed FND-010's stable terminal presentation: it calculates bar width from changing detail text and begins rendering only after all plans are known. It must restore the fixed three-zone layout, resize-aware width calculation, truthful initialisation and plan-discovery states, narrow-terminal fallback, and coverage without restoring the old subprocess transport.

Every governed skill now owns one `scripts/govern.ts` rather than a `ki-vendors:` declaration and separate AUDIT/CONFORM launchers. Bootstrap vendors or source-links that standard entrypoint with its existing closure, while direct governed invocation retains canonical JSONL and direct terminal reporting.

The review also found other avoidable local process boundaries: bootstrap's local publisher/synchroniser/help/scaffold paths, tokenomics' local engines, and the user installer’s local hook installer. They have separate write, legacy-result, and user-install safety contracts, so they are explicitly out of scope. External commands (for example Git, Biome, formatters, package tools, Homebrew, and runtime CLIs) remain legitimate process boundaries.

## Steps

1. ✓ Replace the `ki-vendors:` contract with one governed-entrypoint convention: a configured governance skill owns `scripts/govern.ts`; process skills do not. The module exposes side-effect-free `plan` and `check` operations for AUDIT and CONFORM, with injected status tracking, and its guarded CLI dispatches `audit`, `conform`, `educate`, and `help`. Remove `KI_CHECKER_PLAN` and the legacy mode-entrypoint fallback from the bootstrap resolver, skills rubric, decision record, and documentation; do not retain compatibility parsing.
2. ✓ Move each configured skill's audit/conform construction and direct CLI parsing behind its `govern.ts` entrypoint. Preserve its existing direct arguments, canonical JSONL, terminal reporter, safe conform behaviour, and targeted testing. The thin legacy `audit.ts`/`conform.ts` entrypoints are removed once package keys and any direct references use `govern.ts <verb>`.
3. ✓ Change bootstrap to identify governed payloads through `scripts/govern.ts`, vendor or source-link that one entrypoint with its existing rubric/shared-module closure, and generate HELP snapshots from the standard governed contract. Retire `SCRIPT_MODES`, `vendorModesOf`, `vendorUnit`, and the generated `ki-audit`/`ki-conform` wrappers. Keep the retained whole-set EDUCATE coordinator under review as a separate boundary while `govern educate` routes through the same validated local mechanism.
4. ✓ Extract the generated aggregate runner from the `repo-bootstrap.ts` template into canonical `aggregate.ts`, copied and manifest-hashed into `.ki/bin/aggregate.ts`. Give it the same verb grammar as per-skill `govern.ts`; `audit` and `conform` own `--skill`, `--dry-run`, `--progress`, and `--reporter-levels`, while `educate` and `help` reject those irrelevant options. Rename the public generated command to `govern.ts` only if its package-free invocation remains clear; otherwise retain `aggregate.ts` as the generated whole-set name and reserve `govern.ts` for the per-skill contract.
5. ✓ Replace per-checker Bun launches, stdout/stderr capture files, JSONL reparsing, and child-progress transport with sequential in-process `plan`/`check` calls. Validate returned checker results and preserve selected-checker order, report order, exit semantics, failure isolation, and canonical direct-checker JSONL. No aggregate child process is permitted for a local governed checker.
6. ✓ Restore and extend the aggregate display contract: retain `--progress=auto|always|never`; keep the explicit single versus multi-row style selector; map direct status events into global progress continuously. Restore FND-010's fixed three-zone single-row layout, resize-aware width calculation, truthful initialisation and plan-discovery states, narrow-terminal fallback, and final-newline behaviour. Multi-row display gives each selected checker a stable, width-safe `AUDIT [ki-skills]`-style row with pending, active, completed, and failed states.
7. ✓ Restore focused contract, migration, renderer, and integration fixtures: startup and discovery before a total exists; stable wide/narrow/resize/non-TTY output; `auto`/`always`/`never`; a large active checker; zero-item and no-finding checkers; selected subsets; returned-error and thrown-error handling; direct `govern.ts` modes; source-harness links; ordinary copied payloads; deterministic final reports; and an explicit assertion that AUDIT/CONFORM aggregate execution makes no local checker subprocess launch. Re-vendor affected payloads, update HELP, decisions, and user guidance, then run serial repository gates.

## Files touched

- `skills/*/scripts/govern.ts` — one standard governed entrypoint per governance skill, replacing duplicate audit/conform wrappers.
- `skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/{aggregate.ts,repo-bootstrap.ts,resolve.ts}` — canonical aggregate source, governed-payload discovery, generated copy, manifest integration, and direct result validation.
- `skills/keystone/ki-skills/scripts/shared/checker.ts`, rubric, and tests — callable planning/status surface and removal of the obsolete vendor declaration requirement.
- `docs/decisions/ADR-KI-HARNESS-007-uniform-skill-modes-and-coverage-scoped-audit.md`, bootstrap feature/user guidance, and affected skill frontmatter — current-state governed-entrypoint contract.
- `skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/*test.ts` and shared-checker tests — contract, migration, display, ordering, source-link, and error fixtures.
- `.ki/` generated runner, checker, educator, and manifest payloads — refreshed from changed coverage-scoped sources.

## Verify

1. Every configured governance skill has exactly one `scripts/govern.ts`; no shipped governance skill retains `ki-vendors:` or a mode-specific checker entrypoint.
2. Direct `govern.ts audit|conform` output, `educate`, `help`, reporter filtering, `--progress=auto|always|never`, and FND-010 resize/narrow-width guarantees remain correct.
3. A large checker advances the aggregate default single bar continuously from its direct status events; its final report, JSONL, exit status, and item total match the direct governed baseline.
4. Multi-row output gives each selected checker a stable, correctly labelled state row and retains deterministic final report order.
5. Returned errors and thrown checker failures are diagnosed without parsing terminal text, fabricating item progress, leaking temporary state, or corrupting subsequent final output.
6. Aggregate execution remains sequential and does not launch Bun for selected local governed checkers.
7. An ordinary consumer receives a standalone copied governed payload; a source harness receives only manifest-proven contained source links.
8. `bun skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts .` succeeds after coverage-scoped source changes.
9. `bun run test` and then `bun run ki:audit` pass.

## Dependencies / blocks

FND-010 remains complete: it owns the stable single-row layout that this plan reuses rather than revises.

The bootstrap-internal, tokenomics-engine, and user-installer local-process candidates found by this review need separately scoped follow-ups; this plan changes no external-tool or test/evaluation process boundary.

The completed `ki-self` review reconciled the source-harness linked-payload rule, the deliberately local `.ki/self/skill/` exception in the generic skill checker, and stale `.ki-self/` documentation. This plan may now resume.

## Delegation

- Round 1 — research: ✓ mapped aggregate runner entry points, imports, result contracts, and progress ownership; files: read-only aggregate and shared checker/reporter scope; gate: minimal in-process orchestration design.
- Round 1 — research: ✓ inventoried production child-process calls and classified external-tool, CLI/test, and avoidable local-module boundaries; files: read-only source scope; gate: evidence-backed refactor candidates.
- Round 2 — judgment: revise this plan around the settled direct-call architecture and separately scoped follow-ups; files: this plan and any affected roadmap items; gate: user review before implementation.
- Orchestrator: reconcile worker findings, review every proposal against process isolation and standalone-vendored constraints, and commit only the revised planning record.
