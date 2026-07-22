import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { RoadmapContext } from '../contexts/roadmap.ts'
import { EXPAND } from './expand.ts'
import { HANDOFF } from './handoffs.ts'
import { ITEM } from './item.ts'
import { PLAN } from './plans.ts'
import { PROFILE } from './profile.ts'
import { PROJ } from './proj.ts'
import { ROAD } from './roadmaps.ts'
import { SAFE } from './safety.ts'
import { SCOPE } from './scope.ts'
import { THEME } from './themes.ts'

const context = (value: RoadmapContext): RoadmapContext => value

export const KI_REPO_ROADMAP_RUBRIC: RubricDefinition<RoadmapContext> = {
  name: 'ki-repo-roadmap',
  concern: 'repository roadmaps',
  families: [
    defineRubricFamily({
      code: 'SCOPE',
      title: 'scope',
      description: 'Profile applicability.',
      standard: 'standards.md',
      selectContext: context,
      items: SCOPE
    }),
    defineRubricFamily({
      code: 'PROFILE',
      title: 'profile',
      description: 'Simple and thematic profile structure.',
      standard: 'standards.md',
      selectContext: context,
      items: PROFILE
    }),
    defineRubricFamily({
      code: 'ROAD',
      title: 'roadmaps',
      description: 'Horizon structure and placement.',
      standard: 'standards.md',
      selectContext: context,
      items: ROAD
    }),
    defineRubricFamily({
      code: 'THEME',
      title: 'themes',
      description: 'Thematic roadmap structure.',
      standard: 'standards.md',
      selectContext: context,
      items: THEME
    }),
    defineRubricFamily({
      code: 'ITEM',
      title: 'items',
      description: 'Thematic item identity.',
      standard: 'standards.md',
      selectContext: context,
      items: ITEM
    }),
    defineRubricFamily({
      code: 'PROJ',
      title: 'portfolio projection',
      description: 'Generated root portfolio.',
      standard: 'standards.md',
      selectContext: context,
      items: PROJ
    }),
    defineRubricFamily({
      code: 'PLAN',
      title: 'plans',
      description: 'Plan identity, linkage, and dependencies.',
      standard: 'plan-format.md',
      selectContext: context,
      items: PLAN
    }),
    defineRubricFamily({
      code: 'SAFE',
      title: 'safe mechanics',
      description: 'Safe write constraints.',
      standard: 'standards.md',
      selectContext: context,
      items: SAFE
    }),
    defineRubricFamily({
      code: 'EXPAND',
      title: 'expansion',
      description: 'Judgment-led profile migration.',
      standard: 'standards.md',
      selectContext: context,
      items: EXPAND
    }),
    defineRubricFamily({
      code: 'HANDOFF',
      title: 'handoff review',
      description: 'Judgment-led review of inbound adoption and outbound follow-up.',
      standard: 'standards.md',
      selectContext: context,
      items: HANDOFF
    })
  ]
}

export const KI_REPO_ROADMAP_FAMILY_CODES = KI_REPO_ROADMAP_RUBRIC.families.map((family) => family.code)
