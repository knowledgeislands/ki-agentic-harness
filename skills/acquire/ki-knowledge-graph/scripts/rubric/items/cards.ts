import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { KnowledgeGraphContext } from '../contexts/knowledge-graph.ts'

export const CARD = {
  code: 'CARD',
  title: 'Semantic Markdown cards',
  standard: 'standards-knowledge-graph.md',
  description: 'Cards are judged on supplied card evidence; each says what one thing is, in the house card format.',
  selectContext: (context) => context,
  items: [
    {
      code: 'CARD-1',
      title: 'front matter identifies the card and its status',
      description:
        'Every card carries id, title, type, status, territory and island, with status one of proposal, future-concept or agreed.',
      sources: ['standards-knowledge-graph.md#cards'],
      judgment: judgment(
        'Does every card in the supplied evidence carry id, title, type, status, territory and island, with a status from the closed list?'
      )
    },
    {
      code: 'CARD-2',
      title: 'links are typed only where an assertion is meant',
      description:
        'A front-matter links entry pairs a reference with a real predicate; unannotated links stay navigational, and link definitions hold only destinations at the bottom of the card.',
      sources: ['standards-knowledge-graph.md#cards'],
      judgment: judgment(
        'Does every predicate express an intended assertion from an established vocabulary or the ki: prefix, with no invented predicate on a navigational link?'
      )
    },
    {
      code: 'CARD-3',
      title: 'one authoritative definition per concept within a territory',
      description:
        'Other cards give short context and link to the defining card rather than repeat it, and no card is made for every noun.',
      sources: ['standards-knowledge-graph.md#cards', 'standards-knowledge-graph.md#tending'],
      judgment: judgment(
        'Is each concept defined once within its territory, with other cards linking to that definition, and does every card earn its place?'
      )
    },
    {
      code: 'CARD-4',
      title: 'cards stand alone and keep method out',
      description:
        'No card links to a capture or has a body origin section; any origin is one plain front-matter line; meetings are sources, future ideas are future concepts, and method links to the skill rather than being restated.',
      sources: ['standards-knowledge-graph.md#cards'],
      judgment: judgment(
        'Does every card avoid capture links and body origin sections, treat meetings as sources and future ideas as future concepts, and leave curation, tending and dispatch method to the skill?'
      )
    }
  ]
} satisfies RubricFamily<KnowledgeGraphContext, KnowledgeGraphContext>
