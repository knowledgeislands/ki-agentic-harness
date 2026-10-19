/**
 * Eval scenarios for the `ki-subagents` skill — the subagent rubric.
 * `agents` is a SHAPE skill (it judges a definition's form, not a body of facts),
 * so these target house-ARBITRARY conventions it owns that a skill-less baseline
 * can't derive — and, where possible, ones that CONTRADICT generic best practice
 * (omitting `tools` is the wrong default) so the baseline
 * can't guess its way to the answer.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    // Grounded citations follow the GFM preference; existing KB wikilinks remain readable.
    skill: 'ki-subagents',
    id: 'agents-wikilinks',
    prompt:
      'A portable Knowledge Islands subagent role cites KB notes. What link form should I prefer, and should existing wikilinks be rejected merely for their syntax?',
    assertions: [
      { name: 'prefers relative Markdown links', re: /relative[^.\n]{0,30}(markdown )?link/i },
      { name: 'keeps existing wikilinks supported', re: /support|tolerat|remain|not (a defect|reject)|no[^.\n]{0,30}reject/i },
      { name: 'grounds the role in sources', re: /ground|cit(e|es|ing|ation)|source/i }
    ],
    rubric:
      'A grounded role reads and cites its KB sources. Under ki-authoring and ki-repo-kb, GFM with descriptive note-relative Markdown links in angle brackets is preferred for KB citations too. Existing wikilinks remain supported and must not be rejected merely for their syntax. Do not invent an agent-versus-KB link exception or a KB wikilink mandate.'

  },
  {
    // PROMPT-2/3/5: the house system-prompt shape. Generic advice ("describe the
    // role") scores nothing here; the lift is the three HOUSE requirements.
    skill: 'ki-subagents',
    id: 'agents-prompt-shape',
    prompt:
      "Beyond a generic role description, what does the Knowledge Islands house standard require a subagent's system prompt to contain?",
    assertions: [
      {
        name: 'role & lane — what it owns AND what it does not',
        re: /lane|what it (does )?not|owns?[^.\n]{0,40}(not|does ?n.?t)/i
      },
      {
        name: 'grounding — read sources & cite, not from memory',
        re: /(ground|read|cite|citing)[^.\n]{0,40}(source|note|memory)|not[^.\n]{0,25}memory/i
      },
      {
        name: 'own-vs-defer — names the siblings it hands work to',
        re: /defer|hand.?off|hands? (work )?(off|to)|own.?vs.?defer/i
      }
    ],
    rubric:
      'House rubric (agents PROMPT-2/3/5): the system prompt opens with role & LANE (what it owns and, explicitly, what it does NOT); provides GROUNDING (names the sources it must read first and requires CITING them, not reasoning from memory); and carries an explicit OWN-VS-DEFER list naming the sibling agents it hands work to. A correct answer names the lane (owns-vs-not), grounding-with-citation, and the defer-to-siblings list.'
  },
  {
    // FM-1/FM-2: house frontmatter defaults. Contrarian hook — OMITTING `tools`
    // inherits ALL tools (the wrong default), and a pin must be an alias, not a
    // rot-prone full model id; a baseline tends to miss both.
    skill: 'ki-subagents',
    id: 'agents-model-tools',
    prompt:
      'When defining a Knowledge Islands subagent, how should the `model` and `tools` frontmatter fields be set by default, and why?',
    assertions: [
      { name: 'model inherits by default', re: /inherit/i },
      { name: 'pin by alias, not a rot-prone full id', re: /alias|sonnet|opus|haiku|fable|full[^.\n]{0,10}id|rot/i },
      {
        name: 'tools least-privilege — omitting inherits all',
        re: /least.?privilege|only what[^.\n]{0,20}need|omit[^.\n]{0,30}(inherit|all)|inherits? all/i
      }
    ],
    rubric:
      'House rubric (agents FM-1/FM-2): `model` defaults to `inherit`, and when pinned uses an ALIAS (sonnet / opus / haiku / fable), never a rot-prone full model id; `tools` / `disallowedTools` are LEAST-PRIVILEGE — only what the role needs, because OMITTING them inherits ALL tools (the wrong default). A correct answer says model = inherit by default (alias if pinned, not a full id) and tools = least-privilege (omitting inherits all).'
  }
]
