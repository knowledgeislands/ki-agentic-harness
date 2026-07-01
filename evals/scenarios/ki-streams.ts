/**
 * Eval scenarios for the `ki-streams` skill — the Streams zone and the
 * Enactment Process. Each probes a house-specific rule (the Focus lifecycle, the
 * proposal path + suffix, the rollout gate, the canonical-zone gate) a skill-less baseline wouldn't know.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-streams',
    id: 'streams-focus-and-path',
    prompt:
      'In a Knowledge Islands base, I am starting a new active project called "Tooling Rollout" as a stream. What are the Focus lifecycle states a stream can sit in, and what exact folder/file path should the proposal live at?',
    assertions: [
      { name: 'names the five Focus states', re: /Active[\s\S]*Background[\s\S]*Dormant[\s\S]*Future[\s\S]*Settled/i },
      { name: 'path under Streams/Active', re: /Streams\/Active\//i },
      { name: 'Proposal suffix on the note', re: /Tooling Rollout Proposal/i }
    ],
    rubric:
      'House model: Streams sub-divides into five Focus folders — Active, Background, Dormant, Future, Settled. A new active stream lives at `Streams/Active/<Name> Proposal/<Name> Proposal.md` (leaf) — the proposal note carries a trailing " Proposal" suffix. A correct answer lists the five Focus states and gives a path under Streams/Active with the Proposal-suffixed note.'
  },
  {
    skill: 'ki-streams',
    id: 'streams-lifecycle-gate',
    prompt:
      'A proposal in my Knowledge Islands base is marked `ready`. Can I go ahead and roll out (apply) its changes to the canonical notes? What is the status sequence a proposal moves through?',
    assertions: [
      { name: 'ready is not sufficient / needs authorisation', re: /(not (enough|sufficient)|explicit (user )?authoris|approval needed|wait for|do not (begin|roll))/i },
      { name: 'names the lifecycle statuses', re: /draft[\s\S]*ready[\s\S]*in-progress[\s\S]*rolled-out[\s\S]*reviewed[\s\S]*completed/i }
    ],
    rubric:
      'House process (Enactment Process): `ready` is a necessary but NOT sufficient condition for rollout — rollout requires explicit user authorisation; exploratory talk is not approval. The status sequence is draft → ready → (in-progress | rejected) → rolled-out → reviewed → completed. A correct answer declines to roll out on `ready` alone (needs authorisation) and gives the lifecycle order.'
  },
  {
    skill: 'ki-streams',
    id: 'streams-canonical-zone-gate',
    prompt:
      'In my Knowledge Islands base I want to (a) substantively revise a note in `Pillars/` and (b) fix a typo in a `Calendar/` daily note. Which can I edit directly, and which has to go through the Streams / Enactment Process? Which zones does that gate protect?',
    assertions: [
      { name: 'names the three gated canonical zones', re: /Admin[\s\S]*Pillars[\s\S]*Resources/i },
      { name: 'the Pillars change routes through a proposal', re: /pillars[\s\S]*proposal/i },
      { name: 'the trivial / Calendar fix is exempt (direct edit)', re: /(typo|trivial|calendar)[\s\S]*(exempt|directly|without a proposal|no proposal)/i }
    ],
    rubric:
      'House process (the Enactment gate): nothing reaches a canonical zone — `Admin`, `Pillars`, `Resources` — except through an approved `ready` proposal, so a substantive `Pillars/` change must be routed through a Streams proposal rather than edited directly. Trivial fixes (typos / formatting), `Calendar/` entries, and `+/` triage are explicitly exempt and may be edited directly. A correct answer gates the Pillars edit behind a proposal, names the three canonical zones the gate protects, and lets the Calendar typo be a direct edit.'
  }
]
