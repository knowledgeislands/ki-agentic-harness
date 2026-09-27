/*
 * Scenarios for the `ki-specs` skill — the behaviour-level "what" of a
 * system. Design note: a baseline model gives generic requirements advice ("write user
 * stories", "use MoSCoW", "put them in a PRD"). These scenarios target the house-ARBITRARY
 * specifics a baseline cannot guess: the `docs/specs/` layout with an areas table, the
 * `### <PREFIX>-NNN — title` + BCP 14 + `_Verify:_` requirement shape, append-only IDs,
 * and the unnumbered `## Gaps` backlog that sits outside the as-built contract.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-specs',
    id: 'specs-requirement-shape',
    prompt:
      'I want to write down a single behaviour our system has — that an indexable page emits a canonical URL — as a formal specification in our house format. What exactly does one requirement look like, and what must each one carry?',
    assertions: [
      { name: 'PREFIX-NNN heading', re: /<?PREFIX>?-?\d|[A-Z]{2,}-\d{3}|heading.*id|### /i },
      { name: 'BCP 14 keyword', re: /MUST|SHOULD|MAY|BCP.?14|RFC.?2119|normative/i },
      { name: 'Verify hook', re: /_?verify_?|verification hook|test hook/i },
      { name: 'lives in docs/specs', re: /docs\/specs|specs\//i }
    ],
    rubric:
      'House fact: a requirement is a level-3 heading `### <PREFIX>-NNN — <title>`, followed by an opening statement paragraph with an uppercase BCP 14 keyword (MUST/SHOULD/MAY) and a **`_Verify:_`** line naming the concrete check. Files live in `docs/specs/`, flat one-file-per-area, registered by prefix in an `index.md` areas table. A correct answer produces the heading-with-ID shape, requires the keyword in the statement rather than only in verification or evidence, and requires the `_Verify:_` hook — not a generic user-story or acceptance-criteria template.'
  },
  {
    skill: 'ki-specs',
    id: 'specs-append-only-ids',
    prompt:
      "We're cleaning up our specification. Requirement AUTH-004 was retired, leaving a gap in the numbering, and the IDs feel messy. Can I renumber the remaining requirements to tidy the sequence, and what happens to a retired requirement's number?",
    assertions: [
      { name: 'append-only / never reuse', re: /append.?only|never reuse|do not reuse|not renumber|never renumber/i },
      { name: 'keep the retired number', re: /keep.*number|retain.*id|deprecated|struck/i }
    ],
    rubric:
      'House fact: IDs are **append-only and never reused**. Do **not** renumber to tidy up — a retired requirement keeps its number, struck through with a `(deprecated)` note, so tests, commits, and cross-references stay valid over time. A correct answer refuses the renumber and says the retired ID is kept (deprecated), not recycled.'
  },
  {
    skill: 'ki-specs',
    id: 'specs-gaps-backlog',
    prompt:
      'There is a behaviour we want our system to have but have not built yet. Should I add it as a numbered requirement in the relevant specification file so we do not forget it?',
    assertions: [
      {
        name: 'not a numbered requirement yet',
        re: /not.*(numbered|requirement)|don.?t (number|add).*requirement|unnumbered/i
      },
      { name: 'goes in Gaps', re: /##?\s*gaps|gaps section|gaps backlog/i },
      { name: 'as-built only / promote when true', re: /as.?built|once.*built|when.*(built|true)|promote/i }
    ],
    rubric:
      "House fact: the numbered contract is **as-built** — it describes what the system does **today**. A not-yet-built behaviour belongs in the file's **unnumbered `## Gaps`** backlog, which sits outside the as-built contract; it is **promoted** to a numbered requirement only once it is built and true. A correct answer keeps it out of the numbered set and puts it in `## Gaps`."
  }
]
