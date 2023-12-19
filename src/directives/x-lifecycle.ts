import { Directive } from "..";

// Simply runs the provided expression
// This is used for lifecycle methods
// `x-init` = runs when all data is registered
// `x-mount` = runs when all other directives have been processed
export const processLifecycle: Directive = (ctx, node, attr) => {
  node.removeAttribute(attr.name)
  ctx.eval(attr.value, node)
}