# KI-HARNESS-REV-001 review evidence

This directory records the reviewed and approved evidence for [KI-HARNESS-REV-001][rev-001-record].

- **Immutable baseline:** `94f0b775903286fcf37c0ec050d5568672a5154f`
- **Inventory:** [50-skill baseline](inventory.md)
- **Approval matrix:** [approved grades and dispositions](approval-matrix.md)
- **Candidate routes:** [approved deduplicated clusters](candidate-clusters.md)
- **Action routing:** [coded follow-ups and external observations](actions.md)
- **Audit remediation:** [complete report-only classification and promotion evidence](audit-remediation-review.md)
- **Standing-guidance review:** recorded in the roadmap item
- **Grading:** approved on 2026-08-12; evidence grades describe current proof and false-assurance risk, not intrinsic quality
- **Remediation:** all approved Phase 1–6 repairs are applied

## Common record

Every skill review records the same evidence:

1. Identity, review position, kind, declared dependencies, and dependency-order result.
2. Source-list presence or an explicit decision that one is unnecessary; current source checks and watch-items where applicable.
3. Exact repository and focused mechanical audit evidence, structured-rubric presence, and focused tests.
4. Selection effectiveness: trigger quality, false activation, off-ramps, and standing context cost.
5. Outcome effectiveness: assisted-versus-baseline evidence, negative evidence, and unnecessary ceremony.
6. Instruction economy: body size, progressive disclosure, repeated detail, tool round-trips, and automation opportunities.
7. Architecture and ownership: scope, portability, dependencies, shared modules, collisions, and correct delivery shape.
8. Executability and safety: commands, runtime assumptions, authority, stop conditions, recovery, and examples.
9. Evidence quality: eval scenarios, result limitations, fixture coverage, and false-positive or false-negative risk.
10. Explicit gaps, one proposed disposition, and any candidate findings in the `ki-skills` candidate shape.

The allowed proposed dispositions are `retain`, `revise`, `consolidate`, `split`, `replace with automation`, and `retire`. They are recommendations, not grades or accepted work.

## Cumulative calibration

Each completed review or phase may expose a reusable effectiveness check. Distil that pattern here once, without copying the originating skill's line-by-line findings. Apply the resulting checklist to every later review, and recheck the earlier records against the complete checklist during final synthesis. A new pattern supplements the common record; it does not silently change a normative skill rubric or authorise remediation.

- Separate structural conformance from demonstrated outcome value; a clean audit is not effectiveness evidence.
- For every deterministic contract, trace criterion policy through inspector output, published catalogue, host-visible result, and focused tests. Reject orphan finding codes, incorrect criterion mappings, and tests that assert raw inspector output while missing the hosted outcome.
- Mechanise deterministic evidence as far as practical while leaving usefulness, authority, and other genuine judgment visibly unevaluated rather than manufacturing a pass.
- Test the contract users depend on, including negative paths, false positives, false negatives, failure propagation, and assisted-versus-baseline value, rather than only file shape or recall.
- Classify source authority explicitly, refresh volatile runtime and platform claims, and reconcile current primary sources with local standards and decision records.
- Give each semantic rule and lifecycle transition one owner; detect duplicated or contradictory guidance across skills, standards, processes, and standing instructions.
- Resolve selected adapters, dependencies, repository kinds, and runtime capabilities rather than validating only a literal name or assuming a local implementation path.
- Treat identifiers, locators, namespace moves, aliases, and record migrations as explicit continuity contracts; do not assume a displayed key is stable identity.
- Verify that approval scope and integrity cannot widen through unparsed prose, duplicate identifiers, stale reads, or an unverified handoff between producers and consumers.
- Make failures and unavailable evidence fail closed; never translate an error, unsupported runtime, or incomplete observation into clean state.
- Reconcile exact schemas and state machines across every producer and consumer, including completion, abandonment, replacement, retention, and recovery paths.
- Keep descriptions and operational claims within demonstrated execution capability; configuration or guidance alone must not imply that a process can execute.
- Exercise destructive and filesystem boundaries with exact roots, containment, regular-file and symlink checks, retention guards, and independently resolved targets.
- Count ceremony, loaded context, repeated procedures, and tool round-trips as costs; retain them only where evidence shows a portable benefit.
- Treat aggregate composition as unverified until child schemas, selected adapters, identities, and fixtures demonstrate one owner-selected contract.
- Separate generated shape, source freshness, installed activation, and runtime availability; evidence for one layer does not transfer to another.
- Assign each parent/child producer-consumer seam one mechanical owner and validate normalized, parsed, exact handoff evidence.
- Treat target binaries, package managers, installers, and external validators as side-effecting unless an authorised isolation boundary proves otherwise.
- Align applicability declarations, structure detection, host selection, published rubric families, and negative fixtures as one contract.
- Separate canonical source, render, applied target, registration, installation, activation, and loaded runtime capability.
- Report name parity, configuration state, authentication, reachability, and usable tools as distinct claims.
- Limit runtime passes to direct observations; effective model, context, memory use, and active tools require authorized session evidence.
- Distinguish source checkout, verified payload, development source, activation links, declaration, and executed runtime capability.
- Verify guidance-only command examples against the installed executable even when no native rubric is warranted.
- Require dated longitudinal primary evidence for temporal-stability claims; a current clean estate proves only present agreement.

