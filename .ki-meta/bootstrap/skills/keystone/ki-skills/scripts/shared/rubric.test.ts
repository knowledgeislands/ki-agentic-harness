#!/usr/bin/env bun
/** Focused contract tests for the generic structured-rubric model and catalogue. */
import { describe, expect, test } from 'bun:test'
import {
  defineRubricFamily,
  OUTCOME_STATUSES,
  RUBRIC_PHASES,
  type RubricDefinition,
  type RubricItem,
  rubricTypes,
  VIOLATION_LEVELS,
  validateRubricCatalogue
} from './rubric.ts'

type RootContext = {
  document: { present: boolean }
  prose: { readable: boolean }
}

const hybrid: RubricItem<RootContext['document']> = {
  code: 'DOC-1',
  title: 'document is present and useful',
  description: 'The document exists and explains its subject usefully.',
  sources: ['STANDARD §1'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: ({ present }) => [{ status: present ? 'PASS' : 'VIOLATION', message: present ? 'document is present' : 'document is absent' }]
    },
    conform: {
      phase: 'PRIMARY',
      run: () => [{ status: 'FIXED', message: 'document was created' }]
    }
  },
  judgment: { prompt: 'Does the document explain its subject usefully?' }
}

const documentFamily = defineRubricFamily<RootContext, RootContext['document']>({
  code: 'DOC',
  title: 'Document',
  description: 'Document existence and utility.',
  standard: 'Standard §1',
  selectContext: ({ document }) => document,
  items: [hybrid]
})

const proseFamily = defineRubricFamily<RootContext, RootContext['prose']>({
  code: 'PROSE',
  title: 'Prose',
  description: 'Human review of the prose.',
  standard: 'Standard §2',
  selectContext: ({ prose }) => prose,
  items: [
    {
      code: 'PROSE-1',
      title: 'prose is readable',
      description: 'The prose is readable for its intended audience.',
      sources: ['STANDARD §2'],
      judgment: { prompt: 'Is the prose readable for its intended audience?' }
    }
  ]
})

const definition: RubricDefinition<RootContext> = {
  name: 'fixture',
  concern: 'fixture quality',
  families: [documentFamily, proseFamily]
}

const duplicateDocumentFamily = defineRubricFamily<RootContext, RootContext['document']>({
  code: 'DOC',
  title: 'Duplicate document family',
  description: 'A fixture used to prove semantic duplicate detection.',
  standard: 'Standard §1',
  selectContext: ({ document }) => document,
  items: [hybrid]
})

const mismatchedFamily = defineRubricFamily<RootContext, RootContext['document']>({
  code: 'OTHER',
  title: 'Mismatched family',
  description: 'A fixture used to prove item family membership.',
  standard: 'Standard §1',
  selectContext: ({ document }) => document,
  items: [
    {
      code: 'DOC-2',
      title: 'item in the wrong family',
      description: 'The item code does not belong to its containing family.',
      sources: ['STANDARD §1'],
      judgment: { prompt: 'Is this fixture intentionally in the wrong family?' }
    }
  ]
})

const invalidDefinition: RubricDefinition<RootContext> = {
  name: 'invalid fixture',
  concern: 'semantic catalogue invariants',
  families: [documentFamily, duplicateDocumentFamily, mismatchedFamily]
}

describe('structured rubric model', () => {
  test('accepts heterogeneous focused family contexts', () => {
    expect(validateRubricCatalogue(definition)).toHaveLength(0)
  })

  test('derives both aspects from a hybrid item', () => {
    expect(rubricTypes(hybrid)).toEqual(['MECHANICAL', 'JUDGMENT'])
  })

  test('preserves the phase, violation, and outcome vocabularies', () => {
    expect(RUBRIC_PHASES).toEqual(['PREPARE', 'INSPECT', 'PRIMARY', 'DERIVED', 'NORMALISE'])
    expect(VIOLATION_LEVELS).toEqual(['FAIL', 'WARN'])
    expect(OUTCOME_STATUSES).toEqual(['PASS', 'VIOLATION', 'NOT_APPLICABLE', 'INFO', 'FIXED'])
  })

  test('requires explicit audit outcomes and permits conform FIXED outcomes', () => {
    expect(hybrid.mechanical.audit.run({ present: true })).toHaveLength(1)
    expect(hybrid.mechanical.conform?.run({ present: false })[0]?.status).toBe('FIXED')
  })

  test('rejects duplicate family and item codes plus mismatched membership', () => {
    const issues = validateRubricCatalogue(invalidDefinition).map(({ message }) => message)
    expect(issues).toContain('duplicates family code DOC')
    expect(issues).toContain('duplicates rubric item code DOC-1')
    expect(issues).toContain('must belong to family OTHER')
  })
})
