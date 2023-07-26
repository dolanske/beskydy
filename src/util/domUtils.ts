export function isSibling(el: HTMLElement, el2: HTMLElement) {
  return el !== el2 && el.parentNode === el2.parentNode
}

export function getAttr(el: HTMLElement, key: string) {
  const attr = el.getAttribute(key)
  if (attr)
    el.removeAttribute(key)
  return attr
}