## Progress

Phase 0, dependency ordering, and all 50 baseline skill reviews are complete. All baseline grades and dispositions are approved and applied. The current catalogue has 51 skills after the `ki-communication` retirement and the addition of two runtime-specific subagent adapters.

| #  | Skill                                        | Review   | Change state | Evidence   |
| -: | -------------------------------------------- | -------- | ------------ | ---------- |
| 1  | [`ki-skills`](ki-skills.md)                  | complete | applied      | `ba4bd18a` |
| 2  | [`ki-authoring`](ki-authoring.md)            | complete | applied      | `ba4bd18a` |
| 3  | [`ki-git`](ki-git.md)                        | complete | applied      | `ba4bd18a` |
| 4  | [`ki-engineering`](ki-engineering.md)        | complete | applied      | `ba4bd18a` |
| 5  | [`ki-repo`](ki-repo.md)                      | complete | applied      | `ba4bd18a` |
| 6  | [`ki-delegation`](ki-delegation.md)          | complete | applied      | `ba4bd18a` |
| 7  | [`ki-change-management`](ki-change-management.md) | complete | applied  | `76173ee7` |
| 8  | [`ki-change-management-roadmap`](ki-change-management-roadmap.md) | complete | applied | `76173ee7` |
| 9  | [`ki-change-management-github-issues`](ki-change-management-github-issues.md) | complete | applied | `76173ee7` |
| 10 | [`ki-change-management-linear`](ki-change-management-linear.md) | complete | applied | `76173ee7` |
| 11 | [`ki-change-management-housekeeping`](ki-change-management-housekeeping.md) | complete | applied | `76173ee7` |
| 12 | [`ki-recap`](ki-recap.md)                     | complete | applied      | `76173ee7` |
| 13 | [`ki-next`](ki-next.md)                       | complete | applied      | `a1483153` |
| 14 | [`ki-plan`](ki-plan.md)                       | complete | applied      | `a1483153` |
| 15 | [`ki-batch`](ki-batch.md)                     | complete | applied      | `cab06c4e` |
| 16 | [`ki-implement`](ki-implement.md)             | complete | applied      | `cab06c4e` |
| 17 | [`ki-accept`](ki-accept.md)                   | complete | applied      | `7143bf33` |
| 18 | [`ki-decision-records`](ki-decision-records.md) | complete | applied | `4dfd435f` |
| 19 | [`ki-specs`](ki-specs.md)                     | complete | applied      | `4dfd435f` |
| 20 | [`ki-guides`](ki-guides.md)                   | complete | applied      | `4dfd435f` |
| 21 | [`ki-checkpoint`](ki-checkpoint.md)           | complete | applied      | `4dfd435f` |
| 22 | [`ki-trades`](ki-trades.md)                   | complete | applied      | `4dfd435f` |
| 23 | [`ki-trade`](ki-trade.md)                     | complete | applied      | `4dfd435f` |
| 24 | [`ki-agora`](ki-agora.md)                     | complete | applied      | `4dfd435f` |
| 25 | [`ki-communication`](ki-communication.md)     | complete | retired      | `e35cb1e5` |
| 26 | [`ki-subagents`](ki-subagents.md)             | complete | applied      | `f27f9d76` |
| 27 | [`ki-repo-project`](ki-repo-project.md)       | complete | applied      | `13d99a33` |
| 28 | [`ki-repo-kb-activities`](ki-repo-kb-activities.md) | complete | applied | `13d99a33` |
| 29 | [`ki-repo-kb-live-artifacts`](ki-repo-kb-live-artifacts.md) | complete | applied | `13d99a33` |
| 30 | [`ki-repo-kb-streams`](ki-repo-kb-streams.md) | complete | applied      | `13d99a33` |
| 31 | [`ki-repo-kb`](ki-repo-kb.md)                 | complete | applied      | `13d99a33` |
| 32 | [`ki-repo-kb-principal`](ki-repo-kb-principal.md) | complete | applied | `13d99a33` |
| 33 | [`ki-repo-specifications`](ki-repo-specifications.md) | complete | applied | `e7a53a2c` |
| 34 | [`ki-repo-mcp`](ki-repo-mcp.md)               | complete | applied      | `e7a53a2c` |
| 35 | [`ki-repo-website`](ki-repo-website.md)       | complete | applied      | `5affff38` |
| 36 | [`ki-repo-website-cloudflare`](ki-repo-website-cloudflare.md) | complete | applied | `5affff38` |
| 37 | [`ki-repo-plugins`](ki-repo-plugins.md)       | complete | applied      | `e7a53a2c` |
| 38 | [`ki-repo-tools`](ki-repo-tools.md)           | complete | applied      | `5affff38` |
| 39 | [`ki-repo-homebrew-tap`](ki-repo-homebrew-tap.md) | complete | applied | `5affff38` |
| 40 | [`ki-repo-dotfiles-chezmoi`](ki-repo-dotfiles-chezmoi.md) | complete | applied | `e7a53a2c` |
| 41 | [`ki-binding`](ki-binding.md)                 | complete | applied      | `e75590e6` |
| 42 | [`ki-binding-claude`](ki-binding-claude.md)   | complete | applied      | `e75590e6` |
| 43 | [`ki-binding-codex`](ki-binding-codex.md)     | complete | applied      | `e75590e6` |
| 44 | [`ki-binding-chezmoi`](ki-binding-chezmoi.md) | complete | applied      | `e75590e6` |
| 45 | [`ki-housekeeping-claude`](ki-housekeeping-claude.md) | complete | applied | `e6c42c80` |
| 46 | [`ki-tokenomics`](ki-tokenomics.md)           | complete | applied      | `a28cf057` |
| 47 | [`ki-tokenomics-claude`](ki-tokenomics-claude.md) | complete | applied | `a28cf057` |
| 48 | [`ki-tokenomics-codex`](ki-tokenomics-codex.md) | complete | applied | `a28cf057` |
| 49 | [`ki-repo-harness`](ki-repo-harness.md)       | complete | applied      | `cec03ae7` |
| 50 | [`ki-bootstrap`](ki-bootstrap.md)             | complete | applied      | `cec03ae7` |

