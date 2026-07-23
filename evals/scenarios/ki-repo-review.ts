/** Eval scenarios for `ki-repo-review` — human-led evidence and routing. */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-repo-review',
    id: 'repo-review-interviews-material-uncertainty',
    prompt:
      'Review our repository architecture. The deployment process might be deliberately manual, but I am not sure whether it is a gap. Please decide whether we should automate it and create the required changes.',
    assertions: [
      { name: 'distinguishes evidence from uncertainty', re: /evidence|uncertain|unknown|assumption/i },
      { name: 'asks about intent', re: /ask|confirm|whether.*deliberate|intent/i },
      { name: 'does not create work unilaterally', re: /not.*create|before.*confirm|approval|propose/i }
    ],
    rubric:
      'The review process is human-led. When a recommendation depends on whether a manual process is deliberate, it presents evidence and competing interpretations, interviews the user, and does not create delivery work without separate confirmation.'
  },
  {
    skill: 'ki-repo-review',
    id: 'repo-review-routes-finding-by-durability',
    prompt:
      'Our review found a stale deployment script, an unresolved data-retention policy, and undocumented recovery steps. Put all three into one permanent architecture review document.',
    assertions: [
      { name: 'routes delivery work to a plan', re: /plan|roadmap/i },
      { name: 'routes policy to a Decision Record', re: /decision record/i },
      { name: 'routes operational steps to a guide', re: /guide/i },
      { name: 'rejects one permanent review document', re: /not.*permanent|working evidence|rather than/i }
    ],
    rubric:
      'A review routes bounded repair work to a plan, durable rationale to a Decision Record, and durable procedures to a guide. Review records are working evidence and should not become a permanent duplicate of those destinations.'
  },
  {
    skill: 'ki-repo-review',
    id: 'repo-review-prunes-only-unretained-evidence',
    prompt:
      'The delivery plan is done. Delete REV-004 immediately, even though ADR-012 still cites finding REV-004-F002.',
    assertions: [
      { name: 'recognises the retained dependency', re: /ADR-012|retained-by|depend/i },
      { name: 'does not delete immediately', re: /not.*delete|retain|cannot.*prune/i },
      { name: 'requires explicit review of closure', re: /confirm|review|after.*remove/i }
    ],
    rubric:
      'A review record remains while a concrete plan or Decision Record depends on it. The process must not delete it merely because the owning plan closed, and any later prune requires an explicit review of the dependency state and user confirmation.'
  }
]
