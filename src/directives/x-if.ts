import { evaluate } from '../evaluate'
import { getAttr } from '../util/domUtils'
import { watchStack } from '../reactivity/stack'

interface Block {
  expr: string | null
  el: HTMLElement
}

export function processIf(
  scopeStack: object,
  el: HTMLElement,
  expr: string,
) {
  // Holds the reference to the element and its parent node
  const savedEl = el
  const parent = el.parentElement!

  // This serves as an "anchor" to mount the element back in if the provided expression returns true
  const anchor = new Comment('x-if')
  parent.insertBefore(anchor, el)

  const blocks: Block[] = [{ el, expr }]

  // Look for v-else-if and v-else elements and their expression
  let elseEl: Element | null
  let elseExpr: string | null
  while ((elseEl = el.nextElementSibling) !== null) {
    console.log(getAttr(el, 'x-else'))

    if (
      getAttr(el, 'x-else')
      || (elseExpr = getAttr(el, 'x-else-if'))
    ) {
      parent.removeChild(elseEl)
      blocks.push({
        el: elseEl as HTMLElement,
        expr: elseExpr!,
      })
    }
    else {
      // If the NEXT sibling does not contain one of these,
      // stop checking. As only adjacent elements to the first
      // x-if can be tied to it. Gaps aren't allowed
      break
    }
  }

  parent.removeChild(el)

  console.log(blocks)

  // let currentIndex: number
  let currentResult: boolean

  /**
   * Iterate over each block and execute its expression
   *
   * 1. If expression passed, break from the loop
   * 2. If expression is not provided (x-else), the result is always the
   *    opposite of the previous result
   */

  watchStack(() => {
    // Iterate over each block and execute
    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index]

      if (block.expr)
        currentResult = evaluate(scopeStack, block.expr, el) as boolean
      else if (!currentResult === true)
        currentResult = true

      if (currentResult)
        parent.insertBefore(block.el, anchor)
      else
        parent.removeChild(block.el)
    }
  })
}
