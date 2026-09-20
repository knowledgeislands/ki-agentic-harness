import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { ChatGPTRubricContext } from '../contexts/chatgpt.ts'

export const ROUTING = {
  code: 'ROUTING',
  title: 'ChatGPT project routing',
  standard: 'standards-chatgpt-acquisition.md',
  description: 'Immutable project selectors, prefixed presentation, and explicit receiver conflicts.',
  selectContext: (context) => context,
  items: [
    {
      code: 'ROUTING-1',
      title: 'project identity survives renames',
      description:
        'Receiver bindings use immutable project IDs while current `<Domain>: <Topic>` names, parsed prefixes, and prior names remain review evidence and aliases.',
      sources: ['standards-chatgpt-acquisition.md#project-identity-and-naming'],
      judgment: judgment(
        'Does each project binding use stable source identity while retaining current and prior names and making prefix drift visible?'
      )
    },
    {
      code: 'ROUTING-2',
      title: 'receiver conflicts fail closed',
      description:
        'Unknown prefixes, unmapped projects, conflicting bindings, and intentional duplication remain explicit rather than resolving through lexical or repository precedence.',
      sources: ['standards-chatgpt-acquisition.md#receiver-routing'],
      judgment: judgment(
        'Are unmapped, malformed, conflicting, and duplicated project routes visible and resolved only through explicit human authority?'
      )
    }
  ]
} satisfies RubricFamily<ChatGPTRubricContext, ChatGPTRubricContext>
