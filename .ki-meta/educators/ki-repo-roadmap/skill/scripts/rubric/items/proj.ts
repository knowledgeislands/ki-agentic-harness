import { mechanical } from './common.ts'
export const PROJ_1 = mechanical(
  'PROJ-1',
  'root portfolio projection',
  'The thematic root `ROADMAP.md` exactly matches the generated linked portfolio and repeats no item prose.',
  'FAIL',
  true
)
export const PROJ = [PROJ_1] as const
