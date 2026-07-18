/**
 * Eval scenarios for `ki-repo-roadmap` — the non-KB forward-work standard.
 *
 * These target house-arbitrary rules a generic roadmap answer will miss: simple
 * repositories do not carry plans, thematic item prose has one authoritative
 * home, plan locators are qualified while numeric ids restart within each theme,
 * and the dependency graph uses qualified, bidirectional references.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-repo-roadmap',
    id: 'project-roadmap-simple-expands-before-plan',
    prompt:
      'This non-KB repository has only a root ROADMAP.md. A Next item has become substantial, so please add a detailed execution plan beside it without changing the roadmap layout.',
    assertions: [
      { name: 'recognises simple profile', re: /simple/i },
      { name: 'requires thematic expansion', re: /thematic|expand/i },
      { name: 'does not add plan to simple profile', re: /before|cannot|must|first|not/i },
      { name: 'names thematic path', re: /docs\/roadmap\//i }
    ],
    rubric:
      'House fact: a non-KB repository with only root ROADMAP.md uses the simple profile, which has no plan collection. Work needing an executable plan must expand into the thematic profile first; the agent must not invent a plan while the repository is still simple. A correct answer explains that boundary and routes the item to docs/roadmap/<theme>/ROADMAP.md with its plan below that theme.'
  },
  {
    skill: 'ki-repo-roadmap',
    id: 'project-roadmap-qualified-locator-theme-local-id',
    prompt:
      "Set up frontmatter and placement for a new plan for the 'replace stale links' item under the seo theme. I want the id to restart at 001 within seo and roadmap: to contain only the item title. Anything to correct?",
    assertions: [
      { name: 'qualified roadmap locator', re: /seo\/replace-stale-links/i },
      { name: 'id restarts within theme', re: /001|restart|per-theme|theme-local|within (the )?theme/i },
      { name: 'plan path convention', re: /docs\/roadmap\/seo\/plans\//i },
      { name: 'no title-only linkage', re: /qualified|locator|not.*title|rather than.*title/i }
    ],
    rubric:
      'House fact: thematic plans live at docs/roadmap/<theme>/plans/<THEME>-<NNN>-<slug>.md. Their roadmap field uses the stable qualified <theme>/<item-slug> locator, not a title. Each theme declares a stable uppercase code, and plan ids use that code plus a zero-padded serial from 001; the canonical plan identifier is <THEME>-<NNN>.'
  },
  {
    skill: 'ki-repo-roadmap',
    id: 'project-roadmap-one-home-exact-projection',
    prompt:
      'I have added the full security item prose under docs/roadmap/security/ROADMAP.md. For convenience I also copied it into root ROADMAP.md and shortened the root link text by hand. Is that acceptable?',
    assertions: [
      { name: 'one authoritative item home', re: /one|single|authoritative|canonical|duplicate/i },
      { name: 'theme roadmap owns prose', re: /docs\/roadmap\/security\/ROADMAP\.md/i },
      { name: 'root is generated projection', re: /generated|projection|exact/i },
      { name: 'rejects hand editing', re: /not|mustn.t|cannot|regenerate|invalid|drift/i }
    ],
    rubric:
      'House fact: in the thematic profile, each item has exactly one authoritative home in its theme ROADMAP.md. Root ROADMAP.md is an exact generated linked portfolio, never a second prose home and never hand-edited. A correct answer removes the duplicate and regenerates the root projection.'
  },
  {
    skill: 'ki-repo-roadmap',
    id: 'project-roadmap-blocks-graph',
    prompt:
      "Plan seo/005 cannot start until plan content/004 is finished. I've added blocked-by: 004 to seo/005 and would like to start it now in parallel. Anything wrong with that?",
    assertions: [
      { name: 'blocked-by field', re: /blocked-by/i },
      { name: 'reverse blocks edge', re: /blocks/i },
      { name: 'qualified blocker reference', re: /content\/004/ },
      { name: 'no in-progress before blockers done', re: /done|finish|complete|wait|before/i }
    ],
    rubric:
      'House fact: theme-coded plan identifiers are globally unique, so blocks/blocked-by are bidirectional and use <THEME>-<NNN>: SEO-005 lists blocked-by: CNT-004, and CNT-004 lists blocks: SEO-005. No plan may move to in-progress before its blockers are done.'
  }
]
