import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { ChezmoiRubricContext, GitContext } from '../contexts/chezmoi.ts'

const GIT_1: RubricItem<GitContext> = {
  code: 'GIT-1',
  title: 'Git lock hygiene',
  description: 'No stray physical `.git/*.lock` files remain in the repository.',
  sources: ['standards-chezmoi-dotfiles.md'],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Inspect the lock’s owning process and repository boundary, then use the governed stale-lock recovery procedure; do not remove it blindly.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ repositoryState, applicable, locks }) => {
        if (repositoryState !== 'physical')
          return [{ status: 'NOT_APPLICABLE', message: 'The target repository is not safely inspectable.' }]
        if (!applicable) return [{ status: 'NOT_APPLICABLE', message: 'ki-repo-dotfiles-chezmoi is not applicable.' }]
        if (locks === null) return [{ status: 'NOT_APPLICABLE', message: 'No physical .git directory exists.' }]
        return locks.length
          ? locks.map((lock) => ({
              status: 'VIOLATION' as const,
              message: 'A stray Git lock file is present.',
              subject: lock
            }))
          : [{ status: 'PASS', message: 'No stray physical Git lock files are present.' }]
      }
    }
  }
}

const HOOK = '.githooks/pre-commit'

const GIT_2: RubricItem<GitContext> = {
  code: 'GIT-2',
  title: 'Check-only commit gate',
  description:
    'Where a committed `.githooks/pre-commit` exists, it runs `ki repo audit` check-only and never `ki repo conform`; `ki-repo` HOOK-1 owns whether the hook exists.',
  sources: ['standards-chezmoi-dotfiles.md'],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Make `.githooks/pre-commit` run `ki repo audit` without a rewriting flag, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ repositoryState, applicable, hook, hookText }) => {
        if (repositoryState !== 'physical')
          return [{ status: 'NOT_APPLICABLE', message: 'The target repository is not safely inspectable.' }]
        if (!applicable) return [{ status: 'NOT_APPLICABLE', message: 'ki-repo-dotfiles-chezmoi is not applicable.' }]
        if (hook === 'missing')
          return [{ status: 'NOT_APPLICABLE', message: `No committed ${HOOK}; ki-repo HOOK-1 owns its existence.` }]
        if (hook === 'unsafe')
          return [{ status: 'VIOLATION', message: `${HOOK} is not a safe regular file.`, subject: HOOK }]
        const lines = hookText
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => !line.startsWith('#'))
        if (lines.some((line) => /\bki repo conform\b/.test(line)))
          return [
            {
              status: 'VIOLATION',
              message: `${HOOK} runs \`ki repo conform\`; the gate must be check-only.`,
              subject: HOOK
            }
          ]
        return lines.some((line) => /\bki repo audit\b/.test(line) && !/(^|\s)--(fix|write)\b/.test(line))
          ? [{ status: 'PASS', message: `${HOOK} runs \`ki repo audit\` check-only.`, subject: HOOK }]
          : [{ status: 'VIOLATION', message: `${HOOK} does not run \`ki repo audit\` check-only.`, subject: HOOK }]
      }
    }
  }
}

export const GIT: RubricFamily<ChezmoiRubricContext, GitContext> = {
  code: 'GIT',
  title: 'Git hygiene',
  description: 'Stray lock files that block Git operations, and what the commit gate runs.',
  standard: 'standards-chezmoi-dotfiles.md',
  selectContext: (context) => context.git,
  items: [GIT_1, GIT_2]
}
