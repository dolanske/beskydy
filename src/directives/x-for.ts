import { evaluate } from '../evaluate'
import { isArr, isObj } from '../helpers'
import type { ContextAny } from '../context'
import { Context } from '../context'
import { walkRoot } from '../walker'
import type { Directive } from '.'
import { preProcessDirective } from '.'

export const processFor: Directive = function (ctx, node, { value, name }) {
  preProcessDirective(ctx, node, name, value)

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
  const [params, _, rawValue] = value.split(/(?!\(.*)\s(?![^(]*?\))/g)
  const parent = node.parentElement

  /**
   * Evaluation process
   *
   * 1. Generate nodes once and save them to an array
   * 2. On subsequent evaluations, we cache the expression. And iterate on the cached nodes only.
   *  - If expression changes, we remoe all nodes and go back to step #1
   *
   */
  const cached: Record<number, ContextAny | undefined> = {}

  ctx.effect(() => {
    let prevEl: HTMLElement | null = null
    const value = evaluate(ctx, rawValue)

    // Range
    if (typeof value === 'number') {
      // if (cachedKeys.length === value) {
      //   cachedKeys.forEach((key, index) => {
      //     // const newEl = el.cloneNode(true) as HTMLElement
      //     const newEl = cached[Number(key)]
      //     const newScope = stack({})

      //     Object.assign(newScope, scope)
      //     Object.assign(newScope, { [params]: index })

      //     console.log(newScope)

      //     // Walk and process all child nodes including self
      //     walkRoot(newEl, newScope, false)
      //   })
      // }
      // else {
      for (const i in Array.from({ length: value })) {
        const index = Number(i)
        const newEl = <HTMLElement>node.cloneNode(true)

        const newCtx = new Context(newEl)
        newCtx.extend(ctx)
        newCtx.$expr.set(newEl, new Map([[name, rawValue]]))

        if (!prevEl)
          parent?.replaceChild(newEl, node)
        else
          prevEl.after(newEl)

        cached[index] = newCtx

        walkRoot(newCtx, true)

        prevEl = newEl
      }
      // }
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

    node.remove()
  })
}
