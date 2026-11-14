import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { ChezmoiRubricContext, HeaderContext } from '../contexts/chezmoi.ts'

const SOURCE = 'standards-chezmoi-dotfiles.md#script-headers'

const HEADER_1: RubricItem<HeaderContext> = {
  code: 'HEADER-1',
  title: 'Script header present',
  description:
    'Every script in scope opens, after its shebang, with a header comment carrying a `<name> - <purpose>` first line, a description, and `Runs:` and `Created:` lines.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Add the missing header parts in plain English, taking the Created line from the commit that first added the file; change nothing but comments.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ repositoryState, applicable, scripts }) => {
        if (repositoryState !== 'physical')
          return [{ status: 'NOT_APPLICABLE', message: 'The target repository is not safely inspectable.' }]
        if (!applicable) return [{ status: 'NOT_APPLICABLE', message: 'ki-repo-dotfiles-chezmoi is not applicable.' }]
        if (!scripts.length) return [{ status: 'NOT_APPLICABLE', message: 'The source tree holds no script in scope.' }]
        const lacking = scripts.filter((script) => script.missing.length)
        if (!lacking.length) return [{ status: 'PASS', message: `All ${scripts.length} scripts open with a header.` }]
        return lacking.map((script) => ({
          status: 'VIOLATION' as const,
          message: `The header lacks its ${script.missing.join(', ')}.`,
          subject: script.path
        }))
      }
    }
  }
}

const HEADER_J1: RubricItem<HeaderContext> = {
  code: 'HEADER-J1',
  title: 'Script header in plain English',
  description:
    'Each header explains in plain English what the script is for, why it matters and what it touches; Runs names what actually runs it and Created matches the Git history.',
  sources: [SOURCE],
  judgment: {
    scope: 'Every script header in scope, with the callers and the first-adding commit of each script.',
    prompt:
      'Could a non-technical reader learn from each header the goal, why it matters and what it changes; does Runs name the real caller, and does Created match the commit that first added the file without a guessed work or decision?',
    outcomes: ['conforming', 'header revision required', 'history evidence required'],
    guidance:
      'Rewrite the first line and description in plain English, keeping a good existing explanation below as notes; trace callers before writing `by hand`; take Created from Git history.'
  }
}

export const HEADER: RubricFamily<ChezmoiRubricContext, HeaderContext> = {
  code: 'HEADER',
  title: 'Script headers',
  description: 'The plain-English header comment each script opens with.',
  standard: 'standards-chezmoi-dotfiles.md',
  selectContext: (context) => context.header,
  items: [HEADER_1, HEADER_J1]
}
