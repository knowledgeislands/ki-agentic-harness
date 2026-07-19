import { judgment, mechanical } from './common.ts'
export const ENACT_1 = mechanical(
  'ENACT-1',
  'proposal frontmatter',
  'Each proposal declares status, priority, and dependencies in closed frontmatter.',
  'WARN'
)
export const ENACT_2 = mechanical(
  'ENACT-2',
  'lifecycle status and priority',
  'Proposal status and priority are bare tokens from the controlled vocabularies.',
  'WARN',
  true
)
export const ENACT_3 = judgment(
  'ENACT-3',
  'Governance section',
  'Every stream note declares and links its bound process note.',
  'Do sampled stream notes carry an appropriate Governance section?'
)
export const ENACT_4 = judgment(
  'ENACT-4',
  'index accuracy',
  'Focus and proposal indexes match the live streams and statuses.',
  'Do indexes accurately reflect live streams and statuses?'
)
export const ENACT_5 = judgment(
  'ENACT-5',
  'completed-proposal settlement',
  'Completed proposals are deleted after their output reaches a canonical zone.',
  'Have completed proposals been deleted only after their output settled into the appropriate store?'
)
export const ENACT = [ENACT_1, ENACT_2, ENACT_3, ENACT_4, ENACT_5] as const
