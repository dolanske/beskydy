import { type Directive } from './directives'

/**
 * Takes in and evaluates an expression. Based on the result the element
 * is either shown or hidden in the DOM.
 */
export const processShow: Directive = function (ctx, node, { value, name }) {
  node.removeAttribute(name)

  const expr = value

  if (!Reflect.has(node, 'style'))
    return

  ctx.effect(() => {
    const result = ctx.eval(expr, node)
    if (result)
      (node as HTMLElement).style.removeProperty('display')
    else
      (node as HTMLElement).style.setProperty('display', 'none')
  })
}
