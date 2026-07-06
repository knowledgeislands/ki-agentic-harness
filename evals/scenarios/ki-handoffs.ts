/**
 * Eval scenarios for the `ki-handoffs` skill — the plan-once-at-top-tier,
 * execute-cheap doctrine and the handoff-spec quality bar.
 *
 * Design note: a baseline gives generic "write clear tickets" advice. These
 * scenarios target house-ARBITRARY markers: the `handoff: true` + semantic
 * `tier:` opt-in contract, the locked-vs-escalate decisions split (both labels
 * required), and the cold-agent readiness test recorded on the artifact.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-handoffs',
    id: 'hand-tier-marker',
    prompt:
      'I want my plan file to be picked up by the handoff checker, and I want to note that a cheap model should run it. What exactly do I put in the frontmatter?',
    assertions: [
      { name: 'opt-in marker', re: /handoff:\s*true/i },
      { name: 'tier field', re: /tier:/i },
      { name: 'semantic class values', re: /haiku|sonnet|opus/i },
      { name: 'rejects cheap/id/price', re: /not|never|avoid|rather than|instead/i }
    ],
    rubric:
      'House fact: an artifact opts into handoff-governance with `handoff: true`, and then MUST carry a `tier:` whose value is a semantic class — `haiku | sonnet | opus` — never `cheap`/`mid`/`top`, a concrete model id, or a price (that trips HAND-1). A correct answer requires `handoff: true` to opt in and a semantic `tier:` value, rejecting `tier: cheap`.'
  },
  {
    skill: 'ki-handoffs',
    id: 'hand-decisions-split',
    prompt:
      "In the spec I'm handing to a cheaper model, I've already settled every design question — there's nothing left for anyone to decide. How should I write the decisions part of the doc, if at all?",
    assertions: [
      { name: 'explicit decisions section', re: /decision/i },
      { name: 'locked judgements', re: /locked/i },
      { name: 'escalate label present', re: /escalate/i },
      { name: 'empty list still labelled', re: /none|empty/i }
    ],
    rubric:
      'House fact: a handoff spec must distinguish **locked** (judgements already closed, not to be reopened) from **escalate** (judgements needing the owner), and both labels must be present even if one is empty — you write `Escalate: none` rather than omitting the section. A correct answer keeps an explicit decisions section labelling both, writing `Escalate: none` instead of dropping it.'
  },
  {
    skill: 'ki-handoffs',
    id: 'hand-readiness',
    prompt:
      "I've written what I think is a complete implementation spec and I re-read it myself and it looks good. Is there a specific check our process wants before I call it ready to delegate, and does that check leave any trace on the document?",
    assertions: [
      { name: 'readiness marker', re: /readiness/i },
      { name: 'cold / fresh-context agent', re: /cold|fresh[- ]context|no shared context/i },
      { name: 'executes first phase from spec alone', re: /first phase|from the spec alone|spec alone/i },
      { name: 'recorded on the artifact', re: /record|marker|checkbox|frontmatter|## Readiness/i }
    ],
    rubric:
      'House fact: a spec is ready only when a **cold agent at the assigned tier** — no shared context, only the spec — can execute the **first phase** from the spec alone; self-review does not count. The outcome must be RECORDED via a readiness marker (a `readiness:` field, a `## Readiness` heading, or a `Readiness test` checkbox), and a recorded failure is a valid state. A correct answer names the cold-agent test over self-review and requires it be recorded on the artifact.'
  }
]
