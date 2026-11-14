import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createMeetingSession, type MeetingContext } from '../contexts/meeting.ts'
import { MEETING } from './meeting.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-meeting',
  concern: 'how a meeting is called, held and closed',
  createSession: createMeetingSession,
  families: [RUBRIC, MEETING]
} satisfies SkillRubricDefinition<MeetingContext>
