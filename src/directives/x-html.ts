import { type Directive, preProcessDirective } from '.'

export const processHTML: Directive = function (ctx, node, { value, name }) {
  preProcessDirective(ctx, node, name, value)

  const expr = value

  ctx.effect(() => {
    node.innerHTML = evaluate(ctx.$data, expr, node)
  })
}
