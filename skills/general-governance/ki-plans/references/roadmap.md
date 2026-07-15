# ROADMAP horizons and content discipline

`ki-plans` owns the ROADMAP horizon vocabulary and content discipline for code repos. `ki-harness` requires a harness to carry `ROADMAP.md` as part of its layout; it does not govern the file's contents.

## Horizons

Group open work under these five horizons, in order. Each ROADMAP carries the horizon's narrative as a one-line lead-in directly under its `##` heading — above any theme or item sub-heading — so every ROADMAP reads the same way:

- **`Blocking`** — Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire. _Carries a plan._
- **`Next`** — Scoped and ready to start: the immediate queue, picked up before anything in `Soon` or `Future`. _Carries a plan._
- **`Soon`** — Understood and roughly scoped but not yet started: worth doing once the `Next` queue clears, ahead of anything still speculative.
- **`Waiting for`** — Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.
- **`Future`** — Speculative or not yet scoped: items marked `(candidate)` need a scoping pass, or a decision to drop them, before they become actionable.

Plans are written only for `Blocking` and `Next` items; `Soon`, `Waiting for`, and `Future` carry no plan detail — a `Waiting for` item is planned once its named condition clears and it moves up. A repo with a short forward view may still use a flat list when horizons would add no clarity. A Knowledge Islands KB keeps its forward view in `Streams` through the Focus lifecycle rather than in `ROADMAP.md`.

## Content discipline

Apply these as judgment checks when reviewing a ROADMAP:

1. **Open-only.** Remove an item when it is done; do not tick, strike through, or retain completed work. The ROADMAP must show what remains.
2. **No continuous practices.** Standing audits, scheduled REFRESH runs, and ongoing maintenance are invariants, not open work. Put them in the relevant standard or orientation, not the ROADMAP.
3. **Mark speculative work.** Use `(candidate)` for work not yet committed, and remove the marker when it becomes a real planned item.

These rules preserve the forward view: completed work does not obscure the remaining work, continuous practices do not compete with finite changes, and speculative ideas remain distinguishable from committed work.
