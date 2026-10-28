import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { canonicalHooks, type HookVariant } from './canonical-hooks.ts'

const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

// A Project gate is check-only and offline: staged lints only, no `ki` at all, as Kris chose
// COMMIT-VS-CI a) on 26 October 2026. The fixture puts `ki` and every provider command on PATH as
// recorders that fail loudly, so any call shows up.
const fixture = (stage: boolean, variant: HookVariant = 'no-package', lintExit = 0) => {
  const root = mkdtempSync(join(tmpdir(), 'ki-canonical-project-'))
  roots.push(root)
  const bin = join(root, 'bin')
  mkdirSync(bin)
  const log = join(root, 'calls.log')
  const recorder = '#!/bin/sh\nprintf "%s %s\\n" "$(basename "$0")" "$*" >> "$CALL_LOG"\nexit 97\n'
  for (const tool of ['ki', 'gh', 'curl', 'wget', 'ssh']) writeFileSync(join(bin, tool), recorder, { mode: 0o755 })
  writeFileSync(join(bin, 'rumdl'), `#!/bin/sh\nprintf "rumdl %s\\n" "$*" >> "$CALL_LOG"\nexit ${lintExit}\n`, {
    mode: 0o755
  })
  const env = { ...process.env, PATH: `${bin}:/usr/bin:/bin`, CALL_LOG: log }
  expect(spawnSync('git', ['init', '-q'], { cwd: root, env }).status).toBe(0)
  writeFileSync(join(root, 'README.md'), '# Project\n')
  if (stage) expect(spawnSync('git', ['add', '--', 'README.md'], { cwd: root, env }).status).toBe(0)
  mkdirSync(join(root, 'node_modules/.bin'), { recursive: true })
  for (const tool of ['lint-staged', 'syncpack', 'biome', 'rumdl']) {
    writeFileSync(
      join(root, 'node_modules/.bin', tool),
      `#!/bin/sh\nprintf "${tool} %s\\n" "$*" >> "$CALL_LOG"\nexit ${tool === 'lint-staged' ? lintExit : 0}\n`,
      { mode: 0o755 }
    )
  }
  const hook = join(root, 'pre-commit')
  writeFileSync(hook, canonicalHooks('ki-repo-project', variant)?.['pre-commit'] ?? '')
  const run = () => spawnSync('/bin/sh', [hook], { cwd: root, env, encoding: 'utf8' })
  return { root, log, hook, env, run }
}

const read = (log: string): string[] => (existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n') : [])

test('the no-package Project gate checks staged Markdown where it stands and calls nothing else', () => {
  const run = fixture(true)
  const result = run.run()
  expect(result.status, result.stderr).toBe(0)
  expect(result.stdout).toBe('')
  expect(read(run.log)).toEqual(['rumdl check --quiet -- README.md'])
})

test('the package Project gate runs lint-staged and the Syncpack check and calls nothing else', () => {
  const run = fixture(true, 'package')
  const result = run.run()
  expect(result.status, result.stderr).toBe(0)
  expect(read(run.log)).toEqual(['lint-staged --quiet', 'syncpack format --check'])
})

test('a failing staged lint fails the gate closed without reaching ki or the network', () => {
  for (const variant of ['package', 'no-package'] as const) {
    const run = fixture(true, variant, 42)
    expect(run.run().status).toBe(1)
    expect(read(run.log).some((line) => /^(ki|gh|curl|wget|ssh) /.test(line))).toBe(false)
  }
})

test('an empty Project index exits before any check', () => {
  const run = fixture(false)
  expect(run.run().status).toBe(0)
  expect(existsSync(run.log)).toBe(false)
})

test.each([false, true])('no-package rename gate skips only byte-identical history (edited=%s)', (edited) => {
  const run = fixture(true)
  const root = join(run.log, '..')
  const git = (...args: string[]) => spawnSync('git', args, { cwd: root, encoding: 'utf8' })
  expect(git('-c', 'user.name=Test', '-c', 'user.email=test@example.test', 'commit', '-q', '-m', 'base').status).toBe(0)
  expect(git('mv', 'README.md', 'MOVED.md').status).toBe(0)
  if (edited) {
    writeFileSync(join(root, 'MOVED.md'), '# Changed content\n')
    expect(git('add', '--', 'MOVED.md').status).toBe(0)
  }
  expect(run.run().status).toBe(0)
  if (edited) expect(read(run.log)).toEqual(['rumdl check --quiet -- MOVED.md'])
  else expect(existsSync(run.log)).toBe(false)
})
