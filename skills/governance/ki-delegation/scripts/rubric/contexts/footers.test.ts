import { expect, test } from 'bun:test'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { defaultAssetsDirectory, footerOutcomes } from './footers.ts'

const copy = (): string => {
  const directory = mkdtempSync(join(tmpdir(), 'ki-delegation-footers-'))
  for (const tier of ['none', 'push', 'prune', 'release'])
    cpSync(join(defaultAssetsDirectory, `rules-${tier}.md`), join(directory, `rules-${tier}.md`))
  return directory
}

test('every shipped footer grants exactly its tier', () => {
  const outcomes = footerOutcomes()
  expect(outcomes.map((outcome) => outcome.status)).toEqual(['PASS', 'PASS', 'PASS', 'PASS'])
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
    writeFileSync(join(directory, 'rules-none.md'), release.replace('force-push', 'rewrite history'))
    const messages = footerOutcomes(directory).map((outcome) => `${outcome.subject}: ${outcome.message}`)
    expect(messages).toContain('assets/rules-push.md: Footer grants `prune`, which is above its tier.')
    expect(messages).toContain('assets/rules-push.md: Footer grants `release`, which is above its tier.')
    expect(messages).toContain('assets/rules-prune.md: Footer omits the `push` grant its tier includes.')
    expect(messages).toContain('assets/rules-none.md: Footer lacks the required wording `force-push`.')
    expect(messages).toContain('assets/rules-none.md: Footer lacks the required wording `No remote call of any kind`.')
  } finally {
    rmSync(directory, { recursive: true })
  }
})
