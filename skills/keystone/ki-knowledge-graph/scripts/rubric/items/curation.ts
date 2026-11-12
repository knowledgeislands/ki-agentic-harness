import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { KnowledgeGraphContext } from '../contexts/knowledge-graph.ts'

export const CURATE = {
  code: 'CURATE',
  title: 'Transactional curation',
  standard: 'standards-knowledge-graph.md',
  description:
    'Curation is judged on the captures and the commits that worked them; a mechanical pass does not prove faithful curation.',
  selectContext: (context) => context,
  items: [
    {
      code: 'CURATE-1',
      title: 'each curation commit pairs the card change with its strike-through',
      description:
        'One bounded item per commit: the card change and the whole part struck in its capture, original text kept inside the strike and a note naming every destination; a dropped part has its own considered-and-dropped commit with a reason.',
      sources: ['standards-knowledge-graph.md#transactional-curation'],
      judgment: judgment(
        'Does each curation commit carry one item’s card change together with its strike-through and destination note, and each dropped part its own commit and reason?'
      )
    },
    {
      code: 'CURATE-2',
      title: 'every destination named in a strike note exists',
      description:
        'A struck part names its destinations, each of which resolves to a card; a part several areas need stays unstruck with its done and pending areas named.',
      sources: ['standards-knowledge-graph.md#transactional-curation'],
      judgment: judgment(
        'Does every strike note name destinations that exist, and does every partly curated part stay unstruck with what is done and pending?'
      )
    },
    {
      code: 'CURATE-3',
      title: 'captures are deleted only when wholly struck',
      description:
        'No capture is deleted while it holds an unstruck part, and a capture holding a part marked capture-only is never deleted.',
      sources: ['standards-knowledge-graph.md#transactional-curation'],
      judgment: judgment(
        'Was every deleted capture wholly struck, with no capture deleted that held a capture-only part?'
      )
    },
    {
      code: 'CURATE-4',
      title: 'curation keeps what is durable at the agreed pace',
      description:
        'Positions, proposals and commitments are kept with the organisation holding each, the moment’s detail stays in the capture, and curation takes today first, then one day back at a time with a report after each.',
      sources: ['standards-knowledge-graph.md#the-funnel', 'standards-knowledge-graph.md#transactional-curation'],
      judgment: judgment(
        'Did curation keep durable positions and commitments against organisations, leave ephemeral detail in the capture, and follow the today-first, one-day-back pace with reports?'
      )
    }
  ]
} satisfies RubricFamily<KnowledgeGraphContext, KnowledgeGraphContext>
