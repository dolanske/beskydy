import type { Directive } from '.'

export const processPortal: Directive<HTMLElement> = function (_, node, { value }) {
  // Clone node, teleport clone to the new place, replace current node
  const clone = node.cloneNode(true) as HTMLElement
  const target = document.querySelector(value)

  if (!target)
    console.error('No valid target provided for `x-portal`')

  node.remove()
  target?.append(clone)

  return clone as HTMLElement
}
