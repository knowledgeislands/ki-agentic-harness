import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { HarnessRubricContext } from '../contexts/harness.ts'
import { CLAUDE } from './claude.ts'
import { COLLISION } from './collision.ts'
import { CONFIG } from './config.ts'
import { LAYOUT } from './layout.ts'
import { LONGEVITY } from './longevity.ts'
import { PACKAGE } from './package.ts'
import { SKILLS } from './skills.ts'

const context = (value: HarnessRubricContext): HarnessRubricContext => value
export const KI_HARNESS_RUBRIC: RubricDefinition<HarnessRubricContext> = {
  name: 'ki-harness', concern: 'Knowledge Islands agentic harnesses', families: [
    defineRubricFamily({ code: 'LAY', title: 'Directory layout and files', description: 'The five-part harness container and required root files.', standard: 'standards.md#layout', selectContext: context, items: LAYOUT }),
    defineRubricFamily({ code: 'CLAUDE', title: 'Root orientation', description: 'Coverage and freshness of the effective root orientation.', standard: 'standards.md#claudemd', selectContext: context, items: CLAUDE }),
    defineRubricFamily({ code: 'PKG', title: 'Package script families', description: 'Harness-owned package scripts and their target integrity.', standard: 'standards.md#packagejson', selectContext: context, items: PACKAGE }),
    defineRubricFamily({ code: 'CONFIG', title: 'Harness configuration', description: 'Knowledge Islands governance declarations.', standard: 'standards.md#ki-configtoml', selectContext: context, items: CONFIG }),
    defineRubricFamily({ code: 'SKILLS', title: 'Skill directory convention', description: 'Direct skill-name integrity within the harness.', standard: 'standards.md#skills-directory', selectContext: context, items: SKILLS }),
    defineRubricFamily({ code: 'LONG', title: 'Longevity', description: 'Refresh discipline for the harness standard.', standard: 'standards.md', selectContext: context, items: LONGEVITY }),
    defineRubricFamily({ code: 'COLL', title: 'Collision and boundary', description: 'Composition and off-ramp clarity.', standard: 'standards.md', selectContext: context, items: COLLISION })
  ]
}
export const KI_HARNESS_FAMILY_CODES = KI_HARNESS_RUBRIC.families.map((family) => family.code)
