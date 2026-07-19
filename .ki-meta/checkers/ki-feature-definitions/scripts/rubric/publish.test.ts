import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { KI_FEATURE_DEFINITIONS_RUBRIC } from './items/index.ts'
import { renderRubric } from './publish.ts'

test('tracked rubric is the exact generated catalogue projection', () => {
  const tracked = readFileSync(fileURLToPath(new URL('../../references/rubric.md', import.meta.url)), 'utf8')
  expect(tracked).toBe(renderRubric(KI_FEATURE_DEFINITIONS_RUBRIC))
})
