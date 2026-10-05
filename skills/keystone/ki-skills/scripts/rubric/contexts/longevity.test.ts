import { describe, expect, test } from 'bun:test'
import { createRefreshContext } from './longevity.ts'

const now = Date.parse('2026-10-06T00:00:00Z')

const sources = (...dates: string[]): string =>
  [
    '**Refresh:** external-spec · monthly',
    '',
    'Reviewed on 2026-10-05 in prose, which does not count.',
    '',
    '| Source | Last reviewed |',
    '| --- | --- |',
    ...dates.map((date, index) => `| S${index} | ${date} |`)
  ].join('\n')

describe('createRefreshContext', () => {
  test('a fresh row cannot mask a stale one', () => {
    const context = createRefreshContext(sources('2026-10-01', '2026-07-01', '2026-09-20'), now)
    expect(context.lastReviewed).toBe('2026-07-01')
    expect(context.ageDays).toBe(97)
  })

  test('dates outside the Last reviewed column are ignored', () => {
    expect(createRefreshContext(sources('2026-09-30'), now).lastReviewed).toBe('2026-09-30')
    expect(createRefreshContext(sources(), now).lastReviewed).toBeNull()
  })
})
