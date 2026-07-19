import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { KI_SKILLS_RUBRIC } from './items/index.ts'
import { renderRubric } from './publish.ts'

const rendered = renderRubric(KI_SKILLS_RUBRIC)

describe('rubric publication', () => {
  test('renders canonical provenance, ordering, classification, prompts, and citations', () => {
    expect(rendered).toContain('TypeScript rubric items under `scripts/rubric/items/` are canonical')
    expect(rendered.indexOf('## LAY —')).toBeLessThan(rendered.indexOf('## FM —'))
    expect(rendered).toContain('(#lay--file-existence--layout)')
    expect(rendered).toContain('**LAY-1 [M] — SKILL.md exists at the skill root**')
    expect(rendered).toContain('**LAY-5 [J] — reference chains are shallow**')
    expect(rendered).toContain('_Review prompt:_')
    expect(rendered).toContain('**KI-SHAPE-8 [M + J] — governance checkers emit the canonical checker response**')
    expect(rendered).toContain('**KI-SHAPE-2 [M-heuristic + J] — skills compose rather than extend**')
    expect(rendered).toContain('(SPEC, CC)')
  })

  test('matches the tracked human-readable publication exactly', () => {
    const publication = readFileSync(fileURLToPath(new URL('../../references/rubric.md', import.meta.url)), 'utf8')
    expect(publication).toBe(rendered)
  })
})
