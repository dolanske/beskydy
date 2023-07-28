import { evaluate } from '../evaluate'
import { watchStack } from '../reactivity/stack'

/**
 * Takes in and evaluates an expression. Based on the result the element
 * is either shown or hidden in the DOM.
 */
export function processShow(
  scope: object,
  el: HTMLElement,
  expr: string,
) {
  watchStack(() => {
    const result = evaluate(scope, expr, el)
    if (result)
      el.style.removeProperty('display')
    else
      el.style.setProperty('display', 'none')
  })
}
