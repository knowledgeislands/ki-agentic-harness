import { judgment, type RubricFamily, type RubricItem } from '../../shared/rubric.ts'
import type { HousekeepingContext } from '../contexts/housekeeping.ts'

const HOUSE_1: RubricItem<HousekeepingContext> = {
  code: 'HOUSE-1',
  title: 'native memory is an explicit policy',
  description:
    "A repository declaring a runtime housekeeping skill sets `auto_memory` to disabled, transition or enabled; transition is closed once its notes are routed, and enabled has the owner's express approval and a project-scoped opt-in.",
  sources: ['standard-housekeeping.md#41-native-memory-policy'],
  judgment: judgment(
    'Is the native-memory policy explicit, any transition being closed, and any enabled memory approved and opted in?'
  )
}

const HOUSE_2: RubricItem<HousekeepingContext> = {
  code: 'HOUSE-2',
  title: 'durable learning goes into reviewed guidance',
  description:
    'Durable learning is routed into reviewed repository guidance or knowledge-base notes, never kept in native memory, and no repair creates or deletes a memory.',
  sources: ['standard-housekeeping.md#42-durable-learning'],
  judgment: judgment('Has durable learning been routed into reviewed guidance rather than kept in native memory?')
}

const HOUSE_3: RubricItem<HousekeepingContext> = {
  code: 'HOUSE-3',
  title: 'session sources stay read-only',
  description:
    "Housekeeping keeps only a content-minimised inventory of sessions; reading a session's knowledge is left to acquisition, and discovery or checkpoint evidence grants no capture, harvest or retirement authority.",
  sources: ['standard-housekeeping.md#43-session-sources'],
  judgment: judgment(
    'Did housekeeping keep to a content-minimised inventory, leaving capture and retirement to their own authority?'
  )
}

const HOUSE_4: RubricItem<HousekeepingContext> = {
  code: 'HOUSE-4',
  title: 'evidence and authority are bounded',
  description:
    'State is read only from the exact selected location, missing evidence is reported as unavailable, managed settings are never changed as a repair, and each deletion has separate, explicit authority.',
  sources: ['standard-housekeeping.md#44-bounded-evidence-and-authority'],
  judgment: judgment(
    'Was evidence read only from its selected location, and did every deletion have its own explicit authority?'
  )
}

export const HOUSE: RubricFamily<HousekeepingContext, HousekeepingContext> = {
  code: 'HOUSE',
  title: 'Shared housekeeping',
  description:
    'Native memory is an explicit policy, durable learning goes into reviewed guidance, session sources stay read-only, and evidence and authority are bounded.',
  standard: 'standard-housekeeping.md',
  selectContext: (context) => context,
  items: [HOUSE_1, HOUSE_2, HOUSE_3, HOUSE_4]
}
