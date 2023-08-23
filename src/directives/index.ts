import type { ContextAny } from '../context'

export type Directive = (
  ctx: ContextAny,
  node: Element,
  attr: Attr,
) => void
