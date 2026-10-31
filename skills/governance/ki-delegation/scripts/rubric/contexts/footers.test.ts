import { expect, test } from 'bun:test'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { defaultAssetsDirectory, footerOutcomes, GRANT_NAMES } from './footers.ts'

const copy = (): string => {
  const directory = mkdtempSync(join(tmpdir(), 'ki-delegation-footers-'))
  for (const tier of ['none', 'push', 'prune', 'release'])
    cpSync(join(defaultAssetsDirectory, `rules-${tier}.md`), join(directory, `rules-${tier}.md`))
  for (const grant of GRANT_NAMES)
    cpSync(join(defaultAssetsDirectory, `grant-${grant}.md`), join(directory, `grant-${grant}.md`))
  return directory
}

test('every shipped footer grants exactly its tier and every grant lifts only its own ban', () => {
  const outcomes = footerOutcomes()
  expect(outcomes.map((outcome) => outcome.status)).toEqual(['PASS', 'PASS', 'PASS', 'PASS', 'PASS', 'PASS'])
})

test('a missing footer is a violation', () => {
  const directory = copy()
  try {
    rmSync(join(directory, 'rules-prune.md'))
    expect(footerOutcomes(directory)).toContainEqual({
      status: 'VIOLATION',
      message: 'The `prune` authority footer is missing.',
      subject: 'assets/rules-prune.md'
    })
  } finally {
    rmSync(directory, { recursive: true })
  }
})

test('a footer that grants above its tier, omits a grant or drops a prohibition is a violation', () => {
  const directory = copy()
  try {
    const release = readFileSync(join(directory, 'rules-release.md'), 'utf8')
    writeFileSync(join(directory, 'rules-push.md'), release)
    writeFileSync(join(directory, 'rules-prune.md'), '## Rules\n')
    writeFileSync(
      join(directory, 'rules-none.md'),
      release.replace('force-push', 'rewrite history').replaceAll('~/bin/chezmoi/op_cache', '`op`')
    )
    const messages = footerOutcomes(directory).map((outcome) => `${outcome.subject}: ${outcome.message}`)
    expect(messages).toContain('assets/rules-push.md: Footer grants `prune`, which is above its tier.')
    expect(messages).toContain('assets/rules-push.md: Footer grants `release`, which is above its tier.')
    expect(messages).toContain('assets/rules-prune.md: Footer omits the `push` grant its tier includes.')
    expect(messages).toContain('assets/rules-none.md: Footer lacks the required wording `force-push`.')
    expect(messages).toContain('assets/rules-none.md: Footer lacks the required wording `No remote call of any kind`.')
    expect(messages).toContain('assets/rules-none.md: Footer lacks the required wording `~/bin/chezmoi/op_cache`.')
  } finally {
    rmSync(directory, { recursive: true })
  }
})

test('a missing grant, or one that lifts another ban, grants a tier, drops a limit or stays draft, is a violation', () => {
  const directory = copy()
  try {
    rmSync(join(directory, 'grant-machine.md'))
    const fetch = readFileSync(join(directory, 'grant-fetch.md'), 'utf8')
    writeFileSync(
      join(directory, 'grant-fetch.md'),
      `${fetch.replace('never authorises a push', 'allows a push')}\n- Draft, not approved. This overrides only the Rules' ban on an environment or scheduler change; push everything stacked on \`main\` fast-forward only.\n`
    )
    const messages = footerOutcomes(directory).map((outcome) => `${outcome.subject}: ${outcome.message}`)
    expect(messages).toContain('assets/grant-machine.md: The `machine` grant is missing.')
    expect(messages).toContain('assets/grant-fetch.md: Grant lacks the required wording `never authorises a push`.')
    expect(messages).toContain('assets/grant-fetch.md: Grant also lifts the `machine` ban.')
    expect(messages).toContain('assets/grant-fetch.md: Grant carries the `push` tier grant.')
    expect(messages).toContain('assets/grant-fetch.md: Grant is still marked as an unapproved draft.')
  } finally {
    rmSync(directory, { recursive: true })
  }
})

test('a machine grant that drops the new-software ban, the dotfile judgement check or its direct-approval route is a violation', () => {
  const directory = copy()
  try {
    const machine = readFileSync(join(directory, 'grant-machine.md'), 'utf8')
    writeFileSync(
      join(directory, 'grant-machine.md'),
      machine
        .replace('Never install new software', 'Install what the task names')
        .replace('judgement check', 'review')
        .replace('direct approval', 'approval')
    )
    const messages = footerOutcomes(directory).map((outcome) => `${outcome.subject}: ${outcome.message}`)
    expect(messages).toContain(
      'assets/grant-machine.md: Grant lacks the required wording `Never install new software`.'
    )
    expect(messages).toContain('assets/grant-machine.md: Grant lacks the required wording `judgement check`.')
    expect(messages).toContain('assets/grant-machine.md: Grant lacks the required wording `direct approval`.')
  } finally {
    rmSync(directory, { recursive: true })
  }
})

test('every tier retains the independent approval-bound closure boundary', () => {
  const directory = copy()
  try {
    for (const tier of ['none', 'push', 'prune', 'release']) {
      const path = join(directory, `rules-${tier}.md`)
      const original = readFileSync(path, 'utf8')
      for (const phrase of [
        'only as an independent actor',
        'exact explicit human-approved closure',
        'frozen payload/set',
        '`completion_target: done`',
        'This footer supplies no human approval',
        'Cancellation needs separate exact human approval'
      ]) {
        writeFileSync(path, original.replace(phrase, 'missing-boundary'))
        expect(
          footerOutcomes(directory).some(
            (outcome) => outcome.subject === `assets/rules-${tier}.md` && outcome.status === 'VIOLATION'
          )
        ).toBe(true)
      }
      writeFileSync(path, original)
    }
  } finally {
    rmSync(directory, { recursive: true })
  }
})
