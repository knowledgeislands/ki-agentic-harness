import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { ChezmoiContext } from '../contexts/chezmoi.ts'

export const GIT_1: RubricItem<ChezmoiContext> = {
  code: 'GIT-1',
  title: 'Git lock hygiene',
  description: 'No stray `.git/*.lock` files remain in the repository.',
  sources: ['standards.md'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        if (!context.available) return [{ status: 'NOT_APPLICABLE', message: 'target is not an existing directory' }]
        if (context.strayLocks === null) return [{ status: 'NOT_APPLICABLE', message: 'no .git directory — not a git repo' }]
        if (context.strayLocks.length === 0) return [{ status: 'PASS', message: 'no stray .git/*.lock files' }]
        const violations = context.strayLocks.map((lock) => ({
          status: 'VIOLATION' as const,
          message: `stray git lock file present: ${lock}`,
          subject: lock
        }))
        return violations as [
          { status: 'VIOLATION'; message: string; subject: string },
          ...{ status: 'VIOLATION'; message: string; subject: string }[]
        ]
      }
    }
  }
}

export const GIT = [GIT_1] as const
