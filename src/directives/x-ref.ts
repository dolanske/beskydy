import { type Directive } from './directives'

export const processRef: Directive = function (ctx, node, { value, name }) {
  node.removeAttribute(name)
  // Add ref once
  ctx.addRef(value, node)

  // Update whenever ref's items are changed
  const mo = new MutationObserver(() => {
    ctx.addRef(value, node)
  })

  mo.observe(node, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
  })
}
