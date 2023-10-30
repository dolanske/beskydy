import type { ReactiveEffectRunner, UnwrapNestedRefs } from '@vue/reactivity'
import { effect as rawEffect, reactive } from '@vue/reactivity'
import { globalState } from './scope'

// let queued = false
// const queue: Function[] = []
// const p = Promise.resolve()

// export const nextTick = (fn: () => void) => p.then(fn)

// export const queueJob = (job: Function) => {
//   if (!queue.includes(job)) queue.push(job)
//   if (!queued) {
//     queued = true
//     nextTick(flushJobs)
//   }
// }

// const flushJobs = () => {
//   for (const job of queue) {
//     job()
//   }
//   queue.length = 0
//   queued = false
// }

export type ContextAny = Context<Element, object>

/**
 * Piece of DOM which holds its own state.
 */

export type ContextData =
  // Global state available to every scope
  typeof globalState
  // All the scope refs, which are accessible even if accessor is a child of the ref
  & { $refs: Record<string, Element> }

export class Context<R extends Element, T extends object> {
  // Store the context root element
  root: Element
  // Reactive dataset available to the entire scope
  data: UnwrapNestedRefs<T & ContextData>
  init: boolean
  // Hold all context runners for disposal
  effects: ReactiveEffectRunner[] = []

  constructor(root: R, initialDataset?: T) {
    this.root = root
    this.data = reactive<T & ContextData>(Object.assign({ $refs: {} }, globalState, initialDataset))
    this.init = false
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
