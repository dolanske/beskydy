import type { ReactiveEffectRunner, UnwrapNestedRefs } from '@vue/reactivity'
import { effect, reactive } from '@vue/reactivity'

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

type EffectFn = () => void

/**
 * Piece of DOM which holds its own state.
 */

export class Context<R extends Element, T extends object> {
  // Store the context root element
  $root: Element
  // Reactive dataset available to the entire scope
  $data: UnwrapNestedRefs<T>
  // Store all scope expressions for an element
  $expr: WeakMap<Element, Map<string, string>>
  // All the scope refs, which are accessible even if accessor is a child of the ref
  $refs: Record<string, Element>
  $init: boolean

  __effects: Set<EffectFn> = new Set()

  constructor(root: R, initialDataset?: T) {
    this.$root = root
    this.$data = reactive<T>(Object.assign({}, initialDataset))
    this.$refs = {}
    this.$expr = new WeakMap()
    this.$init = false

    effect(() => {
      console.log(this.$data)
    })
  }

  //
  // Public API
  //
  effect(fn: EffectFn) {
    const _fn: ReactiveEffectRunner = effect(fn, {
      // scheduler: () => queueJob(_fn)
    })
    this.__effects.add(_fn)

    return () => this.__effects.delete(_fn)
  }

  addRef(key: string, ref: Element) {
    Object.assign(this.$refs, { [key]: ref })
  }

  addExpr(node: Element, name: string, value: string) {
    const exists = this.$expr.get(node)

    if (exists) {
      exists.set(name, value)
      this.$expr.set(node, exists)
    }
    else {
      this.$expr.set(node, new Map([[name, value]]))
    }
  }

  extend(ctx: ContextAny) {
    Object.assign(this.$refs, ctx.$refs)

    if (ctx.$data)
      Object.assign(this.$data, ctx.$data)
  }
}

export type ContextAny = Context<Element, object>
