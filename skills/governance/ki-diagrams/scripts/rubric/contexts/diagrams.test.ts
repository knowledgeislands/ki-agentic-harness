import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { SVG_FORMS } from '../../export-svg.ts'
import { DIAG } from '../items/diagrams.ts'
import {
  createDiagramsSession,
  type DiagramsRubricContext,
  diagramReceipt,
  formatMark,
  KEEP_MERMAID,
  markIssues,
  mermaidFences,
  parseManifest,
  privateFindings,
  tracedEntryValid,
  tracedPath
} from './diagrams.ts'

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

test('DIAG-1 accepts committed HTML only under commit_html, and then requires it and its README link', () => {
  const unlisted = repository().root
  writeFileSync(join(unlisted, 'docs/diagrams/architecture.html'), '<html></html>\n')
  expect(run('DIAG-1', context(unlisted)).map((outcome) => outcome.subject)).toEqual([
    'not in the manifest: docs/diagrams/architecture.html'
  ])

  const optedIn = repository().root
  writeFileSync(
    join(optedIn, 'docs/diagrams/diagrams.toml'),
    `${entry('architecture', 'architecture', '0000000')}commit_html = true\n`
  )
  expect(run('DIAG-1', context(optedIn)).map((outcome) => outcome.subject)).toEqual([
    'missing: docs/diagrams/architecture.html'
  ])
  writeFileSync(join(optedIn, 'docs/diagrams/architecture.html'), '<html></html>\n')
  expect(run('DIAG-1', context(optedIn)).map((outcome) => outcome.subject)).toEqual([
    'missing: docs/diagrams/README.md links no architecture.html'
  ])
  writeFileSync(join(optedIn, 'docs/diagrams/README.md'), `${README}\n[Interactive](architecture.html)\n`)
  expect(statuses('DIAG-1', optedIn)).toEqual(['PASS'])

  writeFileSync(join(optedIn, 'docs/diagrams/architecture.html'), '<a href="file:///tmp/x">x</a>\n')
  expect(run('DIAG-2', context(optedIn)).map((outcome) => outcome.subject)).toEqual([
    'docs/diagrams/architecture.html: file URL'
  ])
  expect(parseManifest(`${entry('architecture', 'architecture', '0000000')}commit_html = "yes"\n`).issues).toEqual([
    'architecture: commit_html must be true or false'
  ])
})

test('the manifest names an optional SVG form, absent meaning dual', () => {
  const base = entry('architecture', 'architecture', '0000000')
  expect(parseManifest(base).entries[0]?.svgForm).toBe('dual')
  for (const form of SVG_FORMS) {
    const parsed = parseManifest(`${base}svg_form = "${form}"\n`)
    expect(parsed.issues).toEqual([])
    expect(parsed.entries[0]?.svgForm).toBe(form)
  }
  expect(parseManifest(`${base}svg_form = "dark"\n`).issues).toEqual([
    'architecture: svg_form must be one of dual, light, ki, ki-night'
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
    'Bad_Slug: traced must be a non-empty list of repository-relative paths, each a path, a pathspec glob or path:revision:lines'
  ])
  expect(parseManifest('not = [toml').issues[0]).toStartWith('diagrams.toml is not valid TOML')
})

