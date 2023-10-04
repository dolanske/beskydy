import { evaluate } from '../evaluate'
import { parseParam } from '../helpers'
import type { Directive } from '.'

interface Block {
  isDefault: boolean
  isCase: boolean
  expr: string | null
  node: Element
}

export const processSwitch: Directive = function (ctx, node, { value }) {
  node.removeAttribute('x-switch')

  // Since each case/default can be separated by normal non-switch
  // nodes, we need to replace each with a commenet anchor so we can
  // re-add it to the DOM in the right place
  const anchors: Comment[] = []

  // Get all child elements which are part of the switch statement
  const blocks = Array
    .from(node.children)
    // Discard nodes which aren't part of the switch
    .filter(c => c.hasAttribute('x-case') || c.hasAttribute('x-default'))
    // Format into a block holding an expression and dom reference
    .map((el): Block => {
      return {
        isDefault: el.hasAttribute('x-default'),
        isCase: el.hasAttribute('x-case'),
        expr: el.attributes.getNamedItem('x-case')?.value ?? null,
        node: el,
      }
    })
    // Remove all nodes from the DOM, they will be reattached based on
    // the expression
    .map((block) => {
      // Insert comment before each node (there can be gaps between cases)
      const anchor = new Comment('x-switch')
      node.insertBefore(anchor, block.node)
      // e.node.insertAdjacentElement('afterend', anchor)
      anchors.push(anchor)
      // Remove beskydy attributes and self
      block.node.removeAttribute('x-case')
      block.node.removeAttribute('x-default')
      block.node.remove()
      return block
    })

  let currentResult: Block | null

  function clear() {
    if (currentResult) {
      currentResult.node.remove()
      currentResult = null
    }
  }

  ctx.effect(() => {
    const result = evaluate(ctx.data, value)
    let res: [Block, number] | undefined

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]

      // If default is NOT last, we save it in case the following expression are not the result
      if (i < blocks.length - 1 && block.isDefault)
        res = [block, i]

      if (block.expr) {
        const blockResult = parseParam(block.expr, ctx)

        if (blockResult === result) {
          res = [block, i]
          break
        }
      }
      else if (i === blocks.length - 1) {
        // We can expect we hit a `x-case` if we are on the last index and
        // block is missing expression
        res = [block, i]
      }
    }

    if (res) {
      clear()
      const [block, index] = res
      const anchor = anchors[index]
      node.insertBefore(block.node, anchor)
      currentResult = block
      return
    }

    clear()
  })
}
