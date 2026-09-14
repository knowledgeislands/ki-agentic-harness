/** Eval scenarios for the flat non-KB `ki-work-roadmap` contract. */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-work-roadmap',
    id: 'repo-roadmap-flat-item-in-place-execution',
    prompt: 'This non-KB repository has a Next item that needs multi-file work. Where should I put the execution plan?',
    assertions: [
      { name: 'names canonical flat item path', re: /docs\/roadmap\//i },
      { name: 'keeps one canonical item', re: /same|single|one|in.place/i },
      { name: 'rejects duplicate plan file', re: /not|never|no.*duplicate/i }
    ],
    rubric:
      'House fact: a non-KB repository has one canonical work-item shape. The concise item directly under docs/roadmap is enriched in place with execution detail; there is no plans directory or second plan record.'
  },
  {
    skill: 'ki-work-roadmap',
    id: 'repo-roadmap-id-theme-and-triage',
    prompt:
      "Capture 'replace stale links' in the seo theme, but do not adopt it yet. I want a generic filename and a candidate field. Anything to correct?",
    assertions: [
      { name: 'repository-scoped issue identifier', re: /<REPO>-<NNN>|SEO|001/i },
      { name: 'flat placement', re: /docs\/roadmap\//i },
      { name: 'explicit theme field', re: /theme/i },
      { name: 'unadopted triage horizon', re: /triage/i },
      { name: 'draft delivery maturity', re: /draft/i },
      { name: 'retired candidate field', re: /candidate.*(retired|remove|absent|invalid|unsupported)/i }
    ],
    rubric:
      'House fact: each item is docs/roadmap/<REPO>-<NNN>-<slug>.md and carries explicit theme, horizon, status, and dependencies. Captured but unadopted work is draft in Triage; the candidate field is retired.'
  },
  {
    skill: 'ki-work-roadmap',
    id: 'repo-roadmap-one-home-generated-index',
    prompt:
      'I copied a work item into root ROADMAP.md for convenience and changed its link text by hand. Is that acceptable?',
    assertions: [
      { name: 'one authoritative item home', re: /one|single|authoritative|canonical|duplicate/i },
      { name: 'flat item directory owns prose', re: /docs\/roadmap\//i },
      { name: 'root is concise orientation', re: /orientation|does not duplicate|canonical/i },
      { name: 'rejects hand editing', re: /not|mustn.t|cannot|regenerate|invalid|drift/i }
    ],
    rubric:
      'House fact: each item has one authoritative flat Markdown file. Root ROADMAP.md is a concise orientation, never a second prose home or a duplicated queue.'
  },
  {
    skill: 'ki-work-roadmap',
    id: 'repo-roadmap-terminal-triage-disposition',
    prompt:
      'This Triage item duplicates KI-WEB-SEO-005. The human approved closing it. Should I delete it now or add delivery evidence first?',
    assertions: [
      { name: 'retained done closure', re: /done|retain/i },
      { name: 'intake disposition evidence', re: /intake.disposition|duplicate/i },
      { name: 'canonical retained target', re: /KI-WEB-SEO-005/i },
      { name: 'no fabricated delivery', re: /not|do not|without.*(delivery|implementation)|no.*review/i },
      { name: 'later prune boundary', re: /later|prior commit|before.*prun|done.*prun/i }
    ],
    rubric:
      'House fact: exact human-approved rejected, duplicate, or merged intake closes through ki-accept as retained Triage / done. Duplicate and merged dispositions name the retained canonical item. The closure has intake evidence, not fabricated implementation evidence, and must land before a later prune-only commit.'
  },
  {
    skill: 'ki-work-roadmap',
    id: 'repo-roadmap-blocks-graph',
    prompt:
      "KI-WEB-SEO-005 cannot start until KI-WEB-CNT-004 is finished. I've added blocked_by: [KI-WEB-CNT-004] and would like to start it now in parallel. Anything wrong with that?",
    assertions: [
      { name: 'blocked_by field', re: /blocked_by/i },
      { name: 'reverse blocks edge', re: /blocks/i },
      { name: 'identifier blocker reference', re: /KI-WEB-CNT-004/i },
      { name: 'no in-progress before blockers done', re: /done|finish|complete|wait|before/i }
    ],
    rubric:
      'House fact: work-item identifiers are globally unique. blocks/blocked_by are bidirectional arrays, and no item may become ready or in-progress before its blockers are done.'
  }
]
