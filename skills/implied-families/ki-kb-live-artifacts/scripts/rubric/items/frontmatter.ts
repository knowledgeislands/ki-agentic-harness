import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { LiveArtifactsContext } from '../contexts/live-artifacts.ts'

const SOURCE = ['standards.md'] as const

export const LA_F_1: RubricItem<LiveArtifactsContext> = {
  code: 'LA-F-1',
  title: 'artifact status',
  description: 'Each artifact source declares `status: active` or `status: archived`.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        if (!context.artifactsDirectoryExists || context.sources.length === 0)
          return [{ status: 'NOT_APPLICABLE', message: 'No artifact sources are available for frontmatter checks.' }]
        const violations = context.sources.flatMap((source) => {
          const status = source.frontmatter?.status
          if (!status)
            return [
              { status: 'VIOLATION' as const, message: "The required frontmatter field 'status' is absent.", subject: source.relativePath }
            ]
          return ['active', 'archived'].includes(status)
            ? []
            : [
                {
                  status: 'VIOLATION' as const,
                  message: `status '${status}' is not one of active / archived.`,
                  subject: source.relativePath
                }
              ]
        })
        return violations.length > 0
          ? (violations as [(typeof violations)[number], ...(typeof violations)[number][]])
          : [{ status: 'PASS', message: 'Every artifact source has a valid status.' }]
      }
    },
    conform: { phase: 'PRIMARY', run: () => [{ status: 'INFO', message: 'Selecting active or archived status requires author judgment.' }] }
  }
}

export const LA_F_2: RubricItem<LiveArtifactsContext> = {
  code: 'LA-F-2',
  title: 'render declaration',
  description: 'Each frontmatter block declares `renders: html`.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        if (!context.artifactsDirectoryExists || context.sources.length === 0)
          return [{ status: 'NOT_APPLICABLE', message: 'No artifact sources are available for frontmatter checks.' }]
        const violations = context.sources
          .filter((source) => !source.frontmatter?.renders)
          .map((source) => ({
            status: 'VIOLATION' as const,
            message: "The required frontmatter field 'renders' is absent.",
            subject: source.relativePath
          }))
        return violations.length > 0
          ? (violations as [(typeof violations)[number], ...(typeof violations)[number][]])
          : [{ status: 'PASS', message: 'Every frontmatter block declares renders.' }]
      }
    },
    conform: { phase: 'PRIMARY', run: (context) => context.conformRenders() }
  }
}

export const LA_FRONTMATTER = [LA_F_1, LA_F_2] as const
