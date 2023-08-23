import { evaluate } from '../evaluate'
import { type Directive } from '.'

export const processHTML: Directive = function (ctx, node, { value, name }) {
  node.removeAttribute(name)

  const expr = value

  ctx.effect(() => {
    node.innerHTML = evaluate(ctx.data, expr, node)
  })
}
