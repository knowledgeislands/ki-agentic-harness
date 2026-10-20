import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { ChatGPTRubricContext } from '../contexts/chatgpt.ts'

export const SOURCE = {
  code: 'SOURCE',
  title: 'ChatGPT source and coverage',
  standard: 'standards-chatgpt-acquisition.md',
  description: 'Readable source only, honest coverage, and the end point in the digest front matter.',
  selectContext: (context) => context,
  items: [
    {
      code: 'SOURCE-1',
      title: 'readable source is authorised and explicit',
      description:
        'Captures use readable conversation text or an official export and never treat opaque local records, browser scraping, or undocumented private APIs as content.',
      sources: ['standards-chatgpt-acquisition.md#readable-source'],
      judgment: judgment('Does the evidence show a readable, authorised source and stop where none was available?')
    },
    {
      code: 'SOURCE-2',
      title: 'the end point lives in the digest front matter',
      description:
        'Each capture records its inclusive last substantive message, scope, sequence, and previous capture in its README front matter, with no separate mark file.',
      sources: ['standards-chatgpt-acquisition.md#coverage-and-end-point'],
      judgment: judgment(
        'Does the front matter state an evidenced end point, and did retries no-op, finish in place, or start a linked segment accordingly?'
      )
    }
  ]
} satisfies RubricFamily<ChatGPTRubricContext, ChatGPTRubricContext>
