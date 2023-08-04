import type { Scope } from '../app'
import { evaluate } from '../evaluate'
import { watchStack } from '../reactivity/stack'

export function processText(
  scope: Scope,
  el: HTMLElement,
  expr: string,
) {
  const rawExpr = expr
  watchStack(() => {
    const text = evaluate(scope, rawExpr)
    el.innerText = text
  })
}
