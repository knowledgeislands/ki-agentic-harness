import { expect, test } from 'bun:test'
import definition from './index.ts'

test('the catalogue contains the packet and background-run criteria', () => {
  const items = definition.families.flatMap((family) => family.items as readonly unknown[]) as readonly {
    code: string
    mechanical?: { remediation: { class: string } }
  }[]
  expect(items.map((item) => item.code)).toEqual(['PACKET-1', 'RUN-1', 'RUN-2', 'RUN-3', 'RUN-4'])
  expect(items[0]?.mechanical?.remediation.class).toBe('guarded')
})
