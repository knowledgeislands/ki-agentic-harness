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

const GIT_2: RubricItem<GitContext> = {
  code: 'GIT-2',
  title: 'No commit gate',
  description:
    'The source declares no commit gate: no `.githooks/` path is committed and no `core.hooksPath` is bound. Its gate is the manual one its `AGENTS.md` names, and `ki-repo` HOOK-1 to HOOK-4 are not applicable.',
  sources: ['standards-chezmoi-dotfiles.md'],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Remove `.githooks/`, run `git config --unset core.hooksPath`, and keep the check commands in the AGENTS.md manual gate.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ repositoryState, applicable, hookDirectory, hooksPath }) => {
        if (repositoryState !== 'physical')
          return [{ status: 'NOT_APPLICABLE', message: 'The target repository is not safely inspectable.' }]
        if (!applicable) return [{ status: 'NOT_APPLICABLE', message: 'ki-repo-dotfiles-chezmoi is not applicable.' }]
        const findings = [
          ...(hookDirectory
            ? [
                {
                  status: 'VIOLATION' as const,
                  message: 'A chezmoi source commits no hooks; remove .githooks/ and keep the AGENTS.md manual gate.',
                  subject: '.githooks'
                }
              ]
            : []),
          ...(hooksPath
            ? [
                {
                  status: 'VIOLATION' as const,
                  message: `core.hooksPath is ${JSON.stringify(hooksPath)}; a chezmoi source binds no hooks, so unset it.`
                }
              ]
            : [])
        ]
        return findings.length
          ? findings
          : [{ status: 'PASS', message: 'No commit gate is committed or bound; the AGENTS.md manual gate applies.' }]
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
