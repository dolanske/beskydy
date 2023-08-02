import { type Scope, walkRoot } from '../app'
import { evaluate } from '../evaluate'
import { stack, watchStack } from '../reactivity/stack'
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
  const parent = el.parentElement
  const elements: Record<number, Element> = {}

  watchStack(() => {
    let prevEl: HTMLElement | null = null
    const value = evaluate(scope, rawValue)

    // Range
    if (typeof value === 'number') {
      for (const i in Array.from({ length: value })) {
        const newEl = el.cloneNode(true) as HTMLElement
        const index = Number(i)

        // On first iteration, replace current element
        if (!prevEl)
          parent?.replaceChild(newEl, el)
        // Append after the first iterated node
        else if (elements[index])
          parent?.replaceChild(elements[index], newEl)
        else
          prevEl.after(newEl)

        // Evaluate
        const newScope = stack({})

        Object.assign(newScope, scope)
        Object.assign(newScope, { [params]: index })

        // Walk and process all child nodes including self
        walkRoot(newEl, newScope, false)

        elements[index] = newEl

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
  })
}
