import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DIAG } from '../items/diagrams.ts'
import { createDiagramsSession, type DiagramsRubricContext, parseManifest, privateFindings } from './diagrams.ts'

const SVG = '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"><use href="#a"/></svg>\n'
const README = '# Diagrams\n\n![Architecture](architecture.svg)\n'

const entry = (slug: string, type: string, lastChecked: string, traced = ['src']): string =>
  [
    `[${slug}]`,
    `type = "${type}"`,
    'question = "What are the parts?"',
    'audience = "Contributors"',
    `traced = [${traced.map((path) => `"${path}"`).join(', ')}]`,
    'stale_when = "a part is added"',
    'regenerate = "Build an Archify diagram of the parts."',
    `last_checked = "${lastChecked}"`,
    ''
  ].join('\n')

const git = (repository: string, ...args: string[]): string =>
  spawnSync('git', ['-C', repository, ...args], { encoding: 'utf8' }).stdout.trim()

/** A repository with one conforming architecture diagram, optionally under Git with its `last_checked` at HEAD. */
const repository = (options: { git?: boolean } = {}): { root: string; head: string } => {
  const root = mkdtempSync(join(tmpdir(), 'ki-diagrams-'))
  mkdirSync(join(root, 'docs/diagrams'), { recursive: true })
  mkdirSync(join(root, 'src'), { recursive: true })
  writeFileSync(join(root, 'src/main.ts'), 'export {}\n')
  writeFileSync(join(root, 'docs/diagrams/architecture.architecture.json'), '{"schema_version":1}\n')
  writeFileSync(join(root, 'docs/diagrams/architecture.svg'), SVG)
  writeFileSync(join(root, 'docs/diagrams/README.md'), README)
  let head = '0000000'
  if (options.git) {
    git(root, 'init', '-q')
    git(root, 'add', '.')
    git(root, '-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-qm', 'init')
    head = git(root, 'rev-parse', 'HEAD')
  }
  writeFileSync(join(root, 'docs/diagrams/diagrams.toml'), entry('architecture', 'architecture', head))
  return { root, head }
}

const context = (root: string): DiagramsRubricContext => {
  const session = createDiagramsSession({
    mode: 'audit',
    repository: root,
    userHome: tmpdir(),
    configuration: {},
    packageScriptClaims: []
  })
  const value = session.subjects[1]?.context()
  if (!value) throw new Error('ki-diagrams session did not expose its repository subject')
  expect(session.proposal()).toEqual({ writes: [] })
  return value
}

const run = (code: string, value: DiagramsRubricContext) => {
  const item = DIAG.items.find((candidate) => candidate.code === code)
  if (!item?.mechanical) throw new Error(`${code} is not mechanical`)
  return item.mechanical.audit.run(value)
}

const statuses = (code: string, root: string): string[] => run(code, context(root)).map((outcome) => outcome.status)

test('a conforming diagram set passes DIAG-1 to DIAG-4', () => {
  const { root } = repository({ git: true })
  for (const code of ['DIAG-1', 'DIAG-2', 'DIAG-3', 'DIAG-4']) expect(statuses(code, root)).toEqual(['PASS'])
})

test('DIAG-1 fails for an unlisted source, a listed slug without an SVG, and an SVG the README does not embed', () => {
  const unlisted = repository().root
  writeFileSync(join(unlisted, 'docs/diagrams/flow.workflow.json'), '{}\n')
  expect(run('DIAG-1', context(unlisted))).toEqual([
    expect.objectContaining({ status: 'VIOLATION', subject: 'not in the manifest: docs/diagrams/flow.workflow.json' })
  ])

  const withoutSvg = repository().root
  writeFileSync(
    join(withoutSvg, 'docs/diagrams/diagrams.toml'),
    entry('architecture', 'architecture', '0000000') + entry('flow', 'workflow', '0000000')
  )
  writeFileSync(join(withoutSvg, 'docs/diagrams/flow.workflow.json'), '{}\n')
  expect(run('DIAG-1', context(withoutSvg)).map((outcome) => outcome.subject)).toEqual([
    'missing: docs/diagrams/flow.svg'
  ])

  const unembedded = repository().root
  writeFileSync(join(unembedded, 'docs/diagrams/README.md'), '# Diagrams\n')
  expect(run('DIAG-1', context(unembedded)).map((outcome) => outcome.subject)).toEqual([
    'missing: docs/diagrams/README.md embeds no architecture.svg'
  ])
})

