import { type Directive } from './directives'

export const processHTML: Directive = function (ctx, node, { value, name }) {
  node.removeAttribute(name)
  const expr = value
  ctx.effect(() => {
    // @ts-expect-error tmtu edgecase
    if (expr instanceof Element) {
      node.append(expr)
    } else {
      node.innerHTML = ctx.eval(expr, node)
    }

  })
}
