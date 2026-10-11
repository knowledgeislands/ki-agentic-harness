import { expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DSYS } from '../items/design.ts'
import { createDesignSession, type DesignRubricContext, literalColours, parseDeclaration } from './design.ts'

const GUIDE = [
  '# Design the site',
  '',
  'Every value lives in `src/css/tokens.css`; this guide names tokens such as `--primary`.',
  '',
  '## Colour',
  '',
  'Compose a colour as `oklch(var(--l-x) var(--c-x) var(--h-x))`. See [Layout](#add-a-layout).',
  ''
].join('\n')

const DECLARATION = {
  tokens: ['src/css/tokens.css'],
  guide: 'docs/guides/developer/design.md',
  checks: ['scripts/check-contrast.ts']
}

/** A repository with one conforming design system. */
const repository = (guide = GUIDE): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-design-system-'))
  for (const directory of ['src/css', 'docs/guides/developer', 'scripts'])
    mkdirSync(join(root, directory), { recursive: true })
  writeFileSync(join(root, 'src/css/tokens.css'), ':root { --primary: oklch(0.5 0.1 224); }\n')
  writeFileSync(join(root, 'docs/guides/developer/design.md'), guide)
  writeFileSync(join(root, 'scripts/check-contrast.ts'), 'export {}\n')
  return root
}

const context = (root: string, configuration: Record<string, unknown> = DECLARATION): DesignRubricContext => {
  const session = createDesignSession({
    mode: 'audit',
    repository: root,
    userHome: tmpdir(),
    configuration,
    packageScriptClaims: []
  })
  const value = session.subjects[1]?.context()
  if (!value) throw new Error('ki-design-system session did not expose its repository subject')
  expect(session.proposal()).toEqual({ writes: [] })
  return value
}

const run = (code: string, value: DesignRubricContext) => {
  const item = DSYS.items.find((candidate) => candidate.code === code)
  if (!item?.mechanical) throw new Error(`${code} is not mechanical`)
  return item.mechanical.audit.run(value)
}

const statuses = (code: string, value: DesignRubricContext): string[] => run(code, value).map((o) => o.status)

test('a conforming design system passes DSYS-1 to DSYS-5', () => {
  const value = context(repository())
  for (const code of ['DSYS-1', 'DSYS-2', 'DSYS-3', 'DSYS-4', 'DSYS-5']) expect(statuses(code, value)).toEqual(['PASS'])
})

test('the declaration is read validate-down, reporting every problem', () => {
  expect(parseDeclaration({}).issues).toEqual(['tokens is missing', 'checks is missing', 'guide is missing'])
  expect(parseDeclaration({ tokens: [], guide: '/abs/guide.md', checks: ['ok.ts', 7], palette: 'x' }).issues).toEqual([
    'unrecognised key palette',
    'tokens must be a non-empty list of repository-relative paths',
    'checks entries must be repository-relative paths',
    'guide must be a repository-relative path'
  ])
})

test('DSYS-1 fails for an invalid declaration and a missing token source', () => {
  const root = repository()
  expect(run('DSYS-1', context(root, { ...DECLARATION, extra: true }))).toEqual([
    expect.objectContaining({
      status: 'VIOLATION',
      subject: '.ki.toml [skills.ki-design-system]: unrecognised key extra'
    })
  ])
  expect(run('DSYS-1', context(root, { ...DECLARATION, tokens: ['src/css/missing.css'] }))).toEqual([
    expect.objectContaining({ status: 'VIOLATION', subject: 'token source missing: src/css/missing.css' })
  ])
})

test('DSYS-2 fails for a guide outside an audience folder, outside the guides, or missing', () => {
  const root = repository()
  writeFileSync(join(root, 'docs/guides/design.md'), GUIDE)
  expect(statuses('DSYS-2', context(root, { ...DECLARATION, guide: 'docs/guides/design.md' }))).toEqual(['VIOLATION'])
  expect(run('DSYS-2', context(root, { ...DECLARATION, guide: 'README.md' })).map((o) => o.subject)).toContain(
    'README.md is not below docs/guides/'
  )
  expect(run('DSYS-2', context(root, { ...DECLARATION, guide: '../elsewhere.md' }))).toEqual([
    expect.objectContaining({ subject: '../elsewhere.md is outside the repository' })
  ])
  const { guide: _guide, ...withoutGuide } = DECLARATION
  expect(run('DSYS-2', context(root, withoutGuide))).toEqual([
    expect.objectContaining({ subject: 'declare the design guide as `guide`' })
  ])
})

test('DSYS-3 fails when no check is declared and for each missing check', () => {
  const root = repository()
  expect(statuses('DSYS-3', context(root, { ...DECLARATION, checks: [] }))).toEqual(['VIOLATION'])
  expect(run('DSYS-3', context(root, { ...DECLARATION, checks: ['scripts/check-contrast.ts', 'tests/a.ts'] }))).toEqual(
    [expect.objectContaining({ status: 'VIOLATION', subject: 'check missing: tests/a.ts' })]
  )
})

test('DSYS-4 warns for a token source the guide does not name, and is not applicable without a guide', () => {
  const root = repository('# Design the site\n\nNo source is named here.\n')
  expect(run('DSYS-4', context(root))).toEqual([
    expect.objectContaining({ status: 'VIOLATION', subject: 'src/css/tokens.css' })
  ])
  expect(statuses('DSYS-4', context(root, { ...DECLARATION, guide: 'docs/guides/developer/none.md' }))).toEqual([
    'NOT_APPLICABLE'
  ])
})

test('DSYS-5 reports literal colours and passes token compositions and fragments', () => {
  expect(
    literalColours('Use #fff or #1a2b3c, `rgb(10 20 30)`, oklch(0.62 0.15 255) and color(srgb 0.1 0.2 0.3).')
  ).toEqual([
    { line: 1, value: '#fff' },
    { line: 1, value: '#1a2b3c' },
    { line: 1, value: 'rgb(1' },
    { line: 1, value: 'oklch(0' },
    { line: 1, value: 'color(srgb 0' }
  ])
  expect(literalColours('oklch(var(--l) var(--c) var(--h)) and [a link](#add-a-calendar) and #add-a-calendar')).toEqual(
    []
  )
  const root = repository(`${GUIDE}\nThe page is #071421.\n`)
  expect(run('DSYS-5', context(root))).toEqual([
    expect.objectContaining({ status: 'VIOLATION', subject: 'line 9: #071421' })
  ])
})
