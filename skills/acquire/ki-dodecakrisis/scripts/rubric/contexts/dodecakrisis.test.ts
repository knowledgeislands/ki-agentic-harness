import { afterAll, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'
import { CONFIG } from '../items/configuration.ts'
import { LEARN } from '../items/learning.ts'
import { RULES } from '../items/rules.ts'
import { createDodecakrisisSession, type DodecakrisisContext } from './dodecakrisis.ts'

const roots: string[] = []
afterAll(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true })
})

const repository = (files: Record<string, string>) => {
  const root = mkdtempSync(join(tmpdir(), 'ki-dodecakrisis-'))
  roots.push(root)
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(root, path, '..'), { recursive: true })
    writeFileSync(join(root, path), content)
  }
  return root
}

const contextOf = (root: string, configuration: Record<string, unknown>): DodecakrisisContext => {
  const session = createDodecakrisisSession({
    mode: 'audit',
    repository: root,
    userHome: root,
    configuration,
    packageScriptClaims: []
  })
  const subject = session.subjects.find(({ families }) => families.includes('RULES'))
  if (!subject) throw new Error('Missing rules subject')
  expect(session.proposal()).toEqual({ writes: [] })
  return subject.context()
}

type Checked = { mechanical?: { audit: { run: (context: DodecakrisisContext) => readonly AuditOutcome[] } } }

const run = (items: readonly unknown[], context: DodecakrisisContext) =>
  (items as readonly Checked[]).flatMap((item) => item.mechanical?.audit.run(context) ?? [])

const statuses = (outcomes: readonly { status: string }[]) => outcomes.map(({ status }) => status)
const messages = (outcomes: readonly { message: string }[]) => outcomes.map(({ message }) => message)

const configuration = {
  rules: 'd12/rules.toml',
  corrections: 'd12/corrections.jsonl',
  mailboxes: { gmail: { provider: 'gmail', server: 'kb-mcp-gsuite', root: 'D12' } }
}

const goodRules = `
[[guard]]
id = "G"
mailbox = "gmail"
evidential = true
query = "-from:(solicitor.example)"

[[route]]
id = "inbox-capture"
mailbox = "gmail"
folder = "Inbox Capture"
form = "capture"
destination = "knowledge/captured"
owner = "inbox"

[[rule]]
id = "R07"
mailbox = "gmail"
query = "from:substack.com"
outcome = "Digest"
mode = "automatic"
confidence = "high"
origin = "decision"
approval = "GD12-AUTO a"
guards = ["G"]
filter = "D12 R07 newsletters"

[[rule]]
id = "R11"
mailbox = "gmail"
query = "subject:receipt"
outcome = "Deposit"
mode = "suggest"
confidence = "medium"
origin = "stated"
approval = "D12-RULE 2026-11-08"
route = "inbox-capture"
`

const goodCorrection =
  '{"date":"2026-11-08","mailbox":"gmail","kind":"relabel","rule":"R07","sender_domain":"substack.com","subject_pattern":"Weekly <n>","from":"Digest","to":"Decide"}\n'

test('an empty table is a declaration with nothing to check', () => {
  const context = contextOf(repository({}), {})
  expect(statuses(run(CONFIG.items, context))).toEqual(['PASS', 'PASS', 'PASS'])
  expect(statuses(run(RULES.items, context))).toEqual([
    'NOT_APPLICABLE',
    'NOT_APPLICABLE',
    'NOT_APPLICABLE',
    'NOT_APPLICABLE'
  ])
  expect(statuses(run([LEARN.items[0]], context))).toEqual(['NOT_APPLICABLE'])
})

test('a complete mailbox, rules file and corrections log pass', () => {
  const root = repository({ 'd12/rules.toml': goodRules, 'd12/corrections.jsonl': goodCorrection })
  const context = contextOf(root, configuration)
  const outcomes = [...run(CONFIG.items, context), ...run(RULES.items, context), ...run([LEARN.items[0]], context)]
  expect(statuses(outcomes).every((status) => status === 'PASS')).toBe(true)
})

test('configuration problems are named', () => {
  const context = contextOf(repository({}), {
    protected: ['Z_ARCHIVE/'],
    rules: 'missing.toml',
    mailboxes: { gmail: { provider: 'imap', server: 'kb-mcp-gsuite' } }
  })
  expect(messages(run([CONFIG.items[0]], context))).toEqual(['Unsupported D12 property: protected'])
  expect(messages(run([CONFIG.items[1]], context))).toEqual([
    'mailbox gmail has no root',
    'mailbox gmail has provider imap, not gmail or m365'
  ])
  expect(messages(run([CONFIG.items[2]], context))).toEqual([
    'rules file missing.toml does not exist',
    'corrections names no repository file'
  ])
})

test('unguarded, unrouted, incomplete and unprefixed rules fail', () => {
  const rules = `
[[guard]]
id = "G"
mailbox = "gmail"
query = "-from:x"

[[rule]]
id = "R01"
mailbox = "gmail"
query = "from:linkedin.com"
outcome = "Delete"
mode = "automatic"
confidence = "high"
origin = "learnt"
filter = "LinkedIn"

[[rule]]
id = "R01"
mailbox = "other"
query = "subject:invoice"
outcome = "Docket"
mode = "now"
confidence = "high"
origin = "decision"
approval = "X"

[[rule]]
id = "R02"
mailbox = "gmail"
query = "subject:receipt"
outcome = "Deposit"
mode = "suggest"
confidence = "low"
origin = "decision"
approval = "Y"
`
  const context = contextOf(repository({ 'd12/rules.toml': rules, 'd12/corrections.jsonl': '' }), configuration)
  const [complete, guarded, routed, prefixed] = RULES.items.map((item) => messages(run([item], context)))
  expect(complete).toEqual([
    'rule id R01 is used more than once',
    'rule R01 has no approval',
    'rule R01 has outcome Docket',
    'rule R01 has mode now',
    'rule R01 names undeclared mailbox other'
  ])
  expect(guarded).toEqual([
    'mailbox gmail has 0 evidential guards; it needs exactly one',
    'rule R01 sends to Delete without the evidential guard'
  ])
  expect(routed).toEqual(['rule R02 sends to Deposit without a declared route'])
  expect(prefixed).toEqual(['rule R01 names a filter that does not begin with D12'])
})

test('a correction line carrying a body or a bad value fails', () => {
  const lines = [
    '{"date":"2026-11-08","mailbox":"gmail","kind":"placed","rule":null,"sender_domain":"x.com","subject_pattern":"Hi","from":null,"to":"Decide","body":"secret"}',
    'not json',
    '{"date":"8 Nov","mailbox":"gmail","kind":"moved","rule":"R1","sender_domain":"x.com","subject_pattern":"Hi","from":"Junk","to":"Decide"}'
  ].join('\n')
  const context = contextOf(
    repository({ 'd12/rules.toml': goodRules, 'd12/corrections.jsonl': `${lines}\n` }),
    configuration
  )
  const found = messages(run([LEARN.items[0]], context))
  expect(found[0]).toBe('line 1 carries body, which is not a header field')
  expect(found[1]).toStartWith('line 2 is not JSON')
  expect(found.slice(2)).toEqual([
    'line 3 date is not ISO 8601',
    'line 3 has kind moved',
    'line 3 has from Junk, not an outcome'
  ])
})
