# ADR-KI-HARNESS-SKILLS-010: Comparable, cited checker findings across audit and conform

**Date:** 2026-07-12

## Context

The mechanical/judgment split gave every skill a checker whose findings carried only `level`, `area`, and `msg`, and each verb rendered its own output. Three gaps followed. First, citation was thin and uneven: audit named the governing rubric criterion in only two of the roughly twenty skills, conform never cited a rubric at all, and neither verb named the file a finding concerned — so a reader could not trace a finding back to the criterion that raised it or the file that tripped it. Second, the two verbs were not comparable: audit emitted the pinned JSON wrapper while conform emitted ad-hoc prose, so a consumer that ran both could not merge them on one ladder. Third, the aggregate recap flattened everything together, burying the real violations (FAIL / WARN / POLISH) under the always-on judgment reminders (ADVISORY) that fire on every clean run — the signal a reader most needs was the hardest to find. The goal was one finding model that is comparable across both verbs, self-citing to rubric and file, and rendered once.

## Decision

Extend the mechanical-checker finding model along three axes:

- **Richer, mandatorily-cited findings.** A finding gains two optional structured fields on top of the required `level` / `area` / `msg`: `ref`, the reference-doc pointer the criterion carries (e.g. its `references/…` path, or `owns:` for an owned-file criterion), and `file`, the path a file-scoped finding concerns. `area` is mandatorily the criterion's code drawn from the skill's `references/rubric.md`, so that one rubric is the single source for both the code and its reference pointer.
- **One canonical JSONL transport.** Audit and conform scripts collect their findings then emit the same JSONL event stream on normal invocation, so consumers merge the two verbs without an output-format switch or a private terminal renderer.
- **One shared renderer in the aggregate.** All human rendering centralises in the vendored aggregate runner — the single formatter for both verbs — which resolves the criterion title from the emitting rubric and renders `[title (code)] file msg (ref)`, puts icons on the summary and totals lines, and splits the recap into real violations (FAIL / WARN / POLISH) versus the always-on judgment reminders (ADVISORY), for both audit and conform.

Because a skill may not import another skill's code — every skill must stay valid installed standalone — the shared renderer cannot live in a library the checkers import. It lives in the aggregate runner instead: a standalone checker still emits the same `code` / `ref` / `file` content in its own output, and the aggregate owns only the cross-skill chrome (icons, the violation/advisory split, uniform per-finding layout). Standalone and aggregate stay consistent on the finding content; they differ only in presentation the aggregate adds.

## Consequences

- Every finding, from either verb, now points at the rubric criterion that raised it and the file it concerns — citation is uniform, not present in a handful of skills.
- A consumer that runs audit and conform in sequence merges both on one ladder without special-casing either verb.
- The recap surfaces real violations distinctly from the advisory reminders that fire on every run, so a non-clean result is legible at a glance.
- The finding contract carries `ref` and `file` as optional fields and uses `code` as the rubric-owned stable identifier — checkers that emit a free-text identity or omit a required rubric pointer are non-conformant.
- Conform collects its actions before emitting the same canonical stream as audit rather than printing them as it goes.
- Rendering logic removed from individual checkers concentrates in the aggregate runner; a skill run standalone shows the same finding content but without the aggregate's added chrome, which is the intended standalone-versus-aggregate boundary.

## References

- [ADR-KI-HARNESS-SKILLS-002](ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md) — the mechanical/judgment checker split this record extends: the finding model, the severity ladder, and the pinned JSON wrapper it enriches.
- [ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-composition-over-extension.md) — composition over extension, the principle that forces the shared renderer into the aggregate rather than a library the checkers import.
- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md) — every skill valid standalone, the constraint that a checker cannot import shared render code.
