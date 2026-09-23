# Guides standard

This standard defines the home and minimum navigability of repository-local practical documentation. The hosted structured rubric enforces its mechanical criteria; the generated [rubric](rubric.md) publishes every criterion, and [exemplars](exemplars.md) illustrate representative outcomes.

## The four-doc split

A non-Knowledge-Base repository uses four durable documentation concerns. `ki-repo` owns applying that repository-wide topology; this skill owns only the practical-guide concern:

| Location          | Question | Instrument                                     |
| ----------------- | -------- | ---------------------------------------------- |
| `docs/decisions/` | Why      | Decision Records (`ki-decision-records`)       |
| `docs/specs/`  | What     | Specifications (`ki-specs`) |
| `docs/guides/`    | How      | Guides (**this skill**)                        |
| `docs/roadmap/`   | When     | Repository work items (`ki-work-roadmap`)           |

Each source has one job. A guide may link to a Decision Record, Specification, or roadmap item when that helps a reader act, but it does not duplicate the source's authority. A guide that relies on stable system behaviour routes to the applicable existing Specification. Where no durable behaviour contract exists, identify the gap for `ki-specs`; do not manufacture speculative requirements or require an unrelated corpus before publishing the guide.

## Guide root and index

- Guides live in **`docs/guides/`**.
- **`docs/guides/README.md`** is the collection entry point. It gives the reader a concise scope statement and links to each guide or guide area with enough description to choose one.
- A collection that serves stable, distinct readers should group guides below meaningful concern or audience directories such as `developer/`, `operations/`, or `release/` when that grouping improves the route from the index. Category names are open, local information architecture, not a KI-wide taxonomy. A small collection, shared entry point, or genuinely cross-audience guide may remain directly under the root; flat, grouped, and intentionally mixed collections are all valid.
- Developer guide roles such as `developer/definition-of-done.md` and `developer/releasing.md` are optional under this general standard. A specialised repository-kind overlay may require their presence or an exact role path. When the role has a stable audience, that exact path should preserve the collection's audience route rather than bypass it with a root-level filename. `ki-guides` continues to govern ordinary guide placement and form rather than imposing a universal completion checklist or release policy.
- AUDIT emits no structural finding solely because a guide is directly below `docs/guides/`, and CONFORM never moves an authored guide between categories. Reader and audience clarity remain review judgments.
- Each guide Markdown file other than the root `README.md` has exactly one H1. It identifies the task, outcome, or operating context; its body gives the conditions, ordered work, verification, and recovery information appropriate to the topic.

## Boundary and migration rules

- **`docs/spec/` is not a durable documentation category.** Behavioural, testable specifications migrate to `docs/specs/` and are governed by `ki-specs`. Other material is reclassified according to its actual concern.
- **`docs/developer/` is not a parallel root.** Contributor and maintainer instructions migrate to `docs/guides/developer/`.
- **`docs/logs/` requires an explicit specialised owner before it is classified.** This skill does not infer that a path is a generic log archive from its name. Keep ephemeral logs out of version control unless a specialised operational system owns and governs them; record any durable conclusion with its governing Decision Record, guide, Specification, or roadmap item.
- Diagram sources and other assets live beside the concern they explain or in a repository-specific asset location. This skill does not impose a graphics format or asset pipeline.

## Judgment boundary

The checker can prove that a root, entry point, headings, and retired roots are present or absent. It cannot truthfully prove that a procedure is safe, complete, current, or placed in the most useful category. During review, ask whether the index and any audience grouping give each intended reader a clear route, whether specialised exact-role paths preserve that route, and whether a reader can complete the guide's outcome without hidden context, verify success, and recover from known failure states.
