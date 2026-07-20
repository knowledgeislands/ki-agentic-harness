import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { KI_DECISION_RECORDS_RUBRIC } from './items/index.ts'
import { renderRubric } from './publish.ts'

describe('decision-record rubric publication', () => {
  test('tracked Markdown is the exact canonical projection', () => {
    const path = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))
    expect(readFileSync(path, 'utf8')).toBe(renderRubric(KI_DECISION_RECORDS_RUBRIC))
  })
})
