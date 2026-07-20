import type { AgentsRubricContext } from '../contexts/agents.ts'
import { forAgents } from './common.ts'
import { MODEL_ALIASES } from './constants.ts'

const FRONTMATTER_ITEMS = [
  {
    code: 'FM-1',
    title: 'Least-privilege tools',
    description: 'tools and disallowedTools are least-privilege for the role.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'standards.md#8-tools--model', 'CC', 'BP'],
    judgment: {
      prompt:
        '`tools` / `disallowedTools`, if set, is least-privilege — only what the role needs (omitting inherits all, the wrong default for a narrow role). An advisory agent carries no write/exec tools.'
    }
  },
  {
    code: 'FM-2',
    title: 'Deliberate model choice',
    description: 'model is inherited by default or deliberately pinned to a portable Claude alias with a stated reason.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'standards.md#8-tools--model', 'CC', 'BP'],
    judgment: {
      prompt:
        '`model` is deliberate: `inherit` by default, a pin (a Claude alias `sonnet` / `opus` / `haiku` / `fable`, not a rot-prone full id) only with a stated reason. The reason should trace to the portable model type the role needs (`fast` / `standard` / `reasoning` / `frontier` — `ki-tokenomics`, ADR-KI-HARNESS-009), of which the alias is this runtime’s resolution.'
    }
  },
  {
    code: 'FM-3',
    title: 'Current frontmatter fields',
    description: 'Every frontmatter field belongs to the current subagents specification.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt:
        'Every frontmatter field is in the current subagents spec set — `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt`. A field outside this set is flagged as a portability risk.'
    }
  },
  {
    code: 'FM-4',
    title: 'Deliberate permission mode',
    description: 'permissionMode is deliberate and bypassPermissions carries a stated reason.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt: '`permissionMode`, if set, is deliberate, and `bypassPermissions` (which skips permission prompts) carries a stated reason.'
    }
  },
  {
    code: 'FM-5',
    title: 'Deliberate skill preload',
    description: 'skills preloads only standards the role must always have before acting.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt:
        '`skills`, if set, preloads a named skill’s full content at startup — use only when the role must always have that standard before acting and runtime discovery would be fragile. For optional or situational context, prefer grounding-at-runtime.'
    }
  },
  {
    code: 'FM-6',
    title: 'Deliberate memory',
    description: 'memory is set only when the role genuinely needs cross-session accumulation.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt:
        '`memory`, if set (`user` / `project` / `local`), enables cross-session accumulation — set only when the role genuinely needs state across sessions; the system prompt should describe what to learn and how to apply it.'
    }
  },
  {
    code: 'FM-7',
    title: 'Scoped hooks',
    description: 'hooks enforce invariants local to the subagent; workspace rules remain project-level.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC', 'COM2'],
    judgment: {
      prompt:
        '`hooks`, if set, are scoped to this subagent — use for invariants local to this role. Prefer project-level `settings.json` hooks for workspace-wide rules; state the invariant each scoped hook enforces.'
    }
  },
  {
    code: 'FM-8',
    title: 'Deliberate reasoning effort',
    description: 'effort is pinned only when the role benefits from a deliberate reasoning level.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt:
        '`effort`, if set, pins reasoning effort for this agent — `low` for mechanical/high-volume roles; `high`+ for deep-analysis roles where extra reasoning is load-bearing. Prefer inheriting when the session effort is appropriate.'
    }
  },
  {
    code: 'FM-9',
    title: 'Deliberate worktree isolation',
    description: 'isolation: worktree is used only for file-editing roles whose changes could conflict.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt:
        '`isolation: worktree`, if set, runs the agent in a fresh git worktree — use only when the role makes file edits that could conflict with the caller’s working tree; do not use it for read-only or advisory roles.'
    }
  },
  {
    code: 'FM-10',
    title: 'Deliberate background execution',
    description: 'background: true is used only when the caller need not wait for the result.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt:
        '`background: true`, if set, always runs the agent as a non-blocking background task — use when the caller does not need to wait for the result; otherwise omit it.'
    }
  },
  {
    code: 'FM-11',
    title: 'Tier-agnostic model',
    description: 'model is omitted, inherit, or a portable Claude alias rather than a full model ID.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'BP', 'HOUSE'],
    mechanical: {
      level: 'FAIL',
      overrideLevels: ['WARN'],
      audit: {
        phase: 'INSPECT',
        run: (context: AgentsRubricContext) =>
          forAgents(
            context,
            (agent) => {
              const model = agent.frontmatter.keys.get('model')
              if (model === undefined || model === '' || model === 'inherit')
                return [{ status: 'PASS', message: 'model is tier-agnostic.', subject: agent.file }]
              if (MODEL_ALIASES.includes(model as (typeof MODEL_ALIASES)[number]))
                return [
                  {
                    status: 'VIOLATION',
                    level: 'WARN',
                    message: `model: ${model} pins a Claude alias — acceptable only with a stated reason (FM-2); prefer inherit for model-agnosticism.`,
                    subject: agent.file
                  }
                ]
              return [
                {
                  status: 'VIOLATION',
                  message: `model: ${model} is a rot-prone full model id — prefer an alias (${MODEL_ALIASES.join('/')}) or inherit.`,
                  subject: agent.file
                }
              ]
            },
            'No agent definitions require model checks.'
          )
      }
    }
  }
] as const

export const FM_1 = FRONTMATTER_ITEMS[0]
export const FM_2 = FRONTMATTER_ITEMS[1]
export const FM_3 = FRONTMATTER_ITEMS[2]
export const FM_4 = FRONTMATTER_ITEMS[3]
export const FM_5 = FRONTMATTER_ITEMS[4]
export const FM_6 = FRONTMATTER_ITEMS[5]
export const FM_7 = FRONTMATTER_ITEMS[6]
export const FM_8 = FRONTMATTER_ITEMS[7]
export const FM_9 = FRONTMATTER_ITEMS[8]
export const FM_10 = FRONTMATTER_ITEMS[9]
export const FM_11 = FRONTMATTER_ITEMS[10]
export const FRONTMATTER = [FM_1, FM_2, FM_3, FM_4, FM_5, FM_6, FM_7, FM_8, FM_9, FM_10, FM_11] as const
