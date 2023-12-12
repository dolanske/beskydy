import { evaluate } from '../evaluate'
import type { ContextAny } from '../context'
import type { Directive } from './directives'

/**
 * Runs provided callback each time the context dataset is updated
 */
export const processSpy: Directive = function (ctx, node, { name, value }) {
  // Check wether we are spyng on specific keys in the context dataset
  const [_, ...spyOnParams] = name.split(':')

  let firstFired = false

  // Store previously saved dataset to compare values when we're spying on specific properties
  let previousData: ContextAny['data'] = Object.create(null)

  ctx.effect(() => {
    // Ignore first fire as that's when the scope is registered
    // if (!firstFired) {
    //   firstFired = true
    //   return
    // }

    if (spyOnParams.length > 0) {
      for (const key of spyOnParams) {
        if (Reflect.get(previousData, key) !== Reflect.get(ctx.data, key)) {
          evaluate(ctx.data, value, node)
          break
        }
      }

      previousData = { ...ctx.data }
    }
    else {
      evaluate(ctx.data, value, node)
    }
  })
}
