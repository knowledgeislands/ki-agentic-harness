---
name: ki-repo-kb-principal
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: [ki-repo-kb, ki-decision-records]
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Audit or conform a designated principal KI knowledge base's governance overlay: territorial Charter,
  Known Lands inventory and signposting, memory root, and Enactment gate. Use for principal governance
  declarations; designation and authority remain owner-governed, while `ki-repo-kb` owns general base structure.
argument-hint: 'audit | conform | educate | help | refresh'
---

# Principal Knowledge Base

This governance skill holds the portable governance overlay for a repository designated as its territory's principal island, holding the Capital role. It reviews the authored territorial declaration without appointing a principal or granting authority. Read [the principal standard](references/standards-principal.md) before acting and [the generated rubric](references/rubric.md) for mechanical and judgment criteria.

## Shared model

A designated principal base uses the `ki-repo-kb` zones and `ki-decision-records` collection, then adds a governance home: `Admin/Governance/Charter.md`, `Admin/Governance/Known Lands.md`, `Admin/Governance/Conventions/Conventions.md`, and `Admin/Operations/Processes/Enactment Process.md`. `Admin/MEMORY.md` remains the root memory anchor. The Charter declares the territory, its one Capital, and authority boundary. Known Lands distinguishes governed internal membership from external signposting. Mechanical checks establish readable, regular-file evidence and a routing anchor; judgment compares the declarations and their authority references. Neither appoints a principal or grants exchange rights.

Substantive changes to `Admin/`, `Pillars/`, and `Resources/` must originate in a Stream proposal under the Enactment Process. This standing gate is anchored in the repository's always-loaded `CLAUDE.md` or `AGENTS.md`; the rubric verifies the anchor exists.

Repository identity, community language, integrations, and local operating detail belong in the principal's own governance notes, never in this shared skill.

## Operating modes

### Mode AUDIT

Run `ki repo audit --skill ki-repo-kb-principal --repo <repo>`, then apply the rubric's judgment criteria to Charter/Known Lands agreement and the distinction between internal membership and external signposting. Review conventions and the Enactment Process as authored local governance rather than empty scaffolding.

### Mode CONFORM

Run `ki repo conform --skill ki-repo-kb-principal --repo <repo> --dry-run` first. The native checker reports the missing principal surface; establish it through EDUCATE or an approved local proposal. CONFORM never moves knowledge, creates a Stream proposal, or reclassifies an existing folder.

### Mode EDUCATE

Establish the principal overlay after `ki-repo-kb` has established its zones: add the governance and process entry points, then review and author their local content before declaring the base operational.

### Mode HELP

Describe the principal-only governance delta and route general base structure to `ki-repo-kb`.

### Mode REFRESH

**Precondition:** REFRESH writes only the canonical `ki-repo-kb-principal` files in `ki-agentic-harness`. From an installed copy, stop and route reusable pressure back to this harness.

Reconcile repeated principal-base experience into the standard and rubric; do not turn one island's identity into a shared rule.

## Notes

- `ki-repo-kb` owns generic knowledge-base zones, streams, activities, and live artefacts.
- `ki-decision-records` owns Decision Record format and collection integrity.
- A satellite or ordinary knowledge base does not declare this skill.
