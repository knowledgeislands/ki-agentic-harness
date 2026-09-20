import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { ChatGPTRubricContext } from '../contexts/chatgpt.ts'

export const RETIRE = {
  code: 'RETIRE',
  title: 'ChatGPT source retirement',
  standard: 'standards-chatgpt-acquisition.md',
  description: 'Separate release authority, current exact evidence, and a manual-only fallback.',
  selectContext: (context) => context,
  items: [
    {
      code: 'RETIRE-1',
      title: 'retirement is separately authorised',
      description:
        'Acquisition remains read-only; source retirement requires recoverable receiver evidence, a current exact manifest, unchanged source identity and content, resolved omissions, and immediate human approval.',
      sources: ['standards-chatgpt-acquisition.md#source-retirement'],
      judgment: judgment(
        'Does proposed retirement refuse stale or incomplete evidence and stop at a manual manifest when no supported identity-specific mutation surface exists?'
      )
    }
  ]
} satisfies RubricFamily<ChatGPTRubricContext, ChatGPTRubricContext>
