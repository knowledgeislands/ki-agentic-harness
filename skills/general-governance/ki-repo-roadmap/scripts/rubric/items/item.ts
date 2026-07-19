import { mechanical } from './common.ts'
export const ITEM_1 = mechanical(
  'ITEM-1',
  'unique qualified item locator',
  'Each thematic item has one unique qualified `<theme>/<item-slug>` locator. Duplicate derived locators fail.'
)
export const ITEM = [ITEM_1] as const
