import { mechanical } from './common.ts'

export const SCOPE_1 = mechanical('SCOPE-1', 'KB scope', 'KB repositories use `ki-kb-streams`; repository-roadmap artifacts in a KB fail, while a KB without them is not applicable.', 'FAIL')
export const SCOPE = [SCOPE_1] as const
