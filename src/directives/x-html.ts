import { type Directive } from './directives'

export const processHTML: Directive = function (ctx, node, { value, name }) {
  node.removeAttribute(name)
  const expr = value
  ctx.effect(() => {
    node.innerHTML = ctx.eval(expr, node)
  })
}
