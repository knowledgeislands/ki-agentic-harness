# ROADMAP horizons and content discipline

`ki-plans` owns the ROADMAP horizon vocabulary and content discipline for code repos. `ki-harness` requires a harness to carry `ROADMAP.md` as part of its layout; it does not govern the file's contents.

## Horizons

Group open work under these four horizons, in order:

| Horizon    | Meaning                                              | Plan? |
| ---------- | ---------------------------------------------------- | ----- |
| `Blocking` | Must complete before the `Next` horizon can proceed. | Yes   |
| `Next`     | The nearest planned work.                            | Yes   |
| `Soon`     | Named work without plan detail yet.                  | No    |
| `Future`   | Named work without plan detail yet.                  | No    |

Plans are written only for `Blocking` and `Next` items. A repo with a short forward view may still use a flat list when horizons would add no clarity. A Knowledge Islands KB keeps its forward view in `Streams` through the Focus lifecycle rather than in `ROADMAP.md`.

## Content discipline

Apply these as judgment checks when reviewing a ROADMAP:

1. **Open-only.** Remove an item when it is done; do not tick, strike through, or retain completed work. The ROADMAP must show what remains.
2. **No continuous practices.** Standing audits, scheduled REFRESH runs, and ongoing maintenance are invariants, not open work. Put them in the relevant standard or orientation, not the ROADMAP.
3. **Mark speculative work.** Use `(candidate)` for work not yet committed, and remove the marker when it becomes a real planned item.

These rules preserve the forward view: completed work does not obscure the remaining work, continuous practices do not compete with finite changes, and speculative ideas remain distinguishable from committed work.
