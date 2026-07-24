type NativeContext = {
  readonly repository: string
  readonly capability: {
    readonly name: string
  }
}

type CheckerFinding = {
  readonly level: string
  readonly code: string
  readonly message: string
  readonly subject?: string
}

type CheckerResult = {
  readonly findings: readonly CheckerFinding[]
}

type Audit = (context: NativeContext) => CheckerResult

import { check as authoring } from '../skills/foundations/ki-authoring/scripts/govern.ts'
import { check as engineering } from '../skills/foundations/ki-engineering/scripts/govern.ts'
import { check as agents } from '../skills/general-governance/ki-agents/scripts/govern.ts'
import { check as decisionRecords } from '../skills/general-governance/ki-decision-records/scripts/govern.ts'
import { check as featureDefinitions } from '../skills/general-governance/ki-feature-definitions/scripts/govern.ts'
import { check as handoffs } from '../skills/general-governance/ki-handoffs/scripts/govern.ts'
import { check as roadmap } from '../skills/general-governance/ki-repo-roadmap/scripts/govern.ts'
import { check as housekeeping } from '../skills/environment/ki-housekeeping/scripts/govern.ts'
import { check as tokenomics } from '../skills/environment/ki-tokenomics/scripts/govern.ts'
import { check as repository } from '../skills/keystone/ki-repo/scripts/govern.ts'
import { check as skills } from '../skills/keystone/ki-skills/scripts/govern.ts'
import { check as harness } from '../skills/repo-structure/ki-harness/scripts/govern.ts'

const simple = (check: (mode: 'audit', options: { target: string; dryRun: boolean }) => CheckerResult): Audit => (context) =>
  check('audit', { target: context.repository, dryRun: false })

const audits: Readonly<Record<string, Audit>> = {
  'ki-agents': (context) => agents('audit', { target: context.repository, dryRun: false, arguments_: [context.repository] }),
  'ki-authoring': simple(authoring),
  'ki-decision-records': simple(decisionRecords),
  'ki-engineering': simple(engineering),
  'ki-feature-definitions': simple(featureDefinitions),
  'ki-handoffs': simple(handoffs),
  'ki-harness': simple(harness),
  'ki-housekeeping': (context) => housekeeping('audit', { target: context.repository, dryRun: false, arguments_: [context.repository] }),
  'ki-repo': (context) => repository('audit', { target: context.repository, dryRun: false, arguments_: [context.repository] }),
  'ki-repo-roadmap': simple(roadmap),
  'ki-skills': (context) => skills('audit', { target: context.repository, roots: [context.repository], dryRun: false }),
  'ki-tokenomics': simple(tokenomics)
}

export const audit = (context: NativeContext): readonly { readonly level: 'fail' | 'warn' | 'info'; readonly code: string; readonly message: string }[] => {
  const operation = audits[context.capability.name]
  if (!operation) throw new Error(`${context.capability.name} does not provide a native audit operation`)
  return operation(context).findings.flatMap((finding) => {
    const level = finding.level === 'FAIL' ? 'fail' : finding.level === 'WARN' ? 'warn' : finding.level === 'INFO' ? 'info' : undefined
    return level ? [{ level, code: finding.code, message: finding.subject ? `${finding.subject}: ${finding.message}` : finding.message }] : []
  })
}
