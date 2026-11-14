import { judgment, type RubricFamily, type RubricItem } from '../../shared/rubric.ts'
import type { DesignContext } from '../contexts/design.ts'

const DESIGN_1: RubricItem<DesignContext> = {
  code: 'DESIGN-1',
  title: 'each design starts from a brief',
  description:
    'A design starts from a written brief that says what it is for, what it must satisfy and what it leaves out, agreed before any option is drawn, with the names already in use read first.',
  sources: ['standard-design.md#42-how-a-design-is-shaped'],
  judgment: judgment('Did each design start from a written, agreed brief that read the names already in use?')
}

const DESIGN_2: RubricItem<DesignContext> = {
  code: 'DESIGN-2',
  title: "options are weighed and the choice is the owner's",
  description:
    'A design offers more than one way to meet its brief, each with what it costs, with the recommended one marked, so the owner makes the choice.',
  sources: ['standard-design.md#42-how-a-design-is-shaped'],
  judgment: judgment("Were real options weighed with their costs, and was the choice the owner's?")
}

const DESIGN_3: RubricItem<DesignContext> = {
  code: 'DESIGN-3',
  title: 'a second reader reviews the design',
  description:
    'A second reader checks the chosen design against its brief and the governing standard before it is called final, and the design says what has not been checked.',
  sources: ['standard-design.md#42-how-a-design-is-shaped'],
  judgment: judgment(
    'Was the design reviewed against its brief and standard by a second reader, and does it say what was not checked?'
  )
}

const DESIGN_4: RubricItem<DesignContext> = {
  code: 'DESIGN-4',
  title: 'each level is agreed before the finer one',
  description:
    "A design is drawn at its kind's levels, coarsest first, and each level is agreed before the next is drawn: for visual design, information architecture, then wireframes, then mock-ups.",
  sources: ['standard-design.md#43-each-kinds-levels'],
  judgment: judgment('Was each coarser level agreed before the finer one was drawn?')
}

const DESIGN_5: RubricItem<DesignContext> = {
  code: 'DESIGN-5',
  title: "a design's choices are written down in Authoring's forms",
  description:
    "Each choice a design settles is a decision record, an accepted design a specification, and an architecture a diagram, each in its Authoring skill's form.",
  sources: ['standard-design.md#44-where-a-design-is-written-down'],
  judgment: judgment(
    "Is each settled choice, accepted design and architecture written down in its Authoring skill's form?"
  )
}

export const DESIGN: RubricFamily<DesignContext, DesignContext> = {
  code: 'DESIGN',
  title: 'Design shaping',
  description:
    "Each design starts from a brief, weighs options, is reviewed, is drawn at its kind's levels and leaves its records in Authoring's forms.",
  standard: 'standard-design.md',
  selectContext: (context) => context,
  items: [DESIGN_1, DESIGN_2, DESIGN_3, DESIGN_4, DESIGN_5]
}
