/**
 * Eval scenarios for the `ki-decision-records` skill — the unified Decision
 * Record instrument (GDR-/ADR-/KDR-/… prefixes).
 *
 * Design note: a baseline knows generic ADR advice, so it would answer "call it
 * an ADR, number it sequentially, put it in docs/". These scenarios target
 * house-ARBITRARY specifics: the decision_type→prefix table and per-prefix serial
 * scoping, the living present-state record (edited in place — no Status lifecycle,
 * Changelog, or supersession), and the KB placement + required frontmatter that
 * differ from a code repo.
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
    id: 'dr-living-record',
    prompt:
      'We have an accepted architecture decision record. As things get clarified we want to keep tweaking its wording, and later we may reverse the decision entirely. In our decision-record format, do we track that with a status field, a changelog section, or a superseded-by chain — and how should the record read over time?',
    assertions: [
      { name: 'edited in place', re: /in place|living|present.?state/i },
      { name: 'no status lifecycle', re: /no\s+status|without\s+a?\s*status|not?\s+a\s+status/i },
      { name: 'no changelog', re: /no\s+.*changelog|without\s+a?\s*changelog/i },
      { name: 'no supersession chain', re: /no\s+.*supersed|rewrite|reads? as (if )?(written )?(today|current)/i }
    ],
    rubric:
      'House fact: a DR is a **living present-state record**. It is edited **in place** and always reads as if written today — there is **no** `Status` lifecycle, **no** `Mutability` marker, **no** `## Changelog`, and **no** superseded-by chain. Continued clarification just edits the record; a reversal **rewrites** it to state the new decision, and the history lives in git, not in the record. A correct answer says to edit in place with none of those lifecycle mechanisms, and that a change of direction rewrites the live record.'
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
