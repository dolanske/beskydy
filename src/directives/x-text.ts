import { evaluate } from '../evaluate'
import { type Directive, preProcessDirective } from '.'

export const processText: Directive = function (ctx, node, { name, value }) {
  preProcessDirective(ctx, node, name, value)

  const expr = value

  ctx.effect(() => {
    node.textContent = evaluate(ctx.$data, expr, node)
  })
}
