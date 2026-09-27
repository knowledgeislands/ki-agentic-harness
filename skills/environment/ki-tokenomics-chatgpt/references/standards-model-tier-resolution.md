# Codex model-tier resolution standard

This standard records dated, Codex-owned runtime evidence, not portable policy or an effective-model observation.

The portable contract remains `frontier`, `reasoning`, `standard`, and `fast`.

`scripts/internal/model-tier-resolution.ts` maps the three approved operating roles without selecting a live model:

| Role | Portable purpose | Dated family evidence | Resolver result |
| --- | --- | --- | --- |
| Main-thread orchestration | `frontier` | None | `inherit` |
| Judgment worker | `reasoning` | Sol | `runtime-evidence` |
| Mechanical worker | `fast` | Luna | `runtime-evidence` |

Terra remains source-local evidence for `standard` work, rather than a fixed role default.

The evidence does not establish a one-to-one binding: it does not prove current availability, the effective session model, reasoning-effort support, price, latency, or that Sol is sufficient for every `frontier` task.

A repository `model_tier_bindings` value is therefore retained as an opaque advisory preference.

It is never parsed as a provider guarantee or used to authorise delegation, spending, or a live call.

## Evaluation protocol

Before adopting any Codex default, run each baseline case twice at the common supported effort (planned baseline: `medium`), with no corrective prompting:

| Case | Required evidence |
| --- | --- |
| Deterministic extraction/classification | Exact assertions and return shape |
| Conflicting-governance judgment | Required evidence rubric, authority boundary, and return shape |
| Coordinator with three read-only lanes | Authority boundaries, integrated return shape, and delegation evidence |

For every run, record pass/fail for each assertion, evidence requirement, authority boundary, and return shape; latency; available input/output token evidence or an explicit unavailable result; and correction count.

Test one lower supported effort only after a candidate passes both baseline repetitions.

Do not calculate a composite score.

Recommend only the lowest-cost model and effort that passes both repetitions for that purpose; mixed, unavailable, or insufficient evidence produces `no default change`.

Live calls, runtime selection, and spending require separate user authority.

## Source status

The Sol/Terra/Luna positioning is planning evidence captured from the official OpenAI model guide on 2026-08-13.

It was not live-revalidated while implementing this source-local resolver on 2026-08-16; refresh it before any default proposal.
