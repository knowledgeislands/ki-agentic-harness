import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { generate } from './index.ts'

const harnessRoot = join(import.meta.dir, '..', '..', '..', '..', '..')

test('the committed guild map is the one generated from every skill’s frontmatter', () => {
  const surfaces = generate(harnessRoot)
  expect(surfaces.map((surface) => surface.path)).toEqual(['skills/keystone/ki-keystone/SKILL.md'])
  for (const surface of surfaces) expect(readFileSync(join(harnessRoot, surface.path), 'utf8')).toBe(surface.content)
})
