import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { StreamsContext } from '../contexts/streams.ts'
import { CONFIG } from './config.ts'
import { ENACT } from './enactment.ts'
import { GATE } from './gate.ts'
import { STREAM } from './stream.ts'
const context = (value: StreamsContext): StreamsContext => value
export const KI_KB_STREAMS_RUBRIC: RubricDefinition<StreamsContext> = {
  name: 'ki-kb-streams',
  concern: 'Knowledge Islands Streams zones',
  families: [
    defineRubricFamily({
      code: 'STREAM',
      title: 'Streams structure',
      description: 'Focus layout, indexes, proposal suffixes, and placement.',
      standard: 'references/Streams Structure Reference.md',
      selectContext: context,
      items: STREAM
    }),
    defineRubricFamily({
      code: 'ENACT',
      title: 'Enactment Process',
      description: 'Proposal frontmatter, lifecycle, and settlement.',
      standard: 'references/Enactment Process Reference.md',
      selectContext: context,
      items: ENACT
    }),
    defineRubricFamily({
      code: 'GATE',
      title: 'always-loaded gate',
      description: 'The canonical-change gate anchor.',
      standard: 'SKILL.md',
      selectContext: context,
      items: GATE
    }),
    defineRubricFamily({
      code: 'CONFIG',
      title: 'Streams configuration',
      description: 'The skill-owned ki-kb-streams table.',
      standard: 'SKILL.md',
      selectContext: context,
      items: CONFIG
    })
  ]
}
export const KI_KB_STREAMS_FAMILY_CODES = KI_KB_STREAMS_RUBRIC.families.map((family) => family.code)
