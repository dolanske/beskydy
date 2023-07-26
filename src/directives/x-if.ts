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
  const savedEl = el
  const parent = el.parentElement!

  // This serves as an "anchor" to mount the element back in if the provided expression returns true
  const anchor = new Comment('x-if')
  parent.insertBefore(el, anchor)

  const blocks: Block[] = [{ el, expr }]

  // Look for v-else-if and v-else elements and their expression
  let elseEl: Element | null
  let elseExpr: string | null
  while ((elseEl = el.nextElementSibling) !== null) {
    if (
      getAttr(el, 'x-else') !== null
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

  let currentIndex
  let currentResult

  // watchStack(() => {
  //   // Iterate over each block and execute
  //   for (const block of blocks) {
  //     if (block.expr) {
  //       const result = evaluate(scopeStack, block.expr)
  //     }
  //     else {

  //     }
  //   }
  // })
}
