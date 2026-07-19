import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { KI_BOOTSTRAP_RUBRIC } from './items/index.ts'
import { renderRubric } from './publish.ts'

describe('ki-bootstrap rubric publication', () => {
  test('tracked rubric is the exact generated catalogue projection', () => {
    const path = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))
    expect(readFileSync(path, 'utf8')).toBe(renderRubric(KI_BOOTSTRAP_RUBRIC))
  })
})
