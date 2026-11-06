import { expect, test } from 'bun:test'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
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

test('the payload table lists every hook folder once', () => {
  expect(listed.length).toBeGreaterThan(0)
  expect(new Set(listed).size).toBe(listed.length)
  expect([...listed].sort()).toEqual(folders.map((name) => `${name}/${name}.sh`).sort())
})

test.each(folders)('%s ships executable with its own test', (name) => {
  expect(statSync(join(import.meta.dir, name, `${name}.sh`)).mode & 0o111).toBe(0o111)
  expect(existsSync(join(import.meta.dir, name, `${name}.test.ts`))).toBe(true)
})

// Each hook's script lives only in its folder: the forwarding stubs at the old
// flat paths `hooks/<hook>.sh` retired once both Macs bound the folder paths.
test('no hook script sits at the old flat path', () => {
  expect(readdirSync(import.meta.dir).filter((name) => name.endsWith('.sh'))).toEqual([])
})
