---
id: ADR-KI-HARNESS-SKILLS-016
title: 'Every guide lives in an audience folder'
date: 2026-10-06
status: current
decision_type: architecture
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
---

# ADR-KI-HARNESS-SKILLS-016: Every guide lives in an audience folder

## Context

`ki-guides` reads a guide collection's grouping as the author's statement of each guide's audience, and judges what a guide may cite by that audience. On 2026-09-22 `KI-HARNESS-GOV-083`, opened to require audience guide directories, was settled as advice instead (`c67db353`): flat, grouped and mixed collections were all valid, and AUDIT emitted no finding for a guide directly below `docs/guides/`. No Decision Record was written, although that record had said one was owed if the requirement landed.

The advisory rule then pulled against the specialised overlays. `ki-repo-website-cloudflare` and `ki-repo-tools` require exact paths under `developer/`, and the `ki-repo` REVIEW checklist still asked for an audience subdirectory. `5g-emerge-phase2` flattened its collection under the advisory rule and was left with one `developer/` folder held open only by WCF-26. The first plan for `KI-HARNESS-FND-027` would have resolved that by letting WCF-26 find its guide anywhere and dropping the checklist question; the principal rejected that on 2026-10-06.

## Decision

Every guide lives in a folder below `docs/guides/` named for its audience. Only the collection's `README.md` sits directly below `docs/guides/`; `docs/guides/references/` holds supporting material, not guides for an audience of its own.

- **Enforcement is mechanical.** GUIDE-5 fails every other Markdown file directly below `docs/guides/`. CONFORM never moves an authored guide; the author chooses its folder.
- **Names are local.** Folder names are open local vocabulary, not a KI-wide taxonomy, but each names a reader rather than a topic. Whether it does is a ROUTE-2 judgment, because a checker cannot tell an audience from a topic.
- **One reader per placement.** A guide that serves several readers sits with its primary reader; the index may link it from other areas. There is no root-level or shared-folder exception.
- **One audience, one folder.** A collection whose guides share a single reader still uses a folder, so the location always states the reader.

Alternatives not taken: keeping the advisory rule, which left a guide's reader to be inferred from prose; a fixed vocabulary such as `user/`, `developer/` and `operator/`, which would force renames of folders that already name their readers well; a `shared/` folder for multi-audience guides, which names no reader; and discovering the Cloudflare guide anywhere in the collection, which would have made the overlay agree with the advisory rule rather than with the audience route.

This supersedes the advisory settlement recorded in the pruned `KI-HARNESS-GOV-083`.

## Consequences

The specialised exact-role paths under `developer/` are unchanged and now agree with the general rule, and the `ki-repo` REVIEW question asking for an audience subdirectory stays.

A repository with a guide directly below `docs/guides/` fails `ki-guides` until it moves the guide. When the rule landed, the six repositories declaring `ki-guides` with root-level guides were moved first under `KI-HARNESS-FND-027`, so none failed in between.

ROUTE-2 may now find that an existing folder names a topic rather than a reader. That is a review finding for the owning repository; this decision renames no folder.

## References

- [ADR-KI-HARNESS-SKILLS-002](ADR-KI-HARNESS-SKILLS-002-mechanical-and-judgment-checker-split.md) separates what the checker proves from what the reviewer judges
