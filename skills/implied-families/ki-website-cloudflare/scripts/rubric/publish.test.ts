import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { KI_WEBSITE_CLOUDFLARE_RUBRIC } from './items/index.ts'
import { renderRubric } from './publish.ts'

test('tracked rubric is generated exactly from the structured catalogue', () => {
  const publication = readFileSync(fileURLToPath(new URL('../../references/rubric.md', import.meta.url)), 'utf8')
  expect(publication).toBe(renderRubric(KI_WEBSITE_CLOUDFLARE_RUBRIC))
})
