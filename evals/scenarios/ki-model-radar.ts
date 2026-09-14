/**
 * Outcome scenarios for the `ki-model-radar` governance contract.
 *
 * These test the house-specific separation of recommendation, support, and
 * retirement state; evaluation-unit integrity; and evidence-backed consumer
 * hand-off rather than general model-comparison advice.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-model-radar',
    id: 'model-radar-separate-state-axes',
    prompt:
      'A model is currently a runtime default, but new evidence makes further adoption questionable. Can one status describe it, or which independent radar states must be recorded?',
    assertions: [
      { name: 'recommendation ring remains separate', re: /adopt|trial|assess|hold/i },
      { name: 'support state remains separate', re: /default|available|evaluation|not integrated/i },
      { name: 'retirement state remains separate', re: /active|retiring|retired/i },
      { name: 'movement remains separate', re: /new|inward|outward|unchanged/i }
    ],
    rubric:
      'House contract: recommendation ring (`adopt`, `trial`, `assess`, `hold`), actual harness support (`default`, `available`, `evaluation`, `not-integrated`), retirement (`active`, `retiring`, `retired`), and movement (`new`, `inward`, `outward`, `unchanged`) are independent axes. A default may move outward or to hold before downstream configuration changes.'
  },
  {
    skill: 'ki-model-radar',
    id: 'model-radar-evaluation-unit-integrity',
    prompt:
      'One source reports a bare model score and another reports a coding-agent route using that model. May I merge the scores into one ranking, and what identity must local evidence retain?',
    assertions: [
      {
        name: 'rejects numerical merging',
        re: /(do not|must not|cannot|should not)[^.\n]{0,70}(merge|combine)|not[^.\n]{0,40}comparable/i
      },
      {
        name: 'distinguishes evaluation units',
        re: /bare model|model-agent|provider endpoint|complete task environment/i
      },
      { name: 'retains executable route', re: /route|agent|harness|environment/i }
    ],
    rubric:
      'House contract: bare-model, provider-endpoint, model-agent, and complete-task-environment evidence remain distinct. They may corroborate one another but are not numerically merged without an explicit defensible method. Local evidence retains the exact model version plus executable agent, protocol/access route, harness, dataset, and environment.'
  },
  {
    skill: 'ki-model-radar',
    id: 'model-radar-movement-and-handoff',
    prompt:
      'A provider model card claims a new model leads its benchmark. Is that enough to move it from Assess to Adopt and change our default immediately?',
    assertions: [
      {
        name: 'provider claim is corroborating only',
        re: /provider[^.\n]{0,70}(corroborat|not enough|insufficient|self.report)/i
      },
      {
        name: 'requires independent and local-fit evidence',
        re: /(two|independent)[^.\n]{0,70}(source|evidence)|local.fit|controlled real use/i
      },
      {
        name: 'radar does not mutate consumers',
        re: /(does not|must not|cannot)[^.\n]{0,70}(default|configuration|runtime)|inform[^.\n]{0,30}(not|rather than).*mutat/i
      },
      {
        name: 'routes implementation through normal work',
        re: /ki-next|roadmap|owning repository|owner.local/i
      }
    ],
    rubric:
      'House contract: provider performance claims are corroborating evidence, not sufficient movement evidence. Inward movement needs current primary identity evidence, materially independent evaluation evidence where available, and local-fit evidence proportional to the ring; Trial requires controlled real use. The radar informs consumers but never changes defaults, installs routes, or retires support. Approved consequences become owner-local work through `ki-next`.'
  }
]
