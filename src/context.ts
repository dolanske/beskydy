import { stack, watchStack } from './reactivity/stack'

/**
 * Piece of DOM which holds its own state.
 *
 * To be honest I currently have no idea how to implement or use this. The idea
 * is to be able to hold state within a scope, that is only accessible to an
 * element and its descendants.
 *
 * So a x-scope would have its context.
 *
 * But another element could have its own context WITHIN.
 *
 * Maybe a WeakMap<HTMLElement, Scope> ? And when checking if variable is in
 * scope, we check if parent.contains(el) or something
 */

export class Context<R extends Element, T extends object> {
  // Store the context root element
  $root: Element
  // Reactive dataset available to the entire scope
  $data: T
  // Store all scope expressions for an element
  $expr: WeakMap<Element, Map<string, string>>
  // All the scope refs, which are accessible even if accessor is a child of the ref
  $refs: Record<string, Element>
  $init: boolean

  constructor(root: R, initialDataset?: T) {
    this.$root = root
    this.$data = stack<T>(Object.assign({}, initialDataset))
    this.$refs = {}
    this.$expr = new WeakMap()
    this.$init = false
  }

  //
  // Public API
  //
  effect = watchStack

  addRef(key: string, ref: Element) {
    Object.assign(this.$refs, { [key]: ref })
  }

  extend(ctx: ContextAny) {
    Object.assign(this.$refs, ctx.$refs)

    if (ctx.$data)
      Object.assign(this.$data, ctx.$data)
  }
}

export type ContextAny = Context<Element, object>
