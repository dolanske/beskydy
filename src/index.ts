import { createApp, setDelimiters } from './scope'

export {
  createScope,
  Beskydy,
  createApp,
  globalState,
  defineDirective,
  defineModelModifier,
  defineEventModifier,
  setDelimiters,
} from './scope'

export type {
  Directive,
  Primitive,
  EventModifierFn,
} from './directives'

export type {
  ModelModifierFn,
} from './directives/x-model'

setDelimiters('[[', ']]')
createApp().init()
