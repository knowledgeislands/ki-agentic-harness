import { judgment } from './common.ts'

export const ROUTE_1 = judgment(
  'ROUTE-1',
  'notes follow the routing test',
  'Notes are placed in the zone selected by their time-bound, active-work, settled-knowledge, or external-reference role.',
  'Does each sampled note sit in the zone selected by the routing test?'
)
export const ROUTE = [ROUTE_1] as const
