import type { ContextAny } from '../context'

export type Directive = (
  ctx: ContextAny,
  node: Element,
  attr: Attr,
) => void

export const preProcessDirective = function (ctx: ContextAny, node: Element, name: string, value: string) {
  node.removeAttribute(name)
  ctx.addExpr(node, name, value)
}
