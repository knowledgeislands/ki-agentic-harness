import { expect, test } from 'bun:test'
import { readdirSync } from 'node:fs'
import catalogue from './index.ts'

test('the Git catalogue exposes the complete session contract', () => {
  expect(catalogue.contract).toBe(1)
  expect(catalogue.name).toBe('ki-git')
  expect(catalogue.createSession).toBeFunction()
  expect(catalogue.families.map((family) => family.code)).toEqual([
    'RUBRIC',
    'COMMIT',
    'BRANCH',
    'HYGIENE',
    'CLEAN',
    'LOCK'
  ])
  expect(
    catalogue.families
      .filter((family) => family.code !== 'RUBRIC')
      .flatMap((family) => family.items.map((item) => item.code))
  ).toEqual([
    'COMMIT-1',
    'COMMIT-2',
    'BRANCH-1',
    'BRANCH-2',
    'BRANCH-3',
    'HYGIENE-1',
    'CLEAN-1',
    'CLEAN-2',
    'CLEAN-3',
    'CLEAN-4',
    'CLEAN-5',
    'CLEAN-6',
    'CLEAN-7',
    'LOCK-1'
  ])
  const semanticItems = (
    catalogue.families.filter((family) => family.code !== 'RUBRIC') as unknown as readonly {
      items: readonly { code: string; mechanical?: unknown }[]
    }[]
  ).flatMap((family) => family.items)
  expect(semanticItems.filter((item) => item.mechanical !== undefined).map((item) => item.code)).toEqual([
    'CLEAN-2',
    'CLEAN-3',
    'CLEAN-4',
    'CLEAN-5',
    'CLEAN-6',
    'CLEAN-7'
  ])
})

test('judgment criteria expose complete v1 review metadata', () => {
  const judgmentItems = (
    catalogue.families.filter((family) => family.code !== 'RUBRIC') as unknown as readonly {
      items: readonly {
        judgment?: { scope: string; prompt: string; outcomes: readonly string[]; guidance: string }
      }[]
    }[]
  ).flatMap((family) => family.items.map((item) => item.judgment))

  expect(judgmentItems).toHaveLength(14)
  for (const judgment of judgmentItems) {
    expect(judgment?.scope).not.toBeEmpty()
    expect(judgment?.prompt).not.toBeEmpty()
    expect(judgment?.outcomes.length).toBeGreaterThan(0)
    expect(judgment?.guidance).not.toBeEmpty()
  }
})

test('judgment prompts name focused evidence without inventing a Git executor', () => {
  const items = (
    catalogue.families.filter((family) => family.code !== 'RUBRIC') as unknown as readonly {
      items: readonly { mechanical?: unknown; judgment?: { scope: string; prompt: string } }[]
    }[]
  ).flatMap((family) => family.items)
  const metadata = items.map((item) => `${item.judgment?.scope}\n${item.judgment?.prompt}`).join('\n')

  expect(metadata).toContain('git diff --cached')
  expect(metadata).toContain('git branch --show-current')
  expect(metadata).toContain('git worktree list --porcelain')
  expect(metadata).toContain('git status --short')
  expect(metadata).toContain('mgit overview --json')
})

test('hygiene guidance retains the shared-working-tree safety boundary', () => {
  const hygiene = catalogue.families.find((family) => family.code === 'HYGIENE')?.items[0]
  const guidance = hygiene?.judgment?.guidance ?? ''

  expect(guidance).toContain('thread-local touched-path set')
  expect(guidance).toContain('git add -- <path>...')
  expect(guidance).toContain('git add -A')
  expect(guidance).toContain('git commit -a')
  expect(guidance).toContain('serialize only the shared-index and commit window')
})

test('clean-down criteria name their deciding command and keep the approval boundary', () => {
  const clean = catalogue.families.find((family) => family.code === 'CLEAN')?.items ?? []
  const scopes = clean.map((item) => item.judgment?.scope ?? '').join('\n')

  for (const command of [
    'gh pr list --state open',
    'git branch --merged <default>',
    'git cherry <default> <branch>',
    'refs/heads refs/remotes',
    '%(upstream:track)',
    'git stash list',
    'git worktree list --porcelain',
    'git status --porcelain=v1 --untracked-files=all'
  ])
    expect(scopes).toContain(command)
  for (const prefix of ['automation/*', 'dependabot/*', 'renovate/*']) expect(scopes).toContain(prefix)
  for (const code of ['CLEAN-1', 'CLEAN-2', 'CLEAN-3', 'CLEAN-5', 'CLEAN-6', 'CLEAN-7']) {
    const guidance = clean.find((item) => item.code === code)?.judgment?.guidance ?? ''
    expect(guidance).toContain('Never delete a remote branch, close a pull request')
  }
  expect(clean.find((item) => item.code === 'CLEAN-2')?.judgment?.guidance).toContain('never `-D`')
})

test('family modules expose only one complete family', async () => {
  const files = readdirSync(import.meta.dir)
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts' && !file.endsWith('.test.ts'))
    .sort()

  for (const file of files) {
    const module = (await import(`./${file}`)) as Record<string, unknown>
    expect(Object.keys(module)).toHaveLength(1)
    const family = Object.values(module)[0] as { code?: unknown; items?: unknown }
    expect(typeof family.code).toBe('string')
    expect(Array.isArray(family.items)).toBeTrue()
  }
})
