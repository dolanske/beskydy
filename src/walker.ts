import { getAttr } from './helpers'
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
import { customDirectives } from './directives'
import { processPortal } from './directives/x-portal'
import { processTextNode } from './text-node'
import { processData } from './directives/x-data'

export function walk(ctx: ContextAny) {
  const walker = document.createTreeWalker(ctx.root)
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

      // SECTION x-portal
      // A section of DOM disconnected from the context
      // tree but still within the reactive scope. We essentially need
      // to create another walker within this walker to temporarily
      // traverse the detached dom tree
      let portalAttr
      if (portalAttr = Array.from(_node.attributes).find(a => a.name.startsWith('x-portal')))
        processPortal(ctx, _node, portalAttr)

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
    // REVIEW
    // Unsure if the order of attribute processing is correct, but so far it
    // hasn't posed any issues. Just adding this here so later we do a real
    // review

    // 0. Scope initialization
    if (attr.name === 'x-data' || attr.name === 'x-scope') {
      /**
       * If directive processing returns true, it is a signal an error
       * has occured and the walker should skip initialization on this
       * element.
       */
      if (processData(ctx, node, attr))
        throw new Error('[x-scope/x-data] Error when processing attribute. \n Most likely an issue with the the data object.')
    }

    // 1. for
    // In case if and for are on the same element, the if is removed.
    if (attr.name === 'x-for')
      processFor(ctx, node, attr)

    // 2. if
    else if (attr.name === 'x-if')
      processIf(ctx, node, attr)

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

    // Iterate over custom directives and apply them
    if (Object.keys(customDirectives).length > 0) {
      Object.entries(customDirectives).forEach(([name, customDirective]) => {
        if (attr.name.startsWith(name))
          customDirective(ctx, node, attr)
      })
    }
  }
}
