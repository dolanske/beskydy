import type { ContextAny } from '../context'

export type Directive = (
  ctx: ContextAny,
  node: Element,
  attr: Attr,
) => void

export const preProcessDirective = function (ctx: ContextAny, node: Element, name: string, value: string) {
  preProcessDirective(ctx, node, name, value)

  const exists = ctx.$expr.get(node)

  if (exists) {
    exists.set(name, value)
    ctx.$expr.set(node, exists)
  }
  else {
    ctx.$expr.set(node, new Map([[name, value]]))
  }
}
