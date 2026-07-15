/**
 * Eval scenarios for the `ki-plans` skill — the planning methodology for code
 * repos (near-horizon principle, dependency graph, plan format).
 *
 * Design note: a baseline gives generic "break work into a plan" advice and
 * happily plans everything. These scenarios target house-ARBITRARY rules: plans
 * exist only for ROADMAP "Blocking" or "Next", the no-`phase`-field / global-three-digit-id
 * convention, and the bidirectional blocks/blocked-by gate on execution.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-plans',
    id: 'plan-near-horizon',
    prompt:
      "We've got our roadmap laid out across Blocking, Next, Soon, and Future. I'd like to get ahead by writing detailed implementation plans for the Soon and Future items now while I have the context. Sound good?",
    assertions: [
      { name: 'plans only for Blocking or Next', re: /\bBlocking\b|\bNext\b/ },
      { name: 'Soon/Future stay bare lines', re: /Soon|Future/ },
      { name: 'roadmap link field', re: /roadmap/i },
      { name: 'pushes back', re: /only|not|don.t|shouldn.t|no plan/i }
    ],
    rubric:
      'House fact: plans exist only for the nearest horizons — ROADMAP `Blocking` or `Next` items; `Soon` and `Future` stay as bare ROADMAP lines with no plan detail (the near-horizon principle). A plan is written when an item enters `Blocking` or `Next` and carries a required `roadmap:` field. A correct answer pushes back on planning Soon/Future items and cites the near-horizon rule.'
  },
  {
    skill: 'ki-plans',
    id: 'plan-no-phase-id',
    prompt:
      "Set up the frontmatter for a new plan under the `seo` theme. I want to record that it's in the 'Next' phase, and I figure the id can just restart at 001 within the seo folder. Anything to correct?",
    assertions: [
      { name: 'no phase field', re: /phase/i },
      { name: 'phase belongs in ROADMAP', re: /roadmap/i },
      { name: 'id global across themes', re: /global|across (all )?themes|unique/i },
      { name: 'plan path convention', re: /docs\/plans\//i }
    ],
    rubric:
      'House fact: plan frontmatter has **no `phase` field** (phasing lives in `ROADMAP.md`), and `id` is a global, zero-padded, three-digit string unique across ALL themes — it does not restart per theme. Placement is `docs/plans/<theme>/<NNN>-<slug>.md`. A correct answer removes the `phase` field and treats the id as globally unique, not per-theme.'
  },
  {
    skill: 'ki-plans',
    id: 'plan-blocks-graph',
    prompt:
      "Plan 005 can't start until plan 004 is finished. I've added `blocked-by: seo/004` to plan 005 and I'd like to start executing 005 now in parallel to save time. Anything wrong with that?",
    assertions: [
      { name: 'blocked-by field', re: /blocked-by/i },
      { name: 'reverse blocks edge', re: /blocks/i },
      { name: 'bare global id not theme-qualified', re: /\b004\b/ },
      { name: 'no in-progress before blockers done', re: /done|finish|complete|wait|before/i }
    ],
    rubric:
      'House fact: `blocks`/`blocked-by` are bidirectional and use **bare global ids** (`blocked-by: 004`, never `seo/004`); if A blocks B then B lists A and A lists B. No plan may move to `in-progress` before its blockers are `done`. A correct answer fixes the id to the bare form, requires the reverse `blocks: 005` on plan 004, and refuses to start 005 until 004 is done.'
  }
]
