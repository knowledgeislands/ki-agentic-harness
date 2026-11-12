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
        'Every card carries id, title, type and status, with status one of proposal, future-concept or agreed, a type its root definition declares, and the further properties the root definition requires of that type.',
      sources: ['standards-knowledge-graph.md#cards', 'standards-knowledge-graph.md#the-root-definition'],
      judgment: judgment(
        'Does every card in the supplied evidence carry id, title, type and status, with a status from the closed list, a declared card type and every property its root definition requires?'
      )
    },
    {
      code: 'CARD-2',
      title: 'links are typed only where an assertion is meant',
      description:
        'A front-matter links entry pairs a reference with a predicate from a vocabulary the root definition declares, SKOS by default and ki: only where no declared vocabulary has the term; unannotated links stay navigational, and link definitions hold only destinations at the bottom of the card.',
      sources: ['standards-knowledge-graph.md#links', 'standards-knowledge-graph.md#the-root-definition'],
      judgment: judgment(
        'Does every predicate express an intended assertion from a declared vocabulary, using ki: only where SKOS and the other declared vocabularies lack the term, with no invented predicate on a navigational link?'
      )
    },
    {
      code: 'CARD-3',
      title: 'one authoritative definition per concept within a graph',
      description:
        'Other cards give short context and link to the defining card rather than repeat it, and no card is made for every noun.',
      sources: ['standards-knowledge-graph.md#cards', 'standards-knowledge-graph.md#tending'],
      judgment: judgment(
        'Is each concept defined once within its graph, with other cards linking to that definition, and does every card earn its place?'
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
    },
    {
      code: 'CARD-5',
      title: 'a card is named by its readable id',
      description:
        'A card file is `<id>.md`, its id is short and readable, never a UUID, carries its subgraph before a dot where the graph has subgraphs, and is unique in the graph; its folder is never part of its identity, and where the graph has folders the card sits in its subgraph’s folder.',
      sources: ['standards-knowledge-graph.md#the-graph'],
      judgment: judgment(
        'Is every card file named from its front-matter id, is each id readable, unique and prefixed with its subgraph where the graph has subgraphs, does no front-matter link depend on a folder, and where the graph has folders, does each card sit in the folder of its subgraph?'
      )
    },
    {
      code: 'CARD-6',
      title: 'no link reaches into part of a card',
      description:
        'A link points at a whole card, never at an anchor inside one; a card that others need in part is split so each part linked to is a card of its own.',
      sources: ['standards-knowledge-graph.md#links'],
      judgment: judgment(
        'Does every link between cards target a whole card file, with any card that is needed in part split into cards of their own?'
      )
    }
  ]
} satisfies RubricFamily<KnowledgeGraphContext, KnowledgeGraphContext>
