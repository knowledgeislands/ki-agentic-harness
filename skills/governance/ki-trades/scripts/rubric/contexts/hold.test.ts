import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { holdContext, holdOutcomes } from './hold.ts'

const notice = (lead: string): string => `# ki-trades\n\n> **${lead}** Submit no new trade.\n`
const HELD = notice('Trades are on hold, due for review by 2026-10-14.')

test('a hold before or on its review date reports the date', () => {
  expect(holdOutcomes(HELD, '2026-10-07')).toEqual([
    { status: 'PASS', message: 'trades are on hold, due for review by 2026-10-14' }
  ])
  expect(holdOutcomes(HELD, '2026-10-14')[0]?.status).toBe('PASS')
})

test('a hold past its review date warns', () => {
  expect(holdOutcomes(HELD, '2026-10-15')).toEqual([
    {
      status: 'VIOLATION',
      message:
        'the trades hold passed its review date 2026-10-14: re-enable trades and bring ki-trades up to date with the territory model, or renew the hold with a new date'
    }
  ])
})

test('a hold without a review date warns, and no hold is not applicable', () => {
  expect(holdOutcomes(notice('Trades are on hold.'), '2026-10-07')[0]?.status).toBe('VIOLATION')
  expect(holdOutcomes('# ki-trades\n', '2026-10-07')).toEqual([
    { status: 'NOT_APPLICABLE', message: 'trades are not on hold' }
  ])
})

test("the skill's own notice carries a readable review date", () => {
  const skill = readFileSync(new URL('../../../SKILL.md', import.meta.url), 'utf8')
  expect(holdOutcomes(skill, '0000-01-01')[0]?.message).toMatch(
    /^trades are on hold, due for review by \d{4}-\d{2}-\d{2}$/
  )
  expect(holdContext('0000-01-01').outcomes[0]?.status).toBe('PASS')
})
