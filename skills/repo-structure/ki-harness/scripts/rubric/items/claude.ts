const CLAUDE_ITEMS = [
  {
    code: 'CLAUDE-1',
    title: 'Harness introduction',
    description: 'The root orientation opens by explaining the harness and naming all five parts.',
    sources: ['standards.md#claudemd'],
    judgment: {
      prompt: 'Read the effective root orientation and assess whether its introduction explains the harness and names all five parts.'
    }
  },
  {
    code: 'CLAUDE-2',
    title: 'Five-part status',
    description: 'The root orientation gives a current status for every harness part.',
    sources: ['standards.md#claudemd'],
    judgment: { prompt: 'Compare the orientation status table or equivalent block with the five actual harness directories.' }
  },
  {
    code: 'CLAUDE-3',
    title: 'Working conventions',
    description: 'The root orientation routes working conventions for every harness part.',
    sources: ['standards.md#claudemd'],
    judgment: { prompt: 'Assess whether each harness part has concise, usable working guidance or a route to its governing skill.' }
  },
  {
    code: 'CLAUDE-4',
    title: 'Toolchain commands',
    description: 'The root orientation lists the key harness toolchain commands.',
    sources: ['standards.md#claudemd'],
    judgment: { prompt: 'Verify that the documented commands cover the current project-copy and skill-audit entry points.' }
  },
  {
    code: 'CLAUDE-5',
    title: 'Orientation freshness',
    description: 'Counts, shelf statuses, and command names in the orientation match the repository.',
    sources: ['standards.md#claudemd'],
    judgment: { prompt: 'Compare orientation claims with package.json, skills/, and the five harness shelves for stale facts.' }
  }
] as const

export const CLAUDE_1 = CLAUDE_ITEMS[0]
export const CLAUDE_2 = CLAUDE_ITEMS[1]
export const CLAUDE_3 = CLAUDE_ITEMS[2]
export const CLAUDE_4 = CLAUDE_ITEMS[3]
export const CLAUDE_5 = CLAUDE_ITEMS[4]
export const CLAUDE = [CLAUDE_1, CLAUDE_2, CLAUDE_3, CLAUDE_4, CLAUDE_5] as const
