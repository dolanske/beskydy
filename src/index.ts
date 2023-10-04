import { Beskydy } from './scope'

export {
  createScope,
  Beskydy,
} from './scope'

export type {
  Directive,
  Primitive,
  EventModifierFn,
} from './directives'

export type {
  ModelModifierFn,
} from './directives/x-model'

const app = Beskydy()
app.start()
