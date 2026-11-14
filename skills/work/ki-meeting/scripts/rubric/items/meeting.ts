import { judgment, type RubricFamily, type RubricItem } from '../../shared/rubric.ts'
import type { MeetingContext } from '../contexts/meeting.ts'

const MEETING_1: RubricItem<MeetingContext> = {
  code: 'MEETING-1',
  title: 'a meeting is the right channel and is called from the right node',
  description:
    "A meeting is held only where sessions cannot reach each other through their own agent host's messaging, sits at one node of the work tree with a type, a purpose and its participants, and is called by the session holding that node or one above it.",
  sources: ['standard-meeting.md#41-when-to-meet', 'standard-meeting.md#42-who-calls-keeps-and-owns-a-meeting'],
  judgment: judgment(
    'Was a meeting the first route that works, and was it called at one node by the session holding it or one above it?'
  )
}

const MEETING_2: RubricItem<MeetingContext> = {
  code: 'MEETING-2',
  title: 'the folder and its entry file keep the standard shape',
  description:
    'The meeting lives in its own folder at `meetings/<node id>/<date>-<slug>/`, holding `_index.md`, `messages/`, `brief/`, an output folder and `notes/`; `_index.md` opens with the front matter block tools read and then gives the summary, brief, agenda, boundaries, open asks and minutes.',
  sources: ['standard-meeting.md#44-where-a-meeting-is-kept', 'standard-meeting.md#45-the-entry-file'],
  judgment: judgment(
    'Does the folder hold the standard parts, and does `_index.md` carry a current front matter block followed by its six parts in order?'
  )
}

const MEETING_3: RubricItem<MeetingContext> = {
  code: 'MEETING-3',
  title: 'each participant reaches the room by the first route that works',
  description:
    "Each participant's route is stated in the agenda and is the first of the three that works: the agent host's own messaging, the meeting folder, or exchange mode only as the exception.",
  sources: ['standard-meeting.md#46-routes'],
  judgment: judgment(
    "Is each participant's route stated, and is exchange mode used only where no other route reaches the folder?"
  )
}

const MEETING_4: RubricItem<MeetingContext> = {
  code: 'MEETING-4',
  title: 'each sitting opens with a roll call and ends with its minutes',
  description:
    'Each sitting opens with a roll call in which every participant gives its clock from `date -u`, its role and the goal in its own words; the first sitting proves each route with a join check; each sitting is adjourned with its minutes and a resume note.',
  sources: ['standard-meeting.md#47-sittings-and-the-roll-call', 'standard-meeting.md#414-minutes'],
  judgment: judgment(
    'Did each sitting open with a full roll call, and end with minutes and a resume note where it was adjourned?'
  )
}

const MEETING_5: RubricItem<MeetingContext> = {
  code: 'MEETING-5',
  title: 'messages are one immutable, clock-named file each',
  description:
    "Each message is one file in `messages/`, never edited once written, named from `date -u` with its sender's role, and opens with who it is from, who it is for and what it answers, closing with its asks; the caller keeps the open asks in the entry file until each is answered.",
  sources: ['standard-meeting.md#48-messages'],
  judgment: judgment(
    'Is every message a single unedited file, named from the clock and its role, saying whom it is from and for, what it answers and what it asks?'
  )
}

const MEETING_6: RubricItem<MeetingContext> = {
  code: 'MEETING-6',
  title: 'the caller listens and checks in while the meeting is open',
  description:
    "The caller watches the whole folder while the meeting is open, the agenda states each participant's listening interval, and the caller posts a check-in every 15 minutes, which each participant answers unless it wrote in that time.",
  sources: ['standard-meeting.md#49-listening-and-check-ins'],
  judgment: judgment(
    'Did the caller listen to the whole folder, did the agenda state each interval, and were check-ins sent as the standard sets?'
  )
}

const MEETING_7: RubricItem<MeetingContext> = {
  code: 'MEETING-7',
  title: 'Git and private data are handled as the standard sets',
  description:
    "Each participant that reaches the repository commits its own files and pushes fast-forward only; the caller commits for a participant without Git or in exchange mode; store data stays in the meeting folder, and the caller's side renders anything that carries it.",
  sources: ['standard-meeting.md#412-git-and-private-data'],
  judgment: judgment(
    "Was every file committed by its writer or by the caller for one without Git, and did store data stay in the folder and on the caller's side?"
  )
}

const MEETING_8: RubricItem<MeetingContext> = {
  code: 'MEETING-8',
  title: 'decisions go to change documents, never the meeting',
  description:
    "Each decision the owner takes goes into its change document as it is taken, and each choice left to the owner is carried into that document's open questions with its recommendation; the meeting holds the conversation, never the decision, and a refusal goes to the owner rather than round it.",
  sources: ['standard-meeting.md#413-decisions', 'standard-meeting.md#414-minutes'],
  judgment: judgment(
    'Is every decision the meeting led to held in a change document, with every choice left to the owner carried there with its recommendation?'
  )
}

const MEETING_9: RubricItem<MeetingContext> = {
  code: 'MEETING-9',
  title: "the caller's last message closes the meeting",
  description:
    "The meeting closes only by the caller's last message, naming each outcome and the change document that holds it; listening then ends, the work that landed gets its record, and the folder is removed once the owner has reviewed that record.",
  sources: ['standard-meeting.md#415-closing'],
  judgment: judgment(
    'Was the meeting closed by a message naming each outcome and its change document, with listening ended and the record written?'
  )
}

export const MEETING: RubricFamily<MeetingContext, MeetingContext> = {
  code: 'MEETING',
  title: 'Meeting conduct',
  description:
    'A meeting is the right channel, kept in the standard folder, reached by the first route that works, held in sittings with roll calls, clock-named messages, listening and check-ins, careful with Git and private data, and closed with its decisions in change documents.',
  standard: 'standard-meeting.md',
  selectContext: (context) => context,
  items: [MEETING_1, MEETING_2, MEETING_3, MEETING_4, MEETING_5, MEETING_6, MEETING_7, MEETING_8, MEETING_9]
}
