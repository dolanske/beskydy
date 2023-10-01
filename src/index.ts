import { evaluate } from './evaluate'
import { createApp } from './scope'

export {
  createScope,
  createApp,
} from './scope'

const app = createApp()

app.defineModelModifier('maxlength', (newVal, oldVal, length) => {
  // TODO: make sure that if the `length` is changed. On next input the value is truncated to length
  return newVal.length <= (length as number) ? newVal : oldVal
})

app.init()
