import type { Directive } from './directives'

export const processHTML: Directive = function (ctx, node, { value, name }) {
  node.removeAttribute(name)
  const expr = value
  ctx.effect(() => {
    const result = ctx.eval(expr, node)

    if (result instanceof Element) {
      node.replaceChildren()
      node.append(result)
    }
    else {
      node.innerHTML = result
    }
  })
}
