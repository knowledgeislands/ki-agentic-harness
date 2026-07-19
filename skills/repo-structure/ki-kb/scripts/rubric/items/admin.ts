import { mechanical } from './common.ts'

export const ADMIN_1 = mechanical(
  'ADMIN-1',
  'optional Admin subdivisions',
  'When Governance/ or Operations/ is active, it has its same-name index; absent subdivisions warn only.',
  'WARN'
)
export const ADMIN_2 = mechanical('ADMIN-2', 'governance charter', 'An active Admin/Governance/ directory carries Charter.md.', 'WARN')
export const ADMIN_3 = mechanical(
  'ADMIN-3',
  'governance conformance record',
  'An active Admin/Governance/ directory carries Conformance.md.',
  'WARN'
)
export const ADMIN = [ADMIN_1, ADMIN_2, ADMIN_3] as const
