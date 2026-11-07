import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { ExchangeDynamicsContext } from '../contexts/exchange-dynamics.ts'

export const RENDER = {
  code: 'RENDER',
  title: 'Renderings',
  standard: 'standards-exchange-dynamics-rendering.md',
  description: 'Renderings are judged against the analysis they claim to draw and the rendering standard.',
  selectContext: (context) => context,
  items: [
    {
      code: 'RENDER-1',
      title: 'a rendering draws its analysis and adds nothing',
      description:
        'Every quotation, score, phase and conclusion shown comes from the analysis; a change of reading is made in the analysis and rendered afresh.',
      sources: ['standards-exchange-dynamics.md#workflow', 'standards-exchange-dynamics-rendering.md'],
      judgment: judgment('Does the rendering show anything the analysis does not hold, or differ from it anywhere?')
    },
    {
      code: 'RENDER-2',
      title: 'colour encodes tension only, always with a label',
      description:
        'One green, yellow, amber and red scale runs through chronology, graph and phases, never says who was right, is paired with text and holds its contrast in light and dark.',
      sources: ['standards-exchange-dynamics-rendering.md#colour'],
      judgment: judgment(
        'Is colour used only for tension on the standard scale, paired with a text label and legible in both themes?'
      )
    },
    {
      code: 'RENDER-3',
      title: 'participants are shown honestly and the rendering can be reproduced',
      description:
        'Avatars appear only where supplied and appropriate, with initials otherwise and no invented likeness, and a design-decisions record names the analysis, renderer, variant and instructions.',
      sources: [
        'standards-exchange-dynamics-rendering.md#reference-layout',
        'standards-exchange-dynamics-rendering.md#design-decisions'
      ],
      judgment: judgment(
        'Are participants shown without invented likenesses, and could another model reproduce the rendering from its design-decisions record?'
      )
    }
  ]
} satisfies RubricFamily<ExchangeDynamicsContext, ExchangeDynamicsContext>
