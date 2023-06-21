import type { Effect } from './types'

export const activeEffect: Record<'value', Effect | null> = {
  value: null,
}
