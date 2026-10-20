import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { ChatGPTRubricContext } from '../contexts/chatgpt.ts'

export const ROUTING = {
  code: 'ROUTING',
  title: 'ChatGPT routing',
  standard: 'standards-chatgpt-acquisition.md',
  description: 'Routes from project and conversation evidence, with unknown routes left visible.',
  selectContext: (context) => context,
  items: [
    {
      code: 'ROUTING-1',
      title: 'unknown and conflicting routes stay visible',
      description:
        'Project names and conversation evidence inform the route; unknown or conflicting routes remain open for review rather than defaulting.',
      sources: ['standards-chatgpt-acquisition.md#routing'],
      judgment: judgment('Was the route evidenced, with any unknown or conflicting route left visible for review?')
    }
  ]
} satisfies RubricFamily<ChatGPTRubricContext, ChatGPTRubricContext>
