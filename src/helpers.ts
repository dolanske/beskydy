import type { Primitive } from './directives/directives'
import type { ContextAny } from './context'
import { evaluate } from './evaluate'

export function isSibling(el: HTMLElement, el2: HTMLElement) {
  return el !== el2 && el.parentNode === el2.parentNode
}

export function getAttr(el: HTMLElement | Element, key: string) {
  const attr = el.attributes.getNamedItem(key)
  if (!attr)
    return null
  el.removeAttribute(key)
  return attr.value ?? true
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

export function parseValue(value: string, ctx: ContextAny): Primitive {
  if (value in ctx.data) {
    return evaluate(ctx.data, value)
  }
  else {
    if (value === 'undefined')
      return undefined
    else if (value === 'null')
      return null
    else if (value === 'true' || value === 'false')
      return Boolean(value)
    // eslint-disable-next-line unicorn/prefer-number-properties
    else if (!isNaN(value as any))
      return Number(value)
    else
      return value
  }
}

export function parseDelimiter(delimiter: string) {
  return [...delimiter].reduce((group, item) => {
    return group += `\\${item}`
  }, '')
}
