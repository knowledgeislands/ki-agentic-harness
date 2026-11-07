import { type AuditOutcome, DIAGNOSTIC_REMEDIATION, judgment, type RubricFamily } from '../../shared/rubric.ts'
import { type DodecakrisisContext, OUTCOMES } from '../contexts/dodecakrisis.ts'

const FIELDS = ['date', 'mailbox', 'kind', 'rule', 'sender_domain', 'subject_pattern', 'from', 'to'] as const
const NULLABLE = new Set(['rule', 'from'])
const KINDS = new Set(['relabel', 'undelete', 'placed', 'capture'])
const OUTCOME_NAMES = new Set<string>(OUTCOMES)
const DATE = /^\d{4}-\d{2}-\d{2}/

const lineIssues = (line: number, value: unknown, mailboxes: ReadonlySet<string>): string[] => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return [`line ${line} is not an object`]
  const fields = value as Record<string, unknown>
  const issues = Object.keys(fields)
    .filter((key) => !(FIELDS as readonly string[]).includes(key))
    .map((key) => `line ${line} carries ${key}, which is not a header field`)
  for (const field of FIELDS) {
    const present = fields[field]
    if (present === null && NULLABLE.has(field)) continue
    if (typeof present !== 'string' || present === '') issues.push(`line ${line} has no ${field}`)
  }
  if (typeof fields.date === 'string' && !DATE.test(fields.date)) issues.push(`line ${line} date is not ISO 8601`)
  if (typeof fields.kind === 'string' && !KINDS.has(fields.kind)) issues.push(`line ${line} has kind ${fields.kind}`)
  for (const field of ['from', 'to'])
    if (typeof fields[field] === 'string' && !OUTCOME_NAMES.has(fields[field] as string))
      issues.push(`line ${line} has ${field} ${fields[field] as string}, not an outcome`)
  if (typeof fields.mailbox === 'string' && !mailboxes.has(fields.mailbox))
    issues.push(`line ${line} names undeclared mailbox ${fields.mailbox}`)
  return issues
}

export const LEARN = {
  code: 'LEARN',
  title: 'Learning loop',
  standard: 'standards-learning.md',
  description:
    'Corrections are logged from headers only, and a learnt or stated rule goes live only with Kris’s answer or his own words.',
  selectContext: (context) => context,
  items: [
    {
      code: 'LEARN-1',
      title: 'correction lines carry headers only',
      description:
        'Every line of the corrections log is one JSON object with exactly `date`, `mailbox`, `kind`, `rule`, `sender_domain`, `subject_pattern`, `from` and `to`, so no message body, snippet or full address is kept.',
      sources: ['standards-learning.md#the-corrections-log'],
      mechanical: {
        level: 'FAIL',
        remediation: DIAGNOSTIC_REMEDIATION,
        audit: {
          phase: 'PRIMARY',
          run: ({ corrections, mailboxNames }): AuditOutcome[] => {
            if (!corrections.value)
              return [{ status: 'NOT_APPLICABLE', message: 'No parsed corrections log to check.' }]
            const mailboxes = new Set(mailboxNames)
            const issues = corrections.value.flatMap(({ line, value, error }) =>
              error ? [`line ${line} is not JSON: ${error}`] : lineIssues(line, value, mailboxes)
            )
            return issues.length
              ? issues.map((message) => ({ status: 'VIOLATION', message }))
              : [{ status: 'PASS', message: `${corrections.value.length} correction lines carry headers only.` }]
          }
        }
      }
    },
    {
      code: 'LEARN-2',
      title: 'learnt and stated rules go live only with Kris’s word',
      description:
        'A learnt rule was drafted from three agreeing corrections and went into the rules file only on Kris’s answer to its query; a stated rule is logged in his words as a `D12-RULE` line, was dry-run with its count shown back, and outranks a learnt one.',
      sources: ['standards-learning.md#drafting-rules', 'standards-learning.md#stated-rules'],
      judgment: judgment(
        'Does every `learnt` or `stated` rule cite an approval that is Kris’s answer or his own `D12-RULE` words, with the dry-run count shown before it went live, and did any rule past 5% corrections drop back to suggest?'
      )
    }
  ]
} satisfies RubricFamily<DodecakrisisContext, DodecakrisisContext>
