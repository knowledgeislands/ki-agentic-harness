import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { ChatGPTRubricContext } from '../contexts/chatgpt.ts'

export const FIDELITY = {
  code: 'FIDELITY',
  title: 'ChatGPT conversation fidelity',
  standard: 'standards-chatgpt-acquisition.md',
  description: 'Complete readable conversations, explicit omissions, immutable versions, and retained copies.',
  selectContext: (context) => context,
  items: [
    {
      code: 'FIDELITY-1',
      title: 'complete conversations are acquired',
      description:
        'The acquisition unit is one complete conversation with ordered roles, returned messages, write-ups, assets, provenance, hashes, and explicit omissions rather than selected excerpts.',
      sources: ['standards-chatgpt-acquisition.md#conversation-fidelity'],
      judgment: judgment(
        'Does each acquired version preserve all readable content and assets the source returned without fabricating missing fields or decoding opaque records?'
      )
    },
    {
      code: 'FIDELITY-2',
      title: 'versions and missing sources are non-destructive',
      description:
        'Changed conversations create verified versions, unchanged repeats avoid payload churn, and source absence never deletes a retained receiver copy.',
      sources: ['standards-chatgpt-acquisition.md#incremental-acquisition'],
      judgment: judgment(
        'Does repeated acquisition preserve prior versions, avoid unexplained churn, and report missing source identities without deleting retained evidence?'
      )
    }
  ]
} satisfies RubricFamily<ChatGPTRubricContext, ChatGPTRubricContext>
