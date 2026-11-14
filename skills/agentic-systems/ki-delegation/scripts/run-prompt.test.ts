import { expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { generate } from '../../../work/ki-coordination/scripts/generate/index.ts'

const root = resolve(import.meta.dir, '../../../..')
const promptPath = 'skills/agentic-systems/ki-delegation/assets/run-prompt.md'
const standardRoot = 'skills/work/ki-coordination/references'
const standardPaths = readdirSync(join(root, standardRoot))
  .filter((name) => /^standards-.*\.md$/.test(name))
  .map((name) => `${standardRoot}/${name}`)
const read = (path: string): string => readFileSync(join(root, path), 'utf8')

test('report generation keeps the authored run prompt and every other output unchanged', () => {
  const surfaces = generate(root)
  const prompt = read(promptPath)
  for (const surface of surfaces) expect(surface.content).toBe(read(surface.path))

  // Exercise an actual stale report replacement, retaining all other authored prompt bytes.
  const fixture = mkdtempSync(join(tmpdir(), 'ki-run-prompt-'))
  for (const path of [...standardPaths, ...surfaces.map((surface) => surface.path)]) {
    const target = join(fixture, path)
    mkdirSync(dirname(target), { recursive: true })
    const content = read(path)
    writeFileSync(
      target,
      path === promptPath ? content.replace(/^\*\*Report\*\* to .*$/m, '**Report** to stale') : content
    )
  }
  const regenerated = generate(fixture)
  expect(regenerated).toEqual(surfaces)
  expect(regenerated.find((surface) => surface.path === promptPath)?.content).toBe(prompt)
})
