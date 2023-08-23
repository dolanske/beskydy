import { type Directive } from '.'

export const processRef: Directive = function (ctx, node, { value, name }) {
  node.removeAttribute(name)
  ctx.addRef(value, node)
}
