import { isObj } from '../helpers'
import { type Directive, preProcessDirective } from '.'

export const processStyle: Directive = function (ctx, node, { value, name }) {
  preProcessDirective(ctx, node, name, value)

  const expr = value

  ctx.effect(() => {
    const result = evaluate(ctx.$data, expr, node)

    if (!isObj(result))
      return

    for (const key of Object.keys(result)) {
      // If it's a non HTMLElement node, skip it
      if (!Reflect.has(node, 'style'))
        continue

      // Using reflect set allows us using camelCase and kebab-case styles
      Reflect.set((node as HTMLElement).style, key, result[key])
    }
  })
}
