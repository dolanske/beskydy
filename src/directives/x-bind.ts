import type { Scope } from '../app'
import { evaluate } from '../evaluate'
import { watchStack } from '../reactivity/stack'
import { isNil } from '../util'

export function processBind(
  scope: Scope,
  el: HTMLElement,
  attrKey: string,
  attrVal: string,
) {
  el.removeAttribute(attrKey)

  /**
   * Dynamically bind attribute or attributes if the expression passes
   *
   * Allowed syntax
   *
   * This syntax will bind a value-less attribute (boolean attribute) if the expression matches
   * - x-bind:attributeName="expression"
   * - x-bind="{ attributeValue: expression }"
   */

  const [_, attrName] = attrKey.split(':')

  const setOrDelAttr = (key: string, value: any) => {
    if (isNil(value))
      el.removeAttribute(key)
    else
      el.setAttribute(key, value)
  }

  if (attrName) {
    // x-bind:attrName="" syntax
    watchStack(() => {
      const result = evaluate(scope, attrVal, el)
      setOrDelAttr(attrName, result)
    })
  }
  else {
    // x-bind="{}" syntax
    watchStack(() => {
      const results = evaluate(scope, attrVal, el) ?? {}

      for (const key of Object.keys(results)) {
        const result = results[key]
        setOrDelAttr(key, result)
      }
    })
  }
}