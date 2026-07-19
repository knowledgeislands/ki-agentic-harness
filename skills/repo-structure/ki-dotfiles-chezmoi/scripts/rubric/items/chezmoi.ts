import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { ChezmoiContext } from '../contexts/chezmoi.ts'

export const CHEZMOI_1: RubricItem<ChezmoiContext> = {
  code: 'CHEZMOI-1',
  title: 'managed ignore file',
  description: '`.chezmoiignore` exists at the repository root.',
  sources: ['standards.md'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        !context.available
          ? [{ status: 'VIOLATION', message: 'audit target is not an existing directory', subject: context.target }]
          : context.hasIgnore
            ? [{ status: 'PASS', message: 'managed ignore file is present', subject: '.chezmoiignore' }]
            : [
                {
                  status: 'VIOLATION',
                  message: 'managed ignore file is missing — run CONFORM to scaffold an empty one',
                  subject: '.chezmoiignore'
                }
              ]
    },
    conform: { phase: 'PRIMARY', run: (context) => [context.ensureIgnore()] }
  }
}

export const CHEZMOI_2: RubricItem<ChezmoiContext> = {
  code: 'CHEZMOI-2',
  title: 'template support directory',
  description: 'When `*.tmpl` files exist, `.chezmoidata/` or `.chezmoitemplates/` also exists.',
  sources: ['standards.md'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        !context.available
          ? [{ status: 'NOT_APPLICABLE', message: 'target is not an existing directory' }]
          : !context.hasTemplateFiles
            ? [{ status: 'NOT_APPLICABLE', message: 'no .tmpl files in tree — template support check not applicable' }]
            : context.hasTemplateSupport
              ? [{ status: 'PASS', message: '.chezmoidata/ or .chezmoitemplates/ present alongside .tmpl files' }]
              : [
                  {
                    status: 'VIOLATION',
                    message: '.tmpl files exist but neither .chezmoidata/ nor .chezmoitemplates/ is present',
                    subject: '.chezmoidata/ or .chezmoitemplates/'
                  }
                ]
    }
  }
}

export const CHEZMOI_J1: RubricItem<ChezmoiContext> = {
  code: 'CHEZMOI-J1',
  title: 'chezmoiignore negation intent',
  description: 'A `.chezmoiignore` negation is deliberate and documented rather than accidentally broad.',
  sources: ['standards.md'],
  judgment: { prompt: 'Are `.chezmoiignore` negations deliberate, documented exceptions to broad ignores?' }
}

export const CHEZMOI = [CHEZMOI_1, CHEZMOI_2, CHEZMOI_J1] as const
