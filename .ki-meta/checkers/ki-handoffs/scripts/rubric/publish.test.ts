import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { KI_HANDOFFS_RUBRIC } from './items/index.ts'
import { renderRubric } from './publish.ts'

const publicationPath = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))

test('the checked-in handoffs rubric matches the structured catalogue', () => {
  expect(readFileSync(publicationPath, 'utf8')).toBe(renderRubric(KI_HANDOFFS_RUBRIC))
})
