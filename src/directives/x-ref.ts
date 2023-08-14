import type { Directive } from '.'

export const processRef: Directive = function (ctx, node, value) {
  ctx.addRef(value, node)
}
