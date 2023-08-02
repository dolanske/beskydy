import type { Scope } from '../app'
import { applyNonRootAttrs } from '../app'
import { evaluate } from '../evaluate'
import { isArr, isObj } from '../util'

export function prociessFor(
  scope: Scope,
  el: Element,
  expr: string,
) {
  /**
   * Much more limited that vue's synax.
   * Only supports 3 different types. Array, object and range (number)
   *
   * Iteration of objects
   *  - item in object
   *  - (value, key, index) in object
   *
   * Iteration of arrays
   *  - item in array
   *  - (item, index) in array
   */

  // First, we split strings
  const [params, _, rawValue] = expr.split(/(?!\(.*)\s(?![^(]*?\))/g)
  const value = evaluate(scope, rawValue)

  const parent = el.parentElement
  let prevEl: HTMLElement | null = null

  // Range
  if (typeof value === 'number') {
    for (const index in Array.from({ length: value })) {
      const newEl = el.cloneNode(true) as HTMLElement

      // REVIEW Wouldn't this start a whole new context with a treewalker and everytthing

      // On first iteration, replace current element
      if (!prevEl)
        parent?.replaceChild(newEl, el)
      // Append after the first iterated node
      else
        prevEl.after(newEl)

      // Evaluate
      // const result
      const newScope = structuredClone({ ...scope })
      Object.assign(newScope, { [params]: index })

      // Process non root
      applyNonRootAttrs(newScope, newEl)

      prevEl = newEl
    }
  }
  // Item in array
  else if (isArr(value)) {
    //
  }
  // Iterating in objecy
  else if (isObj(value)) {
    //
  }
  else {
    throw new TypeError('Unsupported value was used in \'x-for\'. Please only use a number, array or an object')
  }

  el.remove()

  console.log(params, value)
}