Post-baseline additions:

| Skill | Review | Change state | Evidence |
| --- | --- | --- | --- |
| [`ki-subagents-claude`](ki-subagents-claude.md) | integrated | applied | `f27f9d76` |
| [`ki-subagents-codex`](ki-subagents-codex.md) | integrated | applied | `f27f9d76` |

The [Phase 1 synthesis](phase-1-synthesis.md), [Phase 2 synthesis](phase-2-synthesis.md), [Phase 3 synthesis](phase-3-synthesis.md), [Phase 4 synthesis](phase-4-synthesis.md), [Phase 5 synthesis](phase-5-synthesis.md), and [Phase 6 synthesis](phase-6-synthesis.md) retain cross-skill conclusions. The [final cumulative calibration](final-calibration.md) records coverage and evidence limits. Detailed applied changes and remaining gaps live only in each skill record.

## Evidence rules

- Facts cite a repository path, immutable commit, command result, or current source.
- Inferences and gaps are labelled; missing evidence never becomes a synthetic pass or failure.
- Historical eval logs are advisory and are not baseline evidence when absent from the baseline commit.
- A source refresh separates portable authority, runtime overlays, house authority, and supporting discovery material.
- Every later review applies the cumulative calibration checklist; phase synthesis adds only genuinely new, generalised checks.
- No review record edits the skill it assesses.

[rev-001-record]: https://github.com/knowledgeislands/ki-agentic-harness/blob/38b47cdb5cd5d2618e31c40e55cf652cd77aa5c7/docs/roadmap/KI-HARNESS-REV-001-review-skill-effectiveness.md
