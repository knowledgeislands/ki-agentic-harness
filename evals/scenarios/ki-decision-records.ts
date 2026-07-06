/**
 * Eval scenarios for the `ki-decision-records` skill — the unified Decision
 * Record instrument (GDR-/ADR-/KDR-/… prefixes).
 *
 * Design note: a baseline knows generic ADR advice, so it would answer "call it
 * an ADR, number it sequentially, put it in docs/". These scenarios target
 * house-ARBITRARY specifics: the decision_type→prefix table and per-prefix serial
 * scoping, the Mutability axis orthogonal to Status, and the KB placement +
 * required frontmatter that differ from a code repo.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-decision-records',
    id: 'dr-prefix-serial',
    prompt:
      'We just agreed to require two maintainers to approve any change to our release process. I want to write that up as a formal decision record in the ARCADIA repo. What should the file be named, and how do I pick its number given we already have an architecture decision numbered 001?',
    assertions: [
      { name: 'governance prefix GDR-', re: /GDR-/ },
      { name: 'classified as governance', re: /governance/i },
      { name: 'scope in the id', re: /ARCADIA/i },
      { name: 'serial 001 valid per-prefix', re: /\b001\b/ }
    ],
    rubric:
      'House fact: decision_type maps to a fixed prefix, and a process/authority decision is **governance → `GDR-`**, not `ADR-`. The name is `<PREFIX>-<SCOPE>-NNN` and serials increase **per prefix within the scope**, so `GDR-ARCADIA-001` legitimately co-exists with an existing `ADR-…-001`. A correct answer classifies it as governance, uses the `GDR-` prefix, and knows the new record can be serial `001` because numbering is per-prefix, not global.'
  },
  {
    skill: 'ki-decision-records',
    id: 'dr-mutability',
    prompt:
      'We have an accepted architecture decision record. We now want to be able to tweak its wording in place as things get clarified, rather than replacing the whole record every time. Does our decision-record format allow that, and where do the tweaks get recorded?',
    assertions: [
      { name: 'Mutability marker', re: /mutability/i },
      { name: 'open value', re: /\bopen\b/i },
      { name: 'edits logged in Changelog', re: /changelog/i },
      { name: 'contrast with locked/supersede', re: /locked|supersed/i }
    ],
    rubric:
      'House fact: every DR carries a **`Mutability: open | locked`** marker that is orthogonal to Status. An `open` record is edited in place with each edit logged in a `## Changelog` section; a `locked` record changes only by supersession. A correct answer surfaces the Mutability axis (distinct from Status), names `open`, and knows in-place edits go in a `## Changelog`.'
  },
  {
    skill: 'ki-decision-records',
    id: 'dr-kb-placement',
    prompt:
      "I'm adding our first decision record to the Arcadia knowledge base (a KB, not a code repo). Which folder does it go in, what must the index file be called, and what frontmatter is mandatory?",
    assertions: [
      { name: 'KB decisions folder', re: /Admin\/Governance\/Decisions/i },
      { name: 'index named Decisions.md', re: /Decisions\.md/ },
      { name: 'required type field', re: /admin\/governance\/decision/i },
      { name: 'decision_type frontmatter', re: /decision_type/ }
    ],
    rubric:
      'House fact: placement depends on `repo_type`. A **KB** repo files DRs under `Admin/Governance/Decisions/` with the index note `Decisions.md` and REQUIRED frontmatter including the literal `type: admin/governance/decision` plus `decision_type`, `status`, `author` — not the code-repo `docs/decisions/` + `README.md` layout. A correct answer routes it to `Admin/Governance/Decisions/`, names `Decisions.md`, and lists the mandatory frontmatter.'
  }
]
