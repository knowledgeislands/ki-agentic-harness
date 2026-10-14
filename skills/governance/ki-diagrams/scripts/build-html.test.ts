import { expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { buildPaths, locateArchify, parseArguments, Refusal, selectDiagrams } from './build-html.ts'
import type { DiagramEntry } from './rubric/contexts/diagrams.ts'

const entry = (slug: string, commitHtml = false): DiagramEntry => ({
  slug,
  type: 'architecture',
  traced: ['src'],
  lastChecked: '0000000',
  commitHtml
})

test('the arguments name an optional repository, the SVG flag and any slugs', () => {
  expect(parseArguments([])).toEqual({ repository: resolve('.'), svg: false, slugs: [] })
  expect(parseArguments(['--repo', '/tmp/r', '--svg', 'a', 'b'])).toEqual({
    repository: '/tmp/r',
    svg: true,
    slugs: ['a', 'b']
  })
  expect(() => parseArguments(['--repo'])).toThrow(Refusal)
  expect(() => parseArguments(['--force'])).toThrow(/unknown option --force/)
})

test('every listed diagram builds by default, and a named slug must be listed', () => {
  const entries = [entry('map'), entry('area')]
  expect(selectDiagrams(entries, []).map((item) => item.slug)).toEqual(['map', 'area'])
  expect(selectDiagrams(entries, ['area']).map((item) => item.slug)).toEqual(['area'])
  expect(() => selectDiagrams(entries, ['missing'])).toThrow(/missing is not listed/)
})

test('each diagram builds under +/diagrams/<slug>/ with a fresh report directory beside its HTML', () => {
  expect(buildPaths('/r', entry('map', true))).toEqual({
    source: '/r/docs/diagrams/map.architecture.json',
    html: '/r/+/diagrams/map/map.html',
    outDir: '/r/+/diagrams/map/build',
    committedHtml: '/r/docs/diagrams/map.html',
    svg: '/r/docs/diagrams/map.svg'
  })
})

test('Archify is found at ARCHIFY_HOME first, then as an installed skill, or the build refuses', () => {
  const home = mkdtempSync(join(tmpdir(), 'ki-diagrams-home-'))
  expect(() => locateArchify({}, home)).toThrow(/Archify is not installed/)
  mkdirSync(join(home, '.agents/skills/archify/bin'), { recursive: true })
  writeFileSync(join(home, '.agents/skills/archify/bin/archify.mjs'), '')
  expect(locateArchify({}, home)).toBe(join(home, '.agents/skills/archify/bin/archify.mjs'))
  const custom = join(home, 'custom')
  mkdirSync(join(custom, 'bin'), { recursive: true })
  writeFileSync(join(custom, 'bin/archify.mjs'), '')
  expect(locateArchify({ ARCHIFY_HOME: custom }, home)).toBe(join(custom, 'bin/archify.mjs'))
})
