import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// The README's payload table is what a user-environment manager registers from
// the installed harness, so it must name exactly the hooks `ki` ships. Each hook
// lives in its own folder with its test; `git-hooks/` holds the tests of the
// repository's own `.githooks/` and ships no runtime hook.
const readme = readFileSync(join(import.meta.dir, 'README.md'), 'utf8')
const table = readme.split('<!-- hooks:payload:start -->')[1]?.split('<!-- hooks:payload:end -->')[0] ?? ''
const listed = [...table.matchAll(/^\| `([^`]+\.sh)` \|/gm)].map((match) => match[1] as string)
const folders = readdirSync(import.meta.dir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== 'git-hooks')
  .map((entry) => entry.name)
const stubs = readdirSync(import.meta.dir).filter((name) => name.endsWith('.sh'))

test('the payload table lists every hook folder once', () => {
  expect(listed.length).toBeGreaterThan(0)
  expect(new Set(listed).size).toBe(listed.length)
  expect([...listed].sort()).toEqual(folders.map((name) => `${name}/${name}.sh`).sort())
})

test.each(folders)('%s ships executable with its own test', (name) => {
  expect(statSync(join(import.meta.dir, name, `${name}.sh`)).mode & 0o111).toBe(0o111)
  expect(existsSync(join(import.meta.dir, name, `${name}.test.ts`))).toBe(true)
})

// The old flat paths stay bound on both Macs until the dotfiles repoint them,
// so each forwards to its folder's script and nothing else.
test.each(stubs)('%s forwards to its own folder', (name) => {
  const hook = name.replace(/\.sh$/, '')
  expect(folders).toContain(hook)
  expect(statSync(join(import.meta.dir, name)).mode & 0o111).toBe(0o111)
  const lines = readFileSync(join(import.meta.dir, name), 'utf8').trimEnd().split('\n')
  expect(lines).toHaveLength(3)
  expect(lines[0]).toBe('#!/bin/sh')
  expect(lines[1]).toStartWith('# Forwarding stub: retire once')
  expect(lines[2]).toBe(`exec "$(dirname "$0")/${hook}/${hook}.sh" "$@"`)
})

test.each(stubs)('%s passes stdin, stdout, arguments and exit code through', (name) => {
  const hook = name.replace(/\.sh$/, '')
  const directory = mkdtempSync(join(tmpdir(), 'ki-hook-stub-'))
  try {
    copyFileSync(join(import.meta.dir, name), join(directory, name))
    chmodSync(join(directory, name), 0o755)
    mkdirSync(join(directory, hook))
    const target = join(directory, hook, `${hook}.sh`)
    writeFileSync(target, '#!/bin/sh\nprintf "%s|" "$@"\ncat\nprintf "err" >&2\nexit 7\n')
    chmodSync(target, 0o755)
    const result = spawnSync(join(directory, name), ['one', 'two words'], { input: '{"hook_event_name":"Stop"}', encoding: 'utf8' })
    expect(result.status).toBe(7)
    expect(result.stdout).toBe('one|two words|{"hook_event_name":"Stop"}')
    expect(result.stderr).toBe('err')
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
