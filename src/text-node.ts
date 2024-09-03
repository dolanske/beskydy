import type { ContextAny } from './context'
import { parseDelimiter } from './helpers'

export function processTextNode(ctx: ContextAny, node: Node) {
  // This should never be hit as only text nodes are processed, but
  // typescript is a known crybaby
  if (!node.textContent || node.textContent.trim().length === 0 || !node.textContent.includes(ctx.app.delimiters.start))
    return

  const delimiters = ctx.app.delimiters

  // Save the original expression
  const originalTextContent = node.textContent
  // Extract expressions from text node wrapped within the delimiters
  // For instance { expression }
  //
  const delimitersInclusive = new RegExp(`(?=${parseDelimiter(delimiters.start)})(.*?)(?<=${parseDelimiter(delimiters.end)})`, 'g')

  // FIXME:
  // using `${}` can match against delimiters containing {}
  // Should use some kind of regex which will ignore "${" and the very next "}"
  //
  // MAYBE?
  // https://github.com/vuejs/petite-vue/blob/9ff3b98b844033b935143c221176c81244aae32e/src/app.ts#L10C1-L26C4

  // Match all occurences of { } within a text node
  const exprGroup = originalTextContent.match(delimitersInclusive)

  console.log(exprGroup)

  if (!exprGroup || exprGroup.length === 0)
    return

  ctx.effect(() => {
    let finalTextContent = originalTextContent

    for (const expr of exprGroup) {
      // Get the expression without the delimiters
      const extractedExpr = expr.replace(delimiters.start, '').replace(delimiters.end, '')
      if (!extractedExpr)
        continue

      // Evaluate and replace part of the original text content
      const result = ctx.eval(extractedExpr, node)

      finalTextContent = finalTextContent.replace(expr, result)
    }

    node.textContent = finalTextContent
  })
}
