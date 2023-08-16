import { type Directive, preProcessDirective } from '.'

export const processRef: Directive = function (ctx, node, { value, name }) {
  preProcessDirective(ctx, node, name, value)

  ctx.addRef(value, node)
}
