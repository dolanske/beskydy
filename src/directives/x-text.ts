import { evaluate } from '../evaluate'
import { type Directive } from './directives'

export const processText: Directive = function (ctx, node, { name, value }) {
  node.removeAttribute(name)

  const expr = value

  ctx.effect(() => {
    node.textContent = evaluate(ctx.data, expr, node)
  })
}
