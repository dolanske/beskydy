import type { ContextAny } from './context'
import { evaluate } from './evaluate'
import { isObj } from './helpers'

export function toDisplayString(value: any) {
  return value == null
    ? ''
    : isObj(value)
      ? JSON.stringify(value, null, 2)
      : String(value)
}

export function processTextNode(ctx: ContextAny, node: Node) {
  // This should never be hit as only text nodes are processed, but
  // typescript is a known crybaby
  if (!node.textContent || node.textContent.trim().length === 0)
    return

  const delimiters = ctx.app.delimiters

  // Save the original expression
  const originalTextContent = node.textContent

  ctx.effect(() => {
    // const data = (node as Text).data
    if (originalTextContent.includes(delimiters.start)) {
      const segments: string[] = []
      let lastIndex = 0
      let match
      while ((match = delimiters.re.exec(originalTextContent))) {
        const leading = originalTextContent.slice(lastIndex, match.index)
        if (leading)
          segments.push(JSON.stringify(leading))
        segments.push(toDisplayString(`${match[1]}`))
        lastIndex = match.index + match[0].length
      }
      if (lastIndex < originalTextContent.length)
        segments.push(JSON.stringify(originalTextContent.slice(lastIndex)))

      node.textContent = evaluate(ctx.data, segments.join('+'))
    }
    else {
      node.textContent = toDisplayString(originalTextContent)
    }
  })
}
