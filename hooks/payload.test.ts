import { expect, test } from 'bun:test'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

// The README's payload table is what a user-environment manager registers from
// the installed harness, so it must name exactly the hooks `ki` ships.
const readme = readFileSync(join(import.meta.dir, 'README.md'), 'utf8')
const table = readme.split('<!-- hooks:payload:start -->')[1]?.split('<!-- hooks:payload:end -->')[0] ?? ''
const listed = [...table.matchAll(/^\| `([^`]+\.sh)` \|/gm)].map((match) => match[1] as string)
const shipped = readdirSync(import.meta.dir).filter((name) => name.endsWith('.sh'))

test('the payload table lists every shipped hook once', () => {
  expect(listed.length).toBeGreaterThan(0)
  expect(new Set(listed).size).toBe(listed.length)
  expect([...listed].sort()).toEqual([...shipped].sort())
})

test.each(shipped)('%s ships executable with its own test', (name) => {
  expect(statSync(join(import.meta.dir, name)).mode & 0o111).toBe(0o111)
  expect(existsSync(join(import.meta.dir, name.replace(/\.sh$/, '.test.ts')))).toBe(true)
})
