import type { ContextAny } from '../context'

export type Directive = (
  ctx: ContextAny,
  node: Element,
  attrValue: string,
) => void

// export const directiveRegex = /^(?:v-|:|@)/
// export const directiveModifierRegex = /\.([\w-]+)/g

export type DirectiveWithModifiers = (
  ctx: ContextAny,
  node: Element,
  attrValue: string,
  attrKey: string
) => void

// export const directives = {
//   'x-ref': processRef,
// } as const

// export const directiveKeys = Object.keys(directives)
