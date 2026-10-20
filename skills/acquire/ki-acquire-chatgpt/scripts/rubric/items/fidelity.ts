import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { ChatGPTRubricContext } from '../contexts/chatgpt.ts'

export const FIDELITY = {
  code: 'FIDELITY',
  title: 'ChatGPT capture fidelity',
  standard: 'standards-chatgpt-acquisition.md',
  description: 'Faithful digests with honest dates, exact attachments, and explicit omissions.',
  selectContext: (context) => context,
  items: [
    {
      code: 'FIDELITY-1',
      title: 'the digest is faithful',
      description:
        'Reasoning, decisions, corrections, and uncertainty are preserved, dates are evidenced or unknown, and required attachments are exact originals or listed omissions.',
      sources: ['standards-chatgpt-acquisition.md#fidelity'],
      judgment: judgment(
        'Does the capture keep source statements and interpretation distinct without fabricating dates, messages, or URLs, and preserve or list every attachment?'
      )
    }
  ]
} satisfies RubricFamily<ChatGPTRubricContext, ChatGPTRubricContext>