test('a traced entry may carry a private repository citation, path:revision:lines, with no URL', () => {
  const cited = entry('beacon', 'sequence', 'a'.repeat(40), [
    'src/beacon.ts:0123abc:12-40',
    'src/api/*.ts:0123abcdef90',
    'README.md'
  ])
  expect(parseManifest(cited).issues).toEqual([])
  expect(parseManifest(entry('beacon', 'sequence', 'a'.repeat(40), ['src/beacon.ts:notarevision'])).issues).toEqual([
    'beacon: traced must be a non-empty list of repository-relative paths, each a path, a pathspec glob or path:revision:lines'
  ])
  expect(tracedEntryValid('src/beacon.ts:0123abc:12')).toBe(true)
  expect(tracedEntryValid('src/beacon.ts:0123abc:12-40:extra')).toBe(false)
  expect(tracedPath('src/beacon.ts:0123abc:12-40')).toBe('src/beacon.ts')
  expect(tracedPath('src/api/*.ts:0123abcdef90')).toBe('src/api/*.ts')
  expect(tracedPath('src/beacon.ts')).toBe('src/beacon.ts')
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

/** A repository whose one diagram commits its viewer, linked from the README, with a matching receipt. */
const withViewer = (): string => {
  const { root } = repository()
  const directory = join(root, 'docs/diagrams')
  writeFileSync(
    join(directory, 'diagrams.toml'),
    `${entry('architecture', 'architecture', '0000000')}commit_html = true\n`
  )
  writeFileSync(join(directory, 'architecture.html'), '<html></html>\n')
  writeFileSync(join(directory, 'README.md'), `${README}\n[Interactive](architecture.html)\n`)
  const receipt = diagramReceipt(
    {
      slug: 'architecture',
      type: 'architecture',
      traced: ['src'],
      lastChecked: '0000000',
      commitHtml: true,
      svgForm: 'dual'
    },
    readFileSync(join(directory, 'architecture.architecture.json')),
    readFileSync(join(directory, 'architecture.html')),
    { name: 'archify', version: '3.2.0' }
  )
  writeFileSync(join(directory, 'architecture.receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`)
  return root
}

test('DIAG-6 passes a matching receipt and is not applicable without a committed viewer', () => {
  const root = withViewer()
  expect(statuses('DIAG-1', root)).toEqual(['PASS'])
  expect(statuses('DIAG-2', root)).toEqual(['PASS'])
  expect(statuses('DIAG-6', root)).toEqual(['PASS'])
  expect(statuses('DIAG-6', repository().root)).toEqual(['NOT_APPLICABLE'])
})

test('DIAG-6 fails for a missing receipt, a changed source or viewer, and a malformed or misnamed receipt', () => {
  const subjects = (root: string): (string | undefined)[] =>
    run('DIAG-6', context(root)).map((outcome) => outcome.subject)
  const receipt = (root: string): string => join(root, 'docs/diagrams/architecture.receipt.json')

  const stale = withViewer()
  writeFileSync(join(stale, 'docs/diagrams/architecture.architecture.json'), '{"schema_version":2}\n')
  expect(subjects(stale)).toEqual([
    'architecture: the source architecture.architecture.json changed since the viewer was rendered'
  ])
  writeFileSync(join(stale, 'docs/diagrams/architecture.html'), '<html>edited</html>\n')
  expect(subjects(stale)).toEqual([
    'architecture: the source architecture.architecture.json changed since the viewer was rendered',
    'architecture: the viewer architecture.html changed since the viewer was rendered'
  ])

  const malformed = withViewer()
  writeFileSync(receipt(malformed), '{"schema":1}\n')
  expect(subjects(malformed)).toEqual([
    'architecture: docs/diagrams/architecture.receipt.json does not hold a schema 1 receipt'
  ])
  writeFileSync(receipt(malformed), 'not json')
  expect(subjects(malformed)).toEqual(['architecture: docs/diagrams/architecture.receipt.json is not valid JSON'])

  const misnamed = withViewer()
  const held = JSON.parse(readFileSync(receipt(misnamed), 'utf8'))
  writeFileSync(receipt(misnamed), JSON.stringify({ ...held, slug: 'other' }))
  expect(subjects(misnamed)).toEqual([
    'architecture: docs/diagrams/architecture.receipt.json names other as architecture'
  ])

  const missing = withViewer()
  rmSync(receipt(missing))
  expect(subjects(missing)).toEqual(['architecture: no receipt at docs/diagrams/architecture.receipt.json'])
  expect(statuses('DIAG-1', missing)).toEqual(['PASS'])
})

test('DIAG-1 treats a receipt as stray without commit_html', () => {
  const root = withViewer()
  writeFileSync(join(root, 'docs/diagrams/diagrams.toml'), entry('architecture', 'architecture', '0000000'))
  expect(run('DIAG-1', context(root)).map((outcome) => outcome.subject)).toEqual([
    'not in the manifest: docs/diagrams/architecture.html',
    'not in the manifest: docs/diagrams/architecture.receipt.json'
  ])
})

const MERMAID = '```mermaid\ngraph TD\n  A --> B\n```\n'

test('mermaidFences finds backtick and tilde fences, skips examples nested in a longer fence, and reads the keep marker', () => {
  const text = [
    '# Notes',
    '',
    '```mermaid',
    'graph TD',
    '```',
    '',
    '~~~ Mermaid title',
    'graph LR',
    '~~~',
    '',
    '````markdown',
    '```mermaid',
    'graph TD',
    '```',
    '````',
    '',
    KEEP_MERMAID,
    '```mermaid',
    'graph TD',
    '```',
    '',
    '```ts',
    'const x = 1',
    '```'
  ].join('\n')
  expect(mermaidFences(text)).toEqual([
    { line: 3, kept: false },
    { line: 7, kept: false },
    { line: 18, kept: true }
  ])
})

test('DIAG-7 passes without a fence, warns on a tracked fence by file and line, and ignores untracked files', () => {
  const { root } = repository({ git: true })
  expect(statuses('DIAG-7', root)).toEqual(['PASS'])
  mkdirSync(join(root, 'docs/notes'), { recursive: true })
  writeFileSync(join(root, 'docs/notes/flow.md'), `# Flow\n\n${MERMAID}`)
  expect(statuses('DIAG-7', root)).toEqual(['PASS'])
  git(root, 'add', 'docs/notes/flow.md')
  const outcomes = run('DIAG-7', context(root))
  expect(outcomes.map((outcome) => outcome.status)).toEqual(['VIOLATION'])
  expect(outcomes[0]?.subject).toBe('docs/notes/flow.md:3')
})

test('DIAG-7 passes a fence the owner kept and is not applicable outside Git', () => {
  const { root } = repository({ git: true })
  writeFileSync(join(root, 'kept.md'), `# Kept\n\n${KEEP_MERMAID}\n${MERMAID}`)
  git(root, 'add', 'kept.md')
  const outcomes = run('DIAG-7', context(root))
  expect(outcomes.map((outcome) => outcome.status)).toEqual(['PASS'])
  expect(outcomes[0]?.message).toContain('the 1 the owner kept')
  expect(statuses('DIAG-7', repository().root)).toEqual(['NOT_APPLICABLE'])
})

test('markIssues accepts a run or a session mark and names each way one falls short', () => {
  const written_at = '2026-10-20T06:00:00.000Z'
  expect(markIssues(formatMark({ work: 'ki.w', run: 'night', agent: 'builder', written_at }))).toEqual([])
  expect(markIssues(formatMark({ work: 'ki.w', session: 'interactive', written_at }))).toEqual([])
  expect(markIssues('work = "ki.w"\nrun = "night"\nwritten_at = "yesterday"\n')).toEqual([
    'a background run names both run and agent',
    'written_at is not an ISO 8601 time'
  ])
  expect(
    markIssues(
      'work = "ki.w"\nrun = "n"\nagent = "a"\nsession = "s"\nthread = "t"\nwritten_at = "2026-10-20T06:00:00Z"\n'
    )
  ).toEqual(['thread is not a mark field', 'a mark names a run or a session, not both'])
  expect(markIssues('written_at = 1\n')).toEqual([
    'written_at is not a non-empty string',
    'work is missing',
    'neither run and agent nor session is named',
    'written_at is missing'
  ])
  expect(markIssues('= broken')).toEqual(['mark.toml is not TOML'])
})

test('DIAG-8 warns on a working folder without a well-formed mark and is not applicable without one', () => {
  const { root } = repository()
  expect(statuses('DIAG-8', root)).toEqual(['NOT_APPLICABLE'])
  mkdirSync(join(root, '+/diagrams/map'), { recursive: true })
  mkdirSync(join(root, '+/diagrams/area'), { recursive: true })
  writeFileSync(
    join(root, '+/diagrams/map/mark.toml'),
    formatMark({ work: 'ki.w', session: 'interactive', written_at: '2026-10-20T06:00:00.000Z' })
  )
  const outcomes = run('DIAG-8', context(root))
  expect(outcomes.map((outcome) => [outcome.status, outcome.subject])).toEqual([
    ['VIOLATION', '+/diagrams/area: no mark.toml']
  ])
  writeFileSync(
    join(root, '+/diagrams/area/mark.toml'),
    formatMark({ work: 'ki.w', session: 's', written_at: '2026-10-20T06:00:00.000Z' })
  )
  expect(statuses('DIAG-8', root)).toEqual(['PASS'])
})
