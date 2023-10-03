import type { ContextAny } from './context'
import { evaluate } from './evaluate'

export function processTextNode(ctx: ContextAny, node: Node) {
  // This should never be hit as only text nodes are processed, but
  // typescript is a known crybaby
  if (!node.textContent || node.textContent === '')
    return

  // Save the original expression
  const originalTextContent = node.textContent
  // Extract expressions from text node wrapped within the delimiters
  // For instance { expression }
  const delimitersInclusive = /(?=\{\{)(.*?)(?<=\}\})/g
  // Match all occurences of { } within a text node
  const exprGroup = originalTextContent.match(delimitersInclusive)

  if (!exprGroup || exprGroup.length === 0)
    return

  ctx.effect(() => {
    let finalTextContent = originalTextContent

    for (const expr of exprGroup) {
      // Get the expression without the delimiters
      const extractedExpr = expr.replace('{{', '').replace('}}', '')
      if (!extractedExpr)
        continue

      // Evaluate and replace part of the original text content
      const result = evaluate(ctx.data, extractedExpr, node)

      finalTextContent = finalTextContent.replace(expr, result)
    }

    node.textContent = finalTextContent
  })
}
