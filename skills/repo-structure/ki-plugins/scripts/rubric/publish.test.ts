import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { KI_PLUGINS_RUBRIC } from './items/index.ts'
import { renderRubric } from './publish.ts'

test('tracked rubric is generated exactly', () =>
  expect(readFileSync(fileURLToPath(new URL('../../references/rubric.md', import.meta.url)), 'utf8')).toBe(renderRubric(KI_PLUGINS_RUBRIC)))
