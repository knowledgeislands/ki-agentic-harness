import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import {
  archifyRenderer,
  buildPaths,
  committedReceipt,
  locateArchify,
  parseArguments,
  Refusal,
  readRunPacket,
  runStateFolder,
  selectDiagrams,
  workingMark
} from './build-html.ts'
import { type DiagramEntry, fingerprint, formatMark, markIssues } from './rubric/contexts/diagrams.ts'

const entry = (slug: string, commitHtml = false): DiagramEntry => ({
  slug,
  type: 'architecture',
  traced: ['src'],
  lastChecked: '0000000',
  commitHtml
})

test('the arguments name an optional repository and work, the SVG flag and any slugs', () => {
  expect(parseArguments([])).toEqual({
    repository: resolve('.'),
    work: undefined,
    svg: false,
    check: false,
    slugs: []
  })
  expect(parseArguments(['--work', 'ki.ways-of-working']).work).toBe('ki.ways-of-working')
  expect(() => parseArguments(['--work'])).toThrow(Refusal)
  expect(parseArguments(['--repo', '/tmp/r', '--svg', 'a', 'b'])).toEqual({
    repository: '/tmp/r',
    work: undefined,
    svg: true,
    check: false,
    slugs: ['a', 'b']
  })
  expect(parseArguments(['--check']).check).toBe(true)
  expect(() => parseArguments(['--check', '--svg'])).toThrow(/takes no --svg/)
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
    delivery: '/r/+/diagrams/map/map.delivery.json',
    mark: '/r/+/diagrams/map/mark.toml',
    outDir: '/r/+/diagrams/map/build',
    committedHtml: '/r/docs/diagrams/map.html',
    receipt: '/r/docs/diagrams/map.receipt.json',
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

test("a receipt names the renderer from Archify's package.json and holds file names only", () => {
  const home = mkdtempSync(join(tmpdir(), 'ki-diagrams-archify-'))
  mkdirSync(join(home, 'bin'), { recursive: true })
  expect(() => archifyRenderer(join(home, 'bin/archify.mjs'))).toThrow(/no readable package.json/)
  writeFileSync(join(home, 'package.json'), '{"name":"archify","version":"3.2.0"}\n')
  const renderer = archifyRenderer(join(home, 'bin/archify.mjs'))
  expect(renderer).toEqual({ name: 'archify', version: '3.2.0' })
  const source = new TextEncoder().encode('{"schema_version":1}\n')
  const html = new TextEncoder().encode('<html></html>\n')
  const receipt = committedReceipt(entry('map', true), source, html, renderer)
  expect(receipt).toEqual({
    schema: 1,
    slug: 'map',
    type: 'architecture',
    source: fingerprint('map.architecture.json', source),
    html: fingerprint('map.html', html),
    renderer: { name: 'archify', version: '3.2.0' }
  })
  expect(receipt.source.sha256).toMatch(/^[0-9a-f]{64}$/)
  expect(JSON.stringify(receipt)).not.toContain('/')
})

test("a receipt is refused when Archify's delivery receipt vouches for other bytes", () => {
  const source = new TextEncoder().encode('{}\n')
  const html = new TextEncoder().encode('<html></html>\n')
  const renderer = { name: 'archify', version: '3.2.0' }
  const vouched = (sourceHash: string, htmlHash: string): string =>
    JSON.stringify({ specification: { sha256: sourceHash }, artifact: { sha256: htmlHash } })
  const { sha256: sourceHash } = fingerprint('s', source)
  const { sha256: htmlHash } = fingerprint('h', html)
  expect(committedReceipt(entry('map', true), source, html, renderer, vouched(sourceHash, htmlHash)).html.sha256).toBe(
    htmlHash
  )
  expect(() => committedReceipt(entry('map', true), source, html, renderer, vouched(sourceHash, sourceHash))).toThrow(
    /does not match the source and HTML just finalized/
  )
  expect(() => committedReceipt(entry('map', true), source, html, renderer, 'not json')).toThrow(/not valid JSON/)
})

test('--check needs no Archify and fails when a committed viewer changed after its receipt', () => {
  const root = mkdtempSync(join(tmpdir(), 'ki-diagrams-check-'))
  mkdirSync(join(root, 'docs/diagrams'), { recursive: true })
  const write = (name: string, text: string): void => writeFileSync(join(root, 'docs/diagrams', name), text)
  write(
    'diagrams.toml',
    '[map]\ntype = "architecture"\nquestion = "q"\naudience = "a"\ntraced = ["src"]\nstale_when = "s"\nregenerate = "r"\nlast_checked = "0000000"\ncommit_html = true\n'
  )
  write('map.architecture.json', '{}\n')
  write('map.html', '<html></html>\n')
  const receipt = committedReceipt(
    entry('map', true),
    readFileSync(join(root, 'docs/diagrams/map.architecture.json')),
    readFileSync(join(root, 'docs/diagrams/map.html')),
    { name: 'archify', version: '3.2.0' }
  )
  write('map.receipt.json', `${JSON.stringify(receipt, null, 2)}\n`)
  const script = join(import.meta.dir, 'build-html.ts')
  const check = () =>
    spawnSync('bun', [script, '--check', '--repo', root], {
      encoding: 'utf8',
      env: { ...process.env, ARCHIFY_HOME: root }
    })
  expect(check().status).toBe(0)
  write('map.html', '<html>changed</html>\n')
  const failed = check()
  expect(failed.status).toBe(1)
  expect(failed.stderr).toContain('map: the viewer map.html changed since the viewer was rendered')
})

test('a background run marks its build with the work, run and agent its run packet names', () => {
  const state = mkdtempSync(join(tmpdir(), 'mark-'))
  const folder = join(state, 'ki/agents/night')
  mkdirSync(folder, { recursive: true })
  writeFileSync(join(folder, 'thread.json'), JSON.stringify({ repository: '/r', folder: '+/_WORK/ki.ways-of-working' }))
  writeFileSync(join(folder, 'other.pid'), '111\n')
  writeFileSync(join(folder, 'builder.pid'), '222\n')
  const env = { KI_AGENT_RUN: 'night', XDG_STATE_HOME: state }
  expect(runStateFolder('night', env, '/home')).toBe(folder)
  expect(runStateFolder('night', {}, '/home')).toBe('/home/.local/state/ki/agents/night')
  expect(readRunPacket(folder, [333, 222, 1])).toEqual({ work: 'ki.ways-of-working', agent: 'builder' })
  const now = new Date('2026-10-20T06:00:00Z')
  const mark = workingMark(undefined, env, now, (run) => readRunPacket(runStateFolder(run, env), [222]))
  expect(mark).toEqual({
    work: 'ki.ways-of-working',
    run: 'night',
    agent: 'builder',
    written_at: '2026-10-20T06:00:00.000Z'
  })
  expect(markIssues(formatMark(mark))).toEqual([])
  expect(workingMark('ki.other', env, now, () => ({})).work).toBe('ki.other')
})

test('an interactive build marks the session, and the named work where one is given', () => {
  const now = new Date('2026-10-20T06:00:00Z')
  expect(workingMark('ki.ways-of-working', { CLAUDE_CODE_SESSION_ID: 's-1' }, now)).toEqual({
    work: 'ki.ways-of-working',
    session: 's-1',
    written_at: '2026-10-20T06:00:00.000Z'
  })
  const bare = workingMark(undefined, {}, now)
  expect(bare).toEqual({ session: 'interactive', written_at: '2026-10-20T06:00:00.000Z' })
  expect(markIssues(formatMark(bare))).toEqual(['work is missing'])
})
