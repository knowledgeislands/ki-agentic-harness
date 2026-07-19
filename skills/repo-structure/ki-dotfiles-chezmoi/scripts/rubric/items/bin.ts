import type { AuditOutcome, RubricItem } from '../../vendored/ki-skills/rubric.ts'
import { type ChezmoiContext, hasRecognizedPrefix } from '../contexts/chezmoi.ts'

export const BIN_1: RubricItem<ChezmoiContext> = {
  code: 'BIN-1',
  title: 'bin source-attribute prefix',
  description: 'Every direct file in `bin/` carries a recognised chezmoi source-attribute prefix.',
  sources: ['standards.md'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        if (!context.available) return [{ status: 'NOT_APPLICABLE', message: 'target is not an existing directory' }]
        if (context.binEntries === null) return [{ status: 'NOT_APPLICABLE', message: 'no bin/ directory in tree' }]
        if (context.binEntries.length === 0)
          return [{ status: 'NOT_APPLICABLE', message: 'bin/ exists but contains no direct files to check' }]
        const outcomes: AuditOutcome[] = context.binEntries.map((entry) =>
          hasRecognizedPrefix(entry)
            ? { status: 'PASS', message: 'follows a recognised chezmoi source-attribute prefix', subject: `bin/${entry}` }
            : {
                status: 'VIOLATION',
                message: 'no recognised chezmoi source-attribute prefix — confirm this is intentionally unmanaged',
                subject: `bin/${entry}`
              }
        )
        return outcomes as [AuditOutcome, ...AuditOutcome[]]
      }
    }
  }
}

export const BIN = [BIN_1] as const
