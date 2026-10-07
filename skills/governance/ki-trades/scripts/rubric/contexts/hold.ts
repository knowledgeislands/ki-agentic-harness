import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { AuditOutcome } from '../../shared/rubric.ts'

/** The skill's own hold notice is the only place the review date is written. */
const SKILL = fileURLToPath(new URL('../../../SKILL.md', import.meta.url))
const NOTICE = /^> \*\*Trades are on hold\b/m
const REVIEW_BY = /^> \*\*Trades are on hold\b[^\n]*?\bdue for review by (\d{4}-\d{2}-\d{2})\b/m

export type HoldContext = { readonly outcomes: readonly AuditOutcome[] }

/** Report the hold and its review date, warning once the date has passed. */
export const holdOutcomes = (skill: string, today: string): readonly AuditOutcome[] => {
  if (!NOTICE.test(skill)) return [{ status: 'NOT_APPLICABLE', message: 'trades are not on hold' }]
  const due = skill.match(REVIEW_BY)?.[1]
  if (due === undefined)
    return [{ status: 'VIOLATION', message: 'the trades hold notice names no "due for review by YYYY-MM-DD" date' }]
  if (today > due)
    return [
      {
        status: 'VIOLATION',
        message: `the trades hold passed its review date ${due}: re-enable trades and bring ki-trades up to date with the territory model, or renew the hold with a new date`
      }
    ]
  return [{ status: 'PASS', message: `trades are on hold, due for review by ${due}` }]
}

export const holdContext = (today: string = new Date().toISOString().slice(0, 10)): HoldContext => ({
  outcomes: existsSync(SKILL)
    ? holdOutcomes(readFileSync(SKILL, 'utf8'), today)
    : [{ status: 'VIOLATION', message: 'the ki-trades SKILL.md hold notice is not readable beside this checker' }]
})
