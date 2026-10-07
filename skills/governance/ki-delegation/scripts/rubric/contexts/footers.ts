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
  push: 'push your own commits fast-forward only',
  prune: 'Deleting work records is authorised',
  release: 'Release calls are authorised only as the task names them'
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

export const footerOutcomes = (directory: string = defaultAssetsDirectory): AuditOutcome[] =>
  AUTHORITY_TIERS.flatMap((tier) => tierOutcomes(directory, tier))