test('DIAG-1 fails without a manifest or diagrams directory and reports every schema problem', () => {
  const root = mkdtempSync(join(tmpdir(), 'ki-diagrams-'))
  expect(statuses('DIAG-1', root)).toEqual(['VIOLATION'])
  mkdirSync(join(root, 'docs/diagrams'), { recursive: true })
  expect(run('DIAG-1', context(root)).map((outcome) => outcome.subject)).toEqual([
    'docs/diagrams/diagrams.toml is missing',
    'docs/diagrams/README.md is missing'
  ])
  expect(parseManifest('[Bad_Slug]\ntype = "pie"\ntraced = []\nextra = 1\n').issues).toEqual([
    'Bad_Slug: the slug must be lower-case kebab-case',
    'Bad_Slug: missing question',
    'Bad_Slug: missing audience',
    'Bad_Slug: missing stale_when',
    'Bad_Slug: missing regenerate',
    'Bad_Slug: missing last_checked',
    'Bad_Slug: unknown field extra',
    'Bad_Slug: type must be one of architecture, workflow, sequence, dataflow, lifecycle',
    'Bad_Slug: traced must be a non-empty list of repository-relative paths'
  ])
  expect(parseManifest('not = [toml').issues[0]).toStartWith('diagrams.toml is not valid TOML')
})

test('DIAG-2 fails for a local absolute path, a file URL or an address, and leaves a Git remote alone', () => {
  const { root } = repository()
  writeFileSync(
    join(root, 'docs/diagrams/architecture.architecture.json'),
    '{"source":"/Users/someone/repo/src/main.ts"}\n'
  )
  expect(run('DIAG-2', context(root))).toEqual([
    expect.objectContaining({
      status: 'VIOLATION',
      subject: 'docs/diagrams/architecture.architecture.json: local absolute path'
    })
  ])
  expect(privateFindings('a.svg', '<a href="file:///tmp/x">')).toEqual(['a.svg: file URL'])
  expect(privateFindings('a.json', '"owner": "someone@example.org"')).toEqual(['a.json: email address'])
  expect(privateFindings('a.json', '"url": "git@github.com:knowledgeislands/apps-observatory.git"')).toEqual([])
  expect(privateFindings('a.json', '"file": "apps/site/src/main.ts"')).toEqual([])
  expect(privateFindings('a.svg', '<style>@media (prefers-color-scheme: light){}</style>')).toEqual([])
})

test('DIAG-3 fails for an external href and for a file that is not an SVG', () => {
  const { root } = repository()
  writeFileSync(join(root, 'docs/diagrams/architecture.svg'), '<svg><a href="https://example.com">x</a></svg>\n')
  expect(run('DIAG-3', context(root))).toEqual([
    expect.objectContaining({ status: 'VIOLATION', subject: 'docs/diagrams/architecture.svg: href="h' })
  ])
  writeFileSync(join(root, 'docs/diagrams/architecture.svg'), '<html></html>\n')
  expect(run('DIAG-3', context(root)).map((outcome) => outcome.subject)).toEqual([
    'docs/diagrams/architecture.svg: not an SVG document'
  ])
})

test('DIAG-4 warns when a traced file changed after last_checked or the revision is unknown', () => {
  const { root, head } = repository({ git: true })
  writeFileSync(join(root, 'src/main.ts'), 'export const changed = true\n')
  writeFileSync(join(root, 'README.md'), '# Untraced\n')
  git(root, 'add', '.')
  git(root, '-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-qm', 'change')
  expect(run('DIAG-4', context(root))).toEqual([
    expect.objectContaining({
      status: 'VIOLATION',
      subject: `architecture: src/main.ts changed since ${head.slice(0, 12)}`
    })
  ])
  expect(DIAG.items.find((item) => item.code === 'DIAG-4')?.mechanical?.level).toBe('WARN')

  writeFileSync(join(root, 'docs/diagrams/diagrams.toml'), entry('architecture', 'architecture', 'abcdef1'))
  expect(run('DIAG-4', context(root)).map((outcome) => outcome.subject)).toEqual([
    "architecture: last_checked abcdef1 is not in this repository's history"
  ])
})

test('DIAG-4 is not applicable outside Git', () => {
  const { root } = repository()
  expect(statuses('DIAG-4', root)).toEqual(['NOT_APPLICABLE'])
})
