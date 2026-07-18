---
code: OPS
---

# Operations roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

### Complete the approved Claude-state cleanup

When destructive housekeeping access is available, refresh the live inventory, review the candidates, and prune only the approved stored sessions and telemetry. Do not preserve stale counts as a target or broaden the cleanup beyond the reviewed set.

### Reconcile the three memory-store defects

When the project memory store is writable, update `project-harness-runtime-strategy.md` to cite `SDR-KI-HARNESS-002-runtime-portable-contracts.md`, then delete `feedback-explicit-git-staging.md` and `complete-the-merge-loop.md` because their guidance has already been promoted. Verify the three changes in the canonical project-memory directory and avoid speculative backend redesign unless a reproducible inconsistency remains.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### Define opt-in repository observability via OTLP _(candidate)_

Define an off-by-default `ki-observability` capability for reporting repository and skill activity to a configured OTLP-compatible endpoint. Specify its configuration, signal levels, resource and run attributes, privacy allowlist, secret handling, and failure semantics: disabled means no network activity; enabled reporting is best-effort and never changes an AUDIT or CONFORM result. Start with lifecycle logs and low-cardinality duration/count metrics, keeping per-run identifiers in events rather than metric dimensions. Define the boundary between harness-reported activity, optional runtime token deltas, and a later AI gateway that can authoritatively normalise request, response, cache, and cost data. Keep this separate from checker-module vendoring and do not introduce transcript scraping or a required gateway in the first slice.
