import { isArr, isObj, removeChildren } from '../helpers'
import type { ContextAny } from '../context'
import { Context } from '../context'
import { walk } from '../walker'
import type { Directive } from './directives'

export const processFor: Directive = function (ctx, node, { value, name }) {
  node.removeAttribute(name)
  // Remove if from the iterated elements.
  // Use condition on the child elements instead.
  node.removeAttribute('x-if')

  /**
   * Much more limited that vue's synax. No destructuring.
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
   * REVIEW: maybe in the future
   *
   * Evaluation process
   *
   * 1. Generate nodes once and save them to an array
   * 2. On subsequent evaluations, we cache the expression. And iterate on the cached nodes only.
   *  - If expression changes, we remoe all nodes and go back to step #1
   *
   */
  const originalNode = node.cloneNode(true)
  node.remove()

  // Methods using this scope's variables
  // Create new node and context by cloning the original node.
  const createForItemCtx = () => {
    const newEl = <HTMLElement>originalNode.cloneNode(true)
    const newCtx = new Context(newEl, ctx.app)
    newCtx.extend(ctx)
    return { newEl, newCtx }
  }

  // Appends the new element to the parent and walks through attribute setup
  // itself and its children.
  const appendAndWalkItem = (newEl: HTMLElement, newCtx: ContextAny) => {
    parent?.appendChild(newEl)
    walk(newCtx)
  }

  ctx.effect(() => {
    const evalExpr = ctx.eval(rawValue)

    // Before clearing, should remoev ALL children if they exist
    removeChildren(parent!)

    // Range
    if (typeof evalExpr === 'number') {
      for (const i in Array.from({ length: evalExpr })) {
        const { newEl, newCtx } = createForItemCtx()
        Object.assign(newCtx.data, { [params]: Number(i) })
        appendAndWalkItem(newEl, newCtx)
      }
    }
    // Item in array
    else if (isArr(evalExpr)) {
      // Extract values from '(value, index?)' string
      const [valueName, indexName] = params.replace('(', '').replace(')', '').split(',')
      const trimmedValueName = valueName.trim()
      const trimmedIndexName = indexName?.trim()

      evalExpr.forEach((item, index) => {
        const { newEl, newCtx } = createForItemCtx()

        Object.assign(newCtx.data, { [trimmedValueName]: item })

        if (trimmedIndexName)
          Object.assign(newCtx.data, { [trimmedIndexName]: Number(index) })

        appendAndWalkItem(newEl, newCtx)
      })
    }
    // Iterating in object
    else if (isObj(evalExpr)) {
      // Extract values from '(value, key?, index?)' string
      const [valueName, keyName, indexName] = params.replace('(', '').replace(')', '').split(',')
      const trimmedValueName = valueName.trim()
      const trimmedKeyName = keyName?.trim()
      const trimmedIndexName = indexName?.trim()

      Object.entries(evalExpr).forEach(([key, value], index) => {
        const { newEl, newCtx } = createForItemCtx()

        Object.assign(newCtx.data, { [trimmedValueName]: value })

        if (trimmedKeyName)
          Object.assign(newCtx.data, { [trimmedKeyName]: key })

        if (trimmedIndexName)
          Object.assign(newCtx.data, { [trimmedIndexName]: Number(index) })

        appendAndWalkItem(newEl, newCtx)
      })
    }

    else if (import.meta.env.DEV) {
      throw new TypeError('Unsupported value was used in \'x-for\'. Please only use a number, array or an object')
    }
  })
}
