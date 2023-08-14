import { evaluate } from '../v1/evaluate'
import { getAttr, isObj } from './helpers'
import type { ContextAny } from './context'
import { processRef } from './directives/x-ref'
import { processText } from './directives/x-text'

export function walkRoot(ctx: ContextAny, isRootContext: boolean) {
  const walker = document.createTreeWalker(ctx.$root)
  let node: Node | null = walker.root

  while (node !== null) {
    if (node.nodeType === 1) {
      // Element
      const _node = node as HTMLElement

      // SECTION x-skip
      // Elements with x-skip will be skipped during evaluation. The
      // skip includes all elements children. Selects the next sibling.
      if (getAttr(_node, 'x-skip') !== null) {
        node = walker.nextSibling()
        continue
      }

      if (isRootContext)
        processRootAttrs(ctx, _node)

      processNonRootAttrs(ctx, _node)
    }
    else if (node.nodeType === 3) {
      // Text Node
    }

    node = walker.nextNode()
  }
}

// Can be re-run on sub-sequent dom changes
export function processNonRootAttrs(ctx: ContextAny, node: HTMLElement) {
  let attrVal: string | null

  // 1
  if ((attrVal = getAttr(node, 'x-ref')))
    processRef(ctx, node, attrVal)

  // 2

  // Other
  if ((attrVal = getAttr(node, 'x-text')))
    processText(ctx, node, attrVal)
}

// Ran only when x-scope is being initialized
export function processRootAttrs(ctx: ContextAny, node: HTMLElement) {
  let attrVal: string | null

  if ((attrVal = getAttr(node, 'x-data')) || (attrVal = getAttr(node, 'x-scope'))) {
    try {
      const data = evaluate({}, attrVal)

      if (!isObj(data))
        console.warn('[x-scope/x-data] Data must be an object')

      for (const key of Object.keys(data)) {
        Object.defineProperty(ctx.$data, key, {
          value: data[key],
          writable: true,
          enumerable: true,
          configurable: true,
        })
      }
    }
    catch (e) {
      console.warn('[x-scope/x-data] Error when processing attribute')
      console.log(e)
    }
  }
}
