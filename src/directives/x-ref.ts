import { type Directive } from '.'

export const processRef: Directive = function (ctx, node, { value, name }) {
  node.removeAttribute(name)

  // Add ref once
  ctx.addRef(value, node)

  // Update whenever ref's items are changed
  const mo = new MutationObserver(() => {
    ctx.addRef(value, node)

    // const _node = node as HTMLElement

    // if (node.nodeType === 1)
    //   processAttrs(ctx, _node)
    // else if (node.nodeType === 3)
    //   processTextNode(ctx, _node)
  })

  mo.observe(node, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
  })
}
