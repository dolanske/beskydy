import { getAttr, getElementIndex } from './helpers'
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
import { processPortal } from './directives/x-portal'
import { processTextNode } from './text-node'
import { processData } from './directives/x-data'
import { processSwitch } from './directives/x-switch'
import { processSpy } from './directives/x-spy'
import { processLifecycle } from './directives/x-lifecycle'

export async function walk(ctx: ContextAny, forcedRoot?: Element) {
  const rootEl = forcedRoot ?? ctx.root
  let walker = document.createTreeWalker(rootEl)
  let node: Node | null = walker.root

  // Before we process directives, we first iterate over any data
  // defining elements This will make sure that all the data objects are
  // available to all elements within a scope/ That means we can
  // reference a variable before it is defined.

  // This approach might be against javascript conventions, but it is
  // important to remember that the nesting of elements should not
  // matter when usiny Beskydy. Each x-scope and all its descendants
  // should be treated as a single, flat "scope".

  const rootDatasets = (rootEl).querySelectorAll('[x-data]')
  const rootScopeAttr = (rootEl).getAttributeNode('x-scope')

  if (rootScopeAttr)
    processData(ctx, rootEl, rootScopeAttr)

  for (const rootDataset of rootDatasets) {
    // We can ignore the fact that getAttributeNode can return null, as
    // all the iterated elements have explicitly been queried by the
    // `x-data` attribute
    processData(ctx, rootDataset, rootDataset.getAttributeNode('x-data')!)
  }

  /// /////////////////////

  while (node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE: {
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

        // If appliy directives returns true, we want to skip to the next
        // sibling instead of going deeper. This requires creating a new walker
        // because the DOM has changed after using x-if/x-for.

        // Save node index
        const nodeIndex = getElementIndex(node)

        if (applyDirectives(ctx, _node)) {
          const tempWalker = document.createTreeWalker(rootEl)
          let tempNode: Node | null = tempWalker.root
          // Iterate until we are left off where the last walker ended (on the index)
          let i = 0
          while (tempNode && i !== nodeIndex) {
            tempNode = tempWalker.nextNode()
            i++
          }

          walker = tempWalker
          node = tempWalker.currentNode

          continue
        }

        break
      }

      case Node.TEXT_NODE: {
        // SECTION Text Node
        // 1. Save string
        // 2. Extract expression
        // 3. Replace entire content between delimiters with the result of the expression
        processTextNode(ctx, node)
        break
      }
    }

    node = walker.nextNode()
  }
}

// Can be re-run on sub-sequent dom changes
export function applyDirectives(ctx: ContextAny, node: HTMLElement): boolean | void {
  for (const attr of Array.from(node.attributes)) {
    // REVIEW
    // Unsure if the order of attribute processing is correct,
    // but so far it hasn't posed any issues. Just adding this here so
    // later we do a real review

    // When scope has had its data registered, we can execute the init hook
    if (attr.name === 'x-init') {
      processLifecycle(ctx, node, attr)
      continue
    }

    // Before anything else, we check if a x-bind value is matching a custom
    // bind attribute key
    // const val = attr.value
    const bindItems = ctx.app.globalBinds.get(attr.value)
    if (attr.name === 'x-bind' && bindItems) {
      for (const key of Object.keys(bindItems())) {
        const value = bindItems[key]
        if (typeof value === 'string')
          node.setAttribute(key, value)
        else
          node.setAttribute(key, value.apply())
      }

      // for (const bindItem of bindItem.values())
    }

    // In case if and for are on the same element, the if is removed.
    if (attr.name === 'x-for') {
      processFor(ctx, node, attr)

      return true
    }
    else if (attr.name === 'x-if') {
      const shouldSkipNode = processIf(ctx, node, attr)

      // This looks wonky, but we only want to return a value if the
      // sibling should be skipped. If not, we want this function to
      // continue further.
      if (shouldSkipNode) {
        // REVIEW: ive no fucking clue man
        return true
      }

      continue
    }

    if (attr.name === 'x-switch') {
      processSwitch(ctx, node, attr)
      continue
    }

    if (attr.name === 'x-ref') {
      processRef(ctx, node, attr)
      continue
    }

    if (attr.name.startsWith('x-model')) {
      processModel(ctx, node, attr)
      continue
    }

    if (attr.name.startsWith('x-bind') || attr.name.startsWith(':')) {
      processBind(ctx, node, attr)
      continue
    }

    if (attr.name.startsWith('@') || attr.name.startsWith('x-on')) {
      processOn(ctx, node, attr)
      continue
    }

    if (attr.name.startsWith('x-spy')) {
      processSpy(ctx, node, attr)
      continue
    }

    if (attr.name === 'x-text') {
      processText(ctx, node, attr)
      continue
    }

    if (attr.name === 'x-class') {
      processClass(ctx, node, attr)
      continue
    }

    if (attr.name === 'x-html') {
      processHTML(ctx, node, attr)
      continue
    }

    if (attr.name === 'x-style') {
      processStyle(ctx, node, attr)
      continue
    }

    if (attr.name === 'x-show') {
      processShow(ctx, node, attr)
      continue
    }

    // Custom directive implementation
    const keys = Object.keys(ctx.app.customDirectives)

    if (keys.length > 0) {
      for (const key of keys) {
        const directive = ctx.app.customDirectives[key]
        if (attr.name.startsWith(key))
          directive(ctx, node, attr)
      }
    }

    // When scope has had its data registered, we can execute the init hook
    if (attr.name === 'x-processed') {
      processLifecycle(ctx, node, attr)
      continue
    }
  }
}
