import type { ContextAny } from '../context'

export type Directive = (
  ctx: ContextAny,
  node: Element,
  attr: Attr,
) => void

export const customDirectives: Record<string, Directive> = {}

export interface ModifierListenerState {
  calledTimes: number
  lastCall: number
}

export type Primitive = string | number | null | undefined | boolean

export interface Modifier {
  key: string
  param: Primitive
}

export type ModifierFn = (e: Event, state: ModifierListenerState, parameter: Primitive) => boolean
