/**
 * Eval scenarios for the `ki-kb-activities` skill — Activity notes, the
 * operational record of what automation a base has adopted.
 *
 * Design note: a baseline invents generic "automation doc" fields. These
 * scenarios target house-ARBITRARY specifics: the realization-typed frontmatter
 * (slash-command needs a `skill:`; scheduled-task needs `schedule_name` and only
 * WARNs on external registration), and the fixed Activities.md index location.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-kb-activities',
    id: 'act-slash-skill',
    prompt:
      "I'm adding an Activity note to our base for our `/weekly-digest` slash command. What should go in the note's frontmatter so it's conformant?",
    assertions: [
      { name: 'realization key', re: /realization/i },
      { name: 'slash-command type', re: /slash-command/i },
      { name: 'skill field naming the SKILL.md', re: /skill:/i },
      { name: 'lives under Activities folder', re: /Admin\/Operations\/Activities/i }
    ],
    rubric:
      'House fact: an Activity with `realization: slash-command` must declare `skill: <skill-name>`, which has to match a SKILL.md `name:` in the harness (the checker verifies the skill exists). A correct answer sets `realization: slash-command` and adds a `skill:` key naming the backing skill — not a generic "command" or "path" field.'
  },
  {
    skill: 'ki-kb-activities',
    id: 'act-scheduled-register',
    prompt:
      'Register our nightly inbox-triage automation as a scheduled-task activity. What does the activity note need, and is there anything the audit cannot confirm?',
    assertions: [
      { name: 'scheduled-task type', re: /scheduled-task/i },
      { name: 'schedule_name field', re: /schedule_name/i },
      { name: 'schedule_env field', re: /schedule_env/i },
      { name: 'external registration not verifiable', re: /regist|WARN|advisor|manual|cannot verify/i }
    ],
    rubric:
      'House fact: `realization: scheduled-task` requires `schedule_name` and `schedule_env` (e.g. `cowork`); the checker cannot verify registration in an external scheduler, so it only WARNs if `schedule_name` is absent and emits an ADVISORY that the job must be registered manually. A correct answer adds those fields and flags that external registration is not machine-verifiable.'
  },
  {
    skill: 'ki-kb-activities',
    id: 'act-index',
    prompt:
      'Where do activity notes live in an Islands base, and how does someone get the full list of what automations the base has adopted?',
    assertions: [
      { name: 'activities folder path', re: /Admin\/Operations\/Activities/i },
      { name: 'Activities.md index', re: /Activities\.md/ },
      { name: 'realization recorded', re: /realization/i },
      { name: 'status recorded', re: /status/i }
    ],
    rubric:
      'House fact: activity notes live at `Admin/Operations/Activities/<Activity Name>.md` and are indexed by `Admin/Operations/Activities/Activities.md` (the audit checks the index exists when any activity note is found). A correct answer names the `Admin/Operations/Activities/` folder and the `Activities.md` index note — not a README, a tag search, or a `Pillars/` location.'
  }
]
