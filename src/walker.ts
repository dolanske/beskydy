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
import { processFor } from './directives/x-for'

export function walk(ctx: ContextAny) {
  const walker = document.createTreeWalker(ctx.$root)
  let node: Node | null = walker.root

  while (node) {
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

      processAttrs(ctx, _node)
    }
    else if (node.nodeType === 3) {
      /**
       * Text Node
       *
       * 1. Save string
       * 2. Extract expression
       * 3. Replace entire content between delimiters with the result of the expression
       */

      processTextNode(ctx, node)
    }

    node = walker.nextNode()
  }
}

// Can be re-run on sub-sequent dom changes
export function processAttrs(ctx: ContextAny, node: HTMLElement) {
  for (const attr of Array.from(node.attributes)) {
    // 0. Scope initialization
    if (attr.name === 'x-data' || attr.name === 'x-scope') {
      if (attr.name === 'x-scope' && ctx.$root !== node) {
        console.warn('Can not initialize a new scope within an existing scope')
        return
      }

      try {
        const data = evaluate({}, attr.value)

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

    // 1. if
    if (attr.name === 'x-if')
      processIf(ctx, node, attr)

    // 2. for
    if (attr.name === 'x-for')
      processFor(ctx, node, attr)

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

export function processTextNode(ctx: ContextAny, node: Node) {
  // This should never be hit as only text nodes are processed, but
  // typescript is a known crybaby
  if (!node.textContent)
    return

  // Save the original expression
  const originalTextContent = node.textContent
  // Extract expressions from text node wrapped within the delimiters
  // For instance { expression }
  const delimitersInclusive = /(?=\{)(.*?)(?<=\})/g
  // Match all occurences of { } within a text node
  const exprGroup = originalTextContent.match(delimitersInclusive)

  if (!exprGroup || exprGroup.length === 0)
    return

  ctx.effect(() => {
    let finalTextContent = originalTextContent

    for (const expr of exprGroup) {
      // Get the expression without the delimiters
      const extractedExpr = expr.replace('{', '').replace('}', '')
      if (!extractedExpr)
        continue

      // Evaluate and replace part of the original text content
      const result = evaluate(ctx.$data, extractedExpr, node)
      finalTextContent = finalTextContent.replace(expr, result)
    }

    node.textContent = finalTextContent
  })
}
