import { judgment, mechanical } from './shared.ts'
export const BUDG_1 = mechanical('BUDG-1', 'Component budgets are compared', 'Each component is compared with its declared budget.')
export const BUDG_2 = mechanical('BUDG-2', 'Total budget is compared', 'The standing total is compared with the total budget.')
export const BUDG_3 = judgment('BUDG-3', 'Overages are deliberate', 'Is a sustained overage fixed or deliberately recorded?')
export const BUDG = [BUDG_1, BUDG_2, BUDG_3] as const
