import type { AuditOutcome, RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { DecisionRecordsContext } from '../contexts/decision-records.ts'
import { outcomes } from './shared.ts'

const SOURCE = 'dr-format.md'

export const FILENAME_1: RubricItem<DecisionRecordsContext> = {
  code: 'FILENAME-1',
  title: 'Canonical decision-record filename',
  description:
    'Filename is `<ID>-<title-slug>.md`: the canonical uppercase record ID, a dash, then the title lowercased with each non-alphanumeric run replaced by one dash and leading or trailing dashes removed.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context: DecisionRecordsContext) =>
        outcomes(
          context.invalidFilenames.map(
            (file): AuditOutcome => ({
              status: 'VIOLATION',
              message: 'Filename is not the canonical ID followed by the slugified title.',
              subject: file
            })
          ),
          'Every decision-record filename is the canonical ID followed by the slugified title.'
        )
    }
  }
}

export const FILENAME_2: RubricItem<DecisionRecordsContext> = {
  code: 'FILENAME-2',
  title: 'Unique serial within prefix and scope',
  description:
    'NNN is unique per prefix within its `<SCOPE>` namespace; two files may share the same integer if they carry different prefixes; no two files share the same prefix+scope+serial combination. `XXX` files are exempt from uniqueness.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context: DecisionRecordsContext) =>
        outcomes(
          [...context.duplicateIds].map(
            ([id, files]): AuditOutcome => ({
              status: 'VIOLATION',
              message: `Decision-record ID is shared by ${files.length} files.`,
              subject: id
            })
          ),
          'Every decision-record ID is unique within its prefix and scope.'
        )
    }
  }
}

export const FILENAME_3: RubricItem<DecisionRecordsContext> = {
  code: 'FILENAME-3',
  title: 'Contiguous serial series',
  description:
    'Within each prefix+scope series the ordinary-record serials start at `001` and are contiguous. A gap is fixed by renumbering the series and sweeping every citation of shifted codes in the same change. `XXX` pending files are exempt. A deliberate verbatim shared-record mirror (`shared_record: true`) is excluded only when its prefix+scope has no ordinary local records; otherwise it remains part of that local series.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context: DecisionRecordsContext) =>
        outcomes(
          [...context.serialGaps].map(
            ([series, serials]): AuditOutcome => ({
              status: 'VIOLATION',
              message: `Serial series is missing ${serials.map((serial) => String(serial).padStart(3, '0')).join(', ')}.`,
              subject: series
            })
          ),
          'Every numbered decision-record series starts at 001 and is contiguous.'
        )
    }
  }
}

export const FILENAME = [FILENAME_1, FILENAME_2, FILENAME_3] as const satisfies readonly RubricItem<DecisionRecordsContext>[]
