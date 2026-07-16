# Website docs roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### The harness `docs/` is canonical authoring; the website vendors a copy

Skill and design documentation is authored here and stays canonical — it is an **input** to two downstream consumers: ki-arcadia-principal references it (via the `Agentic Tool Documentation` stream), and ki-website needs it for its pages. The harness stays **canonical for its own story** — the human-first overview ([docs/overview.md](../../../docs/guides/user-guide/overview.md)) and the skill/design docs live here; the downstream repos reference rather than own them.

Because the website build must be **autonomous** — no reach into a sibling repo at build time — it cannot source the harness `docs/` live; it vendors a self-contained copy. Automate that as a **one-directional committed sync**: a script or CI step in ki-website copies the website-relevant subset of the harness `docs/` into its content tree and commits it, so the build is fully self-contained, the harness stays the single source, and every update lands as a reviewable diff in the website's history — no manual duplication. (A git submodule pinned to a harness ref is the alternative, if strict version-pinning is preferred over copy-commits.)

**Gate:** this pipeline is ki-website's roadmap work; the harness's only responsibility is to remain the canonical author. Nothing here for the harness to retire.

### Guard the website's vendored docs against drift from the harness's canonical copy _(candidate)_

The sync above (item: "The harness `docs/` is canonical authoring; the website vendors a copy") makes the copy step mechanical, but nothing yet **detects** when the website's vendored subset has fallen behind the harness's canonical `docs/` — a harness doc can change without the sync running, and the website silently serves stale content with no signal to either repo. Investigate a drift check: a hash or content comparison between the harness source paths and the website's vendored copies, run either as a harness-side audit criterion (candidate: `ki-website`'s AUDIT, since it already owns the website-repo-structure skill) or as a scheduled sweep alongside the `ki-skills-refresh` cadence. Decide whether staleness should fail a gate (CI) or just surface as an advisory finding — a hard fail risks blocking the website on harness-side edits it hasn't synced yet.
