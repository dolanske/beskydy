import { getAttr } from '../helpers'
import { evaluate } from '../evaluate'
import { walk } from '../walker'
import { type Directive } from '.'

interface Block {
  expr: string | null
  node: HTMLElement
}

/**
 * Takes in an expression and based on its result, the elements are
 * either completely removed or (re)added to the DOM.
 *
 * The usage syntax and rules
 *  x-if        // Requires expression
 *  x-else-if   // Requires expression and adjacent x-if or x-if-else
 *  x-else      // Requires adjacent x-if or x-else
 */

export const processIf: Directive = function (ctx, node, { name, value }) {
  node.removeAttribute(name)

  // Holds the reference to the element and its parent node
  // const savedEl = node
  const parent = node.parentElement!

  // This serves as an "anchor" to mount the element back in if the provided expression returns true
  const anchor = new Comment('x-if')
  parent.insertBefore(anchor, node)

  // Store each element as a block with its expression
  const blocks: Block[] = [{
    node: node as HTMLElement,
    expr: value,
  }]

  // Look for v-else-if and v-else elements and their expression
  let elseEl: Element | null
  let elseExpr: string | null
  while ((elseEl = node.nextElementSibling) !== null) {
    if (
      (elseExpr = getAttr(elseEl, 'x-else')) !== null
      || (elseExpr = getAttr(elseEl, 'x-else-if'))
    ) {
      blocks.push({
        node: elseEl as HTMLElement,
        expr: elseExpr,
      })
      // Remove them because they can be re-added during evaluation process
      parent.removeChild(elseEl)
    }
    else {
      // If the NEXT sibling does not contain one of these,
      // stop checking. As only adjacent elements to the first
      // x-if can be tied to it. Gaps aren't allowed
      break
    }
  }

  parent.removeChild(node)

  let currentIndex: number
  let currentResult: Block | null

  function clear() {
    if (currentResult) {
      parent.removeChild(currentResult.node)
      currentResult = null
    }
  }

  ctx.effect(() => {
    console.log(blocks)

    // Iterate over each block and evaluate block expressions
    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index]

      if (!block.expr || evaluate(ctx.data, block.expr, node)) {
        // Passed
        if (currentIndex !== index) {
          if (currentResult)
            clear()

          parent.insertBefore(block.node, anchor)

          console.log(block.node)

          // Walk and process again
          walk(ctx, block.node)

          currentResult = block
          currentIndex = index
        }

        return
      }
    }

    currentIndex = -1
    clear()
  })
}
