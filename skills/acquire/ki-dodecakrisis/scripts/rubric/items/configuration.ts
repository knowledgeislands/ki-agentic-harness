import { type AuditOutcome, DIAGNOSTIC_REMEDIATION, type RubricFamily } from '../../shared/rubric.ts'
import type { DodecakrisisContext, FileEvidence } from '../contexts/dodecakrisis.ts'

const PROPERTIES = new Set(['mailboxes', 'rules', 'corrections'])
const MAILBOX_FIELDS = ['provider', 'server', 'root'] as const
const PROVIDERS = new Set(['gmail', 'm365'])

const pass = (message: string): AuditOutcome => ({ status: 'PASS', message })
const violation = (message: string): AuditOutcome => ({ status: 'VIOLATION', message })

const mailboxIssues = (name: string, entry: unknown): string[] => {
  if (typeof entry !== 'object' || entry === null || Array.isArray(entry))
    return [`mailbox ${name} is not a table with provider, server and root`]
  const fields = entry as Record<string, unknown>
  const issues = MAILBOX_FIELDS.filter((field) => typeof fields[field] !== 'string' || fields[field] === '').map(
    (field) => `mailbox ${name} has no ${field}`
  )
  if (typeof fields.provider === 'string' && fields.provider !== '' && !PROVIDERS.has(fields.provider))
    issues.push(`mailbox ${name} has provider ${fields.provider}, not gmail or m365`)
  for (const key of Object.keys(fields).filter((key) => !(MAILBOX_FIELDS as readonly string[]).includes(key)))
    issues.push(`mailbox ${name} has unsupported field ${key}`)
  return issues
}

const fileIssues = (property: string, evidence: FileEvidence<unknown>): string[] => {
  if (typeof evidence.configured !== 'string' || evidence.configured === '')
    return [`${property} names no repository file`]
  if (!evidence.exists) return [`${property} file ${evidence.configured} does not exist`]
  if (evidence.parseError) return [`${property} file ${evidence.configured} does not parse: ${evidence.parseError}`]
  return []
}

export const CONFIG = {
  code: 'CONFIG',
  title: 'D12 configuration',
  standard: 'standards-dodecakrisis.md',
  description:
    'The declaring repository supplies its mailboxes, rules file and corrections log in its own table; the protected-label list is never configured here.',
  selectContext: (context) => context,
  items: [
    {
      code: 'CONFIG-1',
      title: 'only the three D12 properties are configured',
      description:
        'The `[skills.ki-dodecakrisis]` table holds only `mailboxes`, `rules` and `corrections`; any other key, such as a protected-label list, is reported.',
      sources: ['standards-dodecakrisis.md#configuration'],
      mechanical: {
        level: 'WARN',
        remediation: {
          class: 'diagnostic',
          guidance:
            'Remove unsupported keys; protected labels belong in the mail server configuration, and runner settings in `ki-muninn`.'
        },
        audit: {
          phase: 'INSPECT',
          run: ({ configurationKeys }) => {
            const unsupported = configurationKeys.filter((key) => !PROPERTIES.has(key))
            return unsupported.length
              ? unsupported.map((key) => violation(`Unsupported D12 property: ${key}`))
              : [pass('The D12 table contains only supported properties.')]
          }
        }
      }
    },
    {
      code: 'CONFIG-2',
      title: 'every declared mailbox has a provider, a server and a root',
      description:
        'Each entry under `mailboxes` names its `provider` (`gmail` or `m365`), its `server` and its label or folder `root`, and nothing else.',
      sources: ['standards-dodecakrisis.md#configuration'],
      mechanical: {
        level: 'FAIL',
        remediation: DIAGNOSTIC_REMEDIATION,
        audit: {
          phase: 'INSPECT',
          run: ({ mailboxes }) => {
            if (mailboxes === undefined) return [pass('No mailbox is declared.')]
            if (typeof mailboxes !== 'object' || mailboxes === null || Array.isArray(mailboxes))
              return [violation('mailboxes is not a table of named mailboxes')]
            const issues = Object.entries(mailboxes).flatMap(([name, entry]) => mailboxIssues(name, entry))
            return issues.length ? issues.map(violation) : [pass('Every declared mailbox is complete.')]
          }
        }
      }
    },
    {
      code: 'CONFIG-3',
      title: 'the rules file and corrections log resolve',
      description:
        'Once a mailbox is declared, `rules` names a TOML rules file and `corrections` a JSON Lines corrections log, both existing in the repository; a configured file that is missing or does not parse is reported even without a mailbox.',
      sources: ['standards-dodecakrisis.md#configuration', 'standards-learning.md#the-corrections-log'],
      mechanical: {
        level: 'FAIL',
        remediation: DIAGNOSTIC_REMEDIATION,
        audit: {
          phase: 'INSPECT',
          run: ({ mailboxNames, rules, corrections }) => {
            const required = mailboxNames.length > 0
            const issues = [
              ...(required || rules.configured !== undefined ? fileIssues('rules', rules) : []),
              ...(required || corrections.configured !== undefined ? fileIssues('corrections', corrections) : [])
            ]
            if (issues.length) return issues.map(violation)
            return [pass(required ? 'The rules file and corrections log resolve.' : 'No mailbox is declared.')]
          }
        }
      }
    }
  ]
} satisfies RubricFamily<DodecakrisisContext, DodecakrisisContext>
