import { Directive } from "..";

// Executes given expression
export const processInit: Directive = (ctx, node, attr) => {
  node.removeAttribute(attr.name)
  ctx.eval(attr.value, node)
}