import { evaluate } from '../evaluate'
import { watchStack } from '../reactivity/stack'

/**
 * Sets the HTML of content of the selected element each time expression
 * is evaluated.
 */
export function processHTML(
  scope: object,
  el: Element,
  expr: string,
) {
  watchStack(() => {
    el.innerHTML = evaluate(scope, expr, el)
  })
}
