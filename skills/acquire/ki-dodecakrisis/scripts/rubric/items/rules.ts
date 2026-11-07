import { type AuditOutcome, DIAGNOSTIC_REMEDIATION, type RubricFamily } from '../../shared/rubric.ts'
import { type DodecakrisisContext, type Entry, OUTCOMES, type RulesFile } from '../contexts/dodecakrisis.ts'

const RULE_FIELDS = ['id', 'mailbox', 'query', 'outcome', 'mode', 'confidence', 'origin', 'approval'] as const
const ROUTE_FIELDS = ['id', 'mailbox', 'folder', 'form', 'destination', 'owner'] as const
const MODES = new Set(['automatic', 'suggest'])
const CONFIDENCES = new Set(['high', 'medium', 'low'])
const ORIGINS = new Set(['stated', 'learnt', 'decision'])
const FORMS = new Set(['capture', 'eml.txt'])
const GUARDED_OUTCOMES = new Set(['Delete', 'Digest'])
const FILTER_PREFIX = 'D12'

const text = (entry: Entry, field: string): string | undefined =>
  typeof entry[field] === 'string' && entry[field] !== '' ? (entry[field] as string) : undefined

const label = (kind: string, entry: Entry, index: number) => `${kind} ${text(entry, 'id') ?? `#${index + 1}`}`

const missing = (kind: string, entry: Entry, index: number, fields: readonly string[]) =>
  fields.filter((field) => !text(entry, field)).map((field) => `${label(kind, entry, index)} has no ${field}`)

const duplicates = (kind: string, list: readonly Entry[]) => {
  const seen = new Set<string>()
  return list.flatMap((entry) => {
    const id = text(entry, 'id')
    if (!id) return []
    if (seen.has(id)) return [`${kind} id ${id} is used more than once`]
    seen.add(id)
    return []
  })
}

/** Runs a rules-file check, or reports it not applicable when there is no parsed rules file. */
const withRules =
  (passMessage: string, check: (file: RulesFile, mailboxes: ReadonlySet<string>) => string[]) =>
  ({ rules, mailboxNames }: DodecakrisisContext): AuditOutcome[] => {
    if (!rules.value) return [{ status: 'NOT_APPLICABLE', message: 'No parsed rules file to check.' }]
    const issues = check(rules.value, new Set(mailboxNames))
    return issues.length
      ? issues.map((message) => ({ status: 'VIOLATION', message }))
      : [{ status: 'PASS', message: passMessage }]
  }

const ruleIssues = ({ rules }: RulesFile, mailboxes: ReadonlySet<string>) => [
  ...duplicates('rule', rules),
  ...rules.flatMap((rule, index) => {
    const name = label('rule', rule, index)
    const issues = missing('rule', rule, index, RULE_FIELDS)
    const check = (field: string, allowed: ReadonlySet<string>) => {
      const value = text(rule, field)
      if (value && !allowed.has(value)) issues.push(`${name} has ${field} ${value}`)
    }
    check('outcome', new Set(OUTCOMES))
    check('mode', MODES)
    check('confidence', CONFIDENCES)
    check('origin', ORIGINS)
    const mailbox = text(rule, 'mailbox')
    if (mailbox && !mailboxes.has(mailbox)) issues.push(`${name} names undeclared mailbox ${mailbox}`)
    return issues
  })
]

const guardIssues = ({ guards, rules }: RulesFile, mailboxes: ReadonlySet<string>) => {
  const evidential = new Map<string, string[]>()
  const issues = [
    ...duplicates('guard', guards),
    ...guards.flatMap((guard, index) => missing('guard', guard, index, ['id', 'mailbox', 'query']))
  ]
  for (const guard of guards) {
    const mailbox = text(guard, 'mailbox')
    const id = text(guard, 'id')
    if (guard.evidential === true && mailbox && id) evidential.set(mailbox, [...(evidential.get(mailbox) ?? []), id])
  }
  for (const mailbox of mailboxes) {
    const ids = evidential.get(mailbox) ?? []
    if (ids.length !== 1) issues.push(`mailbox ${mailbox} has ${ids.length} evidential guards; it needs exactly one`)
  }
  rules.forEach((rule, index) => {
    const outcome = text(rule, 'outcome')
    const mailbox = text(rule, 'mailbox')
    if (!outcome || !GUARDED_OUTCOMES.has(outcome) || !mailbox) return
    const listed = Array.isArray(rule.guards) ? rule.guards : []
    const required = evidential.get(mailbox)?.[0]
    if (!required || !listed.includes(required))
      issues.push(`${label('rule', rule, index)} sends to ${outcome} without the evidential guard`)
  })
  return issues
}

