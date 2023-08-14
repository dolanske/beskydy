import { evaluate } from '../evaluate'
import type { Directive } from '.'

export const processHTML: Directive = function (ctx, node, value) {
  const expr = value

  ctx.effect(() => {
    node.innerHTML = evaluate(ctx, expr, node)
  })
}
