/**
 *
 */

import { evaluate } from '../evaluate'
import { watchStack } from '../reactivity/stack'
import { isObj } from '../util'

export function processClass(
  scope: object,
  el: HTMLElement,
  expr: string,
) {
  expr = expr.trim()

  const assignObjectClasses = (parsed: Record<string, unknown>) => {
    for (const key of Object.keys(parsed)) {
      if (parsed[key])
        el.classList.add(key)
      else
        el.classList.remove(key)
    }
  }

  if (expr.startsWith('[')) {
    // Evaluate Should receive an array of strings or objects. Iterate on it and
    // call either of the process functions
    const prevInlineResults: Record<number, string | null> = Object.create(null)

    watchStack(() => {
      const results = evaluate(scope, expr)

      for (let i = 0; i < results.length; i++) {
        const result = results[i]

        if (!result) {
          const prevResult = prevInlineResults[i]

          if (prevResult) {
            el.classList.remove(prevResult)
            prevInlineResults[i] = null
          }
        }
        else if (typeof result === 'string') {
          el.classList.add(result)
          prevInlineResults[i] = result
        }
        else if (isObj(result)) {
          assignObjectClasses(result)
        }
      }
    })
  }
  else if (expr.startsWith('{') && expr.endsWith('}')) {
    // Processes object expression. If the value is truthy, the key will be
    // assigned as a classname
    // Eg: { className: expression, display: isVisible }
    watchStack(() => {
      const parsed: Record<string, unknown> = evaluate(scope, expr, el)
      assignObjectClasses(parsed)
    })
  }
  else {
    // Processes inline ternary operator expression
    // Eg: "value ? 'class' : null"
    let previous: string
    watchStack(() => {
      if (previous)
        el.classList.remove(previous)

      previous = evaluate(scope, expr, el)
      el.classList.add(previous)
    })
  }
}
