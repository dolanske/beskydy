import type { Primitive } from '@vue/reactivity'

export function isSibling(el: HTMLElement, el2: HTMLElement) {
  return el !== el2 && el.parentNode === el2.parentNode
}

export function getAttr(el: HTMLElement | Element, key: string) {
  const attr = el.getAttribute(key)
  el.removeAttribute(key)
  return attr ? attr.trim() : null
}

export function isNil(value: unknown) {
  return value === undefined || value === null
}

export function isObj(value: unknown) {
  return (!!value) && (value.constructor === Object)
}

export const isArr = Array.isArray

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function removeChildren(node: Element) {
  while (node.lastElementChild)
    node.removeChild(node.lastElementChild)
}

export function isType(val: any, requiredType: Primitive) {
  // eslint-disable-next-line valid-typeof
  return typeof val === requiredType
}
