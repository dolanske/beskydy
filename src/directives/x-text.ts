import { evaluate } from '../evaluate'
import type { Directive } from '.'

export const processText: Directive = function (ctx, node, value) {
  const expr = value

  ctx.effect(() => {
    node.textContent = evaluate(ctx, expr, node)
  })
}
