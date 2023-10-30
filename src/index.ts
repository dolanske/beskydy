import { createApp } from './scope'

export {
  createScope,
  Beskydy,
  createApp,
} from './scope'

export type {
  Directive,
  Primitive,
  EventModifierFn,
} from './directives'

export type {
  ModelModifierFn,
} from './directives/x-model'

const app = createApp()
app.start()

setTimeout(() => {
  app.teardown()
}, 1000)
