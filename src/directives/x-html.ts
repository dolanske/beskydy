import { evaluate } from '../evaluate'
import { watchStack } from '../reactivity/stack'

export function processHTML(
  scope: object,
  el: Element,
  expr: string,
) {
  watchStack(() => {
    el.innerHTML = evaluate(scope, expr, el)
  })
}
