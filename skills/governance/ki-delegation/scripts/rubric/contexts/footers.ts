import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AuditOutcome } from '../../shared/rubric.ts'

/** Authority tiers in grant order; each tier adds one grant to the tier before it. */
export const AUTHORITY_TIERS = ['none', 'push', 'prune', 'release'] as const

const SHARED_PROHIBITIONS = [
  '## Rules',
  'explicit paths only',
  '`--no-verify`',
  'force-push',
  'Never touch, stage or revert other uncommitted changes',
  'Do not read or print secrets',
  'stop and report rather than guess'
]

const NONE_PROHIBITIONS = ['never push', 'No remote call of any kind']

const GRANTS: Record<Exclude<(typeof AUTHORITY_TIERS)[number], 'none'>, string> = {
  push: 'push everything stacked on `main` fast-forward only',
  prune: 'Deleting work records is authorised',
  release: 'Release calls are authorised only as the task names them'
}

/** Grant sections appended after the tier footer; each lifts exactly one of the footer's bans. */
export const GRANT_NAMES = ['fetch', 'machine'] as const

/** The ban each grant lifts, then the limits it must keep. */
const GRANT_WORDING: Record<(typeof GRANT_NAMES)[number], readonly [string, ...string[]]> = {
  fetch: ["overrides only the Rules' ban on a Git fetch", 'never authorises a push'],
  machine: [
    "overrides only the Rules' ban on an environment or scheduler change",
    'Credentials stay banned',
    'connection-critical'
  ]
}

export const defaultAssetsDirectory = fileURLToPath(new URL('../../../assets', import.meta.url))

const tierOutcomes = (directory: string, tier: (typeof AUTHORITY_TIERS)[number]): AuditOutcome[] => {
  const subject = `assets/rules-${tier}.md`
  const path = join(directory, `rules-${tier}.md`)
  if (!existsSync(path))
    return [{ status: 'VIOLATION', message: `The \`${tier}\` authority footer is missing.`, subject }]
  const content = readFileSync(path, 'utf8')
  const rank = AUTHORITY_TIERS.indexOf(tier)
  const violations: AuditOutcome[] = []
  const required = [...SHARED_PROHIBITIONS, ...(tier === 'none' ? NONE_PROHIBITIONS : [])]
  for (const phrase of required)
    if (!content.includes(phrase))
      violations.push({ status: 'VIOLATION', message: `Footer lacks the required wording \`${phrase}\`.`, subject })
  for (const [grantTier, phrase] of Object.entries(GRANTS)) {
    const granted = AUTHORITY_TIERS.indexOf(grantTier as keyof typeof GRANTS) <= rank
    if (granted !== content.includes(phrase))
      violations.push({
        status: 'VIOLATION',
        message: granted
          ? `Footer omits the \`${grantTier}\` grant its tier includes.`
          : `Footer grants \`${grantTier}\`, which is above its tier.`,
        subject
      })
  }
  return violations.length
    ? violations
    : [{ status: 'PASS', message: `The \`${tier}\` footer grants exactly its tier.`, subject }]
}

const grantOutcomes = (directory: string, grant: (typeof GRANT_NAMES)[number]): AuditOutcome[] => {
  const subject = `assets/grant-${grant}.md`
  const path = join(directory, `grant-${grant}.md`)
  if (!existsSync(path)) return [{ status: 'VIOLATION', message: `The \`${grant}\` grant is missing.`, subject }]
  const content = readFileSync(path, 'utf8')
  const violations: AuditOutcome[] = []
  for (const phrase of [`## Grant: ${grant}`, 'every other line of the Rules stands', ...GRANT_WORDING[grant]])
    if (!content.includes(phrase))
      violations.push({ status: 'VIOLATION', message: `Grant lacks the required wording \`${phrase}\`.`, subject })
  for (const other of GRANT_NAMES)
    if (other !== grant && content.includes(GRANT_WORDING[other][0]))
      violations.push({ status: 'VIOLATION', message: `Grant also lifts the \`${other}\` ban.`, subject })
  for (const [tier, phrase] of Object.entries(GRANTS))
    if (content.includes(phrase))
      violations.push({ status: 'VIOLATION', message: `Grant carries the \`${tier}\` tier grant.`, subject })
  if (content.includes('Draft, not approved'))
    violations.push({ status: 'VIOLATION', message: 'Grant is still marked as an unapproved draft.', subject })
  return violations.length
    ? violations
    : [{ status: 'PASS', message: `The \`${grant}\` grant lifts only its own ban.`, subject }]
}

export const footerOutcomes = (directory: string = defaultAssetsDirectory): AuditOutcome[] => [
  ...AUTHORITY_TIERS.flatMap((tier) => tierOutcomes(directory, tier)),
  ...GRANT_NAMES.flatMap((grant) => grantOutcomes(directory, grant))
]
