import { stack, watchStack } from '../v1/reactivity/stack'
import type { EffectValue } from '../v1/reactivity/types'

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

type Unsubscribe = () => void

export class Context<R extends Element, T extends object> {
  __effects: Set<EffectValue<T>>
  // Store the context root element
  $root: Element
  // Reactive dataset available to the entire scope
  $scope: T
  // Store all scope expressions for an element
  $expr: WeakMap<Element, { attr: string; expt: string }>
  // All the scope refs, which are accessible even if accessor is a child of the ref
  $refs: Record<string, Element>

  constructor(root: R, defaultScope: T) {
    this.__effects = new Set()
    this.$root = root
    this.$scope = stack<T>(defaultScope)
    this.$refs = {}
    this.$expr = new WeakMap()

    watchStack(() => {
      console.log(this.$scope)
      for (const fn of this.__effects)
        fn(this.$scope)
    })
  }

  effect(fn: EffectValue<T>): Unsubscribe {
    this.__effects.add(fn)
    return () => this.__effects.delete(fn)
  }

  // extend(ctx: Context) {
  //   if (ctx.$scope)
  //     Object.assign(this.$scope, ctx.$scope)
  // }
}
