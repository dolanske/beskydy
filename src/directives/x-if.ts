import { evaluate } from '../evaluate'
import { watchStack } from '../reactivity/stack'
import { getAttr } from '../util/domUtils'

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
  // const savedEl = el
  const parent = el.parentElement!

  // This serves as an "anchor" to mount the element back in if the provided expression returns true
  const anchor = new Comment('x-if')
  parent.insertBefore(anchor, el)

  const blocks: Block[] = [{ el, expr }]

  // Look for v-else-if and v-else elements and their expression
  let elseEl: Element | null
  let elseExpr: string | null
  while ((elseEl = el.nextElementSibling) !== null) {
    if (
      (elseExpr = getAttr(elseEl, 'x-else')) !== null
      || (elseExpr = getAttr(elseEl, 'x-else-if'))
    ) {
      blocks.push({
        el: elseEl as HTMLElement,
        expr: elseExpr,
      })
      parent.removeChild(elseEl)
    }
    else {
      // If the NEXT sibling does not contain one of these,
      // stop checking. As only adjacent elements to the first
      // x-if can be tied to it. Gaps aren't allowed
      break
    }
  }

  parent.removeChild(el)

  let currentIndex: number
  let currentResult: Block | null

  function clear() {
    if (currentResult) {
      parent.removeChild(currentResult.el)
      currentResult = null
    }
  }

  watchStack(() => {
    // Iterate over each block and execute
    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index]

      if (!block.expr || evaluate(scopeStack, block.expr, el)) {
        // Passed
        if (currentIndex !== index) {
          if (currentResult)
            clear()

          parent.insertBefore(block.el, anchor)
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
