import { getAttr } from '../helpers'
import { processAttrs } from '../walker'
import { processTextNode } from '../text-node'
import type { Directive } from '.'

export const processPortal: Directive = function (ctx, original, { value }) {
  // Clone node, teleport clone to the new place, replace current node
  const clone = original.cloneNode(true) as HTMLElement
  const target = document.querySelector(value)

  if (!target)
    console.error('No valid target provided for `x-portal`')

  // Remove original node and append clone to the target
  original.remove()
  target?.append(clone)

  // Walk the new branch. This code is a compressed clone of the
  // `walk()` function with some differences which aren't necessarily
  // worth an abstraction
  const walker = document.createTreeWalker(clone)
  let node: Node | null = walker.root

  while (node) {
    if (node.nodeType === 1) {
      const _node = node as HTMLElement

      if (getAttr(_node, 'x-skip') !== null) {
        node = walker.nextSibling()
        continue
      }

      processAttrs(ctx, _node)
    }
    else if (node.nodeType === 3) {
      processTextNode(ctx, node)
    }

    node = walker.nextNode()
  }
}
