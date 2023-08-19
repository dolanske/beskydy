import { isObj } from '../helpers'
import type { Directive } from '.'

export const processClass: Directive = function (ctx, node, { value }) {
  const assignObjectClasses = (parsed: Record<string, unknown>) => {
    for (const key of Object.keys(parsed)) {
      if (parsed[key])
        node.classList.add(key)
      else
        node.classList.remove(key)
    }
  }

  if (value.startsWith('[')) {
    // Evaluate Should receive an array of strings or objects. Iterate on it and
    // call either of the process functions
    const prevInlineResults: Record<number, string | null> = Object.create(null)

    ctx.effect(() => {
      const results = evaluate(ctx.$data, value)

      for (let i = 0; i < results.length; i++) {
        const result = results[i]

        if (!result) {
          const prevResult = prevInlineResults[i]

          if (prevResult) {
            node.classList.remove(prevResult)
            prevInlineResults[i] = null
          }
        }
        else if (typeof result === 'string') {
          node.classList.add(result)
          prevInlineResults[i] = result
        }
        else if (isObj(result)) {
          assignObjectClasses(result)
        }
      }
    })
  }
  else if (value.startsWith('{') && value.endsWith('}')) {
    // Processes object expression. If the value is truthy, the key will be
    // assigned as a classname
    // Eg: { className: expression, display: isVisible }
    ctx.effect(() => {
      const parsed: Record<string, unknown> = evaluate(ctx.$data, value, node)
      assignObjectClasses(parsed)
    })
  }
  else {
    // Processes inline ternary operator expression
    // Eg: "value ? 'class' : null"
    let previous: string
    ctx.effect(() => {
      if (previous)
        node.classList.remove(previous)

      previous = evaluate(ctx.$data, value, node)
      node.classList.add(previous)
    })
  }
}
