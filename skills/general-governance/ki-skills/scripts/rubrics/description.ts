import type { RubricItem } from '../lib/rubric/rubric.ts'
import { containsXmlTag, stripCode } from './support/text.ts'

const DESCRIPTION_MAX_LENGTH = 1024

export type DescriptionRubricContext = {
  description: string | undefined
}

export const DESC_1: RubricItem<DescriptionRubricContext> = {
  code: 'DESC-1',
  title: 'description is present and non-empty',
  description: 'The skill frontmatter declares a non-empty `description` value.',
  sources: ['SPEC', 'CC'],
  audit: ({ description }) =>
    !description || description.trim() === ''
      ? [{ type: 'M', level: 'FAIL', code: DESC_1.code, message: '`description` is missing or empty' }]
      : []
}

export const DESC_2: RubricItem<DescriptionRubricContext> = {
  code: 'DESC-2',
  title: 'description is no longer than 1024 characters',
  description: 'The skill description is at most 1024 characters long.',
  sources: ['SPEC', 'BP'],
  audit: ({ description }) =>
    description && description.length > DESCRIPTION_MAX_LENGTH
      ? [
          {
            type: 'M',
            level: 'FAIL',
            code: DESC_2.code,
            message: `\`description\` is ${description.length} chars (max ${DESCRIPTION_MAX_LENGTH})`
          }
        ]
      : []
}

export const DESC_3: RubricItem<DescriptionRubricContext> = {
  code: 'DESC-3',
  title: 'description contains no XML tags',
  description: 'The skill description contains no XML tags outside inline-code placeholders.',
  sources: ['BP'],
  audit: ({ description }) =>
    description && containsXmlTag(stripCode(description))
      ? [{ type: 'M', level: 'FAIL', code: DESC_3.code, message: '`description` contains an XML tag' }]
      : []
}

export const DESC_4: RubricItem<DescriptionRubricContext> = {
  code: 'DESC-4',
  title: 'description states what the skill does and when to use it',
  description: 'The skill description explains both its capability and the situations that should invoke it.',
  sources: ['SPEC', 'BP'],
  judgment: { prompt: 'Does the description state both what this skill does and when it should be used?' }
}

export const DESC_5: RubricItem<DescriptionRubricContext> = {
  code: 'DESC-5',
  title: 'description is written in the third person',
  description: 'The skill description uses third-person wording rather than first or second person.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Is the description consistently written in the third person?' }
}

export const DESC_6: RubricItem<DescriptionRubricContext> = {
  code: 'DESC-6',
  title: 'description includes concrete trigger phrases',
  description: 'The skill description includes phrases a user would actually say when they need the capability.',
  sources: ['SPEC', 'BP', 'CC'],
  judgment: { prompt: 'Does the description include concrete trigger phrases a user would say?' }
}

export const DESC_7: RubricItem<DescriptionRubricContext> = {
  code: 'DESC-7',
  title: 'description leans toward firing and front-loads its main trigger',
  description: 'The skill description makes selection likely when appropriate and leads with its most important trigger.',
  sources: ['ENG', 'COMMUNITY', 'CC'],
  judgment: { prompt: 'Does the description lean toward appropriate selection and front-load its most important trigger?' }
}

export const DESC_8: RubricItem<DescriptionRubricContext> = {
  code: 'DESC-8',
  title: 'description avoids vague phrasing',
  description: 'The skill description identifies a concrete capability rather than making a vague claim.',
  sources: ['SPEC', 'BP'],
  judgment: { prompt: 'Does the description avoid vague phrases such as "helps with documents"?' }
}

export const DESC_9: RubricItem<DescriptionRubricContext> = {
  code: 'DESC-9',
  title: 'description may state explicit non-triggers where collision is likely',
  description: 'Where adjacent skills could collide, the description can state the cases that should route elsewhere.',
  sources: ['COMMUNITY'],
  judgment: { prompt: 'Where skill-selection collision is likely, would explicit non-triggers improve routing?' }
}

export const DESC: readonly RubricItem<DescriptionRubricContext>[] = [
  DESC_1,
  DESC_2,
  DESC_3,
  DESC_4,
  DESC_5,
  DESC_6,
  DESC_7,
  DESC_8,
  DESC_9
]
