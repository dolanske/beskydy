import type { ReactiveEffectRunner, UnwrapNestedRefs } from '@vue/reactivity'
import { effect as rawEffect, reactive } from '@vue/reactivity'
import type { Beskydy } from './scope'

export type ContextAny = Context<Element, Beskydy, object>

/**
 * Piece of DOM which holds its own state.
 */

export class Context<R extends Element, A extends Beskydy, T extends object> {
  // Store the context root element
  root: Element
  // Reactive dataset available to the entire scope
  data: UnwrapNestedRefs<T & { $refs: Record<string, Element> }>
  init: boolean
  // Hold all context runners for disposal
  effects: ReactiveEffectRunner[] = []

  // Stores a referene to the root app instance
  app: Beskydy

  constructor(root: R, app: A, initialDataset?: T) {
    this.root = root
    this.data = reactive(Object.assign({ $refs: {} }, app.rootState, initialDataset))
    this.init = false
    this.app = app
  }

  // Watch effects
  // effect = rawEffect
  effect(fn: () => any) {
    const handler = rawEffect(fn)
    this.effects.push(handler)
  }

  // Store refs for access within scope
  addRef(key: string, ref: Element) {
    Object.assign(this.data.$refs, { [key]: ref })
  }

  // When creating sub contexts, this allows for a parent context to
  // share its reactive properties with the child context
  extend(ctx: ContextAny) {
    Object.assign(this.data, ctx.data)
  }

  teardown() {
    // Iterate over all children of a ctx and remove any beskydy functionality
    this.effects.forEach(e => e.effect.stop())
    this.effects.length = 0

    // Clone whole subtree and re-attach it to the parent. This removes any event listeners
    const clone = this.root.cloneNode(true)
    this.root.parentElement?.replaceChild(clone, this.root)

    // Overwrite context dataset with an empty object
    Reflect.set(this, 'data', Object.create(null))

    this.init = false
  }
}
