import { mechanical } from './common.ts'

export const ZONE_1 = mechanical(
  'ZONE-1',
  'required zone layout',
  'Calendar/, Pillars/, Resources/, Streams/, and Admin/ are present, resolving each through a declared zone alias.',
  'FAIL'
)
export const ZONE_2 = mechanical('ZONE-2', 'same-name zone indexes', 'Each present zone has its same-name index note.', 'WARN', true)
export const ZONE_3 = mechanical('ZONE-3', 'root memory index', 'The resolved Admin zone carries MEMORY.md.', 'FAIL', true)
export const ZONE_4 = mechanical(
  'ZONE-4',
  'staging areas are not zones',
  '+/ and -/ are reported as staging only and are exempt from the zone-index rule.',
  'WARN'
)
export const ZONE_5 = mechanical(
  'ZONE-5',
  'produced outputs use outbound staging',
  'Notes with type session-digest or handoff reside under the resolved -/ staging area.',
  'FAIL'
)
export const ZONE = [ZONE_1, ZONE_2, ZONE_3, ZONE_4, ZONE_5] as const
