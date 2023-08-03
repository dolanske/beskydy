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

  /**
   * Evaluation process
   *
   * 1. Generate nodes once and save them to an array
   * 2. On subsequent evaluations, we cache the expression. And iterate on the cached nodes only.
   *  - If expression changes, we remoe all nodes and go back to step #1
   *
   */

  watchStack(() => {
    let prevEl: HTMLElement | null = null
    const value = evaluate(scope, rawValue)

    // Range
    if (typeof value === 'number') {
      for (const i in Array.from({ length: value })) {
        const newEl = el.cloneNode(true) as HTMLElement
        const index = Number(i)

        elements[index]?.remove()

        // On first iteration, replace current element
        if (!prevEl)
          parent?.replaceChild(newEl, el)

        // Append after the first iterated node
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
