const CAPABILITY_ITEMS = [
  {
    code: 'CAP-1',
    title: 'Capability inventory and boundaries',
    description:
      'Each populated harness shelf makes its typed capabilities discoverable and routes their content and runtime semantics to the owning kind standard.',
    sources: ['standards.md#capability-publication'],
    judgment: {
      prompt:
        'Review each populated shelf: are its capabilities discoverable as a typed harness inventory, and are kind-specific semantics delegated to the appropriate standard?'
    }
  }
] as const

export const CAP_1 = CAPABILITY_ITEMS[0]
export const CAPABILITIES = [CAP_1] as const
