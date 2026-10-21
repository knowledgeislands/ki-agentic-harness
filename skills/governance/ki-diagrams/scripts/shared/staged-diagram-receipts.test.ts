import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { diagramReceipt } from './diagram-receipts.ts'
import { inspectStagedDiagramReceipts } from './staged-diagram-receipts.ts'

const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})
const git = (root: string, ...args: string[]) => {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' })
  expect(result.status, result.stderr).toBe(0)
  return result.stdout
}
const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), 'ki-staged-receipts-'))
  roots.push(root)
  git(root, 'init', '-q')
  const directory = join(root, 'docs/diagrams')
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(root, '.ki.toml'), '[skills.ki-diagrams]\n')
  writeFileSync(join(directory, 'diagrams.toml'), '[map]\ntype = "architecture"\ncommit_html = true\n')
  writeFileSync(join(directory, 'map.architecture.json'), '{"title":"Map"}\n')
  writeFileSync(join(directory, 'map.html'), '<html>Map</html>\n')
  const receipt = () =>
    writeFileSync(
      join(directory, 'map.receipt.json'),
      JSON.stringify(
        diagramReceipt(
          { slug: 'map', type: 'architecture', commitHtml: true },
          readFileSync(join(directory, 'map.architecture.json')),
          readFileSync(join(directory, 'map.html')),
          { name: 'archify', version: 'fixture' }
        )
      )
    )
  receipt()
  git(root, 'add', '--', '.ki.toml', 'docs/diagrams')
  return { root, directory, receipt }
}

test('matching index passes despite stale or missing working files; inspection preserves the index', () => {
  const { root, directory } = fixture()
  const before = readFileSync(join(root, '.git/index'))
  writeFileSync(join(directory, 'map.architecture.json'), 'unstaged source')
  writeFileSync(join(directory, 'map.html'), 'unstaged viewer')
  rmSync(join(directory, 'map.receipt.json'))
  expect(inspectStagedDiagramReceipts(root).findings).toEqual([])
  expect(readFileSync(join(root, '.git/index'))).toEqual(before)
})

for (const file of ['map.architecture.json', 'map.html', 'map.receipt.json']) {
  test(`rejects stale staged ${file} even when working files are repaired`, () => {
    const { root, directory, receipt } = fixture()
    writeFileSync(join(directory, file), file.endsWith('receipt.json') ? '{}' : 'changed')
    git(root, 'add', '--', `docs/diagrams/${file}`)
    receipt()
    expect(inspectStagedDiagramReceipts(root).findings.length).toBeGreaterThan(0)
    expect(inspectStagedDiagramReceipts(root).subjects).toContain(`docs/diagrams/${file}`)
  })
  test(`rejects missing staged ${file} despite a working copy`, () => {
    const { root, directory } = fixture()
    const bytes = readFileSync(join(directory, file))
    rmSync(join(directory, file))
    git(root, 'add', '--', `docs/diagrams/${file}`)
    writeFileSync(join(directory, file), bytes)
    expect(inspectStagedDiagramReceipts(root).findings.length).toBeGreaterThan(0)
  })
}

test('staged malformed or missing manifest fails, and unsafe index files are refused', () => {
  const { root, directory } = fixture()
  writeFileSync(join(directory, 'diagrams.toml'), '[')
  git(root, 'add', '--', 'docs/diagrams/diagrams.toml')
  expect(inspectStagedDiagramReceipts(root).findings.length).toBeGreaterThan(0)
  rmSync(join(directory, 'diagrams.toml'))
  git(root, 'add', '--', 'docs/diagrams/diagrams.toml')
  expect(inspectStagedDiagramReceipts(root).findings[0]).toContain('Missing staged')
  symlinkSync('map.html', join(directory, 'map.receipt.json.link'))
  git(root, 'add', '--', 'docs/diagrams/map.receipt.json.link')
  expect(inspectStagedDiagramReceipts(root).findings[0]).toContain('regular files')
})

test('repositories without staged diagram adoption are not applicable', () => {
  const { root } = fixture()
  writeFileSync(join(root, '.ki.toml'), '[skills.ki-repo-harness]\n')
  git(root, 'add', '--', '.ki.toml')
  expect(inspectStagedDiagramReceipts(root).applicable).toBe(false)
})
