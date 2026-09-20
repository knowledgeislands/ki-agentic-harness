import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { ChatGPTRubricContext } from '../contexts/chatgpt.ts'

export const SOURCE = {
  code: 'SOURCE',
  title: 'ChatGPT source evidence',
  standard: 'standards-chatgpt-acquisition.md',
  description: 'Authorised readable content paired with content-minimised identity and change evidence.',
  selectContext: (context) => context,
  items: [
    {
      code: 'SOURCE-1',
      title: 'readable source is authorised and explicit',
      description:
        'Readable conversation acquisition uses an authorised stable source and never treats opaque local records, browser scraping, or undocumented private APIs as faithful content.',
      sources: ['standards-chatgpt-acquisition.md#source-pairing'],
      judgment: judgment(
        'Does runtime evidence distinguish the readable source from opaque identity evidence and stop when either layer is unavailable?'
      )
    },
    {
      code: 'SOURCE-2',
      title: 'incremental checkpoints separate identity and content',
      description:
        'Identity enumeration and readable content versions carry distinct hashes and checkpoints so opaque changes can nominate revalidation without claiming readable content is unchanged.',
      sources: ['standards-chatgpt-acquisition.md#incremental-acquisition'],
      judgment: judgment(
        'Do checkpoints distinguish complete identity coverage from readable content evidence and advance only with explicit outcomes for every selected identity?'
      )
    }
  ]
} satisfies RubricFamily<ChatGPTRubricContext, ChatGPTRubricContext>
