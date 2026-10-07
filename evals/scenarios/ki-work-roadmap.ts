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
    id: 'repo-roadmap-id-and-triage-capture',
    prompt:
      "Capture 'replace stale links' for the seo work, but do not adopt it yet. I want a generic filename, a theme field, and a candidate field. Anything to correct?",
    assertions: [
      { name: 'repository-scoped issue identifier', re: /<REPO>-<NNN>|SEO|001/i },
      { name: 'flat placement', re: /docs\/roadmap\//i },
      { name: 'triage status', re: /status:\s*triage|triage status|status.*triage/i },
      { name: 'no horizon before adoption', re: /no horizon|without.*horizon|horizon.*(absent|null|omit|none)/i },
      { name: 'classification replaces theme', re: /kind|project|initiative|component|classif/i },
      { name: 'retired candidate field', re: /candidate.*(retired|remove|absent|invalid|unsupported)/i }
    ],
    rubric:
      'House fact: each item is docs/roadmap/<REPO>-<NNN>-<slug>.md. Captured but unadopted work has status triage and no horizon; adoption assigns a status and a horizon. Classification uses kind, purpose, project or initiative, and component rather than the retired theme field; the candidate field is retired.'
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
    id: 'repo-roadmap-cancel-duplicate',
    prompt:
      'This triage record duplicates KI-WEB-SEO-005. The human approved closing it. Should I delete it now or add delivery evidence first?',
    assertions: [
      { name: 'retained cancelled closure', re: /cancel|retain/i },
      { name: 'duplicate resolution', re: /resolution.*duplicate|duplicate/i },
      { name: 'canonical resolution target', re: /KI-WEB-SEO-005/i },
      { name: 'cancelled section', re: /##\s*Cancelled|Cancelled section/i },
      { name: 'no fabricated delivery', re: /not|do not|without.*(delivery|implementation)|no.*review/i },
      { name: 'later prune boundary', re: /later|prior commit|before.*prun|cancel.*prun/i }
    ],
    rubric:
      'House fact: exact human-approved obsolete, rejected, duplicate, merged, or superseded work closes through ki-accept as status cancelled with a resolution. Duplicate, merged, and superseded resolutions name the retained record in resolution_target. The record gains a ## Cancelled section before Discussion and carries no fabricated delivery evidence; the cancellation lands before a later prune-only commit.'
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
