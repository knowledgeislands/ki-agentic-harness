import { expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const repositoryRoot = resolve(import.meta.dir, '..')
const hook = join(repositoryRoot, '.husky', 'commit-msg')

const check = (message: string): boolean => {
  const directory = mkdtempSync(join(tmpdir(), 'ki-commit-msg-'))
  const messageFile = join(directory, 'message')
  writeFileSync(messageFile, `${message}\n`)
  try {
    execFileSync('/bin/sh', [hook, messageFile], { cwd: repositoryRoot, stdio: 'ignore' })
    return true
  } catch {
    return false
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

test('the commit-msg hook accepts the KI Conventional Commit vocabulary', () => {
  expect(check('feat(git-hooks): enforce common checks')).toBe(true)
  expect(check('docs: explain hook ownership')).toBe(true)
  expect(check("Merge branch 'main'")).toBe(true)
})

test('the commit-msg hook rejects unsupported types and malformed scopes', () => {
  expect(check('build: use an unsupported type')).toBe(false)
  expect(check('fix(Not-Kebab): reject malformed scope')).toBe(false)
  expect(check('fix: reject terminal punctuation.')).toBe(false)
})
