import { evaluate } from '../evaluate'
import type { Directive } from '.'

export const processText: Directive = function (ctx, node, value) {
  const expr = value

  ctx.effect(() => {
    const result = evaluate(ctx, expr)
    node.textContent = result
  })
}
