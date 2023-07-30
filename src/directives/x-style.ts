import type { Scope } from '../app'
import { evaluate } from '../evaluate'
import { watchStack } from '../reactivity/stack'

export function processStyle(
  scope: Scope,
  el: HTMLElement,
  expr: string,
) {
  watchStack(() => {
    const result = evaluate(scope, expr, el)
    for (const key of Object.keys(result))
    // Using reflect set allows us using camelCase and kebab-case styles
      Reflect.set(el.style, key, result[key])
  })
}
