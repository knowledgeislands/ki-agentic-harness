import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { ChatGPTRubricContext } from '../contexts/chatgpt.ts'

export const RETIRE = {
  code: 'RETIRE',
  title: 'ChatGPT source retirement',
  standard: 'standards-chatgpt-acquisition.md',
  description: 'Separate release authority and current evidence.',
  selectContext: (context) => context,
  items: [
    {
      code: 'RETIRE-1',
      title: 'retirement is separately authorised',
      description:
        'Acquisition remains read-only; archiving or deleting a conversation needs a separate current decision, a verified capture at a named Git revision, and immediate human approval.',
      sources: ['standards-chatgpt-acquisition.md#source-retirement'],
      judgment: judgment(
        'Does proposed retirement refuse stale or incomplete evidence and stop for explicit human approval?'
      )
    }
  ]
} satisfies RubricFamily<ChatGPTRubricContext, ChatGPTRubricContext>
