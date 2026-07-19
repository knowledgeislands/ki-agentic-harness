import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { BindingChezMoiContext } from '../contexts/binding-chezmoi.ts'

const sources = ['standards.md'] as const
export const BINDCHEZ_1: RubricItem<BindingChezMoiContext> = {
  code: 'BINDCHEZ-1',
  title: 'chezmoi source repo is conventional',
  description: 'The chezmoi source repo is available for the composed dotfiles audit.',
  sources,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'PREPARE',
      run: ({ repo, present }) =>
        present
          ? [{ status: 'PASS', message: 'chezmoi source repo is present.', subject: repo }]
          : [
              {
                status: 'INFO',
                message: `chezmoi source repo not present at ${repo} — render-repo checks skipped (pass a path).`,
                subject: repo
              }
            ]
    }
  }
}
export const BINDCHEZ_2: RubricItem<BindingChezMoiContext> = {
  code: 'BINDCHEZ-2',
  title: 'surfaces agree with the single source',
  description: 'The renderer-neutral binding audit owns surface agreement.',
  sources,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'DERIVED',
      run: () => [{ status: 'NOT_APPLICABLE', message: 'Surface agreement is owned by ki-binding; run its audit directly.' }]
    }
  }
}
export const BINDCHEZ_3: RubricItem<BindingChezMoiContext> = {
  code: 'BINDCHEZ-3',
  title: 'MCP source data is present',
  description: 'The chezmoi repository carries supported MCP source data.',
  sources,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: ({ present, data }) =>
        !present
          ? [{ status: 'NOT_APPLICABLE', message: 'chezmoi source repo is absent.' }]
          : data
            ? [{ status: 'PASS', message: `chezmoi repo carries the MCP source data (${data}).`, subject: data }]
            : [
                {
                  status: 'VIOLATION',
                  message: 'No MCP source data was found in either supported render pattern.',
                  subject: '.chezmoidata'
                }
              ]
    }
  }
}
export const BINDCHEZ_4: RubricItem<BindingChezMoiContext> = {
  code: 'BINDCHEZ-4',
  title: 'render template is present',
  description: 'The mcp-servers-json render template partial exists.',
  sources,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: ({ present, template }) =>
        !present
          ? [{ status: 'NOT_APPLICABLE', message: 'chezmoi source repo is absent.' }]
          : template
            ? [{ status: 'PASS', message: `render template present (${template})`, subject: template }]
            : [
                {
                  status: 'VIOLATION',
                  message: 'no mcp-servers-json render template found in the chezmoi repo — surfaces cannot be rendered from the source'
                }
              ]
    }
  }
}
export const BINDCHEZ_5: RubricItem<BindingChezMoiContext> = {
  code: 'BINDCHEZ-5',
  title: 'render template is wired',
  description: 'A surface target template references the render partial.',
  sources,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'DERIVED',
      run: ({ present, wired }) =>
        !present
          ? [{ status: 'NOT_APPLICABLE', message: 'chezmoi source repo is absent.' }]
          : wired
            ? [{ status: 'PASS', message: `render template is wired into a surface target (${wired})`, subject: wired }]
            : [
                {
                  status: 'VIOLATION',
                  message: 'no .tmpl target references mcp-servers-json — the template exists but no surface is rendered through it'
                }
              ]
    }
  }
}
export const BINDCHEZ_6: RubricItem<BindingChezMoiContext> = {
  code: 'BINDCHEZ-6',
  title: 'render parity',
  description: 'A chezmoi apply reproduces the surfaces ki-binding audits.',
  sources,
  judgment: { prompt: 'Assess render parity from a previewed chezmoi diff.' }
}
export const BINDCHEZ_7: RubricItem<BindingChezMoiContext> = {
  code: 'BINDCHEZ-7',
  title: 'contract coherence',
  description: 'The rubric, standard, and checker constants agree.',
  sources,
  judgment: { prompt: 'Assess whether the binding-chezmoi contract remains coherent.' }
}
export const BINDCHEZ = [BINDCHEZ_1, BINDCHEZ_2, BINDCHEZ_3, BINDCHEZ_4, BINDCHEZ_5, BINDCHEZ_6, BINDCHEZ_7] as const
