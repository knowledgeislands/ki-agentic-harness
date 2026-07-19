import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { KbRubricContext } from '../contexts/kb.ts'
import { ADMIN } from './admin.ts'
import { CONFIG } from './config.ts'
import { LINK } from './links.ts'
import { MEM } from './memory.ts'
import { NOTE } from './notes.ts'
import { ROUTE } from './routing.ts'
import { ZONE } from './zones.ts'

const context = (value: KbRubricContext): KbRubricContext => value
export const KI_KB_RUBRIC: RubricDefinition<KbRubricContext> = {
  name: 'ki-kb',
  concern: 'Knowledge Islands knowledge bases',
  families: [
    defineRubricFamily({
      code: 'ZONE',
      title: 'zone layout',
      description: 'Required zones, indexes, staging, and output placement.',
      standard: 'standards.md',
      selectContext: context,
      items: ZONE
    }),
    defineRubricFamily({
      code: 'CONFIG',
      title: 'KB configuration',
      description: 'The keyless marker and validate-down [ki-kb] configuration surface.',
      standard: 'standards.md',
      selectContext: context,
      items: CONFIG
    }),
    defineRubricFamily({
      code: 'ADMIN',
      title: 'Admin zone',
      description: 'Optional Admin subdivisions and governance baseline.',
      standard: 'standards.md',
      selectContext: context,
      items: ADMIN
    }),
    defineRubricFamily({
      code: 'ROUTE',
      title: 'routing and placement',
      description: 'Judgment review of the knowledge-base routing test.',
      standard: 'standards.md',
      selectContext: context,
      items: ROUTE
    }),
    defineRubricFamily({
      code: 'NOTE',
      title: 'note conventions',
      description: 'Frontmatter mechanics and note-authoring judgment.',
      standard: 'standards.md',
      selectContext: context,
      items: NOTE
    }),
    defineRubricFamily({
      code: 'MEM',
      title: 'memory cascade',
      description: 'Memory-index accuracy and its always-loaded anchor.',
      standard: 'standards.md',
      selectContext: context,
      items: MEM
    }),
    defineRubricFamily({
      code: 'LINK',
      title: 'base linking',
      description: 'Judgment review of Obsidian wikilink content.',
      standard: 'standards.md',
      selectContext: context,
      items: LINK
    })
  ]
}
export const KI_KB_FAMILY_CODES = KI_KB_RUBRIC.families.map((family) => family.code)
