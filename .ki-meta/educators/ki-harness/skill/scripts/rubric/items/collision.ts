const COLLISION_ITEMS = [
  {
    code: 'COLL-1',
    title: 'Composition boundary',
    description: 'AUDIT names its composed sibling checks and the description provides contents-governing off-ramps.',
    sources: ['standards.md'],
    judgment: { prompt: 'Review the AUDIT composition list and description off-ramps for complete, non-overlapping ownership.' }
  }
] as const
export const COLL_1 = COLLISION_ITEMS[0]
export const COLLISION = [COLL_1] as const