const routeIssues = ({ routes, rules }: RulesFile, mailboxes: ReadonlySet<string>) => {
  const declared = new Set(routes.map((route) => text(route, 'id')).filter(Boolean))
  const issues = [
    ...duplicates('route', routes),
    ...routes.flatMap((route, index) => {
      const found = missing('route', route, index, ROUTE_FIELDS)
      const form = text(route, 'form')
      if (form && !FORMS.has(form)) found.push(`${label('route', route, index)} has form ${form}`)
      const mailbox = text(route, 'mailbox')
      if (mailbox && !mailboxes.has(mailbox))
        found.push(`${label('route', route, index)} names undeclared mailbox ${mailbox}`)
      return found
    })
  ]
  rules.forEach((rule, index) => {
    if (text(rule, 'outcome') !== 'Deposit') return
    const route = text(rule, 'route')
    if (!route || !declared.has(route))
      issues.push(`${label('rule', rule, index)} sends to Deposit without a declared route`)
  })
  return issues
}

const filterIssues = ({ rules }: RulesFile) =>
  rules.flatMap((rule, index) => {
    if (rule.filter === undefined) return []
    const filter = text(rule, 'filter')
    return filter?.startsWith(FILTER_PREFIX)
      ? []
      : [`${label('rule', rule, index)} names a filter that does not begin with ${FILTER_PREFIX}`]
  })

export const RULES = {
  code: 'RULES',
  title: 'Rules file',
  standard: 'standards-dodecakrisis.md',
  description:
    'The rules file holds guards, Deposit routes and rules; only rules send items out, Delete and Digest rules carry the evidential guard, and every rule cites its approval.',
  selectContext: (context) => context,
  items: [
    {
      code: 'RULES-1',
      title: 'every rule is complete and cites its approval',
      description:
        'Each rule has a unique id, a declared mailbox, a query, one of the nine outcomes, a mode (`automatic` or `suggest`), a confidence (`high`, `medium` or `low`), an origin (`stated`, `learnt` or `decision`) and the approval that put it live.',
      sources: ['standards-dodecakrisis.md#the-rules-file', 'standards-dodecakrisis.md#writes-and-approvals'],
      mechanical: {
        level: 'FAIL',
        remediation: DIAGNOSTIC_REMEDIATION,
        audit: { phase: 'PRIMARY', run: withRules('Every rule is complete.', ruleIssues) }
      }
    },
    {
      code: 'RULES-2',
      title: 'Delete and Digest rules carry the evidential guard',
      description:
        'Each declared mailbox has exactly one evidential guard, and every rule whose outcome is Delete or Digest lists it, because platform filter order never protects evidential mail.',
      sources: ['standards-dodecakrisis.md#the-rules-file'],
      mechanical: {
        level: 'FAIL',
        remediation: DIAGNOSTIC_REMEDIATION,
        audit: { phase: 'PRIMARY', run: withRules('Every Delete and Digest rule is guarded.', guardIssues) }
      }
    },
    {
      code: 'RULES-3',
      title: 'every Deposit goes through a complete route',
      description:
        'Each Deposit route names its mailbox, capture folder, form (`capture` or `eml.txt`), destination and owner, and every rule whose outcome is Deposit names a declared route.',
      sources: ['standards-dodecakrisis.md#the-rules-file', 'standards-mailbox.md#deposit-routes'],
      mechanical: {
        level: 'FAIL',
        remediation: DIAGNOSTIC_REMEDIATION,
        audit: { phase: 'PRIMARY', run: withRules('Every Deposit route is complete and used.', routeIssues) }
      }
    },
    {
      code: 'RULES-4',
      title: 'D12 filters carry the D12 prefix',
      description:
        'A platform filter or rule that a D12 rule names begins with `D12`, so it is known to be under D12 management; D12 never changes an unprefixed one.',
      sources: ['standards-dodecakrisis.md#writes-and-approvals'],
      mechanical: {
        level: 'FAIL',
        remediation: DIAGNOSTIC_REMEDIATION,
        audit: { phase: 'PRIMARY', run: withRules('Every named filter carries the D12 prefix.', filterIssues) }
      }
    }
  ]
} satisfies RubricFamily<DodecakrisisContext, DodecakrisisContext>
