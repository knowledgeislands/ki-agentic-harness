import type { RubricItem } from '../../lib/rubric/rubric.ts'
import type { CollisionRubricContext } from '../contexts/contexts.ts'

const triggerPhrases = (description: string): string[] => {
  const phrases = new Set<string>()
  const quoted = /"([^"]{2,})"/g
  let match: RegExpExecArray | null
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex-exec loop
  while ((match = quoted.exec(description)) !== null) {
    const phrase = (match[1] as string).toLowerCase().replace(/\s+/g, ' ').trim()
    if (phrase) phrases.add(phrase)
  }
  return [...phrases]
}

export const COLL_1: RubricItem<CollisionRubricContext> = {
  code: 'COLL-1',
  title: 'quoted trigger phrases are not shared across skills',
  description: 'A set of skills does not declare the same quoted trigger phrase in more than one description.',
  sources: ['COMMUNITY', 'KI'],
  audit: ({ targets }) => {
    const byPhrase = new Map<string, Set<string>>()
    for (const target of targets)
      for (const phrase of triggerPhrases(target.description)) {
        if (!byPhrase.has(phrase)) byPhrase.set(phrase, new Set())
        byPhrase.get(phrase)?.add(target.name)
      }
    return [...byPhrase]
      .filter(([, skills]) => skills.size > 1)
      .map(([phrase, skills]) => ({
        type: 'M' as const,
        level: 'WARN' as const,
        code: COLL_1.code,
        message: `trigger "${phrase}" is shared by ${[...skills].sort().join(', ')} — confirm each names the other as an off-ramp (COLL-2)`
      }))
      .sort((left, right) => left.message.localeCompare(right.message))
  }
}

export const COLL_2: RubricItem = {
  code: 'COLL-2',
  title: 'adjacent skills have non-overlapping scope and reciprocal off-ramps',
  description: 'Adjacent skills are designed not to compete and name reciprocal off-ramps where adjacency remains.',
  sources: ['COMMUNITY', 'KI'],
  judgment: {
    prompt: 'Do adjacent skills have non-overlapping scopes and reciprocal off-ramps where their requests are genuinely adjacent?'
  }
}

export const COLLISION: readonly RubricItem<CollisionRubricContext>[] = [COLL_1, COLL_2]
