import { evaluate } from './evaluate'
import { getAttr, isObj } from './helpers'
import type { ContextAny } from './context'
import { processRef } from './directives/x-ref'
import { processText } from './directives/x-text'
import { processStyle } from './directives/x-style'
import { processShow } from './directives/x-show'
import { processHTML } from './directives/x-html'
import { processBind } from './directives/x-bind'
import { processClass } from './directives/x-class'
import { processOn } from './directives/x-on'
import { processIf } from './directives/x-if'
import { processModel } from './directives/x-model'

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
  for (const attr of Array.from(node.attributes)) {
    // 1. if
    if (attr.name === 'x-if')
      processIf(ctx, node, attr)

    // 2. for

    // 3. ref
    if (attr.name === 'x-ref')
      processRef(ctx, node, attr)

    if (attr.name.startsWith('x-model'))
      processModel(ctx, node, attr)

    // 4. bind
    if (attr.name.startsWith('x-bind') || attr.name.startsWith(':'))
      processBind(ctx, node, attr)

    // Other
    if (attr.name.startsWith('@') || attr.name.startsWith('x-on'))
      processOn(ctx, node, attr)

    if (attr.name === 'x-text')
      processText(ctx, node, attr)

    if (attr.name === 'x-class')
      processClass(ctx, node, attr)

    if (attr.name === 'x-html')
      processHTML(ctx, node, attr)

    if (attr.name === 'x-style')
      processStyle(ctx, node, attr)

    if (attr.name === 'x-show')
      processShow(ctx, node, attr)
  }
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
