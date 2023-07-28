/**
 *
 */

import { evaluate } from '../evaluate'
import { watchStack } from '../reactivity/stack'

export function processClass(
  scope: object,
  el: HTMLElement,
  expr: string,
) {
  expr = expr.trim()

  // Processes inline ternary operator expression
  // Eg: "value ? 'class' : null"
  const inlineExpression = (expression: string) => {
    let previous: string
    watchStack(() => {
      if (previous)
        el.classList.remove(previous)

      previous = evaluate(scope, expression, el)
      el.classList.add(previous)
    })
  }

  // Processes object expression. If the value is truthy, the key will be
  // assigned as a classname
  // Eg: { className: expression, display: isVisible }
  const objectExpression = (expression: string) => {
    watchStack(() => {
      const parsed: Record<string, unknown> = evaluate(scope, expression, el)

      for (const key of Object.keys(parsed)) {
        if (parsed[key])
          el.classList.add(key)
        else
          el.classList.remove(key)
      }
    })
  }

  if (expr.startsWith('[')) {
    // Evaluate
    // Should receive an array of strings or objects. Iterate on it and call either of the process functions
  }
  else if (expr.startsWith('{') && expr.endsWith('}')) {
    objectExpression(expr)
  }
  else {
    inlineExpression(expr)
  }
}
