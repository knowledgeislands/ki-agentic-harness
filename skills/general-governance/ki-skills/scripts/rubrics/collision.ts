import type { RubricItem } from '../lib/rubric/rubric.ts'

export const COLL_1: RubricItem = {
  code: 'COLL-1',
  title: 'quoted trigger phrases are not shared across skills',
  description: 'A set of skills does not declare the same quoted trigger phrase in more than one description.',
  sources: ['COMMUNITY', 'KI']
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

export const COLLISION: readonly RubricItem[] = [COLL_1, COLL_2]
